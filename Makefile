# Config
HUGO_VERSION := 0.14
HUGO_BINARY = hugo_$(HUGO_VERSION)_linux_amd64

hugo:
	@wget https://github.com/spf13/hugo/releases/download/v$(HUGO_VERSION)/$(HUGO_BINARY).tar.gz; \
	tar xfv $(HUGO_BINARY).tar.gz -C /bin; \
	mv /bin/$(HUGO_BINARY)/$(HUGO_BINARY) /bin/hugo; \

build:
	hugo --disableRSS=true;
