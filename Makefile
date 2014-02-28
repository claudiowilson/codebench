IMAGES = $(wildcard dockerfiles/*)

images: $(IMAGES)
	docker build -t java-runner dockerfiles/java
	docker build -t python-runner dockerfiles/python
