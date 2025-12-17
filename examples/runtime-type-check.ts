/**
 * Runtime vs declared type checker for WebUntis responses.
 *
 * Reads credentials from environment variables:
 *   WEBUNTIS_SCHOOL
 *   WEBUNTIS_USERNAME
 *   WEBUNTIS_PASSWORD
 *   WEBUNTIS_BASEURL (optional)
 *   WEBUNTIS_IDENTITY (optional)
 *   WEBUNTIS_CLASS_ID (optional)   
 *
 * Usage:
 *   WEBUNTIS_SCHOOL=... WEBUNTIS_USERNAME=... WEBUNTIS_PASSWORD=... node --loader ts-node/esm examples/runtime-type-check.ts
 *   # or compile with Rollup first (dist/examples/runtime-type-check.js) and run with node
 */
import 'dotenv/config';
import { WebUntis } from '../src/index';
import { z } from 'zod';
import {
    schoolYearSchema,
    newsWidgetSchema,
    inboxSchema,
    subjectSchema,
    timegridSchema,
    examSchema,
    webApiTimetableSchema,
    teacherSchema,
    studentSchema,
    roomSchema,
    klasseSchema,
    departmentSchema,
    holidaySchema,
    statusDataSchema,
    absencesSchema,
    lessonSchema,
    homeworkSchema,
    homeworksSchema,
} from '../src/types.schema';

type Schema = z.ZodTypeAny;

function report(label: string, value: unknown, schema: Schema): void {
    const result = schema.safeParse(value);
    if (result.success) {
        console.log(`✅ ${label}: runtime matches declared shape`);
    } else {
        console.log(`❌ ${label}: found ${result.error.issues.length} issue(s)`);
        for (const issue of result.error.issues) {
            const path = issue.path.length ? `$.${issue.path.join('.')}` : '$';
            console.log(`   - ${path}: ${issue.message}`);
        }
        const inferred = inferTsType(value);
        console.log('   Runtime-inferred TypeScript:');
        console.log(indentMultiline(inferred, '     '));
    }
}

type EnvConfig = {
    school: string;
    username: string;
    password: string;
    baseUrl?: string;
    identity?: string;
    klasseId?: string;
};

function readEnv(): EnvConfig {
    const { WEBUNTIS_SCHOOL, WEBUNTIS_USERNAME, WEBUNTIS_PASSWORD, WEBUNTIS_BASEURL, WEBUNTIS_IDENTITY, WEBUNTIS_CLASS_ID } =
        process.env;
    const missing = ['WEBUNTIS_SCHOOL', 'WEBUNTIS_USERNAME', 'WEBUNTIS_PASSWORD'].filter(
        (k) => !process.env[k],
    );
    if (missing.length) {
        throw new Error(`Missing env vars: ${missing.join(', ')}`);
    }
    return {
        school: WEBUNTIS_SCHOOL as string,
        username: WEBUNTIS_USERNAME as string,
        password: WEBUNTIS_PASSWORD as string,
        baseUrl: WEBUNTIS_BASEURL,
        identity: WEBUNTIS_IDENTITY,
        klasseId: WEBUNTIS_CLASS_ID,
    };
}

