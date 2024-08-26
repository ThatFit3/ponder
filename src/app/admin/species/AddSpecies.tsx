"use client"

import React, { useState } from "react"
import { addDoc, collection } from "firebase/firestore"
import { db } from "@/app/firebase/config"
import { toast } from "sonner"

function AddSpecies() {
    interface Species {
        name: string;
        temperature: number;
        pH: number;
        DO: number;
    }

    const [species, setSpecies] = useState<Species>({
        name: "",
        temperature: 0,
        pH: 0,
        DO: 0
    });

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => setSpecies({ ...species, [e.target.name]: parseInt(e.target.value) })

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const speciesRef = collection(db, "species")
            await addDoc(speciesRef, species)
            toast.success('Species successfully added', { description: `Species ${species.name} added!` })
            setSpecies({
                name: "",
                temperature: 0,
                pH: 0,
                DO: 0
            })
            document.getElementById('close-form')?.closest('form')?.submit()
        } catch (e: any) {
            console.error(e.message);
        }
    }

    return (
        <div className="w-full flex justify-center mt-6 mb-3">
            <div className="w-[70%] flex">
                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <button className="btn w-fit" onClick={() => document.getElementById('add-species')?.showModal()} >Add species</button>
                <dialog id="add-species" className="modal">
                    <div className="modal-box">
                        <form onSubmit={onSubmit} method="POST">
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
            </div>
        </div>
    )
}

export default AddSpecies