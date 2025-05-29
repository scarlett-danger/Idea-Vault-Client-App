"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { saveProjectData } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Sparkles, Apple, Check, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProjectForm() {
  const [wantsNotifications, setWantsNotifications] = useState<string>("no")
  const [productLine, setProductLine] = useState<string>("")
  const [formState, formAction, isPending] = useActionState(saveProjectData, {
    success: false,
    errors: {},
    projectCode: "",
  })

  // Field-level validation states
  const [projectCode, setProjectCode] = useState("")
  const [description, setDescription] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{
    projectCode?: string
    description?: string
    productLine?: string
  }>({})
  const [fieldValid, setFieldValid] = useState<{
    projectCode?: boolean
    description?: boolean
    productLine?: boolean
  }>({})

  // Validation functions
  const validateProjectCode = (value: string) => {
    const regex = /^[A-Z]{3}-[0-9]{3}$/
    if (!value) {
      return { isValid: false, error: "Project code is required" }
    }
    if (!regex.test(value)) {
      return {
        isValid: false,
        error: "Project code must be 3 uppercase letters, a hyphen, and 3 numbers (e.g., ABC-123)",
      }
    }
    return { isValid: true, error: "" }
  }

  const validateDescription = (value: string) => {
    if (!value.trim()) {
      return { isValid: false, error: "Project description is required" }
    }
    if (value.trim().length < 10) {
      return { isValid: false, error: "Description must be at least 10 characters" }
    }
    return { isValid: true, error: "" }
  }

  const validateProductLine = (value: string) => {
    if (!value) {
      return { isValid: false, error: "Product line is required" }
    }
    return { isValid: true, error: "" }
  }

  // Real-time validation handlers
  const handleProjectCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    setProjectCode(value)

    const validation = validateProjectCode(value)
    setFieldErrors((prev) => ({ ...prev, projectCode: validation.error }))
    setFieldValid((prev) => ({ ...prev, projectCode: validation.isValid }))
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setDescription(value)

    const validation = validateDescription(value)
    setFieldErrors((prev) => ({ ...prev, description: validation.error }))
    setFieldValid((prev) => ({ ...prev, description: validation.isValid }))
  }

  const handleProductLineChange = (value: string) => {
    setProductLine(value)

    const validation = validateProductLine(value)
    setFieldErrors((prev) => ({ ...prev, productLine: validation.error }))
    setFieldValid((prev) => ({ ...prev, productLine: validation.isValid }))
  }

  const handleNotificationChange = (value: string) => {
    setWantsNotifications(value)
  }

  // Clear field-level errors when server errors come in
  useEffect(() => {
    if (formState.errors && Object.keys(formState.errors).length > 0) {
      setFieldErrors(formState.errors)
    }
  }, [formState.errors])

  const getFieldBorderClass = (fieldName: keyof typeof fieldValid) => {
    if (fieldValid[fieldName] === true) {
      return "border-green-300 focus:border-green-500 focus:ring-green-500"
    }
    if (fieldErrors[fieldName]) {
      return "border-rose-300 focus:border-rose-500 focus:ring-rose-500"
    }
    return "border-pink-200 focus:border-pink-500 focus:ring-pink-500"
  }

  const getValidationIcon = (fieldName: keyof typeof fieldValid) => {
    if (fieldValid[fieldName] === true) {
      return <Check className="w-5 h-5 text-green-500" />
    }
    if (fieldErrors[fieldName]) {
      return <X className="w-5 h-5 text-rose-500" />
    }
    return null
  }

  return (
    <div className="space-y-8">
      {formState.success ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 p-8 md:p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank you!</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
              Thank you for sending us this important information about{" "}
              <span className="font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                {formState.projectCode}
              </span>
              !
            </p>

            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 mb-8 border border-pink-200">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Apple className="w-6 h-6 text-red-600" />
                <span className="text-lg font-semibold text-gray-900">Special Gift</span>
                <Sparkles className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-gray-700 mb-4">As a thank you, enjoy 3 months of Apple Music on us!</p>
              <a
                href="https://www.apple.com/apple-music/"
                className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Apple className="w-5 h-5" />
                Claim Your Free Apple Music
                <Sparkles className="w-5 h-5" />
              </a>
            </div>

            <Button
              onClick={() => window.location.reload()}
              className="bg-black hover:from-pink-600 hover:to-rose-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Submit Another Project
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Submission</h2>
            <p className="text-gray-600">Tell us about your innovative idea</p>
          </div>

          <form action={formAction} className="space-y-8">
            {/* Project Code Section */}
            <div className="space-y-3">
              <Label htmlFor="projectCode" className="text-base font-semibold text-gray-900">
                Project Code <span className="text-rose-500">*</span>
              </Label>
              <div className="relative max-w-[200px]">
                <Input
                  id="projectCode"
                  name="projectCode"
                  value={projectCode}
                  onChange={handleProjectCodeChange}
                  placeholder="ABC-123"
                  required
                  className={`h-12 text-base rounded-xl pr-12 ${getFieldBorderClass("projectCode")}`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getValidationIcon("projectCode")}
                </div>
              </div>
              <p className="text-sm text-gray-500">Format: 3 uppercase letters, hyphen, 3 numbers (e.g., ABC-123)</p>
              {fieldErrors.projectCode && (
                <Alert className="bg-rose-50 border-rose-200 text-rose-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{fieldErrors.projectCode}</AlertDescription>
                </Alert>
              )}
              {fieldValid.projectCode && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <Check className="w-4 h-4" />
                  <span>Valid project code format</span>
                </div>
              )}
            </div>

            {/* Project Description */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-base font-semibold text-gray-900">
                Project Description <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <Textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Describe your innovative project idea..."
                  required
                  className={`h-[100px] text-base rounded-xl resize-none ${getFieldBorderClass("description")}`}
                />
                <div className="absolute right-3 top-3">{getValidationIcon("description")}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">{description.length}/10 characters minimum</div>
                {fieldValid.description && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <Check className="w-4 h-4" />
                    <span>Good description length</span>
                  </div>
                )}
              </div>
              {fieldErrors.description && (
                <Alert className="bg-rose-50 border-rose-200 text-rose-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{fieldErrors.description}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Product Line */}
            <div className="space-y-3">
              <Label htmlFor="productLine" className="text-base font-semibold text-gray-900">
                Product Line <span className="text-rose-500">*</span>
              </Label>
              <div className="relative max-w-[350px]">
                <Select name="productLine" required value={productLine} onValueChange={handleProductLineChange}>
                  <SelectTrigger className={`h-12 text-base rounded-xl pr-12 ${getFieldBorderClass("productLine")}`}>
                    <SelectValue placeholder="Select a product line" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="iPhone" className="text-base py-3">
                      📱 iPhone
                    </SelectItem>
                    <SelectItem value="iPad" className="text-base py-3">
                      📱 iPad
                    </SelectItem>
                    <SelectItem value="Mac" className="text-base py-3">
                      💻 Mac
                    </SelectItem>
                    <SelectItem value="Vision Pro" className="text-base py-3">
                      🥽 Vision Pro
                    </SelectItem>
                    <SelectItem value="Other" className="text-base py-3">
                      🚀 Other
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="absolute right-10 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  {getValidationIcon("productLine")}
                </div>
              </div>
              {fieldErrors.productLine && (
                <Alert className="bg-rose-50 border-rose-200 text-rose-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{fieldErrors.productLine}</AlertDescription>
                </Alert>
              )}
              {fieldValid.productLine && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <Check className="w-4 h-4" />
                  <span>Product line selected</span>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="space-y-4">
              <Label className="text-base font-semibold text-gray-900">
                Would you like to receive updates from Tim Cook?
              </Label>
              <RadioGroup
                name="wantsNotifications"
                value={wantsNotifications}
                onValueChange={handleNotificationChange}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="flex items-center space-x-3 bg-pink-50 p-4 rounded-xl border border-pink-200 hover:border-pink-300 transition-colors flex-1">
                  <RadioGroupItem value="yes" id="notifications-yes" className="text-pink-600" />
                  <Label htmlFor="notifications-yes" className="text-base font-medium cursor-pointer">
                    Yes, keep me updated
                  </Label>
                </div>
                <div className="flex items-center space-x-3 bg-pink-50 p-4 rounded-xl border border-pink-200 hover:border-pink-300 transition-colors flex-1">
                  <RadioGroupItem value="no" id="notifications-no" className="text-pink-600" />
                  <Label htmlFor="notifications-no" className="text-base font-medium cursor-pointer">
                    No, thank you
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {wantsNotifications === "yes" && (
              <div className="space-y-4 animate-in slide-in-from-top duration-500">
                <Label className="text-base font-semibold text-gray-900">Choose your notification preferences:</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 bg-rose-50 p-4 rounded-xl border border-rose-200">
                    <Checkbox id="all-notifications" name="notificationType" value="all" className="text-rose-600" />
                    <Label htmlFor="all-notifications" className="text-sm font-medium cursor-pointer">
                      All notifications
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 bg-rose-50 p-4 rounded-xl border border-rose-200">
                    <Checkbox id="daily-digest" name="notificationType" value="daily" className="text-rose-600" />
                    <Label htmlFor="daily-digest" className="text-sm font-medium cursor-pointer">
                      Daily digest
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 bg-rose-50 p-4 rounded-xl border border-rose-200">
                    <Checkbox id="weekly-digest" name="notificationType" value="weekly" className="text-rose-600" />
                    <Label htmlFor="weekly-digest" className="text-sm font-medium cursor-pointer">
                      Weekly digest
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                className="w-full bg-black hover:from-black-600 hover:to-black-700 text-white h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Project"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
