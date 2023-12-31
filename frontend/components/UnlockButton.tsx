import React, { useState } from "react";
import { useSigner } from "wagmi";
import { ethers } from "ethers";

// const feeReceiver = '0x099A294Bffb99Cb2350A6b6cA802712D9C96676A';
const feeReceiver = '0x778070825fE59026A882cAe236109ce30bD33d44';
const fee = ethers.utils.parseEther("0.0007");

const UnlockButton = ({setLocked, setTxHash, handleAlert} : {setLocked: any, setTxHash: any, handleAlert: any }) => {
    const {data: signer} = useSigner();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const buttonHandler = async() => {
        if(!signer) {
            alert('connect a wallet');
            return;
        }
        if(isLoading) return;
        let txResponse;
        let txReceipt;
        try {
            setIsLoading(true);
            const tx = {to: feeReceiver, value: fee, data:"0x00" }
            txResponse = await signer.sendTransaction(tx);
            txReceipt = await txResponse.wait();
        } catch (error) {
            console.log(error)
            // alert('tx failed');
            handleAlert(false, 'unlock');
            setIsLoading(false)
            return;
        }
        console.log('unlocking successful');
        setTxHash(txReceipt.transactionHash);
        handleAlert(true, 'unlock');
        setLocked(false);
    }

    return (
        <>
        <div className="p-4">
            <button 
            className="px-4 py-2 rounded bg-gray-500 border-4 border-white hover:bg-green-400 text-black font-mono"
            onClick={buttonHandler}
            >
                {isLoading? "unlocking..." : "unlock!"}
            </button>
        </div>
        </>
    )

}

export default UnlockButton;