codebench
=========

team yoloswag and their hackathon app


Installing Postgres
===================
1. Install postgres `sudo apt-get install postgresql` and [set it up.](https://help.ubuntu.com/10.04/serverguide/postgresql.html)

2. Create and prepare the database from scratch.

* Create the db: `createdb codebench` 

* Connect: `psql -U postgres codebench` or `psql codebench`

* Create tables: `\i <path to .sql file>` 

* Edit `settings.js` to point to the db. `postgres://postgres:<pw>@<ip>:<port>/codebench`, default localhost:5432.

* Install the pgcrypto extension by running the command `CREATE EXTENSION pgcrypto`
