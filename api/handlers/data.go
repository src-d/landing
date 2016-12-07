package handlers

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	recaptcha "github.com/dpapathanasiou/go-recaptcha"
	"github.com/src-d/landing/api/services"
	"gop.kg/src-d/domain@v6/models"
	"gopkg.in/gin-gonic/gin.v1"
)

type CaptchaVerifier func(ip string, response string) bool

type UserData struct {
	store         *models.PersonStore
	mailer        services.DataMailer
	verifyCaptcha CaptchaVerifier
}

const (
	ErrInvalidEmail      = "The given email is not valid."
	ErrInternalError     = "An unexpected error occurred."
	ErrEmailDoesNotExist = "The given email does not exist in our database."
	ErrInvalidRequest    = "The received request is not valid."
	ErrInvalidCaptcha    = "The entered CAPTCHA is not valid."
)

type UserDataRequest struct {
	Email   string `json:"email" binding:"required,email"`
	Captcha string `json:"captcha" binding:"required"`
}

type UserDataResponse struct {
	Message string `json:"message,omitempty"`
	Error   bool   `json:"error"`
}

func NewErrorResponse(msg string) *UserDataResponse {
	return &UserDataResponse{msg, true}
}

func NewUserData(mailer services.DataMailer, store *models.PersonStore) *UserData {
	return &UserData{
		store,
		mailer,
		recaptcha.Confirm,
	}
}

func (h *UserData) Handle(c *gin.Context) {
	var req UserDataRequest
	if err := c.BindJSON(&req); err != nil {
		c.Error(err)
		json(c, http.StatusBadRequest, NewErrorResponse(ErrInvalidRequest))
		return
	}

	email, err := govalidator.NormalizeEmail(req.Email)
	if err != nil {
		c.Error(err)
		json(c, http.StatusBadRequest, NewErrorResponse(ErrInvalidEmail))
		return
	}

	if !h.confirmCaptcha(c.Request, req) {
		json(c, http.StatusBadRequest, NewErrorResponse(ErrInvalidCaptcha))
		return
	}

	person, err := h.store.FindOne(h.store.Query().FindByEmail(email))
	if err == models.ErrNotFound {
		json(c, http.StatusNotFound, NewErrorResponse(ErrEmailDoesNotExist))
		return
	} else if err != nil {
		json(c, http.StatusInternalServerError, NewErrorResponse(ErrInternalError))
		return
	}

	if err := h.mailer.Send(email, person); err != nil {
		json(c, http.StatusInternalServerError, NewErrorResponse(ErrInternalError))
		return
	}

	json(c, http.StatusOK, new(UserDataResponse))
}

func (h *UserData) confirmCaptcha(r *http.Request, data UserDataRequest) bool {
	ip := r.Header.Get("X-Forwarded-For")
	if ip == "" {
		ip = r.RemoteAddr
	}

	return h.verifyCaptcha(ip, data.Captcha)
}
