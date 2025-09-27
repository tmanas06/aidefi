import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { SimpleSwap, MockToken } from "../typechain-types";

describe("SimpleSwap", function () {
  let simpleSwap: SimpleSwap;
  let mockToken: MockToken;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    // Deploy MockToken
    const MockToken = await ethers.getContractFactory("MockToken");
    mockToken = await MockToken.deploy(
      "Test Token",
      "TEST",
      18,
      ethers.parseEther("1000000") // 1M tokens
    ) as MockToken;
    await mockToken.waitForDeployment();

    // Deploy SimpleSwap
    const SimpleSwap = await ethers.getContractFactory("SimpleSwap");
    simpleSwap = await SimpleSwap.deploy(
      await mockToken.getAddress(),
      ethers.parseEther("100") // 1 KDA = 100 TEST tokens
    ) as SimpleSwap;
    await simpleSwap.waitForDeployment();

    // Transfer some tokens to the swap contract for liquidity
    await mockToken.transfer(
      await simpleSwap.getAddress(),
      ethers.parseEther("10000") // 10K tokens
    );
  });

  describe("Deployment", function () {
    it("Should set the right token and rate", async function () {
      expect(await simpleSwap.token()).to.equal(await mockToken.getAddress());
      expect(await simpleSwap.rate()).to.equal(ethers.parseEther("100"));
    });
  });

  describe("Swap KDA for Tokens", function () {
    it("Should swap KDA for tokens", async function () {
      const kdaAmount = ethers.parseEther("1"); // 1 KDA
      const expectedTokens = ethers.parseEther("100"); // 100 TEST tokens
      
      const initialBalance = await mockToken.balanceOf(user1.address);
      
      await simpleSwap.connect(user1).swap({ value: kdaAmount });
      
      const finalBalance = await mockToken.balanceOf(user1.address);
      expect(finalBalance - initialBalance).to.equal(expectedTokens);
    });

    it("Should fail if no KDA sent", async function () {
      await expect(
        simpleSwap.connect(user1).swap({ value: 0 })
      ).to.be.revertedWith("Send KDA to swap");
    });

    it("Should fail if insufficient token liquidity", async function () {
      // Try to swap more than available liquidity
      const kdaAmount = ethers.parseEther("200"); // 200 KDA
      
      await expect(
        simpleSwap.connect(user1).swap({ value: kdaAmount })
      ).to.be.revertedWith("Insufficient token liquidity");
    });
  });

  describe("Swap Tokens for KDA", function () {
    beforeEach(async function () {
      // Give user1 some tokens
      await mockToken.transfer(user1.address, ethers.parseEther("1000"));
      await mockToken.connect(user1).approve(
        await simpleSwap.getAddress(),
        ethers.parseEther("1000")
      );
      
      // Add KDA liquidity to contract
      await owner.sendTransaction({
        to: await simpleSwap.getAddress(),
        value: ethers.parseEther("10") // 10 KDA
      });
    });

    it("Should swap tokens for KDA", async function () {
      const tokenAmount = ethers.parseEther("100"); // 100 TEST tokens
      const expectedKDA = ethers.parseEther("1"); // 1 KDA
      
      const initialBalance = await ethers.provider.getBalance(user1.address);
      
      const tx = await simpleSwap.connect(user1).swapTokensForKDA(tokenAmount);
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      
      const finalBalance = await ethers.provider.getBalance(user1.address);
      const balanceChange = finalBalance - initialBalance + gasUsed;
      expect(balanceChange).to.be.closeTo(expectedKDA, ethers.parseEther("0.01"));
    });

    it("Should fail if insufficient token balance", async function () {
      const tokenAmount = ethers.parseEther("2000"); // More than user has
      
      await expect(
        simpleSwap.connect(user1).swapTokensForKDA(tokenAmount)
      ).to.be.revertedWith("Insufficient token balance");
    });
  });

  describe("Add Liquidity", function () {
    it("Should add liquidity", async function () {
      const kdaAmount = ethers.parseEther("5");
      const tokenAmount = ethers.parseEther("500");
      
      // Give user1 more tokens first
      await mockToken.transfer(user1.address, ethers.parseEther("1000"));
      
      await mockToken.connect(user1).approve(
        await simpleSwap.getAddress(),
        tokenAmount
      );
      
      await simpleSwap.connect(user1).addLiquidity(tokenAmount, { value: kdaAmount });
      
      const balances = await simpleSwap.getBalances();
      expect(balances.kdaBalance).to.be.gte(kdaAmount);
      expect(balances.tokenBalance).to.be.gte(tokenAmount);
    });
  });

  describe("Update Rate", function () {
    it("Should update rate", async function () {
      const newRate = ethers.parseEther("200");
      
      await simpleSwap.updateRate(newRate);
      
      expect(await simpleSwap.rate()).to.equal(newRate);
    });

    it("Should fail if rate is 0", async function () {
      await expect(
        simpleSwap.updateRate(0)
      ).to.be.revertedWith("Rate must be greater than 0");
    });
  });

  describe("Get Quotes", function () {
    it("Should get swap quote", async function () {
      const kdaAmount = ethers.parseEther("1");
      const expectedTokens = ethers.parseEther("100");
      
      const quote = await simpleSwap.getSwapQuote(kdaAmount);
      expect(quote).to.equal(expectedTokens);
    });

    it("Should get reverse swap quote", async function () {
      const tokenAmount = ethers.parseEther("100");
      const expectedKDA = ethers.parseEther("1");
      
      const quote = await simpleSwap.getReverseSwapQuote(tokenAmount);
      expect(quote).to.equal(expectedKDA);
    });
  });
});
