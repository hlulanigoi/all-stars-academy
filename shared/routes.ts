import { z } from "zod";
import { insertContactSchema, contactSubmissions, testimonials, insertUserSchema, loginSchema, insertMaterialSchema, materials, insertAssignmentSchema, assignments, insertSubmissionSchema, submissions, gradeSubmissionSchema } from "./schema";

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
            role: z.string(),
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
            role: z.string(),
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
            role: z.string(),
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
  materials: {
    create: {
      method: "POST" as const,
      path: "/api/materials",
      input: insertMaterialSchema,
      responses: {
        201: z.custom<typeof materials.$inferSelect>(),
        400: errorSchemas.validation,
        401: z.object({ message: z.string() }),
        403: z.object({ message: z.string() }),
      },
    },
    list: {
      method: "GET" as const,
      path: "/api/materials",
      responses: {
        200: z.array(z.custom<typeof materials.$inferSelect>()),
        401: z.object({ message: z.string() }),
      },
    },
    download: {
      method: "GET" as const,
      path: "/api/materials/:id/download",
      responses: {
        200: z.any(), // File download
        401: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/materials/:id",
      responses: {
        200: z.object({ message: z.string() }),
        401: z.object({ message: z.string() }),
        403: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
  },
  assignments: {
    create: {
      method: "POST" as const,
      path: "/api/assignments",
      input: insertAssignmentSchema,
      responses: {
        201: z.custom<typeof assignments.$inferSelect>(),
        400: errorSchemas.validation,
        401: z.object({ message: z.string() }),
        403: z.object({ message: z.string() }),
      },
    },
    list: {
      method: "GET" as const,
      path: "/api/assignments",
      responses: {
        200: z.array(z.custom<typeof assignments.$inferSelect>()),
        401: z.object({ message: z.string() }),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/assignments/:id",
      responses: {
        200: z.custom<typeof assignments.$inferSelect>(),
        401: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/assignments/:id",
      responses: {
        200: z.object({ message: z.string() }),
        401: z.object({ message: z.string() }),
        403: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
  },
  submissions: {
    create: {
      method: "POST" as const,
      path: "/api/assignments/:assignmentId/submissions",
      input: insertSubmissionSchema,
      responses: {
        201: z.custom<typeof submissions.$inferSelect>(),
        400: errorSchemas.validation,
        401: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
    listByAssignment: {
      method: "GET" as const,
      path: "/api/assignments/:assignmentId/submissions",
      responses: {
        200: z.array(z.any()), // Will include student info
        401: z.object({ message: z.string() }),
        403: z.object({ message: z.string() }),
      },
    },
    listByStudent: {
      method: "GET" as const,
      path: "/api/submissions/my",
      responses: {
        200: z.array(z.any()), // Will include assignment info
        401: z.object({ message: z.string() }),
      },
    },
    download: {
      method: "GET" as const,
      path: "/api/submissions/:id/download",
      responses: {
        200: z.any(), // File download
        401: z.object({ message: z.string() }),
        403: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
    grade: {
      method: "PUT" as const,
      path: "/api/submissions/:id/grade",
      input: gradeSubmissionSchema,
      responses: {
        200: z.custom<typeof submissions.$inferSelect>(),
        400: errorSchemas.validation,
        401: z.object({ message: z.string() }),
        403: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
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
