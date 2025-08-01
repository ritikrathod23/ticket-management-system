
# 🎫Ticket Management System

A role-based support ticket management system built with Node.js, Express, and MongoDB. This backend powers a helpdesk-style application where users can create tickets, and agents/admins can manage them.


## Features

- User authentication & authorization (JWT-based)
- Role-based access control (User, Agent, Admin)
- Ticket CRUD operations
- Filtering, searching, and pagination
- Environment-based configuration
- Scalable and secure structure

## Tech Stack


**Server:** 
- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Token (JWT)
- bcryptjs
- dotenv


## 🚀 Installation

1. **Clone the Repository**

```bash
 git clone https://github.com/ritikrathod23/ticket-management-system.git
cd ticket-management-system
```
**Install Dependencies**
```bash
npm install
```

**Run the Server**
```bash
# Development
npm run dev

# Production
npm start
```
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT = 5000`
`MONGO_URI = your_mongodb_connection_string`
`JWT_SECRET = your_secret_key`
`NODE_ENV = development`




## 📚API Reference

####  Auth

```http
  POST /auth/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `register` | `string` | Register new user         |
| `login` | `string` | login user         |

#### Ticket
#####	

| Parameter | Method    |Description                       |
| :-------- | :------- | :-------------------------------- |
|/tickets/   |POST |Create a new ticket | 
|/tickets/|GET |Get all tickets|
|/tickets/my|GET|Get own tickets|
|/tickets/:id|GET|Get single ticket|
|/tickets/:id|PATCH|Update a ticket|
|/tickets/:id|DELETE|Delete a ticket|




####  Admin
```http
  POST /Admin
```
| Parameter | Method    |Description                       |
| :-------- | :------- | :-------------------------------- |
|/users  |GET | View all users |
|/ users/:id/role| PATCH|Change user role| 
|/users/:id/status|PATCH|Activate/Deactivate user|


### Query Parameters for Tickets
```http
  status=open|in-progress|closed
```
```http
  priority=low|medium|high
```
```http
  search=<keyword>
```
```http
  page=1
```
```http
  limit=10
```

## License
This project is licensed under the MIT License.

