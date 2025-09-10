'use client'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SignIn from './signin'
import Signup from './signup'

const Tab = () => {
    return (
        <Tabs defaultValue="signin" className="w-full max-w-140">
            <TabsList className='w-full'>
                <TabsTrigger value="signin">Giriş yap</TabsTrigger>
                <TabsTrigger value="signup">Kayıt ol</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
                <SignIn />
            </TabsContent>
            <TabsContent value="signup">
                <Signup />
            </TabsContent>
        </Tabs>
    )
}

export default Tab