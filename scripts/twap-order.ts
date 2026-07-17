import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const COW_SETTLEMENT = "0x9008D19f58AAbD9eD0D60971565AA8510560ab41";
const RECEIVER = "0x06EE840642a33367ee59fCA237F270d5119d1356";

async function main() {
  try {
    // Check Private Key
    if (!process.env.PRIVATE_KEY) {
      console.error("❌ ERROR: PRIVATE_KEY not found in .env file!");
      console.error("📝 Please create .env file with: PRIVATE_KEY=0xyourkey");
      process.exit(1);
    }

    console.log("✅ Private Key loaded!");

    // Get signer and network info
    const [signer] = await ethers.getSigners();
    const userAddress = await signer.getAddress();
    const network = await ethers.provider.getNetwork();

    // Display connection info
    console.log("\n" + "=".repeat(60));
    console.log("📊 CONNECTION INFO");
    console.log("=".repeat(60));
    console.log("👤 Your Wallet Address:", userAddress);
    console.log("🌐 Network:", network.name, `(Chain ID: ${network.chainId})`);
    console.log("🔗 RPC URL:", await ethers.provider.getNetwork());
    console.log("=".repeat(60) + "\n");

    // Check ETH balance for gas
    const ethBalance = await ethers.provider.getBalance(userAddress);
    console.log("💰 ETH Balance:", ethers.utils.formatEther(ethBalance), "ETH");

    // Step 1: Check USDC Balance and Approve
    console.log("\n📝 Step 1: Checking USDC Balance...");
    const erc20Abi = [
      "function approve(address spender, uint256 amount) public returns (bool)",
      "function balanceOf(address account) public view returns (uint256)",
      "function allowance(address owner, address spender) public view returns (uint256)",
    ];

    const usdcContract = new ethers.Contract(USDC, erc20Abi, signer);

    // Check USDC balance
    const balance = await usdcContract.balanceOf(userAddress);
    const balanceFormatted = ethers.utils.formatUnits(balance, 6);
    console.log("💰 USDC Balance:", balanceFormatted, "USDC");

    if (balance.lt(ethers.utils.parseUnits("10000", 6))) {
      console.error(
        "❌ Insufficient USDC balance! You need 10,000 USDC but have:",
        balanceFormatted
      );
      return;
    }

    // Check current allowance
    const currentAllowance = await usdcContract.allowance(
      userAddress,
      COW_SETTLEMENT
    );
    console.log(
      "✅ Current Allowance:",
      ethers.utils.formatUnits(currentAllowance, 6),
      "USDC"
    );

    // Approve if needed
    if (currentAllowance.lt(ethers.utils.parseUnits("10000", 6))) {
      console.log("📝 Approving USDC for CoW Settlement...");
      const approveTx = await usdcContract.approve(
        COW_SETTLEMENT,
        ethers.constants.MaxUint256
      );
      console.log("📤 Approval Transaction Hash:", approveTx.hash);
      const receipt = await approveTx.wait();
      console.log("✅ USDC Approved! Block:", receipt?.blockNumber);
    } else {
      console.log("✅ USDC already approved!");
    }

    // Step 2: Create TWAP Order
    console.log("\n📝 Step 2: Creating TWAP Order...");

    const orderPayload = {
      sellToken: USDC,
      buyToken: WETH,
      receiver: RECEIVER,
      sellAmount: ethers.utils.parseUnits("10000", 6).toString(),
      buyAmount: ethers.utils.parseUnits("5", 18).toString(),
      validTo: Math.floor(Date.now() / 1000) + 86400, // Valid for 24 hours
      appData:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      feeAmount: "0",
      kind: "sell",
      partiallyFillable: false,
      sellTokenBalance: "erc20",
      buyTokenBalance: "erc20",
    };

    console.log("📋 Order Details:");
    console.log(JSON.stringify(orderPayload, null, 2));

    // Sign the order
    console.log("\n🔐 Signing order...");
    const messageHash = ethers.utils.keccak256(
      JSON.stringify(orderPayload)
    );
    const signature = await signer.signMessage(
      ethers.utils.arrayify(messageHash)
    );
    console.log("✅ Order Signed!");
    console.log("📝 Signature:", signature);

    // Step 3: Submit to CoW Protocol API
    console.log("\n📡 Submitting to CoW Protocol...");
    console.log("🌐 API Endpoint: https://api.cow.fi/mainnet/api/v1/orders");

    const response = await fetch("https://api.cow.fi/mainnet/api/v1/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: orderPayload,
        signature: signature,
        from: userAddress,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Submission failed:", JSON.stringify(error, null, 2));
      return;
    }

    const result = await response.json();
    console.log("\n" + "=".repeat(60));
    console.log("✅ ORDER SUBMITTED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("📋 Order UID:", result.uid);
    console.log("🔗 Track Order: https://explorer.cow.fi/orders/" + result.uid);
    console.log("📊 From Address:", userAddress);
    console.log("🎯 Receiver Address:", RECEIVER);
    console.log("=".repeat(60) + "\n");
  } catch (error) {
    console.error("❌ ERROR:", error);
    process.exit(1);
  }
}

main().catch(console.error);
