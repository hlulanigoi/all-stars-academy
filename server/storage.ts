import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import {
  contactSubmissions,
  testimonials,
  users,
  materials,
  assignments,
  submissions,
  type ContactSubmission,
  type InsertContactSubmission,
  type Testimonial,
  type InsertTestimonial,
  type User,
  type InsertUser,
  type Material,
  type InsertMaterial,
  type Assignment,
  type InsertAssignment,
  type Submission,
  type InsertSubmission,
} from "@shared/schema";

export interface IStorage {
  // User methods
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  
  // Contact methods
  createContactSubmission(
    submission: InsertContactSubmission,
  ): Promise<ContactSubmission>;
  
  // Testimonial methods
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Material methods
  createMaterial(material: InsertMaterial): Promise<Material>;
  getMaterials(): Promise<Material[]>;
  getMaterialById(id: number): Promise<Material | undefined>;
  deleteMaterial(id: number): Promise<void>;
  
  // Assignment methods
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  getAssignments(): Promise<Assignment[]>;
  getAssignmentById(id: number): Promise<Assignment | undefined>;
  deleteAssignment(id: number): Promise<void>;
  
  // Submission methods
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissionsByAssignment(assignmentId: number): Promise<any[]>;
  getSubmissionsByStudent(studentId: number): Promise<any[]>;
  getSubmissionById(id: number): Promise<Submission | undefined>;
  gradeSubmission(id: number, marks: number, feedback?: string): Promise<Submission>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async createUser(user: InsertUser): Promise<User> {
    const [result] = await db.insert(users).values(user).returning();
    return result;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  // Contact methods
  async createContactSubmission(
    submission: InsertContactSubmission,
  ): Promise<ContactSubmission> {
    const [result] = await db
      .insert(contactSubmissions)
      .values(submission)
      .returning();
    return result;
  }

  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [result] = await db
      .insert(testimonials)
      .values(testimonial)
      .returning();
    return result;
  }

  // Material methods
  async createMaterial(material: InsertMaterial): Promise<Material> {
    const [result] = await db
      .insert(materials)
      .values(material)
      .returning();
    return result;
  }

  async getMaterials(): Promise<Material[]> {
    return await db.select().from(materials).orderBy(desc(materials.createdAt));
  }

  async getMaterialById(id: number): Promise<Material | undefined> {
    const [material] = await db.select().from(materials).where(eq(materials.id, id));
    return material;
  }

  async deleteMaterial(id: number): Promise<void> {
    await db.delete(materials).where(eq(materials.id, id));
  }

  // Assignment methods
  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const [result] = await db
      .insert(assignments)
      .values(assignment)
      .returning();
    return result;
  }

  async getAssignments(): Promise<Assignment[]> {
    return await db.select().from(assignments).orderBy(desc(assignments.createdAt));
  }

  async getAssignmentById(id: number): Promise<Assignment | undefined> {
    const [assignment] = await db.select().from(assignments).where(eq(assignments.id, id));
    return assignment;
  }

  async deleteAssignment(id: number): Promise<void> {
    // Delete all submissions for this assignment first
    await db.delete(submissions).where(eq(submissions.assignmentId, id));
    // Then delete the assignment
    await db.delete(assignments).where(eq(assignments.id, id));
  }

  // Submission methods
  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [result] = await db
      .insert(submissions)
      .values(submission)
      .returning();
    return result;
  }

  async getSubmissionsByAssignment(assignmentId: number): Promise<any[]> {
    // Join with users to get student info
    const results = await db
      .select({
        id: submissions.id,
        assignmentId: submissions.assignmentId,
        studentId: submissions.studentId,
        studentName: users.name,
        studentEmail: users.email,
        fileName: submissions.fileName,
        filePath: submissions.filePath,
        fileSize: submissions.fileSize,
        fileType: submissions.fileType,
        status: submissions.status,
        marks: submissions.marks,
        feedback: submissions.feedback,
        submittedAt: submissions.submittedAt,
        gradedAt: submissions.gradedAt,
      })
      .from(submissions)
      .innerJoin(users, eq(submissions.studentId, users.id))
      .where(eq(submissions.assignmentId, assignmentId))
      .orderBy(desc(submissions.submittedAt));
    return results;
  }

  async getSubmissionsByStudent(studentId: number): Promise<any[]> {
    // Join with assignments to get assignment info
    const results = await db
      .select({
        id: submissions.id,
        assignmentId: submissions.assignmentId,
        assignmentTitle: assignments.title,
        assignmentDescription: assignments.description,
        subject: assignments.subject,
        grade: assignments.grade,
        dueDate: assignments.dueDate,
        totalMarks: assignments.totalMarks,
        studentId: submissions.studentId,
        fileName: submissions.fileName,
        filePath: submissions.filePath,
        fileSize: submissions.fileSize,
        fileType: submissions.fileType,
        status: submissions.status,
        marks: submissions.marks,
        feedback: submissions.feedback,
        submittedAt: submissions.submittedAt,
        gradedAt: submissions.gradedAt,
      })
      .from(submissions)
      .innerJoin(assignments, eq(submissions.assignmentId, assignments.id))
      .where(eq(submissions.studentId, studentId))
      .orderBy(desc(submissions.submittedAt));
    return results;
  }

  async getSubmissionById(id: number): Promise<Submission | undefined> {
    const [submission] = await db.select().from(submissions).where(eq(submissions.id, id));
    return submission;
  }

  async gradeSubmission(id: number, marks: number, feedback?: string): Promise<Submission> {
    const [result] = await db
      .update(submissions)
      .set({
        marks,
        feedback,
        status: "graded",
        gradedAt: new Date(),
      })
      .where(eq(submissions.id, id))
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
