window.walletAddress = null;
let modalInstance;

/**
 * Function to decode Google user credentials
 * @param {*} credential 
 * @returns 
 */
const decodeJWT = (credential) => {
  var tokens = credential.split('.');
  return JSON.parse(atob(tokens[1]));
}

/**
 * Function to handle Google Signin response
 * @param {*} response 
 */
function handleCredentialResponse(response) {
  const userCredential = decodeJWT(response.credential);
  console.log(userCredential.sub, userCredential.name, userCredential.email);
  modalInstance.close()
}

/** Function to connect to metamask */
const connectMetamask = async () => {
  // A Web3Provider wraps a standard Web3 provider, which is
  // what MetaMask injects as window.ethereum into each page
  window.provider = new ethers.providers.Web3Provider(window.ethereum)

  // MetaMask requires requesting permission to connect users accounts
  const accounts = await provider.send("eth_requestAccounts", []);
  const address =  await accounts[0];

  // The MetaMask plugin also allows signing transactions to
  // send ether and pay to change state within the blockchain.
  // For this, you need the account signer...
  const signer = provider.getSigner()
  window.walletAddress = address;
  modalInstance.close()
}

/**function to check if metamask in installed */
const checkInstalled = () => {
  if (typeof window.ethereum == 'undefined') {
    $('#metamaskResponse').text('Please install Metamask');
    $('#googleResponse').text("You can still access with Google!")
    return false;
  } else {
    $('#metamaskResponse').text('Please connect wallet');
    $('#googleResponse').text("You can always access with Google!")
    document.getElementById("metamask").addEventListener("click", connectMetamask)
    return true;
  }
}

$(document).ready(function(){
    $('.sidenav').sidenav();
    $('.modal').modal();
    modalInstance = M.Modal.getInstance($('#login-modal'));
    checkInstalled()
  });