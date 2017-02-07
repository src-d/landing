package handlers

import (
	"log"
	"net/http"

	"github.com/src-d/landing/api/services"
	"gopkg.in/gin-gonic/gin.v1"
)

type Posts struct {
	provider services.PostProvider
}

func NewPosts(provider services.PostProvider) *Posts {
	return &Posts{provider}
}

const postsCacheKey = "posts"

func (p *Posts) Get(c *gin.Context) {
	kind := c.Param("kind")

	if kind != "culture" && kind != "technical" {
		abort(c, http.StatusNotFound, nil)
		return
	}

	// TODO: provider should not return the view, just the data
	// the data should be assembled in the handler.
	resp, err := p.provider.Find(kind)
	if err != nil {
		if v, ok := services.Cache.Get(postsCacheKey); ok {
			log.Printf("error getting posts: %s", err)
			json(c, http.StatusOK, v.(*services.PostsResponse))
		} else {
			abort(c, http.StatusInternalServerError, err)
		}
		return
	}

	services.Cache.Set(postsCacheKey, resp)
	json(c, http.StatusOK, resp)
}
