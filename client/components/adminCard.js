import React,{Component} from 'react';
import {Button,Icon,Image,Card,Label} from 'semantic-ui-react';
import Router from '../routes'

class AdminCard extends Component{

	render(){
		if(this.props.admin){
			return(
					<Card>
						<Image src="https://gateway.ipfs.io/ipfs/QmWs9MyEFHemrpvWcqF2WoQkcmbau2ThSvT1npLTxeUWLM"/>
						<Card.Content>
							<Card.Header> Add Show Name </Card.Header>
							<Card.Meta> {`Date : Add-Date`}</Card.Meta>
							<Card.Meta>{`From Time : Add-From-Time`}</Card.Meta>
							<Card.Meta>{`To Time : Add-To-Time`}</Card.Meta>
							<Card.Meta>{`Amount : Add-Amount`}</Card.Meta>
						</Card.Content>
						<Card.Content extra>
							<a onClick={()=>Router.pushRoute('add_show')}>
								<Label basic color="green">Add show</Label>
							</a>
						</Card.Content>
					</Card>
			)
		}
		else{
			return null;
		}
	}
}

export default AdminCard;