package main

import (
	"flag"
	"net/http"
	"os"
	"time"

	"gop.kg/src-d/domain@v6/container"

	"github.com/src-d/landing/api/config"
	"github.com/src-d/landing/api/github"
	"github.com/src-d/landing/api/handlers"
	"github.com/src-d/landing/api/services"

	"github.com/dpordomingo/go-gingonic-cache"
	"github.com/dpordomingo/go-gingonic-cache/persistence"
	"gopkg.in/gin-contrib/cors.v1"
	"gopkg.in/gin-gonic/gin.v1"
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
	r.Use(cors.New(cors.Config{
		AllowAllOrigins: true,
		AllowHeaders:    []string{"Content-Type"},
		AllowMethods:    []string{"GET"},
	}))

	cacheTTL := time.Duration(*ttl)
	repositories := handlers.NewRepositories(conf, provider)
	store := persistence.NewInMemoryStore(cacheTTL)
	r.GET("/repositories/main", cache.CachePage(store, cacheTTL, repositories.Main))
	r.GET("/repositories/other", cache.CachePage(store, cacheTTL, repositories.Other))
	r.NoRoute(func(c *gin.Context) {
		c.AbortWithStatus(http.StatusNotFound)
	})

	mailer := services.NewDataMailer(conf)
	userData := handlers.NewUserData(mailer, container.GetDomainModelsPersonStore())
	r.POST("/data/:email", userData.Handle)

	checkErr(r.Run(conf.Addr))
}

func checkErr(err error) {
	if err != nil {
		log15.Crit(err.Error())
		os.Exit(1)
	}
}
