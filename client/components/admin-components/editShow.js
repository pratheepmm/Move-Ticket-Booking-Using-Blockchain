import React,{Component} from 'react';
import {Form,Button,Image,Modal,Icon,Header} from 'semantic-ui-react'
import {getWeb3} from '../getWeb3'
import {getContract} from '../getContract'
import Router from '../../routes'

const IPFS = require('ipfs-api')
const ipfs = new IPFS({ host: 'ipfs.infura.io', 
    port: 5001,protocol: 'https' });

class EditShow extends Component{


	constructor(props){
		super(props);
		this.state = {
			showName : '',
			availableSeats : 0,
			showAvailable : false,
			amount : 0,
			fromTime : '',
			toTime : '',
			date : '',
			image : '',
			fileBuffer : undefined,
			file : undefined,
			open : false
		}
	}
	fileInputRef = React.createRef()

	async componentDidMount(){
		const show = this.props.show
		const {web3} = await getWeb3()
		this.setState(
			{
				showName : show.showName,
				availableSeats : show.seatsAvailable,
				amount : web3.utils.fromWei(show.amount,'ether'),
				date : show.date,
				showAvailable : show.showAvailable,
				fromTime : show.fromTime,
				toTime : show.toTime,
				image : show.image
			}
		)
		const date = new Date()
		
	}

	close = ()=>{
		this.setState({open : false})
	}

	onSubmit = async(event)=>{
		event.preventDefault()
		let imageHash
		if(this.state.file!= undefined && !this.state.fileBuffer){
			window.alert("File Not Uploaded")
		}
		else{
			this.props.changeLoadingState(true)
			if(this.state.file){
				this.props.changeLoadingValue("Uploading File")
				
				imageHash = await ipfs.add(this.state.fileBuffer)
				imageHash = imageHash[0].hash
				this.props.changeLoadingValue("Loading")
			}
			else{
				imageHash = this.state.image
			}
			const {web3} = await getWeb3()
			const {contract} = await getContract()
			const adminAddr = web3.utils.toChecksumAddress(this.props.adminAcc)
			const amountWei = web3.utils.toWei(this.state.amount,'ether')
			const {showName,availableSeats,amount,fromTime,toTime,date} = this.state
			try{
				await contract.methods.updateShow(
					this.props.id,this.state.showName,this.state.availableSeats,amountWei,this.state.fromTime,this.state.toTime,this.state.date,imageHash
				).send({from:adminAddr})
				Router.pushRoute('home')
			}
			catch(e){
				window.alert(e.message)
			}
			this.props.changeLoadingState(false)
		}
	}

	makeShowAvailable = async()=>{
		this.props.changeLoadingState(true);
		const {contract} = await getContract();
		const {web3} = await getWeb3();
		const adminAddr = web3.utils.toChecksumAddress(this.props.adminAcc)
		if(this.state.showAvailable){
			try{
				await contract.methods.makeShowNotAvailable(this.props.id).send({from : adminAddr})
				Router.pushRoute('home')
			}catch(e){
				window.alert(e.message)
			}
		}
		else{
			try{
				await contract.methods.makeShowAvailable(this.props.id).send({from : adminAddr})
				Router.pushRoute('home')
			}catch(e){
				window.alert(e.message)
			}
		}
		this.props.changeLoadingState(false);
	}

	render(){
		if(this.props.admin){
			return(
				<Form>
					<Form.Group unstackable widths={2}>
						<Form.Input label="Show Name" placeholder="Show Name"
							value={this.state.showName}
							onChange={(e)=>{this.setState({showName : e.target.value})}}
						/>
						<Form.Input label="Available Seats" placeholder="Available Seats"
							value={this.state.availableSeats}
							onChange={(e)=>{this.setState({availableSeats : e.target.value})}}
						/>
					</Form.Group>
					<Form.Group unstackable widths={2}>
						<Form.Input label="Amount" placeholder="Amount"
							value={this.state.amount}
							onChange={(e)=>{this.setState({amount : e.target.value})}}
						/>
						<Form.Input label="date" type="date" 
							value={this.state.date}
							onChange={(e)=>{this.setState({date : e.target.value})}}
						/>
					</Form.Group>
					<Form.Group unstackable widths={2}>
						<Form.Input label="From Time" type="time" 
							value={this.state.fromTime}
							onChange={(e)=>{this.setState({fromTime : e.target.value})}}
						/>
						<Form.Input label="To Time" type="time" 
							value={this.state.toTime}
							onChange={(e)=>{this.setState({toTime : e.target.value})}}
						/>
					</Form.Group>
					<Form.Group unstackable widths={2}>
						{
							this.state.file
							?<Image src={this.state.file} size="medium" rounded/>
							:<Image src={`https://gateway.ipfs.io/ipfs/${this.state.image}`} size="medium" rounded />
						}
					</Form.Group>
					<Form.Group unstackable widths={2}>
						<Form.Field>
							<Button
								content="Choose File"
								labelPosition="left"
								icon="file"
								color="blue"
								onClick={()=>this.fileInputRef.current.click()}
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
					</Form.Group>
					<Form.Group unstackable widths={2}>
						<Form.Field>
							<Modal trigger={<Button type="submit" color="blue" onClick={()=>this.setState({open: true})}>Update</Button>} open={this.state.open} onClose={this.close}>
								<Modal.Header>Are you sure to Update this show ?</Modal.Header>
									<Modal.Content image>
										{
											this.state.file
											?<Image wrapped size='medium' src={this.state.file}/>
											:<Image wrapped size='medium' src={`https://gateway.ipfs.io/ipfs/${this.state.image}`}/>
										}
										<Modal.Description>
											<Header>Name : {this.state.showName}</Header>
											<p>Seats Available : {this.state.availableSeats}</p>
											<p>Amount : {this.state.amount}</p>
											<p>From : {this.state.fromTime}</p>
											<p>To : {this.state.toTime}</p>
											<p>Date : {this.state.date}</p>
											<p>Whether Show is Available for booking : No</p>
										</Modal.Description>
									</Modal.Content>
									<Modal.Actions>
										<Button color='red' onClick={this.close}><Icon name='remove'/>No</Button>
										<Button color='green' onClick={this.onSubmit}><Icon name='checkmark'/>Yes</Button>
									</Modal.Actions>
						</Modal></Form.Field>
					</Form.Group>
					<Form.Field>
						<Button color={this.state.showAvailable?'green':'red'} onClick={this.makeShowAvailable}>{
									this.state.showAvailable?("Make Show Not Available"):("Make Show Available")
								}
						</Button>
					</Form.Field>
				</Form>
			)
		}
		else{
			return <h1>You are not allowed to access this page</h1>
		}
	}
}

export default EditShow;