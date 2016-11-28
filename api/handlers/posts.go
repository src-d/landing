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
		status(c, http.StatusNotFound)
		return
	}

	resp, err := p.provider.Find(kind)
	if err != nil {
		status(c, http.StatusInternalServerError)
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	status(c, http.StatusOK)
	c.JSON(http.StatusOK, resp)
}
