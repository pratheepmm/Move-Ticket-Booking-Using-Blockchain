const TicketBooking = artifacts.require("TicketBooking");

module.exports = function(deployer) {

	deployer.deploy(TicketBooking,"Ticket Booking");
};