async function main(): Promise<void> {
    const env = readEnv();

    const untis = new WebUntis(env.school, env.username, env.password, env.baseUrl, env.identity, true);

    console.log('🔐 Logging in...');
    const sessionInfo = await untis.login();
    report('SessionInformation', sessionInfo, schemaFor('SessionInformation'));

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    console.log('📅 Fetching current school year...');
    const schoolYear = await untis.getCurrentSchoolyear();
    report('SchoolYear', schoolYear, schemaFor('SchoolYear'));

    // Preload classes to get a klasseId when sessionInfo lacks it
    const classes = await untis.getClasses(true, schoolYear.id);
    report('Klasse[]', classes, z.array(schemaFor('Klasse')));

    const envKlasseId = env.klasseId ? env.klasseId : undefined;
    const klasseId = envKlasseId ?? sessionInfo.klasseId ?? classes[0]?.id;
    console.log('klasseId to use:', klasseId);
    const hasPerson = Number.isInteger(sessionInfo.personId) && Number.isInteger(sessionInfo.personType);

    const checks: Array<{
        label: string;
        run: () => Promise<unknown>;
        schema?: Schema;
        skip?: boolean;
    }> = [
            {
                label: 'LatestSchoolyear',
                run: () => untis.getLatestSchoolyear(),
                schema: schemaFor('SchoolYear'),
            },
            {
                label: 'Schoolyears[]',
                run: () => untis.getSchoolyears(),
                schema: z.array(schemaFor('SchoolYear')),
            },
            {
                label: 'NewsWidget',
                run: () => untis.getNewsWidget(today),
                schema: schemaFor('NewsWidget'),
            },
            {
                label: 'Inbox',
                run: () => untis.getInbox(),
                schema: schemaFor('Inbox'),
            },
            {
                label: 'ValidateSession',
                run: () => untis.validateSession(),
            },
            {
                label: 'LatestImportTime',
                run: () => untis.getLatestImportTime(),
            },
            {
                label: 'Subjects[]',
                run: () => untis.getSubjects(),
                schema: z.array(schemaFor('Subject')),
            },
            {
                label: 'Timegrid[]',
                run: () => untis.getTimegrid(),
                schema: z.array(schemaFor('Timegrid')),
            },
            {
                label: 'Teachers[]',
                run: () => untis.getTeachers(),
                schema: z.array(schemaFor('Teacher')),
            },
            {
                label: 'Students[]',
                run: () => untis.getStudents(),
                schema: z.array(schemaFor('Student')),
            },
            {
                label: 'Rooms[]',
                run: () => untis.getRooms(),
                schema: z.array(schemaFor('Room')),
            },
            {
                label: 'Departments[]',
                run: () => untis.getDepartments(),
                schema: z.array(schemaFor('Department')),
            },
            {
                label: 'Holidays[]',
                run: () => untis.getHolidays(),
                schema: z.array(schemaFor('Holiday')),
            },
            {
                label: 'StatusData',
                run: () => untis.getStatusData(),
                schema: schemaFor('StatusData'),
            },
            {
                label: 'OwnTimetableForToday',
                skip: !hasPerson,
                run: () => untis.getOwnTimetableForToday(),
                schema: z.array(schemaFor('Lesson')),
            },
            {
                label: 'TimetableForToday',
                skip: !hasPerson,
                run: () => untis.getTimetableForToday(sessionInfo.personId!, sessionInfo.personType!),
                schema: z.array(schemaFor('Lesson')),
            },
            {
                label: 'OwnTimetableForDate',
                skip: !hasPerson,
                run: () => untis.getOwnTimetableFor(today),
                schema: z.array(schemaFor('Lesson')),
            },
            {
                label: 'TimetableForDate',
                skip: !hasPerson,
                run: () => untis.getTimetableFor(today, sessionInfo.personId!, sessionInfo.personType!),
                schema: z.array(schemaFor('Lesson')),
            },
            {
                label: 'OwnTimetableForRange',
                skip: !hasPerson,
                run: () => untis.getOwnTimetableForRange(today, nextWeek),
                schema: z.array(schemaFor('Lesson')),
            },
            {
                label: 'TimetableForRange',
                skip: !hasPerson,
                run: () => untis.getTimetableForRange(today, nextWeek, sessionInfo.personId!, sessionInfo.personType!),
                schema: z.array(schemaFor('Lesson')),
            },
            {
                label: 'OwnClassTimetableForToday',
                skip: !klasseId,
                run: () => untis.getOwnClassTimetableForToday(),
                schema: z.array(schemaFor('Lesson')),
            },
            {
                label: 'OwnClassTimetableForDate',
                skip: !klasseId,
                run: () => untis.getOwnClassTimetableFor(today),
                schema: z.array(schemaFor('Lesson')),
            },
            {
                label: 'OwnClassTimetableForRange',
                skip: !klasseId,
                run: () => untis.getOwnClassTimetableForRange(today, nextWeek),
                schema: z.array(schemaFor('Lesson')),
            },
            {
                label: 'HomeWorksFor[]',
                run: () => untis.getHomeWorksFor(today, nextWeek),
                // API response is a keyed object rather than a simple array; accept anything and rely on inferred shape
                schema: z.unknown(),
            },
            {
                label: 'HomeWorkAndLessons',
                run: () => untis.getHomeWorkAndLessons(today, nextWeek),
            },
            {
                label: 'ExamsForRange[]',
                skip: !klasseId,
                run: () => untis.getExamsForRange(today, nextWeek, klasseId, true),
                schema: z.array(schemaFor('Exam')),
            },
            {
                label: 'TimetableForWeek',
                skip: !hasPerson,
                run: () => untis.getTimetableForWeek(today, sessionInfo.personId!, sessionInfo.personType!),
                schema: schemaFor('WebAPITimetable'),
            },
            {
                label: 'OwnTimetableForWeek',
                skip: !hasPerson,
                run: () => untis.getOwnTimetableForWeek(today),
                schema: schemaFor('WebAPITimetable'),
            },
            {
                label: 'AbsentLesson',
                skip: !hasPerson,
                run: () => untis.getAbsentLesson(today, nextWeek),
                schema: schemaFor('Absences'),
            },
            {
                label: 'PdfOfAbsentLesson',
                skip: !hasPerson,
                run: () => untis.getPdfOfAbsentLesson(today, nextWeek),
            },
        ];

    for (const check of checks) {
        if (check.skip) {
            console.log(`⏭️  Skipping ${check.label} (missing prerequisites)`);
            continue;
        }
        console.log(`➡️  ${check.label}...`);
        try {
            const result = await check.run();
            if (check.schema) {
                report(check.label, result, check.schema);
            } else {
                console.log(`✅ ${check.label}: call succeeded (no schema check)`);
            }
        } catch (err) {
            console.error(`❌ ${check.label}:`, err);
        }
    }

    console.log('🧹 Logging out...');
    await untis.logout();
}

