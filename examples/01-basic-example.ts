/**
 * Basic WebUntis API Example
 * 
 * This example demonstrates the most fundamental usage of the WebUntis API
 * using basic username/password authentication. It shows how to:
 * - Connect to WebUntis
 * - Authenticate with credentials
 * - Fetch basic information
 * - Handle errors gracefully
 * - Clean up resources
 * 
 * This is the simplest way to get started with the WebUntis API.
 */


// Import the WebUntis client from the parent directory
import { WebUntis, Subject, Klasse } from '../src/index';
import { basicAuthConfig, validateBasicAuthConfig } from './config';

/**
 * Main function that demonstrates basic WebUntis API usage
 */

async function basicExample(): Promise<void> {
    console.log('🚀 Starting Basic WebUntis API Example\n');

    // Step 1: Validate configuration
    console.log('📋 Step 1: Validating configuration...');
    if (!validateBasicAuthConfig()) {
        console.error('❌ Configuration validation failed!');
        console.error('Please update the values in examples/config.ts with your actual WebUntis credentials.');
        return;
    }
    console.log('✅ Configuration is valid\n');

    // Step 2: Create WebUntis client instance
    console.log('🔧 Step 2: Creating WebUntis client...');
    const untis = new WebUntis(
        basicAuthConfig.school,     // School identifier
        basicAuthConfig.username,   // Your username
        basicAuthConfig.password,   // Your password
        basicAuthConfig.baseUrl,    // WebUntis server URL
        basicAuthConfig.identity    // Application identity
    );
    console.log('✅ WebUntis client created\n');

    try {
        // Step 3: Authenticate with WebUntis
        console.log('🔐 Step 3: Logging in to WebUntis...');
        const sessionInfo = await untis.login();
        console.log('✅ Successfully logged in!');
        console.log('📊 Session Information:');
        console.log(`   - Session ID: ${sessionInfo.sessionId}`);
        console.log(`   - Person ID: ${sessionInfo.personId}`);
        console.log(`   - Person Type: ${sessionInfo.personType}`);
        if (sessionInfo.klasseId) {
            console.log(`   - Class ID: ${sessionInfo.klasseId}`);
        }
        console.log('');

        // Step 4: Fetch basic school information
        console.log('🏫 Step 4: Fetching school information...');

        // Get current school year
        const currentSchoolYear = await untis.getCurrentSchoolyear();
        console.log('📅 Current School Year:');
        console.log(`   - Name: ${currentSchoolYear.name}`);
        console.log(`   - ID: ${currentSchoolYear.id}`);
        console.log(`   - Start Date: ${currentSchoolYear.startDate.toLocaleDateString()}`);
        console.log(`   - End Date: ${currentSchoolYear.endDate.toLocaleDateString()}`);
        console.log('');

        // Get basic school data
        console.log('📊 Fetching basic school data...');

        // Get subjects (this gives us an idea of what courses are available)

        const subjects: Subject[] = await untis.getSubjects();
        console.log(`📚 Found ${subjects.length} subjects`);
        if (subjects.length > 0) {
            console.log('   Sample subjects:');
            // Show first 3 subjects as examples

            subjects.slice(0, 3).forEach((subject: Subject, index: number) => {
                console.log(`   ${index + 1}. ${subject.name} (${subject.longName})`);
            });
            if (subjects.length > 3) {
                console.log(`   ... and ${subjects.length - 3} more`);
            }
        }
        console.log('');



        // Get classes (note: getClasses method signature is (validateSession, schoolyearId))
        const classes: Klasse[] = await untis.getClasses(true, currentSchoolYear.id);
        console.log(`🎓 Found ${classes.length} classes`);
        if (classes.length > 0) {
            console.log('   Sample classes:');
            // Show first 3 classes as examples

            classes.slice(0, 3).forEach((cls: Klasse, index: number) => {
                console.log(`   ${index + 1}. ${cls.name} (${cls.longName})`);
            });
            if (classes.length > 3) {
                console.log(`   ... and ${classes.length - 3} more`);
            }
        }
        console.log('');

        // Step 5: Check session validity
        console.log('🔍 Step 5: Validating session...');
        const isSessionValid = await untis.validateSession();
        console.log(`✅ Session is ${isSessionValid ? 'valid' : 'invalid'}\n`);

        // Step 6: Get latest import time (shows when data was last updated)
        console.log('⏰ Step 6: Checking data freshness...');
        const lastImportTime = await untis.getLatestImportTime();
        const lastImportDate = new Date(lastImportTime);
        console.log(`📊 Data last updated: ${lastImportDate.toLocaleString()}\n`);

    } catch (error) {
        // Handle any errors that occur during API calls
        console.error('❌ An error occurred:');
        if (error instanceof Error) {
            console.error(`   Error: ${error.message}`);

            // Provide helpful error messages for common issues
            if (error.message.includes('Failed to login')) {
                console.error('\n💡 Troubleshooting tips:');
                console.error('   - Check your username and password');
                console.error('   - Verify the school identifier is correct');
                console.error('   - Ensure the base URL is correct');
                console.error('   - Make sure your account has API access');
            } else if (error.message.includes('Session is not valid')) {
                console.error('\n💡 Session expired or invalid. Try logging in again.');
            }
        } else {
            console.error(`   Unknown error: ${error}`);
        }
    } finally {
        // Step 7: Clean up - Always logout to free server resources
        console.log('🧹 Step 7: Cleaning up...');
        try {
            await untis.logout();
            console.log('✅ Successfully logged out');
        } catch (logoutError) {
            console.warn('⚠️  Warning: Could not logout properly:', logoutError);
        }
    }

    console.log('\n🎉 Basic example completed!');
}

/**
 * Error handling wrapper
 */

async function runBasicExample(): Promise<void> {
    try {
        await basicExample();
    } catch (error) {
        console.error('💥 Fatal error in basic example:', error);
        process.exit(1);
    }
}

// Run the example if this file is executed directly
if (require.main === module) {
    runBasicExample();
}

// Export the function for use in other examples
export { basicExample };