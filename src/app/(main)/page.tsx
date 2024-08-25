"use client"

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase/config"
import { useEffect, useState } from "react";
import { collection, doc, DocumentData, getDoc, onSnapshot, QuerySnapshot } from "firebase/firestore";
import Link from "next/link";
import { CaretRightFilled } from "@ant-design/icons";
import IoTMainDisplay from "./IoTMainDisplay";

export default function Home() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState<boolean>(true);
  const [ponds, setPonds] = useState<any>()


  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "ponds"),
      async (querySnapshot: QuerySnapshot<DocumentData>) => {
        const pondsList = await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const pondData = docSnapshot.data();
            const speciesRef = pondData.Species;
            let refreshRateRes = await getDoc(doc(db, "configs", "refreshRate"))

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
              refreshRate: refreshRateRes.data()?.value
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
    <>
      {user ? (
        <main className="flex w-full justify-center py-3">
          <div className="w-[90%] flex flex-col gap-4">
            <div className="bg-base-300 p-10 rounded-lg">
              <p className="text-center font-bold text-3xl">Main Dashboard</p>
            </div>
            {loading ? (
              <div className="flex flex-col items-center w-full p-10">
                <span className="loading loading-dots loading-lg"></span>
                <h1 className="text-xl">Please Hold on</h1>
              </div>
            ) : (
              <div className="flex overflow-x-auto gap-3">
                {ponds.map((pond: any) => (
                  <Link href={`./ponds/${pond.id}`} className="w-40% md:w-[30%] flex flex-col btn-ghost bg-base-300 p-3 rounded-md gap-2 gap-y-2 flex-shrink-0" key={pond.id}>
                    <div className="rounded-md bg-base-200 p-4 flex flex-col justify-between">
                      <div className=" flex justify-between">
                        <p className="font-bold text-lg">
                          {pond.name}
                        </p>
                        <p className="font-bold">
                          status: {pond.isActive ? <span className="font-normal text-success">Active</span> : <span className="font-normal text-warning">Idle</span>}
                        </p>
                      </div>


                    </div>

                    <div className="flex justify-between w-full items-center gap-3 p-4 bg-base-200 rounded-md">
                      <p className="font-bold">Species: <span className="font-normal">{pond.species.name}</span></p>
                      <p className="font-bold">Capacity: <span className="font-normal">{pond.capacity}</span></p>
                    </div>

                    <IoTMainDisplay pond={pond} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      ) : (
        <main className="min-h-[70vh] w-full flex flex-col gap-4 justify-center items-center text-xl">
          <p>To start using Ponder, please...</p>
          <div className="flex gap-2 items-center">
            <Link href={'/sign-up'}>
              <button className="btn btn-info text-xl">Sign-up</button>
            </Link>
            <p>or</p>
            <Link href={'/login'}>
              <button className="btn btn-info text-xl">Login</button>
            </Link>
          </div>
        </main>
      )}
    </>
  );
}
