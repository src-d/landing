# Config
PROJECT = landing
COMMANDS = api
CODECOV_TOKEN ?=
DESTINATION ?= public
DOCKERFILES = Dockerfile:landing Dockerfile.api:landing-api

HUGO_VERSION := 0.21
HUGO_BINARY = hugo_$(HUGO_VERSION)_linux_amd64

# Including devops Makefile
MAKEFILE = Makefile.main
CI_REPOSITORY = https://github.com/src-d/ci.git
CI_FOLDER = .ci

$(MAKEFILE):
	@git clone --quiet $(CI_REPOSITORY) $(CI_FOLDER); \
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
			URL_ARCH = macOS
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
WORKDIR := $(PWD)
BUILD_PATH := $(WORKDIR)/build
LANDING_ARTIFACT := landing_$(TAG).tar.gz

# Tools
CURL = curl -L
HUGO = $(HUGO_PATH)/$(HUGO_NAME)
MKDIR = mkdir -p
GIT = git
YARN = yarn
CGO_ENABLED=0
REMOVE = rm -rf
COMPRESS = tar -cf
TAR = tar -zcvf

export CGO_ENABLED

## Lists all recipes
list:
	@grep '^##' Makefile -A 1

# Updates hugo dependencies
hugo-dependencies:
	@if [[ ! -f $(HUGO) ]]; then \
		$(MKDIR) $(HUGO_PATH); \
		cd $(HUGO_PATH); \
		ext="tar.gz"; \
		if [ "$(ARCH)" == "windows" ]; then ext="zip"; fi; \
		file="hugo.$${ext}"; \
		$(CURL) https://$(HUGO_URL)/releases/download/v$(HUGO_VERSION)/$(HUGO_URL_NAME).$${ext} -o $${file}; \
		if [ "$(ARCH)" == "windows" ]; then unzip $${file}; else tar -xvzf $${file}; fi; \
	fi;

# Prepares yarn
js-dependencies:
	$(YARN) install
	$(YARN) run build

## Builds hugo project
hugo-build: js-dependencies hugo-dependencies
	$(HUGO) --config=hugo.config.yaml --destination=$(DESTINATION)

# Runs hugo server
hugo-server:
	$(HUGO) server --config=hugo.config.yaml --destination=public --port=8181 --watch --buildDrafts

## Cleans and run a new hugo server with webpack watcher enabled
serve: hugo-clean js-dependencies hugo-dependencies
	$(YARN) run serve

# Deletes the hugo folder
hugo-clean:
	$(REMOVE) $(HUGO_PATH)

# Exports the common parts of the landing
exportable_files = "src/js/behaviours/menu.js src/sass/shared static/img/logos static/fonts hugo/data/footer.yml hugo/layouts/partials/footer_links.html hugo/layouts/partials/footer.html hugo/layouts/partials/head.html hugo/layouts/partials/header.html hugo.config.yaml"
file_list_name ?= .filelist
export-landing-commons:
	@if [[ -z "$(target)" ]]; then \
		echo "**error 'target' is undefined. STOP"; \
		exit 1; \
	fi;
	@echo $(exportable_files) | sed -e "s/ /\n/g" > $(file_list_name)
	@tar_command="$(COMPRESS) $(target) "$(exportable_files)" $(file_list_name)"; \
		`$$tar_command`;
	$(REMOVE) $(file_list_name)

# Packages the landing artifact in the build directory
package-hugo-generated:
	$(TAR) $(BUILD_PATH)/$(LANDING_ARTIFACT) public
