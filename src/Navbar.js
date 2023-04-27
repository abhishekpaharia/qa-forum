import { Link } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import CustomAlert from "./CustomAlert";

const Navbar = ({ userName, account, contract, tokenPrice, web3 }) => {
    const [open, setOpen] = useState(false);
    const [NFTCount, setNFTCount] = useState(0)
    const [isMsg, setIsMsg] = useState(0)
    const [balance, setBalance] = useState(0);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setNFTCount(0);
        setOpen(false);
    };


    const handleBuyNFT = () => {
        contract.purchaseTokens(NFTCount, { from: account, value: NFTCount * tokenPrice })
            .then(res => {
                console.log(res)
                setIsMsg(1)
            })
            .catch(err => {
                console.log(err)
                setIsMsg(-1)
            })
    }

    useEffect(() => {
        contract.users(account)
            .then((user) => {
                console.log("user balance ", user.balance.toString())
                setBalance(user.balance.toString())
            })
            .catch(err => console.log())
    }, [account, contract])

    useEffect(() => {
        //console.log("web3", web3)
        // web3.eth.subscribe('TokensPurchased', (a, b, c) => {
        //     console.log("event happend", a, b, c)
        // })
        contract.TokensPurchased((error, result) => {
            console.log('event error', error)
            console.log('result', result)
        })
    },[])
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
                        <Button onClick={handleClickOpen} style={{
                            color: 'white',
                            backgroundColor: '#f1356d',
                            borderRadius: '8px',
                            marginLeft: 5
                        }}>Buy NFT</Button>
                    </div>
                </nav>
            </div>
            <div style={{ flexDirection: 'column' }}>
                <h2>User name : {userName}</h2>
                <h2>Account : {account}</h2>
                <h2>NFT Balance : {balance}</h2>
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Buy NFT</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter number of NFT you want to buy
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="NFT Count"
                        fullWidth
                        variant="standard"
                        type="number"
                        onChange={e => {
                            if (e.currentTarget.valueAsNumber <= 0) {
                                e.currentTarget.value = 0
                            } else {
                                setNFTCount(e.currentTarget.value)
                            }
                        }}
                        value={NFTCount}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleBuyNFT}>Buy</Button>
                </DialogActions>
                {isMsg === 1 && <CustomAlert type="success" message="purchase is successful" onClose={() => setIsMsg(0)} />}
                {isMsg === -1 && <CustomAlert type="error" message="purchase is failed" onClose={() => setIsMsg(0)} />}
            </Dialog>
        </div>
    );
}

export default Navbar;