main().catch((err) => {
    console.error('Fatal error during runtime type check:', err);
    process.exit(1);
});

function inferTsType(value: unknown, depth = 0, seen = new WeakSet()): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (value instanceof Date) return 'Date';
    const t = typeof value;
    if (t === 'string' || t === 'number' || t === 'boolean' || t === 'bigint' || t === 'symbol') return t;
    if (Array.isArray(value)) {
        if (value.length === 0) return 'any[]';
        const childTypes = Array.from(new Set(value.map((v) => inferTsType(v, depth + 1, seen))));
        const union = childTypes.length === 1 ? childTypes[0] : childTypes.join(' | ');
        return `${union}[]`;
    }
    if (t === 'object') {
        if (seen.has(value as object)) return 'any /* circular */';
        seen.add(value as object);
        const entries = Object.entries(value as Record<string, unknown>);
        if (entries.length === 0) return '{}';
        const indent = '  '.repeat(depth + 1);
        const closingIndent = '  '.repeat(depth);
        const lines = entries
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${indent}${JSON.stringify(k)}: ${inferTsType(v, depth + 1, seen)};`);
        return `{\n${lines.join('\n')}\n${closingIndent}}`;
    }
    return 'any';
}

function indentMultiline(text: string, prefix: string): string {
    return text
        .split('\n')
        .map((line) => prefix + line)
        .join('\n');
}

const sessionInformationSchema = z.object({
    klasseId: z.number().optional(),
    personId: z.number().optional(),
    sessionId: z.string().optional(),
    personType: z.number().optional(),
    jwt_token: z.string().optional(),
});

const schemaRegistry: Record<string, Schema> = {
    SessionInformation: sessionInformationSchema,
    SchoolYear: schoolYearSchema,
    NewsWidget: newsWidgetSchema,
    Inbox: inboxSchema,
    Subject: subjectSchema,
    Timegrid: timegridSchema,
    Exam: examSchema,
    WebAPITimetable: webApiTimetableSchema,
    Teacher: teacherSchema,
    Student: studentSchema,
    Room: roomSchema,
    Klasse: klasseSchema,
    Department: departmentSchema,
    Holiday: holidaySchema,
    StatusData: statusDataSchema,
    Absences: absencesSchema,
    Lesson: lessonSchema,
    Homeworks: homeworksSchema,
};

function schemaFor(name: keyof typeof schemaRegistry): Schema {
    const schema = schemaRegistry[name];
    if (!schema) {
        throw new Error(`Missing schema for ${name}`);
    }
    return schema;
}
