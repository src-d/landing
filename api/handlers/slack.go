package handlers

import (
	"bytes"
	encode "encoding/json"
	"io"
	"net/http"

	"github.com/src-d/landing/api/config"

	"github.com/gin-gonic/gin"
)

type inviteReq struct {
	Email string `json:"email"`
}

type slackinRequest struct {
	Coc     int    `json:"coc"`
	Channel string `json:"channel,omitempty"`
	Email   string `json:"email"`
}

func SlackInvite(conf *config.Config) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var req inviteReq
		if err := ctx.BindJSON(&req); err != nil {
			abort(ctx, http.StatusBadRequest, err)
			return
		}

		data, err := encode.Marshal(slackinRequest{
			Coc:     0,
			Channel: conf.SlackChannel,
			Email:   req.Email,
		})
		if err != nil {
			abort(ctx, http.StatusInternalServerError, err)
			return
		}

		resp, err := http.Post(conf.SlackinURL, "application/json", bytes.NewBuffer(data))
		if err != nil {
			abort(ctx, http.StatusInternalServerError, err)
			return
		}
		defer resp.Body.Close()

		if _, err := io.Copy(ctx.Writer, resp.Body); err != nil {
			abort(ctx, http.StatusInternalServerError, err)
			return
		}

		ctx.Writer.WriteHeader(resp.StatusCode)
	}
}
