import React,{Component} from 'react';
import {Form,Button,Modal,Header,Image,Icon} from 'semantic-ui-react';
import TicketBooking from '../../../build/contracts/TicketBooking.json'
import Router from '../../routes';
import {getAccount} from '../getAccount';
import {getContract} from '../getContract';
import {getWeb3} from '../getWeb3';

const IPFS = require('ipfs-api');

const ipfs = new IPFS({ host: 'ipfs.infura.io', 
    port: 5001,protocol: 'https' });

class AddShow extends Component{

	constructor(props){
		super(props);
		this.state = {
			showAvailable : false,
			seatsAvailable : 0,
			showName : '',
			amount : 0,
			fromTime : '',
			toTime : '',
			date : '',
			open : false,
			fileBuffer: undefined,
			file : null
		}
	}
	fileInputRef = React.createRef()

	close = ()=>{

		this.setState({open : false})
	}

	onSubmit = async(event)=>{
		event.preventDefault();
		this.props.changeLoading(true)
		if(!this.state.fileBuffer){
			window.alert("File not been uploaded")
			this.props.changeLoading(false)
		}
		else{
			this.props.changeLoadingValue("Uploading File")
			let imageHash = await ipfs.add(this.state.fileBuffer)
			const {web3} = await getWeb3();
			const {showAvailable,seatsAvailable,showName,amount,fromTime,toTime,date} = this.state;
			const {contract} = await getContract();
			const amountWei = await web3.utils.toWei(amount.toString(),'ether');
			const adminAddr = await web3.utils.toChecksumAddress(this.props.adminAcc);
			try{
				this.props.changeLoadingValue("Loading")
				await contract.methods.addShow(showAvailable,showName,seatsAvailable,amountWei,fromTime,toTime,date,imageHash[0].hash).send({from : adminAddr})
				window.alert("Transaction Completed");
				Router.pushRoute('home');
			}catch(e){
				window.alert(e.message)
			}
			this.props.changeLoading(false)
		}

	}

	render(){

		if(this.props.admin){
			return(
				<Form>
					<Form.Group unstackable widths={2}>
						<Form.Input label='Show Name' placeholder='Show Name'
							value={this.state.showName}
						 	onChange={(event)=>this.setState({showName : event.target.value})}
						 />
						<Form.Input type='number' label='Available Seats' placeholder='Available Seats' min='0' max='10000'
							value={this.state.seatsAvailable}
						 	onChange={(event)=>this.setState({seatsAvailable : event.target.value})}
						/>
					</Form.Group>
					<Form.Group unstackable widths={2}>
						<Form.Input label='Amount' placeholder='Amount'
							value={this.state.amount}
						 	onChange={(event)=>this.setState({amount : event.target.value})
						 }
						/>
						<Form.Input type='date' label='Date'
							value={this.state.date}
						 	onChange={(event)=>this.setState({date : event.target.value})}
						 />
					</Form.Group>
					<Form.Group unstackable widths={2}>
						<Form.Input type='time' label='From Time' 
							value={this.state.fromTime}
						 	onChange={(event)=>this.setState({fromTime : event.target.value})}
						/>
						<Form.Input type='time' label='To Time' 
							value={this.state.toTime}
						 	onChange={(event)=>this.setState({toTime : event.target.value})}
						/>
					</Form.Group>
						{
							this.state.file
							?(<Form.Group unstackable widths={2}>
							<Image src={this.state.file} size="medium" rounded/>
							</Form.Group>)
							:null
						}
					<Form.Field>
		                <Button
		                  content="Choose File"
		                  color="blue"
		                  labelPosition="left"
		                  icon="file"
		                  onClick={() => this.fileInputRef.current.click()}
		                />
		                <input
		                  ref={this.fileInputRef}
		                  type="file"
		                  hidden
		                  onChange={(e)=>{
		                  	const reader = new window.FileReader()
		                  	const file = e.target.files[0]
		                  	reader.readAsArrayBuffer(file)
		                  	reader.onloadend = async()=>this.setState({
		                  		fileBuffer : await Buffer.from(reader.result),
		                  		file : URL.createObjectURL(file)
		                  		})
		                  	}}
		                />
					</Form.Field>
					<Form.Group>
					<Form.Checkbox label='Whether Show is Available for Booking' 
					 	onChange={(event)=>this.setState({showAvailable : !this.state.showAvailable})}
					/>
					</Form.Group>
					<Modal trigger={<Button color="blue" type="submit" onClick={()=>this.setState({open : true})}>Submit</Button>} centered={false} open={this.state.open} onClose={this.close}>
					<Modal.Header>Are you sure to Add this show ?</Modal.Header>
					<Modal.Content image>
						<Image wrapped size='medium' src={this.state.file}/>
						<Modal.Description>
							<Header>Name : {this.state.showName}</Header>
							<p>Seats Available : {this.state.seatsAvailable}</p>
							<p>Amount : {this.state.amount}</p>
							<p>From : {this.state.fromTime}</p>
							<p>To : {this.state.toTime}</p>
							<p>Date : {this.state.date}</p>
							<p>Whether Show is Available for booking : {this.state.showAvailable?'Yes':'No'}</p>
						</Modal.Description>
					</Modal.Content>
					<Modal.Actions>
						<Button color='red' onClick={this.close}><Icon name='remove'/>No</Button>
						<Button color='green' onClick={this.onSubmit}><Icon name='checkmark'/>Yes</Button>
					</Modal.Actions>
					</Modal>	
				</Form>
			)
		}
		else{
			return(
				<h1>You are not allowed to access this page</h1>
			)
		}
	}
}

export default AddShow;