package main

import (
	"flag"
	"net/http"
	"os"
	"time"

	"github.com/src-d/landing/api/config"
	"github.com/src-d/landing/api/handlers"
	"github.com/src-d/landing/api/services"

	"github.com/erizocosmico/gin-cache"
	"github.com/erizocosmico/gin-cache/persistence"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gopkg.in/inconshreveable/log15.v2"
)

var (
	ttl = flag.Duration("ttl", 1*time.Hour, "ttl of the cache")
)

func main() {
	flag.Parse()
	conf, err := config.Load()
	checkErr(err)

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowAllOrigins: true,
		AllowHeaders:    []string{"Content-Type"},
		AllowMethods:    []string{"GET", "POST"},
	}))

	store := persistence.NewInMemoryStore(*ttl)

	r.GET("/", handlers.Head(200))

	api := r.Group("/api")
	{
		api.GET("/posts/:kind", cache.CachePage(
			store,
			*ttl,
			handlers.NewPosts(services.NewPostProvider(conf)).Get,
		))
		api.GET("/positions", cache.CachePage(
			store,
			*ttl,
			handlers.NewPositions(services.NewPositionsProvider(conf)).Get,
		))
	}

	r.NoRoute(func(c *gin.Context) {
		c.AbortWithStatus(http.StatusNotFound)
	})

	checkErr(r.Run(conf.Addr))
}

func checkErr(err error) {
	if err != nil {
		log15.Crit(err.Error())
		os.Exit(1)
	}
}
