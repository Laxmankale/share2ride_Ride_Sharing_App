# Share2Go Backend API Testing Guide

**Base URL:** `http://localhost:8080`

---

## 🔓 PUBLIC ENDPOINTS (No JWT Required)

### 1. Home / Welcome

```
GET /
```

**JWT Required:** ❌ No
**Response:**

```
Welcome to Share2Go App!
```

---

### 2. User Registration

```
POST /api/users/register
```

**JWT Required:** ❌ No  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "name": "John Driver",
  "email": "john.driver@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "Driver"
}
```

**Response (201):**

```json
{
  "id": 1,
  "name": "John Driver",
  "email": "john.driver@example.com",
  "phone": "9876543210",
  "role": "Driver"
}
```

---

### 3. User Login (Get JWT Tokens)

```
POST /auth/login
```

**JWT Required:** ❌ No  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "email": "john.driver@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "name": "John Driver",
  "role": "Driver"
}
```

**Use the `accessToken` in Authorization header for protected endpoints:**

```
Authorization: Bearer <accessToken>
```
---

### 5. Search Rides (Public Browse)

```
GET /api/rides/search?origin=New%20York&destination=Los%20Angeles&departureTime=2025-11-20T10:00:00
```

**JWT Required:** ❌ No  
**Query Parameters:**

- `origin` (string) — Starting location
- `destination` (string) — Ending location
- `departureTime` (ISO 8601 datetime) — `2025-11-20T10:00:00`

**Response (200):**

```json
[
  {
    "id": 1,
    "driverId": 1,
    "origin": "New York",
    "destination": "Los Angeles",
    "departureTime": "2025-11-20T10:00:00",
    "seats": 4,
    "pricePerSeat": 50.0,
    "status": "Active"
  }
]
```

---

## 🔐 PROTECTED ENDPOINTS (JWT Required)

### How to Send JWT Token:

All protected endpoints require the **Authorization header** with Bearer token:

```
Authorization: Bearer <accessToken>
```

---

## 👤 User Management

### 6. Get All Users

```
GET /api/users
```

**JWT Required:** ✅ Yes  
**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
[
  {
    "id": 1,
    "name": "John Driver",
    "email": "john.driver@example.com",
    "phone": "9876543210",
    "role": "Driver"
  },
  {
    "id": 2,
    "name": "Jane Passenger",
    "email": "jane.passenger@example.com",
    "phone": "8765432109",
    "role": "Passenger"
  }
]
```

---

### 7. Get User by ID

```
GET /api/users/{id}
```

**JWT Required:** ✅ Yes  
**Path Parameter:** `{id}` = User ID (e.g., `1`)

**Example:**

```
GET /api/users/1
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
{
  "id": 1,
  "name": "John Driver",
  "email": "john.driver@example.com",
  "phone": "9876543210",
  "role": "Driver"
}
```

---

### 8. Update User

```
PUT /api/users/{id}
```

**JWT Required:** ✅ Yes  
**Path Parameter:** `{id}` = User ID (e.g., `1`)

**Example:**

```
PUT /api/users/1
```

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "John Driver Updated",
  "email": "john.updated@example.com",
  "phone": "9999999999",
  "password": "newpassword123",
  "role": "Driver"
}
```

**Response (200):**

```json
{
  "id": 1,
  "name": "John Driver Updated",
  "email": "john.updated@example.com",
  "phone": "9999999999",
  "role": "Driver"
}
```

---

### 9. Delete User

```
DELETE /api/users/{id}
```

**JWT Required:** ✅ Yes  
**Path Parameter:** `{id}` = User ID (e.g., `1`)

**Example:**

```
DELETE /api/users/1
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```
User deleted successfully!
```

---

### 10. Logout

```
POST /auth/logout
```

**JWT Required:** ❌ No  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "userId": 1
}
```

**Response (204):**

```
No Content
```

---

## 🚗 Ride Management

### 11. Create Ride (Driver Only)

```
POST /api/rides/driver/{driverId}
```

**JWT Required:** ✅ Yes  
**Role Required:** 👤 **DRIVER**  
**Path Parameter:** `{driverId}` = Driver's User ID (e.g., `1`)

