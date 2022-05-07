import { ethers } from "ethers";

export interface User {
    name: string;
    account: string;
    bio: string;
    resumeId: number;
};

export interface Web3Data {
    provider: ethers.providers.Web3Provider,
    signer: ethers.providers.JsonRpcSigner,
    contract: ethers.Contract,
};

export interface Resume {
    id: number;
    docHash: string;
    author: string;
    authorBio: string;
}

export interface Message {
    sender: string;
    receiver: string;
    timestamp: number;
    message: string;
}
