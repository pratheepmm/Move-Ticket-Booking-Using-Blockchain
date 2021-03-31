import React,{Component} from 'react';
import {Menu,Label,Grid} from 'semantic-ui-react';
import Head from 'next/head';
import {Link} from '../routes';

class Layout extends Component{

	render(){
		return(
			<Grid padded>
				<Head>
					<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
				</Head>
				<Grid.Row>
					<Grid.Column>
						<Menu borderless inverted>
							<Link route="home">
								<Menu.Item
									name={this.props.name}
								/>
							</Link>
							<Menu.Item position='right' active
								name = {this.props.account ? this.props.id : `Not ${this.props.id}`}
								color = {this.props.account ? 'green' : 'red'}
							/>
						</Menu>
					</Grid.Column>
				</Grid.Row>
				{this.props.children}
			</Grid>
			)
	}
}

export default Layout;