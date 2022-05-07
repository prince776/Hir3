import React, { useEffect, useState } from 'react'
import Signup from './Signup'
import { Routes, Route } from 'react-router-dom';
import '../App.css'
import Navbar from '../components/navbar'

import DHire from '../abis/DHire.json';

import { ethers } from "ethers";
import { getBalance, parseMessageString } from '../utils'
import { Message, User, Web3Data } from '../types'
import Feed from './Feed';
import Profile from './Profile';
import Chatroom from './Chatroom';

const ethereum = window.ethereum!;

const f = async () => {
    await ethereum.enable();
};
f();

const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
const networkVersion = ethereum.networkVersion as string;
const contractNetworkData = DHire.networks[networkVersion as keyof typeof DHire.networks];
if (!contractNetworkData) {
    alert('DHire smart contract is not deployed to detected network');
}
const contractAddress = contractNetworkData['address'];
const contract = new ethers.Contract(contractAddress, DHire.abi, signer);

const web3Data: Web3Data = {
    provider: provider,
    signer: signer,
    contract: contract,
};

function Home() {

    const [account, setAccount] = useState<string>('');
    const [balance, setBalance] = useState<string>('0');

    const [user, setUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatUsers, setChatUsers] = useState<string[]>([]);
    
    useEffect(() => {
        window.ethereum.request({ method: 'eth_requestAccounts' }).then((res: string[]) => {
            setAccount(res[0]);
            loadUser(res[0]).then(async user => {
                setUser(user);
            });
            // contract.sendMessage('cmc', 'yo cmc your yt sucks');
        });
        getBalance(provider, account).then(balance => {
            setBalance(balance);
        });
    }, []);

    const loadUser = async (account: string) => {
        try {
            const userData = await contract.getSelf();
            const res: User = {
                name: userData[0],
                bio: userData[1],
                resumeId: userData[2].toNumber(),
                account: account,
            };
            return res;
        } catch (_e) {
            return null;
        }
    }

    const updateUser = async () => {
        if (!user) return;
        setUser(await loadUser(user.account));
    }
    
    useEffect(() => {
        console.log(user);
        const task = async () => {
            if (!user) return;
            const messageStrings = await contract.getMessages();
            console.log(messageStrings);
            const messages: Message[] = [];
            const chatUsers = new Set<string>();
            for (const messageString of messageStrings) {
                if (messageString.split(':').length <= 3) continue;
                messages.push(parseMessageString(messageString));
                chatUsers.add(messages[messages.length - 1].sender);
            }
            setMessages(messages);
            setChatUsers(Array.from(chatUsers.values()));
        };
        task();
    }, [user])

    return (
        <div className="App">
            <Navbar user={user} web3Data={web3Data}/>
            <Routes>
                <Route path='/' element={<Feed user={user} web3Data={web3Data} updateUser={updateUser} chatUsers={chatUsers}/>} />
                <Route path='/signup' element={<Signup user={user} web3Data={web3Data}/>} />
                <Route path='/profile' element={<Profile user={user} web3Data={web3Data} updateUser={updateUser} />} />
                <Route path='/chat' element={<Chatroom user={user} web3Data={web3Data} updateUser={updateUser} chatUsers={chatUsers} messages={messages}/>} />
            </Routes>
        </div>
    )
}

export default Home;