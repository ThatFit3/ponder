import { db } from "@/app/firebase/config";
import { collection, DocumentData, onSnapshot, QuerySnapshot, query, where, orderBy } from "firebase/firestore";
import moment from "moment";
import { useEffect, useState } from "react"

function HarvestRecord({ pond }: { pond: any }) {
    const [records, setRecords] = useState<any>([])

    useEffect(() => {
        let q = query(
            collection(db, "records"),
            where("Pond", "==", pond.id),
            orderBy("insertDate", "desc")
        );

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot: QuerySnapshot<DocumentData>) => {
                const recordList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as any[];
                setRecords(recordList);
            }
        );

        return () => unsubscribe();
    }, [pond]);

    return (
        <>
            <div className="col-span-3 w-full bg-base-300 rounded-md h-full p-4">
                <div className="flex justify-between items-center px-2 mb-3">
                    <p className="font-bold text-lg">Recent record(s)</p>
                    <button className="btn btn-ghost btn-sm" onClick={() => document.getElementById("see-records").showModal()}>See all &gt;</button>
                </div>
                <div className="overflow-x-auto border border-base-200 rounded-md">
                    <table className="table ">
                        <thead>
                            <tr>
                                <th colSpan={2} className="border border-base-200">Inserted</th>
                                <th colSpan={2} className="border border-base-200">Harvested</th>
                            </tr>
                            <tr>
                                <th className="border border-base-200">date</th>
                                <th className="border border-base-200">amount</th>
                                <th className="border border-base-200">date</th>
                                <th className="border border-base-200">amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.slice(0, 2).map((record: any) => (
                                <tr key={record.id}>
                                    <th>{moment(record?.insertDate?.toDate()).format('D/MM/YYYY')}</th>
                                    <td>{record.inserted}</td>
                                    <th>{record.harvestDate ? moment(record.harvestDate.toDate()).format('D/MM/YYYY') : "--"}</th>
                                    <th className="font-normal">{record.harvested ? record.harvested : "--"}</th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <dialog id="see-records" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <h3 className="font-bold text-3xl text-center mb-3">All the records for {pond.name}</h3>
                    <div className="p-3">
                        <div className="overflow-x-auto border border-base-200 rounded-md">
                            <table className="table ">
                                <thead>
                                    <tr>
                                        <th rowSpan={2} className="border border-base-200">No.</th>
                                        <th colSpan={2} className="border border-base-200">Inserted</th>
                                        <th colSpan={2} className="border border-base-200">Harvested</th>
                                    </tr>
                                    <tr>
                                        <th className="border border-base-200">date</th>
                                        <th className="border border-base-200">amount</th>
                                        <th className="border border-base-200">date</th>
                                        <th className="border border-base-200">amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((record: any, i: number) => (
                                        <tr key={record.id}>
                                            <td className="border border-base-200">{i + 1}</td>
                                            <th>{moment(record?.insertDate?.toDate()).format('D/MM/YYYY')}</th>
                                            <td>{record.inserted}</td>
                                            <th>{record.harvestDate ? moment(record.harvestDate.toDate()).format('D/MM/YYYY') : "--"}</th>
                                            <th className="font-normal">{record.harvested ? record.harvested : "--"}</th>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <button className="btn" onClick={() => document.getElementById('close-records').submit()}>Close</button>
                </div>
                <form method="dialog" className="modal-backdrop" id="close-records">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}

export default HarvestRecord