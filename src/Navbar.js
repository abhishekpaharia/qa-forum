import { Link } from "react-router-dom";
const Navbar = ({ userName, address }) => {
    return (
        <div style={{ flexDirection: 'column' }}>
            <div style={{ flexDirection: 'row' }}>
                <nav className="navbar">
                    <h1>the web3 QA forum</h1>
                    <div className="links">
                        <a href="/">Home</a>
                        <a href="/create" style={{
                            color: 'white',
                            backgroundColor: '#f1356d',
                            borderRadius: '8px'
                        }}>New question</a>
                    </div>
                </nav>
            </div>
            <div style={{ flexDirection: 'column' }}>
                <h2>User name : {userName}</h2>
                <h2>Account : {address}</h2>
            </div>
        </div>
    );
}

export default Navbar;