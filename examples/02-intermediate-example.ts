/**
 * Intermediate WebUntis API Example
 * 
 * This example demonstrates more advanced usage of the WebUntis API including:
 * - Multiple authentication methods (basic and secret-based)
 * - Timetable operations for different date ranges
 * - Error handling with retry logic
 * - Working with different data types (lessons, homework, exams)
 * - Advanced filtering and data processing
 * - Session management best practices
 * 
 * This example builds upon the basic example and shows real-world usage patterns.
 */

import { WebUntis, WebUntisSecretAuth, Lesson, Homework, Exam, WebUntisElementType, Homeworks } from '../src/index';
import { basicAuthConfig, secretAuthConfig, validateBasicAuthConfig, validateSecretAuthConfig } from './config';
import { authenticator } from 'otplib';

/**
 * Utility function to format dates for display
 */
function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Utility function to format time from WebUntis time format
 */
function formatTime(time: number): string {
    const timeStr = time.toString().padStart(4, '0');
    const hours = timeStr.substring(0, 2);
    const minutes = timeStr.substring(2, 4);
    return `${hours}:${minutes}`;
}

/**
 * Utility function to retry operations with exponential backoff
 */
async function retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error as Error;

            if (attempt === maxRetries) {
                throw lastError;
            }

            const delay = baseDelay * Math.pow(2, attempt - 1);
            console.log(`   ⚠️  Attempt ${attempt} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError!;
}

/**
 * Demonstrates basic authentication with enhanced timetable operations
 */
async function demonstrateBasicAuth(): Promise<void> {
    console.log('\n📚 === BASIC AUTHENTICATION DEMO ===');

    if (!validateBasicAuthConfig()) {
        console.log('⏭️  Skipping basic auth demo - configuration not set');
        return;
    }

    const untis = new WebUntis(
        basicAuthConfig.school,
        basicAuthConfig.username,
        basicAuthConfig.password,
        basicAuthConfig.baseUrl,
        basicAuthConfig.identity
    );

    try {
        // Login with retry logic
        console.log('🔐 Logging in with basic authentication...');
        await retryOperation(() => untis.login());
        console.log('✅ Successfully logged in!');

        // Get today's timetable
        console.log('\n📅 Fetching today\'s timetable...');
        const todayLessons: Lesson[] = await untis.getOwnTimetableForToday();
        console.log(`📊 Found ${todayLessons.length} lessons for today`);

        if (todayLessons.length > 0) {
            console.log('\n🕐 Today\'s Schedule:');
            todayLessons.forEach((lesson, index) => {
                const startTime = formatTime(lesson.startTime);
                const endTime = formatTime(lesson.endTime);
                const subjects = lesson.su.map(s => s.name).join(', ') || 'Unknown';
                const teachers = lesson.te.map(t => t.name).join(', ') || 'Unknown';
                const rooms = lesson.ro.map(r => r.name).join(', ') || 'Unknown';

                console.log(`   ${index + 1}. ${startTime}-${endTime}: ${subjects}`);
                console.log(`      Teacher(s): ${teachers}`);
                console.log(`      Room(s): ${rooms}`);
                if (lesson.info) {
                    console.log(`      Info: ${lesson.info}`);
                }
                if (lesson.substText) {
                    console.log(`      Substitution: ${lesson.substText}`);
                }
                console.log('');
            });
        }

        // Get this week's timetable
        console.log('📅 Fetching this week\'s timetable...');
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // Sunday

        const weekLessons: Lesson[] = await untis.getOwnTimetableForRange(weekStart, weekEnd);
        console.log(`📊 Found ${weekLessons.length} lessons for this week (${formatDate(weekStart)} - ${formatDate(weekEnd)})`);

        // Group lessons by day
        const lessonsByDay = new Map<string, Lesson[]>();
        weekLessons.forEach(lesson => {
            const date = WebUntis.convertUntisDate(lesson.date.toString());
            const dateKey = date.toDateString();

            if (!lessonsByDay.has(dateKey)) {
                lessonsByDay.set(dateKey, []);
            }
            lessonsByDay.get(dateKey)!.push(lesson);
        });

        console.log('\n📊 Weekly Schedule Summary:');
        lessonsByDay.forEach((lessons, dateKey) => {
            console.log(`   ${dateKey}: ${lessons.length} lessons`);
        });

        // Get homework for the next 7 days
        console.log('\n📝 Fetching homework...');
        const homeworkEnd = new Date(today);
        homeworkEnd.setDate(today.getDate() + 7);

        try {
            const { homeworks }: Homeworks = await untis.getHomeWorksFor(today, homeworkEnd);
            console.log(`📋 Found ${homeworks.length} homework assignments`);

            if (homeworks.length > 0) {
                console.log('\n📝 Upcoming Homework:');
                homeworks?.slice(0, 5).forEach((hw, index) => {
                    const dueDate = WebUntis.convertUntisDate(hw.dueDate.toString());
                    console.log(`   ${index + 1}. Due ${formatDate(dueDate)}: ${hw.text}`);
                    if (hw.remark) {
                        console.log(`      Remark: ${hw.remark}`);
                    }
                    console.log(`      Status: ${hw.completed ? 'Completed' : 'Pending'}`);
                });

                if (homeworks.length > 5) {
                    console.log(`   ... and ${homeworks.length - 5} more assignments`);
                }
            }
        } catch (error) {
            console.log('⚠️  Could not fetch homework (may not be available for your account)');
        }

    } catch (error) {
        console.error('❌ Error in basic auth demo:', error);
        if (error instanceof Error) {
            console.error(`   Details: ${error.message}`);
        }
    } finally {
        try {
            await untis.logout();
            console.log('✅ Logged out from basic auth session');
        } catch (error) {
            console.warn('⚠️  Warning: Could not logout properly');
        }
    }
}

/**
 * Demonstrates secret-based authentication with advanced features
 */
async function demonstrateSecretAuth(): Promise<void> {
    console.log('\n🔐 === SECRET AUTHENTICATION DEMO ===');

    if (!validateSecretAuthConfig()) {
        console.log('⏭️  Skipping secret auth demo - configuration not set');
        return;
    }

    const untis = new WebUntisSecretAuth(
        secretAuthConfig.school,
        secretAuthConfig.username,
        secretAuthConfig.secret,
        secretAuthConfig.baseUrl,
        secretAuthConfig.identity,
        authenticator
    );

    try {
        // Login with secret authentication
        console.log('🔐 Logging in with secret authentication...');
        await retryOperation(() => untis.login());
        console.log('✅ Successfully logged in with TOTP!');

        // Get school information
        console.log('\n🏫 Fetching school information...');
        const currentSchoolYear = await untis.getCurrentSchoolyear();
        const allSchoolYears = await untis.getSchoolyears();

        console.log(`📅 Current School Year: ${currentSchoolYear.name}`);
        console.log(`📚 Total School Years Available: ${allSchoolYears.length}`);

        // Get various school entities
        console.log('\n📊 Fetching school entities...');
        const [teachers, rooms, subjects, classes] = await Promise.all([
            untis.getTeachers(),
            untis.getRooms(),
            untis.getSubjects(),
            untis.getClasses(true, currentSchoolYear.id)
        ]);

        console.log(`👨‍🏫 Teachers: ${teachers.length}`);
        console.log(`🏠 Rooms: ${rooms.length}`);
        console.log(`📚 Subjects: ${subjects.length}`);
        console.log(`🎓 Classes: ${classes.length}`);

        // Demonstrate advanced timetable queries
        if (classes.length > 0) {
            console.log('\n🔍 Demonstrating advanced timetable queries...');

            // Get timetable for a specific class
            const sampleClass = classes[0];
            console.log(`📋 Getting timetable for class: ${sampleClass.name}`);

            const today = new Date();
            const classTimetable = await untis.getTimetableForToday(
                sampleClass.id,
                WebUntisElementType.CLASS
            );

            console.log(`📊 Found ${classTimetable.length} lessons for ${sampleClass.name} today`);

            if (classTimetable.length > 0) {
                console.log('\n📅 Class Schedule:');
                classTimetable.slice(0, 3).forEach((lesson, index) => {
                    const startTime = formatTime(lesson.startTime);
                    const endTime = formatTime(lesson.endTime);
                    const subjects = lesson.su.map(s => s.name).join(', ');
                    const teachers = lesson.te.map(t => t.name).join(', ');

                    console.log(`   ${index + 1}. ${startTime}-${endTime}: ${subjects} (${teachers})`);
                });

                if (classTimetable.length > 3) {
                    console.log(`   ... and ${classTimetable.length - 3} more lessons`);
                }
            }
        }

        // Get exams if available
        console.log('\n📝 Fetching exams...');
        const examStart = new Date();
        const examEnd = new Date();
        examEnd.setDate(examStart.getDate() + 30); // Next 30 days

        try {
            const exams: Exam[] = await untis.getExamsForRange(examStart, examEnd);
            console.log(`📋 Found ${exams.length} exams in the next 30 days`);

            if (exams.length > 0) {
                console.log('\n📝 Upcoming Exams:');
                exams.slice(0, 3).forEach((exam, index) => {
                    const examDate = WebUntis.convertUntisDate(exam.examDate.toString());
                    const startTime = formatTime(exam.startTime);

                    console.log(`   ${index + 1}. ${formatDate(examDate)} at ${startTime}: ${exam.name}`);
                    console.log(`      Subject: ${exam.subject}`);
                    console.log(`      Teachers: ${exam.teachers.join(', ')}`);
                    if (exam.rooms.length > 0) {
                        console.log(`      Rooms: ${exam.rooms.join(', ')}`);
                    }
                });

                if (exams.length > 3) {
                    console.log(`   ... and ${exams.length - 3} more exams`);
                }
            }
        } catch (error) {
            console.log('⚠️  Could not fetch exams (may not be available for your account)');
        }

        // Demonstrate session validation
        console.log('\n🔍 Testing session management...');
        const isValid = await untis.validateSession();
        console.log(`✅ Session is ${isValid ? 'valid' : 'invalid'}`);

        const lastImport = await untis.getLatestImportTime();
        const lastImportDate = new Date(lastImport);
        console.log(`📊 Data last updated: ${lastImportDate.toLocaleString()}`);

    } catch (error) {
        console.error('❌ Error in secret auth demo:', error);
        if (error instanceof Error) {
            console.error(`   Details: ${error.message}`);
        }
    } finally {
        try {
            await untis.logout();
            console.log('✅ Logged out from secret auth session');
        } catch (error) {
            console.warn('⚠️  Warning: Could not logout properly');
        }
    }
}

/**
 * Main function that runs the intermediate example
 */
async function intermediateExample(): Promise<void> {
    console.log('🚀 Starting Intermediate WebUntis API Example');
    console.log('============================================\n');

    console.log('This example demonstrates:');
    console.log('• Multiple authentication methods');
    console.log('• Advanced timetable operations');
    console.log('• Error handling with retry logic');
    console.log('• Working with homework and exams');
    console.log('• Session management best practices');
    console.log('• Data filtering and processing\n');

    try {
        // Run basic authentication demo
        await demonstrateBasicAuth();

        // Add a delay between demos
        console.log('\n⏳ Waiting 2 seconds before next demo...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Run secret authentication demo
        await demonstrateSecretAuth();

    } catch (error) {
        console.error('💥 Fatal error in intermediate example:', error);
        throw error;
    }

    console.log('\n🎉 Intermediate example completed successfully!');
    console.log('\n💡 Key takeaways:');
    console.log('• Always implement proper error handling and retry logic');
    console.log('• Use appropriate authentication method for your use case');
    console.log('• Remember to logout to free server resources');
    console.log('• Group and process data efficiently for better user experience');
    console.log('• Validate sessions regularly for long-running applications');
}

/**
 * Error handling wrapper
 */
async function runIntermediateExample(): Promise<void> {
    try {
        await intermediateExample();
    } catch (error) {
        console.error('💥 Fatal error in intermediate example:', error);
        process.exit(1);
    }
}

// Run the example if this file is executed directly
if (require.main === module) {
    runIntermediateExample();
}

// Export the function for use in other examples
export { intermediateExample };