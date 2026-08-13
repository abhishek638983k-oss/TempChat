# Mistakes & Conventions to Follow

## 🔴 Critical Mistakes Made

### 1. **CSS & Styling Issues**

- ❌ Mistake: Tried to use shared CSS files when separate styling per page was needed
- ✅ Convention: **Each EJS page should have its own separate CSS file**
- ✅ Always link CSS properly in EJS files: `<link rel="stylesheet" href="/css/pageName.css">`
- ✅ Maintain consistent folder structure: `public/css/pageName.css` for each page

### 2. **Data Type Mismatches**

- ❌ Mistake: Sending EJS templates when JSON is expected in API responses
- ✅ Convention: **Be clear about response types:**
    - API routes should return JSON: `res.json({...})`
    - View routes should render EJS: `res.render('viewName')`
    - Never mix response types in the same route

### 3. **Password Hashing Inconsistency**

- ❌ Mistake: Database passwords stored in plain text, causing login failures when hashing implementation changed
- ✅ Convention: **Always hash passwords before storing in database**
- ✅ Ensure password comparison during login matches the hashing method used during registration
- ✅ Script: Use migration scripts to hash existing passwords (handle with try-catch)

### 4. **Missing Error Handling**

- ❌ Mistake: No try-catch blocks, errors not caught and displayed properly
- ✅ Convention: **Wrap all async operations in try-catch blocks:**
    ```javascript
    try {
        // Operation
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Description of what failed" });
    }
    ```

### 5. **Database Reference Issues**

- ❌ Mistake: Storing usernames directly instead of referencing User IDs
- ✅ Convention: **Use proper database relationships:**
    - Store user `_id` (ObjectId) in references, not usernames
    - Always update references when schemas change
    - Use populate() for MongoDB relationships: `User.findById(id).populate('userId')`

### 6. **Model Schema Problems**

- ❌ Mistake: Middleware callbacks using `next` incorrectly in models
- ✅ Convention: **Pre-hooks in Mongoose should properly handle next():**
    ```javascript
    userSchema.pre("save", async function (next) {
        // Your logic
        next(); // Call next when done
    });
    ```

---

## ✅ Best Practices & Conventions

### File Organization

```
backend/chatApp/
├── config/        → Database configuration
├── controller/    → Business logic (one per feature)
├── middleware/    → Auth, validation, error handling
├── model/         → Database schemas
├── routes/        → API routes
├── public/        → Static files
│   ├── css/      → Separate file per page
│   ├── js/       → Separate file per page
├── views/        → EJS templates (one per page)
└── index.js      → Server entry point
```

### Controller Logic

- Keep controllers focused on single responsibility
- One controller file per major feature
- Handle all validation and error-checking before DB operations
- Return consistent response format: `{ success: boolean, data: {}, error: string }`

### API Responses

```javascript
// Success
res.status(200).json({ success: true, data: {...} });

// Error
res.status(400).json({ success: false, error: 'Description' });

// Server Error
res.status(500).json({ success: false, error: 'Internal server error' });
```

### Database Naming Conventions

- Use camelCase for field names: `firstName`, `emailAddress`, `createdAt`
- Use descriptive names: `fromUserId` instead of `from`, `toUserId` instead of `to`
- Always include timestamps: `createdAt`, `updatedAt`
- Use ObjectId references for relationships: `userId: { type: Schema.Types.ObjectId, ref: 'User' }`

### Middleware Usage

- Authentication middleware should verify JWT/Session before route handler
- Always attach user data to `req.user` for downstream use
- Handle 401/403 errors properly in middleware

### Password & Security

- Hash passwords using bcrypt with salt rounds ≥ 10
- Compare passwords using bcrypt.compare(), never direct string comparison
- Store plain text credentials only in `.env` or `secrets.json` (for testing)
- Never log passwords or sensitive data

### Data Validation

- Validate input data before processing
- Check data types match expectations
- Provide meaningful error messages for validation failures
- Example: If expecting JSON, check `Content-Type: application/json`

### Error Handling Pattern

```javascript
// Consistent error handling across all controllers
if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
}

if (!password) {
    return res
        .status(400)
        .json({ success: false, error: "Password is required" });
}

try {
    // Operation
} catch (error) {
    console.error("Detailed error:", error);
    return res.status(500).json({ success: false, error: "Operation failed" });
}
```

---

## 📋 Common Issues Checklist

Before committing code, verify:

- [ ] All API responses are JSON with consistent format
- [ ] EJS templates are properly linked to their CSS files
- [ ] All async operations wrapped in try-catch
- [ ] Passwords are hashed before storing/comparing
- [ ] Database references use ObjectId, not strings/usernames
- [ ] Error messages are descriptive and helpful
- [ ] No console.error without proper logging
- [ ] CSS files are separate for each page
- [ ] Middleware properly calls `next()` and `next(error)`
- [ ] Status codes are appropriate (200, 400, 401, 403, 404, 500)

---

## 🎯 Project-Specific Issues

### Chat Feature

- Always use user IDs for `from` and `to`, not usernames
- Verify both users exist before creating chat
- Handle case where sender/receiver might not exist

### Authentication

- Validate email/username format before processing
- Ensure password meets minimum requirements
- Check if user already exists during registration
- Return proper error for invalid credentials on login

### Styling

- Home page: `home.css`
- Login page: `login.css`
- Chat page: `chat.css`
- Profile page: `profile.css` (if exists)
- Navigation: Include in each page or use shared component

---

## 🚨 Recent Critical Fixes

1. **User Model**: Changed `from`/`to` fields from storing usernames to storing user IDs
2. **Password Hashing**: Implemented consistent bcrypt hashing across registration and login
3. **CSS Separation**: Each EJS page must have dedicated CSS file in `public/css/`
4. **Error Handling**: Added try-catch blocks to prevent unhandled rejections
5. **Database Schema**: Fixed middleware hooks to properly handle `next()` callback

---

## 💡 Tips for Future Development

1. Always test login flow after any authentication changes
2. Create migration scripts for database structure changes
3. Maintain secrets.json for test credentials
4. Use consistent naming: if field is userId, use it everywhere
5. Document database schema changes in model files
6. Test API endpoints with Postman/Insomnia before UI integration
7. Clear browser cache when CSS doesn't update
8. Use `console.error()` for actual errors, not debugging info
