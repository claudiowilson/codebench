codebench
=========

team yoloswag and their hackathon app


Installing Postgres
===================
Install postgres `sudo apt-get install postgres`
read this
[Setting up Postgres](https://help.ubuntu.com/10.04/serverguide/postgresql.html)
and then connect using `psql -U postgres codebench`. To set up the codebench stuff,
go into our `sql` folder and when connected to postgres, run
`\i <path to .sql file>` to create the tables. Also edit `settings.js` to point to the db.
