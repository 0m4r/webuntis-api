export interface SchoolYear {
  name: string;
  id: number;
  startDate: Date;
  endDate: Date;
}

export interface MessagesOfDay {
  id: number;
  subject: string;
  text: string;
  isExpanded: boolean;
  /**
   * Unknown type. I have never seen this in use.
   */
  attachments: any[];
}

export interface NewsWidget {
  /**
   * Unknown type. I have never seen this in use.
   */
  systemMessage?: any;
  messagesOfDay: MessagesOfDay[];
  rssUrl: string;
}

// export interface Messagesender {
//     userId: number;
//     displayName: string;
//     imageUrl: string;
//     className: string;
// }

// export interface Inboxmessage {
//     allowMessageDeletion: boolean;
//     contentPreview: string;
//     hasAttachments: boolean;
//     id: number;
//     isMessageRead: boolean;
//     isReply: boolean;
//     isReplyAllowed: boolean;
//     sender: Messagesender;
//     sentDateTime: string;
//     subject: string;
// }

// export interface Inbox {
//     incomingMessages: Inboxmessage[];
// }

export interface Inbox {
  incomingMessages: InboxMessage[];
  readConfirmationMessages: InboxMessage[];
}

export interface InboxMessage {
  allowMessageDeletion: boolean;
  contentPreview: string | null;
  hasAttachments: boolean;
  id: number;
  isMessageRead: boolean;
  isReply: boolean;
  isReplyAllowed: boolean;
  sender: InboxSender;
  sentDateTime: string;
  subject: string;
}

export interface InboxSender {
  className: null;
  displayName: string;
  imageUrl: string | null;
  userId: number;
}

export interface ShortData {
  id: number;
  name: string;
  longname: string;
  orgname?: string;
  orgid?: number;
}

export interface Lesson {
  id: number;
  date: number;
  startTime: number;
  endTime: number;
  kl: ShortData[];
  te: ShortData[];
  su: ShortData[];
  ro: ShortData[];
  lstext?: string;
  lsnumber: number;
  activityType?: "Unterricht" | string;
  lessonType?: "Unterricht" | string;
  code?: "cancelled" | "irregular";
  info?: string;
  substText?: string;
  statflags?: string;
  sg?: string;
  bkRemark?: string;
  bkText?: string;
  subject?: string;
}

export interface Homeworks {
  homeworks: Homework[];
  lessons: Partial<Lesson>[];
  records: HomeworkRecord[];
  teachers: Partial<Teacher>[];
}

export interface Homework {
  attachments: any[];
  completed: boolean;
  date: number;
  dueDate: number;
  id: number;
  lessonId: number;
  remark: string;
  text: string;
}

export interface HomeworkRecord {
  elementIds: number[];
  homeworkId: number;
  teacherId: number;
}

export interface Subject {
  active: boolean;
  alternateName: string;
  id: number;
  longName: string;
  name: string;
  backColor?: string;
  foreColor?: string;
}

export enum WebUntisDay {
  Sunday = 1,
  Monday = 2,
  Tuesday = 3,
  Wednesday = 4,
  Thursday = 5,
  Friday = 6,
  Saturday = 7,
}

export interface TimeUnit {
  name: string;
  startTime: number;
  endTime: number;
}

export interface Timegrid {
  day: WebUntisDay;
  timeUnits: TimeUnit[];
}

export interface Exam {
  id: number;
  examType: string;
  name: string;
  studentClass: string[];
  assignedStudents: {
    klasse: { id: number; name: string };
    displayName: string;
    id: number;
  }[];
  examDate: number;
  startTime: number;
  endTime: number;
  subject: string;
  teachers: string[];
  rooms: string[];
  text: string;
  grade?: string;
}

export enum WebUntisElementType {
  CLASS = 1,
  TEACHER = 2,
  SUBJECT = 3,
  ROOM = 4,
  STUDENT = 5,
}

export interface WebElement {
  type: WebUntisElementType;
  id: number;
  orgId: number;
  missing: boolean;
  state: "REGULAR" | "ABSENT" | "SUBSTITUTED";
}

export interface WebElementData extends WebElement {
  element: {
    type: number;
    id: number;
    name: string;
    longName?: string;
    displayname?: string;
    alternatename?: string;
    canViewTimetable: boolean;
    externalKey?: string;
    roomCapacity: number;
  };
}

// export interface WebAPITimetable {
//     id: number;
//     lessonId: number;
//     lessonNumber: number;
//     lessonCode: string;
//     lessonText: string;
//     periodText: string;
//     hasPeriodText: false;
//     periodInfo: string;
//     periodAttachments: [];
//     substText: string;
//     date: number;
//     startTime: number;
//     endTime: number;
//     elements: WebElement[];
//     studentGroup: string;
//     hasInfo: boolean;
//     code: number;
//     cellState: 'STANDARD' | 'SUBSTITUTION' | 'ROOMSUBSTITUTION';
//     priority: number;
//     is: {
//         roomSubstitution?: boolean;
//         substitution?: boolean;
//         standard?: boolean;
//         event: boolean;
//     };
//     roomCapacity: number;
//     studentCount: number;
//     classes: WebElementData[];
//     teachers: WebElementData[];
//     subjects: WebElementData[];
//     rooms: WebElementData[];
//     students: WebElementData[];
// }

