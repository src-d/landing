# Config
PROJECT = landing
COMMANDS = api
CODECOV_TOKEN = c3fba21a-5c15-4e6a-994e-ed0238303be3
DOCKERFILES ?=

HUGO_VERSION := 0.17
HUGO_BINARY = hugo_$(HUGO_VERSION)_linux_amd64

DOCKER_REGISTRY ?= quay.io
DOCKER_USERNAME ?=
DOCKER_PASSWORD ?=

# Including devops Makefile
MAKEFILE = Makefile.main
DEVOPS_REPOSITORY = https://github.com/src-d/devops.git
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
HUGO_NAME := hugo_$(HUGO_VERSION)_$(ARCH)_$(OS)
HUGO_URL_NAME := hugo_$(HUGO_VERSION)_$(URL_ARCH)-$(URL_OS)

# Tools
CURL = curl -L
HUGO = $(HUGO_PATH)/$(HUGO_NAME)/$(HUGO_NAME)
MKDIR = mkdir -p
GIT = git
DOCKER = sudo docker
NPM = npm
CGO_ENABLED=0

export CGO_ENABLED

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
	@if [[ ! -f $(NPM) ]]; then \
		curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -; \
		sudo apt-get install -y nodejs; \
	fi;

hugo-build: hugo-dependencies
	$(NPM) install
	$(NPM) run build
	$(HUGO) --disableRSS=true --config=hugo.config.yaml

hugo-server: hugo-build
	$(HUGO) server -D -w --config=hugo.config.yaml


hugo-docker-push: hugo-build
	echo $(DOCKER) login -u "$(DOCKER_USERNAME)" -p "$(DOCKER_PASSWORD)" $(DOCKER_REGISTRY)
	$(DOCKER) build -q -t $(DOCKER_ORG)/${PROJECT} -f $(BASE_PATH)/Dockerfile .
	$(DOCKER) tag $(DOCKER_ORG)/${PROJECT} $(DOCKER_ORG)/${PROJECT}:$(TAG)
	echo $(DOCKER) push $(DOCKER_ORG)/${PROJECT}:$(TAG)

hugo-clean:
	rm -rf $(HUGO_PATH)
