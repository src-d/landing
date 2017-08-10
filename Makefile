# Config
PROJECT := landing
COMMANDS := api
CODECOV_TOKEN ?=
DESTINATION ?= public
PORT ?= 8181
DOCKERFILES = Dockerfile:landing Dockerfile.api:landing-api Dockerfile.slackin:landing-slackin

HUGO_VERSION := 0.21
OS := Linux
HUGO_TAR_FILE_NAME = hugo_$(HUGO_VERSION)_$(OS)-64bit.tar.gz
HUGO_URL = https://github.com/spf13/hugo/releases/download/v$(HUGO_VERSION)/$(HUGO_TAR_FILE_NAME)

# Including devops Makefile
MAKEFILE := Makefile.main
CI_REPOSITORY := https://github.com/src-d/ci.git
CI_FOLDER := .ci

$(MAKEFILE):
	@git clone --quiet $(CI_REPOSITORY) $(CI_FOLDER); \
	cp $(CI_FOLDER)/$(MAKEFILE) .;

-include $(MAKEFILE)

# CI
TAG := master
ifneq ($(origin TRAVIS_TAG), undefined)
ifneq ($(TRAVIS_TAG),)
	TAG := $(TRAVIS_TAG)
endif
endif

# Environment
UNAME_S := $(shell uname -s)
BASE_PATH := $(shell pwd)
HUGO_PATH := $(BASE_PATH)/.hugo
HUGO_NAME := hugo
WORKDIR := $(PWD)
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
REMOVE := rm -rf
PACK := tar -cf
UNPACK := tar -xf
COMPRESS := tar -zcf
UNCOMPRESS := tar -zxf

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
	$(HUGO) --config=hugo.config.yaml --destination=$(DESTINATION)

# Runs hugo server
hugo-server:
	$(HUGO) server --config=hugo.config.yaml --destination=public --port=$(PORT) --watch --buildDrafts

# Exports the common parts of the landing
exportable_files := "Makefile package.json yarn.lock webpack.config.js .babelrc src/js/services/api.js src/js/components/SlackForm.js src/sass/shared static/img/logos static/img/icons static/fonts hugo/data/footer.yml hugo/data/slack.yml hugo/data/projects.yml hugo/layouts/partials/svg hugo/layouts/partials/footer hugo/layouts/partials/footer.html hugo/layouts/partials/contact-us.html hugo/layouts/partials/head.html hugo/layouts/partials/header.html hugo.config.yaml .gitignore"
file_list_name ?= .filelist
bundle_file_name := $(target)/landing-common.tar
export-landing-commons:
	@if [[ -z "$(target)" ]]; then \
		echo "**error 'target' is undefined. STOP"; \
		exit 1; \
	fi;
	@echo $(exportable_files) | sed -e "s/ /\n/g" > $(file_list_name)
	@tar_command="$(PACK) $(bundle_file_name) "$(exportable_files)" $(file_list_name)"; \
		`$$tar_command`;
	$(REMOVE) $(file_list_name)
	$(UNPACK) $(bundle_file_name) --directory $(target)
	$(REMOVE) $(bundle_file_name)

# Packages the landing artifact in the build directory
package-hugo-generated:
	$(COMPRESS) $(BUILD_PATH)/$(LANDING_ARTIFACT) public
