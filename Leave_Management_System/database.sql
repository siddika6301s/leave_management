-- Leave Management System
-- Run this complete script in MySQL Workbench.
-- Only ONE table is used, as requested.

CREATE DATABASE IF NOT EXISTS leave_management;
USE leave_management;

CREATE TABLE IF NOT EXISTS leave_applications (
    leave_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(30) NOT NULL,
    occupation VARCHAR(100) NOT NULL,
    leave_type VARCHAR(50) NOT NULL,
    purpose VARCHAR(150) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    duration INT NOT NULL,
    additional_details TEXT,
    status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    applied_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    CHECK (to_date >= from_date),
    CHECK (duration > 0)
);

-- APPLY / INSERT a leave
-- INSERT INTO leave_applications
-- (employee_id, occupation, leave_type, purpose, from_date, to_date, duration, additional_details)
-- VALUES ('EMP101', 'Software Developer', 'Casual Leave', 'Personal work',
--         '2026-11-10', '2026-11-11', 2, 'Family work');

-- LIST ALL leave applications
-- SELECT * FROM leave_applications ORDER BY applied_date DESC;

-- LIST ONE employee's leave applications
-- SELECT * FROM leave_applications WHERE employee_id = 'EMP101';

-- UPDATE a leave application
-- UPDATE leave_applications
-- SET purpose = 'Medical appointment', from_date = '2026-11-12',
--     to_date = '2026-11-13', duration = 2
-- WHERE leave_id = 1;

-- DELETE a leave application
-- DELETE FROM leave_applications WHERE leave_id = 1;
