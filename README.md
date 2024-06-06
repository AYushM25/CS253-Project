# CS253 Project
CS253 Course Project done in 2nd semester 2023-2024 under Prof. Indranil Saha at IIT Kanpur.

# College Pathfinder
College PathFinder is a comprehensive educational search and recommendation platform designed to assist students in finding suitable colleges based on a wide range of criteria. The product encompasses various features to enhance the user experience and streamline the college selection process. It allows users to set a specific All India Rank (AIR) range, helping them narrow their options based on academic performance. College PathFinder ensures that students are presented with colleges that align with their ranking, optimizing the chances of finding a suitable educational institution.

# About the Web App
As of now, the front-end and the backend are separate units.
For Back-end Part,
Backend is deployed on render.com
For the Front-end Part,
Frontend is deployed on vercel.com and can be accessed from all places.
For DataBase Part,
Database is deployed on MongoDB Atlas.

# Installation Requirements
1. Node.js
2. React.js
3. npm
4. Web Browser

# CodeBase Navigation
Frontend : 
The Front-end code is present in "/college_frontend-main". The "src" folder contains all the React source code files.

Backend :
The Back-end code is present in "/college_backend-main".

# Installation
The user need to add a .env file in the backend folder containing the following things : 
1. jwtPrivateKey = "Your Own Private Key"
2. MAIL_USER = "The email id you will use to send OTP"
3. MAIL_PASS = "The email password you will use to send OTP"
4. mongoDBURL = "Your own mongoDB url"
5. PORT = 5000

For running the Frontend Part -

1. Navigate to "/college_frontend-main".
2. Open the Command Line Terminal in this folder.
3. Run the following commands one by one -
4. npm install --force
5. npm start

The webpage will automatically open in localhost:3000.

If it doesn't automatically open, the user can open it manually.

For the Back-end part,
1. Navigate to "/college_backend-main.”
2. Open the Command Line Terminal in this folder.
3. Run the following commands one by one.
4. npm install --force
5. npm start
(if there is some error after running npm start, then type npm uninstall bcrypt and then npm
install bcrypt and run npm start again)

The user can test the APIs on localhost (http://localhost:5000/).
