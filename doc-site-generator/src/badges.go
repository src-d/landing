package main

import (
	"fmt"
	"regexp"
)

type badgeFilter func(Badge) bool

func badgeRegexpStr() string {
	imgMarkdownRegexpStr := `!\[(?P<name>[^\]]+)\]\((?P<img>[^\)]+)\)`
	linkMarkdownRegexpStr := `\[%s\]\((?P<url>[^\)]+)\)`
	return fmt.Sprintf(linkMarkdownRegexpStr, imgMarkdownRegexpStr)
}

var badgeRegExp = regexp.MustCompile(badgeRegexpStr())

var badgeFilters = []badgeFilter{
	isDocumentation,
	isCoverage,
	isRelease,
	isCI,
}

func getAllBadges(input string) []Badge {
	badgeMatches := badgeRegExp.FindAllStringSubmatch(input, -1)
	var badges []Badge
	for _, match := range badgeMatches {
		badge := Badge{match[1], match[2], match[3]}
		if isValidBadge(badge) {
			badges = append(badges, badge)
		}
	}

	return badges
}

func isValidBadge(badge Badge) bool {
	for _, badgeFilter := range badgeFilters {
		if badgeFilter(badge) {
			return true
		}
	}

	return false
}

func isDocumentation(badge Badge) bool {
	return badge.Name == "GoDoc"
}

func isCI(badge Badge) bool {
	return badge.Name == "Build Status"
}

func isCoverage(badge Badge) bool {
	return badge.Name == "codecov" || badge.Name == "codecov.io"
}

func isRelease(badge Badge) bool {
	return badge.Name == "PyPI"
}
