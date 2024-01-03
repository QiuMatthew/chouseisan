DROP DATABASE IF EXISTS chouseisan;
CREATE DATABASE chouseisan;
USE chouseisan;
-- created chouseisan database and use it.


CREATE TABLE events (
  event_id   VARCHAR(255) PRIMARY KEY,
  title      VARCHAR(128) NOT NULL,
  detail     TEXT,
  host_token  VARCHAR(255) NOT NULL
);

CREATE TABLE event_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id VARBINARY(16),
  user_name VARCHAR(255),
  FOREIGN KEY (event_id) REFERENCES events(event_id)
) ENGINE MEMORY;

CREATE TABLE event_timeslots (
  event_timeslot_id INT PRIMARY KEY AUTO_INCREMENT,
  event_id VARBINARY(16),
  description VARCHAR(255),
  FOREIGN KEY (event_id) REFERENCES events(event_id)
) ENGINE MEMORY;

CREATE TABLE event_user_timeslots (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id VARBINARY(16),
  user_id VARBINARY(16),
  timeslot_id INT,
  preference INT,
  user_name VARCHAR(128),
  FOREIGN KEY (event_id) REFERENCES events(event_id),
  FOREIGN KEY (timeslot_id) REFERENCES event_timeslots(event_timeslot_id)
) ENGINE MEMORY;

CREATE INDEX idx_event_id USING HASH ON events(event_id);
CREATE INDEX idx_event_id USING HASH ON event_users(event_id);
CREATE INDEX idx_event_id USING HASH ON event_user_timeslots(event_id);
