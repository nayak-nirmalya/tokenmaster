const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenMaster", () => {
  let tokenMaster;

  beforeEach(async () => {
    const TokenMaster = await ethers.getContractFactory("TokenMaster");
    tokenMaster = await TokenMaster.deploy("TokenMaster", "TM");
  });

  describe("Deployment", () => {
    it("sets the contract name", async () => {
      const name = await tokenMaster.name();
      expect(name).to.equal("TokenMaster");
    });

    it("sets the contract symbol", async () => {
      const symbol = await tokenMaster.symbol();
      expect(symbol).to.equal("TM");
    });
  });
});
