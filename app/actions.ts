"use server"

import { z } from "zod"

// Define the schema for form validation
const ProjectSchema = z.object({
  projectCode: z
    .string()
    .regex(/^[A-Z]{3}-[0-9]{3}$/, "Project code must be 3 uppercase letters, a hyphen, and 3 numbers (e.g., ABC-123)")
    .min(1, "Project code is required"),
  description: z.string().min(1, "Project description is required"),
  productLine: z.string().min(1, "Product line is required"),
  wantsNotifications: z.string(),
  notificationType: z.array(z.string()).optional(),
})

type FormState = {
  success: boolean
  errors?: {
    projectCode?: string
    description?: string
    productLine?: string
  }
  projectCode?: string
}

export async function saveProjectData(prevState: FormState, formData: FormData) {
  // Extract form data
  const rawFormData = {
    projectCode: formData.get("projectCode"),
    description: formData.get("description"),
    productLine: formData.get("productLine"),
    wantsNotifications: formData.get("wantsNotifications") || "no",
    notificationType: formData.getAll("notificationType"),
  }

  // Validate form data
  const validatedFields = ProjectSchema.safeParse(rawFormData)

  // If validation fails, return errors
  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors
    return {
      success: false,
      errors: {
        projectCode: errors.projectCode?.[0],
        description: errors.description?.[0],
        productLine: errors.productLine?.[0],
      },
    }
  }

  // Get the validated data
  const data = validatedFields.data

  try {
    // In a real application, you would save this data to a database
    // For example, using Prisma:
    // await prisma.project.create({
    //   data: {
    //     projectCode: data.projectCode,
    //     description: data.description,
    //     productLine: data.productLine,
    //     wantsNotifications: data.wantsNotifications === 'yes',
    //     notificationTypes: data.notificationType,
    //   },
    // })

    // For demonstration, we'll just log the data
    console.log("Saving project data:", data)

    // Simulate a database operation delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return success state with the project code for the thank you message
    return {
      success: true,
      projectCode: data.projectCode,
    }
  } catch (error) {
    console.error("Error saving project data:", error)
    return {
      success: false,
      errors: {
        projectCode: "Failed to save project data. Please try again.",
      },
    }
  }
}
