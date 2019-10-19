import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// DISCLAIMER: Code snippets in this guide are just examples and you
// should always do your own testing. If you have questions, visit our
// https://t.me/KyberDeveloper.

// Importing the relevant packages
const Web3 = require("web3");
const Tx = require("ethereumjs-tx").Transaction;
const BN = require("bignumber.js");

// Connecting to ropsten infura node
const PROJECT_ID = "e4d24ff74a94463c8c8bffe74114c69b" //Replace this with your own Project ID
var WS_PROVIDER;
var web3;
var KYBER_NETWORK_PROXY_CONTRACT 
var SRC_TOKEN_CONTRACT 
// Token Details
const SRC_TOKEN = "KNC";
const DST_TOKEN = "ZIL";
const SRC_TOKEN_ADDRESS = "0x4E470dc7321E84CA96FcAEDD0C8aBCebbAEB68C6";
const DST_TOKEN_ADDRESS = "0xaD78AFbbE48bA7B670fbC54c65708cbc17450167";
const SRC_DECIMALS = 18;
const DST_DECIMALS = 12;
const MAX_ALLOWANCE = "115792089237316195423570985008687907853269984665640564039457584007913129639935";

//Contract ABIs and addresses
const ERC20_ABI = [{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"supply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"digits","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}];
const KYBER_NETWORK_PROXY_ABI = [{"constant":false,"inputs":[{"name":"alerter","type":"address"}],"name":"removeAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"enabled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pendingAdmin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOperators","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"destAddress","type":"address"},{"name":"maxDestAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"},{"name":"walletId","type":"address"},{"name":"hint","type":"bytes"}],"name":"tradeWithHint","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"}],"name":"swapTokenToEther","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"maxGasPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newAlerter","type":"address"}],"name":"addAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kyberNetworkContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getUserCapInWei","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"minConversionRate","type":"uint256"}],"name":"swapTokenToToken","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"transferAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"claimAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"minConversionRate","type":"uint256"}],"name":"swapEtherToToken","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"transferAdminQuickly","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAlerters","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"},{"name":"dest","type":"address"},{"name":"srcQty","type":"uint256"}],"name":"getExpectedRate","outputs":[{"name":"expectedRate","type":"uint256"},{"name":"slippageRate","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"},{"name":"token","type":"address"}],"name":"getUserCapInTokenWei","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOperator","type":"address"}],"name":"addOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_kyberNetworkContract","type":"address"}],"name":"setKyberNetworkContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"operator","type":"address"}],"name":"removeOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"field","type":"bytes32"}],"name":"info","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"destAddress","type":"address"},{"name":"maxDestAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"},{"name":"walletId","type":"address"}],"name":"trade","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"token","type":"address"},{"name":"user","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_admin","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"trader","type":"address"},{"indexed":false,"name":"src","type":"address"},{"indexed":false,"name":"dest","type":"address"},{"indexed":false,"name":"actualSrcAmount","type":"uint256"},{"indexed":false,"name":"actualDestAmount","type":"uint256"}],"name":"ExecuteTrade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newNetworkContract","type":"address"},{"indexed":false,"name":"oldNetworkContract","type":"address"}],"name":"KyberNetworkSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"TokenWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"EtherWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"pendingAdmin","type":"address"}],"name":"TransferAdminPending","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAdmin","type":"address"},{"indexed":false,"name":"previousAdmin","type":"address"}],"name":"AdminClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAlerter","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"AlerterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOperator","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"OperatorAdded","type":"event"}];

// Kyber Network Proxy Contract Address
const KYBER_NETWORK_PROXY_ADDRESS = "0x818e6fecd516ecc3849daf6845e3ec868087b755";

// Trade Details
const SRC_QTY = "10";
const SRC_QTY_WEI = (SRC_QTY * 10 ** SRC_DECIMALS).toString();
const GAS_LIMIT = '500000';

// User Details
const PRIVATE_KEY = Buffer.from("4AB80464E14C1EF9F1459EBD5C85ACBC195AADDF8958A8F91DCFD9087C71F5F1", "hex"); //exclude 0x prefix
var USER_ADDRESS = '0xBE4dD6Bae372CBA479176297b67D0D42447aFAE6'

// Wallet Address for Fee Sharing Program
//If none, set to 0x0000000000000000000000000000000000000000 (null address)
const REF_ADDRESS = "0x0000000000000000000000000000000000000000";
//const REF_ADDRESS = "0x0000000000000000000000000000000000000000"

// Get the contract instances


