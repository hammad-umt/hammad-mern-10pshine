# hammad-mern-10pshine

## Railway Deployment

This repository is configured for Railway using `railway.json`.

### Build and Start
- Install: `npm ci --omit=dev`
- Build: `npm run build`
- Start: `npm start`

### Required Environment Variables
- `MONGODB_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret used to sign/verify auth tokens.

### Optional Environment Variables
- `PORT`: Railway injects this automatically.
- `CLIENT_URL`: Used for password reset link generation.
- `EMAIL_USER`: Gmail address for reset emails.
- `EMAIL_PASS`: App password for `EMAIL_USER`.
- `SWAGGER_SERVER_URL`: Public API base URL for Swagger docs.