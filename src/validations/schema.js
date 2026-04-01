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

export const reservationSchema = z.object({
    storeId: z.string().min(1, "กรุณาเลือกร้านที่ต้องการจอง"),
    start_date: z.string().min(1, "กรุณาระบุวันและเวลาเริ่มต้น"),
    end_date: z.string().min(1, "กรุณาระบุวันและเวลาสิ้นสุด"),
    total_guest: z.string().min(1, "กรุณาระบุจำนวนสัตว์เลี้ยง/ผู้เข้าใช้บริการ"),
    price: z.string().min(1, "กรุณาระบุราคา"),
}).transform(data => ({
    storeId: Number(data.storeId), 
    start_date: new Date(data.start_date).toISOString(), 
    end_date: new Date(data.end_date).toISOString(),
    total_guest: Number(data.total_guest), 
    price: Number(data.price) 
}));