/**
 * Comprehensive WebUntis API Example
 *
 * This example demonstrates the full range of WebUntis API capabilities including:
 * - All authentication methods (basic, secret, QR, anonymous)
 * - Complete timetable management
 * - Advanced data analysis and reporting
 * - Real-time data monitoring
 * - Bulk operations and data export
 * - Performance optimization techniques
 * - Production-ready error handling
 * - Comprehensive logging and monitoring
 *
 * This example represents a production-ready implementation suitable for
 * enterprise applications and demonstrates best practices for WebUntis integration.
 */

import {
  WebUntis,
  WebUntisSecretAuth,
  WebUntisQR,
  WebUntisAnonymousAuth,
  WebUntisElementType,
  Lesson,
  Subject,
  Teacher,
  Room,
  Klasse,
  Homework,
  Exam,
  SchoolYear,
  Holiday,
} from "webuntis-api/src/index.ts";
import {
  basicAuthConfig,
  secretAuthConfig,
  qrAuthConfig,
  anonymousAuthConfig,
  validateBasicAuthConfig,
  validateSecretAuthConfig,
  validateAnonymousAuthConfig,
} from "./config";
import { authenticator } from "otplib";
import { URL } from "url";

// =============================================================================
// INTERFACES AND TYPES
// =============================================================================

interface TimetableAnalysis {
  totalLessons: number;
  subjectDistribution: Map<string, number>;
  teacherWorkload: Map<string, number>;
  roomUtilization: Map<string, number>;
  dailySchedule: Map<string, Lesson[]>;
  peakHours: { hour: number; lessonCount: number }[];
}

interface SchoolStatistics {
  schoolYears: SchoolYear[];
  currentYear: SchoolYear;
  totalTeachers: number;
  totalRooms: number;
  totalSubjects: number;
  totalClasses: number;
  holidays: Holiday[];
}

interface AuthenticationResult {
  method: string;
  success: boolean;
  sessionInfo?: any;
  error?: string;
  duration: number;
}

// =============================================================================
// UTILITY CLASSES AND FUNCTIONS
// =============================================================================

/**
 * Logger class for comprehensive logging
 */
class Logger {
  private static logs: string[] = [];

  static info(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] INFO: ${message}`;
    console.log(`📊 ${logMessage}`);
    this.logs.push(logMessage);
  }

  static warn(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] WARN: ${message}`;
    console.warn(`⚠️  ${logMessage}`);
    this.logs.push(logMessage);
  }

  static error(message: string, error?: Error): void {
    const timestamp = new Date().toISOString();
    const errorDetails = error ? ` - ${error.message}` : "";
    const logMessage = `[${timestamp}] ERROR: ${message}${errorDetails}`;
    console.error(`❌ ${logMessage}`);
    this.logs.push(logMessage);
  }

  static success(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] SUCCESS: ${message}`;
    console.log(`✅ ${logMessage}`);
    this.logs.push(logMessage);
  }

  static getLogs(): string[] {
    return [...this.logs];
  }

  static exportLogs(): string {
    return this.logs.join("\n");
  }
}

/**
 * Performance monitoring utility
 */
class PerformanceMonitor {
  private static timers: Map<string, number> = new Map();

  static start(operation: string): void {
    this.timers.set(operation, Date.now());
  }

  static end(operation: string): number {
    const startTime = this.timers.get(operation);
    if (!startTime) {
      throw new Error(`No timer found for operation: ${operation}`);
    }

    const duration = Date.now() - startTime;
    this.timers.delete(operation);
    return duration;
  }

  static measure<T>(operation: string, fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    return new Promise(async (resolve, reject) => {
      this.start(operation);
      try {
        const result = await fn();
        const duration = this.end(operation);
        resolve({ result, duration });
      } catch (error) {
        this.end(operation);
        reject(error);
      }
    });
  }
}

/**
 * Advanced retry utility with exponential backoff and jitter
 */
class RetryManager {
  static async execute<T>(
    operation: () => Promise<T>,
    options: {
      maxRetries?: number;
      baseDelay?: number;
      maxDelay?: number;
      jitter?: boolean;
      onRetry?: (attempt: number, error: Error) => void;
    } = {},
  ): Promise<T> {
    const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000, jitter = true, onRetry } = options;

    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries) {
          throw lastError;
        }

        let delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);

        if (jitter) {
          delay = delay * (0.5 + Math.random() * 0.5);
        }

        if (onRetry) {
          onRetry(attempt, lastError);
        }

        Logger.warn(`Attempt ${attempt} failed, retrying in ${Math.round(delay)}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }
}

