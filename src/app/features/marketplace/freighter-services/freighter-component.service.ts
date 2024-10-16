import { Injectable } from '@angular/core';
import { OnInit } from '@angular/core';
import { Wallet } from '../models/wallet';
import { Memo, MemoType, Operation, Transaction } from '@stellar/stellar-sdk';
import {signTransaction, getAddress} from '@stellar/freighter-api';

@Injectable({
  providedIn: 'root'
})

export class FreighterComponentService implements Wallet, OnInit {

  private address: any;
    walletAddress: any;
  decoratorWallet: Wallet;
  constructor(wallet:Wallet) {
    this.decoratorWallet = wallet;
  }
  currentUserAddress: string | undefined;
  

  ngOnInit(): void {
  }

   initWallelt(){
    const freighterApi = (window as any).freighterApi;
    console.log("api ",freighterApi)
    console.log("----------api ",freighterApi.isConnected)
    if ((window as any).freighterApi.isConnected()) {
      return ;
    }
    else {
      alert("Please Install Freighter")
      window.location.href ="https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk?hl=en"
    }
      
  }
   getWalletaddress(): string {
    if ((window as any).freighterApi.isConnected()) {
      
    }
    this.address = this.retrievePublicKey();  
    return this.address
  }

  public  signTransaction(transaction:Transaction<Memo<MemoType>,Operation[]>): Promise<any>{
    let signedTransaction = signTransaction(transaction.toXDR(), {networkPassphrase:"TESTNET"});
    return  signedTransaction;
  }

  retrievePublicKey = async () => {
    let error = "";
  
    try {
      this.walletAddress = await getAddress();
    } catch (e) {
      console.log(e);
    }
  
    if (error) {
      return error;
    }
  
    return this.walletAddress;
  }

  public disconenctWallet(): void {
    throw new Error('Method not implemented.');
  }

  setaddress(address:string){
    this.address = address
  }
  getaddress(){
    return this.address
  }

}
