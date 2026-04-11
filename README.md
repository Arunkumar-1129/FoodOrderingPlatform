# CraveBite - Food Ordering Platform

CraveBite is a full-stack, production-ready food ordering platform. It provides a seamless food discovery, cart management, and checkout experience for users, powered by a robust backend and a responsive, modern frontend UI.

## 🚀 Key Features

*   **User Registration & Authentication**: Secure JWT-based authentication system.
*   **Role-Based Access Control**: Different access levels for regular users and administrators.
*   **Browse Restaurants & Menus**: View a list of restaurants and their detailed food menus.
*   **Cart Management**: Users can dynamically add, update, or remove items from their carts.
*   **Order Placement**: Checkout process connected with order history.
*   **State Management**: Complex UI state managed centrally using Redux Toolkit.
*   **Responsive Design**: Fully responsive, mobile-first design leveraging Tailwind CSS.
*   **RESTful APIs**: Comprehensive backend endpoints serving frontend queries.

## 🛠️ Technology Stack

### Frontend
*   **Framework:** React 18 with Vite
*   **Styling:** Tailwind CSS & PostCSS
*   **State Management:** Redux Toolkit & React Redux
*   **Routing:** React Router DOM
*   **HTTP Client:** Axios
*   **Icons:** Lucide React
*   **Authentication:** JWT decoding (`jwt-decode`)

### Backend
*   **Framework:** Java 17 / Spring Boot 3.2.0
*   **Persistence:** Spring Data JPA
*   **Database:** MySQL (Primary) & H2 (In-memory testing)
*   **Security:** Spring Security & JWT (`io.jsonwebtoken`)
*   **Utilities:** Lombok (reduce boilerplate), ModelMapper (DTO mapping)
*   **Build Tool:** Gradle

## 📂 Project Structure

```
FoodOrderingPlatform/
├── backend/                # Java/Spring Boot API Server
│   ├── build.gradle        # Gradle configuration
│   └── src/                # Backend Source Code (Controllers, Services, Models, Repositories)
├── frontend/               # React/Vite Client Application
│   ├── package.json        # NPM dependencies and scripts
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── src/                # Frontend Source Code (Components, Redux slices, Pages)
└── README.md               # You are reading this!
```

## ⚙️ Prerequisites

Before you begin, ensure you have met the following requirements:
*   **Node.js**: `v18.x` or later (for the frontend environment)
*   **NPM / Yarn**: Package manager installed via Node.js
*   **Java Development Kit (JDK)**: Version `17` or later
*   **MySQL Server**: Running on your local machine or an accessible server instance

## 🚀 Setup and Installation

### 1. Database Setup
Ensure you have a local MySQL server running.
Create a database for the application to use:
```sql
CREATE DATABASE food_ordering_db;
```
Update your database configuration in `backend/src/main/resources/application.properties` with the correct username, password, and connection string if it differs from the default setup.

### 2. Backend Setup
Navigate to the `backend` directory from the repository root:
```bash
cd backend
```

Build the project and download all dependencies using Gradle:
```bash
# On Windows
gradlew.bat build

# On macOS/Linux
./gradlew build
```

Run the Spring Boot application:
```bash
# On Windows
gradlew.bat bootRun

# On macOS/Linux
./gradlew bootRun
```
*The backend API will start securely, usually running on `http://localhost:8080`.*

### 3. Frontend Setup
Open a new terminal window/tab. Navigate to the `frontend` directory from the repository root:
```bash
cd frontend
```

Install the required Node.js packages:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*The frontend application will compile and launch, typically accessible at `http://localhost:5173`.*

## 📜 Available Scripts (Frontend)
In the frontend directory, you can run:
*   `npm run dev` - Starts the development server with Hot Module Replacement (HMR).
*   `npm run build` - Builds the app for production to the `dist` folder.
*   `npm run lint` - Runs ESLint to catch and report syntax and structural problems in React code.
*   `npm run preview` - Boots up a local web server that serves the files from the generated `/dist` directory.

## 🔒 Security & Authentication
CraveBite applies stateless authentication using JSON Web Tokens (JWT). When completing a successful login, the API responds with a signed JWT. This token must be included in the HTTP `Authorization` header as a Bearer token for all protected API calls.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.