import Resumecard from '../components/resumecard'
import Listingcard from '../components/listingcard'

import { Resume, User, Web3Data } from '../types';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';

interface FeedProps {
    user: User | null;
    web3Data: Web3Data;
    updateUser: () => void;
    chatUsers: string[];
};

const Feed = (props: FeedProps) => {

    const [resumes, setResumes] = useState<Resume[]>([]);

    useEffect(() => {

        const task = async () => {
            const resumeCountRes = await props.web3Data.contract.resumeCount();
            const resumeCount: number = resumeCountRes.toNumber();
            let resumes: Resume[] = [];
            for (let i = 1; i <= resumeCount; i++) {
                const resume = await props.web3Data.contract.resumes(i);
                resumes.push({
                    id: resume[0].toNumber(),
                    docHash: resume[1],
                    author: resume[2],
                    authorBio: resume[3],
                });

            }
            // console.log(resumes);
            setResumes(resumes);
        };
        
        task();
    }, []);

    return (
        <div className="row mt-2">
            <div className="col-md-3">
                <Sidebar chatUsers={props.chatUsers} />
            </div>
            <div className="col-md-6">
                {resumes.map((resume) => (
                    <Resumecard key={resume.id} user={props.user} web3Data={props.web3Data} resume={resume} />
                ))}
            </div>
            <div className="col-md-3">
                <Listingcard user={props.user} web3Data={props.web3Data} updateUser={props.updateUser}/>
            </div>
        </div>
    );
}

export default Feed;
