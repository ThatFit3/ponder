import { CheckCircleFilled } from "@ant-design/icons"
import { db } from "@/app/firebase/config"
import { updateDoc, doc, deleteField, serverTimestamp } from "firebase/firestore"
import { toast } from "sonner"

function Harvest({ pond }: { pond: any }) {

    const handleHarvest = async () => {
        try {
            await updateDoc(doc(db, "records", pond.batchRef), {
                harvestDate: serverTimestamp(),
                harvested: pond.record.inserted - pond.record.died
            })

            await updateDoc(doc(db, "ponds", pond.id), {
                isActive: false,
                batchRef: deleteField(),
                lastFed: deleteField()
            })

            document.getElementById('close-harvest')?.submit()

            toast.success("Pond harvested", { description: `${pond.name} harvest recorded` })
        } catch (e: any) {
            console.error(e.message);
        }
    }

    return (
        <>
            <button className="btn btn-ghost aspect-square" onClick={() => document.getElementById("harvest-pond")?.showModal()}><CheckCircleFilled className="text-2xl text-success" /></button>
            <dialog id={`harvest-pond`} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Are you sure the pond are ready to be harvest?</h3>
                    <div className="modal-action">
                        <form id={`close-harvest`} method="dialog">
                            <button className="btn">No</button>
                        </form>
                        <button className="btn btn-success" onClick={() => handleHarvest()}>Yes</button>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default Harvest