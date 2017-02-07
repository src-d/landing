package services

import "sync"

type cache struct {
	sync.RWMutex
	data map[string]interface{}
}

func (c *cache) Get(key string) (interface{}, bool) {
	c.Lock()
	defer c.Unlock()
	v, ok := c.data[key]
	return v, ok
}

func (c *cache) Set(key string, v interface{}) {
	c.Lock()
	defer c.Unlock()
	c.data[key] = v
}

var Cache = &cache{data: make(map[string]interface{})}