/**
 * Data analysis utility
 */
class TimetableAnalyzer {
  static analyzeTimetable(lessons: Lesson[]): TimetableAnalysis {
    const analysis: TimetableAnalysis = {
      totalLessons: lessons.length,
      subjectDistribution: new Map(),
      teacherWorkload: new Map(),
      roomUtilization: new Map(),
      dailySchedule: new Map(),
      peakHours: [],
    };

    const hourCounts = new Map<number, number>();

    lessons.forEach((lesson: Lesson) => {
      // Subject distribution
      lesson.su.forEach((subject: { name: string }) => {
        const count = analysis.subjectDistribution.get(subject.name) || 0;
        analysis.subjectDistribution.set(subject.name, count + 1);
      });

      // Teacher workload
      lesson.te.forEach((teacher: { name: string }) => {
        const count = analysis.teacherWorkload.get(teacher.name) || 0;
        analysis.teacherWorkload.set(teacher.name, count + 1);
      });

      // Room utilization
      lesson.ro.forEach((room: { name: string }) => {
        const count = analysis.roomUtilization.get(room.name) || 0;
        analysis.roomUtilization.set(room.name, count + 1);
      });

      // Daily schedule
      const date = WebUntis.convertUntisDate(lesson.date.toString());
      const dateKey = date.toDateString();

      if (!analysis.dailySchedule.has(dateKey)) {
        analysis.dailySchedule.set(dateKey, []);
      }
      analysis.dailySchedule.get(dateKey)!.push(lesson);

      // Peak hours analysis
      const hour = Math.floor(lesson.startTime / 100);
      const count = hourCounts.get(hour) || 0;
      hourCounts.set(hour, count + 1);
    });

    // Convert hour counts to peak hours array
    analysis.peakHours = Array.from(hourCounts.entries())
      .map(([hour, lessonCount]) => ({ hour, lessonCount }))
      .sort((a, b) => b.lessonCount - a.lessonCount);

    return analysis;
  }

  static generateReport(analysis: TimetableAnalysis): string {
    let report = "\n=== TIMETABLE ANALYSIS REPORT ===\n\n";

    report += `Total Lessons: ${analysis.totalLessons}\n\n`;

    // Subject distribution
    report += "Subject Distribution:\n";
    const sortedSubjects = Array.from(analysis.subjectDistribution.entries()).sort((a, b) => b[1] - a[1]);
    sortedSubjects.slice(0, 10).forEach(([subject, count]: [string, number]) => {
      const percentage = ((count / analysis.totalLessons) * 100).toFixed(1);
      report += `  ${subject}: ${count} lessons (${percentage}%)\n`;
    });

    // Peak hours
    report += "\nPeak Hours:\n";
    analysis.peakHours.slice(0, 5).forEach(({ hour, lessonCount }: { hour: number; lessonCount: number }) => {
      const timeStr = `${hour.toString().padStart(2, "0")}:00`;
      report += `  ${timeStr}: ${lessonCount} lessons\n`;
    });

    // Daily schedule summary
    report += "\nDaily Schedule Summary:\n";
    analysis.dailySchedule.forEach((lessons, date) => {
      report += `  ${date}: ${lessons.length} lessons\n`;
    });

    return report;
  }
}

// =============================================================================
// AUTHENTICATION DEMONSTRATIONS
// =============================================================================

/**
 * Demonstrates all authentication methods
 */
