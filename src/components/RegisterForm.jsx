import { apiRegister, mainApi } from "../api/mainApi.js"
import { registerSchema } from "../validations/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import { toast, Slide, ToastContainer } from "react-toastify"

function RegisterForm() {
    const { register, handleSubmit, formState, reset } = useForm({
        resolver: zodResolver(registerSchema),
        mode: 'onSubmit',
        defaultValues: {
            userName: '', firstName: '', lastName: '', identity: '', password: '', confirmPassword: '',
        }
    })

    const { errors, isSubmitting } = formState

    const onSubmit = async (data) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            const resp = await mainApi.post('/api/auth/register', data)

            toast.success(resp.data.message, { transition: Slide, position: "bottom-right", })
            document.getElementById('register-form').close()
            reset()
        } catch (err) {
            console.dir(errors)
            const errMsg = err.response?.data.message || err.message
            toast.error(errMsg, { transition: Slide, containerId: 'register-modal', position: 'top-center', style: { width: "200px", fontSize: "13px", padding: "8px" } })
        }
    }

    return (

        <>

            <div className="bg-[#FEF5EB] p-8 md:p-10 rounded-[30px] shadow-[0_20px_60px_rgba(216,166,123,0.55)] w-full max-w-112.5 relative mx-auto">

                <ToastContainer containerId={'register-modal'} />
                <form method="dialog">

                    {/* X Button */}
                    <button
                        className="absolute right-6 top-6 text-gray-400 hover:text-gray-800 transition text-xl font-bold"
                        onClick={() => reset()}>✕</button>
                </form>

                <div className="text-[#4A3F35] text-3xl text-center opacity-70 font-bold">
                    Create a new account {isSubmitting && <span className="loading loading-dots loading-xl"></span>}
                </div>
                <div className="bg-amber-500 divider opacity-20 rounded-4xl"></div>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <fieldset disabled={isSubmitting} className='flex flex-col gap-4 mt-2'>

                        {/* Username */}
                        <div className='w-full'>
                            <label className="text-sm text-gray-700 mb-1 block">Username</label>
                            <input type="text"
                                {...register('userName')}
                                placeholder='Username'
                                className='w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-[#4A3F35] placeholder-gray-500 outline-none focus:ring-1 focus:ring-[#C19A6B] focus:border-[#C19A6B] transition' />
                            {errors.userName && <p className="text-xs text-red-500 mt-1">{errors.userName?.message}</p>}
                        </div>

                        {/* FirstName */}
                        <div className='w-full'>
                            <label className="text-sm text-gray-700 mb-1 block">Firstname</label>
                            <input type="text"
                                {...register('firstName')}
                                placeholder='Firstname'
                                className='w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-[#4A3F35] placeholder-gray-500 outline-none focus:ring-1 focus:ring-[#C19A6B] focus:border-[#C19A6B] transition' />
                            {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName?.message}</p>}
                        </div>

                        {/* LastName */}
                        <div className='w-full'>
                            <label className="text-sm text-gray-700 mb-1 block">Lastname</label>
                            <input type="text"
                                {...register('lastName')}
                                placeholder='Lastname'
                                className='w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-[#4A3F35] placeholder-gray-500 outline-none focus:ring-1 focus:ring-[#C19A6B] focus:border-[#C19A6B] transition' />
                            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName?.message}</p>}
                        </div>

                        {/* Email */}
                        <div className="w-full">
                            <label className="text-sm text-gray-700 mb-1 block">Email</label>
                            <input type="text"
                                {...register('identity')}
                                placeholder='Email'
                                className='w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-[#4A3F35] placeholder-gray-500 outline-none focus:ring-1 focus:ring-[#C19A6B] focus:border-[#C19A6B] transition' />
                            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.identity?.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="w-full">
                            <label className="text-sm text-gray-700 mb-1 block">Password</label>
                            <input type="password"
                                {...register('password')}
                                placeholder='Password'
                                className='w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-[#4A3F35] placeholder-gray-500 outline-none focus:ring-1 focus:ring-[#C19A6B] focus:border-[#C19A6B] transition' />
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password?.message}</p>}
                        </div>

                        {/* Consfirm Password */}
                        <div className="w-full">
                            <label className="text-sm text-gray-700 mb-1 block">Confirm password</label>
                            <input type="password"
                                {...register('confirmPassword')}
                                placeholder='Confirm password'
                                className='w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-[#4A3F35] placeholder-gray-500 outline-none focus:ring-1 focus:ring-[#C19A6B] focus:border-[#C19A6B] transition' />
                            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword?.message}</p>}
                        </div>

                        {/* Sign Up */}
                        <div className="mt-4 flex flex-col gap-3">
                            <button className='w-full bg-[#C19A6B] text-white py-3.5 rounded-xl text-lg font-bold hover:bg-[#a88355] transition shadow-md border border-[#a88355]'>
                                Sign up</button>

                            {/* Clear */}
                            <button
                                type="button"
                                className='w-full bg-[#F5A623] text-white py-3.5 rounded-xl text-lg font-bold hover:bg-[#d48b19] transition shadow-md'
                                onClick={() => reset()}>Clear</button>
                        </div>

                    </fieldset>
                </form>
            </div>
        </>
    )

}
export default RegisterForm