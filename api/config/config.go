package config

import (
	"github.com/src-d/envconfig"
	defaults "gopkg.in/mcuadros/go-defaults.v1"
)

type Config struct {
	Addr             string `envconfig:"addr" default:":8080"`
	FeedBaseURL      string `envconfig:"feed_base_url" default:"http://blog.sourced.tech/json/"`
	PositionsBaseURL string `envconfig:"positions_base_url" default:"https://api.lever.co/v0/postings/sourced?mode=json"`
	SlackChannel     string `envconfig:"slack_channel" default:""`
	SlackinURL       string `envconfig:"slackin_url" default:"http://slackin:3000/invite"`
}

func Load() (*Config, error) {
	var c Config
	err := envconfig.Process("", &c)
	if err != nil {
		return nil, err
	}

	defaults.SetDefaults(&c)

	return &c, err
}
