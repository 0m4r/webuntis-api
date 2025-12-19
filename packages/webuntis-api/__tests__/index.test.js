const cases = require("jest-in-case");
const { enableFetchMocks } = require("jest-fetch-mock");
const { WebUntis } = require("../dist/webuntis-api.js");

enableFetchMocks();
const fetchMock = global.fetch;

const mockSessionInformation = {
  result: {
    sessionId: "123",
    personId: 1,
    personType: 5,
    klasseId: 99,
    persons: [
      {
        id: 1,
        type: 5,
        displayName: "Testing Person",
        longName: "Testing Person",
        foreName: "Testing",
      },
    ],
  },
};
const school = "school";
const baseURL = `https://${school}.webuntis.com/WebUntis/jsonrpc.do`;
const jsonHeaders = { "Content-Type": "application/json" };
const matchesBaseUrl = (url) => {
  const target = typeof url === "string" ? url : url && url.url ? url.url : `${url}`;
  return target.startsWith(baseURL);
};

const mockUserConfig = {
  name: "Testing Person",
  id: 1,
  personId: mockSessionInformation.result.persons[0].id,
  personType: mockSessionInformation.result.persons[0].type,
  persons: mockSessionInformation.result.persons,
  klasseId: mockSessionInformation.result.klasseId,
};

const mockResponse = mockSessionInformation;

const routes = [];

const toResponse = (data) => {
  if (data instanceof Response) return data;
  const status = data && typeof data.status === "number" ? data.status : 200;
  const bodyContent = data && data.body !== undefined ? data.body : data;
  const headers =
    data && data.headers
      ? new Headers(data.headers)
      : new Headers({
          "Content-Type": typeof bodyContent === "string" ? "text/plain" : "application/json",
        });
  const isJson = headers.get("content-type") && headers.get("content-type").includes("json");
  const payload =
    bodyContent === undefined
      ? null
      : isJson && typeof bodyContent !== "string"
        ? JSON.stringify(bodyContent)
        : typeof bodyContent === "string"
          ? bodyContent
          : JSON.stringify(bodyContent);
  return new Response(payload, { status, headers });
};

const matchRoute = (matcher, url, opts) => {
  const target = typeof url === "string" ? url : url && url.url ? url.url : `${url}`;
  if (typeof matcher === "function") return matcher(target, opts);
  if (matcher instanceof RegExp) return matcher.test(target);
  return target === matcher;
};

const registerRoute = (method, matcher, responder, options = {}) => {
  if (options.overwriteRoutes) {
    for (let i = routes.length - 1; i >= 0; i--) {
      if (routes[i].method === method && routes[i].matcher === matcher) routes.splice(i, 1);
    }
  }
  routes.push({ method, matcher, responder });
};

const findRoute = (method, url, opts) => {
  for (let i = routes.length - 1; i >= 0; i--) {
    const route = routes[i];
    if ((route.method === method || route.method === "ANY") && matchRoute(route.matcher, url, opts)) return route;
  }
  return null;
};

fetchMock.mockImplementation((url, opts = {}) => {
  const normalizedOpts = {
    ...opts,
    method: opts.method || (url && url.method) || "GET",
    body: opts.body || (url && url.body),
  };
  const method = (normalizedOpts.method || "GET").toUpperCase();
  const targetUrl = typeof url === "string" ? url : url && url.url ? url.url : `${url}`;
  const route = findRoute(method, targetUrl, normalizedOpts);
  const responseData = route
    ? route.responder(targetUrl, normalizedOpts)
    : { status: 500, body: { error: "Unmocked request" }, headers: jsonHeaders };
  return Promise.resolve(toResponse(responseData));
});

