import { getData } from "@/app/utils/thingsBoardAPI"
import { useState, useEffect } from "react"

function IotFeeds({ pond }: { pond: any }) {
    const [tempFeed, setTempFeed] = useState<any>()
    const [tempStatus, setTempStatus] = useState<any>()

    useEffect(() => {
        if (!pond.isActive) {
            return;
        }

        if (pond?.API && pond.isActive) {
            const interval = setInterval(() => {
                getData(pond.API).then(data => {
                    setTempFeed(data.temperature);

                    if (data.temperature[0].value > (pond.species.temperature - 1) && data.temperature[0].value < (pond.species.temperature + 1)) {
                        setTempStatus("bg-success");
                    } else if (data.temperature[0].value > (pond.species.temperature - 3) && data.temperature[0].value < (pond.species.temperature + 3)) {
                        setTempStatus("bg-warning");
                    } else {
                        setTempStatus("bg-error");
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
                <div className="flex items-center justify-center w-fit h-fit aspect-square">
                    {!tempFeed || !pond.isActive ? <p className="text-xl md:text-4xl">-- °C</p> : (
                        <p className="text-xl md:text-4xl">{tempFeed[0].value}°C</p>
                    )}
                </div>
            </div>
            <div className={`w-full ${tempStatus} p-4 flex flex-col items-center justify-center`}>
                <p className="text-lg font-bold">pH:</p>
                <div className="flex items-center justify-center w-fit h-fit aspect-square">
                    {!tempFeed || !pond.isActive ? <p className="text-xl md:text-4xl">-- °C</p> : (
                        <p className="text-xl md:text-4xl">{tempFeed[0].value}°C</p>
                    )}
                </div>
            </div>
            <div className={`w-full ${tempStatus} p-4 flex flex-col items-center justify-center`}>
                <p className="text-lg font-bold">DO:</p>
                <div className="flex items-center justify-center w-fit h-fit aspect-square">
                    {!tempFeed || !pond.isActive ? <p className="text-xl md:text-4xl">-- °C</p> : (
                        <p className="text-xl md:text-4xl">{tempFeed[0].value}°C</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default IotFeeds