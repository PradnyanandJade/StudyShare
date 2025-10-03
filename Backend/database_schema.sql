CREATE DATABASE IF NOT EXISTS Backend;
USE Backend;

// [1] users
// [2] classes
// [3] class_members
// [4] notes

CREATE TABLE users(
	id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(500) NOT NULL UNIQUE,
    password VARCHAR(500) NOT NULL,
    role ENUM('teacher','student') NOT NULL
);
CREATE TABLE classes(
	class_id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    class_name VARCHAR(255) NOT NULL,
    class_code INT NOT NULL UNIQUE,
    FOREIGN KEY (teacher_id) REFERENCES users(id)  
);
CREATE TABLE class_members(
	id INT PRIMARY KEY AUTO_INCREMENT,
	class_id INT NOT NULL,
    student_id INT NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (student_id) REFERENCES users(id)
);
CREATE TABLE notes(
    note_id INT PRIMARY KEY AUTO_INCREMENT,
    class_id INT NOT NULL,
    uploader_id INT NOT NULL,
    topic VARCHAR(512) NOT NULL,
    URL VARCHAR(799) NOT NULL,
    timestamp datetime NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (uploader_id) REFERENCES users(id)
);
CREATE TABLE requests(
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    topic VARCHAR(500) NOT NULL,
    class_id INT NOT NULL,
    requestor_id INT NOT NULL,
    FOREIGN KEY(class_id) REFERENCES classes(class_id),
    FOREIGN KEY(requestor_id) REFERENCES users(id)
);