package handlers

import (
	"log"
	"net/http"

	"github.com/src-d/landing/api/services"

	"github.com/gin-gonic/gin"
)

type Posts struct {
	provider services.PostProvider
}

func NewPosts(provider services.PostProvider) *Posts {
	return &Posts{provider}
}

func (p *Posts) Get(c *gin.Context) {
	kind := c.Param("kind")

	// TODO: provider should not return the view, just the data
	// the data should be assembled in the handler.
	resp, err := p.provider.Find(kind)
	if err != nil {
		if v, ok := services.Cache.Get(kind); ok {
			log.Printf("error getting posts: %s", err)
			json(c, http.StatusOK, v.(*services.PostsResponse))
		} else {
			abort(c, http.StatusNotFound, err)
		}
		return
	}

	services.Cache.Set(kind, resp)
	json(c, http.StatusOK, resp)
}
