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

    // it("sets the contract symbol", async () => {
    //   const symbol = await tokenMaster.symbol();
    //   expect(symbol).to.equal(SYMBOL);
    // });

    // it("sets the contract owner to deployer", async () => {
    //   expect(await tokenMaster.owner()).to.equal(deployer.address);
    // });
  });
});
