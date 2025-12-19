/**
 * Configuration file for WebUntis API examples
 *
 * This file contains the common configuration settings and account data
 * that will be used across all the example files.
 *
 * IMPORTANT: Replace the placeholder values with your actual WebUntis credentials
 * before running any of the examples.
 */

// =============================================================================
// COMMON CONFIGURATION BASE
// =============================================================================

/**
 * Common configuration parameters shared across all authentication methods
 * This eliminates duplication and ensures consistency
 */
const commonAuthParams = {
  // Your school's identifier (usually the subdomain of your WebUntis URL)
  school: "your-school-name",

  // The base URL of your WebUntis server (without https://)
  // Example: 'yourschool.webuntis.com' or 'webuntis.yourschool.edu'
  baseUrl: "your-school.webuntis.com",

  // Optional: Custom identity for your application
  identity: "WebUntis-API-Examples",
};

/**
 * Common user credentials (used by basic and secret auth)
 */
const commonUserCredentials = {
  // Your WebUntis username
  username: "your-username",
};

// =============================================================================
// BASIC AUTHENTICATION CONFIGURATION
// =============================================================================

/**
 * Basic username/password authentication configuration
 * This is the most common authentication method for WebUntis
 */
export const basicAuthConfig = {
  ...commonAuthParams,
  ...commonUserCredentials,

  // Your WebUntis password
  password: "your-password",
};

// =============================================================================
// SECRET-BASED AUTHENTICATION CONFIGURATION
// =============================================================================

/**
 * Secret-based authentication configuration (requires TOTP)
 * This method uses a shared secret for generating time-based one-time passwords
 */
export const secretAuthConfig = {
  ...commonAuthParams,
  ...commonUserCredentials,

  // Your TOTP secret (obtained from WebUntis settings)
  // This is typically a base32-encoded string like 'JBSWY3DPEHPK3PXP'
  secret: "your-totp-secret",
};

// =============================================================================
// QR CODE AUTHENTICATION CONFIGURATION
// =============================================================================

/**
 * QR code authentication configuration
 * This method uses data from a scanned QR code for authentication
 */
export const qrAuthConfig = {
  // Only include identity from common params (school and baseUrl are in QR code)
  identity: commonAuthParams.identity,

  // The QR code data string (obtained by scanning the QR code from WebUntis)
  // Format: 'untis://setschool?url=[...]&school=[...]&user=[...]&key=[...]&schoolNumber=[...]'
  qrCodeData: "untis://setschool?url=your-qr-data-here",
};

// =============================================================================
// ANONYMOUS AUTHENTICATION CONFIGURATION
// =============================================================================

/**
 * Anonymous authentication configuration
 * This method only works if your school supports public access
 */
export const anonymousAuthConfig = {
  ...commonAuthParams,
};

// =============================================================================
// GENERAL CONFIGURATION
// =============================================================================

/**
 * General configuration options that apply to all authentication methods
 */
export const generalConfig = {
  // Whether to disable the custom User-Agent header
  disableUserAgent: false,

  // Timeout for API requests (in milliseconds)
  requestTimeout: 10000,

  // Whether to enable debug logging
  enableDebugLogging: false,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Validates that the basic authentication configuration is properly set
 * @returns {boolean} True if configuration is valid
 */
export function validateBasicAuthConfig(): boolean {
  const required = ["school", "username", "password", "baseUrl"];
  const missing = required.filter(
    (key) =>
      !basicAuthConfig[key as keyof typeof basicAuthConfig] ||
      basicAuthConfig[key as keyof typeof basicAuthConfig].startsWith("your-"),
  );

  if (missing.length > 0) {
    console.error("Missing or placeholder values in basicAuthConfig:", missing);
    return false;
  }

  return true;
}

/**
 * Validates that the secret authentication configuration is properly set
 * @returns {boolean} True if configuration is valid
 */
export function validateSecretAuthConfig(): boolean {
  const required = ["school", "username", "secret", "baseUrl"];
  const missing = required.filter(
    (key) =>
      !secretAuthConfig[key as keyof typeof secretAuthConfig] ||
      secretAuthConfig[key as keyof typeof secretAuthConfig].startsWith("your-"),
  );

  if (missing.length > 0) {
    console.error("Missing or placeholder values in secretAuthConfig:", missing);
    return false;
  }

  return true;
}

/**
 * Validates that the anonymous authentication configuration is properly set
 * @returns {boolean} True if configuration is valid
 */
export function validateAnonymousAuthConfig(): boolean {
  const required = ["school", "baseUrl"];
  const missing = required.filter(
    (key) =>
      !anonymousAuthConfig[key as keyof typeof anonymousAuthConfig] ||
      anonymousAuthConfig[key as keyof typeof anonymousAuthConfig].startsWith("your-"),
  );

  if (missing.length > 0) {
    console.error("Missing or placeholder values in anonymousAuthConfig:", missing);
    return false;
  }

  return true;
}

/**
 * Logs configuration validation results
 */
export function logConfigValidation(): void {
  console.log("Configuration Validation Results:");
  console.log("- Basic Auth Config:", validateBasicAuthConfig() ? "✅ Valid" : "❌ Invalid");
  console.log("- Secret Auth Config:", validateSecretAuthConfig() ? "✅ Valid" : "❌ Invalid");
  console.log("- Anonymous Auth Config:", validateAnonymousAuthConfig() ? "✅ Valid" : "❌ Invalid");
  console.log("");
  console.log("Please update the placeholder values in examples/config.ts with your actual credentials.");
}
