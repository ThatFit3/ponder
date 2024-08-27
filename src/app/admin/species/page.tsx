"use client"

import AddSpecies from "./AddSpecies"
import { useState, useEffect } from "react"
import { onSnapshot, collection, QuerySnapshot, DocumentData } from "firebase/firestore"
import { db } from "@/app/firebase/config"
import EditDeleteSpecies from "./EditDeleteSpecies"
import { useMediaQuery } from "usehooks-ts"


interface Species {
    id: string,
    name: string;
    temperature: number;
    pH: number;
    DO: number;
}

function Species() {
    const isDesktop = useMediaQuery("(min-width: 768px", {
        initializeWithValue: false,
    });

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
                    <div className="flex w-full justify-center">
                        <div className="w-[95%] md:w-[80%] p-3 bg-base-200 rounded-md overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="border-base-100 border" rowSpan={2}></th>
                                        <th className="border-base-100 border" rowSpan={2}>Name</th>
                                        <th className="border-base-100 border" colSpan={isDesktop ? 3 : 1}>Preference(s)</th>
                                        <th className="border-base-100 border md:table-cell hidden" rowSpan={2}>Action(s)</th>
                                    </tr>
                                    <tr>
                                        <th className="border-base-100 border md:table-cell hidden">DO level (mg/L)</th>
                                        <th className="border-base-100 border md:table-cell hidden">Temperature (°C)</th>
                                        <th className="border-base-100 border md:table-cell hidden">pH value</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {species.map((specie, i) => (
                                        <>
                                            <tr key={specie.id} >
                                                <td className="border-base-100 border" rowSpan={isDesktop ? 1 : 4}>{i + 1}</td>
                                                <td className="border-base-100 border" rowSpan={isDesktop ? 1 : 3}>{specie.name}</td>
                                                <td className="border-base-100 border">{!isDesktop ? `DO: ${specie.DO}` : specie.DO}</td>
                                                <td className="border-base-100 border md:table-cell hidden">{specie.temperature}</td>
                                                <td className="border-base-100 border md:table-cell hidden">{specie.pH}</td>
                                                <td className="border-base-100 border md:table-cell hidden"><EditDeleteSpecies ogSpecie={specie} /></td>
                                            </tr>
                                            <tr className="md:hidden table-row">
                                                <td className="border-base-100 border">Temperature: {specie.temperature}</td>
                                            </tr>
                                            <tr className="md:hidden table-row">
                                                <td className="border-base-100 border">pH: {specie.pH}</td>
                                            </tr>
                                            <tr className="md:hidden table-row">
                                                <td className="border-base-100 border md:hidden table-cell w-full" colSpan={2}>
                                                    <div className="flex w-full justify-end">
                                                        <EditDeleteSpecies ogSpecie={specie} />
                                                    </div>
                                                </td>
                                            </tr>
                                        </>
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