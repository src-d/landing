package config

import (
	"io/ioutil"

	yaml "gopkg.in/yaml.v1"
)

type Config struct {
	Addr        string `yaml:"addr"`
	GithubToken string `yaml:"github-token"`
	FeedBaseURL string `yaml:"feed-base-url"`
	PinnedRepos struct {
		Main  []AllowedRepos `yaml:"main"`
		Other []AllowedRepos `yaml:"other"`
	} `yaml:"repos"`
}

type AllowedRepos struct {
	Owner string   `yaml:"owner"`
	Repos []string `yaml:"repos"`
}

func Load(file string) (*Config, error) {
	data, err := ioutil.ReadFile(file)
	if err != nil {
		return nil, err
	}

	var config Config
	if err := yaml.Unmarshal(data, &config); err != nil {
		return nil, err
	}

	return &config, nil
}
