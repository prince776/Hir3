import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { User, Web3Data } from "../types";
import { loadUser } from "../utils";
import EditProfile from "./EditProfile";
import Resumecard from "./resumecard";

interface ProfileProps {
    user: User | null;
    web3Data: Web3Data;
    updateUser: () => void;
};

const Profile = (props: ProfileProps) => {

    const [handle, setHandle] = useState<string>('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [thisUser, setThisUser] = useState<User | null>(null);
    const [newBio, setNewBio] = useState<string>('');

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
    // console.log("props user:", props.user);


    return (
        <div>
            <br />
            <div className="row justify-content-center">
                <div className="col-8 col-6-md col-4-lg">
                    <Resumecard user={thisUser} web3Data={props.web3Data} height={350} />
                </div>
            </div>
            {
                props.user && thisUser && thisUser.name === props.user.name ?
                    <EditProfile user={props.user} web3Data={props.web3Data} updateUser={props.updateUser}/>
                    :
                    <div />
            }
        </div>
    )
}

export default Profile;
