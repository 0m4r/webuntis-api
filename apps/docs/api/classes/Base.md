# Class: Base

Defined in: [packages/webuntis-api/src/base.ts:46](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L46)

## Constructors

### Constructor

> **new Base**(`school`, `username`, `password`, `baseurl?`, `identity?`, `disableUserAgent?`): `Base`

Defined in: [packages/webuntis-api/src/base.ts:186](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L186)

#### Parameters

##### school

`string`

The school identifier

##### username

`string`

##### password

`string`

##### baseurl?

`string`

Just the host name of your WebUntis (Example: [school].webuntis.com)

##### identity?

`string` = `"Awesome"`

A identity like: MyAwesomeApp

##### disableUserAgent?

`boolean` = `false`

If this is true, fetch will not send a custom User-Agent

#### Returns

`Base`

## Properties

### anonymous

> **anonymous**: `boolean`

Defined in: [packages/webuntis-api/src/base.ts:55](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L55)

***

### baseHeaders

> **baseHeaders**: `Record`\<`string`, `string`\>

Defined in: [packages/webuntis-api/src/base.ts:57](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L57)

***

### baseurl?

> `optional` **baseurl**: `string`

Defined in: [packages/webuntis-api/src/base.ts:51](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L51)

***

### cookies

> **cookies**: `string`[]

Defined in: [packages/webuntis-api/src/base.ts:52](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L52)

***

### id

> **id**: `string`

Defined in: [packages/webuntis-api/src/base.ts:53](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L53)

***

### password

> **password**: `string`

Defined in: [packages/webuntis-api/src/base.ts:50](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L50)

***

### school

> **school**: `string`

Defined in: [packages/webuntis-api/src/base.ts:47](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L47)

***

### schoolBase64

> **schoolBase64**: `string`

Defined in: [packages/webuntis-api/src/base.ts:48](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L48)

***

### sessionInformation

> **sessionInformation**: [`SessionInformation`](../type-aliases/SessionInformation.md) \| `null`

Defined in: [packages/webuntis-api/src/base.ts:54](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L54)

***

### username

> **username**: `string`

Defined in: [packages/webuntis-api/src/base.ts:49](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L49)

***

### TYPES

> `static` **TYPES**: *typeof* [`WebUntisElementType`](../enumerations/WebUntisElementType.md) = `WebUntisElementType`

Defined in: [packages/webuntis-api/src/base.ts:59](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L59)

## Methods

### \_getAppConfig()

> **\_getAppConfig**(): `Promise`\<`any`\>

Defined in: [packages/webuntis-api/src/base.ts:421](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L421)

#### Returns

`Promise`\<`any`\>

***

### \_getKlasseId()

> **\_getKlasseId**(): `Promise`\<`any`\>

Defined in: [packages/webuntis-api/src/base.ts:432](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L432)

#### Returns

`Promise`\<`any`\>

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

***

### login()

> **login**(): `Promise`\<[`SessionInformation`](../type-aliases/SessionInformation.md)\>

Defined in: [packages/webuntis-api/src/base.ts:246](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L246)

Login with your credentials

**Notice: The server may revoke this session after less than 10min of idle.**

*Untis says in the official docs:*
> An application should always log out as soon as possible to free system resources on the server.

#### Returns

`Promise`\<[`SessionInformation`](../type-aliases/SessionInformation.md)\>

***

### logout()

> **logout**(): `Promise`\<`boolean`\>

Defined in: [packages/webuntis-api/src/base.ts:219](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L219)

Logout the current session

#### Returns

`Promise`\<`boolean`\>

***

### validateSession()

> **validateSession**(): `Promise`\<`boolean`\>

Defined in: [packages/webuntis-api/src/base.ts:486](https://github.com/0m4r/webuntis-api/blob/b034ac62bdf637888e676617f0deb1d07eac8356/packages/webuntis-api/src/base.ts#L486)

Checks if your current WebUntis Session is valid

#### Returns

`Promise`\<`boolean`\>

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
