package handlers

import (
	"log"
	"net/http"

	"github.com/src-d/landing/api/config"
	"github.com/src-d/landing/api/github"
	"github.com/src-d/landing/api/services"

	"github.com/gin-gonic/gin"
)

type Repositories interface {
	Main(ctx *gin.Context)
	Other(ctx *gin.Context)
}

type repositories struct {
	main     []config.AllowedRepos
	other    []config.AllowedRepos
	provider github.RepoProvider
}

func NewRepositories(
	conf *config.Config,
	provider github.RepoProvider,
) Repositories {
	return &repositories{
		main:     conf.PinnedRepos.Main,
		other:    conf.PinnedRepos.Other,
		provider: provider,
	}
}

const (
	mainReposCacheKey  = "main-repos"
	otherReposCacheKey = "other-repos"
)

type ReposResponse struct {
	Repos []*github.Repository
}

func (h *repositories) Main(ctx *gin.Context) {
	var result []*github.Repository
	for _, a := range h.main {
		repos, err := h.provider.ByOwner(a.Owner, a.Repos)
		if err != nil {
			if v, ok := services.Cache.Get(mainReposCacheKey); ok {
				log.Printf("error getting main repos: %s", err)
				json(ctx, http.StatusOK, &ReposResponse{
					Repos: v.([]*github.Repository),
				})
			} else {
				abort(ctx, http.StatusInternalServerError, err)
			}
			return
		}

		result = append(result, repos...)
	}

	services.Cache.Set(mainReposCacheKey, result)
	json(ctx, http.StatusOK, &ReposResponse{Repos: result})
}

func (h *repositories) Other(ctx *gin.Context) {
	var result []*github.Repository
	for _, a := range h.other {
		for _, name := range a.Repos {
			repo, err := h.provider.ByOwnerAndName(a.Owner, name)
			if err != nil {
				if v, ok := services.Cache.Get(otherReposCacheKey); ok {
					log.Printf("error getting main repos: %s", err)
					json(ctx, http.StatusOK, &ReposResponse{
						Repos: v.([]*github.Repository),
					})
				} else {
					abort(ctx, http.StatusInternalServerError, err)
				}
				return
			}

			result = append(result, repo)
		}
	}

	services.Cache.Set(otherReposCacheKey, result)
	json(ctx, http.StatusOK, &ReposResponse{Repos: result})
}
