import { serialize } from './cookie';

import { btoa } from './base-64';
import { parse as fnsParse, startOfDay, format, type ParseOptions } from 'date-fns';

import type {
    Absences,
    Department,
    Exam,
    Holiday,
    Homeworks,
    Inbox,
    Klasse,
    Lesson,
    NewsWidget,
    Room,
    SchoolYear,
    StatusData,
    Student,
    Subject,
    Teacher,
    Timegrid,
    WebAPITimetable,
} from './types';
import type { InternalSchoolYear, SessionInformation } from './internal';
import { WebUntisElementType } from './types';

/**
 * Ensures that the dateStr is a string when calling {@link fnsParse}.
 * This is needed since some WebUntis servers return numbers instead of strings.
 * @param dateStr {string | number}
 * @param formatStr {string}
 * @param referenceDate {DateType | number | string}
 * @param options {ParseOptions | undefined}
 * @returns
 */
const parse = <DateType extends Date>(
    dateStr: string | number,
    formatStr: string,
    referenceDate: DateType | number | string,
    options?: ParseOptions,
) => {
    return fnsParse(`${dateStr}`, formatStr, referenceDate, options);
};

export class Base {
    school: string;
    schoolBase64: string;
    username: string;
    password: string;
    baseurl?: string;
    cookies: string[];
    id: string;
    sessionInformation: SessionInformation | null;
    anonymous: boolean;

    baseHeaders: Record<string, string>;

    static TYPES = WebUntisElementType;