fetchMock.post = (matcher, response, options = {}) => {
  registerRoute(
    "POST",
    matcher,
    (url, opts) => {
      const body = opts && opts.body ? JSON.parse(opts.body) : {};
      if (matcher === matchesBaseUrl && body.method === "getLatestImportTime") {
        return { status: 200, body: { result: 123 }, headers: jsonHeaders };
      }
      return response;
    },
    options,
  );
  return fetchMock;
};

fetchMock.get = (matcher, response, options = {}) => {
  registerRoute("GET", matcher, () => response, options);
  return fetchMock;
};

fetchMock.catch = (response) => {
  registerRoute(
    "ANY",
    () => true,
    () => response,
    { overwriteRoutes: false },
  );
  return fetchMock;
};

fetchMock.calls = () => fetchMock.mock.calls.map(([url, opts]) => [url, opts || {}]);

const resetFetchMock = () => {
  routes.length = 0;
  fetchMock.mockReset();
  fetchMock.mockImplementation((url, opts = {}) => {
    const normalizedOpts = {
      ...opts,
      method: opts.method || (url && url.method) || "GET",
      body: opts.body || (url && url.body),
    };
    const method = (normalizedOpts.method || "GET").toUpperCase();
    const targetUrl = typeof url === "string" ? url : url && url.url ? url.url : `${url}`;
    const route = findRoute(method, targetUrl, normalizedOpts);
    const responseData = route
      ? route.responder(targetUrl, normalizedOpts)
      : { status: 500, body: { error: "Unmocked request" }, headers: jsonHeaders };
    return Promise.resolve(toResponse(responseData));
  });
  registerRoute(
    "POST",
    matchesBaseUrl,
    (url, opts) => {
      const body = opts && opts.body ? JSON.parse(opts.body) : {};
      if (body.method === "authenticate") {
        return { status: 200, body: mockSessionInformation, headers: jsonHeaders };
      }
      if (body.method === "logout") {
        return { status: 200, body: { result: {} }, headers: jsonHeaders };
      }
      if (body.method === "getLatestImportTime") {
        return { status: 200, body: { result: 123 }, headers: jsonHeaders };
      }
      return { status: 200, body: mockResponse, headers: jsonHeaders };
    },
    { overwriteRoutes: true },
  );
  registerRoute("GET", /daytimetable\/config/, () => ({ data: { klasseId: mockSessionInformation.result.klasseId } }), {
    overwriteRoutes: true,
  });
  registerRoute("GET", /app\/config/, () => ({ data: { loginServiceConfig: { user: mockUserConfig } } }), {
    overwriteRoutes: true,
  });
};

// Polyfill helpers to mimic the old axios-mock style API used in tests
const mapCalls = () => fetchMock.calls();

const getElementObject = (id = mockResponse.result.personId, type = mockResponse.result.personType) => ({
  params: {
    options: {
      element: { id, type },
    },
  },
});

const initMocks = () => {
  resetFetchMock();
};

const applySession = (instance, overrides = {}) => {
  instance.sessionInformation = { ...mockSessionInformation.result, ...overrides };
};

const findRpcCall = (calls, method) =>
  calls.find(([, opts]) => {
    if (!opts || !opts.body) return false;
    try {
      const body = JSON.parse(opts.body);
      return body.method === method;
    } catch {
      return false;
    }
  });

const createInstance = () => {
  const instance = new WebUntis(school, "username", "password", school + ".webuntis.com");

  return instance;
};

beforeEach(() => {
  jest.clearAllMocks();
  initMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
  fetchMock.mockReset();
});

test("should method login return mock result", async () => {
  const untis = createInstance();

  expect(await untis.login()).toEqual(mockResponse.result);
});

cases(
  "should method login catch error",
  async ({ response }) => {
    const untis = createInstance();

    fetchMock.post(matchesBaseUrl, response, { overwriteRoutes: true });

    await expect(() => untis.login()).rejects.toThrowErrorMatchingSnapshot();
  },
  [
    { name: "response not object", response: "" },
    { name: "with result null", response: { result: null } },
    { name: "with result has code", response: { result: { code: 500 } } },
    { name: "with empty sessionId", response: { result: {} } },
  ],
);

