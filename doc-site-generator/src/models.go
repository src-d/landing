package main

type Categories struct {
	Categories struct {
		Contents map[string]Category
	}
}

type Category struct {
	Name     string
	Projects []Project
}

type Project struct {
	Category   string // retrieval
	Name       string // go-git
	Repository string // src-d/go-git
	URL        string // http://go-git.sourced.tech
	Hostname   string `envconfig:"HOST_NAME"` // go-git.sourced.tech
	BaseURL    string `envconfig:"BASE_URL"`  // go-git.sourced.tech:8080/v2
	Version    string `envconfig:"VERSION"`   // v2
	Languages  []string
	Logo       string
	Logosmall  string
	CodePill   int
	Desc       string
	Badges     []Badge
}

type Badge struct {
	Name  string
	Image string
	URL   string
}
