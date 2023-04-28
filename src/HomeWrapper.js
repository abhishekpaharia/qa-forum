import { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import Navbar from "./Navbar";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./Home";
import CustomAlert from "./CustomAlert";
import Create from "./Create";


const HomeWrapper = ({ account, contract }) => {
    const [isUser, setIsUser] = useState(true)
    const [userName, setUserName] = useState('')
    const [fetchedUserName, setFetchedUserName] = useState('')
    const tokenPrice = 10 ** 18;
    const [regStatus, setRegStatus] = useState(0)

    useEffect(() => {
        //console.log("current account in home", account)
        //console.log("contract", contract)
        //console.log("type", typeof (contract.isUser))
        contract.isUser({ from: account }).then((status) => {
            console.log("isUser", status)
            setIsUser(status)
        })
    }, [account, isUser, contract])

    useEffect(() => {
        if (isUser) {
            contract.users(account)
                .then((user) => {
                    console.log(user)
                    setFetchedUserName(user.username)
                })
                .catch(err => console.log())

        }
    }, [isUser, account])

    const handleRegister = () => {
        //console.log("in handle register")
        contract.registerUser(userName, { from: account }).then((result) => {
            console.log("register result", result)
            //console.log("result status", result.receipt.status)
            if (result) {
                if (result.receipt.status == true) {
                    //console.log("in success",)
                    setIsUser(true)
                    setUserName('')
                    setRegStatus(1)
                }
                else
                    setRegStatus(-1)
            } else {
                setRegStatus(-2)
            }
        })
            .catch(err => {
                setRegStatus(-2)
                console.log("register err", err)
            })
    }
    return (
        <div>
            {!isUser &&
                <div>
                    <h1>User's account address is {account}</h1>
                    <div className="register" style={{ marginTop: 20 }}>
                        <label style={{ fontSize: 20, margin: 5 }}>
                            User name
                        </label>
                        <input
                            name="userName"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            style={{
                                margin: 10,
                                height: 20
                            }}
                        />
                        <button onClick={handleRegister} style={{
                            background: '#f1356d',
                            color: '#fff',
                            border: 0,
                            padding: 8,
                            borderRadius: 8,
                            cursor: 'pointer',
                        }}>Register</button>
                    </div>
                    <div>
                        {regStatus === 1 && <CustomAlert type={"success"} message={"Registration is successful"} onClose={() => {
                            setRegStatus(0)
                        }} />}
                        {regStatus === -1 && <CustomAlert type={"error"} message={"registration not done successfully due to revert"} onClose={() => setRegStatus(0)} />}
                        {regStatus === -2 && <CustomAlert type={"error"} message={"registration failed"} onClose={() => setRegStatus(0)} />}
                    </div>
                </div>
            }
            {
                isUser &&
                <div>
                    <Router>
                        <div className="App">
                            <Navbar account={account} userName={fetchedUserName} contract={contract} tokenPrice={tokenPrice} />
                            <div className="content">
                                <Routes>
                                    <Route path="/" element={<Home account={account} contract={contract}/>} />
                                    <Route path='/create' element={<Create account={account} contract={contract} />} />
                                </Routes>
                            </div>
                        </div>
                    </Router>
                </div>
            }
        </div >
    )
}

export default HomeWrapper;