# Config
HUGO_VERSION := 0.14
HUGO_BINARY = hugo_$(HUGO_VERSION)_linux_amd64
# Package configuration
PROJECT = api
COMMANDS = api
CODECOV_TOKEN = c3fba21a-5c15-4e6a-994e-ed0238303be3
DOCKERFILES ?= Dockerfile.api:landing-api

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

hugo:
	@wget https://github.com/spf13/hugo/releases/download/v$(HUGO_VERSION)/$(HUGO_BINARY).tar.gz; \
	tar xfv $(HUGO_BINARY).tar.gz -C /bin; \
	mv /bin/$(HUGO_BINARY)/$(HUGO_BINARY) /bin/hugo; \

buildhugo:
	hugo --disableRSS=true;
