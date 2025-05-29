"use server"

import { z } from "zod"

// Define the form data schema
const projectSchema = z.object({
  projectCode: z.string().regex(/^[A-Z]{3}-[0-9]{3}$/, {
    message: "Project code must be 3 uppercase letters, a hyphen, and 3 numbers (e.g., ABC-123)"
  }),
  description: z.string().min(10, "Description must be at least 10 characters"),
  productLine: z.enum(["iPhone", "iPad", "Mac", "Vision Pro", "Other"]),
  wantsNotifications: z.enum(["yes", "no"]),
  notificationType: z.array(z.enum(["all", "daily", "weekly"])).optional()
})

export type FormState = {
  success: boolean
  errors?: {
    projectCode?: string
    description?: string
    productLine?: string
  }
  projectCode?: string
}

export async function saveProjectData(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    // Parse and validate the form data
    const rawData = {
      projectCode: formData.get('projectCode'),
      description: formData.get('description'),
      productLine: formData.get('productLine'),
      wantsNotifications: formData.get('wantsNotifications'),
      notificationType: formData.getAll('notificationType')
    }

    const validatedData = projectSchema.parse(rawData)

    // Call the NestJS API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    })

    if (!response.ok) {
      throw new Error('Failed to save project data')
    }

    return {
      success: true,
      projectCode: validatedData.projectCode
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: {
          projectCode: error.errors.find(e => e.path[0] === 'projectCode')?.message,
          description: error.errors.find(e => e.path[0] === 'description')?.message,
          productLine: error.errors.find(e => e.path[0] === 'productLine')?.message,
        }
      }
    }

    return {
      success: false,
      errors: {
        projectCode: 'An unexpected error occurred'
      }
    }
  }
}
