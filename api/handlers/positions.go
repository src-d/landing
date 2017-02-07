package handlers

import (
	"log"
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

const positionsCacheKey = "positions"

func (p *Positions) Get(c *gin.Context) {
	// TODO: provider should not return the view, just the data
	// the data should be assembled in the handler.
	positions, err := p.provider.Find()
	if err != nil {
		if v, ok := services.Cache.Get(positionsCacheKey); ok {
			log.Printf("error getting positions: %s", err)
			json(c, http.StatusOK, v.(*services.PositionsResponse))
		} else {
			abort(c, http.StatusInternalServerError, err)
		}
		return
	}

	services.Cache.Set(positionsCacheKey, positions)
	json(c, http.StatusOK, positions)
}
