package main

import "fmt"

func hello() string {
	return "hello"
}

func world() string {
	return "world"
}

func main() {
	fmt.Println(hello(), world())
}
