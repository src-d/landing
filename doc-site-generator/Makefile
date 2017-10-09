# Default shell
SHELL := /bin/bash

# provided by ci.docs
HOST_NAME ?=
BASE_URL ?=
VERSION ?=
OUTPUT ?=
SOURCES ?=

# config
landing ?= $(shell pwd)
boilerplate := $(landing)/../landing.boilerplate
project_yml_generator := go run $(landing)/doc-site-generator/src/*.go
src_assets := $(landing)/doc-site-generator/assets
src_categories_yml := $(landing)/hugo/data/categories.yml
src_project_tpl := $(src_assets)/templates/project.yml.tpl
src_landing_hugo := $(src_assets)/site
output_raw := $(OUTPUT)/hugo/content/raw
output_yml := $(OUTPUT)/hugo/data/project.yml

ifdef SOURCES
  output_tmp = $(SOURCES)/.doc-site-sources-$(VERSION)
else
  output_tmp = $(boilerplate)/.doc-site-sources
endif

define create-ancestors
	$(MKDIR) $(1)
	$(REMOVE) $(1)
endef

define reset-directory
	$(REMOVE) $(1)
	$(MKDIR) $(1)
endef

# Creates a landing-like project into the OUTPUT directory
prepare-landing-like: copy-landing copy-assets landing-clean

# Copies the current landing into a cleaned OUTPUT directory
copy-landing:
ifndef OUTPUT
	$(error "error 'OUTPUT' can not be null.")
endif
	$(call create-ancestors, $(OUTPUT))
	$(COPY) $(landing) $(OUTPUT)

# Copies documentation assets into the OUTPUT directory
copy-assets:
	$(COPY) $(src_landing_hugo)/* $(OUTPUT);

# Cleans files from Landing
sections_to_clean := home careers manifesto projects team temporal upcoming
landing-clean:
	@for section in $(sections_to_clean) ;\
	do \
		$(REMOVE) $(OUTPUT)/hugo/content/$${section}.md; \
		$(REMOVE) $(OUTPUT)/hugo/layouts/partials/$${section}; \
		$(REMOVE) $(OUTPUT)/hugo/layouts/$${section}; \
		$(REMOVE) $(OUTPUT)/hugo/data/$${section}; \
		$(REMOVE) $(OUTPUT)/hugo/data/$${section}.yml; \
	done;

# Imports documentation from an external project
import-documentation:
ifdef SOURCES
	$(COPY) $(SOURCES)/README.md $(output_raw)

	$(COPY) $(SOURCES)/LICENSE $(output_raw)

	@if [[ -d $(SOURCES)/_tutorials ]]; then \
		$(COPY) $(SOURCES)/_tutorials/* $(output_raw)/documentation/tutorials/; \
	fi;

	@if [[ -d $(SOURCES)/_examples ]]; then \
		$(COPY) $(SOURCES)/_examples/* $(output_raw)/documentation/examples/; \
	fi;

	$(project_yml_generator) -tpl=$(src_project_tpl) -readme=$(SOURCES)/README.md -categories=$(src_categories_yml) > $(output_yml)

	$(REMOVE) $(OUTPUT)/doc-site-generator;
endif

# Creates a landing-like boilerplate with compiled dependencies
$(boilerplate):
	$(MAKE) -C $(landing) prepare-landing-like OUTPUT=$(boilerplate)
	$(MAKE) -C $(boilerplate) project-dependencies
	$(REMOVE) \
		$(boilerplate)/package.json \
		$(boilerplate)/webpack.config.js \
		$(boilerplate)/src \
		$(boilerplate)/node_modules;

# Generates a documentation site from a boilerplate
documentation-site-create: $(boilerplate)
	$(MAKE) -C $(boilerplate) copy-landing OUTPUT=$(output_tmp)
	$(MAKE) -C $(output_tmp) import-documentation OUTPUT=$(output_tmp)
	$(MAKE) -C $(output_tmp) hugo-build DESTINATION=$(output_tmp)/public
	$(call reset-directory, $(OUTPUT))
	$(MOVE) $(output_tmp)/public/* $(OUTPUT)
	$(REMOVE) $(output_tmp)

## Generates and serves a documentation site
documentation-site-serve: documentation-site-create
	@cd $(OUTPUT); \
	caddy -port $(PORT);

## Cleans the boilerplate directory
boilerplate-clean:
	$(REMOVE) $(boilerplate)

# ----------

# Develop. vars
dev_output_project_yml := $(landing)/hugo/data/project.yml
dev_src_raw := $(src_assets)/examples/hugo/content/raw
dev_output_raw := $(landing)/hugo/content/raw
dev_src_doc:=$(src_assets)/site/hugo/content
dev_output_doc := $(landing)/hugo/content/documentation

## Develop. Prepares the current Landing to look like a documentation site
develop-documentation:
	$(MKDIR) $(dev_output_doc)
	$(COPY) $(dev_src_raw) $(dev_output_raw)
	$(COPY) $(dev_src_doc)/*.md $(dev_output_doc)
	$(project_yml_generator) -tpl=$(src_project_tpl) -readme=$(SOURCES)/README.md -categories=$(src_categories_yml) > $(dev_output_project_yml)

	$(MAKE) -C $(landing) serve-without-api;

## Develop. Remove all stuff created to look like a documentation site
develop-documentation-destroy:
	$(REMOVE) $(dev_output_raw)
	$(REMOVE) $(dev_output_doc)
	$(REMOVE) $(dev_output_project_yml)
