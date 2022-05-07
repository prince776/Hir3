import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import { User, Web3Data } from "../types";

interface SignupProps {
    user: User | null;
    web3Data: Web3Data;
};

const Signup = (props: SignupProps) => {

    const [name, setName] = useState<string>('');
    const [bio, setBio] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        if (props.user) {
            navigate('/');
        }
    }, [props.user]);

    const onSignup = async () => {
        if (!name) {
            Swal.fire({
                title: 'Error!',
                icon: 'error',
                text: 'Username can\'t be empty',
                confirmButtonText: 'Go back',
            });
        }
        const res = await props.web3Data.contract.registerUser(name, bio);
    }

    return (
        <div className="text-center row justify-content-center border border-light p-5">
            <div className="col-12 col-md-6 col-lg-4">
                <p className="h4 mb-4">Sign up</p>
                <input type="text" className="form-control mb-4" placeholder="Enter a username" value={name} onChange={(e) => setName(e.target.value)} />
                <textarea className="form-control mb-4" placeholder="Enter your bio" value={bio} onChange={(e) => setBio(e.target.value)} />
                <br/>
                <button className="btn btn-info btn-block my-4" onClick={() => onSignup()}>Sign up</button>
            </div>
        </div>
    );
}

export default Signup;
