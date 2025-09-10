'use client'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import z, { set } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    passwordAgain: z.string().min(6).max(100),
}).refine(data => data.password === data.passwordAgain, {
    message: "Şifreler eşleşmiyor",
    path: ["passwordAgain"],
})

const Signup = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: z.infer<typeof schema>) => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                }),
            })
            const result = await response.json()
            if (response.ok) {
                console.log('Success:', result)
                setSuccessMessage("Kayıt başarılı! Giriş yapabilirsiniz.")
                setErrorMessage(null)
                setTimeout(() => { window.location.reload() }, 2000);
            } else {
                console.error('Error:', result)
                setErrorMessage(result.error || "Kayıt oluşturulamadı")
                setSuccessMessage(null)
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full bg-card p-4 md:p-8 rounded-lg shadow-lg border-1 border-border flex flex-col gap-4'>
            <h2 className='text-xl'>Kayıt ol</h2>
            <p>Lütfen e-posta adresinizi ve şifrenizi girin.</p>
            <div className='w-full h-fit flex flex-col gap-2'>
                <label htmlFor="name" className='text-sm font-medium'>Ad</label>
                <input type="text" id='name' {...register('name')} className='w-full p-2 rounded-md border-1 border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent' placeholder='Adınızı girin' />
                {errors.name && <p className='text-red-500 text-sm'>{errors.name.message ? "Geçersiz ad" : ""}</p>}
            </div>
            <div className='w-full h-fit flex flex-col gap-2'>
                <label htmlFor="email" className='text-sm font-medium'>E-posta</label>
                <input type="email" id='email' {...register('email')} className='w-full p-2 rounded-md border-1 border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent' placeholder='E-posta adresinizi girin' />
                {errors.email && <p className='text-red-500 text-sm'>{errors.email.message ? "Geçersiz e-posta" : ""}</p>}
            </div>
            <div className='w-full h-fit flex flex-col gap-2'>
                <label htmlFor="password" className='text-sm font-medium'>Şifre</label>
                <input type="password" id='password' {...register('password')} className='w-full p-2 rounded-md border-1 border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent' placeholder='Şifrenizi girin' />
                {errors.password && <p className='text-red-500 text-sm'>{errors.password.message ? "Geçersiz şifre" : ""}</p>}
            </div>
            <div className='w-full h-fit flex flex-col gap-2'>
                <label htmlFor="passwordAgain" className='text-sm font-medium'>Şifre (Tekrar)</label>
                <input type="password" id='passwordAgain' {...register('passwordAgain')} className='w-full p-2 rounded-md border-1 border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent' placeholder='Şifrenizi girin' />
                {errors.passwordAgain && <p className='text-red-500 text-sm'>{errors.passwordAgain.message ? "Şifreler eşleşmiyor" : ""}</p>}
            </div>
            {errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}
            {successMessage && <p className='text-green-500 text-sm'>{successMessage}</p>}
            <Button type='submit' className='w-full mt-4 bg-chart-1 text-foreground text-lg'>Kayıt ol</Button>
        </form>
    )
}

export default Signup