test("should method logout return true", async () => {
  const untis = createInstance();

  fetchMock.post(matchesBaseUrl, { result: {} }, { overwriteRoutes: true });

  expect(await untis.logout()).toBe(true);
});

test("login requests use manual redirect", async () => {
  const untis = createInstance();

  await untis.login();

  const [, opts] = fetchMock.calls()[0];
  expect(opts.redirect).toBe("manual");
});

test("fetch omits null and undefined query params", async () => {
  const untis = createInstance();
  untis.sessionInformation = { sessionId: "session-id" };

  fetchMock.get(/omit-test/, { body: "ok", headers: { "Content-Type": "text/plain" } }, { overwriteRoutes: true });

  await untis._fetch("/omit-test", {
    method: "GET",
    searchParams: { foo: undefined, bar: null, baz: "ok" },
    expectText: true,
  });

  const [url] = fetchMock.calls().pop();
  const target = typeof url === "string" ? url : url && url.url ? url.url : `${url}`;
  const parsed = new URL(target);

  expect(parsed.searchParams.get("foo")).toBeNull();
  expect(parsed.searchParams.get("bar")).toBeNull();
  expect(parsed.searchParams.get("baz")).toBe("ok");
});

test("anonymous login sends JSON content type", async () => {
  const { WebUntisAnonymousAuth } = require("../dist/webuntis-api.js");
  const untis = new WebUntisAnonymousAuth(school, "xyz.webuntis.com");
  untis._otpLogin = jest.fn().mockResolvedValue("ok");

  fetchMock.post(/jsonrpc_intern\.do/, { result: {} }, { overwriteRoutes: true });

  await untis.login();

  const [, opts] = fetchMock.calls()[0];
  const headers = opts.headers instanceof Headers ? opts.headers : new Headers(opts.headers);
  expect(headers.get("Content-Type")).toBe("application/json");
});

cases(
  "should getLatestSchoolyear return object",
  async ({ validate, dateFormat }) => {
    const name = "testName";
    const id = "testId";
    const untis = createInstance();

    fetchMock.post(
      (url, opts) => {
        if (matchesBaseUrl(url) && opts && opts.body) {
          const body = JSON.parse(opts.body);
          return body.method === "getSchoolyears";
        }
        return false;
      },
      {
        result: [
          {
            id,
            name,
            startDate: dateFormat === "string" ? "20191111" : 20191111,
            endDate: dateFormat === "string" ? "20191211" : 20191211,
          },
          {
            id,
            name,
            startDate: dateFormat === "string" ? "20191113" : 20191113,
            endDate: dateFormat === "string" ? "20191115" : 20191115,
          },
        ],
      },
      { overwriteRoutes: false },
    );

    expect(await untis.getLatestSchoolyear(validate)).toEqual({
      name,
      id,
      startDate: new Date("11/13/2019"),
      endDate: new Date("11/15/2019"),
    });
  },
  [
    { name: "with validate, string date", validate: true, dateFormat: "string" },
    { name: "with validate, numeric date", validate: true, dateFormat: "number" },
    { name: "without validate, string date", validate: false, dateFormat: "string" },
  ],
);

test("should getLatestSchoolyear throw error with empty array", async () => {
  const name = "testName";
  const id = "testId";
  const untis = createInstance();

  fetchMock.post(
    (url, opts) => {
      if (matchesBaseUrl(url) && opts && opts.body) {
        const body = JSON.parse(opts.body);
        return body.method === "getSchoolyears";
      }
      return false;
    },
    {
      result: [],
    },
    { overwriteRoutes: false },
  );

  await expect(() => untis.getLatestSchoolyear(false)).rejects.toThrowErrorMatchingSnapshot();
});

