"use server"

import { cookies } from "next/headers";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";

const router = useRouter()
export const loginUser = async(userId: string) => {
    cookies().set('token', userId)

    const userRef = doc(db, "user" , userId)
    let userDoc = await getDoc(userRef)
    let userData = userDoc.data()

    if(userData){
        cookies().set('role', userData.role)
    }
    let role = cookies().get('role')?.value
    if (isAdmin()) {
        router.push("/admin")
    }else{
        router.push("/")
    }
}

export const userLoggedIn = () => {
    let result = cookies().has('token')
    return result
}

export const clearToken = async() => {
    cookies().delete('token')
    cookies().delete('role')
    router.push("/")
}

export const isAdmin = () => {
    let role = cookies().get('role')?.value
    let result = role === "admin"
    return result
}