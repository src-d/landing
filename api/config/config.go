package config

import (
	"github.com/src-d/envconfig"
	defaults "gopkg.in/mcuadros/go-defaults.v1"
)

type Config struct {
	Addr             string `envconfig:"addr" default:":8080"`
	PositionsBaseURL string `envconfig:"positions_base_url" default:"https://api.lever.co/v0/postings/sourced?mode=json"`
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
