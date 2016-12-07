package handlers

import (
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

func (p *Posts) Get(c *gin.Context) {
	kind := c.Param("kind")

	if kind != "culture" && kind != "technical" {
		abort(c, http.StatusNotFound, nil)
		return
	}

	resp, err := p.provider.Find(kind)
	if err != nil {
		abort(c, http.StatusInternalServerError, err)
		return
	}

	json(c, http.StatusOK, resp)
}
