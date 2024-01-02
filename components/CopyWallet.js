"use client";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

const CopyWallet = ({ wallet }) => {
  const [copyState, setCopyState] = useState(false);
  const [errorCopy, setErrorCopy] = useState(false);

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  const CopyWallet = () => {
    navigator.clipboard
      .writeText(wallet)
      .then(() => {
        successNotification("Wallet address successfully copied to clipboard");
        setCopyState(true);
        setTimeout(() => {
          setCopyState(false);
        }, 3000);
      })
      .catch((error) => {
        errorNotification("Something went wrong. Please try again");
        setErrorCopy(true);
      });
  };

  return (
    <button disabled={copyState} onClick={CopyWallet}>
      {!copyState && (
        <div className="flex gap-2">
          {!errorCopy ? (
            <>
              <div className="flex justify-center items-center">
                <Image alt="copy-image" src="/copy.svg" width={15} height={15} />
              </div>
              <div className="font-weight-700 text-sm">COPY WALLET</div>
            </>
          ) : (
            <div>
              <div>Wallet Address: {userData?.propFirmsWallet}</div>
            </div>
          )}
        </div>
      )}
      {copyState && (
        <div className="flex gap-1">
          <div className="flex justify-center items-center">
            <Image alt="wallet-tick" src="/tick.svg" width={20} height={20} />
          </div>
          <div className="font-weight-500 text-sm">COPIED</div>
        </div>
      )}
    </button>
  );
};

export default CopyWallet;
