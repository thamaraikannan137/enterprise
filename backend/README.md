# Enterprise Backend API

A production-ready Node.js/TypeScript REST API with MongoDB, featuring authentication, authorization, and comprehensive security.

## 🚀 Features

- **TypeScript** - Type-safe development
- **MongoDB + Mongoose** - Flexible NoSQL database with ODM
- **JWT Authentication** - Secure token-based auth with access & refresh tokens
- **Role-Based Access Control** - User role management (USER, ADMIN, SUPER_ADMIN)
- **Security** - Helmet, CORS, Rate Limiting
- **Validation** - Custom request validation
- **Logging** - Winston logger with multiple transports
- **Error Handling** - Centralized error management
- **Hot Reload** - Nodemon for development

## 📋 Prerequisites

- Node.js >= 18.x
- MongoDB >= 6.x
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/thamaraikannan137/enterprise.git
cd enterprise/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/enterprise
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
CORS_ORIGIN=http://localhost:5173
```

4. **Start MongoDB**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows - MongoDB runs as a service by default
```

## 🏃 Running the Application

**Development mode** (with hot reload):
```bash
npm run dev
```

**Production build**:
```bash
npm run build
npm start
```

**Linting**:
```bash
npm run lint
```

**Format code**:
```bash
npm run format
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Health Check
```
GET /health
```

### Authentication Endpoints

#### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "isActive": true
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

#### Get Profile
```http
GET /api/v1/auth/profile
Authorization: Bearer <access_token>
```

### User Management Endpoints

#### Get All Users (Admin only)
```http
GET /api/v1/users?page=1&limit=10
Authorization: Bearer <access_token>
```

#### Get User by ID
```http
GET /api/v1/users/:id
Authorization: Bearer <access_token>
```

#### Update User
```http
PUT /api/v1/users/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com"
}
```

#### Delete User (Admin only)
```http
DELETE /api/v1/users/:id
Authorization: Bearer <access_token>
```

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── constants.ts # App constants
│   │   ├── database.ts  # MongoDB connection
│   │   ├── env.ts       # Environment validation
│   │   └── logger.ts    # Winston logger
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Express middlewares
│   │   ├── auth.middleware.ts
│   │   ├── authorize.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── logging.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── validation.middleware.ts
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   │   └── v1/          # API version 1
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── validators/      # Request validators
├── .env.example         # Environment template
├── package.json
├── tsconfig.json
└── nodemon.json
```

## 🔐 Security Features

- **Helmet** - Sets security HTTP headers
- **CORS** - Configurable cross-origin resource sharing
- **Rate Limiting** - Prevents brute force attacks
- **JWT** - Secure token-based authentication
- **Password Hashing** - Bcrypt with salt rounds
- **Input Validation** - Custom validation on all inputs

## 🗄️ Database Schema

### User Model
```typescript
{
  email: String (unique, required)
  password: String (hashed, required)
  firstName: String (required)
  lastName: String (required)
  role: Enum ['USER', 'ADMIN', 'SUPER_ADMIN']
  isActive: Boolean
  createdAt: Date
  updatedAt: Date
}
```

## 🧪 Testing

```bash
npm test
```

For test coverage:
```bash
npm run test:coverage
```

## 🚢 Deployment

### Build for production
```bash
npm run build
```

### Environment Variables for Production
Make sure to set secure values for:
- `JWT_SECRET` - Use a strong 32+ character secret
- `MONGODB_URI` - Production MongoDB connection string
- `NODE_ENV=production`
- `CORS_ORIGIN` - Your frontend URL

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 📝 Migration from PostgreSQL/Sequelize

This project was migrated from PostgreSQL + Sequelize + Zod to MongoDB + Mongoose with custom validation. See [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Thamaraikannan**
- GitHub: [@thamaraikannan137](https://github.com/thamaraikannan137)

## 🙏 Acknowledgments

- Express.js for the web framework
- Mongoose for MongoDB ODM
- JWT for authentication
- Winston for logging

