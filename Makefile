####IMAGES = $(wildcard dockerfiles/*)

images: $(IMAGES)
	docker build -t runner-1 .
	docker build -t runner-2 .
	docker build -t runner-3 .
	docker build -t runner-4 .
	docker build -t runner-5 .
	docker build -t runner-6 .
	docker build -t runner-7 .
	docker build -t runner-8 .
	docker build -t runner-9 .
	docker build -t runner-10 .
	docker build -t runner-11 .
	docker build -t runner-12 .
	docker build -t runner-13 .
	docker build -t runner-14 .
	docker build -t runner-15 .
	docker build -t runner-16 .

run:
	watch -n0 docker run runner-1

clean-dockers:
	docker run runner-1 rm -r /src/JavaRunner/out/artifacts
	docker run runner-2 rm -r /src/JavaRunner/out/artifacts
	docker run runner-3 rm -r /src/JavaRunner/out/artifacts
	docker run runner-4 rm -r /src/JavaRunner/out/artifacts
	docker run runner-5 rm -r /src/JavaRunner/out/artifacts
	docker run runner-6 rm -r /src/JavaRunner/out/artifacts
	docker run runner-7 rm -r /src/JavaRunner/out/artifacts
	docker run runner-8 rm -r /src/JavaRunner/out/artifacts
	docker run runner-9 rm -r /src/JavaRunner/out/artifacts
	docker run runner-10 rm -r /src/JavaRunner/out/artifacts
	docker run runner-11 rm -r /src/JavaRunner/out/artifacts
	docker run runner-12 rm -r /src/JavaRunner/out/artifacts
	docker run runner-13 rm -r /src/JavaRunner/out/artifacts
	docker run runner-14 rm -r /src/JavaRunner/out/artifacts
	docker run runner-15 rm -r /src/JavaRunner/out/artifacts
	docker run runner-16 rm -r /src/JavaRunner/out/artifacts
