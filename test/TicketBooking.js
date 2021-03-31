const TicketBooking = artifacts.require("./TicketBooking.sol");

contract("TicketBooking",(accounts)=>{

	let ticketBooking,amount;
	beforeEach(async()=>{
		ticketBooking = await TicketBooking.new("Ticket Booking Contract");
		amount = web3.utils.toWei('0.01','ether');
	})

	describe("1) is Deployed",async()=>{

		it("i) does Contract deployed",async()=>{
			const address = ticketBooking.address;
			assert(address);
		})

		it("ii) does contract has a name",async()=>{
			const name = await ticketBooking.name();
			assert.equal("Ticket Booking Contract",name);
		})

		it("iii) does the contract has admin",async()=>{
			const admin = await ticketBooking.admin();
			assert.equal(accounts[0],admin);
		})
		
	})

	describe("2) is Admin able to add, update and make Show not Available",async()=>{

		it("i) added a Show Successfully",async()=>{
			await ticketBooking.addShow(true,"Kabali",100,amount,"12.00pm","2.00pm","12/10/2020",{from : accounts[0]});

			const result = await ticketBooking.showDetail(0);

			assert.equal(true,result.showAvailable);
			assert.equal('Kabali',result.showName);
			expect(web3.utils.toBN(100)).to.deep.equal(result.seatsAvailable);
			expect(web3.utils.toBN(amount)).to.deep.equal(result.amount);
			assert.equal('12.00pm',result.fromTime);
			assert.equal('2.00pm',result.toTime);
			assert.equal('12/10/2020',result.date);
		})

		it('ii) able to update show and get count Successfully',async()=>{

			await ticketBooking.addShow(true,"Kabali",100,amount,"12.00pm","2.00pm","12/10/2020",{from : accounts[0]});

			const amount1 = web3.utils.toWei('0.015','ether');
			const amount2 = web3.utils.toWei('0.013','ether');

			await ticketBooking.addShow(true,"Petta",101,amount1,"4.00pm","6.00pm","12/11/2020",{from : accounts[0]});
			await ticketBooking.updateShow(1,false,"Kali",99,amount2,"9.00pm","11.00pm","13/11/2020",{from : accounts[0]});

			const result = await ticketBooking.showDetail(1);

			assert.equal(false,result.showAvailable);
			assert.equal('Kali',result.showName);
			expect(web3.utils.toBN(99)).to.deep.equal(result.seatsAvailable);
			expect(web3.utils.toBN(amount2)).to.deep.equal(result.amount);
			assert.equal('9.00pm',result.fromTime);
			assert.equal('11.00pm',result.toTime);
			assert.equal('13/11/2020',result.date);

			const result1 = await ticketBooking.showDetail(0);
			
			assert.equal(true,result1.showAvailable);
			assert.equal('Kabali',result1.showName);
			expect(web3.utils.toBN(100)).to.deep.equal(result1.seatsAvailable);
			expect(web3.utils.toBN(amount)).to.deep.equal(result1.amount);
			assert.equal('12.00pm',result1.fromTime);
			assert.equal('2.00pm',result1.toTime);
			assert.equal('12/10/2020',result1.date);

			const count = await ticketBooking.getShowCount();

			assert.equal(2,count);
		})

		it("iii) showIndex within range",async()=>{

			try{
				await ticketBooking.updateShow(0,true,"Kali",99,amount,"9.00pm","11.00pm","13/11/2020",{from : accounts[0]});
				assert.fail();
			}catch(err){
				assert.equal("The entered Show is not Valid !",err.reason);
			}

			try{
				await ticketBooking.updateShow(-1,true,"Kali",99,amount,"9.00pm","11.00pm","13/11/2020",{from : accounts[0]});
				assert.fail();
			}catch(err){
				assert.equal("The entered Show is not Valid !",err.reason);
			}					
		})

		it("iv) making show Unavailable",async()=>{

			await ticketBooking.addShow(true,"Kabali",100,amount,"12.00pm","2.00pm","12/10/2020",{from : accounts[0]});
			await ticketBooking.makeShowNotAvailable(0,{from : accounts[0]});
			const result = await ticketBooking.showDetail(0);

			assert.equal(false,result.showAvailable);
			assert.equal('Kabali',result.showName);
			expect(web3.utils.toBN(100)).to.deep.equal(result.seatsAvailable);
			expect(web3.utils.toBN(amount)).to.deep.equal(result.amount);
			assert.equal('12.00pm',result.fromTime);
			assert.equal('2.00pm',result.toTime);
			assert.equal('12/10/2020',result.date);
		})

		it("v) making show Available",async()=>{

			await ticketBooking.addShow(false,"Kabali",100,amount,"12.00pm","2.00pm","12/10/2020",{from : accounts[0]});
			await ticketBooking.makeShowAvailable(0,{from : accounts[0]});
			const result = await ticketBooking.showDetail(0);

			assert.equal(true,result.showAvailable);
			assert.equal('Kabali',result.showName);
			expect(web3.utils.toBN(100)).to.deep.equal(result.seatsAvailable);
			expect(web3.utils.toBN(amount)).to.deep.equal(result.amount);
			assert.equal('12.00pm',result.fromTime);
			assert.equal('2.00pm',result.toTime);
			assert.equal('12/10/2020',result.date);
		})

		it("vi) making show Available index is valid",async()=>{
			try{
				await ticketBooking.addShow(false,"Kabali",100,amount,"12.00pm","2.00pm","12/10/2020",{from : accounts[0]});
				await ticketBooking.makeShowAvailable(1,{from : accounts[0]});
				assert.fail();
			}catch(err){
				assert.equal("The entered Show is not Valid !",err.reason);
			}
			
		})

		it("vii) making show Not Available index is valid",async()=>{
			try{
				await ticketBooking.addShow(true,"Kabali",100,amount,"12.00pm","2.00pm","12/10/2020",{from : accounts[0]});
				await ticketBooking.makeShowNotAvailable(1,{from : accounts[0]});
				assert.fail();
			}catch(err){
				assert.equal("The entered Show is not Valid !",err.reason);
			}
			
		})

		it("viii) already show is Available",async()=>{
			try{
				await ticketBooking.addShow(true,"Kabali",100,amount,"12.00pm","2.00pm","12/10/2020",{from : accounts[0]});
				await ticketBooking.makeShowAvailable(0,{from : accounts[0]});
				assert.fail();
			}catch(err){
				assert.equal("Show is already available !",err.reason);
			}
		})

		it("ix) already show is Not Available",async()=>{
			try{
				await ticketBooking.addShow(false,"Kabali",100,amount,"12.00pm","2.00pm","12/10/2020",{from : accounts[0]});
				await ticketBooking.makeShowNotAvailable(0,{from : accounts[0]});
				assert.fail();
			}catch(err){
				assert.equal("Show is already not available !",err.reason);
			}
		})
	})

	describe("3) other than admin unable to add and update show",async()=>{

		it("i) others unable to add show",async()=>{

			try{
				await ticketBooking.addShow(true,"Kabali",100,amount,"12.00pm","2.00pm","12/10/2020",{from : accounts[1]});
				assert.fail();
			}catch(err){
				assert.equal("Only Admin can access this !",err.reason);
			}
		})

		it("ii) others unable to update show",async()=>{

			const amount1 = web3.utils.toWei('0.013','ether');

			try{
				await ticketBooking.addShow(true,"Kabali",100,amount,"12.00pm","2.00pm","12/10/2020",{from : accounts[0]});
				await ticketBooking.updateShow(0,true,"Kali",99,amount1,"9.00pm","11.00pm","13/11/2020",{from : accounts[1]});
				assert.fail();
			}catch(err){
				assert.equal("Only Admin can access this !",err.reason);
			}
		})

		it("iii) others unable to make Show Available",async()=>{

			try{
				await ticketBooking.addShow(false,"Kabali",100,amount,"12.00pm","2.00pm","12/10/2020",{from : accounts[0]});
				await ticketBooking.makeShowAvailable(0,{from : accounts[1]});
				assert.fail();
			}catch(err){
				assert.equal('Only Admin can access this !',err.reason);
			}
		})

		it("iii) others unable to make Show Unavailable",async()=>{

			try{
				await ticketBooking.addShow(false,"Kabali",100,amount,"12.00pm","2.00pm","12/10/2020",{from : accounts[0]});
				await ticketBooking.makeShowNotAvailable(0,{from : accounts[1]});
				assert.fail();
			}catch(err){
				assert.equal('Only Admin can access this !',err.reason);
			}
		})
	})

	describe("4) users able to buy tickets",async()=>{

		it("i) users can buy seat",async()=>{
			await ticketBooking.addShow(true,"Kabali",100,amount,"12.00pm","2.00pm","12/10/2020",{from : accounts[0]});
			const balOwn = await web3.eth.getBalance(accounts[0]);
			const balUsr = await web3.eth.getBalance(accounts[1]);

			await ticketBooking.bookSeat(0,3,{from : accounts[1], value : amount});
			const result = await ticketBooking.getBookedSeatMember(0,3);
			const aftBalOwn = await web3.eth.getBalance(accounts[0]);
			const aftBalUsr = await web3.eth.getBalance(accounts[1]);
			const finBalOwn = aftBalOwn - balOwn ;
			const finBalUsr = balUsr - aftBalUsr ;
			assert.equal(accounts[1],result);
			assert(amount<finBalUsr,"Amount is not transferred");
			assert.equal(amount,finBalOwn);
			const arr = await ticketBooking.getBookedSeats(0)
			assert.equal(arr,3)
		})

		it("ii) cannot buy already booked seat",async()=>{
			await ticketBooking.addShow(true,"Kabali",100,amount,"12.00pm","2.00pm","12/10/2020",{from : accounts[0]});
			try{
				await ticketBooking.bookSeat(0,3,{from : accounts[1], value : amount});
				await ticketBooking.bookSeat(0,3,{from : accounts[2], value : amount});
				assert.fail();
			}catch(err){
				assert.equal("The seat is already booked !",err.reason);
			}
		})

		it("iii) cannot book an Not Available Show",async()=>{

			await ticketBooking.addShow(false,"Kabali",100,amount,"12.00pm","2.00pm","12/10/2020",{from : accounts[0]});
			try{
				await ticketBooking.bookSeat(0,3,{from : accounts[1], value : amount});
				assert.fail();
			}catch(err){
				assert.equal("Show is not available for booking !",err.reason);
			}
		})

		it("iv) balance of the user is insufficient to pay",async()=>{

			await ticketBooking.addShow(true,"Kabali",100,amount,"12.00pm","2.00pm","12/10/2020",{from : accounts[0]});
			try{
				await ticketBooking.bookSeat(0,3,{from : accounts[1], value : 1234});
				assert.fail();
			}catch(err){
				assert.equal("Insufficient amount to book the seat !",err.reason);
			}
		})

		it("v) whether the Show index is valid",async()=>{
			try{
				await ticketBooking.bookSeat(0,3,{from : accounts[0],value : amount});
				assert.fail();
			}catch(err){
				assert.equal("The entered Show is not Valid !",err.reason);
			}
		})

		it("vi) whether the Seat is available",async()=>{
			await ticketBooking.addShow(true,"Kabali",100,amount,"12.00pm","2.00pm","12/10/2020",{from : accounts[0]});
			try{
				await ticketBooking.bookSeat(0,300,{from : accounts[2],value : amount});
				assert.fail();
			}catch(err){
				assert.equal("The seat is not valid !",err.reason);
			}
			try{
				await ticketBooking.bookSeat(0,-1,{from : accounts[2],value : amount});
				assert.fail();
			}catch(err){
				assert.equal("The seat is not valid !",err.reason);
			}

		})
	})

	
})
