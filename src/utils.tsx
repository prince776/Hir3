import { ethers } from "ethers";
import { User, Web3Data, Message } from "./types";

export async function getBalance(provider: ethers.providers.Web3Provider, account: string) {
    const balance = await provider.getBalance(account);
    return ethers.utils.formatEther(balance);
}

export const loadUser = async (web3Data: Web3Data, handle: string) => {
    try {
        const userData = await web3Data.contract.getUser(handle);
        const res: User = {
            name: userData[0],
            bio: userData[1],
            resumeId: userData[2].toNumber(),
            account: '',
        };
        return res;
    } catch (_e) { 
        return null;
    }
}

export const getIPFSUrl = (docHash: string | null | undefined) => {
    if (!docHash) docHash = 'bafybeibxwjfafotsap227mga2sp77xebihk3j4ckwyp7n5nuta5ohtnqe4';
    return `https://ipfs.infura.io/ipfs/${docHash}`;
}

export const parseMessageString = (messageString: string): Message => {
    const tokens = messageString.split(':');
    const msgTokens = tokens.slice(3);
    return {
        sender: tokens[0],
        receiver: tokens[1],
        timestamp: +tokens[2],
        message: msgTokens.join(':'),
    };
}

function formatDate(nowDate: Date) {
    return nowDate.getDate() +"/"+ (nowDate.getMonth() + 1) + '/'+ nowDate.getFullYear();
}
