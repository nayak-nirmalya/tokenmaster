import { expect } from "chai";
import { ethers } from "hardhat";

describe("TokenMaster", () => {
  describe("Deployment", () => {
    it("sets the contract name", async () => {
      const TokenMaster = await ethers.getContractFactory("TokenMaster");
      let tokenMaster = await TokenMaster.deploy("TokenMaster", "TM");
      let name = await tokenMaster.name();
      expect(name).to.equal("TokenMaster");
    });
  });
});
