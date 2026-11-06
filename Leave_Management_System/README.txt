LEAVE MANAGEMENT SYSTEM

FILES
- index.html: open this file in Chrome/Edge to use the website.
- style.css: colourful responsive design and image backgrounds.
- script.js: Apply, List, Update, Delete, filters and duration calculation.
- database.sql: MySQL database with ONE table: leave_applications.

HOW TO OPEN
1. Extract the ZIP file.
2. Double-click index.html.
3. Fill Employee ID, Occupation, Leave Type, Reason, From Date and To Date.
4. Click Apply Leave. Existing requests appear in Leave Applications.
5. Click Edit to update or Delete to remove a request.
6. Search by Employee ID or filter by status.

DATABASE SETUP (MySQL Workbench)
1. Open MySQL Workbench and connect to your MySQL server.
2. Open database.sql (File > Open SQL Script).
3. Click the lightning bolt Execute button.
4. The database leave_management and its single table leave_applications will be created.

IMPORTANT DATABASE NOTE
This no-install website stores demo records in this browser's localStorage. It does NOT directly connect to MySQL Workbench. The SQL file creates the real MySQL database/table, but to make the website save/read records directly from MySQL, a backend server/API (such as PHP, Python, Java or Node.js) must be running. MySQL Workbench by itself is a database administration tool, not a web server. Internet images and Google Fonts require an internet connection.
