import React, { useEffect, useRef, useState } from "react";
import {
  getSaleContract,
  getTokenOwner,
  mint,
} from "../SmartContractsStuff/contractInteraction";
import styles from "../styles/NFTInformation.module.css";
import Web3Modal from "web3modal";
import { useAccount } from "wagmi";
import { connectWallet } from "../SmartContractsStuff/accountsConnect";

function NFTInformation(props) {
  const [owner, setOwner] = useState(null);
  const [mintingStatus, setMintingStatus] = useState("mint now");
  
  let nft = props.NFT;
  let toggler = props.toggler;
  let contractAddress = props.contractAddress;
  let nftPrice = parseInt(nft?.price);
  let nftOwner = nft.owner;
  nftPrice = nftPrice / 10 ** 6; // 6 decimals in Tron Blockchain

  async function mintNFT(tokenId) {
    if (nftOwner == owner) {
      alert("You already own it ..");
      return null;
    }
    alert("Stated Minting ...");

    console.log({
      contractAddress,
      tokenId,
      price: nftPrice,
    });
    setMintingStatus("Minting..");
    setTimeout(() => {
      setMintingStatus("Please Wait..");
    }, 4000);
    await mint(contractAddress, tokenId, nft?.price, successCallback);
  }
  async function successCallback() {
    setMintingStatus("Purchased Successfully 🥳");
  }

  function getMinimalAddress(adr) {
    if (!adr) return "Fetching..";
    if (adr.toString().includes("000000")) {
      return null;
    }
    return adr.slice(0, 5) + "..." + adr.slice(40);
  }

  async function connectTheWallet() {
    let adr = await connectWallet();
    setOwner(adr);
  }
  useEffect(() => {
    connectTheWallet();
  }, []);

  return (
    <div className={styles.nft__information__wrapper}>
      <div className={styles.nft__information__content}>
        <img
          className={styles.nft__information__content__image}
          src={nft.image}
        />
        <p className={styles.nft__information__content__name}>
          <p className={styles.property}>name</p>
          <p className={styles.value}>{nft.name}</p>
        </p>
        <p className={styles.nft__information__content__price}>
          <p className={styles.property}>price</p>
          <p className={styles.value}>{nftPrice} Trx</p>
        </p>
        <p className={styles.nft__information__content__owner}>
          <p className={styles.property}>owner</p>
          <p className={styles.value}>
            {getMinimalAddress(nftOwner) == null
              ? "No Owner"
              : getMinimalAddress(nftOwner)}
          </p>
        </p>

        <button
          className={styles.nft__information__content__button}
          onClick={() => mintNFT(nft.id)}
          disabled={mintingStatus !== "mint now"}
        >
          {nftOwner.toString() == owner?.toString() ? "you own it " : mintingStatus}
        </button>
        <button
          className={styles.nft__information__content__button}
          onClick={() => {
            toggler(null);
          }}
        >
          Cancel{" "}
        </button>
      </div>
    </div>
  );
}

export default NFTInformation;