cases(
  "should getNewsWidget return data",
  async ({ validate }) => {
    const untis = createInstance();
    const response = { testing: "dataTest" };

    fetchMock.get(/newsWidgetData/, { data: response }, { overwriteRoutes: false });

    expect(await untis.getNewsWidget(new Date("11/13/2019"), validate)).toEqual(response);
  },
  [
    { name: "with validate", validate: true },
    { name: "without validate", validate: false },
  ],
);

test("should getNewsWidget catch invalid data", async () => {
  const untis = createInstance();
  const response = { testing: "dataTest" };

  resetFetchMock();
  fetchMock.post(
    (url, opts) => {
      if (matchesBaseUrl(url) && opts && opts.body) {
        const body = JSON.parse(opts.body);
        return body.method === "getLatestImportTime";
      }
      return false;
    },
    { result: "string" },
    { overwriteRoutes: false },
  );

  await expect(() => untis.getNewsWidget(new Date("11/13/2019"))).rejects.toThrowErrorMatchingSnapshot();
});

test("should getNewsWidget catch data not object", async () => {
  const untis = createInstance();
  const response = { testing: "dataTest" };

  fetchMock.get(/newsWidgetData/, { data: 123 }, { overwriteRoutes: false });

  await expect(() => untis.getNewsWidget(new Date("11/13/2019"))).rejects.toThrow(/expected data object/);
});

cases(
  "should getLatestImportTime return result",
  async ({ validate }) => {
    const untis = createInstance();

    fetchMock.post(
      (url, opts) => {
        if (matchesBaseUrl(url) && opts && opts.body) {
          const body = JSON.parse(opts.body);
          return body.method === "getLatestImportTime";
        }
        return false;
      },
      { result: 123 },
      { overwriteRoutes: false },
    );

    expect(await untis.getLatestImportTime(validate)).toBe(123);
  },
  [
    { name: "with validate", validate: true },
    { name: "without validate", validate: false },
  ],
);

cases(
  "should getOwnTimetableForToday return result",
  async ({ validate, postIndex }) => {
    const untis = createInstance();

    fetchMock.post(
      (url, opts) => {
        if (matchesBaseUrl(url) && opts && opts.body) {
          const body = JSON.parse(opts.body);
          return body.method === "getTimetable";
        }
        return false;
      },
      { result: 123 },
      { overwriteRoutes: false },
    );
    await untis.login();
    const result = await untis.getOwnTimetableForToday(validate);

    expect(result).toBe(123);
    const calls = fetchMock.calls();
    const timetableCall = findRpcCall(calls, "getTimetable");
    expect(timetableCall).toBeDefined();
    const timetableBody = JSON.parse(timetableCall[1].body);
    expect(timetableBody).toMatchObject(getElementObject());
  },
  [
    { name: "with validate", postIndex: 2, validate: true },
    { name: "without validate", postIndex: 1, validate: false },
  ],
);

cases(
  "should getTimetableForToday return result",
  async ({ validate, postIndex }) => {
    const id = 42;
    const type = 7;
    const untis = createInstance();

    fetchMock.post(
      (url, opts) => {
        if (matchesBaseUrl(url) && opts && opts.body) {
          const body = JSON.parse(opts.body);
          return body.method === "getTimetable";
        }
        return false;
      },
      { result: 123 },
      { overwriteRoutes: false },
    );

    applySession(untis, {
      personId: id,
      personType: type,
      persons: [
        {
          id,
          type,
          displayName: "Override Person",
          longName: "Override Person",
          foreName: "Override",
        },
      ],
    });

    expect(await untis.getTimetableForToday(id, type, validate)).toBe(123);
    const calls = fetchMock.calls();
    const timetableCall = findRpcCall(calls, "getTimetable");
    expect(timetableCall).toBeDefined();
    const timetableBody = JSON.parse(timetableCall[1].body);
    expect(timetableBody).toMatchObject(getElementObject(id, type));
  },
  [
    { name: "with validate", postIndex: 1, validate: true },
    { name: "without validate", postIndex: 0, validate: false },
  ],
);

