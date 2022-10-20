const transferExtrinsic = api.tx.balances.transfer('5CVL4WVCci97ngm1JCokmTwznwWMk6ukXRd9EVaYeEUf9SDx', Number.MAX_SAFE_INTEGER),
      transferExtrinsic.signAndSend(account.address, { signer: injector.signer }, ({ status }) => {
        if (status.isInBlock) {
            console.log(`Completed at block hash #${status.asInBlock.toString()}`);
            console.log(account);
        } else {
            console.log(`Current status: ${status.type}`);
        }
    }).catch((error) => {
        console.log(':( transaction failed', error);
    });

    const txs = [];
      let i=0;
      console.log(`Sending ${val} Reefs to ${address}`);
      for(i=0;i<18*val;i++){
        txs.push(api.tx.balances.transfer(address, 100000000000000))
      }
      api.tx.utility
  .batch(txs)
  .signAndSend(account.address,{ signer: injector.signer }, ({ status }) => {
    if (status.isInBlock) {
      console.log(`included in ${status.asInBlock}`);
    }
});