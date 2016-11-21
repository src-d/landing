package github

import "github.com/google/go-github/github"

type Repository struct {
	URL         string
	Stars       int
	Forks       int
	Lang        string
	Name        string
	FullName    string
	Description string
}

func convertRepositories(repos ...*github.Repository) (result []*Repository) {
	for _, r := range repos {
		if r == nil {
			continue
		}

		result = append(result, &Repository{
			URL:         maybeStr(r.HTMLURL),
			Stars:       maybeInt(r.StargazersCount),
			Forks:       maybeInt(r.ForksCount),
			Name:        maybeStr(r.Name),
			FullName:    maybeStr(r.FullName),
			Lang:        maybeStr(r.Language),
			Description: maybeStr(r.Description),
		})
	}

	return
}

type RepoProvider interface {
	ByOwner(owner string, allowed []string) ([]*Repository, error)
	ByOwnerAndName(owner, repo string) (*Repository, error)
}

type repoProvider struct {
	fetcher RepoFetcher
}

func NewRepoProvider(f RepoFetcher) RepoProvider {
	return &repoProvider{
		fetcher: f,
	}
}

func (g *repoProvider) ByOwnerAndName(owner, repo string) (*Repository, error) {
	r, _, err := g.fetcher.Get(owner, repo)
	if err != nil {
		return nil, err
	}

	repos := convertRepositories(r)
	if len(repos) == 0 {
		return nil, nil
	}
	return repos[0], nil
}

const pageSize = 45

func (g *repoProvider) ByOwner(owner string, allowed []string) ([]*Repository, error) {
	var result []*Repository
	opts := github.RepositoryListOptions{
		ListOptions: github.ListOptions{PerPage: pageSize},
	}

	for {
		repos, resp, err := g.fetcher.List(owner, &opts)
		if err != nil {
			return nil, err
		}

		if len(allowed) > 0 {
			result = append(result, convertRepositories(filterRepos(repos, allowed)...)...)
		} else {
			result = append(result, convertRepositories(repos...)...)
		}

		if resp.NextPage == 0 || len(allowed) == len(result) {
			break
		}

		opts.ListOptions.Page = resp.NextPage
	}

	return result, nil
}

func filterRepos(repos []*github.Repository, allowed []string) (result []*github.Repository) {
	for _, r := range repos {
		if contains(allowed, *r.Name) {
			result = append(result, r)
		}
	}
	return
}

func contains(haystack []string, needle string) bool {
	for _, e := range haystack {
		if needle == e {
			return true
		}
	}
	return false
}

func maybeStr(str *string) string {
	if str != nil {
		return *str
	}
	return ""
}

func maybeInt(n *int) int {
	if n != nil {
		return *n
	}
	return 0
}
