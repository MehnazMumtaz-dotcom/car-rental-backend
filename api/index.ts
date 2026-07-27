export const ROLES = {
  ADMIN: "ADMIN",
  SUB_ADMIN: "SUB_ADMIN",
} as const;


export const ADMIN_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export const CUSTOMER_STATUS = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  FLAGGED: "FLAGGED",
} as const;

export const BOOKING_STATUS = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const BOOKING_SOURCE = {
  WALK_IN: "WALK_IN",
  ONLINE: "ONLINE",
} as const;


export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PARTIAL: "PARTIAL",
  PAID: "PAID",
} as const;

export const PAYMENT_METHOD = {
  CASH: "CASH",
  CARD: "CARD",
  ONLINE: "ONLINE",
} as const;


export const COMPLAINT_CATEGORY = {
  BILLING: "BILLING",
  VEHICLE_ISSUE: "VEHICLE_ISSUE",
  DRIVER_BEHAVIOR: "DRIVER_BEHAVIOR",
  BOOKING_ERROR: "BOOKING_ERROR",
  OTHER: "OTHER",
} as const;

export const COMPLAINT_PRIORITY = {
  STANDARD: "STANDARD",
  URGENT: "URGENT",
} as const;

export const COMPLAINT_STATUS = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  ESCALATED: "ESCALATED",
} as const;



export const COMMISSION_TYPE = {
  FLAT: "FLAT",
  PERCENTAGE: "PERCENTAGE",
  HYBRID: "HYBRID",
} as const;


export const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";
export const JWT_EXPIRES_IN = "7d";


export const MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  INVALID_CREDENTIALS: "Invalid email or password",
  UNAUTHORIZED: "Unauthorized access",
  USER_CREATED: "User created successfully",
  USER_NOT_FOUND: "User not found",
};


export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};