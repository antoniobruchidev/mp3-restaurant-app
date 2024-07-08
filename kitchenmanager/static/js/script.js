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
  window.provider = new ethers.providers.Web3Provider(window.ethereum);
  // MetaMask requires requesting permission to connect users accounts
  const accounts = await provider.send("eth_requestAccounts", []);
  const address =  await accounts[0];

  if (window.walletAddress !== address) {
    console.log(`new wallet address detected. switch from ${window.walletAddress} to ${address}`)
    window.walletAddress = address;
  }

  // The MetaMask plugin also allows signing transactions to
  // send ether and pay to change state within the blockchain.
  // For this, you need the account signer...
  const signer = provider.getSigner()
  window.localStorage.setItem('walletAddress', address);
  $('.modal-content > h4').text('Welcome')
  $('.modal-content > p').text(`Connected as ${address}`);
  $('#signin').addClass('hidden');
  return true;
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
    document.getElementById("metamask").addEventListener("click", checkRole)
    return true;
  }
}
const CONTRACTADDRESS = '0xdC6e9723a63d17752A36dDC50AA7646c0597081f'
const ABI = [
  "function supportsInterface(bytes4) view returns (bool)",
  "function hasRole(bytes32, address) view returns (bool)",
  "function getRoleAdmin(bytes32) view returns (bytes32)",
  "function grantRole(bytes32, address)",
  "function revokeRole(bytes32, address)",
  "function renounceRole(bytes32, address)"
]

const role = (roleId) => {
  switch(roleId) {
    case 1:
      // hash value of smart contract constant OWNER_ROLE
      return '0xb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e'
    case 2:
      // hash value of smart contract constant MANAGER_ROLE
      return '0x241ecf16d79d0f8dbfb92cbc07fe17840425976cf0667f022fe9877caa831b08'
    case 3:
      // hash value of smart contract constant CHEF_ROLE
      return '0xbb95cca64affbe55a6a6f6b690ae1c8525d24dc953087f6db9a21e7cb374b385'
    case 4:
      // hash value of smart contract constant WAITER_ROLE
      return '0xcb57d3fb43d2386a5b9956d50e3893564d63703e540d4377ea7d0ea153e406d8'
    case 5:
      // hash value of smart contract constant USER_ROLE
      return '0x14823911f2da1b49f045a0929a60b8c1f2a7fc8c06c7284ca3e8ab4e193a08c8'
  }
}

const enableEndpoints = (endpoints) => {
  $(endpoints[0]).on('click', function(){
    window.open(`/owner/${window.walletAddress}`, target='_self')
  });
  $(endpoints[1]).on('click', function(){
    window.open(`/manager/${window.walletAddress}`, target='_self')
  });
  $(endpoints[2]).on('click', function(){
    window.open(`/chef/${window.walletAddress}`, target='_self')
  });
  $(endpoints[3]).on('click', function(){
    window.open(`/waiter/${window.walletAddress}`, target='_self')
  });
  $(endpoints[4]).on('click', function(){
    window.open(`/customer/${window.walletAddress}`, target='_self')
  });
  $(endpoints[5]).on('click', function(){
    window.localStorage.setItem('walletAddress', "loggedout");
    window.open('/', target='_self')
   });
}

const checkRole = async () => {
  const isConnected = await connectMetamask();
  console.log(isConnected);
  if (isConnected){
    const accessManager = new ethers.Contract(CONTRACTADDRESS, ABI, window.provider)
    const endpoints = $('#endpoints button');
    for (let i = 0; i < endpoints.length -1; i++) {
      const roleHash = role(i+1);
      const isRole = await accessManager.hasRole(roleHash,window.walletAddress);
      if (isRole === true) {
        $(endpoints[i]).removeClass('hidden');
      } 
    }
    $(endpoints[endpoints.length-1]).removeClass('hidden');
    enableEndpoints(endpoints);
  } else {
    console.log("Metamask not connected");
  }
}

const openModal = () => {
  modalInstance.open();
  if((window.walletAddress !== null)&&(window.walletAddress !== "loggedout")) {
    checkRole();
  }
  
}

$(document).ready(function(){
    $('.sidenav').sidenav();
    $('.modal').modal();
    modalInstance = M.Modal.getInstance($('#login-modal'));
    if(checkInstalled()){
      window.walletAddress = window.localStorage.getItem('walletAddress');
      if((window.walletAddress !== null)&&(window.walletAddress !== "loggedout")) {
        connectMetamask();
      }
    }
  });