export type WebAPITimetable = WebTimetableRow[];

export interface WebTimetableRow {
  cellState: string;
  code: number;
  date: number;
  endTime: number;
  hasInfo: boolean;
  hasPeriodText: boolean;
  id: number;

  is: WebTimetableIs;

  lessonCode: string;
  lessonId: number;
  lessonNumber: number;
  lessonText: string;

  periodAttachments: unknown[];
  periodInfo: string;
  periodText: string;

  priority: number;
  roomCapacity: number;
  startTime: number;
  studentCount: number;

  substText: string;

  // present in some variants (you had it in a few)
  studentGroup?: string;

  // present only for exam rows
  exam?: WebTimetableExam;

  // “raw” elements (no element details attached)
  elements: WebTimetableElementRef[];

  // “resolved” element refs with element metadata attached
  classes: WebTimetableResolvedElement[];
  rooms: WebTimetableResolvedElement[];
  subjects: WebTimetableResolvedElement[];
  teachers: WebTimetableResolvedTeacherElement[];

  // in your sample it’s always any[]
  students: unknown[];
}

export type WebTimetableIs =
  | { event: boolean; standard: boolean }
  | { event: boolean; substitution: boolean }
  | { event: boolean; cancelled: boolean }
  | { event: boolean; exam: boolean }
  // keep roomSubstitution if your API can return it
  | { event: boolean; roomSubstitution: boolean }
  | { event: boolean; additional: boolean };

export interface WebTimetableExam {
  date: number;
  id: number;
  markSchemaId: number;
  name: string;
}

export interface WebTimetableElementRef {
  id: number;
  missing: boolean;
  orgId: number;
  state: string;
  type: number;
}

/** Element metadata shape used by classes/rooms/subjects in your example */
export interface WebElementInfo {
  alternatename: string;
  canViewTimetable: boolean;
  displayname: string;
  id: number;
  longName: string;
  name: string;
  roomCapacity: number;
  type: number;
}

export interface WebTeacherInfo {
  canViewTimetable: boolean;
  externKey: string;
  id: number;
  name: string;
  roomCapacity: number;
  type: number;
}

/**
 * A period-element ref with its resolved `element` metadata.
 * (Your generator wrote `any // circular //` — we just model it properly.)
 */
export interface WebTimetableResolvedElement extends WebTimetableElementRef {
  element: WebElementInfo;
}

export interface WebTimetableResolvedTeacherElement extends WebTimetableElementRef {
  element: WebTeacherInfo;
}

export interface Teacher {
  id: number;
  name: string;
  foreName: string;
  longName: string;
  foreColor?: string;
  backColor?: string;
  active?: boolean;
  dids?: any[];
  title?: string;
}

export interface Student {
  id: number;
  key: string;
  name: string;
  foreName: string;
  longName: string;
  gender: string;
}

export interface Room {
  active: boolean;
  building: string;
  id: number;
  longName: string;
  name: string;
  backColor?: string;
  foreColor?: string;
}

export interface Klasse {
  active: boolean;
  id: number;
  longName: string;
  name: string;
  teacher1?: number;
  teacher2?: number;
}

export interface Department {
  id: number;
  name: string;
  longName: string;
}

export interface Holiday {
  name: string;
  longName: string;
  id: number;
  startDate: number;
  endDate: number;
}

export interface ColorEntity {
  foreColor: string;
  backColor: string;
}

export interface LsEntity {
  ls?: ColorEntity | null;
  oh?: ColorEntity | null;
  sb?: ColorEntity | null;
  bs?: ColorEntity | null;
  ex?: ColorEntity | null;
}

export interface CodesEntity {
  cancelled?: ColorEntity | null;
  irregular?: ColorEntity | null;
}

export interface StatusData {
  lstypes: LsEntity[];
  codes: CodesEntity[];
}

export interface Absences {
  absences?: Absence[];
  absenceReasons?: Array<{
    id: number;
    name: string;
  }>;
  excuseStatuses?: boolean | null;
  showAbsenceReasonChange?: boolean;
  showCreateAbsence?: boolean;
}

export interface Absence {
  id: number;
  startDate: number;
  endDate: number;
  startTime: number;
  endTime: number;
  createDate: number;
  lastUpdate: number;
  createdUser: string;
  updatedUser: string;
  reasonId: number;
  reason: string;
  text: string;
  interruptions: [];
  canEdit: boolean;
  studentName: string;
  excuseStatus: string;
  isExcused: boolean;
  excuse: Excuse;
}

export interface Excuse {
  id: number;
  text: string;
  excuseDate: number;
  excuseStatus: string;
  isExcused: boolean;
  userId: number;
  username: string;
}
