/**
 * Interviews & schedule API (mock).
 */
import type {
  ApiResponse,
  InterviewQuestion,
  InterviewSlot,
} from "@/types";
import { delay } from "@/utils/format";
import { MOCK_INTERVIEW_QUESTIONS, MOCK_SCHEDULE } from "./mock-data";

export async function getInterviewSchedule(): Promise<
  ApiResponse<InterviewSlot[]>
> {
  await delay(300);
  return { success: true, data: MOCK_SCHEDULE };
}

export async function getInterviewQuestions(): Promise<
  ApiResponse<InterviewQuestion[]>
> {
  await delay(300);
  return { success: true, data: MOCK_INTERVIEW_QUESTIONS };
}
