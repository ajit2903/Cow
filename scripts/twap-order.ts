import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const COW_SETTLEMENT = "0x9008D19f58AAbD9eD0D60971565AA8510560ab41";
const RECEIVER = "0x06EE840642a33367ee59fCA237F270d5119d1356";

async function main() {
  // Get signer
  const [signer] = await ethers.getSigners();
  const userAddress = await signer.getAddress();

  console.log("👤 Executing from:", userAddress);
  console.log("🎯 Receiver:", RECEIVER);

  // Step 1: Approve USDC
  console.log("\n📝 Step 1: Approving USDC...");
  const erc20Abi = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function balanceOf(address account) public view returns (uint256)",
  ];

  const usdcContract = new ethers.Contract(USDC, erc20Abi, signer);

  // Check balance first
  const balance = await usdcContract.balanceOf(userAddress);
  console.log("💰 USDC Balance:", ethers.utils.formatUnits(balance, 6));

  if (balance.lt(ethers.utils.parseUnits("10000", 6))) {
    console.error("❌ Insufficient USDC balance!");
    return;
  }

  // Approve
  const approveTx = await usdcContract.approve(
    COW_SETTLEMENT,
    ethers.constants.MaxUint256
  );
  console.log("📤 Approval tx:", approveTx.hash);
  await approveTx.wait();
  console.log("✅ USDC Approved!");

  // Step 2: Create and submit TWAP order
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
  console.log("\n📝 Signing order...");
  const signature = await signer.signMessage(
    ethers.utils.arrayify(ethers.utils.keccak256(JSON.stringify(orderPayload)))
  );
  console.log("✅ Signed!");

  // Submit to CoW Protocol API
  console.log("\n📡 Submitting to CoW Protocol...");
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
    console.error("❌ Submission failed:", error);
    return;
  }

  const result = await response.json();
  console.log("\n✅ Order submitted successfully!");
  console.log("📋 Order UID:", result.uid);
  console.log(
    "🔗 Track at: https://explorer.cow.fi/orders/" + result.uid
  );
}

main().catch(console.error);