"use client"

import React, { useState } from "react"
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth } from '@/app/firebase/config'
import { useRouter } from "next/navigation"
import { loginUser } from "@/app/utils/userCookies"

function SignUp() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth)
    const [signInWithGoogle] = useSignInWithGoogle(auth)

    const router = useRouter()

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle()

            let currentUser = auth.currentUser
            if (currentUser) {
                loginUser(currentUser.uid)
            }
            router.push('/');
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.error(e.message);
            } else {
                console.error("An unknown error occurred.");
            }
        }
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const res = await signInWithEmailAndPassword(email, password)
            console.log({ res })
            setEmail('')
            setPassword('')

            let currentUser = auth.currentUser
            if (currentUser) {
                loginUser(currentUser.uid)
            }

            router.push('/')
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.error(e.message);
            } else {
                console.error("An unknown error occurred.");
            }
        }
    }

    return (
        <div className="flex flex-col justify-center min-h-[100vh] w-full items-center">
            <h1 className="text-6xl mb-10">Login</h1>
            <div className="bg-white text-black p-10 md:max-w-[40%] w-[100%] rounded-md">
                <form className="flex flex-col justify-center" method="POST" onSubmit={handleLogin}>

                    <label>Email</label>
                    <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-black p-2 rounded-md bg-white mb-4" />

                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-black p-2 rounded-md bg-white" />

                    <button className="bg-black text-white rounded-md p-3 mt-6 mb-5">Login</button>
                </form>
                <div className="relative flex items-center justify-center w-full mb-5">
                    <hr className="w-full border-gray-400" />
                    <span className="absolute px-3 bg-white text-gray-500">or</span>
                </div>

                <button className="bg-white border border-black rounded-md p-3 mb-3 w-full flex justify-center items-center gap-4 hover:bg-black hover:text-white" onClick={() => handleGoogleSignIn()}><span><img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" alt="sign in using google" className="h-[20px]" /></span> Sign in using Google</button>
                <p className="text-center">Dont have an account?  <a href="/sign-up"><span className="underline text-blue-800">Sign-up</span></a></p>
            </div>
        </div>
    )
}

export default SignUp