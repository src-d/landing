package services

import (
	"encoding/base64"
	"encoding/json"
	"time"

	sendgrid "github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
	"github.com/src-d/landing/api/config"
	"gop.kg/src-d/domain@v6/models"
)

type DataMailer interface {
	Send(address string, person *models.Person) error
}

type dataMailer struct {
	conf *config.MailerData
}

func NewDataMailer(cnf *config.Config) DataMailer {
	return &dataMailer{
		conf: cnf.Mailer,
	}
}

func (m *dataMailer) buildMessage(address string, person *models.Person) (*mail.SGMailV3, error) {
	from := mail.NewEmail(m.conf.Sender.Name, m.conf.Sender.Address)
	to := mail.NewEmail(person.Personal.DefaultFullName, address)
	content := mail.NewContent("text/plain", m.conf.Text)
	msg := mail.NewV3MailInit(from, "Your data at source{d}", to, content)

	attachment := mail.NewAttachment()
	data, err := json.MarshalIndent(NewPerson(person), "", "\t")
	if err != nil {
		return nil, err
	}

	attachment.SetType("application/json")
	attachment.SetFilename("user_data.json")
	attachment.SetContent(base64.StdEncoding.EncodeToString(data))

	return msg.AddAttachment(attachment), nil
}

const (
	SendEndpoint   = "/v3/mail/send"
	SendGridAPIURL = "https://api.sendgrid.com"
)

func (m *dataMailer) Send(address string, person *models.Person) error {
	msg, err := m.buildMessage(address, person)
	if err != nil {
		return err
	}

	request := sendgrid.GetRequest(m.conf.SendGridAPIKey, SendEndpoint, SendGridAPIURL)
	request.Method = "POST"
	request.Body = mail.GetRequestBody(msg)
	_, err = sendgrid.API(request)
	return err
}

type Language struct {
	IsRelevant  bool
	Percentile  float64
	Bytes       float64
	AgedBytes   float64
	IsAuxiliary bool
	FirstUsedAt time.Time
	LastUsedAt  time.Time
}

type Ecosystem Language

type Skills struct {
	Ecosystems map[string]Ecosystem `bson:",omitempty"`
	Languages  map[string]Language  `bson:",omitempty"`
}

type Person struct {
	*models.Person
	Skills Skills
}

func NewPerson(p *models.Person) *Person {
	pers := &Person{
		p,
		Skills{
			make(map[string]Ecosystem),
			make(map[string]Language),
		},
	}

	for n, e := range p.Skills.Ecosystems {
		pers.Skills.Ecosystems[n] = Ecosystem{
			e.IsRelevant,
			e.Percentile,
			e.Bytes,
			e.AgedBytes,
			e.IsAuxiliary,
			e.FirstUsedAt,
			e.LastUsedAt,
		}
	}

	for n, l := range p.Skills.Languages {
		pers.Skills.Languages[n] = Language{
			l.IsRelevant,
			l.Percentile,
			l.Bytes,
			l.AgedBytes,
			l.IsAuxiliary,
			l.FirstUsedAt,
			l.LastUsedAt,
		}
	}

	return pers
}
