package mock

import (
	"math"

	"github.com/google/go-github/github"
)

// MockedReposData stores valid input data for RepoFetcherMock
var MockedReposData = map[string][]string{
	"devPinned1": []string{"d1", "pinned11", "pinned12", "d3", "pinned13", "pinned14.sometimes", "d5"},
	"devPinned2": []string{"pinned21", "d1", "pinned22"},
	"devPinned3": []string{"d1", "pinned31"},
	"devNoRepos": []string{},
	"devSeven":   []string{"d1", "d2", "d3", "d4", "d5", "d6", "d7"},
}

// RepoFetcherMock is a RepoFetcher mock that implements RepoFetcher
type RepoFetcherMock struct {
	data  map[string][]string
	stats map[string]int
}

func NewRepoFetcherMock(data map[string][]string) *RepoFetcherMock {
	return &RepoFetcherMock{data, make(map[string]int)}
}

// Stats returns the number of times that it was called the List method for certain owner
func (r *RepoFetcherMock) Stats(owner string) int {
	return r.stats[owner]
}

// Reset initializes the Stats of the RepoFetcherMock
func (r *RepoFetcherMock) Reset() {
	r.stats = make(map[string]int)
}

func (r *RepoFetcherMock) Get(owner, repo string) (*github.Repository, *github.Response, error) {
	for _, repoName := range r.data[owner] {
		if repoName == repo {
			return &github.Repository{Owner: &github.User{Name: &owner}, Name: &repo}, &github.Response{}, nil
		}
	}

	return nil, nil, nil
}

func (r *RepoFetcherMock) List(owner string, opts *github.RepositoryListOptions) ([]*github.Repository, *github.Response, error) {
	r.stats[owner]++
	repos := r.data[owner]
	lastPage := int(math.Ceil(float64(len(repos) / opts.PerPage)))
	starting := opts.Page * opts.PerPage
	ending := starting + opts.PerPage
	if ending > len(repos) {
		ending = len(repos)
	}

	nextPage := opts.Page + 1
	if nextPage > lastPage {
		nextPage = 0
	}

	repositories := GetMockedRepos(owner, repos[starting:ending])
	return repositories, &github.Response{NextPage: nextPage}, nil
}

// GetMockedRepos returns MockedRepos for the passed owner and repository names
func GetMockedRepos(owner string, names []string) (repos []*github.Repository) {
	for _, name := range names {
		repoName := name
		repos = append(repos, &github.Repository{Owner: &github.User{Name: &owner}, Name: &repoName})
	}

	return repos
}
