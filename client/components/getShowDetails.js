import React from 'react';
import {getContract} from './getContract';
import {getWeb3} from './getWeb3';

export const getShowDetails = async()=>{
	const {contract} = await getContract();
	const showCount = await contract.methods.getShowCount().call()
	let shows=[];
	let {web3} = await getWeb3();
	for(var i=0;i<showCount;i++){
		const show = await contract.methods.showDetail(i).call()
		shows.push({
			showAvailable : show.showAvailable,
			showName : show.showName,
			seatsAvailable : show.seatsAvailable,
			amount : web3.utils.fromWei(show.amount,'ether'),
			fromTime : show.fromTime,
			toTime : show.toTime,
			date : show.date,
			image : show.image
		})
	}
	return {shows};

}