cases(
  "should getOwnTimetableFor return result",
  async ({ validate, postIndex }) => {
    const date = new Date("11/13/2019");
    const untis = createInstance();

    fetchMock.post(
      (url, opts) => {
        if (matchesBaseUrl(url) && opts && opts.body) {
          const body = JSON.parse(opts.body);
          return body.method === "getTimetable";
        }
        return false;
      },
      { result: 123 },
      { overwriteRoutes: false },
    );
    await untis.login();

    expect(await untis.getOwnTimetableFor(date, validate)).toBe(123);
    const calls = fetchMock.calls();
    const timetableCall = findRpcCall(calls, "getTimetable");
    expect(timetableCall).toBeDefined();
    const timetableBody = JSON.parse(timetableCall[1].body);
    expect(timetableCall[1].body).toMatch("20191113");
    expect(timetableBody).toMatchObject(getElementObject());
  },
  [
    { name: "with validate", postIndex: 2, validate: true },
    { name: "without validate", postIndex: 1, validate: false },
  ],
);

cases(
  "should getTimetableFor return result",
  async (validate) => {
    const id = 84;
    const type = 3;
    const date = new Date("11/13/2019");
    const untis = createInstance();

    fetchMock.post(
      (url, opts) => {
        if (matchesBaseUrl(url) && opts && opts.body) {
          const body = JSON.parse(opts.body);
          return body.method === "getTimetable";
        }
        return false;
      },
      { result: 123 },
      { overwriteRoutes: false },
    );

    applySession(untis, {
      personId: id,
      personType: type,
      persons: [
        {
          id,
          type,
          displayName: "Override Person",
          longName: "Override Person",
          foreName: "Override",
        },
      ],
    });

    expect(await untis.getTimetableFor(date, id, type, validate)).toBe(123);
    const calls = fetchMock.calls();
    const timetableCall = findRpcCall(calls, "getTimetable");
    expect(timetableCall).toBeDefined();
    const timetableBody = timetableCall[1].body;
    expect(timetableBody).toMatch("20191113");
    expect(JSON.parse(timetableBody)).toMatchObject(getElementObject(id, type));
  },
  [
    { name: "with validate", validate: true },
    { name: "without validate", validate: false },
  ],
);

cases(
  "should getOwnTimetableForRange return result",
  async (validate) => {
    const dateStart = new Date("11/13/2019");
    const dateEnd = new Date("11/17/2019");
    const untis = createInstance();

    fetchMock.post(
      (url, opts) => {
        if (matchesBaseUrl(url) && opts && opts.body) {
          const body = JSON.parse(opts.body);
          return body.method === "getTimetable";
        }
        return false;
      },
      { result: 123 },
      { overwriteRoutes: false },
    );

    applySession(untis);

    expect(await untis.getOwnTimetableForRange(dateStart, dateEnd, validate)).toBe(123);
    const calls = fetchMock.calls();
    const timetableCall = findRpcCall(calls, "getTimetable");
    expect(timetableCall).toBeDefined();
    const timetableBody = timetableCall[1].body;
    expect(timetableBody).toMatch("20191113");
    expect(timetableBody).toMatch("20191117");
  },
  [
    { name: "with validate", validate: true },
    { name: "without validate", validate: false },
  ],
);

