# Config
PROJECT = landing
COMMANDS = api
CODECOV_TOKEN ?= 
DOCKERFILES ?=

HUGO_VERSION := 0.21
HUGO_BINARY = hugo_$(HUGO_VERSION)_linux_amd64

DOCKER_REGISTRY ?= quay.io
DOCKER_USERNAME ?=
DOCKER_PASSWORD ?=

# Including devops Makefile
MAKEFILE = Makefile.main
DEVOPS_REPOSITORY ?= 
DEVOPS_FOLDER = .devops
CI_FOLDER = .ci

$(MAKEFILE):
	@git clone --quiet $(DEVOPS_REPOSITORY) $(DEVOPS_FOLDER); \
	cp -r $(DEVOPS_FOLDER)/ci .ci; \
	rm -rf $(DEVOPS_FOLDER); \
	cp $(CI_FOLDER)/$(MAKEFILE) .;

-include $(MAKEFILE)

# System
URL_OS = 64bit
OS = amd64
ifeq ($(OS),Windows_NT)
    ARCH = windows
    URL_ARCH = Windows
else
    UNAME_S := $(shell uname -s)
    ifeq ($(UNAME_S),Linux)
			ARCH = linux
			URL_ARCH = Linux
    endif
    ifeq ($(UNAME_S),Darwin)
			ARCH = darwin
			URL_ARCH = MacOS
    endif
endif

# CI
TAG := master
ifneq ($(origin TRAVIS_TAG), undefined)
ifneq ($(TRAVIS_TAG),)
	TAG := $(TRAVIS_TAG)
endif
endif

# Environment
BASE_PATH := $(shell pwd)
HUGO_PATH := $(BASE_PATH)/.hugo
HUGO_URL = github.com/spf13/hugo
HUGO_NAME := hugo
HUGO_URL_NAME := hugo_$(HUGO_VERSION)_$(URL_ARCH)-$(URL_OS)

# Tools
CURL = curl -L
HUGO = $(HUGO_PATH)/$(HUGO_NAME)
MKDIR = mkdir -p
GIT = git
DOCKER = docker
NPM = npm
CGO_ENABLED=0

export CGO_ENABLED

## Lists all recipes
list:
	@grep '^##' Makefile -A 1

# Updates hugo dependencies
hugo-dependencies:
	@if [[ ! -f $(HUGO) ]]; then \
		$(MKDIR) $(HUGO_PATH); \
		cd $(HUGO_PATH); \
		ext="zip"; \
		if [ "$(ARCH)" == "linux" ]; then ext="tar.gz"; fi; \
		file="hugo.$${ext}"; \
		$(CURL) https://$(HUGO_URL)/releases/download/v$(HUGO_VERSION)/$(HUGO_URL_NAME).$${ext} -o $${file}; \
		if [ "$(ARCH)" == "linux" ]; then tar -xvzf $${file}; else unzip $${file}; fi; \
	fi;

# Prepares npm
npm-dependencies:
	$(NPM) install
	$(NPM) run build

## Builds hugo project 
hugo-build: npm-dependencies hugo-dependencies
	$(HUGO) --config=hugo.config.yaml --destination=public

# Runs hugo server
hugo-server:
	$(HUGO) server --config=hugo.config.yaml --destination=public --port=8181 --watch --buildDrafts

## Cleans and run a new hugo server with webpack watcher enabled
landing-local-serve: hugo-clean npm-dependencies hugo-dependencies
	$(NPM) run serve

# Deletes the hugo folder
hugo-clean:
	rm -rf $(HUGO_PATH)

# Exports the common parts of the landing
export-landing-commons:
	@if [[ -z "$(target)" ]]; then \
		echo "**error 'target' is undefined. STOP"; \
		exit 1; \
	fi;
	tar -cf $(target) src/js/behaviours/menu.js src/sass/shared static/img/logos static/fonts hugo/data/footer.yml hugo/layouts/partials/footer_links.html hugo/layouts/partials/footer.html hugo/layouts/partials/head.html hugo/layouts/partials/header.html hugo.config.yaml
