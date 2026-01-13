import { z } from "zod";
import { insertContactSchema, contactSubmissions, testimonials, insertUserSchema, loginSchema } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: "POST" as const,
      path: "/api/auth/register",
      input: insertUserSchema,
      responses: {
        201: z.object({
          user: z.object({
            id: z.number(),
            name: z.string(),
            email: z.string(),
          }),
          token: z.string(),
        }),
        400: errorSchemas.validation,
        409: z.object({ message: z.string() }),
      },
    },
    login: {
      method: "POST" as const,
      path: "/api/auth/login",
      input: loginSchema,
      responses: {
        200: z.object({
          user: z.object({
            id: z.number(),
            name: z.string(),
            email: z.string(),
          }),
          token: z.string(),
        }),
        400: errorSchemas.validation,
        401: z.object({ message: z.string() }),
      },
    },
    verify: {
      method: "GET" as const,
      path: "/api/auth/verify",
      responses: {
        200: z.object({
          user: z.object({
            id: z.number(),
            name: z.string(),
            email: z.string(),
          }),
        }),
        401: z.object({ message: z.string() }),
      },
    },
    logout: {
      method: "POST" as const,
      path: "/api/auth/logout",
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
  },
  contact: {
    submit: {
      method: "POST" as const,
      path: "/api/contact",
      input: insertContactSchema,
      responses: {
        201: z.custom<typeof contactSubmissions.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  testimonials: {
    list: {
      method: "GET" as const,
      path: "/api/testimonials",
      responses: {
        200: z.array(z.custom<typeof testimonials.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
