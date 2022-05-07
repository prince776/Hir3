import Resumecard from '../components/resumecard'
import Listingcard from '../components/listingcard'

import sample_feed from '../sample_data/sample_feed.json'
import { Resume, User, Web3Data } from '../types';
import { useEffect, useState } from 'react';

interface FeedProps {
    user: User | null;
    web3Data: Web3Data;
    updateUser: () => void;
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

                console.log(resume);
            }
            console.log(resumes);
            setResumes(resumes);
        };
        
        task();
    }, []);

    return (
        <div className="row">
            <div className="col-md-3">
            <nav className="navbar navbar-light navbar-expand-sm px-0 flex-row flex-nowrap">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarWEX" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                 <div className="navbar-collapse collapse" id="navbarWEX">
                    <div className="nav flex-sm-column flex-row">
                        <a className="nav-item nav-link active" href="#">Home</a>
                        <a href="#" className="nav-item nav-link">Link</a>
                        <a href="#" className="nav-item nav-link">Link</a>
                        <a href="#" className="nav-item nav-link">Link</a>
                    </div>
                </div>
            </nav>
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