**Example:**

```
POST /api/rides/driver/1
```

**Headers:**

```
Authorization: Bearer <driverAccessToken>
Content-Type: application/json
```

**Request Body:**

```json
{
  "origin": "New York",
  "destination": "Los Angeles",
  "departureTime": "2025-11-20T10:00:00",
  "seats": 4,
  "pricePerSeat": 50.0,
  "status": "Active"
}
```

**Response (200):**

```json
{
  "id": 1,
  "driverId": 1,
  "origin": "New York",
  "destination": "Los Angeles",
  "departureTime": "2025-11-20T10:00:00",
  "seats": 4,
  "pricePerSeat": 50.0,
  "status": "Active"
}
```

---

### 12. Get All Rides

```
GET /api/rides
```

**JWT Required:** ✅ Yes  
**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
[
  {
    "id": 1,
    "driverId": 1,
    "origin": "New York",
    "destination": "Los Angeles",
    "departureTime": "2025-11-20T10:00:00",
    "seats": 4,
    "pricePerSeat": 50.0,
    "status": "Active"
  }
]
```

---

### 13. Get Ride by ID

```
GET /api/rides/{id}
```

**JWT Required:** ✅ Yes  
**Path Parameter:** `{id}` = Ride ID (e.g., `1`)

**Example:**

```
GET /api/rides/1
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
{
  "id": 1,
  "driverId": 1,
  "origin": "New York",
  "destination": "Los Angeles",
  "departureTime": "2025-11-20T10:00:00",
  "seats": 4,
  "pricePerSeat": 50.0,
  "status": "Active"
}
```

---

### 14. Update Ride (Driver Only)

```
PUT /api/rides/{id}
```

**JWT Required:** ✅ Yes  
**Role Required:** 👤 **DRIVER**  
**Path Parameter:** `{id}` = Ride ID (e.g., `1`)

**Example:**

```
PUT /api/rides/1
```

**Headers:**

```
Authorization: Bearer <driverAccessToken>
Content-Type: application/json
```

**Request Body:**

```json
{
  "origin": "New York",
  "destination": "Los Angeles",
  "departureTime": "2025-11-20T10:00:00",
  "seats": 3,
  "pricePerSeat": 55.0,
  "status": "Active"
}
```

**Response (200):**

```json
{
  "id": 1,
  "driverId": 1,
  "origin": "New York",
  "destination": "Los Angeles",
  "departureTime": "2025-11-20T10:00:00",
  "seats": 3,
  "pricePerSeat": 55.0,
  "status": "Active"
}
```

---

### 15. Delete Ride (Driver Only)

```
DELETE /api/rides/{id}
```

**JWT Required:** ✅ Yes  
**Role Required:** 👤 **DRIVER**  
**Path Parameter:** `{id}` = Ride ID (e.g., `1`)

**Example:**

```
DELETE /api/rides/1
```

**Headers:**

```
Authorization: Bearer <driverAccessToken>
```

**Response (200):**

```
Ride deleted successfully
```

---

### 16. Get Driver's Rides (Driver Only)

```
GET /api/rides/driver/{driverId}
```

**JWT Required:** ✅ Yes  
**Role Required:** 👤 **DRIVER**  
**Path Parameter:** `{driverId}` = Driver's User ID (e.g., `1`)

**Example:**

```
GET /api/rides/driver/1
```

**Headers:**

```
Authorization: Bearer <driverAccessToken>
```

**Response (200):**

```json
[
  {
    "id": 1,
    "driverId": 1,
    "origin": "New York",
    "destination": "Los Angeles",
    "departureTime": "2025-11-20T10:00:00",
    "seats": 4,
    "pricePerSeat": 50.0,
    "status": "Active"
  }
]
```

---

## 🎫 Booking Management

### 17. Create Booking (Passenger Only)

```
POST /api/bookings
```

**JWT Required:** ✅ Yes  
**Role Required:** 👤 **PASSENGER**

**Headers:**

```
Authorization: Bearer <passengerAccessToken>
Content-Type: application/json
```

**Request Body:**

```json
{
  "rideId": 1,
  "passengerId": 2,
  "seatsBooked": 1,
  "totalPrice": 50.0,
  "status": "Confirmed"
}
```

**Response (200):**

```json
{
  "id": 1,
  "rideId": 1,
  "passengerId": 2,
  "seatsBooked": 1,
  "totalPrice": 50.0,
  "status": "Confirmed"
}
```

---

### 18. Get All Bookings

```
GET /api/bookings
```

**JWT Required:** ✅ Yes  
**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
[
  {
    "id": 1,
    "rideId": 1,
    "passengerId": 2,
    "seatsBooked": 1,
    "totalPrice": 50.0,
    "status": "Confirmed"
  }
]
```

