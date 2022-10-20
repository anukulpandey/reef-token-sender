import './App.css';
import { web3Accounts, web3Enable, web3FromSource } from '@reef-defi/extension-dapp';
import { useEffect,useState } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';


function App() {

  const [account, setAccount] = useState();
  const [val, setVal] = useState(0);
  const [address, setAddress] = useState(0);
  const [api, setApi] = useState()

  const apiInitialiser = async()=>{
    const wsProvider = new WsProvider('wss://rpc-testnet.reefscan.com/ws');
    const x = await ApiPromise.create({ provider: wsProvider });
    setApi(x);
    console.log(api);
  }

  const handleChange = (e)=>{
    if(e.target.name=="address"){
      setAddress(e.target.value);
    }
    else if(e.target.name=="amount"){
      setVal(e.target.value);
    }
    
  }
  async function checkExtension(){
    const extensions = await web3Enable('reef');
      if (extensions.length === 0) {
        console.log("No extension detected");
        return;
      }
      const allAccounts = await web3Accounts();
      setAccount(allAccounts[0]);
      console.log(account)
  }

  const signerFunc = async ()=>{
    await checkExtension();
    if(!account)return;
    const injector = await web3FromSource(account.meta.source);
    console.log(account.meta.name);
    if(!api)return;
      const txs = [];
      let i=0;
      console.log(`Sending ${val} Reefs to ${address}`);
      for(i=0;i<18*val;i++){
        txs.push(api.tx.balances.transfer(address, 0x0000000000000000001fffffffffffff))
      }
      api.tx.utility
  .batch(txs)
  .signAndSend(account.address,{ signer: injector.signer }, ({ status }) => {
    if (status.isInBlock) {
      console.log(`included in ${status.asInBlock}`);
    }
  });
      
  }

  useEffect(() => {
    apiInitialiser();
    console.log(api);
  }, [])
  
  const handleClick =()=>{
    checkExtension();
  }

  return (
    <div className="App">
      <input type="text" placeholder='enter address' name='address' onChange={handleChange}/>
      <input type="number" placeholder='enter value' name='amount' onChange={handleChange}/>

      {account?
        <button onClick={signerFunc}>Send reef</button>
        :
        <button onClick={handleClick}>Connect Wallet</button>
      }
      
    </div>
  );
}

export default App;
