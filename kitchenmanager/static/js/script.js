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
}

$(document).ready(function(){
    $('.sidenav').sidenav();
    $('.modal').modal();
  });