"use client"

import AddSpecies from "./AddSpecies"
import { useState, useEffect } from "react"
import { onSnapshot, collection, QuerySnapshot, DocumentData } from "firebase/firestore"
import { db } from "@/app/firebase/config"
import EditDeleteSpecies from "./EditDeleteSpecies"


interface Species {
    id: string,
    name: string;
    temperature: number;
    pH: number;
    DO: number;
}

function Species() {

    const [species, setSpecies] = useState<Species[]>([])
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "species"),
            (querySnapshot: QuerySnapshot<DocumentData>) => {
                const speciesList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Species[];
                setSpecies(speciesList);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return (
        <>
            <AddSpecies />

            {loading ? (
                <div className="flex flex-col items-center w-full p-10">
                    <span className="loading loading-dots loading-lg"></span>
                    <h1 className="text-xl">Please Hold on</h1>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto flex w-full justify-center">
                        <div className="w-[70%] p-3 bg-base-200 rounded-md">

                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="border-base-100 border" rowSpan={2}></th>
                                        <th className="border-base-100 border" rowSpan={2}>Name</th>
                                        <th className="border-base-100 border" colSpan={3}>Preference</th>
                                        <th className="border-base-100 border" rowSpan={2}>Action(s)</th>
                                    </tr>
                                    <tr>
                                        <th className="border-base-100 border">Dissolved oxygen level (mg/L)</th>
                                        <th className="border-base-100 border">Temperature (°C)</th>
                                        <th className="border-base-100 border">pH value</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {species.map((specie, i) => (
                                        <tr key={specie.id} >
                                            <td className="border-base-100 border">{i + 1}</td>
                                            <td className="border-base-100 border">{specie.name}</td>
                                            <td className="border-base-100 border">{specie.DO}</td>
                                            <td className="border-base-100 border">{specie.temperature}</td>
                                            <td className="border-base-100 border">{specie.pH}</td>
                                            <td className="border-base-100 border"><EditDeleteSpecies ogSpecie={specie} /></td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )
            }
        </>
    )
}

export default Species