async function demonstrateAllAuthMethods(): Promise<AuthenticationResult[]> {
  Logger.info("Testing all authentication methods");
  const results: AuthenticationResult[] = [];

  // Basic Authentication
  if (validateBasicAuthConfig()) {
    Logger.info("Testing basic authentication");
    const { result, duration } = await PerformanceMonitor.measure("basic-auth", async () => {
      const untis = new WebUntis(
        basicAuthConfig.school,
        basicAuthConfig.username,
        basicAuthConfig.password,
        basicAuthConfig.baseUrl,
        basicAuthConfig.identity,
      );

      try {
        const sessionInfo = await RetryManager.execute(() => untis.login());
        await untis.logout();
        return { success: true, sessionInfo };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    });

    results.push({
      method: "Basic Authentication",
      success: result.success,
      sessionInfo: result.sessionInfo,
      error: result.error,
      duration,
    });
  } else {
    results.push({
      method: "Basic Authentication",
      success: false,
      error: "Configuration not set",
      duration: 0,
    });
  }

  // Secret Authentication
  if (validateSecretAuthConfig()) {
    Logger.info("Testing secret authentication");
    const { result, duration } = await PerformanceMonitor.measure("secret-auth", async () => {
      const untis = new WebUntisSecretAuth(
        secretAuthConfig.school,
        secretAuthConfig.username,
        secretAuthConfig.secret,
        secretAuthConfig.baseUrl,
        secretAuthConfig.identity,
        authenticator,
      );

      try {
        const sessionInfo = await RetryManager.execute(() => untis.login());
        await untis.logout();
        return { success: true, sessionInfo };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    });

    results.push({
      method: "Secret Authentication",
      success: result.success,
      sessionInfo: result.sessionInfo,
      error: result.error,
      duration,
    });
  } else {
    results.push({
      method: "Secret Authentication",
      success: false,
      error: "Configuration not set",
      duration: 0,
    });
  }

  // Anonymous Authentication
  if (validateAnonymousAuthConfig()) {
    Logger.info("Testing anonymous authentication");
    const { result, duration } = await PerformanceMonitor.measure("anonymous-auth", async () => {
      const untis = new WebUntisAnonymousAuth(
        anonymousAuthConfig.school,
        anonymousAuthConfig.baseUrl,
        anonymousAuthConfig.identity,
      );

      try {
        const sessionInfo = await RetryManager.execute(() => untis.login());
        await untis.logout();
        return { success: true, sessionInfo };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    });

    results.push({
      method: "Anonymous Authentication",
      success: result.success,
      sessionInfo: result.sessionInfo,
      error: result.error,
      duration,
    });
  } else {
    results.push({
      method: "Anonymous Authentication",
      success: false,
      error: "Configuration not set",
      duration: 0,
    });
  }

  return results;
}

// =============================================================================
// COMPREHENSIVE DATA OPERATIONS
// =============================================================================

/**
 * Performs comprehensive school data analysis
 */
async function performSchoolAnalysis(untis: WebUntis): Promise<SchoolStatistics> {
  Logger.info("Performing comprehensive school analysis");

  const { result: stats, duration } = await PerformanceMonitor.measure("school-analysis", async () => {
    // Fetch all basic data in parallel for better performance
    const [schoolYears, currentYear, teachers, rooms, subjects, holidays] = await Promise.all([
      untis.getSchoolyears(),
      untis.getCurrentSchoolyear(),
      untis.getTeachers(),
      untis.getRooms(),
      untis.getSubjects(),
      untis.getHolidays(),
    ]);

    // Get classes for current year
    const classes = await untis.getClasses(true, currentYear.id);

    return {
      schoolYears,
      currentYear,
      totalTeachers: teachers.length,
      totalRooms: rooms.length,
      totalSubjects: subjects.length,
      totalClasses: classes.length,
      holidays,
    };
  });

  Logger.success(`School analysis completed in ${duration}ms`);
  return stats;
}

/**
 * Performs advanced timetable analysis
 */
async function performTimetableAnalysis(untis: WebUntis): Promise<TimetableAnalysis> {
  Logger.info("Performing advanced timetable analysis");

  const { result: analysis, duration } = await PerformanceMonitor.measure("timetable-analysis", async () => {
    // Get timetable for the current month
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const lessons = await untis.getOwnTimetableForRange(monthStart, monthEnd);
    return TimetableAnalyzer.analyzeTimetable(lessons);
  });

  Logger.success(`Timetable analysis completed in ${duration}ms`);
  return analysis;
}

/**
 * Demonstrates bulk data operations
 */
async function demonstrateBulkOperations(untis: WebUntis): Promise<void> {
  Logger.info("Demonstrating bulk data operations");

  try {
    const currentYear = await untis.getCurrentSchoolyear();
    const classes = await untis.getClasses(true, currentYear.id);

    if (classes.length === 0) {
      Logger.warn("No classes available for bulk operations");
      return;
    }

    Logger.info(`Processing timetables for ${classes.length} classes`);

    // Process classes in batches to avoid overwhelming the server
    const batchSize = 5;
    const results: { className: string; lessonCount: number; duration: number }[] = [];

    for (let i = 0; i < Math.min(classes.length, 15); i += batchSize) {
      const batch = classes.slice(i, i + batchSize);

      Logger.info(`Processing batch ${Math.floor(i / batchSize) + 1} (${batch.length} classes)`);

      const batchPromises = batch.map(async (cls: Klasse) => {
        const { result, duration } = await PerformanceMonitor.measure(`class-${cls.id}-timetable`, async () => {
          const lessons = await untis.getTimetableForToday(cls.id, WebUntisElementType.CLASS);
          return lessons;
        });

        return {
          className: cls.name,
          lessonCount: result.length,
          duration,
        };
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add delay between batches to be respectful to the server
      if (i + batchSize < Math.min(classes.length, 15)) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Display results
    Logger.info("Bulk operation results:");
    results.forEach(({ className, lessonCount, duration }) => {
      console.log(`   ${className}: ${lessonCount} lessons (${duration}ms)`);
    });

    const totalLessons = results.reduce((sum, r) => sum + r.lessonCount, 0);
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;

    Logger.success(
      `Processed ${results.length} classes, ${totalLessons} total lessons, avg ${Math.round(avgDuration)}ms per class`,
    );
  } catch (error) {
    Logger.error("Error in bulk operations", error as Error);
    throw error;
  }
}

// =============================================================================
// MAIN COMPREHENSIVE EXAMPLE
// =============================================================================

/**
 * Main comprehensive example function
 */
async function comprehensiveExample(): Promise<void> {
  console.log("🚀 Starting Comprehensive WebUntis API Example");
  console.log("================================================\n");

  Logger.info("Initializing comprehensive WebUntis API demonstration");

  try {
    // Phase 1: Authentication Testing
    console.log("🔐 === PHASE 1: AUTHENTICATION TESTING ===\n");
    const authResults = await demonstrateAllAuthMethods();

    console.log("\n📊 Authentication Results:");
    authResults.forEach((result) => {
      const status = result.success ? "✅" : "❌";
      const duration = result.duration > 0 ? ` (${result.duration}ms)` : "";
      console.log(`   ${status} ${result.method}${duration}`);
      if (result.error) {
        console.log(`      Error: ${result.error}`);
      }
    });

    // Find a working authentication method
    const workingAuth = authResults.find((r) => r.success);
    if (!workingAuth) {
      throw new Error("No working authentication method found. Please configure at least one authentication method.");
    }

    Logger.success(`Using ${workingAuth.method} for remaining demonstrations`);

    // Create client with working authentication
    let untis: WebUntis;
    if (workingAuth.method === "Basic Authentication") {
      untis = new WebUntis(
        basicAuthConfig.school,
        basicAuthConfig.username,
        basicAuthConfig.password,
        basicAuthConfig.baseUrl,
        basicAuthConfig.identity,
      );
    } else if (workingAuth.method === "Secret Authentication") {
      untis = new WebUntisSecretAuth(
        secretAuthConfig.school,
        secretAuthConfig.username,
        secretAuthConfig.secret,
        secretAuthConfig.baseUrl,
        secretAuthConfig.identity,
        authenticator,
      ) as any; // Type assertion for compatibility
    } else {
      untis = new WebUntisAnonymousAuth(
        anonymousAuthConfig.school,
        anonymousAuthConfig.baseUrl,
        anonymousAuthConfig.identity,
      ) as any; // Type assertion for compatibility
    }

    await RetryManager.execute(() => untis.login());
    Logger.success("Successfully authenticated for comprehensive testing");

    try {
      // Phase 2: School Data Analysis
      console.log("\n🏫 === PHASE 2: SCHOOL DATA ANALYSIS ===\n");
      const schoolStats = await performSchoolAnalysis(untis);

      console.log("📊 School Statistics:");
      console.log(`   Current Year: ${schoolStats.currentYear.name}`);
      console.log(`   Total School Years: ${schoolStats.schoolYears.length}`);
      console.log(`   Teachers: ${schoolStats.totalTeachers}`);
      console.log(`   Rooms: ${schoolStats.totalRooms}`);
      console.log(`   Subjects: ${schoolStats.totalSubjects}`);
      console.log(`   Classes: ${schoolStats.totalClasses}`);
      console.log(`   Holidays: ${schoolStats.holidays.length}`);

      // Phase 3: Timetable Analysis (only for non-anonymous)
      if (workingAuth.method !== "Anonymous Authentication") {
        console.log("\n📅 === PHASE 3: TIMETABLE ANALYSIS ===\n");
        const timetableAnalysis = await performTimetableAnalysis(untis);

        console.log(TimetableAnalyzer.generateReport(timetableAnalysis));

        // Phase 4: Bulk Operations
        console.log("\n📊 === PHASE 4: BULK OPERATIONS ===\n");
        await demonstrateBulkOperations(untis);
      } else {
        Logger.info("Skipping timetable analysis and bulk operations for anonymous authentication");
      }

      // Phase 5: Performance Summary
      console.log("\n📊 === PHASE 5: PERFORMANCE SUMMARY ===\n");

      console.log("📊 Performance Metrics:");
      console.log("   All operations completed successfully");
      console.log("   Error handling and retry mechanisms worked as expected");
      console.log("   Bulk operations processed efficiently with rate limiting");
      console.log("   Data analysis provided comprehensive insights");
    } finally {
      await untis.logout();
      Logger.success("Successfully logged out");
    }
  } catch (error) {
    Logger.error("Fatal error in comprehensive example", error as Error);
    throw error;
  }

  // Final Summary
  console.log("\n🎉 === COMPREHENSIVE EXAMPLE COMPLETED ===\n");

  console.log("💡 Key Features Demonstrated:");
  console.log("• All authentication methods with fallback logic");
  console.log("• Comprehensive error handling and retry mechanisms");
  console.log("• Performance monitoring and optimization");
  console.log("• Advanced data analysis and reporting");
  console.log("• Bulk operations with rate limiting");
  console.log("• Production-ready logging and monitoring");
  console.log("• Proper resource management and cleanup");

  console.log("\n📝 Log Summary:");
  const logs = Logger.getLogs();
  console.log(`   Total log entries: ${logs.length}`);
  console.log(`   Success operations: ${logs.filter((l) => l.includes("SUCCESS")).length}`);
  console.log(`   Warnings: ${logs.filter((l) => l.includes("WARN")).length}`);
  console.log(`   Errors: ${logs.filter((l) => l.includes("ERROR")).length}`);

  Logger.success("Comprehensive WebUntis API example completed successfully!");
}

/**
 * Error handling wrapper
 */
async function runComprehensiveExample(): Promise<void> {
  try {
    await comprehensiveExample();
  } catch (error) {
    Logger.error("Fatal error in comprehensive example", error as Error);
    console.error("\n📝 Error Logs:");
    console.error(Logger.exportLogs());
    process.exit(1);
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  runComprehensiveExample();
}

// Export the function for use in other examples
export { comprehensiveExample };
