import { create, CID, IPFSHTTPClient } from "ipfs-http-client";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from 'sweetalert2';
import { User, Web3Data } from "../types";
import { loadUser } from "../utils";
import Listingcard from "./listingcard";
import Resumecard from "./resumecard";

interface ProfileProps {
    user: User | null;
    web3Data: Web3Data;
    updateUser: () => void;
};

const client = create({
    url: 'https://ipfs.infura.io:5001/api/v0'
});

const Profile = (props: ProfileProps) => {

    const [handle, setHandle] = useState<string>('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [thisUser, setThisUser] = useState<User | null>(null);

    useEffect(() => {
        let queryHandle = searchParams.get('handle');
        if (!queryHandle) {
            if (props.user)
                queryHandle = props.user.name;
        }
        if (queryHandle) {
            setHandle(queryHandle);
        }
        if (!queryHandle) return;
        // console.log("Set handle is: ", queryHandle)
        if (queryHandle === props.user?.name) {
            setThisUser(props.user);
            return;
        }
        loadUser(props.web3Data, queryHandle).then(thisUser => {
            setThisUser(thisUser);
        })
    }, [props.user]);

    // console.log("this user:", thisUser);
    return (
        <div>
            <br />
            <div className="row justify-content-center">
                <div className="col-8 col-6-md col-4-lg">
                    <Resumecard user={thisUser} web3Data={props.web3Data} height={350} />
                </div>
            </div>
            {/* {
                thisUser?.name === props.user?.name ?
                    (
                        <div className="text-center row justify-content-center border border-light p-5">
                            <div className="col-12 col-md-6 col-lg-4">
                                <p className="h4 mb-4">Edit Your Profile</p>
                                <textarea className="form-control mb-4" placeholder="Enter your bio" value={thisUser?.bio} onChange={(e) => setThisUser({ ...thisUser, bio: e.target.value})} />
                                <br />
                                <button className="btn btn-info btn-block my-4" onClick={() => onSignup()}>Sign up</button>
                            </div>
                        </div>
                    )
                    :
                    <div />
            } */}
        </div>
    )
}

export default Profile;