cases(
  "should getTimetableForRange return result",
  async (validate) => {
    const id = 84;
    const type = 3;
    const dateStart = new Date("11/13/2019");
    const dateEnd = new Date("11/17/2019");
    const untis = createInstance();

    fetchMock.post(
      (url, opts) => {
        if (matchesBaseUrl(url) && opts && opts.body) {
          const body = JSON.parse(opts.body);
          return body.method === "getTimetable";
        }
        return false;
      },
      { result: 123 },
      { overwriteRoutes: false },
    );

    applySession(untis, {
      personId: id,
      personType: type,
      persons: [
        {
          id,
          type,
          displayName: "Override Person",
          longName: "Override Person",
          foreName: "Override",
        },
      ],
    });

    expect(await untis.getTimetableForRange(dateStart, dateEnd, id, type, validate)).toBe(123);
    const calls = fetchMock.calls();
    const timetableCall = findRpcCall(calls, "getTimetable");
    expect(timetableCall).toBeDefined();
    const timetableBody = timetableCall[1].body;
    expect(timetableBody).toMatch("20191113");
    expect(timetableBody).toMatch("20191117");
    expect(JSON.parse(timetableBody)).toMatchObject(getElementObject(id, type));
  },
  [
    { name: "with validate", validate: true },
    { name: "without validate", validate: false },
  ],
);

cases(
  "should getOwnClassTimetableForToday return result",
  async (validate) => {
    const untis = createInstance();

    fetchMock.post(
      (url, opts) => {
        if (matchesBaseUrl(url) && opts && opts.body) {
          const body = JSON.parse(opts.body);
          return body.method === "getTimetable";
        }
        return false;
      },
      { result: 123 },
      { overwriteRoutes: false },
    );
    await untis.login();

    expect(await untis.getOwnClassTimetableForToday(validate)).toBe(123);
    const calls = fetchMock.calls();
    const timetableCall = findRpcCall(calls, "getTimetable");
    expect(timetableCall).toBeDefined();
    const timetableBody = JSON.parse(timetableCall[1].body);
    expect(timetableBody).toMatchObject(getElementObject(mockResponse.result.klasseId, 1));
  },
  [
    { name: "with validate", validate: true },
    { name: "without validate", validate: false },
  ],
);

cases(
  "should getOwnClassTimetableFor return result",
  async (validate) => {
    const date = new Date("11/13/2019");
    const untis = createInstance();

    fetchMock.post(
      (url, opts) => {
        if (matchesBaseUrl(url) && opts && opts.body) {
          const body = JSON.parse(opts.body);
          return body.method === "getTimetable";
        }
        return false;
      },
      { result: 123 },
      { overwriteRoutes: false },
    );
    await untis.login();

    expect(await untis.getOwnClassTimetableFor(date, validate)).toBe(123);
    const calls = fetchMock.calls();
    const timetableCall = findRpcCall(calls, "getTimetable");
    expect(timetableCall).toBeDefined();
    const timetableBody = timetableCall[1].body;
    expect(timetableBody).toMatch("20191113");
    expect(JSON.parse(timetableBody)).toMatchObject(getElementObject(mockResponse.result.klasseId, 1));
  },
  [
    { name: "with validate", validate: true },
    { name: "without validate", validate: false },
  ],
);

cases(
  "should getOwnClassTimetableForRange return result",
  async (validate) => {
    const dateStart = new Date("11/13/2019");
    const dateEnd = new Date("11/17/2019");
    const untis = createInstance();

    fetchMock.post(
      (url, opts) => {
        if (matchesBaseUrl(url) && opts && opts.body) {
          const body = JSON.parse(opts.body);
          return body.method === "getTimetable";
        }
        return false;
      },
      { result: 123 },
      { overwriteRoutes: false },
    );
    await untis.login();

    expect(await untis.getOwnClassTimetableForRange(dateStart, dateEnd, validate)).toBe(123);
    const calls = fetchMock.calls();
    const timetableCall = findRpcCall(calls, "getTimetable");
    expect(timetableCall).toBeDefined();
    const timetableBody = timetableCall[1].body;
    expect(timetableBody).toMatch("20191113");
    expect(timetableBody).toMatch("20191117");
    expect(JSON.parse(timetableBody)).toMatchObject(getElementObject(mockResponse.result.klasseId, 1));
  },
  [
    { name: "with validate", validate: true },
    { name: "without validate", validate: false },
  ],
);

