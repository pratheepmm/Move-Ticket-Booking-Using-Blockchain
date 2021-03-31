import React,{Component} from 'react';
import Layout from '../../components/layout'
import {getContract} from '../../components/getContract'
import {getAccount} from '../../components/getAccount'
import EditShow from '../../components/admin-components/editShow'
import {Container,Loader,Dimmer,Grid} from 'semantic-ui-react'
import Head from 'next/head'

class UpdateShow extends Component{

	constructor(props){
		super(props);
		this.state = {
			admin : false,
			loading : true,
			loadingValue : "Loading"
		}
	}

	static async getInitialProps(query){
		const {contract} = await getContract();
		const name = await contract.methods.name().call();
		const admin = await contract.methods.admin().call();
		const id = query.query.id
		const show = await contract.methods.showDetail(id).call()
		return {name,admin,show,id}
	}

	async componentDidMount(){
		const {isAdmin} = await getAccount(this.props.admin)
		console.log(isAdmin)
		this.setState({
			admin : isAdmin,
			loading : false,
			loadingValue : "Loading"
		})
	}

	changeLoadingState = (loadingState)=>{
		this.setState({
			loading : loadingState
		})
	}

	changeLoadingValue = (value)=>{
		this.setState({
			loadingValue : value
		})
	}

	render(){
		if(!this.state.loading){
			return(
				<Layout
					id={'Admin'}
					account={this.state.admin}
					name={this.props.name}
				>
					<Grid.Row>
						<Grid.Column>
							<EditShow 
								admin={this.state.admin}
								adminAcc={this.props.admin}
								show={this.props.show}
								id={this.props.id}
								changeLoadingState={this.changeLoadingState}
								changeLoadingValue={this.changeLoadingValue}
							/>
						</Grid.Column>
					</Grid.Row>
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
						<Loader size='massive'>{this.state.loadingValue}</Loader>
					</Dimmer>
				</Container>
			)
		}
	}
}

export default UpdateShow