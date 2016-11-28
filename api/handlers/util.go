package handlers

import "gopkg.in/gin-gonic/gin.v1"

func status(c *gin.Context, status int) {
	c.Writer.WriteHeader(status)
	c.Writer.WriteHeaderNow()
}
