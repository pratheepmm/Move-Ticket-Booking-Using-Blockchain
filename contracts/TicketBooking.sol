pragma solidity >= 0.5.0 < 0.7.0;

contract TicketBooking {
	string public name;
	address public admin;

	struct ShowDetail {
		bool showAvailable;
		string showName;
		uint seatsAvailable;
		uint amount;
		string fromTime;
		string toTime;
		string date;
		mapping (uint=>address) bookedMember;
		uint[] bookedSeats;
		string image;
	}

	event ShowEventDetail(
		bool showAvailable,
		string showName,
		uint seatsAvailable,
		uint amount,
		string fromTime,
		string toTime,
		string date
		);
	
	ShowDetail[] public showDetail;
	
	constructor(string memory _name) public {
		name = _name;
		admin = msg.sender;
	}

	modifier requireAdmin() { 
		require (admin == msg.sender , "Only Admin can access this !"); 
		_;
	}

	modifier indexIsValid(uint _index){
		require(_index >= 0 && _index < showDetail.length, "The entered Show is not Valid !" );
		_;
	}

	modifier seatIsValid(uint _index,uint _seatNumber) { 
		require(_seatNumber >=1 && _seatNumber <= showDetail[_index].seatsAvailable,"The seat is not valid !");
		_; 
	}
	
		
	function addShow (
		bool _showAvailable,string calldata _showName,uint _seatsAvailable,uint _amount,string calldata _fromTime,string calldata _toTime,string calldata _date,string calldata _image
		) requireAdmin() external {
		
		showDetail.push(ShowDetail({
			showAvailable : _showAvailable,
			showName : _showName,
			seatsAvailable : _seatsAvailable,
			amount : _amount,
			fromTime : _fromTime,
			toTime : _toTime,
			date : _date,
			bookedSeats : new uint[](0),
			image : _image
			}));

		emit ShowEventDetail(_showAvailable,_showName,_seatsAvailable,_amount,_fromTime,_toTime,_date);
	}
	
	function updateShow (
		uint _showIndex,string calldata _showName,uint _seatsAvailable,uint _amount,string calldata _fromTime,string calldata _toTime,string calldata _date,string calldata _image
		) requireAdmin() indexIsValid(_showIndex) external {		
		showDetail[_showIndex] = ShowDetail({
			showAvailable : false,
			showName : _showName,
			seatsAvailable : _seatsAvailable,
			amount : _amount,
			fromTime : _fromTime,
			toTime : _toTime,
			date : _date,
			bookedSeats : new uint[](0),
			image : _image
		});

		emit ShowEventDetail(false,_showName,_seatsAvailable,_amount,_fromTime,_toTime,_date);
	}

	function bookSeat (uint _showIndex,uint _seatNumber) indexIsValid(_showIndex) seatIsValid(_showIndex,_seatNumber) external payable{
		require(showDetail[_showIndex].bookedMember[_seatNumber] == address(0),"The seat is already booked !");
		require(showDetail[_showIndex].showAvailable,"Show is not available for booking !");
		require(msg.value >= showDetail[_showIndex].amount,"Insufficient amount to book the seat !");

		address payable payAdmin = address(uint160(address(admin)));
		payAdmin.transfer(showDetail[_showIndex].amount);
		showDetail[_showIndex].bookedMember[_seatNumber] = msg.sender;
		showDetail[_showIndex].bookedSeats.push(_seatNumber);
	}
	
	function getShowCount () external view returns(uint length) {
		return showDetail.length;
	}
	
	function makeShowNotAvailable(uint _showIndex) requireAdmin() indexIsValid(_showIndex) external{
		require(showDetail[_showIndex].showAvailable,"Show is already not available !");
		showDetail[_showIndex].showAvailable = false;
	}

	function makeShowAvailable(uint _showIndex) requireAdmin() indexIsValid(_showIndex) external{
		require(!showDetail[_showIndex].showAvailable,"Show is already available !");
		showDetail[_showIndex].showAvailable = true;
	}
	
	function getBookedSeatMember(uint _showIndex,uint _seatNumber) indexIsValid(_showIndex) view external returns(address){
		return showDetail[_showIndex].bookedMember[_seatNumber];
	}

	function getBookedSeats(uint _showIndex) indexIsValid(_showIndex) view external returns(uint[] memory){
		return showDetail[_showIndex].bookedSeats;
	}
}
