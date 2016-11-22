package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/src-d/landing/api/config"
	"github.com/src-d/landing/api/github"
	"github.com/src-d/landing/api/mock"
	"github.com/stretchr/testify/suite"
	"gopkg.in/gin-gonic/gin.v1"
)

type RepositoriesSuite struct {
	suite.Suite
	r     *gin.Engine
	repos Repositories
}

func TestRepositories(t *testing.T) {
	suite.Run(t, new(RepositoriesSuite))
}

func (s *RepositoriesSuite) SetupTest() {
	gin.SetMode(gin.TestMode)
	mock := mock.NewRepoFetcherMock(mock.MockedReposData)
	conf := new(config.Config)
	conf.PinnedRepos.Main = []config.AllowedRepos{
		{
			Owner: "devPinned1",
			Repos: []string{"d1", "pinned11", "d3"},
		},
	}
	conf.PinnedRepos.Other = []config.AllowedRepos{
		{
			Owner: "devPinned2",
			Repos: []string{"d1", "pinned21", "pinned22"},
		},
		{
			Owner: "devPinned3",
			Repos: []string{"pinned31"},
		},
	}
	s.repos = NewRepositories(conf, github.NewRepoProvider(mock))
}

func (s *RepositoriesSuite) TestMain() {
	s.assertRepos(s.repos.Main, "d1", "pinned11", "d3")
}

func (s *RepositoriesSuite) TestOther() {
	s.assertRepos(s.repos.Other, "d1", "pinned21", "pinned22", "pinned31")
}

func (s *RepositoriesSuite) assertRepos(fn gin.HandlerFunc, expected ...string) {
	r := gin.New()
	r.GET("/", fn)

	req, err := http.NewRequest("GET", "http://localhost:3000/", nil)
	s.Nil(err)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	s.Equal(http.StatusOK, w.Code)
	var resp ReposResponse
	s.Nil(json.Unmarshal(w.Body.Bytes(), &resp))
	s.Equal(len(expected), len(resp.Repos), "invalid len")
	var names []string
	for _, r := range resp.Repos {
		names = append(names, r.Name)
	}
	s.Equal(expected, names)
}
