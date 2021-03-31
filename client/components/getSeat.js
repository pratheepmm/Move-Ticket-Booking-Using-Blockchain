import React,{Component} from 'react';
import {Button,Icon,Grid,Confirm} from 'semantic-ui-react'

class GetSeat extends Component{

	constructor(props){
		super(props);
		this.state = {
			open : false,
			id : null
		}
	}

	openConfirm = (color,id)=>{
		if(color=='grey'){
			this.setState({open : true , id : id})
		}
		else{
			window.alert("Seat have been booked already !")
		}
	}

	ticket = ()=>{
		var res=[]
		if(this.props.account){
			for(let i=1;i<=this.props.show.seatsAvailable;i++){
				let Color = this.props.seats.includes(i.toString())?'red':'grey'
		 		res.push(
						<Button size='tiny' onClick={(e)=>{
							event.preventDefault()
							this.openConfirm(Color,i)
							}} circular key={i} color={Color}
						>
						<Icon name='ticket'/>
						{i}
						</Button>
				)
			}
		}
		else{
			for(let i=1;i<=this.props.show.seatsAvailable;i++){
				let Color = this.props.seats.includes(i.toString())?'red':'grey'
		 		res.push(
						<Button size='tiny' onClick={(e)=>{
							event.preventDefault()
							this.openConfirm(Color,i)
							}} circular key={i} color={Color}
							disabled
						>
						<Icon name='ticket'/>
						{i}
						</Button>
				)
			}
		}
		return res;
	}

	render(){
		return(
		<Grid.Row>
			<Grid.Column>
				{this.ticket()}
				<Confirm open={this.state.open}
					content={`Are you sure to pay ${this.props.amountInEther} ether ?`}
					onCancel={()=>this.setState({open:false})}
				 	onConfirm={()=>this.props.buyTicket(this.props.showId,this.state.id,this.props.amount)}
				/>
			</Grid.Column>
		</Grid.Row>
		)
	}
}

export default GetSeat;