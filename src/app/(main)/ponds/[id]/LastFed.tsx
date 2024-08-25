import { setDoc, doc, serverTimestamp } from "firebase/firestore"
import { db } from "@/app/firebase/config";
import moment from "moment";
import { toast } from "sonner";

function LastFed({ pond }: { pond: any }) {

    const handleLastFed = async () => {
        if (pond.isActive) {
            try {
                await setDoc(doc(db, "ponds", pond.id), {
                    lastFed: serverTimestamp()
                }, { merge: true })
                document.getElementById('close-last-fed')?.submit()
            } catch (e: any) {
                console.error(e.message);
            }
        } else {
            document.getElementById('close-last-fed')?.submit()
            toast.warning("You need to activate the pond first")
        }
    }

    return (
        <>
            <button className="btn btn-ghost p-2 h-full w-full text-center" onClick={() => document.getElementById('last-fed').showModal()}>
                <div>
                    <p className="font-bold text-lg">Last Fed:</p>
                    <p className="text-lg">{pond.lastFed ? moment(pond.lastFed.toDate()).format('h : mm a') : "-- : --"}</p>
                </div>
            </button>

            <dialog id="last-fed" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Mark this time as last fed?</h3>
                    <div className="flex justify-end gap-3">
                        <button className="btn" type="button" onClick={() => document.getElementById('close-last-fed')?.submit()}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" type="button" onClick={() => handleLastFed()}>
                            Yes
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop" id="close-last-fed">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}

export default LastFed