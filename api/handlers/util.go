package handlers

import "github.com/gin-gonic/gin"

// FIXME: gin won't pass the status with JSON to the cache writer: https://gopkg.in/gin-gonic/gin.v1/pull/625
func status(c *gin.Context, status int) {
	c.Writer.WriteHeader(status)
	c.Writer.WriteHeaderNow()
}

func json(c *gin.Context, code int, resp interface{}) {
	status(c, code)
	c.JSON(code, resp)
}

func abort(c *gin.Context, code int, err error) {
	status(c, code)
	if err != nil {
		c.String(code, err.Error())
		c.AbortWithError(code, err)
	} else {
		c.AbortWithStatus(code)
	}
}
