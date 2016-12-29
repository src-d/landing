package handlers

import (
	"net/http"

	"github.com/src-d/landing/api/services"
	"gopkg.in/gin-gonic/gin.v1"
)

type Positions struct {
	provider services.PositionsProvider
}

func NewPositions(provider services.PositionsProvider) *Positions {
	return &Positions{provider}
}

func (p *Positions) Get(c *gin.Context) {
	positions, err := p.provider.Find()
	if err != nil {
		abort(c, http.StatusInternalServerError, err)
		return
	}

	json(c, http.StatusOK, positions)
}
