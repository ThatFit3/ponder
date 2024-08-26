import { getData } from "@/app/utils/thingsBoardAPI"
import { useState, useEffect } from "react"

function IotFeeds({ pond }: { pond: any }) {
    const [tempFeed, setTempFeed] = useState<any>()
    const [pHFeed, setpHFeed] = useState<any>()
    const [DOFeed, setDOFeed] = useState<any>()
    const [tempStatus, setTempStatus] = useState<any>()
    const [pHStatus, setpHStatus] = useState<any>()
    const [DOStatus, setDOStatus] = useState<any>()

    useEffect(() => {
        if (!pond.isActive) {
            return;
        }

        if (pond?.API && pond.isActive) {
            const interval = setInterval(() => {
                getData(pond.API).then(data => {
                    setTempFeed(data.temperature);
                    setpHFeed(data.pH);
                    setDOFeed(data.DO);

                    if (data.temperature[0].value > (pond.species.temperature - 1) && data.temperature[0].value < (pond.species.temperature + 1)) {
                        setTempStatus("bg-success");
                    } else if (data.temperature[0].value > (pond.species.temperature - 2) && data.temperature[0].value < (pond.species.temperature + 2)) {
                        setTempStatus("bg-warning");
                    } else {
                        setTempStatus("bg-error");
                    }

                    if (data.pH[0].value > (pond.species.pH - 1) && data.pH[0].value < (pond.species.pH + 1)) {
                        setpHStatus("bg-success")
                    } else if (data.pH[0].value > (pond.species.pH - 2) && data.pH[0].value < (pond.species.pH + 2)) {
                        setpHStatus("bg-warning")
                    } else {
                        setpHStatus("bg-error")
                    }


                    if (data.DO[0].value > pond.species.DO) {
                        setDOStatus("bg-success")
                    } else {
                        setDOStatus("bg-error")
                    }
                });
            }, pond.refreshRate);

            return () => clearInterval(interval);
        }
    }, [pond]);

    return (
        <>
            <div className={`w-full ${tempStatus} p-4 flex flex-col items-center justify-center`}>
                <p className="text-lg font-bold">Temperature:</p>
                <div className="flex items-center justify-center w-fit h-fit my-5">
                    {!tempFeed || !pond.isActive ? <p className="text-xl md:text-4xl">-- °C</p> : (
                        <p className="text-xl md:text-4xl">{tempFeed[0].value} °C</p>
                    )}
                </div>
            </div>
            <div className={`w-full ${pHStatus} p-4 flex flex-col items-center justify-center`}>
                <p className="text-lg font-bold">pH:</p>
                <div className="flex items-center justify-center w-fit h-fit my-5">
                    {!pHFeed || !pond.isActive ? <p className="text-xl md:text-4xl">-- °C</p> : (
                        <p className="text-xl md:text-4xl">{pHFeed[0].value}</p>
                    )}
                </div>
            </div>
            <div className={`w-full ${DOStatus} p-4 flex flex-col items-center justify-center`}>
                <p className="text-lg font-bold">DO:</p>
                <div className="flex items-center justify-center w-fit h-fit my-5">
                    {!DOFeed || !pond.isActive ? <p className="text-xl md:text-4xl">-- °C</p> : (
                        <p className="text-xl md:text-4xl">{DOFeed[0].value}</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default IotFeeds