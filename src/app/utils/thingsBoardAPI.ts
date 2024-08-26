import { doc, getDoc, onSnapshot } from "firebase/firestore";
import axios from "axios";
import { db } from "../firebase/config";

let cachedToken: any = null;

const listenForTokenUpdates = () => {
    const tokenDocRef = doc(db, "configs", "token");

    onSnapshot(tokenDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
            cachedToken = docSnapshot.data()?.value;
        } else {
            cachedToken = null;
            console.error("Token document not found.");
        }
    });
}
    
listenForTokenUpdates();

export const getData = async (accessKey: string) => {
    const token = cachedToken;

    const res = await axios.get(`https://demo.thingsboard.io/api/plugins/telemetry/DEVICE/${accessKey}/values/timeseries?keys=temperature,pH,DO`, {
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token
        }
    });
    return res.data;
}

