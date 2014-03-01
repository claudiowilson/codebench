IMAGES = $(wildcard dockerfiles/*)

images: $(IMAGES)
	docker build -t runner-1 dockerfiles/all
	docker build -t runner-2 dockerfiles/all
	docker build -t runner-3 dockerfiles/all
	docker build -t runner-4 dockerfiles/all
	docker build -t runner-5 dockerfiles/all
	docker build -t runner-6 dockerfiles/all
	docker build -t runner-7 dockerfiles/all
	docker build -t runner-8 dockerfiles/all
	docker build -t runner-9 dockerfiles/all
	docker build -t runner-10 dockerfiles/all
	docker build -t runner-11 dockerfiles/all
	docker build -t runner-12 dockerfiles/all
	docker build -t runner-13 dockerfiles/all
	docker build -t runner-14 dockerfiles/all
	docker build -t runner-15 dockerfiles/all
	docker build -t runner-16 dockerfiles/all

