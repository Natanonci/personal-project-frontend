import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[0-9]{10,15}$/

export const registerSchema = z.object({
    identity: z.string().min(2, "Email or phone-number require")
        .refine(value => emailRegex.test(value) || mobileRegex.test(value), {
            message: 'identity must be email or phone number'
        }),
    userName: z.string().min(2, "username is required"),
    firstName: z.string().min(2, "Firstname is required"),
    lastName: z.string().min(2, "Lastname is required"),
    password: z.string().min(4, "Password at least 4 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine(data => data.password === data.confirmPassword, {
    message: 'ConfirmPassword must match password',
    path: ['confirmPassword']
})

export const loginSchema = z.object({
    identity: z.string().min(2, "Email or phone-number require")
        .refine(value => emailRegex.test(value) || mobileRegex.test(value), {
            message: 'identity must be email or phone number'
        }),
    password: z.string().min(4, "password at least 4 characters"),
})

export const editProfileSchema = z.object({
    identity: z.string().refine(value => emailRegex.test(value) || mobileRegex.test(value), "Email or Mobile phone required").optional(),
    firstName: z.string().min(2, "Firstname must be more than 2 characters").optional(),
    lastName: z.string().min(2, "Lastname must be more than 2 characters").optional(),
    phone_number: z.string().refine(value => mobileRegex.test(value), "Phone number must be 10-15 digits").optional(),
    profile_image: z.string().min(1, "profile_image cannot be empty").optional(),
}).transform(data => ({
    ...(data.identity && { [identityKey(data.identity)]: data.identity }),
    ...(data.firstName && { firstName: data.firstName }),
    ...(data.lastName && { lastName: data.lastName }),
    ...(data.phone_number && { phone_number: data.phone_number }),
    ...(data.profile_image && { profile_image: data.profile_image }),
}))