---

### 19. Get Booking by ID

```
GET /api/bookings/{id}
```

**JWT Required:** ✅ Yes  
**Path Parameter:** `{id}` = Booking ID (e.g., `1`)

**Example:**

```
GET /api/bookings/1
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
{
  "id": 1,
  "rideId": 1,
  "passengerId": 2,
  "seatsBooked": 1,
  "totalPrice": 50.0,
  "status": "Confirmed"
}
```

---

### 20. Update Booking (Passenger Only)

```
PUT /api/bookings/{id}
```

**JWT Required:** ✅ Yes  
**Role Required:** 👤 **PASSENGER**  
**Path Parameter:** `{id}` = Booking ID (e.g., `1`)

**Example:**

```
PUT /api/bookings/1
```

**Headers:**

```
Authorization: Bearer <passengerAccessToken>
Content-Type: application/json
```

**Request Body:**

```json
{
  "rideId": 1,
  "passengerId": 2,
  "seatsBooked": 2,
  "totalPrice": 100.0,
  "status": "Confirmed"
}
```

**Response (200):**

```json
{
  "id": 1,
  "rideId": 1,
  "passengerId": 2,
  "seatsBooked": 2,
  "totalPrice": 100.0,
  "status": "Confirmed"
}
```

---

### 21. Get Passenger's Bookings

```
GET /api/bookings/passenger/{passengerId}
```

**JWT Required:** ✅ Yes  
**Path Parameter:** `{passengerId}` = Passenger's User ID (e.g., `2`)

**Example:**

```
GET /api/bookings/passenger/2
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
[
  {
    "id": 1,
    "rideId": 1,
    "passengerId": 2,
    "seatsBooked": 1,
    "totalPrice": 50.0,
    "status": "Confirmed"
  }
]
```

---

### 22. Get Bookings by Ride ID

```
GET /api/bookings/ride/{rideId}
```

**JWT Required:** ✅ Yes  
**Path Parameter:** `{rideId}` = Ride ID (e.g., `1`)

**Example:**

```
GET /api/bookings/ride/1
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
[
  {
    "id": 1,
    "rideId": 1,
    "passengerId": 2,
    "seatsBooked": 1,
    "totalPrice": 50.0,
    "status": "Confirmed"
  }
]
```

---

## 🔔 Notifications

### 23. Get User Notifications

```
GET /api/notifications/user/{userId}
```

**JWT Required:** ✅ Yes  
**Path Parameter:** `{userId}` = User ID (e.g., `1`)

**Example:**

```
GET /api/notifications/user/1
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
[
  {
    "id": 1,
    "userId": 1,
    "message": "Your ride has been confirmed",
    "isRead": false,
    "createdAt": "2025-11-14T15:30:00"
  }
]
```

---

### 24. Get Unread Notification Count

```
GET /api/notifications/user/{userId}/unread-count
```

**JWT Required:** ✅ Yes  
**Path Parameter:** `{userId}` = User ID (e.g., `1`)

**Example:**

```
GET /api/notifications/user/1/unread-count
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```
3
```

---

### 25. Mark Notification as Read

```
PUT /api/notifications/{id}/read
```

**JWT Required:** ✅ Yes  
**Path Parameter:** `{id}` = Notification ID (e.g., `1`)

**Example:**

```
PUT /api/notifications/1/read
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```
OK
```

---

### 26. Mark All Notifications as Read

```
PUT /api/notifications/user/{userId}/read-all
```

**JWT Required:** ✅ Yes  
**Path Parameter:** `{userId}` = User ID (e.g., `1`)

**Example:**

