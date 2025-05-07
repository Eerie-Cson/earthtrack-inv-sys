# EarthTrack Inventory System

An inventory management system built with a monorepo architecture (Nx) and microservices. This project demonstrates a production-quality approach for both the backend (Node.js, TypeScript, NestJS) and the mobile frontend (React Native, TypeScript, Hooks).

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Build Projects](#3-build-projects)
  - [4. Start Services](#4-start-services)
  - [5. Check Logs (Optional)](#5-check-logs-optional)
- [Mobile App Setup](#mobile-app-setup)
- [API Endpoints](#api-endpoints)
- [Testing Mutation Endpoints](#testing-mutation-endpoints)
- [Testing Paginated Results](#testing-paginated-results)
- [ObjectId Utility Class](#objectid-utility-class)

---

## Overview

This repository contains a full-stack inventory management system split into microservices within an Nx monorepo. Services include:

- **auth-service**: Handles user registration, login (JWT), and role-based authentication.
- **user-service**: Manages user profiles and role updates via gRPC.
- **product-service**: Exposes RESTful endpoints for CRUD operations and efficient search with cursor-based pagination.

The mobile frontend is a React Native application showcasing asynchronous data fetching, search, pagination, and role-aware UI flows.

---

## Architecture

```
monorepo (Nx)
├── services
│   ├── auth-service      # NestJS REST API
│   ├── user-service      # NestJS gRPC service
│   └── product-service   # NestJS REST API
└── mobile
    └── inventory-app     # React Native (TypeScript)
```

Key design patterns:

- **Microservices** for separation of concerns and scalability.
- **Cursor-based pagination** in product-service for performant searches over large datasets.
- **Lightweight ObjectId class** for type-safe, prefixed IDs (`acc_`, `pro_`) with hex and Base58 support.
- **Role-based access control** (Admin, Auditor, Authenticated user).

---

## Features

### Backend

- RESTful API built with Node.js, TypeScript, and NestJS.
- CRUD operations on `Product` entity (name, description, category, price).
- Search endpoint supporting:
  - Partial, case-insensitive matching on name/description.
  - Cursor-based pagination for high performance at scale.
- Role-based permissions:
  - **Admin**: Delete products.
  - **Auditor**: Edit/update products.
  - **Authenticated users**: View/Search products.
- Auto-generated API documentation (Swagger).
- Linting (ESLint) and formatting (Prettier).
- Unit and integration tests (Jest).
- Docker Compose setup for all services.

### Mobile App

- React Native (TypeScript) using Hooks.
- Top search bar visible on all screens.
- Bottom navigation with Home, Settings, Profile.
- **Landing Page**: Displays product categories (tap to view list).
- **Product Listing**: Shows name, description, price, with pagination.
- **Settings**: Numeric input (positive, ≤100, required) with validation feedback.
- **Profile**: Placeholder avatar and user details.
- Ensure compilable on Android emulator or physical device.

---

## Tech Stack

- **Backend**: Node.js, TypeScript, NestJS, MongoDB, Docker, Jest, RxJS.
- **Frontend**: React Native, TypeScript, React Navigation, Axios.
- **Monorepo**: Nx, ESLint, Prettier.
- **ID Utility**: Custom `ObjectId` class with hex & Base58 support.

---

## Prerequisites

- **Node.js** (v16+)
- **npm**
- **Docker & Docker Compose**
- **Postman** (for API testing)
- **Android Studio** or **physical device** configured for React Native

---

## Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/Eerie-Cson/earthtrack-inv-sys.git
cd earthtrack-inv-sys
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build Projects
```bash
npm run build
```
*(Wait for compilation to finish)*

### 4. Start Services
```bash
docker compose up
```

### 5. Check Logs (Optional)
```bash
docker compose logs -f <service-name>
# e.g.
# docker compose logs -f auth-service user-service product-service
```

---

## Mobile App Setup

1. Follow React Native environment setup: https://reactnative.dev/docs/set-up-your-environment
2. Ensure Android emulator or physical device is connected and running.
3. In one terminal:
```bash
nx run-android mobile
```
> *If it fails, rerun until the emulator boots and the app installs.*

4. In a second terminal:
```bash
nx run mobile:start
```
The app should launch on the emulator/device.

---

## API Endpoints

> **API Docs**: Both auth-service and product-service offer Swagger documentation at `{baseUrl}/api/docs`. It may not be available currently, so you can use Postman instead.



### Auth Service (localhost:4040)
- `POST /register`
- `POST /login`

### Product Service (localhost:4041)
- **Create Product**  
  `POST /api/products`  
  **Headers**: `Authorization: Bearer <token>`  
  **Body**:
  ```json
  {
    "name": "Sample Product",
    "description": "A brief description",
    "category": "ToolBox",
    "price": 9.99
  }
  ```
  **Accepted Category Types**:
  `ToolBox, Accessories, Beverages`
- **Update Product**  
  `PUT /api/products/{id}`  
  **Headers**: `Authorization: Bearer <token>`  
  **Body**:
  ```json
  {
    "name": "Updated Name",
    "description": "Updated description",
    "category": "Updated Category",
    "price": Updated Price
  }
  ```
- **Delete Product**  
  `DELETE /api/products/{id}`  
  **Headers**: `Authorization: Bearer <token>`
- **Get Product**  
  `GET /api/products/{id}`  
  **Headers**: `Authorization: Bearer <token>`
- **Search Products**  
  `GET /api/products?name=Sample&cursor=...&limit=20`  
  **Headers**: `Authorization: Bearer <token>`

### User Service (gRPC, localhost:50051)
- `PutUser` RPC at `/user` (gRPC, localhost:50051)
- `PutUser` RPC at `/user`

---

## Testing Mutation Endpoints

1. **Register User** via `POST http://localhost:4040/register`
   - **Request Body**:
     ```json
     {
       "username": "user1",
       "password": "pass123",
       "email": "user1@example.com",
       "firstname": "First",
       "lastname": "User",
       "role": "user"
     }
     ```
   - **Accepted roles**: `user, admin, auditor`
   - **Response** returns user data and a JWT token.

2. **Authenticate**
   - Include the token in the `Authorization: Bearer <token>` header for subsequent requests.

3. **Role Assignment Note**
   - Updating user roles may not yet be supported. Instead, register a new user already assigned the desired role via the register endpoint.

4. **Test Role-Based Product Actions**:
   - **Create**: `POST /api/products` (all roles)
   - **Update**: `PUT /api/products/{id}` (Auditor only)
   - **Delete**: `DELETE /api/products/{id}` (Admin only)

---

## Testing Paginated Results

1. **Launch Mobile App** on emulator/device.
2. **Login** using a registered user's credentials.
3. **Add Products** via backend (Postman or another client).
4. **Search & Pagination**:
   - Use the top search bar in-app to query by name/description.
   - Scroll or navigate pages to see cursor-based pagination in action.

---

## ObjectId Utility Class

A lightweight, type-safe identifier generator:

- **Prefixes**: `acc_` for accounts, `pro_` for products.
- **Encodings**: Hexadecimal and Base58 (bs58) for safe transport.
- **Reconstruction**: Parse back into `ObjectId` instances from any string form.
- **Integration**: Works seamlessly with cursor-based pagination for large datasets.

---

