import { useState } from "react";
import { User, Web3Data } from "../types";
import { create, CID, IPFSHTTPClient } from "ipfs-http-client";
import Swal from 'sweetalert2';

interface EditProfileProps {
    user: User | null;
    web3Data: Web3Data;
    updateUser: () => void;
};

const client = create({
    url: 'https://ipfs.infura.io:5001/api/v0'
});

const EditProfile = (props: EditProfileProps) => {
    const [newBio, setNewBio] = useState<string>('');

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

    const updateBio = async () => {
        const res = await props.web3Data.contract.updateBio(newBio);
        console.log(res);
        setNewBio('');
        props.updateUser();
    }

    return (
        <div className="text-center row justify-content-center border border-light p-5">
            <div className="col-12 col-md-6 col-lg-4">
                <p className="h4 mb-4">Edit Your bio</p>
                <textarea className="form-control mb-4" placeholder="Enter your bio" value={newBio} onChange={(e) => setNewBio(e.target.value)} />
                <button className="btn btn-info btn-block my-4" onClick={() => updateBio()}>update Bio</button>
                <div className="card text-white bg-primary m-3 hover-shadow">
                    <div className="card-header">
                        {props.user?.resumeId === 0 ?
                            'Want to get listed?'
                            :
                            ''
                        }
                        <br />
                        Upload Your Resume
                        <hr />
                        <input className="form-control form-control" id="formFileLg" type="file" onChange={(e) => captureFile(e)} />
                        {uploading ? 'uploading...' : docHash ? <button type='submit' className='btn btn-success mt-2' onClick={() => onSubmit()}>Submit</button> : ''}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default EditProfile;
