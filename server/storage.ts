import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import {
  contactSubmissions,
  testimonials,
  users,
  materials,
  type ContactSubmission,
  type InsertContactSubmission,
  type Testimonial,
  type InsertTestimonial,
  type User,
  type InsertUser,
  type Material,
  type InsertMaterial,
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
}

export const storage = new DatabaseStorage();
