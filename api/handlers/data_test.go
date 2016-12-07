package handlers

import (
	"bytes"
	. "encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"gop.kg/src-d/domain@v6/models"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/asaskevich/govalidator"
	"github.com/stretchr/testify/require"
	"gopkg.in/gin-gonic/gin.v1"
)

func mockVerifier(ip string, code string) bool {
	return ip == "ok" && code == "ok"
}

func TestUserData(t *testing.T) {
	require := require.New(t)

	sess, err := mgo.Dial(":27017")
	require.Nil(err)
	db := sess.DB(bson.NewObjectId().Hex())
	personStore := models.NewPersonCollectionStore(db).New("foo").Store(db)
	p := personStore.New()
	p.Email.Add("does.exist@gmail.com", time.Time{}, time.Time{}, 0)
	p.Personal.DefaultFullName = "foo"
	require.Nil(personStore.Insert(p))

	p = personStore.New()
	p.Email.Add("exists.butfails@gmail.com", time.Time{}, time.Time{}, 0)
	p.Personal.DefaultFullName = "bar"
	require.Nil(personStore.Insert(p))

	defer func() {
		require.Nil(db.DropDatabase())
		sess.Close()
	}()

	cases := []struct {
		email   string
		captcha string
		ip      string
		code    int
		error   bool
		msg     string
	}{
		{"notanemail", "", "", http.StatusBadRequest, true, ErrInvalidRequest},
		{"notexists@gmail.com", "", "ok", http.StatusBadRequest, true, ErrInvalidRequest},
		{"notexists@gmail.com", "ok", "ok", http.StatusNotFound, true, ErrEmailDoesNotExist},
		{"notexists@gmail.com", "foo", "ok", http.StatusBadRequest, true, ErrInvalidCaptcha},
		{"notexists@gmail.com", "foo", "foo", http.StatusBadRequest, true, ErrInvalidCaptcha},
		{"notexists@gmail.com", "ok", "foo", http.StatusBadRequest, true, ErrInvalidCaptcha},
		{"doesexist@gmail.com", "ok", "ok", http.StatusOK, false, ""},
		{"does.exist@gmail.com", "ok", "ok", http.StatusOK, false, ""},
		{"exists.butfails@gmail.com", "ok", "ok", http.StatusInternalServerError, true, ErrInternalError},
	}

	gin.SetMode(gin.TestMode)
	mock := new(mailerMock)
	data := NewUserData(mock, personStore)
	data.verifyCaptcha = mockVerifier
	r := gin.New()
	r.POST("/", data.Handle)

	for _, c := range cases {
		data, err := Marshal(&UserDataRequest{
			Email:   c.email,
			Captcha: c.captcha,
		})
		require.Nil(err, c.email)
		req, err := http.NewRequest("POST", "http://localhost:3000/", bytes.NewBuffer(data))
		req.RemoteAddr = c.ip
		req.Header.Set("X-Forwarded-For", c.ip)
		require.Nil(err, c.email)

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		require.Equal(c.code, w.Code, c.email)
		var resp UserDataResponse
		require.Nil(Unmarshal(w.Body.Bytes(), &resp), c.email)
		require.Equal(UserDataResponse{c.msg, c.error}, resp, c.email)

		if !c.error {
			email, _ := govalidator.NormalizeEmail(c.email)
			require.True(mock.lastSentIs(email), c.email)
		}
	}
}

type mailerMock struct {
	mails []string
}

func (m *mailerMock) Send(address string, _ *models.Person) error {
	if address == "existsbutfails@gmail.com" {
		return errors.New("err")
	}
	m.mails = append(m.mails, address)
	return nil
}

func (m *mailerMock) lastSentIs(addr string) bool {
	if len(m.mails) == 0 {
		return false
	}
	return m.mails[len(m.mails)-1] == addr
}
