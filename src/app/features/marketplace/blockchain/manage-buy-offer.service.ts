import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Asset, Horizon, Networks, Operation, TransactionBuilder} from '@stellar/stellar-sdk';
import albedo from '@albedo-link/intent';

@Injectable({
  providedIn: 'root'
})
export class ManageBuyOfferService {
  userSignedTransaction: any;

  constructor() { }
  blockchainNetType:string=environment.NETWORK_TYPE
  blockchainNet:string=environment.BLOCKCHAIN_NETWORK
  buyToken(
    /*transactionResult:string,*/
     asset_code:string,
     asset_issuer:string,
     previousOwnerNFTPK: string, //* Distributor PK
     userPK:string,
     price: string
   ) {
     return new Promise((resolve, reject) => {//buyers secret key
       console.log("params in buy : ",asset_code,asset_issuer,userPK,previousOwnerNFTPK,price)
       if (this.blockchainNetType === "test") {
         Networks.TESTNET
       } else {
         Networks.PUBLIC
       }
       var buyAsset = new Asset(asset_code, asset_issuer);
       var sellingAsset = Asset.native();
      
       var opts = {
         fee: '100',
         timebounds: {
           minTime: '0',
           maxTime: '0',
         },
         networkPassphrase: Networks.TESTNET,
       };
       let server = new Horizon.Server(this.blockchainNet)
       console.log("server starting")
       server
         .loadAccount(userPK)
         .then(async (account:any) => {
           var transaction = new TransactionBuilder(account, opts)
           .addOperation(
            Operation.changeTrust({
              asset: buyAsset,
              limit: "1",
              source: userPK,
            })
          ) 
             .addOperation(
               Operation.manageBuyOffer({
                 selling: sellingAsset,
                 buying: buyAsset,
                 buyAmount: '1',
                 price: price,
                 offerId: "0",
               })
             )
             .addOperation(
               Operation.manageData({
                 name: "Origin Issuer",
                 value: asset_issuer,
               })
             )
             .addOperation(
               Operation.manageData({
                 name: "Current Owner",
                 value: userPK,
               })
             )
             .addOperation(
               Operation.manageData({
                 name: "Previous Owner",
                 value: previousOwnerNFTPK,
               })
             )
             .setTimeout(80000)
             .build();
           console.log("sign start")
          //  let walletf = new UserWallet();
          //  walletf = new FreighterComponentService(walletf);
          //  this.userSignedTransaction = await walletf.signTransaction(transaction)
          //  const transactionToSubmit = TransactionBuilder.fromXDR(
          //    this.userSignedTransaction,
          //    Networks.TESTNET
          //  );
          //  return server.submitTransaction(transactionToSubmit);
          let txn = transaction.toEnvelope().toXDR().toString('base64');
          console.log("txn ---------",txn)
          return albedo.tx({
            xdr: txn,
            network: Networks.TESTNET,
            submit: true,
          })
          .then(result => {
            console.log("Albedo transaction result: ", result);
            resolve(result);
          })
          .catch(error => {
            console.error("Error from albedo.tx: ", error);
            reject(error);
          });
         })
         .then((transactionResult:any) => {
           console.log("Buying of NFT was successful",transactionResult);
           resolve(transactionResult);
         })
         .catch((err:Error) => {
           reject(err);
         });
     });
   }
}
