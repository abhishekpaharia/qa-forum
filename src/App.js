
import { useEffect, useState } from 'react';
import './App.css';
import Web3 from 'web3';
import contractJSON from "./json/QAForum.json"
import HomeWrapper from './HomeWrapper';

var config = require('@truffle/contract');

function App() {

  var web3Provider = null
  var web3 = null
  var accounts = null
  const [currentAccount, setCurrentAccount] = useState('')
  const [currentContract, setCurrentContract] = useState(null)
  var url = 'http://127.0.0.1:7545'
  var owner = null;
  window.ethereum.on('accountsChanged', (account) => {
    console.log("on account change", account)
    setCurrentAccount(account)
  })

  const [isPending, setIsPending] = useState(true);

  const initWeb3 = async () => {
    //------------connecting to web3------------
    // Is there is an injected web3 instance?
    if (web3 && typeof web3 !== 'undefined') {
      web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      web3Provider = new Web3.providers.HttpProvider(url);
    }
    web3 = new Web3(web3Provider);

    //-------------getting accounts----------------------------
    //window.ethereum.enable();
    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    accounts = await web3.eth.getAccounts();
    console.log(accounts)
    console.log("current", window.ethereum.selectedAddress)
    setCurrentAccount(window.ethereum.selectedAddress)
    //App.populateAddress();
    //return App.initContract();

    //----------------getting contract--------------------
    const theContract = config(contractJSON);
    theContract.setProvider(web3.eth.currentProvider);
    theContract.deployed().then((contract) => {
      setCurrentContract(contract)
      //console.log("contract", contract)
      contract.owner().then(own => {
        owner = own
        console.log("owner", owner)
        setIsPending(false);
      })
    });
  }

  useEffect(() => {
    initWeb3()
  }, [currentAccount])

  return (
    <div className="App">
      {!isPending && <HomeWrapper account={currentAccount} contract={currentContract} />}
      {isPending && <div><h1>Loading.....</h1></div>}
    </div>
  );
}

export default App;
