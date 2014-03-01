IMAGES = $(wildcard dockerfiles/*)

images: $(IMAGES)
	docker build -t runner-1 .
	#docker build -t runner-2 .
	#docker build -t runner-3 .
	#docker build -t runner-4 .
	#docker build -t runner-5 .
	#docker build -t runner-6 .
	#docker build -t runner-7 .
	#docker build -t runner-8 .
	#docker build -t runner-9 .
	#docker build -t runner-10 .
	#docker build -t runner-11 .
	#docker build -t runner-12 .
	#docker build -t runner-13 .
	#docker build -t runner-14 .
	#docker build -t runner-15 .
	#docker build -t runner-16 .

run:
	watch -n0 docker run runner-1