async function main() {
  // Calculate slippage rate
  let results = await getRates(SRC_TOKEN_ADDRESS, DST_TOKEN_ADDRESS, SRC_QTY_WEI);
  console.log("slipage rate", results)
  // Check KyberNetworkProxy contract allowance
  console.log('U')
  let contractAllowance = await SRC_TOKEN_CONTRACT.methods
    .allowance(USER_ADDRESS, KYBER_NETWORK_PROXY_ADDRESS)
    .call();
    console.log("contract allowance", contractAllowance)
  // If insufficient allowance, approve else convert KNC to ETH.
  console.log('Useraddress',USER_ADDRESS)
  if (SRC_QTY_WEI <= contractAllowance) {
    await trade(
      SRC_TOKEN_ADDRESS,
      SRC_QTY_WEI,
      DST_TOKEN_ADDRESS,
      '0x0acb691fF5530040C5cBf275623e7641058B5Ccb',
      MAX_ALLOWANCE,
      results.slippageRate,
      REF_ADDRESS
    ).catch(error => console.log(error));
  } else {
    console.log('I am in approve contract')
    await approveContract(MAX_ALLOWANCE);
    await trade(
      SRC_TOKEN_ADDRESS,
      SRC_QTY_WEI,
      DST_TOKEN_ADDRESS,
      USER_ADDRESS,
      MAX_ALLOWANCE,
      results.slippageRate,
      REF_ADDRESS
    ).catch(error => console.log(error));;
  }
  
}

// Function to obtain conversion rate between src token and dst token
async function getRates(SRC_TOKEN_ADDRESS,DST_TOKEN_ADDRESS,SRC_QTY_WEI) {
  return await KYBER_NETWORK_PROXY_CONTRACT.methods
    .getExpectedRate(SRC_TOKEN_ADDRESS, DST_TOKEN_ADDRESS, SRC_QTY_WEI)
    .call();
}

// Function to convert src token to dst token
async function trade(
  srcTokenAddress,
  srcQtyWei,
  dstTokenAddress,
  dstAddress,
  maxDstAmount,
  minConversionRate,
  walletId
) {
  console.log(`Converting ${SRC_TOKEN} to ${DST_TOKEN}`);
  let txData = await KYBER_NETWORK_PROXY_CONTRACT.methods
    .trade(
      srcTokenAddress,
      srcQtyWei,
      dstTokenAddress,
      dstAddress,
      maxDstAmount,
      minConversionRate,
      walletId
    )
    .encodeABI();

  await broadcastTx(
    USER_ADDRESS,
    KYBER_NETWORK_PROXY_ADDRESS,
    txData,
    0, //Ether value to be included in the tx
    GAS_LIMIT //gasLimit
  );
}

// Auxiliary function
// Function to broadcast transactions
async function broadcastTx(from, to, txData, value, gasLimit) {
  let txCount = await web3.eth.getTransactionCount(USER_ADDRESS);
  console.log('Txcount',txCount)
  //Method 1: Use a constant
  // let gasPrice = new BN(5).times(10 ** 9); //5 Gwei
  //Method 2: Use web3 gasPrice
  // let gasPrice = await web3.eth.gasPrice;
  //Method 3: Use KNP Proxy maxGasPrice
  let gasPrice = await KYBER_NETWORK_PROXY_CONTRACT.methods.maxGasPrice().call();

  let maxGasPrice = await KYBER_NETWORK_PROXY_CONTRACT.methods
    .maxGasPrice()
    .call();
  //If gasPrice exceeds maxGasPrice, set it to max.
  if (gasPrice >= maxGasPrice) gasPrice = maxGasPrice;
  console.log('gasprice',gasPrice)
  console.log('maxgas',maxGasPrice)
  let rawTx = {
    from: from,
    to: to,
    data: txData,
    value: web3.utils.toHex(value),
    gasLimit: web3.utils.toHex(gasLimit),
    gasPrice: web3.utils.toHex(gasPrice),
    nonce: txCount
  };

  // let tx = new Tx(rawTx, {chain:'ropsten', hardfork: 'petersburg'});

  //  tx.sign(PRIVATE_KEY);
  // const serializedTx = tx.serialize();
  // console.log('serialisedtx',serializedTx)
  // let txReceipt = await web3.eth.sendTransaction('0x' + serializedTx.toString('hex'))
  // .catch(error => console.log(error));
  web3.eth.sendTransaction(rawTx,() =>{
    console.log('suucess')
  }).catch(error => console.log(error))
  // Log the tx receipt
  // console.log(txReceipt);
  return;
}

async function approveContract(allowance) {
  console.log("Approving KNP contract to manage my KNC");
  let txData = await SRC_TOKEN_CONTRACT.methods
    .approve(KYBER_NETWORK_PROXY_ADDRESS, allowance)
    .encodeABI();
  console.log('tx data',txData, USER_ADDRESS)
  
  await broadcastTx(
    USER_ADDRESS,
    SRC_TOKEN_ADDRESS,
    txData,
    0, //Ether value to be sent should be zero
    "300000" //gasLimit
  ).catch(error => console.log(error));
}



class App extends Component {

  
  async componentDidMount(){
    try{
      const accounts = await window.ethereum.enable()
      console.log(accounts)
      var providerone = window.ethereum

      web3 = new Web3(window.ethereum);
      WS_PROVIDER = providerone
       KYBER_NETWORK_PROXY_CONTRACT = new web3.eth.Contract(
        KYBER_NETWORK_PROXY_ABI,
        KYBER_NETWORK_PROXY_ADDRESS
      );
       SRC_TOKEN_CONTRACT = new web3.eth.Contract(ERC20_ABI, SRC_TOKEN_ADDRESS);
       USER_ADDRESS = accounts[0]
        console.log(USER_ADDRESS)
    }
    catch(error){
      window.alert(error)
    }
   await this.callback().catch(error => console.log(error))
  }

  async callback(){
    main()
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
