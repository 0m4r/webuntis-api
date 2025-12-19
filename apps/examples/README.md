# WebUntis API Examples

This Nx app hosts comprehensive examples demonstrating how to use the WebUntis API effectively. The sources live in `apps/examples/src` and progress from basic usage to advanced, production-ready implementations.

## 📁 Files Overview

### Configuration

- **`config.ts`** - Central configuration file with account data placeholders and validation functions

### Examples (Progressive Complexity)

1. **`01-basic-example.ts`** - Simple authentication and basic data retrieval
2. **`02-intermediate-example.ts`** - Advanced features with error handling and multiple auth methods
3. **`03-comprehensive-example.ts`** - Production-ready implementation with full feature set

## 🚀 Getting Started

### Prerequisites

1. **Node.js** (version 14 or higher)
2. **TypeScript** (for development)
3. **WebUntis Account** with API access
4. **Required Dependencies**:
   ```bash
   npm install otplib
   # or
   yarn add otplib
   ```

### Setup Instructions

1. **Configure Your Credentials**

   Edit `src/config.ts` and replace the placeholder values with your actual WebUntis credentials:

````typescript
export const basicAuthConfig = {
    school: 'your-actual-school-name', // Replace with your school identifier
    username: 'your-actual-username', // Replace with your username
        password: 'your-actual-password', // Replace with your password
        baseUrl: 'your-school.webuntis.com', // Replace with your WebUntis URL
        identity: 'WebUntis-API-Examples',
    };
    ```

2. **Install Dependencies**

    From the project root directory:

    ```bash
    npm install
    # or
    yarn install
    ```

3. **Compile TypeScript** (if needed)
    ```bash
    npx tsc
    # or
    yarn tsc
    ```

## 📚 Example Descriptions

### 1. Basic Example (`01-basic-example.ts`)

**Purpose**: Introduction to WebUntis API fundamentals

**Features Demonstrated**:

-   ✅ Basic username/password authentication
-   ✅ Session management (login/logout)
-   ✅ Fetching school information (school year, subjects, classes)
-   ✅ Basic error handling
-   ✅ Configuration validation

**What You'll Learn**:

-   How to create a WebUntis client
-   Basic authentication flow
-   Retrieving fundamental school data
-   Proper session cleanup

**Run Command**:

```bash
node dist/01-basic-example.js
````

### 2. Intermediate Example (`02-intermediate-example.ts`)

**Purpose**: Advanced API usage with multiple authentication methods

**Features Demonstrated**:

- ✅ Multiple authentication methods (basic + secret)
- ✅ Advanced timetable operations
- ✅ Error handling with retry logic
- ✅ Working with homework and exams
- ✅ Data filtering and processing
- ✅ Weekly and daily schedule analysis

**What You'll Learn**:

- OTP-based authentication
- Advanced timetable queries
- Robust error handling patterns
- Data analysis techniques
- Performance considerations

**Run Command**:

```bash
node dist/02-intermediate-example.js
```

### 3. Comprehensive Example (`03-comprehensive-example.ts`)

**Purpose**: Production-ready implementation with full feature set

**Features Demonstrated**:

- ✅ All authentication methods (basic, secret, QR, anonymous)
- ✅ Comprehensive data analysis and reporting
- ✅ Performance monitoring and optimization
- ✅ Bulk operations with rate limiting
- ✅ Advanced logging and monitoring
- ✅ Production-ready error handling
- ✅ Resource management and cleanup

**What You'll Learn**:

- Enterprise-grade implementation patterns
- Performance monitoring techniques
- Advanced data analysis
- Scalable architecture patterns
- Production deployment considerations

**Run Command**:

```bash
node dist/03-comprehensive-example.js
```

## 🔧 Configuration Guide

### Authentication Methods

The examples support four authentication methods:

#### 1. Basic Authentication (Username/Password)

```typescript
export const basicAuthConfig = {
  school: "your-school-name",
  username: "your-username",
  password: "your-password",
  baseUrl: "your-school.webuntis.com",
  identity: "WebUntis-API-Examples",
};
```

### Build the bundled examples

Use Nx to bundle the examples to `apps/examples/dist` (the core library build will run first):

```bash
yarn nx run examples:build
```

#### 2. Secret-Based Authentication (OTP)

```typescript
export const secretAuthConfig = {
  school: "your-school-name",
  username: "your-username",
  secret: "your-OTP-secret", // Base32-encoded secret
  baseUrl: "your-school.webuntis.com",
  identity: "WebUntis-API-Examples",
};
```

#### 3. QR Code Authentication

