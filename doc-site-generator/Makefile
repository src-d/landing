# Assign any value in case you want to commit every step of the generation
WITH_COMMIT ?=

# provided by ci.docs
export HOST_NAME ?=
export BASE_URL ?=
export VERSION ?=
OUTPUT ?=
SOURCES ?=

# config
landing := $(shell pwd)
project_yml_generator := $(landing)/doc-site-generator/src/*.go
src_assets := $(landing)/doc-site-generator/assets
src_categories_yml := $(landing)/hugo/data/categories.yml
src_project_tpl := $(src_assets)/templates/project.yml.tpl
src_landing_hugo := $(src_assets)/site
output_raw := $(OUTPUT)/hugo/content/raw
output_yml := $(OUTPUT)/hugo/data/project.yml

# functions
define git-init =
	$(REMOVE) $(OUTPUT)/.git; \
	if [ -n "$(WITH_COMMIT)" ]; then \
		cd $(OUTPUT); \
		git init; \
	fi;
endef
define git-commit =
	if [ -n "$(WITH_COMMIT)" ]; then \
		cd $(OUTPUT); \
		git add -A; \
		git commit -m $(1); \
	fi;
endef


## Generate documentation site
generate-documentation-site: copy-landing clean-landing import-documentation

# Creates a new landing-like project based in the current one
copy-landing: prepare-output
	$(COPY) $(landing) $(OUTPUT)
	$(git-init)
	$(call git-commit,"Create Landing copy")

# Deletes target if already existent
prepare-output:
ifndef OUTPUT
	$(error "error 'OUTPUT' can not be null.")
endif
	$(MKDIR) $(OUTPUT)
	$(REMOVE) $(OUTPUT)

# Clean files from Landing
sections_to_clean := home careers manifesto projects stack team temporal upcoming
clean-landing:
	@for section in $(sections_to_clean) ;\
	do \
		$(REMOVE) $(OUTPUT)/hugo/content/$${section}.md; \
		$(REMOVE) $(OUTPUT)/hugo/layouts/partials/$${section}; \
		$(REMOVE) $(OUTPUT)/hugo/layouts/$${section}; \
		$(REMOVE) $(OUTPUT)/hugo/data/$${section}; \
		$(REMOVE) $(OUTPUT)/hugo/data/$${section}.yml; \
	done;
	@$(REMOVE) $(OUTPUT)/Makefile.doc;
	@$(REMOVE) $(OUTPUT)/doc-site-generator;
	$(call git-commit,"Clean project")

# Import documentation from an external project
import-documentation:
	$(COPY) $(src_landing_hugo)/* $(OUTPUT)

	$(COPY) $(SOURCES)/README.md $(output_raw)

	$(COPY) $(SOURCES)/LICENSE $(output_raw)

	@if [ -d $(SOURCES)/_tutorials ]; then \
		$(COPY) $(SOURCES)/_tutorials/* $(output_raw)/documentation/tutorials/; \
	fi;

	@if [ -d $(SOURCES)/_examples ]; then \
		$(COPY) $(SOURCES)/_examples/* $(output_raw)/documentation/examples/; \
	fi;

	go run $(project_yml_generator) -tpl=$(src_project_tpl) -readme=$(SOURCES)/README.md -categories=$(src_categories_yml) > $(output_yml)

	$(call git-commit,"Import content from sources")

