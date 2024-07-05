import os
from kitchenmanager import app
import kitchenmanager.web3interface as web3interface

if __name__ == "__main__":
    app.run(
        host=os.environ.get("IP"),
        port=int(os.environ.get("PORT")),
        debug=os.environ.get("DEBUG")
        )