```
PUT /api/notifications/user/1/read-all
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```
OK
```

---

## 📝 Testing Flow (Step-by-Step)

### Step 1: Register Users

1. Register a **Driver** → `POST /api/users/register`
2. Register a **Passenger** → `POST /api/users/register`

### Step 2: Login & Get Tokens

1. Login as Driver → `POST /auth/login`
2. Login as Passenger → `POST /auth/login`

### Step 3: Create a Ride (Driver)

- Use Driver's JWT token → `POST /api/rides/driver/{driverId}`

### Step 4: Search Ride (Public)

- No JWT needed → `GET /api/rides/search?origin=X&destination=Y&departureTime=Z`

### Step 5: Create Booking (Passenger)

- Use Passenger's JWT token → `POST /api/bookings`

### Step 6: View Notifications

- Use any JWT token → `GET /api/notifications/user/{userId}`

---

## 🧪 Testing with cURL / Postman

### Example: Complete Flow

**1. Register Driver:**

```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Driver",
    "email": "john@example.com",
    "password": "pass123",
    "phone": "9999999999",
    "role": "Driver"
  }'
```

**2. Login as Driver:**

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "pass123"
  }'
```

**Copy the `accessToken` from response**

**3. Create Ride (Replace `TOKEN` with accessToken):**

```bash
curl -X POST http://localhost:8080/api/rides/driver/1 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "New York",
    "destination": "Los Angeles",
    "departureTime": "2025-11-20T10:00:00",
    "seats": 4,
    "pricePerSeat": 50.0,
    "status": "Active"
  }'
```

**4. Search Rides (No Token Needed):**

```bash
curl -X GET "http://localhost:8080/api/rides/search?origin=New%20York&destination=Los%20Angeles&departureTime=2025-11-20T10:00:00"
```

---

## ✅ JWT Token Requirements Summary

| Endpoint                                        | JWT Required | Role Required | Note           |
| ----------------------------------------------- | :----------: | :-----------: | -------------- |
| `GET /`                                         |      ❌      |       -       | Public         |
| `POST /api/users/register`                      |      ❌      |       -       | Public         |
| `POST /auth/login`                              |      ❌      |       -       | Public         |
| `POST /auth/refresh`                            |      ❌      |       -       | Public         |
| `POST /auth/logout`                             |      ❌      |       -       | Public         |
| `GET /api/rides/search`                         |      ❌      |       -       | Public         |
| `GET /api/users`                                |      ✅      |       -       | Any user       |
| `GET /api/users/{id}`                           |      ✅      |       -       | Any user       |
| `PUT /api/users/{id}`                           |      ✅      |       -       | Any user       |
| `DELETE /api/users/{id}`                        |      ✅      |       -       | Any user       |
| `POST /api/rides/driver/{id}`                   |      ✅      |    Driver     | Driver only    |
| `GET /api/rides`                                |      ✅      |       -       | Any user       |
| `GET /api/rides/{id}`                           |      ✅      |       -       | Any user       |
| `PUT /api/rides/{id}`                           |      ✅      |    Driver     | Driver only    |
| `DELETE /api/rides/{id}`                        |      ✅      |    Driver     | Driver only    |
| `GET /api/rides/driver/{id}`                    |      ✅      |    Driver     | Driver only    |
| `POST /api/bookings`                            |      ✅      |   Passenger   | Passenger only |
| `GET /api/bookings`                             |      ✅      |       -       | Any user       |
| `GET /api/bookings/{id}`                        |      ✅      |       -       | Any user       |
| `PUT /api/bookings/{id}`                        |      ✅      |   Passenger   | Passenger only |
| `GET /api/bookings/passenger/{id}`              |      ✅      |       -       | Any user       |
| `GET /api/bookings/ride/{id}`                   |      ✅      |       -       | Any user       |
| `GET /api/notifications/user/{id}`              |      ✅      |       -       | Any user       |
| `GET /api/notifications/user/{id}/unread-count` |      ✅      |       -       | Any user       |
| `PUT /api/notifications/{id}/read`              |      ✅      |       -       | Any user       |
| `PUT /api/notifications/user/{id}/read-all`     |      ✅      |       -       | Any user       |
