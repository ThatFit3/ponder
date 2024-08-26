"use client"

import { getDocs, collection, addDoc } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { db } from "@/app/firebase/config"
import { toast } from "sonner";

interface Species {
    id: string,
    name: string;
    temperature: number;
    pH: number;
    DO: number;
}

function AddPond({ speciesList }: { speciesList: any }) {
    const [pond, setPond] = useState<any>({ isActive: false })

    const onChange = (e: React.ChangeEvent<any>) => setPond({ ...pond, [e.target.name]: e.target.value })

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            let pondRef = collection(db, "ponds")
            await addDoc(pondRef, pond)
            toast.success("Successfully added", { description: `Pond '${pond.name}' added!` })
            setPond({
                name: "",
                capacity: 0,
                species: "",
                API: "",
                isActive: false,
            })
            document.getElementById('close-form')?.closest('form')?.submit()
        } catch (e: any) {
            console.error(e.message);

        }
    }

    return (
        <>
            <button className="btn w-fit" onClick={() => (document.getElementById('add-pond') as HTMLDialogElement).showModal()}>Add a Pond</button>
            <dialog id="add-pond" className="modal">
                <div className="modal-box">
                    <form method="POST" onSubmit={onSubmit}>
                        <div className="my-2">
                            <p>Pond name</p>
                            <input required type="text" name="name" placeholder="Pond name" className="input input-bordered w-full mt-2" onChange={onChange} value={pond.name} />
                        </div>
                        <div className="my-2">
                            <p>Species</p>
                            <select className="select select-bordered w-full" required name="Species" onChange={onChange} defaultValue={""}>
                                <option disabled value={""}>Choose the species</option>
                                {speciesList.map((species: any) => (
                                    <option value={species.id} key={species.id}>{species.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="my-2">
                            <p>Capacity</p>
                            <input required type="number" min={0} name="capacity" placeholder="Maximum capacity" className="input input-bordered w-full mt-2" onChange={onChange} value={pond.capacity} />
                        </div>
                        <div className="my-2">
                            <p>Device key</p>
                            <input type="text" name="API" placeholder="put the device key here" className="input input-bordered w-full mt-2" onChange={onChange} value={pond.API} />
                        </div>
                        <div className="flex gap-4 mt-4 flex-row-reverse">
                            <button className="btn btn-primary">Submit</button>
                            <button className="btn" type="button" onClick={() => document.getElementById('close-form')?.closest('form')?.submit()}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
                <form id="close-form" method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>

    )
}

export default AddPond