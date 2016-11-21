package main

import (
	"flag"
	"net/http"
	"os"
	"time"

	"github.com/src-d/landing/api/config"
	"github.com/src-d/landing/api/github"
	"github.com/src-d/landing/api/handlers"

	"github.com/dpordomingo/go-gingonic-cache/persistence"
	"github.com/gin-gonic/contrib/cache"
	"github.com/gin-gonic/gin"
	"github.com/tommy351/gin-cors"
	"gopkg.in/inconshreveable/log15.v2"
)

var (
	configFile = flag.String("config", "", "config file path")
	ttl        = flag.Int("ttl", 3600, "ttl of the cache")
)

func main() {
	flag.Parse()
	conf, err := config.Load(*configFile)
	checkErr(err)

	provider := github.NewRepoProvider(
		github.NewRepoFetcher(conf.GithubToken),
	)

	r := gin.Default()
	r.Use(cors.Middleware(cors.Options{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{"Content-Type"},
		AllowMethods: []string{"GET"},
	}))

	cacheTTL := time.Duration(*ttl)
	repositories := handlers.NewRepositories(conf, provider)
	store := persistence.NewInMemoryStore(cacheTTL)
	r.GET("/repositories/main", cache.CachePage(store, cacheTTL, repositories.Main))
	r.GET("/repositories/other", cache.CachePage(store, cacheTTL, repositories.Other))
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
