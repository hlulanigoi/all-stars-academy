import { db } from "./db";
import {
  contactSubmissions,
  testimonials,
  type ContactSubmission,
  type InsertContactSubmission,
  type Testimonial,
  type InsertTestimonial,
} from "@shared/schema";

export interface IStorage {
  createContactSubmission(
    submission: InsertContactSubmission,
  ): Promise<ContactSubmission>;
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
}

export class DatabaseStorage implements IStorage {
  async createContactSubmission(
    submission: InsertContactSubmission,
  ): Promise<ContactSubmission> {
    const [result] = await db
      .insert(contactSubmissions)
      .values(submission)
      .returning();
    return result;
  }

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
}

export const storage = new DatabaseStorage();
