package services

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/src-d/landing/api/config"
)

type PostProvider interface {
	Find(typ string) (*PostsResponse, error)
}

func NewPostProvider(conf *config.Config) PostProvider {
	return &postProvider{conf.FeedBaseURL}
}

type postProvider struct {
	feedBaseURL string
}

type Post struct {
	Title        string `json:"title"`
	Description  string `json:"description"`
	Date         string `json:"date"`
	Link         string `json:"link"`
	Author       string `json:"author"`
	AuthorAvatar string `json:"author_avatar"`
	Image        string `json:"featured_image"`
}

type PostsResponse struct {
	Posts []*Post `json:"Posts"`
}

func (p *postProvider) Find(typ string) (*PostsResponse, error) {
	resp, err := http.Get(fmt.Sprintf("%s%s", p.feedBaseURL, typ))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var posts PostsResponse
	if err := json.NewDecoder(resp.Body).Decode(&posts); err != nil {
		return nil, err
	}

	return &posts, nil
}
