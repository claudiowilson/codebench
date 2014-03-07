codebench
=========

team yoloswag and their hackathon app


Installing Postgres
===================
1. Install postgres `sudo apt-get install postgresql postgresql-contrib` and [set it up.](https://help.ubuntu.com/10.04/serverguide/postgresql.html)

2. Create and prepare the database from scratch.

* Create the db: `createdb codebench` 

* Connect: `psql -U postgres codebench` or `psql codebench`

* Create tables: `\i <path to .sql file>` 

* Edit `settings.js` to point to the db. `postgres://<user>:<pw>@<ip>:<port>/codebench`, default localhost:5432.


Cloud Server Settings
====================

I've taken the liberty of creating a Droplet for us on Digital Ocean,
the ip address is: 107.170.12.71

**Username**: root
**Password**: yoloswag420

You will need SSH access to get into the Droplet, so let me know if you
want to hack on the Droplet


#Versions of Stuff

Postgresql - 9.3

Node - 0.10.24

RabbitMQ - 3.2.2