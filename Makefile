# Default shell
SHELL := /bin/bash

# Config
PROJECT := landing
COMMANDS := api
CODECOV_TOKEN ?=
DESTINATION ?= public
LANDING_URL ?= //sourced.tech
PORT ?= 80
DOCKERFILES = Dockerfile:landing Dockerfile.api:landing-api Dockerfile.slackin:landing-slackin

HUGO_VERSION := 0.21
OS := Linux
HUGO_TAR_FILE_NAME = hugo_$(HUGO_VERSION)_$(OS)-64bit.tar.gz
HUGO_URL = https://github.com/spf13/hugo/releases/download/v$(HUGO_VERSION)/$(HUGO_TAR_FILE_NAME)

# CI: do not edit this
CI_REPOSITORY = https://github.com/src-d/ci.git
SHARED_PATH ?= $(shell pwd)
CI_PATH ?= $(SHARED_PATH)/.ci
MAKEFILE_MAIN := $(CI_PATH)/Makefile.main
$(MAKEFILE_MAIN):
	git clone --quiet --depth 1 $(CI_REPOSITORY) $(CI_PATH);
-include $(MAKEFILE_MAIN)

# CI
TAG := master
ifneq ($(origin TRAVIS_TAG), undefined)
ifneq ($(TRAVIS_TAG),)
	TAG := $(TRAVIS_TAG)
endif
endif

# Environment
UNAME_S := $(shell uname -s)
HUGO_PATH := $(SHARED_PATH)/.hugo
HUGO_NAME := hugo
WORKDIR := $(shell pwd)
BUILD_PATH := $(WORKDIR)/build
LANDING_ARTIFACT := landing_$(TAG).tar.gz

# System
ifneq ($(UNAME_S),Linux)
ifeq ($(UNAME_S),Darwin)
OS := macOS
else
$(error "error Unexpected OS; Only Linux or Darwin supported.")
endif
endif

# Tools
CURL := curl -L
HUGO := $(HUGO_PATH)/$(HUGO_NAME)
MKDIR := mkdir -p
GIT := git
JS_PACKAGE_MANAGER := yarn
CGO_ENABLED := 0
MOVE := mv -f
REMOVE := rm -rf
COMPRESS := tar -zcf
UNCOMPRESS := tar -zxf
COPY := cp -R

export CGO_ENABLED

## Lists all recipes
list:
	@grep '^##' Makefile -A 1

# Updates hugo dependencies
hugo-dependencies:
	@if [[ ! -f $(HUGO) ]]; then \
		$(MKDIR) $(HUGO_PATH); \
		cd $(HUGO_PATH); \
		echo "Downloading $(HUGO_URL)"; \
		$(CURL) $(HUGO_URL) -o $(HUGO_TAR_FILE_NAME); \
		$(UNCOMPRESS) $(HUGO_TAR_FILE_NAME); \
	fi;

# Prepares yarn
js-dependencies:
	$(JS_PACKAGE_MANAGER) install --force
	$(JS_PACKAGE_MANAGER) run build

## Builds project
build: project-dependencies hugo-build

## Serves the project and the API with Hugo and Webpack watchers
serve: hugo-clean project-dependencies
	$(JS_PACKAGE_MANAGER) run serve

# Serves the project with Hugo and Webpack watchers
serve-without-api: hugo-clean project-dependencies
	$(JS_PACKAGE_MANAGER) run serve-without-api

# Prepares project dependencies
project-dependencies: hugo-dependencies js-dependencies

# Deletes the hugo folder
hugo-clean:
	$(REMOVE) $(HUGO_PATH)

# Builds hugo
hugo-build:
	$(HUGO) --config=hugo.config.yaml --destination=$(DESTINATION) --baseURL=$(LANDING_URL)

# Runs hugo server
hugo-server:
	$(HUGO) server --config=hugo.config.yaml --destination=public --port=$(PORT) --baseURL=$(LANDING_URL) --watch --buildDrafts

# Packages the landing artifact in the build directory
package-hugo-generated:
	$(COMPRESS) $(BUILD_PATH)/$(LANDING_ARTIFACT) public
