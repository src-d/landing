package main

import (
	"flag"
	"fmt"
	"html/template"
	"io/ioutil"
	"math/rand"
	"os"
	"time"

	"github.com/src-d/envconfig"
	"gopkg.in/yaml.v1"
)

const (
	otherCategory           = "other"
	availableCodePillsCount = 10
)

var (
	tplPath    = flag.String("tpl", "", "path to the project tpl used to generate project.yml")
	catPath    = flag.String("categories", "", "path to the categories.yml containing the project categories and the repo description")
	readmePath = flag.String("readme", "", "path to the readme file containing the badges")
)

func main() {
	flag.Parse()
	projectInfo := getProjectData()
	renderProjectData(projectInfo)
}

func getProjectData() Project {
	var projectEnv Project
	err := envconfig.Process("", &projectEnv)
	if err != nil {
		panic(fmt.Sprintf("could not assign values from environment : %s", err))
	}

	project, categoryIndex := findProjectAndCategoryIndex(projectEnv)

	project.BaseURL = projectEnv.BaseURL
	project.Version = projectEnv.Version
	project.Category = categoryIndex
	project.Logosmall = getLogosmall(project)
	project.CodePill = getCodePillIndex()
	project.Badges = getBadges()

	return project
}

func renderProjectData(data Project) {
	templateString, err := readFile(*tplPath)
	if err != nil {
		panic(fmt.Sprintf("project template could not be read: %s", err))
	}

	template := template.Must(template.New("project").Parse(templateString))
	if err := template.Execute(os.Stdout, data); err != nil {
		panic(fmt.Sprintf("error parsing template: %s", err))
	}
}

func getBadges() []Badge {
	readmeContent, err := readFile(*readmePath)
	if err != nil {
		panic(fmt.Sprintf("readme could not be read: %s", err))
	}

	return getAllBadges(readmeContent)
}

func getLandingCategories() Categories {
	categoriesString, err := readFile(*catPath)
	if err != nil {
		panic(fmt.Sprintf("landing categories.yml could not be found: %s", err))
	}

	categories := Categories{}
	if err := yaml.Unmarshal([]byte(categoriesString), &categories); err != nil {
		panic(fmt.Sprintf("landing categories could not be parsed: %s", err))
	}

	return categories
}

func findProjectAndCategoryIndex(projectEnv Project) (Project, string) {
	categories := getLandingCategories()
	for categoryIndex, category := range categories.Categories.Contents {
		for _, project := range category.Projects {
			if project.Hostname == projectEnv.Hostname {
				return project, categoryIndex
			}
		}
	}

	return Project{}, otherCategory
}

func readFile(filePath string) (string, error) {
	content, err := ioutil.ReadFile(filePath)
	if err != nil {
		return "", fmt.Errorf("File could not be read: %s %s", filePath, err)
	}

	return string(content), nil
}

func getCodePillIndex() int {
	random := rand.New(rand.NewSource(time.Now().UnixNano()))
	return random.Intn(availableCodePillsCount-1) + 1
}

func getLogosmall(project Project) string {
	if project.Logosmall != "" {
		return project.Logosmall
	}

	return project.Logo
}
