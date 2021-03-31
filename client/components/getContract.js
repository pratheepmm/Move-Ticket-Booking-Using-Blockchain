import React from 'react';
import {getWeb3} from './getWeb3';
import TicketBooking from '../../build/contracts/TicketBooking.json'


export const getContract = async()=>{
	let contract;
	const {web3,networkId} = await getWeb3()
	const netData = TicketBooking.networks[networkId]
	if(netData){
		contract = await new web3.eth.Contract(TicketBooking.abi,netData.address);
	}
	else if(typeof window!='undefined'){
		window.alert("please change your network selection");
	}
	return {contract}
}