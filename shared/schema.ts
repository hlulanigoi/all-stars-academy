import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("student"), // "teacher" or "student"
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(), // e.g. "Matric Student"
  content: text("content").notNull(),
  rating: serial("rating"), // 1-5
  image: text("image"), // Added for visual testimonials
});

export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size").notNull(), // in bytes
  fileType: text("file_type").notNull(), // e.g., "application/pdf"
  subject: text("subject").notNull(), // Mathematics, Physical Sciences, etc.
  grade: text("grade").notNull(), // 8, 9, 10, 11, 12
  uploadedBy: integer("uploaded_by").notNull(), // Foreign key to users.id
  createdAt: timestamp("created_at").defaultNow(),
});

export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  subject: text("subject").notNull(), // Mathematics, Physical Sciences, etc.
  grade: text("grade").notNull(), // 8, 9, 10, 11, 12
  dueDate: timestamp("due_date").notNull(),
  totalMarks: integer("total_marks").notNull().default(100),
  createdBy: integer("created_by").notNull(), // Foreign key to users.id (teacher)
  createdAt: timestamp("created_at").defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull(), // Foreign key to assignments.id
  studentId: integer("student_id").notNull(), // Foreign key to users.id
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size").notNull(), // in bytes
  fileType: text("file_type").notNull(),
  status: text("status").notNull().default("submitted"), // "submitted", "graded"
  marks: integer("marks"), // Null until graded
  feedback: text("feedback"), // Teacher's feedback
  submittedAt: timestamp("submitted_at").defaultNow(),
  gradedAt: timestamp("graded_at"),
});

export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["teacher", "student"], {
    errorMap: () => ({ message: "Role must be either teacher or student" })
  }),
}).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const insertContactSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
});

export const insertMaterialSchema = createInsertSchema(materials, {
  title: z.string().min(3, "Title must be at least 3 characters"),
  subject: z.enum(["Mathematics", "Physical Sciences", "English", "Life Sciences", "Accounting"], {
    errorMap: () => ({ message: "Invalid subject" })
  }),
  grade: z.enum(["8", "9", "10", "11", "12"], {
    errorMap: () => ({ message: "Grade must be between 8 and 12" })
  }),
}).omit({
  id: true,
  createdAt: true,
});

export const insertAssignmentSchema = createInsertSchema(assignments, {
  title: z.string().min(3, "Title must be at least 3 characters"),
  subject: z.enum(["Mathematics", "Physical Sciences", "English", "Life Sciences", "Accounting"], {
    errorMap: () => ({ message: "Invalid subject" })
  }),
  grade: z.enum(["8", "9", "10", "11", "12"], {
    errorMap: () => ({ message: "Grade must be between 8 and 12" })
  }),
  totalMarks: z.number().min(1, "Total marks must be at least 1").max(1000, "Total marks cannot exceed 1000"),
  dueDate: z.date(),
}).omit({
  id: true,
  createdAt: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions, {
  assignmentId: z.number(),
  studentId: z.number(),
}).omit({
  id: true,
  submittedAt: true,
  gradedAt: true,
});

export const gradeSubmissionSchema = z.object({
  marks: z.number().min(0, "Marks cannot be negative"),
  feedback: z.string().optional(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type Material = typeof materials.$inferSelect;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;

export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;

export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
