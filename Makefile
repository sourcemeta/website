HUGO = hugo
NPM = npm

all: node_modules .always
	$(HUGO) server --buildDrafts --environment development

html: node_modules
	$(HUGO) --environment production --destination dist

node_modules: package.json package-lock.json
	$(NPM) ci

.always:
