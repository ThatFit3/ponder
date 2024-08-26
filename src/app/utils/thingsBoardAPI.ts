import { doc, getDoc } from "firebase/firestore";
import axios from "axios";
import { db } from "../firebase/config";

const getToken = async (): Promise<string | undefined> => {
    const tokenDoc = await getDoc(doc(db, "configs", "token"));
    return tokenDoc.exists() ? tokenDoc.data()?.value : undefined;
}

export const getData = async (accessKey: string) => {
    const token = await getToken();

    if (!token) {
        throw new Error("Token not found.");
    }

    const res = await axios.get(`https://demo.thingsboard.io/api/plugins/telemetry/DEVICE/${accessKey}/values/timeseries?keys=temperature,pH,DO`, {
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token
        }
    });
    return res.data;
}
