import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertContactSchema, insertUserSchema, loginSchema, insertMaterialSchema, insertAssignmentSchema, gradeSubmissionSchema } from "@shared/schema";
import { generateToken, authenticateToken, requireRole, type AuthRequest } from "./middleware/auth";
import { upload } from "./middleware/upload";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // Authentication Routes
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(input.email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...input,
        password: hashedPassword,
      });

      // Generate token
      const token = generateToken(user.id);

      res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
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

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByEmail(input.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(input.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate token
      const token = generateToken(user.id);

      res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
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

  app.get(api.auth.verify.path, authenticateToken, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUserById(req.userId!);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    // With JWT, logout is handled client-side by removing the token
    res.status(200).json({ message: "Logged out successfully" });
  });

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

  // Materials Routes
  // Upload material (teachers only)
  app.post(
    api.materials.create.path,
    authenticateToken,
    requireRole("teacher"),
    upload.single("file"),
    async (req: AuthRequest, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        const { title, description, subject, grade } = req.body;

        // Validate input
        const materialData = insertMaterialSchema.parse({
          title,
          description: description || null,
          fileName: req.file.originalname,
          filePath: req.file.path,
          fileSize: req.file.size,
          fileType: req.file.mimetype,
          subject,
          grade,
          uploadedBy: req.userId!,
        });

        const material = await storage.createMaterial(materialData);
        res.status(201).json(material);
      } catch (err) {
        // Delete uploaded file if there's an error
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        
        if (err instanceof z.ZodError) {
          return res.status(400).json({
            message: err.errors[0].message,
            field: err.errors[0].path.join("."),
          });
        }
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Get all materials (authenticated users)
  app.get(api.materials.list.path, authenticateToken, async (req: AuthRequest, res) => {
    try {
      const materials = await storage.getMaterials();
      res.json(materials);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Download material file (authenticated users)
  app.get(api.materials.download.path, authenticateToken, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const material = await storage.getMaterialById(id);

      if (!material) {
        return res.status(404).json({ message: "Material not found" });
      }

      const filePath = path.resolve(material.filePath);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }

      res.download(filePath, material.fileName);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete material (teachers only)
  app.delete(
    api.materials.delete.path,
    authenticateToken,
    requireRole("teacher"),
    async (req: AuthRequest, res) => {
      try {
        const id = parseInt(req.params.id);
        const material = await storage.getMaterialById(id);

        if (!material) {
          return res.status(404).json({ message: "Material not found" });
        }

        // Delete file from filesystem
        const filePath = path.resolve(material.filePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        // Delete from database
        await storage.deleteMaterial(id);
        res.status(200).json({ message: "Material deleted successfully" });
      } catch (err) {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Assignment Routes
  // Create assignment (teachers only)
  app.post(
    api.assignments.create.path,
    authenticateToken,
    requireRole("teacher"),
    async (req: AuthRequest, res) => {
      try {
        const input = insertAssignmentSchema.parse({
          ...req.body,
          dueDate: new Date(req.body.dueDate),
          createdBy: req.userId!,
        });

        const assignment = await storage.createAssignment(input);
        res.status(201).json(assignment);
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({
            message: err.errors[0].message,
            field: err.errors[0].path.join("."),
          });
        }
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Get all assignments (authenticated users)
  app.get(api.assignments.list.path, authenticateToken, async (req: AuthRequest, res) => {
    try {
      const assignments = await storage.getAssignments();
      res.json(assignments);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get single assignment (authenticated users)
  app.get(api.assignments.get.path, authenticateToken, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const assignment = await storage.getAssignmentById(id);

      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      res.json(assignment);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete assignment (teachers only)
  app.delete(
    api.assignments.delete.path,
    authenticateToken,
    requireRole("teacher"),
    async (req: AuthRequest, res) => {
      try {
        const id = parseInt(req.params.id);
        const assignment = await storage.getAssignmentById(id);

        if (!assignment) {
          return res.status(404).json({ message: "Assignment not found" });
        }

        await storage.deleteAssignment(id);
        res.status(200).json({ message: "Assignment deleted successfully" });
      } catch (err) {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Submission Routes
  // Submit assignment (students only)
  app.post(
    api.submissions.create.path,
    authenticateToken,
    requireRole("student"),
    upload.single("file"),
    async (req: AuthRequest, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        const assignmentId = parseInt(req.params.assignmentId);
        
        // Check if assignment exists
        const assignment = await storage.getAssignmentById(assignmentId);
        if (!assignment) {
          if (req.file) fs.unlinkSync(req.file.path);
          return res.status(404).json({ message: "Assignment not found" });
        }

        const submissionData = {
          assignmentId,
          studentId: req.userId!,
          fileName: req.file.originalname,
          filePath: req.file.path,
          fileSize: req.file.size,
          fileType: req.file.mimetype,
          status: "submitted",
          marks: null,
          feedback: null,
        };

        const submission = await storage.createSubmission(submissionData);
        res.status(201).json(submission);
      } catch (err) {
        // Delete uploaded file if there's an error
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        
        if (err instanceof z.ZodError) {
          return res.status(400).json({
            message: err.errors[0].message,
            field: err.errors[0].path.join("."),
          });
        }
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Get submissions for an assignment (teachers only)
  app.get(
    api.submissions.listByAssignment.path,
    authenticateToken,
    requireRole("teacher"),
    async (req: AuthRequest, res) => {
      try {
        const assignmentId = parseInt(req.params.assignmentId);
        const submissions = await storage.getSubmissionsByAssignment(assignmentId);
        res.json(submissions);
      } catch (err) {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Get my submissions (students only)
  app.get(
    api.submissions.listByStudent.path,
    authenticateToken,
    requireRole("student"),
    async (req: AuthRequest, res) => {
      try {
        const submissions = await storage.getSubmissionsByStudent(req.userId!);
        res.json(submissions);
      } catch (err) {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Download submission file (authenticated users)
  app.get(api.submissions.download.path, authenticateToken, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const submission = await storage.getSubmissionById(id);

      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }

      // Check authorization: teachers can download any, students only their own
      const user = await storage.getUserById(req.userId!);
      if (user?.role === "student" && submission.studentId !== req.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const filePath = path.resolve(submission.filePath);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }

      res.download(filePath, submission.fileName);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Grade submission (teachers only)
  app.put(
    api.submissions.grade.path,
    authenticateToken,
    requireRole("teacher"),
    async (req: AuthRequest, res) => {
      try {
        const id = parseInt(req.params.id);
        const { marks, feedback } = gradeSubmissionSchema.parse(req.body);

        const submission = await storage.getSubmissionById(id);
        if (!submission) {
          return res.status(404).json({ message: "Submission not found" });
        }

        // Validate marks don't exceed total marks
        const assignment = await storage.getAssignmentById(submission.assignmentId);
        if (assignment && marks > assignment.totalMarks) {
          return res.status(400).json({
            message: `Marks cannot exceed total marks (${assignment.totalMarks})`,
          });
        }

        const gradedSubmission = await storage.gradeSubmission(id, marks, feedback);
        res.json(gradedSubmission);
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({
            message: err.errors[0].message,
            field: err.errors[0].path.join("."),
          });
        }
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

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
