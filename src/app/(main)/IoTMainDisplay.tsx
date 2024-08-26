import { useEffect, useState } from "react";
import { getData } from "../utils/thingsBoardAPI";

function IoTMainDisplay({ pond }: { pond: any }) {
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
                        setTempStatus("progress-success");
                    } else if (data.temperature[0].value > (pond.species.temperature - 2) && data.temperature[0].value < (pond.species.temperature + 2)) {
                        setTempStatus("progress-warning");
                    } else {
                        setTempStatus("progress-error");
                    }

                    if (data.pH[0].value > (pond.species.pH - 1) && data.pH[0].value < (pond.species.pH + 1)) {
                        setpHStatus("progress-success")
                    } else if (data.pH[0].value > (pond.species.pH - 2) && data.pH[0].value < (pond.species.pH + 2)) {
                        setpHStatus("progress-warning")
                    } else {
                        setpHStatus("progress-error")
                    }

                    if (data.DO[0].value > (pond.species.DO - 1) && data.DO[0].value < (pond.species.DO + 1)) {
                        setDOStatus("progress-success")
                    } else if (data.DO[0].value > (pond.species.DO - 2) && data.DO[0].value < (pond.species.DO + 2)) {
                        setDOStatus("progress-warning")
                    } else {
                        setDOStatus("progress-error")
                    }
                });
            }, pond.refreshRate);

            return () => clearInterval(interval);
        }
    }, [pond]);

    if (pond.isActive) {
        return (
            <div className="bg-base-200 rounded-md p-4 flex flex-col justify-between">
                <p className="font-bold mb-2">Temperature: <span className="font-normal">{tempFeed ? tempFeed[0].value : "--"}</span></p>
                <progress className={`progress w-full mb-5 ${tempStatus}`} value={tempFeed ? tempFeed[0].value : "0"} max="35"></progress>
                <p className="font-bold mb-2">pH: <span className="font-normal">{pHFeed ? pHFeed[0].value : "--"}</span></p>
                <progress className={`progress w-full mb-5 ${pHStatus}`} value={pHFeed ? pHFeed[0].value : "0"} max="35"></progress>
                <p className="font-bold mb-2">DO: <span className="font-normal">{DOFeed ? DOFeed[0].value : "--"}</span></p>
                <progress className={`progress w-full mb-5 ${DOStatus}`} value={DOFeed ? DOFeed[0].value : "0"} max="35"></progress>
            </div>
        )
    }
    return (
        <div className="bg-base-200 rounded-md p-4 flex flex-col justify-between relative">
            <div className="absolute flex justify-center items-center w-full h-full bg-black/70 left-0 top-0 rounded-md">This pond is idle</div>
            <p className="font-bold mb-2">Temperature: <span className="font-normal">--</span></p >
            <progress className="progress w-full mb-5" value="0" max="35"></progress>
            <p className="font-bold mb-2">pH: <span className="font-normal">--</span></p>
            <progress className="progress w-full mb-5" value="0" max="35"></progress>
            <p className="font-bold mb-2">DO: <span className="font-normal">--</span></p>
            <progress className="progress w-full mb-5" value="0" max="35"></progress>
        </div >
    )

}

export default IoTMainDisplay