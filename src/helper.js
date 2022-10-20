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