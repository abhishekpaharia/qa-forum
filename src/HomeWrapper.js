import { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import Navbar from "./Navbar";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./Home";


const HomeWrapper = ({ account, contract }) => {
    const [isUser, setIsUser] = useState(true)
    const [userName, setUserName] = useState('')
    const [fetchedUserName, setFetchedUserName] = useState('')

    useEffect(() => {
        console.log("current account in home", account)
        //console.log("contract", contract)
        //console.log("type", typeof (contract.isUser))
        contract.isUser({ from: account }).then((status) => {
            console.log("status", status)
            setIsUser(status)
        })
    }, [account, isUser, contract])

    useEffect(() => {
        if (isUser) {
            contract.users(account).then((user) => {
                console.log(user)
                setFetchedUserName(user.username)
            })

        }
    }, [isUser, account])

    const handleRegister = () => {
        console.log("in handle register")
        contract.registerUser(userName, { from: account }).then((result) => {
            console.log("register result", result)
            console.log("result status", result.receipt.status)
            if (result) {
                if (result.receipt.status == true) {
                    console.log("in success",)
                    setIsUser(true)
                    setUserName('')
                    return (<Alert severity="success">registration done successfully</Alert>)
                }
                else
                    return (<Alert severity="error">registration not done successfully due to revert</Alert>)
            } else {
                return (<Alert severity="error">registration failed</Alert>)
            }
        })
            .catch(err => {
                console.log("register err", err)
                return (<Alert severity="error">{err.message}</Alert>)
            })
    }
    return (
        <div>
            {!isUser &&
                <div>
                    <div>User's account address is {account}</div>
                    <div className="register">
                        <label>
                            User name
                            <input
                                name="userName"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)} />
                        </label>
                        <button onClick={handleRegister}>Register</button>
                    </div>
                </div>
            }
            {isUser &&
                <div>
                    <Router>
                        <div className="App">
                            <Navbar address={account} userName={fetchedUserName} />
                            <div className="content">
                                <Home/>
                                {/* <Routes>
                                    <Route></Route>
                                </Routes> */}
                            </div>
                        </div>
                    </Router>
                </div>
            }
        </div>
    )
}

export default HomeWrapper;