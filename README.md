# MediVault – Secure RBAC Healthcare Application (MERN Stack)

MediVault is a secure healthcare management application built using the MERN stack. It provides role-based access for Admin, Doctor, and Patient, enabling secure handling of medical records, appointments, and user management.

## Features

- Role-Based Access Control (RBAC) for Admin, Doctor, and Patient
- JWT authentication with token-based session management
- Secure medical records management
- Doctor–patient appointment system
- Protected routes with custom middleware
- React (Vite) frontend with Context API for global state
- RESTful API architecture using Express and Node.js
- MongoDB + Mongoose schema-based NoSQL design

## Tech Stack

Frontend: React.js (Vite), Axios, Context API  
Backend: Node.js, Express.js  
Database: MongoDB, Mongoose  
Authentication: JWT, bcrypt

## Project Structure

/backend  
 /controllers  
 /models  
 /routes  
 /middleware

/frontend  
 /src  
 /components  
 /pages  
 /context

## RBAC Overview

Admin: Manage doctors, view all patients, manage users  
Doctor: View assigned patients, manage appointments, update records  
Patient: Book appointments, view own records

## How to Run Locally

### 1. Clone the repository

git clone https://github.com/R-AFSAR-AHAMMAD/MediVault-Secure-RBAC-Heathcare-Portal.git  
cd MediVault-Secure-RBAC-Heathcare-Portal

### 2. Install dependencies

Backend:  
cd backend  
npm install

Frontend:  
cd frontend  
npm install

### 3. Add environment variables

Create a .env file inside backend:
MONGO_URI=your_mongodb_connection  
JWT_SECRET=your_secret_key  
PORT=5000

### 4. Start the project

Backend:  
npm start

Frontend:  
npm run dev

## API Highlights

/auth/login - User login  
/appointments - Appointment CRUD  
/records - Medical record operations  
/admin - Admin-only operations
