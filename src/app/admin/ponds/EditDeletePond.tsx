"use client"

import { db } from "@/app/firebase/config"
import { SettingFilled, DeleteFilled } from "@ant-design/icons"
import { collection, deleteDoc, doc, getDocs, setDoc, query, where } from "firebase/firestore"
import { toast } from "sonner"
import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"


interface Species {
    id: string,
    name: string;
    temperature: number;
    pH: number;
    DO: number;
}

function EditDeletePond({ pond }: { pond: any }) {
    const [editPond, setEditPond] = useState({ Species: pond.Species, name: pond.name, API: pond.API, capacity: pond.capacity })
    const [speciesList, setSpeciesList] = useState<Species[]>([]);
    const onChange = (e: React.ChangeEvent<any>) => setEditPond({ ...editPond, [e.target.name]: e.target.value })
    const router = useRouter()
    const path = usePathname()

    useEffect(() => {
        const getSpecies = async () => {
            let res = await getDocs(collection(db, "species"));
            let species = res.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Species[];
            setSpeciesList(species);
        };

        getSpecies();

    }, []);

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "ponds", pond.id))
            let deletePondRecord = query(collection(db, "records"), where("Pond", "==", pond.id))
            try {
                const querySnapshot = await getDocs(deletePondRecord);

                const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));

                await Promise.all(deletePromises);
            } catch (e: any) {
                console.error("Error deleting documents: ", e.message);
            }
            if (path !== "/admin/ponds") {
                router.push('/admin/ponds')
            }
            toast.success('Pond Deleted', { description: `Pond '${pond.name}' deleted` })
            document.getElementById(`close-delete-${pond.id}`)?.closest('form')?.submit()
        } catch (e: any) {
            console.error(e.message);
        }
    }

    const closeEditForm = () => {
        setEditPond({ Species: pond.Species, name: pond.name, API: pond.API, capacity: pond.capacity })
        document.getElementById(`close-edit-pond-${pond.id}`)?.closest('form')?.submit()
    }

    const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let pondRef = doc(db, 'ponds', pond.id)
        try {
            setDoc(pondRef, editPond, { merge: true })
            document.getElementById(`close-edit-pond-${pond.id}`)?.closest('form')?.submit()
            toast.success("Pond edited", { description: `Pond '${pond.name}' edited successfully` })
        } catch (e: any) {
            console.error(e.message);
        }
    }

    return (
        <>
            <div className="flex gap-2">
                <button className="btn btn-ghost aspect-square" onClick={() => { document.getElementById(`edit-pond-${pond.id}`).showModal() }}><SettingFilled className="text-2xl" /></button>
                <button className="btn btn-ghost aspect-square" onClick={() => { document.getElementById(`delete-pond-${pond.id}`).showModal() }}><DeleteFilled className="text-error text-2xl" /></button>
            </div>

            <dialog id={`delete-pond-${pond.id}`} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Are you sure you want to delete pond {pond.name}</h3>
                    <div className="modal-action">
                        <form id={`close-delete-${pond.id}`} method="dialog">
                            <button className="btn">No</button>
                        </form>
                        <button className="btn btn-error" onClick={() => handleDelete()}>Yes</button>
                    </div>
                </div>
            </dialog>
            <dialog id={`edit-pond-${pond.id}`} className="modal" onSubmit={handleEdit}>
                <div className="modal-box">
                    <form method="POST">
                        <div className="my-2">
                            <p>Pond name</p>
                            <input type="text" name="name" placeholder="Pond name" className="input input-bordered w-full mt-2" onChange={onChange} value={editPond.name} />
                        </div>
                        <div className="my-2">
                            <p>Species</p>
                            <select className="select select-bordered w-full" name="Species" onChange={onChange} value={editPond.Species}>
                                <option disabled value={""}>Choose the species</option>
                                {speciesList.map((species: any) => (
                                    <option value={species.id} key={species.id}>{species.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="my-2">
                            <p>Capacity</p>
                            <input type="number" min={0} name="capacity" placeholder="Maximum capacity" className="input input-bordered w-full mt-2" onChange={onChange} value={editPond.capacity} />
                        </div>
                        <div className="my-2">
                            <p>Device key</p>
                            <input type="text" name="API" placeholder="put the device key here" className="input input-bordered w-full mt-2" onChange={onChange} value={editPond.API} />
                        </div>
                        <div className="flex gap-4 mt-4 flex-row-reverse">
                            <button className="btn btn-primary">Save</button>
                            <button className="btn" type="button" onClick={() => closeEditForm()}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
                <form id={`close-edit-pond-${pond.id}`} method="dialog" className="modal-backdrop">
                    <button disabled>close</button>
                </form>
            </dialog>
        </>
    )
}

export default EditDeletePond