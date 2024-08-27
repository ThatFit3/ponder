"use client"

import AddPond from "./AddPond"
import React, { useState, useEffect } from "react"
import EditDeletePond from "./EditDeletePond"
import { onSnapshot, collection, QuerySnapshot, DocumentData, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "@/app/firebase/config"
import { CaretRightFilled } from "@ant-design/icons"
import Link from "next/link"
import ConfigSettings from "./ConfigSettings"

interface Species {
    id: string,
    name: string;
    temperature: number;
    pH: number;
    DO: number;
}

function Ponds() {
    const [ponds, setPonds] = useState<any>()
    const [speciesList, setSpeciesList] = useState<Species[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

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

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "ponds"),
            async (querySnapshot: QuerySnapshot<DocumentData>) => {
                const pondsList = await Promise.all(
                    querySnapshot.docs.map(async (docSnapshot) => {
                        const pondData = docSnapshot.data();
                        const speciesRef = pondData.Species;

                        let speciesData: any | null = null;

                        if (speciesRef) {
                            const speciesDocRef = doc(db, "species", speciesRef);
                            const speciesDoc = await getDoc(speciesDocRef);
                            if (speciesDoc.exists()) {
                                speciesData = {
                                    id: speciesDoc.id,
                                    ...speciesDoc.data(),
                                } as any;
                            }
                        }

                        return {
                            id: docSnapshot.id,
                            ...pondData,
                            species: speciesData,
                        };
                    })
                );

                setPonds(pondsList);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return (
        <div className="flex w-full justify-center p-0 md:py-6">
            <div className="w-full p-3 md:w-[70%] flex flex-col gap-4">
                <div className="flex gap-2">
                    <AddPond speciesList={speciesList} /><ConfigSettings />
                </div>
                {loading ? (
                    <div className="flex flex-col items-center w-full p-10">
                        <span className="loading loading-dots loading-lg"></span>
                        <h1 className="text-xl">Please Hold on</h1>
                    </div>
                ) : (
                    <>
                        {ponds.map((pond: any) => (
                            <div className="w-full grid grid-cols-1 md:grid-cols-6 bg-base-300 p-3 rounded-md gap-2" key={pond.id}>
                                <div className="rounded-md bg-base-200 p-4 col-span-1 md:flex flex-col justify-center text-wrap hidden">
                                    <p className="font-bold text-lg">
                                        {pond.name}
                                    </p>
                                    <p>
                                        status: {pond.isActive ? <span className="font-bold text-success">Active</span> : <span className="font-bold text-warning">Idle</span>}
                                    </p>
                                </div>
                                <Link href={`./ponds/${pond.id}`} className="md:hidden flex btn-ghost p-4 justify-between w-full items-center rounded-md bg-base-200">
                                    <div className="col-span-1 flex flex-col justify-center text-wrap">
                                        <p className="font-bold text-lg">
                                            {pond.name}
                                        </p>
                                        <p>
                                            status: {pond.isActive ? <span className="font-bold text-success">Active</span> : <span className="font-bold text-warning">Idle</span>}
                                        </p>
                                    </div>
                                    <div>
                                        <CaretRightFilled />
                                    </div>
                                </Link>
                                <div className="col-span-1 md:col-span-5 bg-base-200 rounded-md p-4 flex items-center justify-between gap-3">
                                    <Link href={`./ponds/${pond.id}`} className="hidden md:flex btn-ghost p-2 rounded-md justify-between w-full items-center">
                                        <div>
                                            <p className="font-bold">Species: <span className="font-normal">{pond.species.name}</span></p>
                                            <p className="font-bold">Capacity: <span className="font-normal">{pond.capacity}</span></p>
                                        </div>
                                        <div>
                                            Details<CaretRightFilled />
                                        </div>
                                    </Link>
                                    <div className="block md:hidden">
                                        <p className="font-bold">Species: <span className="font-normal">{pond.species.name}</span></p>
                                        <p className="font-bold">Capacity: <span className="font-normal">{pond.capacity}</span></p>
                                    </div>
                                    <EditDeletePond pond={pond} />
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}

export default Ponds