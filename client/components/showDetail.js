import React,{Component} from 'react';
import {Card,Image,Icon,Label} from 'semantic-ui-react';
import AdminCard from './adminCard'
import {Link} from '../routes'

class showDetails extends Component{

	constructor(props){
		super(props);
	}

	render(){
		return(
			<Card.Group>
				{this.props.shows.map((show,index)=>{
					return(
						<Card key={index}>
							<Image src={`https://gateway.ipfs.io/ipfs/${show.image}`} wrapped ui={false}/>
							<Card.Content>
								<Card.Header> {show.showName} </Card.Header>
								<Card.Meta> {`Date : ${show.date}`}</Card.Meta>
								<Card.Meta>{`From : ${show.fromTime} To : ${show.toTime}`}</Card.Meta>
								<Card.Meta>Amount : <Icon name='ethereum'/>{show.amount} ether</Card.Meta>
							</Card.Content>
							<Card.Content extra>
								{show.showAvailable?(
									<Link route='view_show' id={index}>
										<a>
											<Label basic color='green' >View</Label>
										</a>
									</Link>
								)
								:(
									<Label basic color="red" >Show Not Available !</Label>
									)
								}
							</Card.Content>
							{
								this.props.admin?(
									<Card.Content extra>
										<Link route='update_show' id={index}>
											<a>
												<Label basic color='blue'>Edit</Label>
											</a>
										</Link>
									</Card.Content>
									): null
							}
						</Card>
					)
				})}
				<AdminCard admin={this.props.admin}/>
			</Card.Group>
		)	
	}
}

export default showDetails;