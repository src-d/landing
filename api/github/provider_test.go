package github

import (
	"testing"

	"github.com/src-d/landing/api/mock"

	"github.com/google/go-github/github"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
)

type ProviderSuite struct {
	suite.Suite
	fetcher  RepoFetcher
	provider RepoProvider
}

func (s *ProviderSuite) SetupSuite() {
	s.fetcher = mock.NewRepoFetcherMock(mock.MockedReposData)
	s.provider = NewRepoProvider(s.fetcher)
}

func (s *ProviderSuite) SetupTest() {
	s.fetcher.(*mock.RepoFetcherMock).Reset()
}

func TestHandler(t *testing.T) {
	suite.Run(t, new(ProviderSuite))
}

func (s *ProviderSuite) assertRepos(repos []*Repository, expected ...string) {
	s.Equal(len(expected), len(repos), "invalid repo size")
	for i, r := range repos {
		s.Equal(expected[i], r.Name)
	}
}

func (s *ProviderSuite) TestGetOwnerReposTillAllElementsFound() {
	repos, err := s.provider.ByOwner("devPinned1", []string{"pinned11", "pinned12", "pinned13", "pinned14.sometimes"})
	s.NoError(err)
	s.assertRepos(repos, "pinned11", "pinned12", "pinned13", "pinned14.sometimes")
}

func (s *ProviderSuite) TestGetOwnerReposButDoNotFindOne() {
	repos, err := s.provider.ByOwner("devPinned1", []string{"pinned11", "pinned12", "pinned13", "unknown"})
	s.Nil(err)
	s.assertRepos(repos, "pinned11", "pinned12", "pinned13")
}

func (s *ProviderSuite) TestGetOwnerReposButHeHasNothing() {
	repos, err := s.provider.ByOwner("devNoRepos", []string{"whatever"})
	s.Nil(err)
	s.Equal(0, len(repos))
}

func (s *ProviderSuite) TestGetOwnerReposButHeDoesNotExist() {
	repos, err := s.provider.ByOwner("unexistent", []string{"whatever"})
	s.Nil(err)
	s.Equal(0, len(repos))
}

func (s *ProviderSuite) TestOwnerRepoByName() {
	repo1, err := s.provider.ByOwnerAndName("devPinned1", "pinned11")
	s.NoError(err)
	s.Equal("pinned11", repo1.Name)

	repo2, err := s.provider.ByOwnerAndName("devPinned1", "UNKNOWN")
	s.NoError(err)
	s.Nil(repo2)
}

func TestConvertRepositories(t *testing.T) {
	repos := []*github.Repository{
		&github.Repository{
			ID:   memInt(3),
			Name: memStr("name"),
		},
		&github.Repository{
			ID:   memInt(33),
			Name: memStr("namename"),
		},
	}
	expected := []*Repository{
		&Repository{
			Name: "name",
		},
		&Repository{
			Name: "namename",
		},
	}

	require.Equal(t, expected, convertRepositories(repos...))
}

func memStr(s string) *string {
	return &s
}

func memInt(s int) *int {
	return &s
}