```typescript
export const qrAuthConfig = {
  qrCodeData: "untis://setschool?url=...", // Scanned QR code data
  identity: "WebUntis-API-Examples",
};
```

#### 4. Anonymous Authentication

```typescript
export const anonymousAuthConfig = {
  school: "your-school-name",
  baseUrl: "your-school.webuntis.com",
  identity: "WebUntis-API-Examples",
};
```

### Configuration Validation

Each example includes built-in configuration validation:

```typescript
if (!validateBasicAuthConfig()) {
  console.error("Please update config.ts with your credentials");
  return;
}
```

## 🛠️ Common Use Cases

### Getting Student Timetable

```typescript
// Today's timetable
const todayLessons = await untis.getOwnTimetableForToday();

// Specific date
const date = new Date("2024-01-15");
const dayLessons = await untis.getOwnTimetableFor(date);

// Date range
const startDate = new Date("2024-01-15");
const endDate = new Date("2024-01-21");
const weekLessons = await untis.getOwnTimetableForRange(startDate, endDate);
```

### Getting Class Timetable

```typescript
// Get all classes
const classes = await untis.getClasses(true, currentSchoolYear.id);

// Get timetable for specific class
const classTimetable = await untis.getTimetableForToday(classes[0].id, WebUntisElementType.CLASS);
```

### Working with Homework

```typescript
const startDate = new Date();
const endDate = new Date();
endDate.setDate(startDate.getDate() + 7);

const homework = await untis.getHomeWorksFor(startDate, endDate);
```

### Error Handling Best Practices

```typescript
try {
  const result = await untis.someOperation();
  // Handle success
} catch (error) {
  if (error.message.includes("Session is not valid")) {
    // Re-authenticate
    await untis.login();
    // Retry operation
  } else {
    // Handle other errors
    console.error("Operation failed:", error.message);
  }
}
```

## 🔍 Troubleshooting

### Common Issues

#### Authentication Failures

- ✅ Verify school identifier is correct
- ✅ Check username and password
- ✅ Ensure base URL is correct (without https://)
- ✅ Confirm your account has API access

#### Session Expired Errors

- ✅ Implement session validation before operations
- ✅ Use retry logic with re-authentication
- ✅ Keep sessions active with periodic calls

#### Rate Limiting

- ✅ Add delays between bulk operations
- ✅ Implement exponential backoff
- ✅ Process data in batches

#### Missing Data

- ✅ Check if your account has access to requested data
- ✅ Verify date ranges are valid
- ✅ Ensure school year parameters are correct

### Debug Mode

Enable debug logging by setting the environment variable:

```bash
DEBUG=webuntis* node dist/01-basic-example.js
```

## 📊 Performance Tips

1. **Batch Operations**: Process multiple requests in batches
2. **Parallel Requests**: Use `Promise.all()` for independent operations
3. **Caching**: Cache frequently accessed data (school years, subjects, etc.)
4. **Session Management**: Reuse sessions, logout when done
5. **Rate Limiting**: Respect server limits with delays

## 🔒 Security Best Practices

1. **Environment Variables**: Store credentials in environment variables
2. **Configuration Files**: Never commit credentials to version control
3. **Session Timeout**: Implement proper session timeout handling
4. **Error Logging**: Don't log sensitive information
5. **HTTPS**: Always use HTTPS for production

## 📖 API Reference

For complete API documentation, visit [the documentation](https://0m4r.github.io/webuntis-api/)

### Key Classes

- `WebUntis` - Basic authentication
- `WebUntisSecretAuth` - OTP-based authentication
- `WebUntisQR` - QR code authentication
- `WebUntisAnonymousAuth` - Anonymous access

### Key Methods

- `login()` - Authenticate and create session
- `logout()` - End session and cleanup
- `getOwnTimetableForToday()` - Get today's timetable
- `getOwnTimetableForRange()` - Get timetable for date range
- `getSubjects()` - Get all subjects
- `getClasses()` - Get all classes
- `getTeachers()` - Get all teachers
- `getRooms()` - Get all rooms

## 🤝 Contributing

If you find issues or have improvements for these examples:

1. Check existing issues on the main repository
2. Create detailed bug reports with example code
3. Submit pull requests with improvements
4. Add new examples for specific use cases

## 📄 License

These examples are provided under the same license as the main WebUntis library.

## 🆘 Support

For support:

1. Check [the documentation ](https://0m4r.github.io/webuntis-api/)
2. Review these examples for common patterns
3. Search existing issues on GitHub
4. Create new issues with detailed information

---

**Happy coding! 🚀**
