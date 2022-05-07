import React, { useEffect, useState } from 'react'
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

    if (!props.user) return (<div />);
    
    return (
        <a
            className="card m-3 hover-zoom ripple shadow-1-strong"
            href={getIPFSUrl(resume?.docHash)}
            target="_blank" rel="noreferrer"
        >
            <div className="row g-0">
                <div className="col-md-4">
                    <div className="img-fluid rounded-start thumbnail-wrapper">
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
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{resume?.author}</h5>
                        <p className="card-text text-muted">{resume?.authorBio}</p>
                    </div>
                </div>
            </div>
        </a>
    )
}

export default Resumecard
