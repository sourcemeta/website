HUGO = hugo

all: .always
	$(HUGO) server --buildDrafts --environment development

html:
	$(HUGO) --environment production --destination dist

.always:
