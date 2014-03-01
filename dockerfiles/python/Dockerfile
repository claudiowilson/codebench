FROM ubuntu:12.10
MAINTAINER Kevin Yeh "kevinyeah@utexas.edu"

# REPOS
RUN apt-get -y update
RUN apt-get install -y -q software-properties-common
RUN add-apt-repository -y "deb http://archive.ubuntu.com/ubuntu $(lsb_release -sc) universe"
RUN apt-get -y update --fix-missing

# TOOLS
RUN apt-get install -y -q curl git make wget

# BUILD
RUN apt-get install -y -q build-essential g++

# LANGS

## PYTHON
RUN apt-get install -y -q python-software-properties python python-setuptools python-virtualenv python-dev python-distribute python-pip
RUN pip --no-input --exists-action=w install --upgrade pip

# LIBS
RUN apt-get install -y -q libjpeg8-dev zlib1g-dev libfreetype6-dev liblcms1-dev libwebp-dev libtiff-dev

ADD . /src

RUN apt-get -y update --fix-missing