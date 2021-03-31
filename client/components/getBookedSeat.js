import React from 'react';
import {getContract} from './getContract'

export const getBookedSeat = async(id)=>{

	const {contract} = await getContract()
	const name = await contract.methods.name().call()
	const showCount = await contract.methods.getShowCount().call();
	let show;
	let seats=[];
	console.log(showCount)
	if(id<showCount && id>=0){
		show = await contract.methods.showDetail(id).call()
		seats = await contract.methods.getBookedSeats(id).call()
	}
	return {seats,show,name}
}