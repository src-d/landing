package services

import (
	"encoding/json"
	"net/http"

	"github.com/src-d/landing/api/config"
)

const summaryMaxLength = 200

type PositionsProvider interface {
	Find() (*PositionsResponse, error)
}

func NewPositionsProvider(conf *config.Config) PositionsProvider {
	return &positionsProvider{conf.PositionsBaseURL}
}

type positionsProvider struct {
	positionsBaseURL string
}

type Position struct {
	Title       string `json:"title"`
	ID          string `json:"id"`
	URL         string `json:"url"`
	Team        string `json:"team"`
	Location    string `json:"location"`
	Commitment  string `json:"commitment"`
	Description string `json:"description"`
	Summary     string `json:"summary"`
}

type PositionsResponse struct {
	Teams     []string    `json:"teams"`
	Positions []*Position `json:"positions"`
}

type leverResponse []leverPosition

type leverPosition struct {
	ApplyURL         string          `json:"applyUrl"`
	Categories       leverCategories `json:"categories"`
	Description      string          `json:"description"`
	DescriptionPlain string          `json:"descriptionPlain"`
	HostedURL        string          `json:"hostedUrl"`
	ID               string          `json:"id"`
	Text             string          `json:"text"`
}

type leverCategories struct {
	Team       string `json:"team"`
	Location   string `json:"location"`
	Commitment string `json:"commitment"`
}

func (p *positionsProvider) Find() (*PositionsResponse, error) {
	resp, err := http.Get(p.positionsBaseURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var leverResp leverResponse
	if err := json.NewDecoder(resp.Body).Decode(&leverResp); err != nil {
		return nil, err
	}

	return toPositionsResponse(leverResp), nil
}

func toPositionsResponse(input leverResponse) *PositionsResponse {
	output := &PositionsResponse{}
	teams := make(map[string]struct{})

	for _, leverPosition := range input {
		team := leverPosition.Categories.Team
		if team != "" {
			teams[team] = struct{}{}
		}

		output.Positions = append(output.Positions, &Position{
			Title:       leverPosition.Text,
			ID:          leverPosition.ID,
			URL:         leverPosition.HostedURL,
			Team:        leverPosition.Categories.Team,
			Location:    leverPosition.Categories.Location,
			Commitment:  leverPosition.Categories.Commitment,
			Description: leverPosition.Description,
			Summary:     getSummary(leverPosition.Description, summaryMaxLength),
		})
	}

	output.Teams = getKeys(teams)
	return output
}

func getKeys(keyMap map[string]struct{}) []string {
	keys := []string{}
	for key := range keyMap {
		keys = append(keys, key)
	}

	return keys
}

func getSummary(text string, maxLength int) string {
	if len(text) <= maxLength {
		return text
	}

	return text[:maxLength] + "..."
}
