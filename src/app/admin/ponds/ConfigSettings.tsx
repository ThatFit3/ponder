import { db } from "@/app/firebase/config";
import { SettingFilled } from "@ant-design/icons";
import { collection, doc, DocumentData, onSnapshot, QuerySnapshot, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function ConfigSettings() {
    const [config, setConfig] = useState<any>({});
    const [loadConfig, setLoadConfig] = useState<boolean>(true)

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "configs"),
            (querySnapshot: QuerySnapshot<DocumentData>) => {
                setConfig((prevConfig: any) => {
                    const newConfig = { ...prevConfig };
                    querySnapshot.docs.forEach((doc: any) => {
                        newConfig[doc.id] = doc.data().value;
                    });
                    return newConfig;
                });
                setLoadConfig(false)
            }
        );

        return () => unsubscribe();
    }, [loadConfig]);

    const handleEditConfig = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await setDoc(doc(db, "configs", "token"), { value: config.token })
            await setDoc(doc(db, "configs", "refreshRate"), { value: parseInt(config.refreshRate) })
            document.getElementById('close-config-form')?.closest('form')?.submit()
            toast.success("Config updated")
        } catch (e: any) {
            console.error(e.message)
        }
    }

    return (
        <>
            <button className="btn aspect-square p-0" onClick={() => document.getElementById('config-setting')?.showModal()}><SettingFilled /></button>

            <dialog id="config-setting" className="modal">
                <div className="modal-box">
                    <form method="POST" onSubmit={handleEditConfig}>
                        <h3 className="font-bold text-lg">IoT configs</h3>
                        <div className="my-2">
                            <p>Auth token</p>
                            <textarea className="textarea textarea-bordered resize-none w-full h-40 mt-2" placeholder="Token here..." name="token" value={config.token} onChange={(e) => setConfig({ ...config, token: e.target.value })}></textarea>
                        </div>
                        <div className="my-2">
                            <p>Refresh rate</p>
                            <input type="number" name="name" placeholder="Refresh rate" className="input input-bordered w-full mt-2" value={config.refreshRate} onChange={(e) => setConfig({ ...config, refreshRate: e.target.value })} />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button className="btn" type="button" onClick={() => document.getElementById('close-config-form')?.closest('form')?.submit()}>
                                Cancel
                            </button>
                            <button className="btn btn-primary">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop" id="close-config-form" onSubmit={() => setLoadConfig(true)}>
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}

export default ConfigSettings