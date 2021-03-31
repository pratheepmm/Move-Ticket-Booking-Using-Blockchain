import React,{Component} from 'react';
import Layout from '../../components/layout';
import {getContract} from '../../components/getContract';
import {getAccount} from '../../components/getAccount';
import AddShow from '../../components/admin-components/addShow'
import {Grid,Container,Loader,Dimmer} from 'semantic-ui-react';
import Head from 'next/head'

class AdminAddShow extends Component{

	constructor(props){
		super(props);
		this.state = {
			admin : false,
			loading : true,
			loadingValue : "Loading"
		}
	}
	static async getInitialProps(){
		const {contract} = await getContract();
		const name = await contract.methods.name().call()
		const admin = await contract.methods.admin().call()
		return{name,admin}
	}

	async componentDidMount(){
		const {isAdmin,isAccount} = await getAccount(this.props.admin);
		this.setState({
			admin : isAdmin,
			loading : false
		})
	}

	changeLoading = (load)=>{
		this.setState({loading : load})
		console.log("got it ....")
	}

	changeLoadingValue = (value)=>{
		this.setState({loadingValue : value})
	}

	render(){

		if(!this.state.loading){

			return(
				<Layout 
					id={'Admin'}
					account={this.state.admin}
					name={this.props.name}
					>
					<Grid.Row><Grid.Column>
						<AddShow admin={this.state.admin}
							adminAcc={this.props.admin}
							changeLoading={this.changeLoading}
							changeLoadingValue={this.changeLoadingValue}
						/>
					</Grid.Column> </Grid.Row>
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

export default AdminAddShow;