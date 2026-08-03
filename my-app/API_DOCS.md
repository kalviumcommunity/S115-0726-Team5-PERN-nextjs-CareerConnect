# CareerConnect API Documentation

All API responses follow a standardized format.

**Success Response Format:**
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... },
  "meta": { "page": 1, "limit": 10, "total": 50, "totalPages": 5 } // Optional, for paginated results
}
```

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ // Optional, for validation errors
    { "field": "email", "message": "Invalid email address" }
  ]
}
```

---

## Authentication Endpoints

### Register New User
- **Method:** `POST`
- **URL:** `/api/auth/register`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!",
    "role": "CANDIDATE" // or "EMPLOYER"
  }
  ```
- **Success Response (201):** User data (excluding password)
- **Error Response (400):** Validation errors or user already exists

### Sign In (NextAuth)
- **Method:** `POST`
- **URL:** `/api/auth/callback/credentials`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Success Response (200):** NextAuth session info
- **Error Response (401):** Invalid credentials

### Logout
- **Method:** `POST`
- **URL:** `/api/auth/logout`
- **Auth Required:** Yes
- **Success Response (200):** Clear session cookie

---

## Jobs Endpoints

### List Jobs
- **Method:** `GET`
- **URL:** `/api/jobs`
- **Auth Required:** No
- **Query Params:** `page`, `limit`, `search`, `category`, `type`, `location`
- **Success Response (200):** Paginated list of jobs

### Create Job
- **Method:** `POST`
- **URL:** `/api/jobs`
- **Auth Required:** Yes
- **Role Required:** `EMPLOYER`
- **Request Body:**
  ```json
  {
    "title": "Software Engineer",
    "description": "Job description here",
    "requirements": ["React", "Node.js"],
    "location": "Remote",
    "salary": "100k - 150k",
    "type": "FULL_TIME",
    "companyId": "uuid"
  }
  ```
- **Success Response (201):** Created job details

### Get Job Details
- **Method:** `GET`
- **URL:** `/api/jobs/:id`
- **Auth Required:** No
- **Success Response (200):** Job details with company info
- **Error Response (404):** Job not found

### Update Job
- **Method:** `PUT`
- **URL:** `/api/jobs/:id`
- **Auth Required:** Yes
- **Role Required:** `EMPLOYER` (Must own the job)
- **Request Body:** Partial job fields to update
- **Success Response (200):** Updated job details

### Delete Job
- **Method:** `DELETE`
- **URL:** `/api/jobs/:id`
- **Auth Required:** Yes
- **Role Required:** `EMPLOYER` (Must own the job)
- **Success Response (200):** Deletion confirmation

---

## Applications Endpoints

### List Applications
- **Method:** `GET`
- **URL:** `/api/applications`
- **Auth Required:** Yes
- **Role Context:** 
  - `CANDIDATE`: Gets their own applications
  - `EMPLOYER`: Gets applications for their posted jobs
- **Success Response (200):** Paginated applications

### Apply to Job
- **Method:** `POST`
- **URL:** `/api/applications`
- **Auth Required:** Yes
- **Role Required:** `CANDIDATE`
- **Request Body:**
  ```json
  {
    "jobId": "uuid",
    "resumeUrl": "https://link.to/resume.pdf",
    "coverLetter": "Brief intro"
  }
  ```
- **Success Response (201):** Application details
- **Error Response (400):** Already applied

### Get Application
- **Method:** `GET`
- **URL:** `/api/applications/:id`
- **Auth Required:** Yes
- **Role Required:** Must own application (candidate) or own the job (employer)
- **Success Response (200):** Application details

### Update Application Status
- **Method:** `PATCH`
- **URL:** `/api/applications/:id`
- **Auth Required:** Yes
- **Role Required:** `EMPLOYER`
- **Request Body:**
  ```json
  {
    "status": "SHORTLISTED" // REJECTED, HIRED, etc.
  }
  ```
- **Success Response (200):** Updated application

### Batch Update Applications
- **Method:** `PATCH`
- **URL:** `/api/applications/batch-update`
- **Auth Required:** Yes
- **Role Required:** `EMPLOYER`
- **Request Body:**
  ```json
  {
    "applicationIds": ["uuid1", "uuid2"],
    "status": "REJECTED"
  }
  ```
- **Success Response (200):** Batch update confirmation

---

## Notifications Endpoints

### List Notifications
- **Method:** `GET`
- **URL:** `/api/notifications`
- **Auth Required:** Yes
- **Success Response (200):** Paginated notifications for current user

### Mark Notification as Read
- **Method:** `PATCH`
- **URL:** `/api/notifications/:id/read`
- **Auth Required:** Yes
- **Success Response (200):** Updated notification

### Mark Multiple as Read
- **Method:** `PATCH`
- **URL:** `/api/notifications/read`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "notificationIds": ["uuid1", "uuid2"]
  }
  ```
- **Success Response (200):** Confirmation

---

## Companies Endpoints

### List Companies
- **Method:** `GET`
- **URL:** `/api/companies`
- **Auth Required:** No
- **Success Response (200):** Paginated company list

### Create Company
- **Method:** `POST`
- **URL:** `/api/companies`
- **Auth Required:** Yes
- **Role Required:** `EMPLOYER`
- **Request Body:**
  ```json
  {
    "name": "Tech Corp",
    "website": "https://techcorp.example",
    "description": "Leading tech company",
    "logo": "https://link/logo.png"
  }
  ```
- **Success Response (201):** Created company

### Get Company
- **Method:** `GET`
- **URL:** `/api/companies/:id`
- **Auth Required:** No
- **Success Response (200):** Company details

### Update Company
- **Method:** `PUT`
- **URL:** `/api/companies/:id`
- **Auth Required:** Yes
- **Role Required:** `EMPLOYER` (Must be the company creator)
- **Request Body:** Partial company fields
- **Success Response (200):** Updated company

### Delete Company
- **Method:** `DELETE`
- **URL:** `/api/companies/:id`
- **Auth Required:** Yes
- **Role Required:** `EMPLOYER` (Must be the company creator)
- **Success Response (200):** Deletion confirmation

---

## Users Endpoints

### Get Current User Profile
- **Method:** `GET`
- **URL:** `/api/users/me`
- **Auth Required:** Yes
- **Success Response (200):** Current user data

### Update Profile
- **Method:** `PATCH`
- **URL:** `/api/users/me`
- **Auth Required:** Yes
- **Request Body:** Partial profile fields (e.g., bio, skills, resumeUrl)
- **Success Response (200):** Updated profile data

---

## Dashboard Endpoints

### Get Statistics
- **Method:** `GET`
- **URL:** `/api/dashboard/stats`
- **Auth Required:** Yes
- **Role Context:**
  - `CANDIDATE`: Total applied, shortlisted, pending
  - `EMPLOYER`: Total active jobs, total applications received, hired count
  - `ADMIN`: Platform-wide stats (total users, total jobs)
- **Success Response (200):** Statistics object
