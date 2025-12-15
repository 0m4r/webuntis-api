import { startOfDay, format, parse as parse$1 } from 'date-fns';

const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
function serialize(name, val, opt = {}) {
  if (!opt.encode) opt.encode = encodeURIComponent;
  if (!fieldContentRegExp.test(name)) throw new TypeError("argument name is invalid");
  const value = opt.encode(val);
  if (value && !fieldContentRegExp.test(value)) throw new TypeError("argument val is invalid");
  let str = name + "=" + value;
  if (null != opt.maxAge) {
    const maxAge = opt.maxAge - 0;
    if (isNaN(maxAge) || !isFinite(maxAge)) throw new TypeError("option maxAge is invalid");
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) throw new TypeError("option domain is invalid");
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) throw new TypeError("option path is invalid");
    str += "; Path=" + opt.path;
  }
  if (opt.expires) str += "; Expires=" + opt.expires.toUTCString();
  if (opt.httpOnly) str += "; HttpOnly";
  if (opt.secure) str += "; Secure";
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true:
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  return str;
}

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function btoa(input = "") {
  let str = input;
  let output = "";
  for (let block = 0, charCode, i = 0, map = chars; str.charAt(i | 0) || (map = "=", i % 1); output += map.charAt(63 & block >> 8 - i % 1 * 8)) {
    charCode = str.charCodeAt(i += 3 / 4);
    if (charCode > 255) {
      throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
    }
    block = block << 8 | charCode;
  }
  return output;
}

