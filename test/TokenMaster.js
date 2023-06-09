const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenMaster", () => {
  describe("Deployment", () => {
    it("sets the contract name", async () => {
      const TokenMaster = await ethers.getContractFactory("TokenMaster");
      let tokenMaster = await TokenMaster.deploy("TokenMaster", "TM");
      let name = await tokenMaster.name();
      expect(name).to.equal("TokenMaster");
    });

    it("sets the contract symbol", async () => {
      const TokenMaster = await ethers.getContractFactory("TokenMaster");
      let tokenMaster = await TokenMaster.deploy("TokenMaster", "TM");
      let symbol = await tokenMaster.symbol();
      expect(symbol).to.equal("TM");
    });
  });
});
