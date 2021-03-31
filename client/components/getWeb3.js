import React from 'react';
import Web3 from 'web3';

export const getWeb3 = async()=>{

	let web3,networkId;
	
	if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'){

		web3 = new Web3(window.ethereum);
		const connect = await window.ethereum.enable();
		networkId = await window.ethereum.networkVersion
	}

	else if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined'){

		web3 = new Web3(window.web3.currentProvider);
		networkId = await web3.eth.net.getId();
	}

	else{

		const provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/0468426dce2148b480c61bc7c52be067");
		web3 = new Web3(provider);
		networkId = await web3.eth.net.getId();
	}
	return {web3,networkId}
}