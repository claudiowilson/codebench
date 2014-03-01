IMAGES = $(wildcard dockerfiles/*)

images: $(IMAGES)
	docker build -t java-runner-1 dockerfiles/java
	docker build -t java-runner-2 dockerfiles/java
	docker build -t java-runner-3 dockerfiles/java
	docker build -t java-runner-4 dockerfiles/java
	docker build -t java-runner-5 dockerfiles/java
	docker build -t java-runner-6 dockerfiles/java
	docker build -t java-runner-7 dockerfiles/java
	docker build -t java-runner-8 dockerfiles/java
	docker build -t python-runner-1 dockerfiles/python
	docker build -t python-runner-2 dockerfiles/python
	docker build -t python-runner-3 dockerfiles/python
	docker build -t python-runner-4 dockerfiles/python
	docker build -t python-runner-5 dockerfiles/python
	docker build -t python-runner-6 dockerfiles/python
	docker build -t python-runner-7 dockerfiles/python
	docker build -t python-runner-8 dockerfiles/python