    /**
     * Custom fetch wrapper that provides axios-like functionality
     * @protected
     */
    protected async _fetch(
        url: string,
        options: {
            method?: string;
            searchParams?: Record<string, any>;
            headers?: Record<string, string>;
            body?: any;
            expectText?: boolean;
        } = {},
    ): Promise<any> {
        const { method = 'GET', searchParams = {}, headers = {}, body, expectText = false } = options;

        // Build URL with search parameters
        const fullUrl = new URL(url, this.baseurl);
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            fullUrl.searchParams.append(key, value.toString());
        });

        // Prepare request options
        const fetchOptions: RequestInit = {
            method,
            redirect: 'manual',
            headers: {
                ...this.baseHeaders,
                ...headers,
            },
        };

        // Add body for POST/PUT requests
        if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            if (typeof body === 'object') {
                fetchOptions.headers = {
                    ...fetchOptions.headers,
                    'Content-Type': 'application/json',
                };
                fetchOptions.body = JSON.stringify(body);
            } else {
                fetchOptions.body = body;
            }
        }

        // Make the request
        const response = await fetch(fullUrl.toString(), fetchOptions);

        // Handle status validation (similar to axios validateStatus)
        if (!(response.status >= 200 && response.status < 303)) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Parse response
        if (expectText) {
            return await response.text();
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        return await response.text();
    }

    /**
     * Raw fetch method that returns the Response object
     * @protected
     */
    protected async _fetchRaw(
        url: string,
        options: {
            method?: string;
            searchParams?: Record<string, any>;
            headers?: Record<string, string>;
            body?: any;
        } = {},
    ): Promise<Response> {
        const { method = 'GET', searchParams = {}, headers = {}, body } = options;

        // Build URL with search parameters
        const fullUrl = new URL(url, this.baseurl);
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            fullUrl.searchParams.append(key, value.toString());
        });

        // Prepare request options
        const fetchOptions: RequestInit = {
            method,
            redirect: 'manual',
            headers: {
                ...this.baseHeaders,
                ...headers,
            },
        };

        // Add body for POST/PUT requests
        if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            if (typeof body === 'object') {
                fetchOptions.headers = {
                    ...fetchOptions.headers,
                    'Content-Type': 'application/json',
                };
                fetchOptions.body = JSON.stringify(body);
            } else {
                fetchOptions.body = body;
            }
        }

        // Make the request and return raw response
        return await fetch(fullUrl.toString(), fetchOptions);
    }

    /**
     * @param {string} school The school identifier
     * @param {string} username
     * @param {string} password
     * @param {string} baseurl Just the host name of your WebUntis (Example: [school].webuntis.com)
     * @param {string} [identity="Awesome"] A identity like: MyAwesomeApp

     * @param {boolean} [disableUserAgent=false] If this is true, fetch will not send a custom User-Agent
     */
    constructor(
        school: string,
        username: string,
        password: string,
        baseurl?: string,
        identity: string = 'Awesome',
        disableUserAgent: boolean = false,
    ) {
        this.school = school;
        this.schoolBase64 = btoa(school);
        this.username = username;
        this.password = password;
        this.baseurl = 'https://' + (baseurl ? baseurl : `${school}.webuntis.com`) + '/';
        this.cookies = [];
        this.id = identity;
        this.sessionInformation = {};
        this.anonymous = false;

        this.baseHeaders = {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            'X-Requested-With': 'XMLHttpRequest',
        };

        if (!disableUserAgent) {
            this.baseHeaders['User-Agent'] =
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 15_7_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15';
        }
    }

    /**
     * Logout the current session
     */
    async logout(): Promise<boolean> {
        await this._fetch('/WebUntis/jsonrpc.do', {
            method: 'POST',

            searchParams: {
                school: this.school,
            },

            body: {
                id: this.id,
                method: 'logout',
                params: {},
                jsonrpc: '2.0',
            },
        });
        this.sessionInformation = null;
        return true;
    }

    /**
     * Login with your credentials
     *
     * **Notice: The server may revoke this session after less than 10min of idle.**
     *
     * *Untis says in the official docs:*
     * > An application should always log out as soon as possible to free system resources on the server.
     */
    async login(): Promise<SessionInformation> {
        const response = await this._fetch('/WebUntis/jsonrpc.do', {
            method: 'POST',

            searchParams: {
                school: this.school,
            },

            body: {
                id: this.id,
                method: 'authenticate',
                params: {
                    user: this.username,
                    password: this.password,
                    client: this.id,
                },
                jsonrpc: '2.0',
            },
        });

        if (typeof response !== 'object') throw new Error('Failed to parse server response.');
        if (!response.result) throw new Error('Failed to login. ' + JSON.stringify(response));
        if (response.result.code) throw new Error('Login returned error code: ' + response.result.code);
        if (!response.result.sessionId) throw new Error('Failed to login. No session id.');

        this.sessionInformation = response.result;

        const klasse = await this._getKlasseId();
        if (klasse && this.sessionInformation) {
            this.sessionInformation.klasseId = klasse;
        }
        const loggedInUser = await this._getAppConfig();
        if (loggedInUser) {
            this.sessionInformation = {
                ...this.sessionInformation,
                ...loggedInUser,
            };
        }
        return response.result;
    }

    /**
     * Get the latest WebUntis Schoolyear
     * @param {Boolean} [validateSession=true]
     */
    async getLatestSchoolyear(validateSession: boolean = true): Promise<SchoolYear> {
        const data = await this._request<InternalSchoolYear[]>('getSchoolyears', {}, validateSession);
        data.sort((a, b) => {
            const na = parse(a.startDate, 'yyyyMMdd', new Date());
            const nb = parse(b.startDate, 'yyyyMMdd', new Date());
            return nb.getTime() - na.getTime();
        });
        if (!data[0]) throw new Error('Failed to receive school year');
        return {
            name: data[0].name,
            id: data[0].id,
            startDate: parse(data[0].startDate, 'yyyyMMdd', new Date()),
            endDate: parse(data[0].endDate, 'yyyyMMdd', new Date()),
        };
    }

    /**
     * Get all WebUntis Schoolyears
     * @param {Boolean} [validateSession=true]
     */
    async getSchoolyears(validateSession: boolean = true): Promise<SchoolYear[]> {
        const data = await this._request<InternalSchoolYear[]>('getSchoolyears', {}, validateSession);
        data.sort((a, b) => {
            const na = parse(a.startDate, 'yyyyMMdd', new Date());
            const nb = parse(b.startDate, 'yyyyMMdd', new Date());
            return nb.getTime() - na.getTime();
        });
        if (!data[0]) throw new Error('Failed to receive school year');
        return data.map((year) => {
            return {
                name: year.name,
                id: year.id,
                startDate: parse(year.startDate, 'yyyyMMdd', new Date()),
                endDate: parse(year.endDate, 'yyyyMMdd', new Date()),
            };
        });
    }

    /**
     * Get News Widget
     * @param {Date} date
     * @param {boolean} [validateSession=true]
     * @returns {Promise<Object>} see index.d.ts NewsWidget
     */
    async getNewsWidget(date: Date, validateSession: boolean = true): Promise<NewsWidget> {
        if (validateSession && !(await this.validateSession())) throw new Error('Current Session is not valid');

        const response = await this._fetch('/WebUntis/api/public/news/newsWidgetData', {
            method: 'GET',

            searchParams: {
                date: Base.convertDateToUntis(date),
            },
            headers: {
                Cookie: this._buildCookies(),
            },
        });

        if (typeof response.data !== 'object')
            throw new Error(`Server returned invalid data: expected data object, got ${typeof response.data}`);

        return response.data;
    }

    /**
     * Get Inbox
     */
    async getInbox(validateSession = true): Promise<Inbox> {
        this._checkAnonymous();
        if (validateSession && !(await this.validateSession())) throw new Error('Current Session is not valid');
        //first get JWT Token
        const s = this.getSessionInfo();
        if (typeof s.jwt_token != 'string') await this._getJWT();

        const response = await this._fetch('/WebUntis/api/rest/view/v1/messages', {
            method: 'GET',

            headers: {
                Authorization: `Bearer ${s.jwt_token}`,
                Cookie: this._buildCookies(),
            },
        });

        if (typeof response !== 'object')
            throw new Error(`Server returned invalid data: expected object, got ${typeof response}`);

        return response;
    }

    private _checkAnonymous() {
        if (this.anonymous) {
            throw new Error('This method is not supported with anonymous login');
        }
    }

    /**
     * Return the current session information or throw if not present
     * @private
     */
    private getSessionInfo(): SessionInformation {
        if (!this.sessionInformation) throw new Error('Session not initialized');
        return this.sessionInformation;
    }

    /**
     * Return current person identifiers required for timetable/requests
     * @private
     */
    private getCurrentPerson(): { personId: number; personType: number; klasseId?: number } {
        const s = this.getSessionInfo();
        if (!Number.isInteger(s.personId) || !Number.isInteger(s.personType)) {
            throw new Error('Session does not contain person identifiers');
        }
        return { personId: s.personId!, personType: s.personType!, klasseId: s.klasseId };
    }

    /**
     *
     * @returns {string}
     * @private
     */
    _buildCookies(): string {
        let cookies = [];
        const s = this.getSessionInfo();
        cookies.push(serialize('JSESSIONID', s.sessionId!));
        cookies.push('schoolname=_' + this.schoolBase64);
        // console.log('_buildCookies', cookies)
        return cookies.join('; ');
    }

    async _getAppConfig() {
        const response = await this._fetch('/WebUntis/api/app/config', {
            method: 'GET',
            headers: {
                Cookie: this._buildCookies(),
            },
        });
        // console.log("_getAppConfig | response", JSON.stringify(response?.data?.loginServiceConfig?.user, null, 2));
        return response?.data?.loginServiceConfig?.user || undefined;
    }

    async _getKlasseId() {
        const response = await this._fetch('/WebUntis/api/daytimetable/config', {
            method: 'GET',
            headers: {
                Cookie: this._buildCookies(),
                'User-Agent': this.baseHeaders['User-Agent'] || '',
            },
        });

        // console.log("_getKlasseId | response", JSON.stringify(response, null, 2));

        return response?.data?.klasseId || undefined;
    }

    _getPersonIdAndType(): { personId: number; personType: number } {
        let { personId, personType, persons } = this.getSessionInfo();
        if (personType === 12 && persons && persons.length < 0) {
            throw new Error('getOwnTimetableForToday is not supported for personType 12 (Guardian)');
        } else {
            personId = persons?.[0].id;
            personType = persons?.[0].type;
        }
        if (!personId || !personType) return null as any;

        return { personId, personType };
    }

    /**
     * Get JWT Token
     * @private
     */
    async _getJWT(validateSession = true): Promise<string> {
        if (validateSession && !(await this.validateSession())) throw new Error('Current Session is not valid');

        const response = await this._fetch('/WebUntis/api/token/new', {
            method: 'GET',

            headers: {
                //Authorization: `Bearer ${this._getToken()}`,
                Cookie: this._buildCookies(),
            },
            expectText: true,
        });

        if (typeof response !== 'string')
            throw new Error(`Server returned invalid data: expected string token, got ${typeof response}`);

        this.getSessionInfo().jwt_token = response;
        return response;
    }

    /**
     * Checks if your current WebUntis Session is valid
     */
    async validateSession(): Promise<boolean> {
        if (!this.sessionInformation) return false;

        const response = await this._fetch('/WebUntis/jsonrpc.do', {
            method: 'POST',

            searchParams: {
                school: this.school,
            },
            headers: {
                Cookie: this._buildCookies(),
            },

            body: {
                id: this.id,
                method: 'getLatestImportTime',
                params: {},
                jsonrpc: '2.0',
            },
        });

        return typeof response.result === 'number';
    }

    /**
     * Get the time when WebUntis last changed its data
     * @param {Boolean} [validateSession=true]
     */
    async getLatestImportTime(validateSession: boolean = true): Promise<number> {
        return this._request('getLatestImportTime', {}, validateSession);
    }

    /**
     *
     * @param id
     * @param type
     * @param startDate
     * @param endDate
     * @param validateSession
     * @private
     */
    private async _timetableRequest(
        id: string | number,
        type: number,
        startDate?: Date | null,
        endDate?: Date | null,
        validateSession = true,
    ): Promise<Lesson[]> {
        const additionalOptions: Record<string, unknown> = {};
        if (startDate) {
            additionalOptions.startDate = Base.convertDateToUntis(startDate);
        }
        if (endDate) {
            additionalOptions.endDate = Base.convertDateToUntis(endDate);
        }

        return this._request(
            'getTimetable',
            {
                options: {
                    id: new Date().getTime(),
                    element: {
                        id,
                        type,
                    },
                    ...additionalOptions,
                    showLsText: true,
                    showStudentgroup: true,
                    showLsNumber: true,
                    showSubstText: true,
                    showInfo: true,
                    showBooking: true,
                    klasseFields: ['id', 'name', 'longname', 'externalkey'],
                    roomFields: ['id', 'name', 'longname', 'externalkey'],
                    subjectFields: ['id', 'name', 'longname', 'externalkey'],
                    teacherFields: ['id', 'name', 'longname', 'externalkey'],
                },
            },
            validateSession,
        );
    }

    /**
     * Get your own Timetable for the current day
     * Note: You can't use this with anonymous login
     * @param {Boolean} [validateSession=true]
     * @returns {Promise<Array>}
     */
    async getOwnTimetableForToday(validateSession: boolean = true): Promise<Lesson[]> {
        this._checkAnonymous();
        const { personId, personType } = this._getPersonIdAndType();
        return await this._timetableRequest(personId!, personType!, null, null, validateSession);
    }

    /**
     * Get the timetable of today for a specific element.
     * @param {number} id
     * @param {WebUntisElementType} type
     * @param {Boolean} [validateSession=true]
     * @returns {Promise<Array>}
     */
    async getTimetableForToday(id: number, type: number, validateSession: boolean = true): Promise<Lesson[]> {
        const { personId, personType } = this._getPersonIdAndType();
        return await this._timetableRequest(personId, personType, null, null, validateSession);
    }

    /**
     * Get your own Timetable for the given day
     * Note: You can't use this with anonymous login
     * @param {Date} date
     * @param {Boolean} [validateSession=true]
     */
    async getOwnTimetableFor(date: Date, validateSession: boolean = true): Promise<Lesson[]> {
        this._checkAnonymous();
        const { personId, personType } = this._getPersonIdAndType();
        return await this._timetableRequest(personId!, personType!, date, date, validateSession);
    }

    /**
     * Get the timetable for a specific day for a specific element.
     * @param {Date} date
     * @param {number} id
     * @param {WebUntisElementType} type
     * @param {Boolean} [validateSession=true]
     */
    async getTimetableFor(date: Date, id: number, type: number, validateSession: boolean = true): Promise<Lesson[]> {
        const { personId, personType } = this._getPersonIdAndType();
        return await this._timetableRequest(personId, personType, date, date, validateSession);
    }

    /**
     * Get your own timetable for a given Date range
     * Note: You can't use this with anonymous login
     * @param {Date} rangeStart
     * @param {Date} rangeEnd
     * @param {Boolean} [validateSession=true]
     * @returns {Promise.<Array>}
     */
    async getOwnTimetableForRange(
        rangeStart: Date,
        rangeEnd: Date,
        validateSession: boolean = true,
    ): Promise<Lesson[]> {
        this._checkAnonymous();
        Base.validateDateRange(rangeStart, rangeEnd, 'getOwnTimetableForRange');
        const { personId, personType } = this._getPersonIdAndType();
        return await this._timetableRequest(personId!, personType!, rangeStart, rangeEnd, validateSession);
    }

    /**
     * Get the timetable for a given Date range for specific element
     * @param {Date} rangeStart
     * @param {Date} rangeEnd
     * @param {number} id
     * @param {WebUntisElementType} type
     * @param {Boolean} [validateSession=true]
     */
    async getTimetableForRange(
        rangeStart: Date,
        rangeEnd: Date,
        id: number,
        type: number,
        validateSession: boolean = true,
    ): Promise<Lesson[]> {
        Base.validateDateRange(rangeStart, rangeEnd, 'getTimetableForRange');
        const { personId, personType } = this._getPersonIdAndType();
        return await this._timetableRequest(personId, personType, rangeStart, rangeEnd, validateSession);
    }

    /**
     * Get the Timetable of your class for today
     * Note: You can't use this with anonymous login
     * @param {Boolean} [validateSession=true]
     * @returns {Promise<Array>}
     */
    async getOwnClassTimetableForToday(validateSession: boolean = true): Promise<Lesson[]> {
        this._checkAnonymous();
        const s = this.getSessionInfo();
        return await this._timetableRequest(s.klasseId!, 1, null, null, validateSession);
    }

    /**
     * Get the Timetable of your class for the given day
     * Note: You can't use this with anonymous login
     * @param {Date} date
     * @param {Boolean} [validateSession=true]
     * @returns {Promise.<Array>}
     */
    async getOwnClassTimetableFor(date: Date, validateSession: boolean = true): Promise<Lesson[]> {
        this._checkAnonymous();
        const s = this.getSessionInfo();
        return await this._timetableRequest(s.klasseId!, 1, date, date, validateSession);
    }

    /**
     * Get the Timetable of your class for a given Date range
     * Note: You can't use this with anonymous login
     * @param {Date} rangeStart
     * @param {Date} rangeEnd
     * @param {boolean} [validateSession=true]
     */
    async getOwnClassTimetableForRange(
        rangeStart: Date,
        rangeEnd: Date,
        validateSession: boolean = true,
    ): Promise<Lesson[]> {
        this._checkAnonymous();
        Base.validateDateRange(rangeStart, rangeEnd, 'getOwnClassTimetableForRange');
        const s = this.getSessionInfo();
        return await this._timetableRequest(s.klasseId!, 1, rangeStart, rangeEnd, validateSession);
    }

    /**
     *
     * @param {Date} rangeStart
     * @param {Date} rangeEnd
     * @param {boolean} [validateSession=true]
     * @returns {Promise.<Array>}
     */
    async getHomeWorksFor(rangeStart: Date, rangeEnd: Date, validateSession: boolean = true): Promise<Homeworks> {
        Base.validateDateRange(rangeStart, rangeEnd, 'getHomeWorksFor');
        if (validateSession && !(await this.validateSession())) throw new Error('Current Session is not valid');

        const response = await this._fetch('/WebUntis/api/homeworks/lessons', {
            method: 'GET',

            searchParams: {
                startDate: Base.convertDateToUntis(rangeStart),
                endDate: Base.convertDateToUntis(rangeEnd),
            },
            headers: {
                Cookie: this._buildCookies(),
            },
        });

        if (typeof response.data !== 'object')
            throw new Error(`Server returned invalid data: expected data object, got ${typeof response.data}`);

        if (!response.data['homeworks']) throw new Error(`Data object doesn't contain 'homeworks' field`);
        return response.data;
    }

    /**
     * Converts the untis date string format to a normal JS Date object
     * @param {string} date Untis date string
     * @param {Date} [baseDate=new Date()] Base date. Default beginning of current day
     */
    static convertUntisDate(date: string, baseDate: Date = startOfDay(new Date())): Date {
        if (typeof date !== 'string') date = `${date}`;
        return parse(date, 'yyyyMMdd', baseDate);
    }

    /**
     * Convert a untis time string to a JS Date object
     * @param {string|number} time Untis time string
     * @param {Date} [baseDate=new Date()] Day used as base for the time. Default: Current date
     */
    static convertUntisTime(time: number | string, baseDate: Date = new Date()): Date {
        if (typeof time !== 'string') time = `${time}`;
        return parse(time.padStart(4, '0'), 'Hmm', baseDate);
    }

    /**
     * Validate that a date range is valid (both Dates and start <= end)
     * @private
     */
    static validateDateRange(rangeStart: Date, rangeEnd: Date, name = 'date range') {
        if (!(rangeStart instanceof Date) || isNaN(rangeStart.getTime()))
            throw new Error(`${name}: rangeStart is not a valid Date`);
        if (!(rangeEnd instanceof Date) || isNaN(rangeEnd.getTime()))
            throw new Error(`${name}: rangeEnd is not a valid Date`);
        if (rangeStart.getTime() > rangeEnd.getTime()) throw new Error(`${name}: rangeStart must be <= rangeEnd`);
    }

    /**
     * Get all known Subjects for the current logged-in user
     * @param {boolean} [validateSession=true]
     */
    async getSubjects(validateSession: boolean = true): Promise<Subject[]> {
        return await this._request('getSubjects', {}, validateSession);
    }

    /**
     * Get the timegrid of current school
     * @param {boolean} [validateSession=true]
     * @returns {Promise.<Array>}
     */
    async getTimegrid(validateSession: boolean = true): Promise<Timegrid[]> {
        return await this._request('getTimegridUnits', {}, validateSession);
    }

    /**
     *
     * TODO: Find out what type this function returns
     * @param {Date} rangeStart
     * @param {Date} rangeEnd
     * @param {boolean} [validateSession=true]
     * @returns {Promise.<void>}
     */
    async getHomeWorkAndLessons(
        rangeStart: Date,
        rangeEnd: Date,
        validateSession: boolean = true,
    ): Promise<Array<any>> {
        Base.validateDateRange(rangeStart, rangeEnd, 'getHomeWorkAndLessons');
        if (validateSession && !(await this.validateSession())) throw new Error('Current Session is not valid');

        const response = await this._fetch('/WebUntis/api/homeworks/lessons', {
            method: 'GET',

            searchParams: {
                startDate: Base.convertDateToUntis(rangeStart),
                endDate: Base.convertDateToUntis(rangeEnd),
            },
            headers: {
                Cookie: this._buildCookies(),
            },
        });

        if (typeof response.data !== 'object')
            throw new Error(`Server returned invalid data: expected data object, got ${typeof response.data}`);

        if (!response.data['homeworks']) throw new Error("Data object doesn't contains homeworks object.");
        return response.data;
    }

    /**
     * Get Exams for range
     * @param {Date} rangeStart
     * @param {Date} rangeEnd
     * @param {Number} klasseId
     * @param {boolean} withGrades
     * @param {boolean} [validateSession=true]
     */
    async getExamsForRange(
        rangeStart: Date,
        rangeEnd: Date,
        klasseId: string | number | undefined = undefined,
        withGrades: boolean = false,
        validateSession: boolean = true,
    ): Promise<Array<Exam>> {
        Base.validateDateRange(rangeStart, rangeEnd, 'getExamsForRange');
        if (validateSession && !(await this.validateSession())) throw new Error('Current Session is not valid');

        const response = await this._fetch('/WebUntis/api/exams', {
            method: 'GET',

            searchParams: {
                startDate: Base.convertDateToUntis(rangeStart),
                endDate: Base.convertDateToUntis(rangeEnd),
                klasseId: this.sessionInformation?.klasseId,
                withGrades,
            },
            headers: {
                Cookie: this._buildCookies(),
            },
        });

        if (typeof response.data !== 'object')
            throw new Error(`Server returned invalid data: expected data object, got ${typeof response.data}`);

        if (!response.data['exams']) throw new Error(`Data object doesn't contain 'exams' field`);
        return response.data['exams'];
    }

    /**
     * Get the timetable for the current week for a specific element from the web client API.
     * @param {Date} date one date in the week to query
     * @param {number} id element id
     * @param {WebUntisElementType} type element type
     * @param {Number} [formatId=1] set to 1 to include teachers, 2 omits the teachers in elements response
     * @param {Boolean} [validateSession=true]
     */
    async getTimetableForWeek(
        date: Date,
        id: number,
        type: number,
        formatId: number = 1,
        validateSession: boolean = true,
    ): Promise<WebAPITimetable> {
        if (validateSession && !(await this.validateSession())) throw new Error('Current Session is not valid');
        const { personId, personType } = this._getPersonIdAndType();
        const response = await this._fetch('/WebUntis/api/public/timetable/weekly/data', {
            method: 'GET',

            searchParams: {
                elementType: personType,
                elementId: personId,
                date: format(date, 'yyyy-MM-dd'),
                formatId: formatId,
            },
            headers: {
                Cookie: this._buildCookies(),
            },
        });

        if (typeof response.data !== 'object') throw new Error('Server returned invalid data.');

        if (response.data.error) {
            /* known codes:
             * - ERR_TTVIEW_NOTALLOWED_ONDATE
             */
            const err = new Error('Server responded with error');
            // TODO: Make this better lol
            // @ts-ignore

            err.code = response.data.error?.data?.messageKey;
            throw err;
        }

        if (!response.data?.result?.data?.elementPeriods?.[personId]) throw new Error('Invalid response');

        const data = response.data.result.data;

        // TODO: improve typings

        const formatElements = (elements: Array<Record<string, unknown>>, { byType }: { byType: number }) => {
            const filteredElements = elements.filter((element) => element.type === byType);

            return filteredElements.map((element) => ({
                ...element,
                element: data.elements.find(
                    (dataElement: Record<string, unknown>) =>
                        dataElement.type === byType && dataElement.id === element.id,
                ),
            }));
        };

        const timetable = data.elementPeriods[personId].map((lesson: any) => ({
            ...lesson,
            classes: formatElements(lesson.elements, { byType: Base.TYPES.CLASS }),
            teachers: formatElements(lesson.elements, { byType: Base.TYPES.TEACHER }),
            subjects: formatElements(lesson.elements, { byType: Base.TYPES.SUBJECT }),
            rooms: formatElements(lesson.elements, { byType: Base.TYPES.ROOM }),
            students: formatElements(lesson.elements, { byType: Base.TYPES.STUDENT }),
        }));

        return timetable;
    }

    /**
     * Get the timetable for the current week for the current element from the web client API.
     * @param {Date} date one date in the week to query
     * @param {Number} [formatId=1] set to 1 to include teachers, 2 omits the teachers in elements response
     * @param {Boolean} [validateSession=true]
     * @returns {Promise<WebAPITimetable[]>}
     */
    async getOwnTimetableForWeek(
        date: Date,
        formatId: number = 1,
        validateSession: boolean = true,
    ): Promise<WebAPITimetable> {
        this._checkAnonymous();
        const s = this.getSessionInfo();
        return await this.getTimetableForWeek(date, s.personId!, s.personType!, formatId, validateSession);
    }

    /**
     * Get all known teachers by WebUntis
     * @param {boolean} [validateSession=true]
     * @returns {Promise.<Array>}
     */
    async getTeachers(validateSession: boolean = true): Promise<Teacher[]> {
        return await this._request('getTeachers', {}, validateSession);
    }

    /**
     * Get all known students by WebUntis
     * @param {boolean} [validateSession=true]
     * @returns {Promise.<Array>}
     */
    async getStudents(validateSession: boolean = true): Promise<Student[]> {
        return await this._request('getStudents', {}, validateSession);
    }

    /**
     * Get all known rooms by WebUntis
     * @param {boolean} [validateSession=true]
     * @returns {Promise.<Array>}
     */
    async getRooms(validateSession: boolean = true): Promise<Room[]> {
        return await this._request('getRooms', {}, validateSession);
    }

    /**
     * Get all classes known by WebUntis
     * @param {boolean} [validateSession=true]
     * @param {number} schoolyearId
     * @returns {Promise.<Array>}
     */
    async getClasses(validateSession: boolean = true, schoolyearId: number): Promise<Klasse[]> {
        const data = typeof schoolyearId !== 'number' ? {} : { schoolyearId };
        return await this._request('getKlassen', data, validateSession);
    }

    /**
     * Get all departments known by WebUntis
     * @param {boolean} [validateSession=true]
     * @returns {Promise.<Array>}
     */
    async getDepartments(validateSession: boolean = true): Promise<Department[]> {
        return await this._request('getDepartments', {}, validateSession);
    }

    /**
     * Get all holidays known by WebUntis
     * @param {boolean} [validateSession=true]
     * @returns {Promise.<Array>}
     */
    async getHolidays(validateSession: boolean = true): Promise<Holiday[]> {
        return await this._request('getHolidays', {}, validateSession);
    }

    /**
     * Get all status data known by WebUntis
     * @param {boolean} [validateSession=true]
     * @returns {Promise.<Array>}
     */
    async getStatusData(validateSession: boolean = true): Promise<StatusData> {
        return await this._request('getStatusData', {}, validateSession);
    }

    /**
     * Get the current school year
     * @param [validateSession=true]
     * @returns {Promise.<SchoolYear>}
     */
    async getCurrentSchoolyear(validateSession = true): Promise<SchoolYear> {
        const data = await this._request<InternalSchoolYear>('getCurrentSchoolyear', {}, validateSession);

        if (!data) throw new Error('Failed to retrieve current school year');

        return {
            name: data.name,
            id: data.id,
            startDate: Base.convertUntisDate(data.startDate),
            endDate: Base.convertUntisDate(data.endDate),
        };
    }

    /**
     * Convert a JS Date Object to a WebUntis date string
     * @param {Date} date
     * @returns {String}
     */
    static convertDateToUntis(date: Date): string {
        return (
            date.getFullYear().toString() +
            (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1).toString() +
            (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()).toString()
        );
    }

    /**
     * Make a JSON RPC Request with the current session
     * @param {string} method
     * @param {Object} [parameter={}]
     * @param {string} [url='/WebUntis/jsonrpc.do?school=SCHOOL']
     * @param {boolean} [validateSession=true] Whether the session should be checked first
     * @returns {Promise.<any>}
     * @private
     */
    async _request<Response = Record<string, any>>(
        method: string,
        parameter: Record<string, any> = {},
        validateSession: boolean = true,
        url: string = `/WebUntis/jsonrpc.do`,
    ): Promise<Response> {
        if (validateSession && !(await this.validateSession())) throw new Error('Current Session is not valid');

        const response = await this._fetch(url, {
            method: 'POST',

            searchParams: {
                school: this.school,
            },
            headers: {
                Cookie: this._buildCookies(),
            },

            body: {
                id: this.id,
                method: method,
                params: parameter,
                jsonrpc: '2.0',
            },
        });

        if (!response.result) throw new Error("Server didn't return any result.");
        if (response.result.code) throw new Error('Server returned error code: ' + response.result.code);
        return response.result;
    }

    /**
     * Returns all the Lessons where you were absent including the excused one!
     * @param {Date} rangeStart
     * @param {Date} rangeEnd
     * @param {number} [excuseStatusId=-1]
     * @param {boolean} [validateSession=true]
     * @returns {Promise<Absences>}
     */
    async getAbsentLesson(
        rangeStart: Date,
        rangeEnd: Date,
        excuseStatusId: number = -1,
        validateSession: boolean = true,
    ): Promise<Absences> {
        Base.validateDateRange(rangeStart, rangeEnd, 'getAbsentLesson');
        if (validateSession && !(await this.validateSession())) throw new Error('Current Session is not valid');
        this._checkAnonymous();
        const { personId } = this._getPersonIdAndType();
        const response = await this._fetch('/WebUntis/api/classreg/absences/students', {
            method: 'GET',

            searchParams: {
                startDate: Base.convertDateToUntis(rangeStart),
                endDate: Base.convertDateToUntis(rangeEnd),
                studentId: personId,
                excuseStatusId: excuseStatusId,
            },
            headers: {
                Cookie: this._buildCookies(),
            },
        });
        if (response.data == null) throw new Error('Server returned no data!');
        return response.data;
    }

    /**
     * Returns a URL to a unique PDF of all the lessons you were absent
     * @param {Date} rangeStart
     * @param {Date} rangeEnd
     * @param {boolean} [validateSession=true]
     * @param {number} [excuseStatusId=-1]
     * @param {boolean} [lateness=true]
     * @param {boolean} [absences=true]
     * @param {boolean} [excuseGroup=2]
     */
    async getPdfOfAbsentLesson(
        rangeStart: Date,
        rangeEnd: Date,
        validateSession: boolean = true,
        excuseStatusId: number,
        lateness: boolean = true,
        absences: boolean = true,
        excuseGroup: number,
    ): Promise<string> {
        Base.validateDateRange(rangeStart, rangeEnd, 'getPdfOfAbsentLesson');
        if (validateSession && !(await this.validateSession())) throw new Error('Current Session is not valid');
        this._checkAnonymous();
        const { personId } = this._getPersonIdAndType();

        console.log('personId', personId);

        const response = await this._fetch('/WebUntis/reports.do', {
            method: 'GET',

            searchParams: {
                name: 'Excuse',
                format: 'pdf',
                rpt_sd: Base.convertDateToUntis(rangeStart),
                rpt_ed: Base.convertDateToUntis(rangeEnd),
                excuseStatusId: excuseStatusId,
                studentId: personId,
                withLateness: lateness,
                withAbsences: absences,
                execuseGroup: excuseGroup,
            },
            headers: {
                Cookie: this._buildCookies(),
            },
        });

        const res = response.data;
        if (res.error) throw new Error('Server returned no data!');
        const pdfDownloadURL =
            this.baseurl + 'WebUntis/reports.do?' + 'msgId=' + res.messageId + '&' + res.reportParams;
        console.log(pdfDownloadURL);
        return pdfDownloadURL;
    }
}

