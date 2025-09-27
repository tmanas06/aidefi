import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { AIDelegate } from "../typechain-types";

describe("AIDelegate", function () {
  let aiDelegate: AIDelegate;
  let owner: SignerWithAddress;
  let delegate: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async function () {
    [owner, delegate, addr1] = await ethers.getSigners();
    
    const AIDelegate = await ethers.getContractFactory("AIDelegate");
    aiDelegate = await AIDelegate.deploy() as AIDelegate;
    await aiDelegate.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await aiDelegate.owner()).to.equal(owner.address);
    });
  });

  describe("Create Delegated Account", function () {
    it("Should create a delegated account", async function () {
      const spendingLimit = ethers.parseEther("1"); // 1 KDA
      const allowedFunctions = ["swap()", "bridge()"];
      
      await aiDelegate.createDelegatedAccount(
        delegate.address,
        spendingLimit,
        allowedFunctions
      );

      const delegateInfo = await aiDelegate.getDelegateInfo(delegate.address);
      expect(delegateInfo.delegate).to.equal(delegate.address);
      expect(delegateInfo.spendingLimit).to.equal(spendingLimit);
      expect(delegateInfo.isActive).to.be.true;
    });

    it("Should fail if delegate already exists", async function () {
      const spendingLimit = ethers.parseEther("1");
      const allowedFunctions = ["swap()"];
      
      await aiDelegate.createDelegatedAccount(
        delegate.address,
        spendingLimit,
        allowedFunctions
      );

      await expect(
        aiDelegate.createDelegatedAccount(
          delegate.address,
          spendingLimit,
          allowedFunctions
        )
      ).to.be.revertedWith("Delegate already exists");
    });

    it("Should fail if spending limit is 0", async function () {
      const allowedFunctions = ["swap()"];
      
      await expect(
        aiDelegate.createDelegatedAccount(
          delegate.address,
          0,
          allowedFunctions
        )
      ).to.be.revertedWith("Spending limit must be greater than 0");
    });
  });

  describe("Execute Via Delegate", function () {
    beforeEach(async function () {
      const spendingLimit = ethers.parseEther("1");
      const allowedFunctions = ["swap()"];
      
      await aiDelegate.createDelegatedAccount(
        delegate.address,
        spendingLimit,
        allowedFunctions
      );
    });

    it("Should execute transaction via delegate", async function () {
      const value = ethers.parseEther("0.5");
      const data = "0x";
      
      await expect(
        aiDelegate.connect(delegate).executeViaDelegate(
          addr1.address,
          value,
          data,
          { value: value }
        )
      ).to.emit(aiDelegate, "DelegateExecuted");
    });

    it("Should fail if delegate exceeds spending limit", async function () {
      const value = ethers.parseEther("2"); // More than 1 KDA limit
      const data = "0x";
      
      await expect(
        aiDelegate.connect(delegate).executeViaDelegate(
          addr1.address,
          value,
          data,
          { value: value }
        )
      ).to.be.revertedWith("Exceeds spending limit");
    });

    it("Should fail if delegate is not active", async function () {
      await aiDelegate.deactivateDelegate(delegate.address);
      
      const value = ethers.parseEther("0.5");
      const data = "0x";
      
      await expect(
        aiDelegate.connect(delegate).executeViaDelegate(
          addr1.address,
          value,
          data,
          { value: value }
        )
      ).to.be.revertedWith("Delegate not active");
    });
  });

  describe("Update Spending Limit", function () {
    beforeEach(async function () {
      const spendingLimit = ethers.parseEther("1");
      const allowedFunctions = ["swap()"];
      
      await aiDelegate.createDelegatedAccount(
        delegate.address,
        spendingLimit,
        allowedFunctions
      );
    });

    it("Should update spending limit", async function () {
      const newLimit = ethers.parseEther("2");
      
      await aiDelegate.updateSpendingLimit(delegate.address, newLimit);
      
      const delegateInfo = await aiDelegate.getDelegateInfo(delegate.address);
      expect(delegateInfo.spendingLimit).to.equal(newLimit);
    });

    it("Should fail if new limit is too low", async function () {
      // First spend some amount
      await aiDelegate.connect(delegate).executeViaDelegate(
        addr1.address,
        ethers.parseEther("0.5"),
        "0x",
        { value: ethers.parseEther("0.5") }
      );
      
      // Try to set limit below spent amount
      await expect(
        aiDelegate.updateSpendingLimit(delegate.address, ethers.parseEther("0.3"))
      ).to.be.revertedWith("New limit too low");
    });
  });

  describe("Deactivate Delegate", function () {
    beforeEach(async function () {
      const spendingLimit = ethers.parseEther("1");
      const allowedFunctions = ["swap()"];
      
      await aiDelegate.createDelegatedAccount(
        delegate.address,
        spendingLimit,
        allowedFunctions
      );
    });

    it("Should deactivate delegate", async function () {
      await aiDelegate.deactivateDelegate(delegate.address);
      
      const delegateInfo = await aiDelegate.getDelegateInfo(delegate.address);
      expect(delegateInfo.isActive).to.be.false;
    });
  });
});
