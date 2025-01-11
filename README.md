
# Real-Time Chat Application

A real-time chat application built using React.js and Node.js with WebSocket communication (Socket.IO) for real-time messaging. This project supports user authentication, chat history, and online user tracking.

## Features

- **User Authentication**: Secure login and signup functionality.
- **Real-Time Messaging**: Messages are sent and received instantly using Socket.IO.
- **Online User Tracking**: Displays a list of online users.
- **Chat History**: Fetches and displays chat history on login.
- **Responsive Design**: Works seamlessly across different screen sizes.

---

## Tech Stack

- **Frontend**: React.js, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **WebSocket**: Socket.IO
- **Authentication**: JSON Web Tokens (JWT)

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git
- A modern web browser

---

## Getting Started

Follow the steps below to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone git@github.com:<your-username>/<repository-name>.git
cd <repository-name>
```

### 2. Install Dependencies

#### Backend
Navigate to the `server` directory and install the dependencies:

```bash
cd server
npm install
```
also run the queries present inside data.sql

#### Frontend
Navigate to the `client` directory and install the dependencies:

```bash
cd ../client
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the `server` directory and add the following variables:

```plaintext
PORT=5000
MONGO_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_jwt_secret
```

In the `client` directory, create a `.env` file and specify the backend API URL:

```plaintext
REACT_APP_API_URL=http://localhost:5000
```

### 4. Start the Application

#### Backend
Start the server:

```bash
cd server
npm start
```

#### Frontend
Start the client:

```bash
cd ../client
npm start
```

---

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Register a new account or log in with an existing one.
3. Start a chat with other users in real time.

---

## Project Structure

```
/client       - React frontend
/server       - Node.js backend
README.md     - Project documentation
```

---

## Troubleshooting

- **User not authenticated**: Ensure the JWT token is being stored in `localStorage` and included in API requests.
- **Database connection error**: Verify your MongoDB instance is running and the `MONGO_URI` is correct.

---

## License

This project is licensed under the MIT License.

---

## Contributors

- [Your Name](https://github.com/your-username)

--- 
