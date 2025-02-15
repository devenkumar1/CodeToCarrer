# Documentation 

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/yourusername/codetocarrer.git
```

2. Install dependencies

```bash 
npm install
```
3. create a env file in the root and add the following variables

```bash

MONGODB_URI = "your connection string"

JWT_SECRET= "your secret key"
## Google OAuth credentials
GOOGLE_CLIENT_ID="generate and paste here your google client"
GOOGLE_CLIENT_SECRET="paste your google client secret here"

## Github OAuth credentials
GITHUB_ID="your github client id"
GITHUB_SECRET="your github client secret"
NEXTAUTH_SECRET="your secret"
NEXTAUTH_URL=http://localhost:3000

```

4. Start the development server

```bash
npm run dev
```

## note:- all the frontend files are in the app folder and backend folders are in the app/api folder.


# Auth Routes

### Auth Signup

This endpoint is used to sign up a new user.

**Request Body**

- `name` (string): The name of the user.
    
- `email` (string): The email of the user.
    
- `password` (string): The password for the user account.
    

**Response**

- Status: 201
    
- Content-Type: application/json
    
- `message` (string): A message indicating the result of the signup process.
    

**Headers**  
The request should include the necessary headers for authentication and content type.

**Specific Details**

- Ensure that the request body includes the required fields: name, email, and password.
    
- The response will contain a message confirming the success of the signup process.

### Auth Login

This endpoint is used to log in a user.

**Request Body**

- `email` (string): The email of the user.
- `password` (string): The password for the user account.

**Response**
- Status: 200
- Content-Type: application/json
- `message` (string): A message indicating the result of the login process.

**Headers**
The request should include the necessary headers for authentication and content type.

**Specific Details**
- Ensure that the request body includes the required fields: email and password.
- The response will contain a message confirming the success of the login process.


# Authentication Types
## using next-auth for authentication
- **Credentials**: The user logs in using their email and password.
- **Google**: The user logs in using their Google account.
- **Github**: The user logs in using their Github account.
