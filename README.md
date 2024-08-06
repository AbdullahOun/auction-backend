# Auction Backend

## Overview

The Auction Backend is a comprehensive API designed for managing auctions. It supports user management, auction creation, bidding, real-time updates, and communication features.

## Features

- **User Management**: Registration, authentication, and profile management for users.
- **Auction Management**: Create, update, and delete auction items.
- **Bidding System**: Place and manage bids on auction items in real-time.
- **Search Functionality**: Search for auction items based on various criteria.
- **Auto-Updating Auction Status**: Automatically updates auction status to reflect pending, active, or ended states.
- **Real-Time Updates**: Receive real-time notifications on bid changes and auction status.
- **Real-Time Chat**: Enable real-time communication between sellers and buyers for inquiries and negotiations.
- 
## Architecture

The backend is designed using a monolithic architecture with a layered approach and implements the repository pattern. The key components include:

- **API Layer**: Handles incoming requests and responses, and implements routes for user and auction operations.
- **Service/Controller Layer**: Contains business logic and manages interactions between the API layer and the data access layer.
- **Repository Layer**: Encapsulates database operations and abstracts data access, ensuring separation of concerns.
- **Data Access Layer**: Manages direct interactions with the database.
- **Database**: Utilizes MongoDB with Mongoose ODM for data storage, employing schemas to support auction and user data.
- **Real-Time Communication**: Uses Socket.IO for real-time updates on auction events.

## Tools and Technologies

- **Node.js**: Runtime environment for executing JavaScript code server-side.
- **Express.js**: Web application framework for building RESTful APIs.
- **MongoDB**: NoSQL database used for storing and managing data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB, providing a schema-based solution to model application data.
- **JWT**: JSON Web Tokens used for secure user authentication.
- **Socket.IO**: Library for real-time communication, providing real-time updates on auction events.
- **Redis**: In-memory data structure store used for caching and managing session data.
- **AWS S3**: Scalable object storage service for storing and retrieving static files, such as images and documents.
- **Winston**: For logging

## Usage

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AbdullahOun/auction-backend.git
   cd auction-backend
   ```

2. **Add Environment Variables**:
   Create a `.env` file in the root directory of the project and add the following environment variables:
   ```plaintext
   AWS_ACCESS_KEY_ID=<your_aws_access_key_id>
   AWS_BUCKET_NAME=<your_aws_bucket_name>
   AWS_REGION=<your_aws_region>
   AWS_SECRET_ACCESS_KEY=<your_aws_secret_access_key>
   JWT_SECRET_KEY=<your_jwt_secret_key>
   KEYLEN=<your_key_length>
   MONGO_URL=<your_mongodb_connection_string>
   PORT=<your_server_port>
   SALT=<your_salt>
   DEFAULT_USER_IMAGE_URL=<default_user_image_url>
   REDIS_PASSWORD=<your_redis_password>
   REDIS_USERNAME=<your_redis_username>
   REDIS_HOST=<your_redis_host>
   REDIS_PORT=<your_redis_port>
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run the Server Locally**:
   ```bash
   npm run dev
   ```

