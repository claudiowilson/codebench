CREATE TABLE codebench.user(
	user_id SERIAL NOT NULL,
	username text NOT NULL,
	password text NOT NULL,
	full_name text,
	email text,
	PRIMARY KEY (user_id),
	CONSTRAINT username_unique UNIQUE("username")
);

CREATE TABLE codebench.question(
	question_id SERIAL NOT NULL,
	asked_user integer,
	problem text NOT NULL,
	input text,
	output text,
	upvotes integer,
	downvotes integer,
	PRIMARY KEY (question_id),
	CONSTRAINT question_user_fkey FOREIGN KEY ("asked_user") REFERENCES codebench.user ("user_id") ON DELETE CASCADE
);

CREATE TABLE codebench.submission(
	submission_id SERIAL NOT NULL,
	submitted_user integer NOT NULL,
	question integer NOT NULL,
	code text,
	result text,
	message text,
	submission_error text,
	PRIMARY KEY (submission_id),
	CONSTRAINT submission_user_fkey FOREIGN KEY ("submitted_user") REFERENCES codebench.user ("user_id") ON DELETE CASCADE,
	CONSTRAINT submission_question_fkey FOREIGN KEY ("question") REFERENCES codebench.question("question_id") ON DELETE CASCADE
);