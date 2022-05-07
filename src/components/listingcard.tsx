import React, { useState } from 'react'
import { User, Web3Data } from '../types';

import { create, CID, IPFSHTTPClient } from "ipfs-http-client";
import Swal from 'sweetalert2';

interface ListingcardProps {
    user: User | null;
    web3Data: Web3Data;
    updateUser: () => void;
};
const client = create({
    url: 'https://ipfs.infura.io:5001/api/v0'
});


function Listingcard(props: ListingcardProps) {

    const [docHash, setDocHash] = useState<string>('');
    const [uploading, setUploading] = useState<boolean>(false);

    const captureFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const file = event.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const added = await (client as IPFSHTTPClient).add(file);
        setUploading(false);
        setDocHash(added.path);
    }

    const onSubmit = async () => {
        try {
            const res = await props.web3Data.contract.uploadResume(docHash);
            setDocHash('');
            props.updateUser();
        } catch (_e) {
            Swal.fire({
                title: 'Error!',
                icon: 'error',
                text: 'Some error occured',
                confirmButtonText: 'Go back',
            });
        }
    }

    return (
        <div>
            <div className="card text-white bg-primary m-3 position-fixed hover-shadow">
                    {props.user ?
                        (<div className="card-header">
                            {props.user?.resumeId === 0 ?
                                'Want to get listed?'
                                :
                                ''
                            }
                            <br/>
                            Upload Your Resume
                            <hr/>
                            <input className="form-control form-control" id="formFileLg" type="file" onChange={(e) => captureFile(e)} />
                            {uploading ? 'uploading...' : docHash ? <button type='submit' className='btn btn-success mt-2' onClick={() => onSubmit()}>Submit</button> : ''}
                        </div>)
                        :
                        ''
                    }
                <div className="card-body">
                    <p className="card-text">
                        Recruiters keep scrolling different resumes to choose
                        the right candidate for the job.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Listingcard
