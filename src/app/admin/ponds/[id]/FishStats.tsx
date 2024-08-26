import React, { useState } from "react"
import { addDoc, setDoc, doc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/app/firebase/config"
import { toast } from "sonner"

function FishStats({ pond }: { pond: any }) {
    const [insertFish, setInsertFish] = useState<number>(0)
    const [fishDied, setFishDied] = useState<number>(0)

    const handleInsertFish = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const docRef = await addDoc(collection(db, "records"), {
                Pond: pond.id,
                insertDate: serverTimestamp(),
                harvestDate: "",
                inserted: insertFish,
                died: 0,
            });

            const recordId = docRef.id;

            const pondRef = doc(db, "ponds", pond.id);
            await setDoc(pondRef, {
                batchRef: recordId,
                isActive: true
            }, { merge: true });

        } catch (e: any) {
            console.error(e.message);
        }

    }

    const handleFishDied = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            await setDoc(doc(db, "records", pond.batchRef), {
                died: pond.record.died + fishDied
            }, { merge: true })
            toast.success("Record updated", { description: `${pond.name}'s record updated` })
            document.getElementById('close-fisf-died')?.closest('form')?.closest('form')?.submit()
            setFishDied(0)
        } catch (e: any) {
            console.error(e.message);
        }
    }

    return (
        (!pond.isActive ? (
            <>
                <button className="col-span-2 bg- rounded-md p-5 btn btn-accent h-full w-full" onClick={() => document.getElementById("fish-in")?.showModal()}>
                    <p className="font-bold text-lg">Activate pond?</p >
                </button >

                <dialog id="fish-in" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">How many fish will be inserted</h3>
                        <form method="POST" onSubmit={handleInsertFish}>
                            <div className="grid grid-cols-5 gap-2 mt-2">
                                <input type="number" className="input input-bordered w-full" required min={0} max={pond.capacity} value={insertFish} onChange={(e) => setInsertFish(parseInt(e.target.value))} />
                                <div className="flex items-center w-full col-span-4">
                                    <input type="range" min={0} max={pond.capacity} value={insertFish} className="range" onChange={(e) => setInsertFish(parseInt(e.target.value))} />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-5">
                                <button className="btn" type="button" onClick={() => document.getElementById('close-fish-in')?.closest('form')?.submit()}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary">
                                    Yes
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop" id="close-fish-in">
                        <button>close</button>
                    </form>
                </dialog>
            </>
        ) : (
            <>
                <div className="col-span-1 bg-success rounded-md p-3 flex items-center justify-center">
                    <div className="text-center">
                        <p className="font-bold text-lg">Alive:</p>
                        <p className="text-lg font-normal">{pond.record.inserted - pond.record.died}</p>
                    </div>
                </div >
                <div className="col-span-1 bg-error rounded-md p-3">
                    <button className="btn btn-ghost h-full w-full text-center" onClick={() => document.getElementById('fisf-died')?.showModal()}>
                        <div>
                            <p className="font-bold text-lg">Died:</p>
                            <p className="text-lg">{pond.record.died}</p>
                        </div>
                    </button>
                </div>

                <dialog id="fisf-died" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">How many fish died?</h3>
                        <form method="POST" onSubmit={handleFishDied}>
                            <div className="grid grid-cols-5 gap-2 mt-2">
                                <input type="number" className="input input-bordered w-full" required min={0} max={pond.record.inserted} value={fishDied} onChange={(e) => setFishDied(parseInt(e.target.value))} />
                                <div className="flex items-center w-full col-span-4 gap-2">
                                    <button className="btn btn-sm aspect-square rounded-full" type="button" onClick={(e) => setFishDied(fishDied - 1)}>-</button>
                                    <input type="range" min={0} max={pond.record.inserted - pond.record.died} value={fishDied} className="range" onChange={(e) => setFishDied(parseInt(e.target.value))} />
                                    <button className="btn btn-sm aspect-square rounded-full" type="button" onClick={(e) => setFishDied(fishDied + 1)}>+</button>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-5">
                                <button className="btn" type="button" onClick={() => document.getElementById('close-fisf-died')?.closest('form')?.submit()}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary">
                                    Yes
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop" id="close-fisf-died">
                        <button>close</button>
                    </form>
                </dialog>
            </>
        ))
    )
}

export default FishStats