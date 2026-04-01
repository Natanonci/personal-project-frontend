
import useUserStore from '../stores/userStore'
import { loginSchema } from '../validations/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import RegisterForm from '../components/RegisterForm'

function Login() {

  const login = useUserStore(state => state.login)
  
  const { register, formState, handleSubmit, reset } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit'
  })

  const { errors, isSubmitting, isValid } = formState

  const onSubmit = async (body) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const resp = await login(body)
      toast.success(resp.data.message)
    } catch (err) {
      console.log(err)
      const errMSG = err.response?.data.message || err.message
      toast.error(errMSG)
    }
  }

  return (
   
    <div className="w-full flex-1 flex items-center justify-center z-10">

        <div className="bg-[#FEF5EB] rounded-[30px] p-10 w-full max-w-112.5 shadow-[0_25px_60px_-15px_rgba(225,165,125,0.45)]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col">
            <fieldset disabled={isSubmitting}>

              {/* Username */}
              <div className="mb-4 flex flex-col">
                <label htmlFor="username" className="text-sm text-[#4A3F35] mb-2">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder='username'
                  className="w-full p-3 bg-gray-100 text-[#4A3F35] rounded-lg text-sm focus:ring-2 focus:ring-[#C19A6B] outline-none border-none shadow-inner"
                  {...register('identity')}
                />
                <p className="text-sm text-error">{errors.identity?.message}</p>
              </div>

              {/* Password */}
              <div className="mb-2 flex flex-col">
                <label htmlFor="password" className="text-sm text-[#4A3F35] mb-2">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder='password'
                  className="w-full p-3 bg-gray-100 text-[#4A3F35] rounded-lg text-sm focus:ring-2 focus:ring-[#C19A6B] outline-none border-none shadow-inner"
                  {...register('password')}
                />
                <p className="text-sm text-error">{errors.password?.message}</p>
              </div>

              {/* ForgetPassword */}
              <div className="flex justify-end mb-8 mt-1">
                <a href="#" className="text-[11px] text-blue-500 hover:underline">Forget password?</a>
              </div>

              {/* Login */}
              <button type="submit" className="w-full bg-[#C8A27A] text-white py-3.5 rounded-[10px] text-base font-bold hover:bg-[#a88355] transition shadow-md">
                Login
              </button>

              {/* Register */}
              <div className="text-center text-xs text-gray-600 mt-4">
                Don't have an account?
                <a href="#" className="text-blue-500 font-bold ml-1 hover:underline" onClick={(e) => { e.preventDefault(); document.getElementById('register-form').showModal() }}>Sign up</a>
              </div>

            </fieldset>
          </form>

        </div>

      {/* 3. ย้าย Modal มาแอบไว้ด้านนอกสุด เพื่อไม่ให้มันไปเบียดความกว้างของหน้าจอ */}
      <dialog id="register-form" className="modal">
        <RegisterForm />
      </dialog>

    </div>
  );
}

export default Login