-- agency table
CREATE TABLE agency(
	agency_id UUID DEFAULT gen_random_uuid(),
	short_name VARCHAR(255),
	long_name TEXT,
	PRIMARY KEY (agency_id)
);

-- app_user table
CREATE TABLE app_user(
	user_id DECIMAL,
	first_name VARCHAR(255),
	last_name VARCHAR(255),
	email VARCHAR(255),
	contact VARCHAR(32),
	agency_id UUID,
	PRIMARY KEY(user_id),
	CONSTRAINT fk_agency
	FOREIGN KEY(agency_id)
	REFERENCES AGENCY(agency_id)
);


-- topic table
CREATE TABLE topic(
	topic_id UUID DEFAULT gen_random_uuid(),
	user_id DECIMAL NOT NULL,
	agency_id UUID NOT NULL,
	topic_name VARCHAR(255) NOT NULL,
	topic_url TEXT NOT NULL,
	description TEXT,
	last_update TIMESTAMP WITH TIME ZONE,
	PRIMARY KEY(topic_id),
	CONSTRAINT fk_app_user FOREIGN KEY(user_id) REFERENCES app_user(user_id),
	CONSTRAINT fk_agency FOREIGN KEY(agency_id) REFERENCES AGENCY(agency_id)
);


-- file table
CREATE TABLE topic_file(
	file_id UUID DEFAULT gen_random_uuid(),
	topic_id UUID NOT NULL,
	agency_id UUID NOT NULL,
	file_url TEXT NOT NULL,
	file_date TIMESTAMP WITH TIME ZONE,
	PRIMARY KEY(file_id),
	CONSTRAINT fk_topic FOREIGN KEY(topic_id) REFERENCES topic(topic_id),
	CONSTRAINT fk_agency FOREIGN KEY(agency_id) REFERENCES AGENCY(agency_id)
);

-- write access table
CREATE TABLE write_access(
	user_id DECIMAL NOT NULL,
	topic_id UUID NOT NULL,
	last_access TIMESTAMP WITH TIME ZONE,
	PRIMARY KEY(user_id, topic_id),
	CONSTRAINT fk_app_user FOREIGN KEY(user_id) REFERENCES app_user(user_id),
	CONSTRAINT fk_topic FOREIGN KEY(topic_id) REFERENCES topic(topic_id)
);

-- read access table
CREATE TABLE read_access(
	user_id DECIMAL NOT NULL,
	topic_id UUID NOT NULL,
	last_access TIMESTAMP WITH TIME ZONE,
	PRIMARY KEY(user_id, topic_id),
	CONSTRAINT fk_app_user FOREIGN KEY(user_id) REFERENCES app_user(user_id),
	CONSTRAINT fk_topic FOREIGN KEY(topic_id) REFERENCES topic(topic_id)
);

-- API key table
CREATE TABLE api_key(
	key_id UUID NOT NULL,
	user_id DECIMAL NOT NULL,
	topic_id UUID NOT NULL,
	generated_date TIMESTAMP WITH TIME ZONE,
	PRIMARY KEY(key_id),
	CONSTRAINT fk_app_user FOREIGN KEY(user_id) REFERENCES app_user(user_id),
	CONSTRAINT fk_topic FOREIGN KEY(topic_id) REFERENCES topic(topic_id)
);

CREATE TABLE request(
	request_id UUID DEFAULT gen_random_uuid(),
	requestor_id DECIMAL NOT NULL,
	approver_id DECIMAL NOT NULL,
	topic_id UUID NOT NULL,
	access_type VARCHAR(255) NOT NULL,
	status VARCHAR(255) NOT NULL,
	description TEXT,
	PRIMARY KEY(request_id),
	CONSTRAINT fk_request_app_user FOREIGN KEY(requester_id) REFERENCES app_user(user_id),
	CONSTRAINT fk_approve_app_user FOREIGN KEY(approver_id) REFERENCES app_user(user_id),
	CONSTRAINT fk_topic FOREIGN KEY(topic_id) REFERENCES topic(topic_id)
);

-- DROP TABLE agency, app_user, topic, write_access, read_access, request, topic_file;
