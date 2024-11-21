# Cleaning and Collecting Plastics

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Uplaod](#Uplaod)

## Introduction

This platform aims to streamline the process of **recycling and collecting plastic waste** by providing a user-friendly interface to locate and manage collection spots. Users can register, claim available spots, and track their contributions to environmental conservation efforts.

## Features

- **User Authentication**: Secure login and registration.
- **Spot Management**: Locate, claim, and cancel plastic collection spots.
- **Filter and Sort Spots**: Filter spots by status (e.g., "Claimed", "Uncollected").
- **Map Integration**: Visualize collection spots on an interactive map.

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: HTML, CSS, TailwindCSS, JavaScript
- **Authentication**: JWT (JSON Web Tokens)
- **Map Integration**: Leaflet.js for interactive maps
- **File Upload**: Multer for profile picture uploads

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YourUsername/plastic-recycle.git
2. Navigate into the project directory:
   ```bash
   cd plastic
3. Install dependencies:
   ```bash
   npm install
   
## Environement variables 
1. Create a .env file in the root directory with the following variables:
   ```bash
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/plasticRecycle
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   SALTROUNDS=10

## Usage
1. Start the MongoDB server:
   ```bash 
   mongo
2. Start the application
   ```bash
   npm run start
3. Open the application in your browser:
   ```bash
   http://localhost:3000

## Upload Folder
1. Create a folder named upload to save the picture locally
   ```bash
   cd public
   mkdir upload
