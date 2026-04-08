export type AssignmentStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "COMPLETED"
  | "EXPIRED";

export interface Assignment {
  assignmentId: number;
  status: AssignmentStatus;
  deadline: string;

  submission: {
    submissionId: number;
    location: string;
    area: number;
    description?: string;
  };
}