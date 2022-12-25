DROP DATABASE IF EXISTS tasklist_app;
CREATE DATABASE tasklist_app;
USE tasklist_app;

DROP USER IF EXISTS 'tasklist_app_user'@'localhost';
CREATE USER 'tasklist_app_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'rootroot';
GRANT ALL PRIVILEGES ON tasklist_app.* TO 'tasklist_app_user'@'localhost';

DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO tasks(title)
VALUES 
("Make vanilla pudding"),
("Put in mayo jar"),
("Eat in public");