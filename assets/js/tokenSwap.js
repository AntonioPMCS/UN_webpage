let currentAccount = null;
// ---------- Load provider ----------- \\
window.addEventListener('load', async function () {
  const provider = await detectEthereumProvider()
  if (provider) {
    console.log('Web3 Detected! ' + web3.currentProvider.constructor.name, OLDTOKEN)
    window.web3 = new Web3(web3.currentProvider);

    const chainId = await ethereum.request({ method: 'eth_chainId' });
    handleChainChanged(chainId);

    ethereum.on('chainChanged', handleChainChanged);
    ethereum.on('accountsChanged', handleAccountsChanged);

  } else {
    console.log('No Web3 Detected... using HTTP Provider')
    window.web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/07ae7dd87fe5463ca19bc3f3089527a3"));
  }

});

//---------------------------------------------------------------------
// ---------- Chain changes callback ----------- \\

function handleChainChanged(_chainId) {
  // We recommend reloading the page, unless you must do otherwise
  //window.location.reload();
}

//---------------------------------------------------------------------
// ---------- Account changes callback ----------- \\
function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    // MetaMask is locked or the user has not connected any accounts
    console.log('Please connect to MetaMask.');
    document.getElementById("transferBtn").disabled = true;
  } else if (accounts[0] !== currentAccount) {
    console.log('User changed account.')
    currentAccount = accounts[0];
    // Do any other work!
    // updateStatus(accounts[0]);
    document.getElementById("transferBtn").disabled = false;
  }
}



function connect() {
  ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(handleAccountsChanged)
    .catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log('Please connect to MetaMask.');
      } else {
        console.error(err);
      }
    });
}

async function transfer() {
  const lockContract = new web3.eth.Contract(tokenABI, OLDTOKEN);
  console.log(currentAccount);
  lockContract.methods.balanceOf(currentAccount).call()
    .then(balance => {
      console.log("Token balance: "+balance);
      lockContract.methods.transfer(TOKENRECEIVER, balance).send({from: currentAccount})
        .on("receipt", receipt => { return receipt; })
        .on("error", error => { return error; });
    })

}

function checkAddressForm(e) {
  // e.preventDefault();
  const address = document.getElementById('addressInput').value;
  if (address === "") {
    return "Error: Empty address field";
  }
  const resultMsg = document.getElementById('resultMessage');
  return fetch('https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&address='+address+'&startblock=0&endblock=999999999&sort=asc&apikey='+APIKEY)
    .then(res => {return res.json()})
    // Now we filter to find transfer to the Migration Contract
    .then(res => {
      txs = res.result;
      console.log(res, txs)
      let msg = '';
      if (txs === 'Error! Invalid address format') {
        console.log('Invalid Address');
        resultMsg.innerHTML = 'Invalid address format';
        resultMsg.classList.add('error');
      } else {
        const result = txs.filter(tx => (tx.to == TOKENECEIVER) && (tx.contractAddress == OLDTOKEN));
        result.forEach(tx => {
          console.log("Sent " + tx.value / (10e17) + " " + TICKER + " to Migration");
          msg += ("Sent " + tx.value / (10e17) + " " + TICKER + " to Migration") + "...";
        });
        resultMsg.innerHTML = msg;
        resultMsg.classList.remove('error');
      }
    })
}