cases(
  "should getHomeWorksFor return result",
  async ({ validate }) => {
    const dateStart = new Date("11/13/2019");
    const dateEnd = new Date("11/17/2019");
    const untis = createInstance();

    fetchMock.get(
      /homeworks\/lessons/,
      {
        data: {
          homeworks: {},
        },
      },
      { overwriteRoutes: false },
    );

    expect(await untis.getHomeWorksFor(dateStart, dateEnd, validate)).toEqual({
      homeworks: {},
    });
    const calls = fetchMock.calls();
    const getCall = calls.find((call) => call[0].includes("homeworks/lessons"));
    const url = new URL(getCall[0]);
    expect(url.searchParams.get("startDate")).toMatch("20191113");
    expect(url.searchParams.get("endDate")).toMatch("20191117");
  },
  [
    { name: "with validate", validate: true },
    { name: "without validate", validate: false },
  ],
);

cases(
  "should getHomeWorksFor catch error",
  async ({ validate, response, data }) => {
    const dateStart = new Date("11/13/2019");
    const dateEnd = new Date("11/17/2019");
    const untis = createInstance();

    resetFetchMock();
    fetchMock
      .post(matchesBaseUrl, response, { overwriteRoutes: false })
      .get(/homeworks\/lessons/, { data }, { overwriteRoutes: false });

    const expectedMessage =
      data && typeof data === "object" && !Array.isArray(data) && data.homeworks === undefined
        ? "homeworks"
        : "expected data object";

    await expect(() => untis.getHomeWorksFor(dateStart, dateEnd, validate)).rejects.toThrow(expectedMessage);
  },
  [
    {
      name: "validate",
      validate: true,
      data: "",
      response: { result: "" },
    },
    {
      name: "validate with not object",
      validate: true,
      data: "",
      response: { result: 200 },
    },
    {
      name: "validate without homeworks",
      validate: true,
      data: {},
      response: { result: 200 },
    },
    {
      name: "invalidate",
      validate: false,
      data: "",
      response: { result: "" },
    },
    {
      name: "invalidate with not object",
      validate: false,
      data: "",
      response: { result: 200 },
    },
    {
      name: "invalidate without homeworks",
      validate: false,
      data: {},
      response: { result: 200 },
    },
  ],
);

test("should convertUntisDate converted date", () => {
  const date = new Date("11/13/2019");
  expect(WebUntis.convertUntisDate(20191113, date)).toEqual(date);
});

test("should convertUntisTime converted time", () => {
  const date = new Date("11/13/2019 3:11");
  expect(WebUntis.convertUntisTime(311, date)).toEqual(date);
});

cases(
  "should method return result",
  async ({ name, method, validate, post }) => {
    const untis = createInstance();

    fetchMock.post(matchesBaseUrl, mockResponse, { overwriteRoutes: true });

    expect(await untis[name](validate)).toEqual(mockResponse.result);
    const calls = fetchMock.calls();
    const targetCall = calls.find((call) => {
      const body = JSON.parse(call[1].body);
      return body.method === method;
    });
    expect(JSON.parse(targetCall[1].body)).toMatchObject({
      method,
    });
  },
  [
    { name: "getSubjects", method: "getSubjects", validate: true, post: 1 },
    {
      name: "getSubjects",
      method: "getSubjects",
      validate: false,
      post: 0,
    },
    { name: "getTeachers", method: "getTeachers", validate: true, post: 1 },
    {
      name: "getTeachers",
      method: "getTeachers",
      validate: false,
      post: 0,
    },
    { name: "getStudents", method: "getStudents", validate: true, post: 1 },
    {
      name: "getStudents",
      method: "getStudents",
      validate: false,
      post: 0,
    },
    { name: "getRooms", method: "getRooms", validate: true, post: 1 },
    { name: "getRooms", method: "getRooms", validate: false, post: 0 },
    { name: "getClasses", method: "getKlassen", validate: true, post: 1 },
    { name: "getClasses", method: "getKlassen", validate: false, post: 0 },
    {
      name: "getDepartments",
      method: "getDepartments",
      validate: true,
      post: 1,
    },
    {
      name: "getDepartments",
      method: "getDepartments",
      validate: false,
      post: 0,
    },
    { name: "getHolidays", method: "getHolidays", validate: true, post: 1 },
    {
      name: "getHolidays",
      method: "getHolidays",
      validate: false,
      post: 0,
    },
    {
      name: "getStatusData",
      method: "getStatusData",
      validate: true,
      post: 1,
    },
    {
      name: "getStatusData",
      method: "getStatusData",
      validate: false,
      post: 0,
    },
    {
      name: "getTimegrid",
      method: "getTimegridUnits",
      validate: true,
      post: 1,
    },
    {
      name: "getTimegrid",
      method: "getTimegridUnits",
      validate: false,
      post: 0,
    },
  ],
);

