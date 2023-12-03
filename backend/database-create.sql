DROP DATABASE IF EXISTS chouseisan;
CREATE DATABASE chouseisan;
USE chouseisan;
-- created chouseisan database and use it.


CREATE TABLE event (
  event_id   VARBINARY(16) PRIMARY KEY,
  title      VARCHAR(128) NOT NULL,
  detail     TEXT
);

CREATE TABLE user (
    user_id VARBINARY(16) PRIMARY KEY,
    user_email VARCHAR(255),
    recent_event1 VARBINARY(16),
    recent_event2 VARBINARY(16),
    recent_event3 VARBINARY(16),
    recent_event4 VARBINARY(16),
    recent_event5 VARBINARY(16),
    FOREIGN KEY (recent_event1) REFERENCES event(event_id),
    FOREIGN KEY (recent_event2) REFERENCES event(event_id),
    FOREIGN KEY (recent_event3) REFERENCES event(event_id),
    FOREIGN KEY (recent_event4) REFERENCES event(event_id),
    FOREIGN KEY (recent_event5) REFERENCES event(event_id)
);

CREATE TABLE event_user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id VARBINARY(16),
  user_id VARBINARY(16),
  FOREIGN KEY (event_id) REFERENCES event(event_id),
  FOREIGN KEY (user_id) REFERENCES user(user_id)
) ENGINE MEMORY;

CREATE TABLE event_timeslot (
  event_id VARBINARY(16),
  timeslot_id INT PRIMARY KEY,
  description VARCHAR(255),
  FOREIGN KEY (event_id) REFERENCES event(event_id)
) ENGINE MEMORY;

CREATE TABLE event_user_timeslot (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id VARBINARY(16),
  user_id VARBINARY(16),
  timeslot_id INT,
  Preference INT,
  user_name VARCHAR(128),
  FOREIGN KEY (event_id) REFERENCES event(event_id),
  FOREIGN KEY (user_id) REFERENCES user(user_id),
  FOREIGN KEY (timeslot_id) REFERENCES event_timeslot(timeslot_id)
) ENGINE MEMORY;

CREATE INDEX idx_event_id USING HASH ON event(event_id);
CREATE INDEX idx_event_id USING HASH ON event_user(event_id);
CREATE INDEX idx_event_id USING HASH ON event_user_timeslot(event_id);

INSERT INTO event VALUES (UUID_TO_BIN(UUID()), 'first event', 'description')