/**
 * @private
 */
export class InternalWebuntisSecretLogin extends Base {
    constructor(
        school: string,
        username: string,
        password: string,
        baseurl?: string,
        identity = 'Awesome',
        disableUserAgent = false,
    ) {
        super(school, username, password, baseurl, identity, disableUserAgent);
    }

    async _otpLogin(
        token: number | string,
        username: string,
        time: number,
        skipSessionInfo = false,
    ): Promise<SessionInformation> {
        const response = await this._fetchRaw('/WebUntis/jsonrpc_intern.do', {
            method: 'POST',

            searchParams: {
                m: 'getUserData2017',
                school: this.school,
                v: 'i2.2',
            },

            body: {
                id: this.id,
                method: 'getUserData2017',
                params: [
                    {
                        auth: {
                            clientTime: time,
                            user: username,
                            otp: token,
                        },
                    },
                ],
                jsonrpc: '2.0',
            },
        });

        const responseData = await response.json();
        if (responseData && responseData.error)
            throw new Error('Failed to login. ' + (responseData.error.message || ''));
        const setCookieHeader = response.headers.get('set-cookie');
        if (!setCookieHeader) throw new Error(`Failed to login. Server didn't return a set-cookie`);
        const sessionId = this._getCookieFromSetCookie([setCookieHeader]);
        if (!sessionId) throw new Error("Failed to login. Server didn't return a session id.");

        // Set session temporary
        const baseSession: SessionInformation = {
            sessionId: sessionId,
        };
        this.sessionInformation = baseSession;
        if (skipSessionInfo) return baseSession;

        // Get personId & personType
        const appConfigUrl = `/WebUntis/api/app/config`;

        const configResponse = await this._fetch(appConfigUrl, {
            method: 'GET',

            headers: {
                Cookie: this._buildCookies(),
            },
        });

        if (typeof configResponse !== 'object' || typeof configResponse.data !== 'object')
            throw new Error('Failed to fetch app config while login. data (type): ' + typeof configResponse);
        // Path -> data.loginServiceConfig.user.persons -> find person with id
        if (
            configResponse.data &&
            configResponse.data.loginServiceConfig &&
            configResponse.data.loginServiceConfig.user &&
            !Number.isInteger(configResponse.data.loginServiceConfig.user.personId)
        )
            throw new Error('Invalid personId. personId: ' + configResponse.data.loginServiceConfig.user.personId);
        const webUntisLoginServiceUser = configResponse.data.loginServiceConfig.user;
        if (!Array.isArray(webUntisLoginServiceUser.persons))
            throw new Error('Invalid person array. persons (type): ' + typeof webUntisLoginServiceUser.persons);
        const person = webUntisLoginServiceUser.persons.find(
            (value: Record<string, unknown>) => value.id === configResponse.data.loginServiceConfig.user.personId,
        );
        if (!person) throw new Error('Can not find person in person array.');
        if (!Number.isInteger(person.type)) throw new Error('Invalid person type. type (type): ' + person.type);
        this.sessionInformation = {
            sessionId: sessionId,
            personType: person.type,
            personId: configResponse.data.loginServiceConfig.user.personId,
            // ...configResponse.data.loginServiceConfig.user,
        };
        // Get klasseId
        try {
            const dayConfigUrl = `/WebUntis/api/daytimetable/config`;

            const dayConfigResponse = await this._fetch(dayConfigUrl, {
                method: 'GET',

                headers: {
                    Cookie: this._buildCookies(),
                },
            });

            if (typeof dayConfigResponse !== 'object' || typeof dayConfigResponse.data !== 'object') throw new Error();

            if (!Number.isInteger(dayConfigResponse.data.klasseId)) throw new Error();
            this.sessionInformation = {
                sessionId: sessionId,
                personType: person.type,

                personId: configResponse.data.loginServiceConfig.user.personId,
                klasseId: dayConfigResponse.data.klasseId,
            };
        } catch (e) {
            // klasseId is not important. This request can fail
            // Log the error for diagnostics but don't fail the login
            // eslint-disable-next-line no-console
            console.warn('Failed to fetch klasseId during login (non-fatal):', e);
        }
        return this.sessionInformation;
    }

    /**
     *
     * @param {Array} setCookieArray
     * @param {string} [cookieName="JSESSIONID"]
     * @return {string|undefined}
     * @private
     */
    _getCookieFromSetCookie(setCookieArray?: string[], cookieName: string = 'JSESSIONID'): string | undefined {
        if (!setCookieArray) return undefined;
        for (let i = 0; i < setCookieArray.length; i++) {
            const setCookie = setCookieArray[i];
            if (!setCookie) continue;
            let cookieParts = setCookie.split(';');
            if (!cookieParts || !Array.isArray(cookieParts)) continue;
            for (let cookie of cookieParts) {
                cookie = cookie.trim();
                cookie = cookie.replace(/;/gm, '');
                const [Key, Value] = cookie.split('=');
                if (!Key || !Value) continue;
                if (Key === cookieName) return Value;
            }
        }
        return undefined;
    }
}
