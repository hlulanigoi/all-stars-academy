import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertContactSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // Contact Form
  app.post(api.contact.submit.path, async (req, res) => {
    try {
      const input = insertContactSchema.parse(req.body);
      const submission = await storage.createContactSubmission(input);
      res.status(201).json(submission);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Testimonials
  app.get(api.testimonials.list.path, async (req, res) => {
    const testimonials = await storage.getTestimonials();
    res.json(testimonials);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getTestimonials();
  if (existing.length === 0) {
    const seeds = [
      {
        name: "Thabo M.",
        role: "Grade 12 Student",
        content:
          "The extra classes helped me jump from 40% to 80% in Mathematics. The teachers are amazing!",
        rating: 5,
        image: "/assets/stock_images/smiling_high_school__6f94400c.jpg",
      },
      {
        name: "Lerato K.",
        role: "Matric Rewrite",
        content:
          "I passed my matric rewrite with distinction thanks to All Stars Excellency Academy.",
        rating: 5,
        image: "/assets/stock_images/smiling_high_school__93c08cc1.jpg",
      },
      {
        name: "Mrs. Dlamini",
        role: "Parent",
        content:
          "Best decision we made for our son. His confidence in Physical Sciences has soared.",
        rating: 5,
        image: "/assets/stock_images/smiling_high_school__a55cba15.jpg",
      },
    ];

    for (const seed of seeds) {
      await storage.createTestimonial(seed);
    }
  }
}
