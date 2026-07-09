'use client';

import React, { useState } from 'react'
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form"

import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from 'lucide-react'

interface CustomInputProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  placeholder: string
  type?: string
  autoComplete?: string
}

const CustomInput = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
}: CustomInputProps<TFieldValues>) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="form-item">
          <FieldLabel htmlFor={field.name} className="form-label">
            {label}
          </FieldLabel>
          <div className="flex w-full flex-col">
            <div className="relative">
              <Input
                {...field}
                id={field.name}
                type={isPassword ? (showPassword ? "text" : "password") : type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                aria-invalid={fieldState.invalid}
                className="input-class"
              />
              {isPassword && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              )}
            </div>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} className="form-message mt-2" />
            )}
          </div>
        </Field>
      )}
    />
  )
}

export default CustomInput