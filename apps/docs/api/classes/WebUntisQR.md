# Class: WebUntisQR

Defined in: [packages/webuntis-api/src/qr.ts:10](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/qr.ts#L10)

## Extends

- [`WebUntisSecretAuth`](WebUntisSecretAuth.md)

## Constructors

### Constructor

> **new WebUntisQR**(`QRCodeURI`, `identity?`, `authenticator?`, `URL?`, `disableUserAgent?`): `WebUntisQR`

Defined in: [packages/webuntis-api/src/qr.ts:19](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/qr.ts#L19)

Use the data you get from a WebUntis QR code

#### Parameters

##### QRCodeURI

`string`

A WebUntis uri. This is the data you get from the QR Code from the webuntis webapp under profile->Data access->Display

##### identity?

`string`

A identity like: MyAwesomeApp

##### authenticator?

`Authenticator`

Custom otplib v12 instance. Default will use the default otplib configuration.

##### URL?

(`url`, `base?`) => `URL`

Custom whatwg url implementation. Default will use the nodejs implementation.

##### disableUserAgent?

`boolean` = `false`

If this is true, axios will not send a custom User-Agent

#### Returns

`WebUntisQR`

#### Overrides

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`constructor`](WebUntisSecretAuth.md#constructor)

## Properties

### anonymous

> **anonymous**: `boolean`

Defined in: [packages/webuntis-api/src/base.ts:55](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L55)

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`anonymous`](WebUntisSecretAuth.md#anonymous)

***

### baseHeaders

> **baseHeaders**: `Record`\<`string`, `string`\>

Defined in: [packages/webuntis-api/src/base.ts:57](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L57)

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`baseHeaders`](WebUntisSecretAuth.md#baseheaders)

***

### baseurl?

> `optional` **baseurl**: `string`

Defined in: [packages/webuntis-api/src/base.ts:51](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L51)

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`baseurl`](WebUntisSecretAuth.md#baseurl)

***

### cookies

> **cookies**: `string`[]

Defined in: [packages/webuntis-api/src/base.ts:52](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L52)

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`cookies`](WebUntisSecretAuth.md#cookies)

***

### id

> **id**: `string`

Defined in: [packages/webuntis-api/src/base.ts:53](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L53)

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`id`](WebUntisSecretAuth.md#id)

***

### password

> **password**: `string`

Defined in: [packages/webuntis-api/src/base.ts:50](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L50)

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`password`](WebUntisSecretAuth.md#password)

***

### school

> **school**: `string`

Defined in: [packages/webuntis-api/src/base.ts:47](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L47)

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`school`](WebUntisSecretAuth.md#school)

***

### schoolBase64

> **schoolBase64**: `string`

Defined in: [packages/webuntis-api/src/base.ts:48](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L48)

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`schoolBase64`](WebUntisSecretAuth.md#schoolbase64)

***

### sessionInformation

> **sessionInformation**: [`SessionInformation`](../type-aliases/SessionInformation.md) \| `null`

Defined in: [packages/webuntis-api/src/base.ts:54](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L54)

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`sessionInformation`](WebUntisSecretAuth.md#sessioninformation)

***

### username

> **username**: `string`

Defined in: [packages/webuntis-api/src/base.ts:49](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L49)

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`username`](WebUntisSecretAuth.md#username)

***

### TYPES

> `static` **TYPES**: *typeof* [`WebUntisElementType`](../enumerations/WebUntisElementType.md) = `WebUntisElementType`

Defined in: [packages/webuntis-api/src/base.ts:59](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L59)

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`TYPES`](WebUntisSecretAuth.md#types)

## Methods

### \_getAppConfig()

> **\_getAppConfig**(): `Promise`\<`any`\>

Defined in: [packages/webuntis-api/src/base.ts:421](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L421)

#### Returns

`Promise`\<`any`\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`_getAppConfig`](WebUntisSecretAuth.md#_getappconfig)

***

### \_getKlasseId()

> **\_getKlasseId**(): `Promise`\<`any`\>

Defined in: [packages/webuntis-api/src/base.ts:432](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L432)

#### Returns

`Promise`\<`any`\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`_getKlasseId`](WebUntisSecretAuth.md#_getklasseid)

***

### \_getPersonIdAndType()

> **\_getPersonIdAndType**(): `object`

Defined in: [packages/webuntis-api/src/base.ts:446](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L446)

#### Returns

`object`

##### personId

> **personId**: `number`

##### personType

> **personType**: `number`

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`_getPersonIdAndType`](WebUntisSecretAuth.md#_getpersonidandtype)

***

### \_otpLogin()

> **\_otpLogin**(`token`, `username`, `time`, `skipSessionInfo`): `Promise`\<[`SessionInformation`](../type-aliases/SessionInformation.md)\>

Defined in: [packages/webuntis-api/src/base.ts:1173](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L1173)

#### Parameters

##### token

`string` | `number`

##### username

`string`

##### time

`number`

##### skipSessionInfo

`boolean` = `false`

#### Returns

`Promise`\<[`SessionInformation`](../type-aliases/SessionInformation.md)\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`_otpLogin`](WebUntisSecretAuth.md#_otplogin)

***

### getAbsentLesson()

> **getAbsentLesson**(`rangeStart`, `rangeEnd`, `excuseStatusId?`, `validateSession?`): `Promise`\<[`Absences`](../interfaces/Absences.md)\>

Defined in: [packages/webuntis-api/src/base.ts:1078](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L1078)

Returns all the Lessons where you were absent including the excused one!

#### Parameters

##### rangeStart

`Date`

##### rangeEnd

`Date`

##### excuseStatusId?

`number` = `-1`

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`Absences`](../interfaces/Absences.md)\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getAbsentLesson`](WebUntisSecretAuth.md#getabsentlesson)

***

### getClasses()

> **getClasses**(`validateSession?`, `schoolyearId?`): `Promise`\<[`Klasse`](../interfaces/Klasse.md)[]\>

Defined in: [packages/webuntis-api/src/base.ts:967](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L967)

Get all classes known by WebUntis

#### Parameters

##### validateSession?

`boolean` = `true`

##### schoolyearId?

`number`

#### Returns

`Promise`\<[`Klasse`](../interfaces/Klasse.md)[]\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getClasses`](WebUntisSecretAuth.md#getclasses)

***

### getCurrentSchoolyear()

> **getCurrentSchoolyear**(`validateSession?`): `Promise`\<[`SchoolYear`](../interfaces/SchoolYear.md)\>

Defined in: [packages/webuntis-api/src/base.ts:1004](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L1004)

Get the current school year

#### Parameters

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`SchoolYear`](../interfaces/SchoolYear.md)\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getCurrentSchoolyear`](WebUntisSecretAuth.md#getcurrentschoolyear)

***

### getDepartments()

> **getDepartments**(`validateSession?`): `Promise`\<[`Department`](../interfaces/Department.md)[]\>

Defined in: [packages/webuntis-api/src/base.ts:977](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L977)

Get all departments known by WebUntis

#### Parameters

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`Department`](../interfaces/Department.md)[]\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getDepartments`](WebUntisSecretAuth.md#getdepartments)

***

### getExamsForRange()

> **getExamsForRange**(`rangeStart`, `rangeEnd`, `klasseId`, `withGrades`, `validateSession?`): `Promise`\<[`Exam`](../interfaces/Exam.md)[]\>

Defined in: [packages/webuntis-api/src/base.ts:812](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L812)

Get Exams for range

#### Parameters

##### rangeStart

`Date`

##### rangeEnd

`Date`

##### klasseId

`string` | `number` | `undefined`

##### withGrades

`boolean` = `false`

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`Exam`](../interfaces/Exam.md)[]\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getExamsForRange`](WebUntisSecretAuth.md#getexamsforrange)

***

### getHolidays()

> **getHolidays**(`validateSession?`): `Promise`\<[`Holiday`](../interfaces/Holiday.md)[]\>

Defined in: [packages/webuntis-api/src/base.ts:986](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L986)

Get all holidays known by WebUntis

#### Parameters

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`Holiday`](../interfaces/Holiday.md)[]\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getHolidays`](WebUntisSecretAuth.md#getholidays)

***

### getHomeWorkAndLessons()

> **getHomeWorkAndLessons**(`rangeStart`, `rangeEnd`, `validateSession?`): `Promise`\<`any`[]\>

Defined in: [packages/webuntis-api/src/base.ts:781](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L781)

TODO: Find out what type this function returns

#### Parameters

##### rangeStart

`Date`

##### rangeEnd

`Date`

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<`any`[]\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getHomeWorkAndLessons`](WebUntisSecretAuth.md#gethomeworkandlessons)

***

### getHomeWorksFor()

> **getHomeWorksFor**(`rangeStart`, `rangeEnd`, `validateSession?`): `Promise`\<[`Homeworks`](../interfaces/Homeworks.md)\>

Defined in: [packages/webuntis-api/src/base.ts:701](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L701)

#### Parameters

##### rangeStart

`Date`

##### rangeEnd

`Date`

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`Homeworks`](../interfaces/Homeworks.md)\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getHomeWorksFor`](WebUntisSecretAuth.md#gethomeworksfor)

***

### getInbox()

> **getInbox**(`validateSession`): `Promise`\<[`Inbox`](../interfaces/Inbox.md)\>

Defined in: [packages/webuntis-api/src/base.ts:358](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L358)

Get Inbox

#### Parameters

##### validateSession

`boolean` = `true`

#### Returns

`Promise`\<[`Inbox`](../interfaces/Inbox.md)\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getInbox`](WebUntisSecretAuth.md#getinbox)

***

### getLatestImportTime()

> **getLatestImportTime**(`validateSession?`): `Promise`\<`number`\>

Defined in: [packages/webuntis-api/src/base.ts:514](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L514)

Get the time when WebUntis last changed its data

#### Parameters

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<`number`\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getLatestImportTime`](WebUntisSecretAuth.md#getlatestimporttime)

***

### getLatestSchoolyear()

> **getLatestSchoolyear**(`validateSession?`): `Promise`\<[`SchoolYear`](../interfaces/SchoolYear.md)\>

Defined in: [packages/webuntis-api/src/base.ts:291](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L291)

Get the latest WebUntis Schoolyear

#### Parameters

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`SchoolYear`](../interfaces/SchoolYear.md)\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getLatestSchoolyear`](WebUntisSecretAuth.md#getlatestschoolyear)

***

### getNewsWidget()

> **getNewsWidget**(`date`, `validateSession?`): `Promise`\<[`NewsWidget`](../interfaces/NewsWidget.md)\>

Defined in: [packages/webuntis-api/src/base.ts:335](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L335)

Get News Widget

#### Parameters

##### date

`Date`

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`NewsWidget`](../interfaces/NewsWidget.md)\>

see index.d.ts NewsWidget

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getNewsWidget`](WebUntisSecretAuth.md#getnewswidget)

***

### getOwnClassTimetableFor()

> **getOwnClassTimetableFor**(`date`, `validateSession?`): `Promise`\<[`Lesson`](../interfaces/Lesson.md)[]\>

Defined in: [packages/webuntis-api/src/base.ts:670](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L670)

Get the Timetable of your class for the given day
Note: You can't use this with anonymous login

#### Parameters

##### date

`Date`

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`Lesson`](../interfaces/Lesson.md)[]\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getOwnClassTimetableFor`](WebUntisSecretAuth.md#getownclasstimetablefor)

***

### getOwnClassTimetableForRange()

> **getOwnClassTimetableForRange**(`rangeStart`, `rangeEnd`, `validateSession?`): `Promise`\<[`Lesson`](../interfaces/Lesson.md)[]\>

Defined in: [packages/webuntis-api/src/base.ts:683](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L683)

Get the Timetable of your class for a given Date range
Note: You can't use this with anonymous login

#### Parameters

##### rangeStart

`Date`

##### rangeEnd

`Date`

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`Lesson`](../interfaces/Lesson.md)[]\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getOwnClassTimetableForRange`](WebUntisSecretAuth.md#getownclasstimetableforrange)

***

### getOwnClassTimetableForToday()

> **getOwnClassTimetableForToday**(`validateSession?`): `Promise`\<[`Lesson`](../interfaces/Lesson.md)[]\>

Defined in: [packages/webuntis-api/src/base.ts:657](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L657)

Get the Timetable of your class for today
Note: You can't use this with anonymous login

#### Parameters

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`Lesson`](../interfaces/Lesson.md)[]\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getOwnClassTimetableForToday`](WebUntisSecretAuth.md#getownclasstimetablefortoday)

***

### getOwnTimetableFor()

> **getOwnTimetableFor**(`date`, `validateSession?`): `Promise`\<[`Lesson`](../interfaces/Lesson.md)[]\>

Defined in: [packages/webuntis-api/src/base.ts:598](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L598)

Get your own Timetable for the given day
Note: You can't use this with anonymous login

#### Parameters

##### date

`Date`

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`Lesson`](../interfaces/Lesson.md)[]\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getOwnTimetableFor`](WebUntisSecretAuth.md#getowntimetablefor)

***

### getOwnTimetableForRange()

> **getOwnTimetableForRange**(`rangeStart`, `rangeEnd`, `validateSession?`): `Promise`\<[`Lesson`](../interfaces/Lesson.md)[]\>

Defined in: [packages/webuntis-api/src/base.ts:624](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L624)

Get your own timetable for a given Date range
Note: You can't use this with anonymous login

#### Parameters

##### rangeStart

`Date`

##### rangeEnd

`Date`

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`Lesson`](../interfaces/Lesson.md)[]\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getOwnTimetableForRange`](WebUntisSecretAuth.md#getowntimetableforrange)

***

### getOwnTimetableForToday()

> **getOwnTimetableForToday**(`validateSession?`): `Promise`\<[`Lesson`](../interfaces/Lesson.md)[]\>

Defined in: [packages/webuntis-api/src/base.ts:574](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L574)

Get your own Timetable for the current day
Note: You can't use this with anonymous login

#### Parameters

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`Lesson`](../interfaces/Lesson.md)[]\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getOwnTimetableForToday`](WebUntisSecretAuth.md#getowntimetablefortoday)

***

### getOwnTimetableForWeek()

> **getOwnTimetableForWeek**(`date`, `formatId?`, `validateSession?`): `Promise`\<[`WebAPITimetable`](../type-aliases/WebAPITimetable.md)\>

Defined in: [packages/webuntis-api/src/base.ts:924](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L924)

Get the timetable for the current week for the current element from the web client API.

#### Parameters

##### date

`Date`

one date in the week to query

##### formatId?

`number` = `1`

set to 1 to include teachers, 2 omits the teachers in elements response

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`WebAPITimetable`](../type-aliases/WebAPITimetable.md)\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getOwnTimetableForWeek`](WebUntisSecretAuth.md#getowntimetableforweek)

***

### getPdfOfAbsentLesson()

> **getPdfOfAbsentLesson**(`rangeStart`, `rangeEnd`, `validateSession?`, `excuseStatusId?`, `lateness?`, `absences?`, `excuseGroup?`): `Promise`\<`string`\>

Defined in: [packages/webuntis-api/src/base.ts:1115](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L1115)

Returns a URL to a unique PDF of all the lessons you were absent

#### Parameters

##### rangeStart

`Date`

##### rangeEnd

`Date`

##### validateSession?

`boolean` = `true`

##### excuseStatusId?

`number`

##### lateness?

`boolean` = `true`

##### absences?

`boolean` = `true`

##### excuseGroup?

`number`

#### Returns

`Promise`\<`string`\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getPdfOfAbsentLesson`](WebUntisSecretAuth.md#getpdfofabsentlesson)

***

### getRooms()

> **getRooms**(`validateSession?`): `Promise`\<[`Room`](../interfaces/Room.md)[]\>

Defined in: [packages/webuntis-api/src/base.ts:957](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L957)

Get all known rooms by WebUntis

#### Parameters

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`Room`](../interfaces/Room.md)[]\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getRooms`](WebUntisSecretAuth.md#getrooms)

***

### getSchoolyears()

> **getSchoolyears**(`validateSession?`): `Promise`\<[`SchoolYear`](../interfaces/SchoolYear.md)[]\>

Defined in: [packages/webuntis-api/src/base.ts:311](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L311)

Get all WebUntis Schoolyears

#### Parameters

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`SchoolYear`](../interfaces/SchoolYear.md)[]\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getSchoolyears`](WebUntisSecretAuth.md#getschoolyears)

***

### getStatusData()

> **getStatusData**(`validateSession?`): `Promise`\<[`StatusData`](../interfaces/StatusData.md)\>

Defined in: [packages/webuntis-api/src/base.ts:995](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L995)

Get all status data known by WebUntis

#### Parameters

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`StatusData`](../interfaces/StatusData.md)\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getStatusData`](WebUntisSecretAuth.md#getstatusdata)

***

### getStudents()

> **getStudents**(`validateSession?`): `Promise`\<[`Student`](../interfaces/Student.md)[]\>

Defined in: [packages/webuntis-api/src/base.ts:948](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L948)

Get all known students by WebUntis

#### Parameters

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`Student`](../interfaces/Student.md)[]\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getStudents`](WebUntisSecretAuth.md#getstudents)

***

### getSubjects()

> **getSubjects**(`validateSession?`): `Promise`\<[`Subject`](../interfaces/Subject.md)[]\>

Defined in: [packages/webuntis-api/src/base.ts:760](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L760)

Get all known Subjects for the current logged-in user

#### Parameters

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`Subject`](../interfaces/Subject.md)[]\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getSubjects`](WebUntisSecretAuth.md#getsubjects)

***

### getTeachers()

> **getTeachers**(`validateSession?`): `Promise`\<[`Teacher`](../interfaces/Teacher.md)[]\>

Defined in: [packages/webuntis-api/src/base.ts:939](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L939)

Get all known teachers by WebUntis

#### Parameters

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`Teacher`](../interfaces/Teacher.md)[]\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getTeachers`](WebUntisSecretAuth.md#getteachers)

***

### getTimegrid()

> **getTimegrid**(`validateSession?`): `Promise`\<[`Timegrid`](../interfaces/Timegrid.md)[]\>

Defined in: [packages/webuntis-api/src/base.ts:769](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L769)

Get the timegrid of current school

#### Parameters

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`Timegrid`](../interfaces/Timegrid.md)[]\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getTimegrid`](WebUntisSecretAuth.md#gettimegrid)

***

### getTimetableFor()

> **getTimetableFor**(`date`, `id`, `type`, `validateSession?`): `Promise`\<[`Lesson`](../interfaces/Lesson.md)[]\>

Defined in: [packages/webuntis-api/src/base.ts:611](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L611)

Get the timetable for a specific day for a specific element.

#### Parameters

##### date

`Date`

##### id

`number`

##### type

`number`

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`Lesson`](../interfaces/Lesson.md)[]\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getTimetableFor`](WebUntisSecretAuth.md#gettimetablefor)

***

### getTimetableForRange()

> **getTimetableForRange**(`rangeStart`, `rangeEnd`, `id`, `type`, `validateSession?`): `Promise`\<[`Lesson`](../interfaces/Lesson.md)[]\>

Defined in: [packages/webuntis-api/src/base.ts:639](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L639)

Get the timetable for a given Date range for specific element

#### Parameters

##### rangeStart

`Date`

##### rangeEnd

`Date`

##### id

`number`

##### type

`number`

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`Lesson`](../interfaces/Lesson.md)[]\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getTimetableForRange`](WebUntisSecretAuth.md#gettimetableforrange)

***

### getTimetableForToday()

> **getTimetableForToday**(`id`, `type`, `validateSession?`): `Promise`\<[`Lesson`](../interfaces/Lesson.md)[]\>

Defined in: [packages/webuntis-api/src/base.ts:587](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L587)

Get the timetable of today for a specific element.

#### Parameters

##### id

`number`

##### type

`number`

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`Lesson`](../interfaces/Lesson.md)[]\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getTimetableForToday`](WebUntisSecretAuth.md#gettimetablefortoday)

***

### getTimetableForWeek()

> **getTimetableForWeek**(`date`, `id`, `type`, `formatId?`, `validateSession?`): `Promise`\<[`WebAPITimetable`](../type-aliases/WebAPITimetable.md)\>

Defined in: [packages/webuntis-api/src/base.ts:851](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L851)

Get the timetable for the current week for a specific element from the web client API.

#### Parameters

##### date

`Date`

one date in the week to query

##### id

`number`

element id

##### type

`number`

element type

##### formatId?

`number` = `1`

set to 1 to include teachers, 2 omits the teachers in elements response

##### validateSession?

`boolean` = `true`

#### Returns

`Promise`\<[`WebAPITimetable`](../type-aliases/WebAPITimetable.md)\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`getTimetableForWeek`](WebUntisSecretAuth.md#gettimetableforweek)

***

### login()

> **login**(): `Promise`\<[`SessionInformation`](../type-aliases/SessionInformation.md)\>

Defined in: [packages/webuntis-api/src/secret.ts:50](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/secret.ts#L50)

Login with your credentials

**Notice: The server may revoke this session after less than 10min of idle.**

*Untis says in the official docs:*
> An application should always log out as soon as possible to free system resources on the server.

#### Returns

`Promise`\<[`SessionInformation`](../type-aliases/SessionInformation.md)\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`login`](WebUntisSecretAuth.md#login)

***

### logout()

> **logout**(): `Promise`\<`boolean`\>

Defined in: [packages/webuntis-api/src/base.ts:219](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L219)

Logout the current session

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`logout`](WebUntisSecretAuth.md#logout)

***

### validateSession()

> **validateSession**(): `Promise`\<`boolean`\>

Defined in: [packages/webuntis-api/src/base.ts:486](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L486)

Checks if your current WebUntis Session is valid

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`validateSession`](WebUntisSecretAuth.md#validatesession)

***

### convertDateToUntis()

> `static` **convertDateToUntis**(`date`): `string`

Defined in: [packages/webuntis-api/src/base.ts:1022](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L1022)

Convert a JS Date Object to a WebUntis date string

#### Parameters

##### date

`Date`

#### Returns

`string`

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`convertDateToUntis`](WebUntisSecretAuth.md#convertdatetountis)

***

### convertUntisDate()

> `static` **convertUntisDate**(`date`, `baseDate?`): `Date`

Defined in: [packages/webuntis-api/src/base.ts:729](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L729)

Converts the untis date string format to a normal JS Date object

#### Parameters

##### date

`string`

Untis date string

##### baseDate?

`Date` = `...`

Base date. Default beginning of current day

#### Returns

`Date`

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`convertUntisDate`](WebUntisSecretAuth.md#convertuntisdate)

***

### convertUntisTime()

> `static` **convertUntisTime**(`time`, `baseDate?`): `Date`

Defined in: [packages/webuntis-api/src/base.ts:739](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L739)

Convert a untis time string to a JS Date object

#### Parameters

##### time

Untis time string

`string` | `number`

##### baseDate?

`Date` = `...`

Day used as base for the time. Default: Current date

#### Returns

`Date`

#### Inherited from

[`WebUntisSecretAuth`](WebUntisSecretAuth.md).[`convertUntisTime`](WebUntisSecretAuth.md#convertuntistime)
