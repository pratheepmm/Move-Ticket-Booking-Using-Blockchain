import React,{Component} from 'react';
import Layout from '../components/layout';
import {getContract} from '../components/getContract'
import {getShowDetails} from '../components/getShowDetails';
import ShowDetail from '../components/showDetail';
import {getAccount} from '../components/getAccount';
import {Dimmer,Card,Loader,Container,Grid} from 'semantic-ui-react';
import Head from 'next/head';

class App extends Component{

	constructor(props){
		super(props);
		this.state = {
			account : false,
			admin : false,
			loading : true
		}
	}

	static async getInitialProps(){
		const {contract} = await getContract()
		const name = await contract.methods.name().call()
		const admin = await contract.methods.admin().call()
		const {shows} = await getShowDetails();
		console.log('index static')
		return {name,shows,admin}
	}

	async componentDidMount(){
		const {isAccount,isAdmin} = await getAccount(this.props.admin);
		this.setState({
			account : isAccount,
			admin : isAdmin,
			loading : false
		})
	}

	render(){
		if(!this.state.loading){
			return (
				<Layout account={this.state.account}
						name={this.props.name}
						id={'Logged in'}
						>
					<Grid.Row>
						<Grid.Column>
								<Card.Group>
									<ShowDetail shows={this.props.shows}
										admin={this.state.admin}
									/>
								</Card.Group>
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
						<Loader size='massive'>Loading</Loader>
					</Dimmer>
				</Container>
			)
		}
	}
}

export default App;