cases(
  "should getHomeWorkAndLessons return result",
  async ({ validate }) => {
    const dateStart = new Date("11/13/2019");
    const dateEnd = new Date("11/17/2019");
    const untis = createInstance();

    fetchMock.get(
      /homeworks\/lessons/,
      {
        data: {
          homeworks: {},
        },
      },
      { overwriteRoutes: false },
    );

    expect(await untis.getHomeWorkAndLessons(dateStart, dateEnd, validate)).toEqual({
      homeworks: {},
    });
    const calls = fetchMock.calls();
    const getCall = calls.find((call) => call[0].includes("homeworks/lessons"));
    const url = new URL(getCall[0]);
    expect(url.searchParams.get("startDate")).toMatch("20191113");
    expect(url.searchParams.get("endDate")).toMatch("20191117");
  },
  [
    { name: "with validate", validate: true },
    { name: "without validate", validate: false },
  ],
);

cases(
  "should getHomeWorkAndLessons catch error",
  async ({ validate, response, data }) => {
    const dateStart = new Date("11/13/2019");
    const dateEnd = new Date("11/17/2019");
    const untis = createInstance();

    resetFetchMock();
    fetchMock
      .post(matchesBaseUrl, response, { overwriteRoutes: false })
      .get(/homeworks\/lessons/, { data }, { overwriteRoutes: false });

    const expectedMessage =
      data && typeof data === "object" && !Array.isArray(data) && data.homeworks === undefined
        ? "homeworks"
        : "expected data object";

    await expect(() => untis.getHomeWorkAndLessons(dateStart, dateEnd, validate)).rejects.toThrow(expectedMessage);
  },
  [
    {
      name: "validate",
      validate: true,
      data: "",
      response: { result: "" },
    },
    {
      name: "validate with not object",
      validate: true,
      data: "",
      response: { result: 200 },
    },
    {
      name: "validate without homeworks",
      validate: true,
      data: {},
      response: { result: 200 },
    },
    {
      name: "invalidate",
      validate: false,
      data: "",
      response: { result: "" },
    },
    {
      name: "invalidate with not object",
      validate: false,
      data: "",
      response: { result: 200 },
    },
    {
      name: "invalidate without homeworks",
      validate: false,
      data: {},
      response: { result: 200 },
    },
  ],
);

cases(
  "should convertDateToUntis converted date",
  ({ date, result }) => {
    expect(WebUntis.convertDateToUntis(new Date(date))).toBe(result);
  },
  [
    { name: "default", date: "11/13/2019", result: "20191113" },
    { name: "date < 10", date: "11/09/2019", result: "20191109" },
    { name: "mouth < 10", date: "09/13/2019", result: "20190913" },
    {
      name: "date < 10 && mouth < 10",
      date: "09/08/2019",
      result: "20190908",
    },
  ],
);
