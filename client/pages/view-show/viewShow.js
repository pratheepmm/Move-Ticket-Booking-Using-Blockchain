import React,{Component} from 'react';
import {Container,Header,Grid,Dimmer,Loader,Image,Icon} from 'semantic-ui-react'
import {getAccount} from '../../components/getAccount';
import {getContract} from '../../components/getContract';
import Layout from '../../components/layout'
import {getWeb3} from '../../components/getWeb3'
import GetSeat from '../../components/getSeat'
import Head from 'next/head';
import Router from '../../routes';
import {getBookedSeat} from '../../components/getBookedSeat';

class ViewShow extends Component{

	constructor(props){
		super(props);
		this.state = {
			account : false,
			admin : false,
			loading : true,
			amountInEther : 0
		}
	}

	static async getInitialProps(query){
		const id = query.query.id
		const {seats,name,show} = await getBookedSeat(id)
		return {id,seats,show,name}
	}

	async componentDidMount(){
		console.log('components')
		const {isAdmin,isAccount} = await getAccount()
		const {web3} = await getWeb3();
		this.setState({
			account : isAccount,
			admin : isAdmin,
			loading : false,
			amountInEther : web3.utils.fromWei(this.props.show.amount,"ether")
		})
	}

	buyTicket = async(index,seatNo,amount)=>{
		if(this.state.account){
			const {contract} = await getContract();
			const {address} = await getAccount(this.props.admin)
			this.setState({loading : true})
			try{
				await contract.methods.bookSeat(index,seatNo).send({from : address,value : amount});
				window.alert("Your Ticket has been Booked")
				Router.pushRoute("view_show",{id : this.props.id})
			}catch(e){
				window.alert(e.message)
			}
			this.setState({loading : false})
		}
		else{
			window.alert("No Account Found")
		}
	}


	render(){

		if(!this.state.loading){
			return(
				<Layout 
					name={this.props.name}
					account={this.state.account}
					id={'Logged in'}
				>
				<Grid.Row columns={2}>
					<Grid.Column>
						<Image src={`https://gateway.ipfs.io/ipfs/${this.props.show.image}`}/>
					</Grid.Column>
					<Grid.Column>
						<Header size='huge'>{this.props.show.showName}</Header>
						<Header size='medium'>{`From : ${this.props.show.fromTime}`}</Header>
						<Header size='medium'>{`To : ${this.props.show.toTime}`}</Header>
						<Header size='medium'>{`Date : ${this.props.show.date}`}</Header>
						<Header size="medium">{"Amount : "}<Icon name="ethereum"/>{`${this.state.amountInEther}`}</Header>
					</Grid.Column>
				</Grid.Row>
				<GetSeat show={this.props.show}
					seats={this.props.seats}
					buyTicket={this.buyTicket}
					showId={this.props.id}
					amount={this.props.show.amount}
					amountInEther={this.state.amountInEther}
					account={this.state.account}
				/>
				</Layout>
			)
		}
		else{
			return(
				<Container>
					<Head>
						<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
					</Head>
					<Dimmer active>
						<Loader size='massive'>Loading</Loader>
					</Dimmer>
				</Container>
			)
		}
	}
}

export default ViewShow;