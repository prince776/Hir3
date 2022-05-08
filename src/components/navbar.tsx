import { useNavigate } from "react-router-dom";
import { User, Web3Data } from "../types"
import Identicon from '@polkadot/react-identicon';
import { Link } from "react-router-dom";

interface NavbarProps {
    user: User | null;
    web3Data: Web3Data;
};

function Navbar(props: NavbarProps) {
    const navigate = useNavigate();
    return (
        <div className="navbar-accent sticky-top">
            <nav className="navbar navbar-expand navbar-light bg-light">
                <div className="container">
                    <Link to='/' className="navbar-brand">
                        {/* <h1>Hir3</h1> */}
                        <img src="logo.png" width={150}/>
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-mdb-toggle="collapse"
                        data-mdb-target="#navbarButtonsExample"
                        aria-controls="navbarButtonsExample"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <i className="fas fa-bars"></i>
                    </button>

                    <div
                        className="collapse navbar-collapse"
                        id="navbarButtonsExample"
                    >
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>

                        {
                            props.user ?
                                <div>
                                    <Identicon
                                        value={props.user.account}
                                        size={32}
                                        theme={'polkadot'}
                                    />
                                    <div onClick={() => navigate('/profile')} className="btn btn-primary">{props.user.name}</div>
                                </div>
                                :
                                <div className="d-flex align-items-center">
                                    <button
                                        type="button"
                                        className="btn btn-primary me-3"
                                        data-toggle="modal" data-target="#modalLoginForm"
                                        onClick={() => navigate('/signup')}
                                    >
                                        Sign up
                                    </button>
                                </div>
                        }
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
