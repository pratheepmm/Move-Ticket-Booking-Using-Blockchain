import React from 'react';
import {getWeb3} from './getWeb3';

export const getAccount = async(admin)=>{
	let address;
	let isAdmin = false, isAccount = false;

	if(typeof window!='undefined' && typeof window.ethereum!='undefined'){
		try{
			await window.ethereum.enable();
			address = await ethereum.selectedAddress
			if(address){
				isAccount = true;
			}
		}
		catch(e){
			window.alert(e.message)
		}
	}

	else if(typeof window!='undefined' && typeof window.web3!='undefined' && typeof window.web3.eth!='undefined' ){
		window.web3.eth.getAccounts((err,acc)=>{
			if(err){
				window.alert(err.message);
			}
			else{
				if(acc.length >= 1)
				isAccount = true;
				address = acc;
			}
		})	
	}
	if(address){
		const {web3} = await getWeb3();
		if(admin === web3.utils.toChecksumAddress(address))
			isAdmin = true;
	}
	return {isAccount,isAdmin,address}
}