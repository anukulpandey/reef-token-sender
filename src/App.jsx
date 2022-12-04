import './App.css';
import { web3Accounts, web3Enable, web3FromSource } from '@reef-defi/extension-dapp';
import { useEffect, useState } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { BigNumber } from 'ethers'
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import "./App.css"

// import Uik from "@reef-defi/ui-kit";


function App() {

  const [account, setAccount] = useState("");
  const [val, setVal] = useState();
  const [address, setAddress] = useState();
  const [api, setApi] = useState();
  const [error, setError] = useState("");
  const [allAcc, setAllAcc] = useState([]);
  const [wallConnected, setWalletConnection] = useState(false);
  const [idx, setIdx] = useState(0);

  const SINGLE_REEF = BigNumber.from("1000000000000000000");


  const apiInitialiser = async () => {
    await checkExtension();
    const wsProvider = new WsProvider('wss://rpc-testnet.reefscan.com/ws');
    const x = await ApiPromise.create({ provider: wsProvider });
    setApi(x);
    console.log(api);
  }

  const handleChange = (e) => {
    if (e.target.name === "address") {
      setAddress(e.target.value);
    }
    else if (e.target.name === "amount") {
      setVal(e.target.value);
    }

  }
  async function checkExtension() {
    const extensions = await web3Enable('reef');
    if (extensions.length === 0) {
      console.log("No extension detected");
      setError("Please install Reef extensions");
      setWalletConnection(false);
      return;
    }
    setWalletConnection(true);
    const allAccounts = await web3Accounts();
    setAccount(allAccounts[idx]);
    setAllAcc(allAccounts);
    console.log(account)
  }

  const signerFunc = async () => {
    await checkExtension();
    if (!account) return;
    const injector = await web3FromSource(account.meta.source);
    console.log(account.meta.name);
    if (!api) return;
    const TRANSFER_AMOUNT = SINGLE_REEF.mul(val);
    console.log(address)
    console.log(val);
    const transferExtrinsic = api.tx.balances.transfer(address, TRANSFER_AMOUNT.toString());
    transferExtrinsic.signAndSend(account.address, { signer: injector.signer }, ({ status }) => {
      if (status.isInBlock) {
        console.log(`Completed at block hash #${status.asInBlock.toString()}`);
        alert(`Sent ${val} Reefs to ${address}`);
        window.location.reload();

        setAddress("");
        setVal(0);
      } else {
        console.log(`Current status: ${status.type}`);
      }
    }).catch((error) => {
      setError(error);
      console.log(':( transaction failed', error);
    });


  }

  useEffect(() => {
    apiInitialiser();
  }, [])

  const handleClick = () => {
    checkExtension();
  }

  const handleRefresh = () => {
    let n = allAcc.length;

    setIdx((idx + 1) % n);
    setAccount(allAcc[idx]);

  }

  return (
    <div className="App">
      <Navbar bg="" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            🦊 <b>Reef0x</b>
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <div className='p4' />
        {wallConnected ?
          <div>

            <div className='p4'>
              <input type="text" placeholder='Enter Address 📬' value={address} name='address' onChange={handleChange} className="inputDesigned" required />
            </div>
            <div className='p4'>
              <input type="number" min="0" placeholder='Enter Value 💰' value={val} name='amount' onChange={handleChange} className="inputDesigned" required />
            </div>
          </div>
          : ""}
        {account ?
          <div className='p4'>
            <Button variant="dark" onClick={signerFunc}>Send Reef 💸</Button>
          </div>
          :
          <div className='p4'>
            <Button variant="dark" onClick={handleClick}>Connect Wallet 🖇️</Button>
          </div>
        }

        {error.length > 0 ?
          <Alert key='danger' variant='danger'>
            Ugh! Encountered an error!
            <b>{error}</b>
          </Alert> :
          <Alert key='success' variant='success'>
            Yay!🤩 There are no errors
          </Alert>

        }
        {account ?
          <div className='whitu'>
            <p>You are logged in as : <b>{account.meta.name}</b>🙉 <button className="refreshBtn" onClick={handleRefresh}>🔄</button></p>
            <p>Your address : {account.address}</p>
          </div>
          : ""}
      </Container>
    </div>
  );
}

export default App;
