package main

import (
	"flag"
	"net/http"
	"os"
	"time"

	"github.com/src-d/landing/api/config"
	"github.com/src-d/landing/api/github"
	"github.com/src-d/landing/api/handlers"
	"github.com/src-d/landing/api/services"

	"github.com/erizocosmico/gin-cache"
	"github.com/erizocosmico/gin-cache/persistence"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gopkg.in/inconshreveable/log15.v2"
)

var (
	configFile = flag.String("config", "", "config file path")
	ttl        = flag.Duration("ttl", 1*time.Hour, "ttl of the cache")
)

func main() {
	flag.Parse()
	conf, err := config.Load(*configFile)
	checkErr(err)

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowAllOrigins: true,
		AllowHeaders:    []string{"Content-Type"},
		AllowMethods:    []string{"GET", "POST"},
	}))

	provider := github.NewRepoProvider(github.NewRepoFetcher(conf.GithubToken))
	repositories := handlers.NewRepositories(conf, provider)
	store := persistence.NewInMemoryStore(*ttl)

	r.GET("/repositories/main", cache.CachePage(store, *ttl, repositories.Main))
	r.GET("/repositories/other", cache.CachePage(store, *ttl, repositories.Other))
	r.GET("/posts/:kind", cache.CachePage(
		store,
		*ttl,
		handlers.NewPosts(services.NewPostProvider(conf)).Get,
	))
	r.GET("/positions", cache.CachePage(
		store,
		*ttl,
		handlers.NewPositions(services.NewPositionsProvider(conf)).Get,
	))
	r.POST("/invite", handlers.SlackInvite(conf))

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
