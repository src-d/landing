package handlers

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/src-d/landing/api/services"
	"gop.kg/src-d/domain@v6/models"
	"gopkg.in/gin-gonic/gin.v1"
)

type UserData struct {
	store  *models.PersonStore
	mailer services.DataMailer
}

const (
	ErrInvalidEmail      = "The given email is not valid."
	ErrInternalError     = "An unexpected error occurred."
	ErrEmailDoesNotExist = "The given email does not exist in our database."
)

type UserDataResponse struct {
	Message string `json:"message,omitempty"`
	Error   bool   `json:"error"`
}

func NewErrorResponse(msg string) *UserDataResponse {
	return &UserDataResponse{msg, true}
}

func NewUserData(mailer services.DataMailer, store *models.PersonStore) *UserData {
	return &UserData{store, mailer}
}

func (h *UserData) Handle(c *gin.Context) {
	email, err := govalidator.NormalizeEmail(c.Param("email"))
	if err != nil {
		c.Error(err)
		c.JSON(http.StatusBadRequest, NewErrorResponse(ErrInvalidEmail))
		return
	}

	person, err := h.store.FindOne(h.store.Query().FindByEmail(email))
	if err == models.ErrNotFound {
		c.JSON(http.StatusNotFound, NewErrorResponse(ErrEmailDoesNotExist))
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, NewErrorResponse(ErrInternalError))
		return
	}

	if err := h.mailer.Send(email, person); err != nil {
		c.JSON(http.StatusInternalServerError, NewErrorResponse(ErrInternalError))
		return
	}

	c.JSON(http.StatusOK, new(UserDataResponse))
}
