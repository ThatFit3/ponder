"use client"

import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config"
import { clearToken } from "../utils/userCookies";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import LoadingState from "./loadingState";

const AdminNavbar = () => {
    const [user, loading] = useAuthState(auth)
    const router = useRouter();

    let currentPath = usePathname()

    let LinkList = [
        {
            name: "Ponds",
            href: "/admin/ponds"
        },
        {
            name: "Species",
            href: "/admin/species"
        },
    ]

    if (loading) {
        // Optionally render a loading indicator while Firebase initializes
        return <LoadingState />;
    }

    return (
        <div className="navbar bg-[#002630]">
            <div className="flex-1">
                <Link className="btn btn-ghost text-xl" href="/admin">Ponder</Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1 items-center gap-2">
                    {user ? (
                        <>
                            {LinkList.map((l) => (
                                <li key={l.name}>
                                    <Link className={`${currentPath === l.href ? "active font-bold text-white" : ""}`} href={l.href}>{l.name}</Link>
                                </li>
                            ))}
                            <li className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10 rounded-full">
                                        <img
                                            alt="Profile picture"
                                            src={user.photoURL ? `${user.photoURL}` : "https://placehold.co/100x100?text=Hi"} />
                                    </div>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content bg-[#002630] rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                    <li className="text-[#bf0a0d]"><Link href={"/"} onClick={() => {
                                        signOut(auth)
                                        clearToken()
                                    }}>Logout</Link></li>
                                </ul>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><a href="/sign-up">Sign up</a></li>
                            <li><a href="/login">Login</a></li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default AdminNavbar