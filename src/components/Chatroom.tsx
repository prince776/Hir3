import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Message, User, Web3Data } from "../types";
import Listingcard from "./listingcard";
import Resumecard from "./resumecard";
import Sidebar from "./Sidebar";

interface ChatroomProps {
    user: User | null;
    web3Data: Web3Data;
    updateUser: () => void;
    chatUsers: string[];
    messages: Message[];
};

const Chatroom = (props: ChatroomProps) => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [receiver, setReceiver] = useState<string>('');

    const [currMsg, setCurrMsg] = useState<string>('');

    useEffect(() => {
        let receiver = searchParams.get('user');
        if (receiver) {
            setReceiver(receiver);
        }
    }, [props, searchParams]);

    useEffect(() => {

        const newMessages: Message[] = [];
        for (const message of props.messages) {
            if ((message.sender === props.user?.name && message.receiver === receiver)
                || (message.receiver === props.user?.name && message.sender === receiver)) {
                newMessages.push(message);
            }
        }
        console.log(newMessages);
        setMessages(newMessages);

    }, [receiver, props]);
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!props.user) return;
        if (e.key === 'Enter') {
            const newMessage: Message = {
                sender: props.user.name,
                receiver: receiver,
                message: currMsg,
                timestamp: new Date().getTime() / 1000,
            };
            props.web3Data.contract.sendMessage(newMessage.receiver, newMessage.message);
            setMessages([...messages, newMessage]);
            setCurrMsg('');
        }
    }

    return (
        <div className="row mt-2">
            <div className="col-md-3">
                <Sidebar chatUsers={props.chatUsers} activeName={receiver}/>
            </div>

            <div className="col-md-7">
            <div className="p-2 h4 border-bottom">Chat History: {receiver}</div>
                <div className="row border m-2" style={{maxHeight: '70vh', overflow: 'auto'}}>

                    {
                        messages.map((message, idx) => {
                            if (message.sender === receiver) {
                                return (
                                    <div className="row">
                                        <div  key={idx} className='border border-primary col-9 m-1' style={{overflow: 'auto'}}>
                                            <strong>{new Date(message.timestamp * 1000).toLocaleString()}:</strong> {message.message}
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="row">
                                        <div className="col"></div>
                                        <div  key={idx} className='border border-success col-9 mt-1 mb-1' style={{overflow: 'auto'}}>
                                            <strong>{new Date(message.timestamp * 1000).toLocaleString()}:</strong> {message.message}
                                        </div>
                                    </div>
                                );
                            }
                        })
                    }

                </div>
                <input type="text" className="form-control mb-4" placeholder="Enter a message" value={currMsg} onChange={(e) => setCurrMsg(e.target.value)} onKeyDown={(e) => handleKeyDown(e)}/>
            </div>
            <div className="col-md-2">
            </div>
        </div>
    );
};

export default Chatroom