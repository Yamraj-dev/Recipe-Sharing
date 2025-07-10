# Recipe Sharing App

This project is under active development.  
More features, documentation, and setup instructions will be added soon!

Stay tuned 🚀

---

## Features

- User registration and authentication
- Recipe creation and sharing
- Image upload with Cloudinary
- Follows system for users

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary for image uploads

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Cloudinary account

### Installation

1. Clone the repository:
   ```
   git clone <your-repo-url>
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```
   PORT=8000
   MongooDB_URL=<your-mongodb-url>
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   Access_Token=<your-jwt-access-token-secret>
   Access_T_Expiry=1d
   Refresh_Token=<your-jwt-refresh-token-secret>
   Refresh_Token_Expiry=7d
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

```
src/
  app.js
  const.js
  index.js
  controller/
    user.controller.js
  db/
    db.js
  middleware/
    auth.middleware.js
    multer.middleware.js
  model/
    follow.model.js
    recipe.model.js
    user.model.js
  routes/
    user.routes.js
  util/
    ApiError.js
    ApiResponse.js
    asyncHandler.js
    cloudinariy.js
public/
  temp/
```

## API Documentation

Coming soon...

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any bugs or feature requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.