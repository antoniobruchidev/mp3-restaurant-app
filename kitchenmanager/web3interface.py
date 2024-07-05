import json
import os
from web3 import Web3
from eth_account import Account
from eth_account.signers.local import LocalAccount
from web3.middleware import construct_sign_and_send_raw_middleware

# create an instance of the web3 provider
w3 = Web3(Web3.HTTPProvider(os.environ.get("ALCHEMY_KEY")))

# check the connection
print('Web3 connection: ', w3.is_connected())

# check for a valid private_key
private_key = os.environ.get("PRIVATE_KEY")
assert private_key is not None, "You must set PRIVATE_KEY environment variable"
assert private_key.startswith(
    "0x"), "Private key must start with 0x hex prefix"

# access a local account with the private_key
account: LocalAccount = Account.from_key(private_key)
w3.middleware_onion.add(construct_sign_and_send_raw_middleware(account))

# access the smart contract ABI
with open('kitchenmanager/AccessManager.json') as f:
    abi=json.load(f)

# create an instance of the contract
accessmanager = w3.eth.contract(address=os.environ.get("CONTRACT_ADDRESS"), abi=abi)

# defining the functions we are going to call
has_role_func = accessmanager.get_function_by_signature(
    'hasRole(bytes32,address)')
grant_role_func = accessmanager.get_function_by_signature(
    'grantRole(bytes32,address)')
get_role_admin = accessmanager.get_function_by_signature(
    'getRoleAdmin(bytes32)')

# function to check a given role for a given address
def check_role(role, address):
    result = has_role_func(role,address).call()
    return f"{account.address} is {role} = {result}"


# function to grant a given role to a given address
def grant_role(role, granting_address, granted_address):
    # get the Admin role for the given role
    roleAdmin = get_role_admin(role)
    # check if the sender has an Admin role for the given role
    isAdmin = has_role_func(roleAdmin, granting_address)
    if isAdmin:
        # initialize the chain id, we need it to build the transaction for replay protection
        Chain_id = w3.eth.chain_id
        # call the function
        nonce = w3.eth.get_transaction_count(account.address)
        call_function = grant_role_func(
            role,granted_address
            ).build_transaction({"chainId": Chain_id, "from": account.address, "nonce": nonce})
        # Sign transaction
        signed_tx = w3.eth.account.sign_transaction(call_function, private_key=private_key)
        # Send transaction
        send_tx = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

        # Wait for transaction receipt
        tx_receipt = w3.eth.wait_for_transaction_receipt(send_tx)
        tx_hash = tx_receipt.transactionHash
        if tx_receipt.status == 1:
            return f"Success. Tx hash: {tx_hash} | Role {role} granted to {granted_address}"
        else:
            return f"Failed. {tx_receipt}"
    else:
        return f"Access denied. Sender {granting_address} is not an Admin of {role}"


