# ScourgeStories API Documentation

**Base URL:**  
`https://scourgestories.onrender.com/api/v1`

---

## Table of Contents
1. [Authentication Collection](#authentication-collection)
2. [Stories Collection](#stories-collection)
   - [Get All Stories](#get-all-stories)
   - [Get Story by ID](#get-story-by-id)
   - [Create Story](#create-story)
   - [Update Story](#update-story)
   - [Delete Story](#delete-story)
3. [Config Collection](#config-collection)
4. [Sources Collection](#sources-collection)
5. [Health Check](#health-check)

---

## Authentication Collection

### Login
**Endpoint:**  
`POST /users/login`

**Body (JSON):**
```json
{
  "username": "dave",
  "password": "pass12345"
}
```

**Response:**  
On successful login, the API returns a JWT token that must be included in the `Authorization` header as a Bearer token for protected routes.

---

## Stories Collection

### Get All Stories
**Endpoint:**  
`GET /stories`

**Query Parameters:**
- `regex`: Search stories by title (e.g., `regex=world`).
- `created_at_gteq` & `created_at_lteq`: Search for stories within a date range.
- `page` & `limit`: Pagination controls.

**Example:**  
`GET /stories?regex=world&created_at_gteq=2024-01-01&created_at_lteq=2024-12-31&page=1&limit=10`

---

### Get Story by ID
**Endpoint:**  
`GET /stories/:id`

**Requirements:**  
User must be logged in and include a JWT token in the `Authorization` header.

---

### Create Story
**Endpoint:**  
`POST /stories`

**Requirements:**  
User must be logged in.

**Request Body (JSON):**
```json
{
  "title": "kamla gets shot at houston",
  "shortTitle": "shots fired",
  "summary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  "sourceLink": "https://www.google.com",
  "categories": ["672ce2c353a796ef0465838c", "672ce2c353a796ef0465838e"],
  "tags": ["shoot", "usa", "kamala"],
  "source": "673df21112e56bedfc2cfa03",
  "images": [
    "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
    "https://fastly.picsum.photos/id/315/200/200.jpg?hmac=cE5OEQSh9gvXqkP0fkrmaSbqLfc_KQdDPtH7yBbeuiQ"
  ]
}
```

**Notes:**
- Only use pre-existing categories and sources from the Config endpoint.
- Avoid sending a tag with the same name as a category.

---

### Update Story
**Endpoint:**  
`PATCH /stories/:id`

**Requirements:**  
User must be logged in.

**Request Body (Partial Updates Allowed):**
- To create new tags: `createTags: ["new_tag"]`
- To delete existing tags: `deleteTags: ["tag_id"]`

---

### Delete Story
**Endpoint:**  
`DELETE /stories/:id`

**Requirements:**  
User must be logged in.

---

## Config Collection

### Get Config
**Endpoint:**  
`GET /config`

**Description:**  
Retrieve available categories and sources to use in the Stories collection.

---

## Sources Collection

### Create Source
**Endpoint:**  
`POST /sources`

**Requirements:**  
User must be logged in.

**Request Body (JSON):**
```json
{
  "name": "Verge",
  "source_url": "https://www.theverge.com/icons/favicon.ico"
}
```

**Notes:**  
Extract the `source_url` from the website's HTML `<link rel="icon">`.

---

### Update Source
**Endpoint:**  
`PATCH /sources/:id`

**Requirements:**  
User must be logged in.

---

### Delete Source
**Endpoint:**  
`DELETE /sources/:id`

**Requirements:**  
User must be logged in.

---

## Health Check

**Endpoint:**  
`GET /health`

**Description:**  
Verify if the API is up and running. Returns a simple status response.

---

## Authorization
**Logged In Requirement:**  
For protected endpoints, include the JWT token in the `Authorization` header as follows:

```
Authorization: Bearer <your_token>
```

---

Feel free to use this documentation for interacting with the ScourgeStories API.
