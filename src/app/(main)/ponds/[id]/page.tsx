"use client"

import { useState, useEffect } from "react"
import { onSnapshot, doc, getDoc, getDocs, collection } from "firebase/firestore"
import { db } from "@/app/firebase/config"
import { CaretLeftFilled } from "@ant-design/icons"
import { useRouter } from "next/navigation"
import LastFed from "./LastFed"
import FishStats from "./FishStats"
import Harvest from "./Harvest"
import IotFeeds from "./IotFeeds"
import HarvestRecord from "./HarvestRecord"

function PondDetails({ params: { id } }: { params: any }) {
    const [pond, setPond] = useState<any>({})
    const [isLoading, setLoading] = useState<boolean>(true)
    const router = useRouter()


    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(db, "ponds", id),
            async (querySnapshot: any) => {
                let speciesRef: any = ""
                let recordData: any = "";
                let batchRef: any = "";
                let refreshRateRes = await getDoc(doc(db, "configs", "refreshRate"))

                if (querySnapshot.data()) {
                    speciesRef = doc(db, "species", querySnapshot.data().Species)

                    const data = querySnapshot.data();
                    if (data.batchRef) {
                        batchRef = doc(db, "records", data.batchRef);

                        onSnapshot(batchRef, (batchSnapshot: any) => {
                            recordData = batchSnapshot.exists() ? batchSnapshot.data() : "";
                            setPond((prev: any) => ({
                                ...prev,
                                record: recordData,
                            }));
                        });
                    }
                }
                setPond({
                    id: querySnapshot.id,
                    ...querySnapshot.data(),
                    species: speciesRef !== "" ? (await getDoc(speciesRef)).data() : "",
                    record: recordData,
                    refreshRate: refreshRateRes.data()?.value
                })
                setLoading(false)
            }
        );

        return () => unsubscribe();
    }, []);

    return (
        isLoading ? (
            <div className="flex flex-col items-center w-full p-10">
                <span className="loading loading-dots loading-lg"></span>
                <h1 className="text-xl">Please Hold on</h1>
            </div>
        ) : (
            <div className="p-8 px-12">
                <div className="w-full bg-base-200 p-5 rounded-md flex items-center justify-between">
                    <button className="btn text-2xl font-semibold btn-ghost ps-0" onClick={() => router.push('/')}>
                        <CaretLeftFilled className="text-4xl" />{pond.name} ({pond.isActive ? <span className="font-normal text-success">Active</span> : <span className="font-normal text-warning">Idle</span>})
                    </button>
                    <div className="flex gap-2">
                        {pond.isActive ? (
                            <Harvest pond={pond} />
                        ) : ""}
                    </div>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 mt-4 gap-4">
                    <div className="col-span-3 bg-base-200 rounded-md p-5">
                        <p className="font-bold text-lg">Species: <span className="font-normal">{pond.species.name}</span></p>
                        <p className="font-bold text-lg">Capacity: <span className="font-normal">{pond.capacity}</span></p>
                    </div>
                    <div className="col-span-1 bg-base-200 rounded-md p-3">
                        <LastFed pond={pond} />
                    </div>
                    <FishStats pond={pond} />
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 mt-4 gap-4 w-full">
                    <div className="grid col-span-3 grid-cols-3 gap-2 bg-base-300 p-3 rounded-md relative">
                        {!pond.isActive ? (

                            <div className="bg-black/70 h-full w-full absolute z-10 flex justify-center items-center rounded-md" >
                                <p>Activate your pond first</p>
                            </div>
                        ) : ""}
                        <IotFeeds pond={pond} />
                    </div>
                    <HarvestRecord pond={pond} />
                </div>
            </div>
        )
    )
}

export default PondDetails