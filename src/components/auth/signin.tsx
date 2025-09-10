'use client'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
})

const SignIn = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: z.infer<typeof schema>) => {
        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (response.ok) {
                console.log('Success:', result)
                setSuccessMessage("Giriş başarılı! Yönlendiriliyorsunuz...")
                setErrorMessage(null)
                localStorage.setItem('user_data', JSON.stringify({ username: result.username, image: result.image, bio: result.bio }))
                setTimeout(() => {
                    router.push('/main')
                }, 1500);
            } else {
                setErrorMessage(result.error || "Giriş yapılamadı")
                setSuccessMessage(null)
            }
        } catch (error) {
            setErrorMessage("Bir hata oluştu")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full bg-card p-4 md:p-8 rounded-lg shadow-lg border-1 border-border flex flex-col gap-4'>
            <h2 className='text-xl'>Giriş yap</h2>
            <p>Lütfen e-posta adresinizi ve şifrenizi girin.</p>
            <div className='w-full h-fit flex flex-col gap-2'>
                <label htmlFor="email" className='text-sm font-medium'>E-posta</label>
                <input type="email" id='email' {...register('email')} className='w-full p-2 rounded-md border-1 border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent' placeholder='E-posta adresinizi girin' />
                {errors.email && <p className='text-red-500 text-sm'>{errors.email.message ? "E-posta adresi geçersiz" : ""}</p>}
            </div>
            <div className='w-full h-fit flex flex-col gap-2'>
                <label htmlFor="password" className='text-sm font-medium'>Şifre</label>
                <input type="password" id='password' {...register('password')} className='w-full p-2 rounded-md border-1 border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent' placeholder='Şifrenizi girin' />
                {errors.password && <p className='text-red-500 text-sm'>{errors.password.message ? "Şifre geçersiz" : ""}</p>}
            </div>
            {errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}
            {successMessage && <p className='text-green-500 text-sm'>{successMessage}</p>}
            <Button type='submit' className='w-full mt-4 bg-chart-1 text-foreground text-lg'>Giriş yap</Button>
        </form>
    )
}

export default SignIn