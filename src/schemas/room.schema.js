import { z } from "zod";

export const createRoomSchema = z.object({
  roomName: z.string({
    required_error: "Name is required",
  }),
  roomDescription: z.string({
    required_error: "Description must be a string",
  }),
  //date: z.string().datetime().optional(),
});