var WebUntisDay = /* @__PURE__ */ ((WebUntisDay2) => {
  WebUntisDay2[WebUntisDay2["Sunday"] = 1] = "Sunday";
  WebUntisDay2[WebUntisDay2["Monday"] = 2] = "Monday";
  WebUntisDay2[WebUntisDay2["Tuesday"] = 3] = "Tuesday";
  WebUntisDay2[WebUntisDay2["Wednesday"] = 4] = "Wednesday";
  WebUntisDay2[WebUntisDay2["Thursday"] = 5] = "Thursday";
  WebUntisDay2[WebUntisDay2["Friday"] = 6] = "Friday";
  WebUntisDay2[WebUntisDay2["Saturday"] = 7] = "Saturday";
  return WebUntisDay2;
})(WebUntisDay || {});
var WebUntisElementType = /* @__PURE__ */ ((WebUntisElementType2) => {
  WebUntisElementType2[WebUntisElementType2["CLASS"] = 1] = "CLASS";
  WebUntisElementType2[WebUntisElementType2["TEACHER"] = 2] = "TEACHER";
  WebUntisElementType2[WebUntisElementType2["SUBJECT"] = 3] = "SUBJECT";
  WebUntisElementType2[WebUntisElementType2["ROOM"] = 4] = "ROOM";
  WebUntisElementType2[WebUntisElementType2["STUDENT"] = 5] = "STUDENT";
  return WebUntisElementType2;
})(WebUntisElementType || {});

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
const parse = (dateStr, formatStr, referenceDate, options) => {
  return parse$1(`${dateStr}`, formatStr, referenceDate, options);
};
const _Base = class _Base {
  /**
       * @param {string} school The school identifier
       * @param {string} username
       * @param {string} password
       * @param {string} baseurl Just the host name of your WebUntis (Example: [school].webuntis.com)
       * @param {string} [identity="Awesome"] A identity like: MyAwesomeApp
  
       * @param {boolean} [disableUserAgent=false] If this is true, fetch will not send a custom User-Agent
       */
  constructor(school, username, password, baseurl, identity = "Awesome", disableUserAgent = false) {
    __publicField$2(this, "school");
    __publicField$2(this, "schoolbase64");
    __publicField$2(this, "username");
    __publicField$2(this, "password");
    __publicField$2(this, "baseurl");
    __publicField$2(this, "cookies");
    __publicField$2(this, "id");
    __publicField$2(this, "sessionInformation");
    __publicField$2(this, "anonymous");
    __publicField$2(this, "baseHeaders");
    this.school = school;
    this.schoolbase64 = "_" + btoa(this.school);
    this.username = username;
    this.password = password;
    this.baseurl = "https://" + (baseurl ? baseurl : `${school}.webuntis.com`) + "/";
    this.cookies = [];
    this.id = identity;
    this.sessionInformation = {};
    this.anonymous = false;
    this.baseHeaders = {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      "X-Requested-With": "XMLHttpRequest"
    };
    if (!disableUserAgent) {
      this.baseHeaders["User-Agent"] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 15_7_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15";
    }
  }
  /**
   * Custom fetch wrapper that provides axios-like functionality
   * @protected
   */
  async _fetch(url, options = {}) {
    const { method = "GET", searchParams = {}, headers = {}, body, expectText = false } = options;
    const fullUrl = new URL(url, this.baseurl);
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value === void 0 || value === null) return;
      fullUrl.searchParams.append(key, value.toString());
    });
    const fetchOptions = {
      method,
      redirect: "manual",
      headers: {
        ...this.baseHeaders,
        ...headers
      }
    };
    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      if (typeof body === "object") {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          "Content-Type": "application/json"
        };
        fetchOptions.body = JSON.stringify(body);
      } else {
        fetchOptions.body = body;
      }
    }
    const response = await fetch(fullUrl.toString(), fetchOptions);
    if (!(response.status >= 200 && response.status < 303)) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    if (expectText) {
      return await response.text();
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  }
  /**
   * Raw fetch method that returns the Response object
   * @protected
   */
  async _fetchRaw(url, options = {}) {
    const { method = "GET", searchParams = {}, headers = {}, body } = options;
    const fullUrl = new URL(url, this.baseurl);
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value === void 0 || value === null) return;
      fullUrl.searchParams.append(key, value.toString());
    });
    const fetchOptions = {
      method,
      redirect: "manual",
      headers: {
        ...this.baseHeaders,
        ...headers
      }
    };
    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      if (typeof body === "object") {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          "Content-Type": "application/json"
        };
        fetchOptions.body = JSON.stringify(body);
      } else {
        fetchOptions.body = body;
      }
    }
    return await fetch(fullUrl.toString(), fetchOptions);
  }
  /**
   * Logout the current session
   */
  async logout() {
    await this._fetch("/WebUntis/jsonrpc.do", {
      method: "POST",
      searchParams: {
        school: this.school
      },
      body: {
        id: this.id,
        method: "logout",
        params: {},
        jsonrpc: "2.0"
      }
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
  async login() {
    const response = await this._fetch("/WebUntis/jsonrpc.do", {
      method: "POST",
      searchParams: {
        school: this.school
      },
      body: {
        id: this.id,
        method: "authenticate",
        params: {
          user: this.username,
          password: this.password,
          client: this.id
        },
        jsonrpc: "2.0"
      }
    });
    if (typeof response !== "object") throw new Error("Failed to parse server response.");
    if (!response.result) throw new Error("Failed to login. " + JSON.stringify(response));
    if (response.result.code) throw new Error("Login returned error code: " + response.result.code);
    if (!response.result.sessionId) throw new Error("Failed to login. No session id.");
    this.sessionInformation = response.result;
    return response.result;
  }
  /**
   * Get the latest WebUntis Schoolyear
   * @param {Boolean} [validateSession=true]
   */
  async getLatestSchoolyear(validateSession = true) {
    const data = await this._request("getSchoolyears", {}, validateSession);
    data.sort((a, b) => {
      const na = parse(a.startDate, "yyyyMMdd", /* @__PURE__ */ new Date());
      const nb = parse(b.startDate, "yyyyMMdd", /* @__PURE__ */ new Date());
      return nb.getTime() - na.getTime();
    });
    if (!data[0]) throw new Error("Failed to receive school year");
    return {
      name: data[0].name,
      id: data[0].id,
      startDate: parse(data[0].startDate, "yyyyMMdd", /* @__PURE__ */ new Date()),
      endDate: parse(data[0].endDate, "yyyyMMdd", /* @__PURE__ */ new Date())
    };
  }
  /**
   * Get all WebUntis Schoolyears
   * @param {Boolean} [validateSession=true]
   */
  async getSchoolyears(validateSession = true) {
    const data = await this._request("getSchoolyears", {}, validateSession);
    data.sort((a, b) => {
      const na = parse(a.startDate, "yyyyMMdd", /* @__PURE__ */ new Date());
      const nb = parse(b.startDate, "yyyyMMdd", /* @__PURE__ */ new Date());
      return nb.getTime() - na.getTime();
    });
    if (!data[0]) throw new Error("Failed to receive school year");
    return data.map((year) => {
      return {
        name: year.name,
        id: year.id,
        startDate: parse(year.startDate, "yyyyMMdd", /* @__PURE__ */ new Date()),
        endDate: parse(year.endDate, "yyyyMMdd", /* @__PURE__ */ new Date())
      };
    });
  }
  /**
   * Get News Widget
   * @param {Date} date
   * @param {boolean} [validateSession=true]
   * @returns {Promise<Object>} see index.d.ts NewsWidget
   */
  async getNewsWidget(date, validateSession = true) {
    if (validateSession && !await this.validateSession()) throw new Error("Current Session is not valid");
    const response = await this._fetch("/WebUntis/api/public/news/newsWidgetData", {
      method: "GET",
      searchParams: {
        date: _Base.convertDateToUntis(date)
      },
      headers: {
        Cookie: this._buildCookies()
      }
    });
    if (typeof response.data !== "object")
      throw new Error(`Server returned invalid data: expected data object, got ${typeof response.data}`);
    return response.data;
  }
  /**
   * Get Inbox
   */
  async getInbox(validateSession = true) {
    this._checkAnonymous();
    if (validateSession && !await this.validateSession()) throw new Error("Current Session is not valid");
    const s = this.getSessionInfo();
    if (typeof s.jwt_token != "string") await this._getJWT();
    const response = await this._fetch("/WebUntis/api/rest/view/v1/messages", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${s.jwt_token}`,
        Cookie: this._buildCookies()
      }
    });
    if (typeof response !== "object")
      throw new Error(`Server returned invalid data: expected object, got ${typeof response}`);
    return response;
  }
  _checkAnonymous() {
    if (this.anonymous) {
      throw new Error("This method is not supported with anonymous login");
    }
  }
  /**
   * Return the current session information or throw if not present
   * @private
   */
  getSessionInfo() {
    if (!this.sessionInformation) throw new Error("Session not initialized");
    return this.sessionInformation;
  }
  /**
   * Return current person identifiers required for timetable/requests
   * @private
   */
  getCurrentPerson() {
    const s = this.getSessionInfo();
    if (!Number.isInteger(s.personId) || !Number.isInteger(s.personType)) {
      throw new Error("Session does not contain person identifiers");
    }
    return { personId: s.personId, personType: s.personType, klasseId: s.klasseId };
  }
  /**
   *
   * @returns {string}
   * @private
   */
  _buildCookies() {
    let cookies = [];
    const s = this.getSessionInfo();
    cookies.push(serialize("JSESSIONID", s.sessionId));
    cookies.push(serialize("schoolname", this.schoolbase64));
    return cookies.join("; ");
  }
  /**
   * Get JWT Token
   * @private
   */
  async _getJWT(validateSession = true) {
    if (validateSession && !await this.validateSession()) throw new Error("Current Session is not valid");
    const response = await this._fetch("/WebUntis/api/token/new", {
      method: "GET",
      headers: {
        //Authorization: `Bearer ${this._getToken()}`,
        Cookie: this._buildCookies()
      },
      expectText: true
    });
    if (typeof response !== "string")
      throw new Error(`Server returned invalid data: expected string token, got ${typeof response}`);
    this.getSessionInfo().jwt_token = response;
    return response;
  }
  /**
   * Checks if your current WebUntis Session is valid
   */
  async validateSession() {
    if (!this.sessionInformation) return false;
    const response = await this._fetch("/WebUntis/jsonrpc.do", {
      method: "POST",
      searchParams: {
        school: this.school
      },
      headers: {
        Cookie: this._buildCookies()
      },
      body: {
        id: this.id,
        method: "getLatestImportTime",
        params: {},
        jsonrpc: "2.0"
      }
    });
    return typeof response.result === "number";
  }
  /**
   * Get the time when WebUntis last changed its data
   * @param {Boolean} [validateSession=true]
   */
  async getLatestImportTime(validateSession = true) {
    return this._request("getLatestImportTime", {}, validateSession);
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
  async _timetableRequest(id, type, startDate, endDate, validateSession = true) {
    const additionalOptions = {};
    if (startDate) {
      additionalOptions.startDate = _Base.convertDateToUntis(startDate);
    }
    if (endDate) {
      additionalOptions.endDate = _Base.convertDateToUntis(endDate);
    }
    return this._request(
      "getTimetable",
      {
        options: {
          id: (/* @__PURE__ */ new Date()).getTime(),
          element: {
            id,
            type
          },
          ...additionalOptions,
          showLsText: true,
          showStudentgroup: true,
          showLsNumber: true,
          showSubstText: true,
          showInfo: true,
          showBooking: true,
          klasseFields: ["id", "name", "longname", "externalkey"],
          roomFields: ["id", "name", "longname", "externalkey"],
          subjectFields: ["id", "name", "longname", "externalkey"],
          teacherFields: ["id", "name", "longname", "externalkey"]
        }
      },
      validateSession
    );
  }
  /**
   * Get your own Timetable for the current day
   * Note: You can't use this with anonymous login
   * @param {Boolean} [validateSession=true]
   * @returns {Promise<Array>}
   */
  async getOwnTimetableForToday(validateSession = true) {
    this._checkAnonymous();
    const s = this.getSessionInfo();
    return await this._timetableRequest(s.personId, s.personType, null, null, validateSession);
  }
  /**
   * Get the timetable of today for a specific element.
   * @param {number} id
   * @param {WebUntisElementType} type
   * @param {Boolean} [validateSession=true]
   * @returns {Promise<Array>}
   */
  async getTimetableForToday(id, type, validateSession = true) {
    return await this._timetableRequest(id, type, null, null, validateSession);
  }
  /**
   * Get your own Timetable for the given day
   * Note: You can't use this with anonymous login
   * @param {Date} date
   * @param {Boolean} [validateSession=true]
   */
  async getOwnTimetableFor(date, validateSession = true) {
    this._checkAnonymous();
    const s = this.getSessionInfo();
    return await this._timetableRequest(s.personId, s.personType, date, date, validateSession);
  }
  /**
   * Get the timetable for a specific day for a specific element.
   * @param {Date} date
   * @param {number} id
   * @param {WebUntisElementType} type
   * @param {Boolean} [validateSession=true]
   */
  async getTimetableFor(date, id, type, validateSession = true) {
    return await this._timetableRequest(id, type, date, date, validateSession);
  }
  /**
   * Get your own timetable for a given Date range
   * Note: You can't use this with anonymous login
   * @param {Date} rangeStart
   * @param {Date} rangeEnd
   * @param {Boolean} [validateSession=true]
   * @returns {Promise.<Array>}
   */
  async getOwnTimetableForRange(rangeStart, rangeEnd, validateSession = true) {
    this._checkAnonymous();
    _Base.validateDateRange(rangeStart, rangeEnd, "getOwnTimetableForRange");
    const s = this.getSessionInfo();
    return await this._timetableRequest(s.personId, s.personType, rangeStart, rangeEnd, validateSession);
  }
  /**
   * Get the timetable for a given Date range for specific element
   * @param {Date} rangeStart
   * @param {Date} rangeEnd
   * @param {number} id
   * @param {WebUntisElementType} type
   * @param {Boolean} [validateSession=true]
   */
  async getTimetableForRange(rangeStart, rangeEnd, id, type, validateSession = true) {
    _Base.validateDateRange(rangeStart, rangeEnd, "getTimetableForRange");
    return await this._timetableRequest(id, type, rangeStart, rangeEnd, validateSession);
  }
  /**
   * Get the Timetable of your class for today
   * Note: You can't use this with anonymous login
   * @param {Boolean} [validateSession=true]
   * @returns {Promise<Array>}
   */
  async getOwnClassTimetableForToday(validateSession = true) {
    this._checkAnonymous();
    const s = this.getSessionInfo();
    return await this._timetableRequest(s.klasseId, 1, null, null, validateSession);
  }
  /**
   * Get the Timetable of your class for the given day
   * Note: You can't use this with anonymous login
   * @param {Date} date
   * @param {Boolean} [validateSession=true]
   * @returns {Promise.<Array>}
   */
  async getOwnClassTimetableFor(date, validateSession = true) {
    this._checkAnonymous();
    const s = this.getSessionInfo();
    return await this._timetableRequest(s.klasseId, 1, date, date, validateSession);
  }
  /**
   * Get the Timetable of your class for a given Date range
   * Note: You can't use this with anonymous login
   * @param {Date} rangeStart
   * @param {Date} rangeEnd
   * @param {boolean} [validateSession=true]
   */
  async getOwnClassTimetableForRange(rangeStart, rangeEnd, validateSession = true) {
    this._checkAnonymous();
    _Base.validateDateRange(rangeStart, rangeEnd, "getOwnClassTimetableForRange");
    const s = this.getSessionInfo();
    return await this._timetableRequest(s.klasseId, 1, rangeStart, rangeEnd, validateSession);
  }
  /**
   *
   * @param {Date} rangeStart
   * @param {Date} rangeEnd
   * @param {boolean} [validateSession=true]
   * @returns {Promise.<Array>}
   */
  async getHomeWorksFor(rangeStart, rangeEnd, validateSession = true) {
    _Base.validateDateRange(rangeStart, rangeEnd, "getHomeWorksFor");
    if (validateSession && !await this.validateSession()) throw new Error("Current Session is not valid");
    const response = await this._fetch("/WebUntis/api/homeworks/lessons", {
      method: "GET",
      searchParams: {
        startDate: _Base.convertDateToUntis(rangeStart),
        endDate: _Base.convertDateToUntis(rangeEnd)
      },
      headers: {
        Cookie: this._buildCookies()
      }
    });
    if (typeof response.data !== "object")
      throw new Error(`Server returned invalid data: expected data object, got ${typeof response.data}`);
    if (!response.data["homeworks"]) throw new Error(`Data object doesn't contain 'homeworks' field`);
    return response.data;
  }
  /**
   * Converts the untis date string format to a normal JS Date object
   * @param {string} date Untis date string
   * @param {Date} [baseDate=new Date()] Base date. Default beginning of current day
   */
  static convertUntisDate(date, baseDate = startOfDay(/* @__PURE__ */ new Date())) {
    if (typeof date !== "string") date = `${date}`;
    return parse(date, "yyyyMMdd", baseDate);
  }
  /**
   * Convert a untis time string to a JS Date object
   * @param {string|number} time Untis time string
   * @param {Date} [baseDate=new Date()] Day used as base for the time. Default: Current date
   */
  static convertUntisTime(time, baseDate = /* @__PURE__ */ new Date()) {
    if (typeof time !== "string") time = `${time}`;
    return parse(time.padStart(4, "0"), "Hmm", baseDate);
  }
  /**
   * Validate that a date range is valid (both Dates and start <= end)
   * @private
   */
  static validateDateRange(rangeStart, rangeEnd, name = "date range") {
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
  async getSubjects(validateSession = true) {
    return await this._request("getSubjects", {}, validateSession);
  }
  /**
   * Get the timegrid of current school
   * @param {boolean} [validateSession=true]
   * @returns {Promise.<Array>}
   */
  async getTimegrid(validateSession = true) {
    return await this._request("getTimegridUnits", {}, validateSession);
  }
  /**
   *
   * TODO: Find out what type this function returns
   * @param {Date} rangeStart
   * @param {Date} rangeEnd
   * @param {boolean} [validateSession=true]
   * @returns {Promise.<void>}
   */
  async getHomeWorkAndLessons(rangeStart, rangeEnd, validateSession = true) {
    _Base.validateDateRange(rangeStart, rangeEnd, "getHomeWorkAndLessons");
    if (validateSession && !await this.validateSession()) throw new Error("Current Session is not valid");
    const response = await this._fetch("/WebUntis/api/homeworks/lessons", {
      method: "GET",
      searchParams: {
        startDate: _Base.convertDateToUntis(rangeStart),
        endDate: _Base.convertDateToUntis(rangeEnd)
      },
      headers: {
        Cookie: this._buildCookies()
      }
    });
    if (typeof response.data !== "object")
      throw new Error(`Server returned invalid data: expected data object, got ${typeof response.data}`);
    if (!response.data["homeworks"]) throw new Error("Data object doesn't contains homeworks object.");
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
  async getExamsForRange(rangeStart, rangeEnd, klasseId = -1, withGrades = false, validateSession = true) {
    _Base.validateDateRange(rangeStart, rangeEnd, "getExamsForRange");
    if (validateSession && !await this.validateSession()) throw new Error("Current Session is not valid");
    const response = await this._fetch("/WebUntis/api/exams", {
      method: "GET",
      searchParams: {
        startDate: _Base.convertDateToUntis(rangeStart),
        endDate: _Base.convertDateToUntis(rangeEnd),
        klasseId,
        withGrades
      },
      headers: {
        Cookie: this._buildCookies()
      }
    });
    if (typeof response.data !== "object")
      throw new Error(`Server returned invalid data: expected data object, got ${typeof response.data}`);
    if (!response.data["exams"]) throw new Error(`Data object doesn't contain 'exams' field`);
    return response.data["exams"];
  }
  /**
   * Get the timetable for the current week for a specific element from the web client API.
   * @param {Date} date one date in the week to query
   * @param {number} id element id
   * @param {WebUntisElementType} type element type
   * @param {Number} [formatId=1] set to 1 to include teachers, 2 omits the teachers in elements response
   * @param {Boolean} [validateSession=true]
   */
  async getTimetableForWeek(date, id, type, formatId = 1, validateSession = true) {
    if (validateSession && !await this.validateSession()) throw new Error("Current Session is not valid");
    const response = await this._fetch("/WebUntis/api/public/timetable/weekly/data", {
      method: "GET",
      searchParams: {
        elementType: type,
        elementId: id,
        date: format(date, "yyyy-MM-dd"),
        formatId
      },
      headers: {
        Cookie: this._buildCookies()
      }
    });
    if (typeof response.data !== "object") throw new Error("Server returned invalid data.");
    if (response.data.error) {
      const err = new Error("Server responded with error");
      err.code = response.data.error?.data?.messageKey;
      throw err;
    }
    if (!response.data.result?.data?.elementPeriods?.[id]) throw new Error("Invalid response");
    const data = response.data.result.data;
    const formatElements = (elements, { byType }) => {
      const filteredElements = elements.filter((element) => element.type === byType);
      return filteredElements.map((element) => ({
        ...element,
        element: data.elements.find(
          (dataElement) => dataElement.type === byType && dataElement.id === element.id
        )
      }));
    };
    const timetable = data.elementPeriods[id].map((lesson) => ({
      ...lesson,
      classes: formatElements(lesson.elements, { byType: _Base.TYPES.CLASS }),
      teachers: formatElements(lesson.elements, { byType: _Base.TYPES.TEACHER }),
      subjects: formatElements(lesson.elements, { byType: _Base.TYPES.SUBJECT }),
      rooms: formatElements(lesson.elements, { byType: _Base.TYPES.ROOM }),
      students: formatElements(lesson.elements, { byType: _Base.TYPES.STUDENT })
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
  async getOwnTimetableForWeek(date, formatId = 1, validateSession = true) {
    this._checkAnonymous();
    const s = this.getSessionInfo();
    return await this.getTimetableForWeek(date, s.personId, s.personType, formatId, validateSession);
  }
  /**
   * Get all known teachers by WebUntis
   * @param {boolean} [validateSession=true]
   * @returns {Promise.<Array>}
   */
  async getTeachers(validateSession = true) {
    return await this._request("getTeachers", {}, validateSession);
  }
  /**
   * Get all known students by WebUntis
   * @param {boolean} [validateSession=true]
   * @returns {Promise.<Array>}
   */
  async getStudents(validateSession = true) {
    return await this._request("getStudents", {}, validateSession);
  }
  /**
   * Get all known rooms by WebUntis
   * @param {boolean} [validateSession=true]
   * @returns {Promise.<Array>}
   */
  async getRooms(validateSession = true) {
    return await this._request("getRooms", {}, validateSession);
  }
  /**
   * Get all classes known by WebUntis
   * @param {boolean} [validateSession=true]
   * @param {number} schoolyearId
   * @returns {Promise.<Array>}
   */
  async getClasses(validateSession = true, schoolyearId) {
    const data = typeof schoolyearId !== "number" ? {} : { schoolyearId };
    return await this._request("getKlassen", data, validateSession);
  }
  /**
   * Get all departments known by WebUntis
   * @param {boolean} [validateSession=true]
   * @returns {Promise.<Array>}
   */
  async getDepartments(validateSession = true) {
    return await this._request("getDepartments", {}, validateSession);
  }
  /**
   * Get all holidays known by WebUntis
   * @param {boolean} [validateSession=true]
   * @returns {Promise.<Array>}
   */
  async getHolidays(validateSession = true) {
    return await this._request("getHolidays", {}, validateSession);
  }
  /**
   * Get all status data known by WebUntis
   * @param {boolean} [validateSession=true]
   * @returns {Promise.<Array>}
   */
  async getStatusData(validateSession = true) {
    return await this._request("getStatusData", {}, validateSession);
  }
  /**
   * Get the current school year
   * @param [validateSession=true]
   * @returns {Promise.<SchoolYear>}
   */
  async getCurrentSchoolyear(validateSession = true) {
    const data = await this._request("getCurrentSchoolyear", {}, validateSession);
    if (!data) throw new Error("Failed to retrieve current school year");
    return {
      name: data.name,
      id: data.id,
      startDate: _Base.convertUntisDate(data.startDate),
      endDate: _Base.convertUntisDate(data.endDate)
    };
  }
  /**
   * Convert a JS Date Object to a WebUntis date string
   * @param {Date} date
   * @returns {String}
   */
  static convertDateToUntis(date) {
    return date.getFullYear().toString() + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1).toString() + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()).toString();
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
  async _request(method, parameter = {}, validateSession = true, url = `/WebUntis/jsonrpc.do`) {
    if (validateSession && !await this.validateSession()) throw new Error("Current Session is not valid");
    const response = await this._fetch(url, {
      method: "POST",
      searchParams: {
        school: this.school
      },
      headers: {
        Cookie: this._buildCookies()
      },
      body: {
        id: this.id,
        method,
        params: parameter,
        jsonrpc: "2.0"
      }
    });
    if (!response.result) throw new Error("Server didn't return any result.");
    if (response.result.code) throw new Error("Server returned error code: " + response.result.code);
    return response.result;
  }
  /**
   * Returns all the Lessons where you were absent including the excused one!
   * @param {Date} rangeStart
   * @param {Date} rangeEnd
   * @param {Integer} [excuseStatusId=-1]
   * @param {boolean} [validateSession=true]
   * @returns {Promise<Absences>}
   */
  async getAbsentLesson(rangeStart, rangeEnd, excuseStatusId = -1, validateSession = true) {
    _Base.validateDateRange(rangeStart, rangeEnd, "getAbsentLesson");
    if (validateSession && !await this.validateSession()) throw new Error("Current Session is not valid");
    this._checkAnonymous();
    const response = await this._fetch("/WebUntis/api/classreg/absences/students", {
      method: "GET",
      searchParams: {
        startDate: _Base.convertDateToUntis(rangeStart),
        endDate: _Base.convertDateToUntis(rangeEnd),
        studentId: this.getCurrentPerson().personId,
        excuseStatusId
      },
      headers: {
        Cookie: this._buildCookies()
      }
    });
    if (response.data == null) throw new Error("Server returned no data!");
    return response.data;
  }
  /**
   * Returns a URL to a unique PDF of all the lessons you were absent
   * @param {Date} rangeStart
   * @param {Date} rangeEnd
   * @param {boolean} [validateSession=true]
   * @param {Integer} [excuseStatusId=-1]
   * @param {boolean} [lateness=true]
   * @param {boolean} [absences=true]
   * @param {boolean} [excuseGroup=2]
   */
  async getPdfOfAbsentLesson(rangeStart, rangeEnd, validateSession = true, excuseStatusId = -1, lateness = true, absences = true, excuseGroup = 2) {
    _Base.validateDateRange(rangeStart, rangeEnd, "getPdfOfAbsentLesson");
    if (validateSession && !await this.validateSession()) throw new Error("Current Session is not valid");
    this._checkAnonymous();
    const response = await this._fetch("/WebUntis/reports.do", {
      method: "GET",
      searchParams: {
        name: "Excuse",
        format: "pdf",
        rpt_sd: _Base.convertDateToUntis(rangeStart),
        rpt_ed: _Base.convertDateToUntis(rangeEnd),
        excuseStatusId,
        studentId: this.getCurrentPerson().personId,
        withLateness: lateness,
        withAbsences: absences,
        execuseGroup: excuseGroup
      },
      headers: {
        Cookie: this._buildCookies()
      }
    });
    const res = response.data;
    if (res.error) throw new Error("Server returned no data!");
    const pdfDownloadURL = this.baseurl + "WebUntis/reports.do?msgId=" + res.messageId + "&" + res.reportParams;
    return pdfDownloadURL;
  }
};
__publicField$2(_Base, "TYPES", WebUntisElementType);
let Base = _Base;
class InternalWebuntisSecretLogin extends Base {
  constructor(school, username, password, baseurl, identity = "Awesome", disableUserAgent = false) {
    super(school, username, password, baseurl, identity, disableUserAgent);
  }
  async _otpLogin(token, username, time, skipSessionInfo = false) {
    const response = await this._fetchRaw("/WebUntis/jsonrpc_intern.do", {
      method: "POST",
      searchParams: {
        m: "getUserData2017",
        school: this.school,
        v: "i2.2"
      },
      body: {
        id: this.id,
        method: "getUserData2017",
        params: [
          {
            auth: {
              clientTime: time,
              user: username,
              otp: token
            }
          }
        ],
        jsonrpc: "2.0"
      }
    });
    const responseData = await response.json();
    if (responseData && responseData.error)
      throw new Error("Failed to login. " + (responseData.error.message || ""));
    const setCookieHeader = response.headers.get("set-cookie");
    if (!setCookieHeader) throw new Error(`Failed to login. Server didn't return a set-cookie`);
    const sessionId = this._getCookieFromSetCookie([setCookieHeader]);
    if (!sessionId) throw new Error("Failed to login. Server didn't return a session id.");
    this.sessionInformation = {
      sessionId
    };
    if (skipSessionInfo) return this.sessionInformation;
    const appConfigUrl = `/WebUntis/api/app/config`;
    const configResponse = await this._fetch(appConfigUrl, {
      method: "GET",
      headers: {
        Cookie: this._buildCookies()
      }
    });
    if (typeof configResponse !== "object" || typeof configResponse.data !== "object")
      throw new Error("Failed to fetch app config while login. data (type): " + typeof configResponse);
    if (configResponse.data && configResponse.data.loginServiceConfig && configResponse.data.loginServiceConfig.user && !Number.isInteger(configResponse.data.loginServiceConfig.user.personId))
      throw new Error("Invalid personId. personId: " + configResponse.data.loginServiceConfig.user.personId);
    const webUntisLoginServiceUser = configResponse.data.loginServiceConfig.user;
    if (!Array.isArray(webUntisLoginServiceUser.persons))
      throw new Error("Invalid person array. persons (type): " + typeof webUntisLoginServiceUser.persons);
    const person = webUntisLoginServiceUser.persons.find(
      (value) => value.id === configResponse.data.loginServiceConfig.user.personId
    );
    if (!person) throw new Error("Can not find person in person array.");
    if (!Number.isInteger(person.type)) throw new Error("Invalid person type. type (type): " + person.type);
    this.sessionInformation = {
      sessionId,
      personType: person.type,
      personId: configResponse.data.loginServiceConfig.user.personId
    };
    try {
      const dayConfigUrl = `/WebUntis/api/daytimetable/config`;
      const dayConfigResponse = await this._fetch(dayConfigUrl, {
        method: "GET",
        headers: {
          Cookie: this._buildCookies()
        }
      });
      if (typeof dayConfigResponse !== "object" || typeof dayConfigResponse.data !== "object") throw new Error();
      if (!Number.isInteger(dayConfigResponse.data.klasseId)) throw new Error();
      this.sessionInformation = {
        sessionId,
        personType: person.type,
        personId: configResponse.data.loginServiceConfig.user.personId,
        klasseId: dayConfigResponse.data.klasseId
      };
    } catch (e) {
      console.warn("Failed to fetch klasseId during login (non-fatal):", e);
    }
    return this.sessionInformation;
  }
  /**
   *
   * @param {Array} setCookieArray
   * @param {string} [cookieName="JSESSIONID"]
   * @return {string|boolean}
   * @private
   */
  _getCookieFromSetCookie(setCookieArray, cookieName = "JSESSIONID") {
    if (!setCookieArray) return;
    for (let i = 0; i < setCookieArray.length; i++) {
      const setCookie = setCookieArray[i];
      if (!setCookie) continue;
      let cookieParts = setCookie.split(";");
      if (!cookieParts || !Array.isArray(cookieParts)) continue;
      for (let cookie of cookieParts) {
        cookie = cookie.trim();
        cookie = cookie.replace(/;/gm, "");
        const [Key, Value] = cookie.split("=");
        if (!Key || !Value) continue;
        if (Key === cookieName) return Value;
      }
    }
  }
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
class WebUntisSecretAuth extends InternalWebuntisSecretLogin {
  /**
   * @augments WebUntis
   * @param {string} school The school identifier
   * @param {string} user
   * @param {string} secret
   * @param {string} baseurl Just the host name of your WebUntis (Example: [school].webuntis.com)
   * @param {string} [identity="Awesome"] A identity like: MyAwesomeApp
   * @param {Object} authenticator Custom otplib v12 instance. Default will use the default otplib configuration.
   * @param {boolean} [disableUserAgent=false] If this is true, axios will not send a custom User-Agent
   */
  constructor(school, user, secret, baseurl, identity = "Awesome", authenticator, disableUserAgent = false) {
    super(school, user, null, baseurl, identity, disableUserAgent);
    __publicField$1(this, "secret");
    __publicField$1(this, "authenticator");
    this.secret = secret;
    this.authenticator = authenticator;
    if (!authenticator) {
      try {
        if (typeof globalThis.require === "function") {
          const otplib = globalThis.require("otplib");
          this.authenticator = otplib.authenticator;
        }
      } catch (error) {
        console.warn("Could not require otplib synchronously; will try dynamic import at login:", error);
      }
    }
  }
  // @ts-ignore
  async login() {
    if (!this.authenticator) {
      try {
        const mod = await import('otplib');
        this.authenticator = mod.authenticator;
      } catch (e) {
        throw new Error("otplib is required for secret auth but could not be loaded.");
      }
    }
    const token = this.authenticator.generate(this.secret);
    const time = (/* @__PURE__ */ new Date()).getTime();
    if (this.username == null) throw new Error("No username provided for login.");
    return await this._otpLogin(token, this.username, time);
  }
}

class WebUntisQR extends WebUntisSecretAuth {
  /**
   * Use the data you get from a WebUntis QR code
   * @param {string} QRCodeURI A WebUntis uri. This is the data you get from the QR Code from the webuntis webapp under profile->Data access->Display
   * @param {string} [identity="Awesome"]  A identity like: MyAwesomeApp
   * @param {Object} authenticator Custom otplib v12 instance. Default will use the default otplib configuration.
   * @param {Object} URL Custom whatwg url implementation. Default will use the nodejs implementation.
   * @param {boolean} [disableUserAgent=false] If this is true, axios will not send a custom User-Agent
   */
  constructor(QRCodeURI, identity, authenticator, URL, disableUserAgent = false) {
    let URLImplementation = URL;
    if (!URL) {
      if (typeof globalThis.URL === "function") {
        URLImplementation = globalThis.URL;
      } else if (typeof globalThis.require === "function") {
        try {
          const urlModule = globalThis.require("url");
          URLImplementation = urlModule.URL;
        } catch (error) {
          throw new Error("Failed to load url module: " + error.message);
        }
      } else {
        throw new Error("You need to provide the URL object by yourself. Could not obtain URL implementation.");
      }
    }
    if (!URLImplementation) {
      throw new Error("URL implementation is not available.");
    }
    const URLImpl = URLImplementation;
    const uri = new URLImpl(QRCodeURI);
    super(
      uri.searchParams.get("school"),
      uri.searchParams.get("user"),
      uri.searchParams.get("key"),
      uri.searchParams.get("url"),
      identity,
      authenticator,
      disableUserAgent
    );
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const _WebUntisAnonymousAuth = class _WebUntisAnonymousAuth extends InternalWebuntisSecretLogin {
  /**
   *
   * @param {string} school
   * @param {string} baseurl
   * @param {string} [identity='Awesome']
   * @param {boolean} [disableUserAgent=false] If this is true, axios will not send a custom User-Agent
   * @param {number} [otp] Optional OTP to use for anonymous login. If omitted, `DEFAULT_OTP` is used.
   */
  constructor(school, baseurl, identity = "Awesome", disableUserAgent = false, otp) {
    super(school, "", "", baseurl, identity, disableUserAgent);
    __publicField(this, "anonymousOtp");
    this.username = "#anonymous#";
    this.anonymous = true;
    this.anonymousOtp = typeof otp === "number" ? otp : _WebUntisAnonymousAuth.DEFAULT_OTP;
  }
  async login() {
    const url = `/WebUntis/jsonrpc_intern.do`;
    const requestUrl = `${this.baseurl}${url}?m=getAppSharedSecret&school=${encodeURIComponent(this.school)}&v=i3.5`;
    const requestBody = {
      id: this.id,
      method: "getAppSharedSecret",
      params: [
        {
          userName: "#anonymous#",
          password: ""
        }
      ],
      jsonrpc: "2.0"
    };
    const response = await this._fetch(requestUrl, {
      method: "POST",
      body: requestBody
    });
    if (response.error) throw new Error("Failed to login. " + (response.error.message || ""));
    const otp = this.anonymousOtp;
    const time = (/* @__PURE__ */ new Date()).getTime();
    return await this._otpLogin(otp, this.username, time, true);
  }
};
/**
 * Default OTP used by some WebUntis servers for anonymous access.
 * Kept as a constant for backward compatibility but can be overridden
 * via the constructor `otp` parameter if a different value is required.
 */
__publicField(_WebUntisAnonymousAuth, "DEFAULT_OTP", 100170);
let WebUntisAnonymousAuth = _WebUntisAnonymousAuth;

export { Base, InternalWebuntisSecretLogin, Base as WebUntis, WebUntisAnonymousAuth, WebUntisDay, WebUntisElementType, WebUntisQR, WebUntisSecretAuth };
//# sourceMappingURL=webuntis.mjs.map
