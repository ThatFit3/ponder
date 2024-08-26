"use client"

import { deleteDoc, doc, setDoc } from "firebase/firestore"
import { db } from "@/app/firebase/config"
import React, { useState } from "react"
import { toast } from "sonner"

interface Species {
    id: string,
    name: string;
    temperature: number;
    pH: number;
    DO: number;
}

function EditDeleteSpecies({ ogSpecie }: { ogSpecie: Species }) {
    const [species, setSpecies] = useState<Species>(ogSpecie)

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => setSpecies({ ...species, [e.target.name]: parseInt(e.target.value) })


    const closeEditForm = () => {
        document.getElementById(`close-edit-${species.id}`)?.closest('form')?.submit()
        setSpecies(ogSpecie)
    }

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "species", species.id))
            toast.success('Species Deleted', { description: `Species ${species.name} deleted` })
        } catch (e: any) {
            console.error(e.message);
        }
    }

    const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let speciesRef = doc(db, "species", species.id)

        try {
            setDoc(speciesRef, {
                name: species.name,
                temperature: species.temperature,
                pH: species.pH,
                DO: species.DO,
            })
            toast.success('Species edited', { description: `Species ${species.name} edited` })
            document.getElementById(`close-edit-${species.id}`)?.closest('form')?.submit()
        } catch (e: any) {
            console.error(e.message);
        }
    }

    return (
        <>
            <div className="flex gap-1 items-center">
                <button className="btn btn-error btn-sm" onClick={() => (document.getElementById(`delete-species-${species.id}`) as HTMLDialogElement).showModal()}>Delete</button>
                <p className="text-3xl font-light">/</p>
                <button className="btn btn-warning btn-sm" onClick={() => (document.getElementById(`edit-species-${species.id}`) as HTMLDialogElement).showModal()}>Edit</button>
            </div>

            <dialog id={`delete-species-${species.id}`} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Are you sure you want to delete species {species.name}</h3>
                    <div className="modal-action">
                        <form id={`close-delete-${species.id}`} method="dialog">
                            <button className="btn">No</button>
                        </form>
                        <button className="btn btn-error" onClick={() => handleDelete()}>Yes</button>
                    </div>
                </div>
            </dialog>

            <dialog id={`edit-species-${species.id}`} className="modal">
                <div className="modal-box">
                    <form method="POST" onSubmit={handleEdit}>
                        <label className="input input-bordered flex items-center gap-2">
                            Name |
                            <input type="text" className="grow" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpecies({ ...species, name: e.target.value })} value={species.name} required />
                        </label>
                        <h5 className="text-lg mt-5 mb-2">
                            Preference
                        </h5>
                        <div className="px-3">
                            <div className="block md:flex items-center gap-2 join-item">
                                <div> Tempreture: {species.temperature}°C</div>
                                <div className="w-full md:w-[70%] p-3 flex ms-auto items-center gap-4">
                                    <button className="btn btn-neutral btn-sm rounded-full" type="button" onClick={() => setSpecies({ ...species, temperature: species.temperature - 1 })} disabled={species.temperature == 0}> - </button>
                                    <input type="range" name="temperature" value={species.temperature} min={0} max="100" className="range" onChange={onChangeHandler} />
                                    <button className="btn btn-neutral btn-sm rounded-full" type="button" onClick={() => setSpecies({ ...species, temperature: species.temperature + 1 })} disabled={species.temperature == 100}> + </button>
                                </div>
                            </div>
                            <div className="block md:flex items-center gap-2 join-item">
                                <div>pH level: {species.pH}</div>
                                <div className="w-full md:w-[70%] p-3 flex ms-auto items-center gap-4">
                                    <button className="btn btn-neutral btn-sm rounded-full" type="button" onClick={() => setSpecies({ ...species, pH: species.pH - 1 })} disabled={species.pH == 0}> - </button>
                                    <input type="range" name="pH" min={0} max="14" value={species.pH} onChange={onChangeHandler} className="range" step="1" />
                                    <button className="btn btn-neutral btn-sm rounded-full" type="button" onClick={() => setSpecies({ ...species, pH: species.pH + 1 })} disabled={species.pH == 14}> + </button>
                                </div>
                            </div>
                            <div className="block md:flex items-center gap-2 join-item">
                                <div className="tooltip text-start" data-tip="Dissolved oxygen level">DO level: {species.DO}ppm</div>
                                <div className="w-full md:w-[70%] p-3 flex ms-auto items-center gap-4">
                                    <button className="btn btn-neutral btn-sm rounded-full" type="button" onClick={() => setSpecies({ ...species, DO: species.DO - 1 })} disabled={species.DO == 0}> - </button>
                                    <input type="range" name="DO" min={0} max="30" value={species.DO} onChange={onChangeHandler} className="range" step="1" />
                                    <button className="btn btn-neutral btn-sm rounded-full" type="button" onClick={() => setSpecies({ ...species, DO: species.DO + 1 })} disabled={species.DO == 30}> + </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-2 flex-row-reverse">
                            <button className="btn btn-primary">Save</button>
                            <button className="btn" type="button" onClick={closeEditForm}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
                <form id={`close-edit-${species.id}`} method="dialog" className="modal-backdrop">
                    <button disabled></button>
                </form>
            </dialog>
        </>
    )
}

export default EditDeleteSpecies