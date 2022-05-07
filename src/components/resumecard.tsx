import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Resume, User, Web3Data } from '../types';
import { getIPFSUrl } from '../utils';
const reactPdf = require('react-pdf/dist/esm/entry.webpack5')
const { Document, Page } = reactPdf

interface ResumecardProps {
    user: User | null;
    web3Data: Web3Data;
    height?: number;
    resume?: Resume;
};

function Resumecard(props: ResumecardProps) {
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [resume, setResume] = useState<Resume | null>(null);
    const navigate = useNavigate();

    function onDocumentLoadSuccess({ numPages }: { numPages: any }) {
        setNumPages(numPages)
    }

    useEffect(() => {
        if (props.resume) {
            setResume(props.resume);
            return;
        }
        const task = async () => {
            if (!props.user) return;
            // console.log("calling");
            const resume = await props.web3Data.contract.resumes(props.user.resumeId);
            setResume({
                id: resume[0].toNumber(),
                docHash: resume[1],
                author: resume[2],
                authorBio: resume[3],
            });
        };

        task();
    }, [props]);

    if (!props.user && !props.resume) return (<div />);
    
    return (
        <div
            className="card m-3 hover-zoom shadow-1-strong"
        >
            <div className="row g-0">
                <div className="col-md-3">
                    <a 
                        href={getIPFSUrl(resume?.docHash)}
                        target="_blank" rel="noreferrer" >
                    <div className="border img-fluid rounded-start thumbnail-wrapper" role="button" >
                        <Document
                            file={{
                                url: getIPFSUrl(resume?.docHash)
                            }}
                            onLoadSuccess={onDocumentLoadSuccess}
                        >
                            <Page
                                pageNumber={pageNumber}
                                height={props.height ? props.height : 200}
                                renderMode="svg"
                                renderAnnotationLayer={false}
                            />
                        </Document>
                    </div>
                    </a>
                </div>
                <div className="col-md-9">
                    <div className="card-body">
                        <h5 className="card-title" role="button" onClick={() => navigate(`/profile?handle=${resume?.author || props.user?.name}`)}>{resume?.author || props.user?.name}</h5>
                        <p className="card-text text-muted">{resume?.authorBio || props.user?.bio}</p>
                        <div className='btn btn-secondary' role='button' onClick={() => navigate(`/chat?user=${resume?.author}`)}>Chat</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Resumecard
