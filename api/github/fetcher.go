package github

import (
	"context"

	"github.com/google/go-github/github"
	"golang.org/x/oauth2"
)

func NewRepoFetcher(token string) RepoFetcher {
	source := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: token})
	oauthClient := oauth2.NewClient(oauth2.NoContext, source)
	return github.NewClient(oauthClient).Repositories
}

type RepoFetcher interface {
	List(ctx context.Context, owner string, opts *github.RepositoryListOptions) ([]*github.Repository, *github.Response, error)
	Get(ctx context.Context, owner, repo string) (*github.Repository, *github.Response, error)
}
