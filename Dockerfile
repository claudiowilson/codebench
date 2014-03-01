# Pull base image.
FROM ubuntu:12.10
MAINTAINER      Kevin Yeh "kevinyeah@utexas.edu"

# REPOS
RUN apt-get -y update
RUN apt-get install -y -q software-properties-common
RUN add-apt-repository -y "deb http://archive.ubuntu.com/ubuntu $(lsb_release -sc) universe"
RUN apt-get -y update --fix-missing

# Install Java
RUN apt-get install -y software-properties-common
RUN add-apt-repository -y ppa:webupd8team/java
RUN apt-get update
RUN echo debconf shared/accepted-oracle-license-v1-1 select true | debconf-set-selections
RUN echo debconf shared/accepted-oracle-license-v1-1 seen true | debconf-set-selections
RUN apt-get install -y oracle-java7-installer

# Install Python
RUN apt-get install -y -q python-software-properties python python-setuptools python-virtualenv python-dev python-distribute python-pip
RUN pip --no-input --exists-action=w install --upgrade pip

# LIBS
RUN apt-get install -y -q libjpeg8-dev zlib1g-dev libfreetype6-dev liblcms1-dev libwebp-dev libtiff-dev
RUN apt-get -y update --fix-missing

ADD . /src

# Define default command.
CMD java -jar /src/JavaRunner/out/artifacts/CodeBenchJavaRunner_jar/CodeBenchJavaRunner.jar