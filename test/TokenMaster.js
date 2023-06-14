const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "TokenMaster";
const SYMBOL = "TM";

const OCCASION_NAME = "ETH Odisha";
const OCCASION_COST = ethers.utils.parseUnits("1", "ether");
const OCCASION_MAX_TICKETS = 100;
const OCCASION_DATE = "Aug 27";
const OCCASION_TIME = "10:00AM IST";
const OCCASION_LOCATION = "Kendrapara, Odisha, India";

describe("TokenMaster", () => {
  let tokenMaster;
  let deployer, buyer;

  beforeEach(async () => {
    // setup accounts
    [deployer, buyer] = await ethers.getSigners();

    const TokenMaster = await ethers.getContractFactory(NAME);
    tokenMaster = await TokenMaster.deploy(NAME, SYMBOL);

    const transaction = await tokenMaster
      .connect(deployer)
      .list(
        OCCASION_NAME,
        OCCASION_COST,
        OCCASION_MAX_TICKETS,
        OCCASION_DATE,
        OCCASION_TIME,
        OCCASION_LOCATION
      );
    await transaction.wait();
  });

  describe("Deployment", () => {
    it("sets the contract name", async () => {
      const name = await tokenMaster.name();
      expect(name).to.equal(NAME);
    });

    it("sets the contract symbol", async () => {
      const symbol = await tokenMaster.symbol();
      expect(symbol).to.equal(SYMBOL);
    });

    it("sets the contract owner to deployer", async () => {
      expect(await tokenMaster.owner()).to.equal(deployer.address);
    });
  });

  describe("Occasions", () => {
    it("updates occasion count", async () => {
      const totalOccasions = await tokenMaster.totalOccasions();
      expect(totalOccasions).to.equal(1);
    });

    it("returns occasions attribute", async () => {
      const occasion = await tokenMaster.getOccasion(1);

      expect(occasion.id).to.be.equal(1);
      expect(occasion.name).to.be.equal(OCCASION_NAME);
      expect(occasion.costs).to.be.equal(OCCASION_COST);
      expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS);
      expect(occasion.date).to.be.equal(OCCASION_DATE);
      expect(occasion.time).to.be.equal(OCCASION_TIME);
      expect(occasion.location).to.be.equal(OCCASION_LOCATION);
    });

    it("should fail if not owner lists event", async () => {
      await expect(
        tokenMaster
          .connect(buyer)
          .list(
            OCCASION_NAME,
            OCCASION_COST,
            OCCASION_MAX_TICKETS,
            OCCASION_DATE,
            OCCASION_TIME,
            OCCASION_LOCATION
          )
      ).to.be.revertedWith("Not Owner!");
    });
  });

  describe("Mint", () => {
    const ID = 1;
    const SEAT = 50;
    const AMOUNT = ethers.utils.parseUnits("1", "ether");

    beforeEach(async () => {
      const transaction = await tokenMaster
        .connect(buyer)
        .mint(ID, SEAT, { value: AMOUNT });
      await transaction.wait();
    });

    it("updates the ticket count", async () => {
      const occasion = await tokenMaster.getOccasion(1);
      expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS - 1);
    });

    it("updates buying status", async () => {
      const status = await tokenMaster.hasBought(ID, buyer.address);
      expect(status).to.be.equal(true);
    });

    it("updates seat status", async () => {
      const owner = await tokenMaster.seatTaken(ID, SEAT);
      expect(owner).to.be.equal(buyer.address);
    });

    it("updates overall seating status", async () => {
      const seats = await tokenMaster.getSeatsTaken(ID);
      expect(seats.length).to.equal(1);
      expect(seats[0]).to.equal(SEAT);
    });
  });
});
