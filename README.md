# Cow Protocol - Counter Contract

## 🎯 Overview

This project demonstrates a simple Counter smart contract deployed on Tenderly's Virtual Network (Sting Shine).

---

## 📋 Deployment Details

| Field | Value |
|-------|-------|
| **Contract Name** | Counter |
| **Contract Address** | `0x615EB86539d45B7adDF41Bc585b7e18B10D94dB8` |
| **Network** | Tenderly Sting Shine (Mainnet Fork) |
| **Chain ID** | 1 (Mainnet) |
| **Framework** | Foundry |

---

## 🔗 Links

- **Contract on Tenderly:** https://dashboard.tenderly.co/ajeetg88/project/node/5dd92507-47d2-4f45-9e53-6b0e735b473b
- **Tenderly VNet:** https://virtual.mainnet.eu.rpc.tenderly.co/ajeetg88/project/2a6c21-404a4e
- **Repository:** https://github.com/ajit2903/Cow

---

## 📦 Smart Contract Features

### **Counter.sol**

A simple counter contract with the following functions:

```solidity
function increment() public          // Increment count by 1
function decrement() public          // Decrement count by 1
function getCount() public view       // Get current count
```

**Events:**
- `CountIncremented(uint256 newCount)` - Emitted when counter increments
- `CountDecremented(uint256 newCount)` - Emitted when counter decrements

---

## 🛠 Project Structure

```
cow/
├── src/
│   └── Counter.sol              # Main counter contract
├── test/
│   └── Counter.t.sol            # Unit tests
├── script/
│   └── Deploy.s.sol             # Deployment script
├── foundry.toml                 # Foundry configuration
├── hardhat.config.ts            # Hardhat configuration
├── .env                         # Environment variables (not committed)
└── README.md                    # This file
```

---

## 🚀 Getting Started

### **Prerequisites**
- Foundry installed: https://book.getfoundry.sh/
- Node.js and npm

### **Installation**

```bash
git clone https://github.com/ajit2903/Cow.git
cd Cow
```

### **Run Tests**

```bash
forge test
```

Expected output:
```
[PASS] testIncrement
[PASS] testDecrement
[PASS] testMultipleOperations

3 passed in 0.234s
```

### **Deploy to Tenderly**

1. Create `.env` file:
```bash
echo "PRIVATE_KEY=0xyour_private_key" > .env
```

2. Deploy:
```bash
forge script script/Deploy.s.sol:DeployCounter \
  --rpc-url https://virtual.mainnet.eu.rpc.tenderly.co/ajeetg88/project/2a6c21-404a4e \
  --broadcast
```

---

## 📡 Interact with Contract

### **Increment Counter**

```bash
cast send 0x615EB86539d45B7adDF41Bc585b7e18B10D94dB8 "increment()" \
  --rpc-url https://virtual.mainnet.eu.rpc.tenderly.co/ajeetg88/project/2a6c21-404a4e \
  --private-key 0xyour_private_key
```

### **Get Current Count**

```bash
cast call 0x615EB86539d45B7adDF41Bc585b7e18B10D94dB8 "getCount()" \
  --rpc-url https://virtual.mainnet.eu.rpc.tenderly.co/ajeetg88/project/2a6c21-404a4e
```

---

## 🔐 Security

- ✅ `.env` file is protected in `.gitignore`
- ✅ Private keys never committed to repository
- ✅ Use Foundry scripts for secure deployments

---

## 📚 Additional Resources

- **Foundry Book:** https://book.getfoundry.sh/
- **Solidity Docs:** https://docs.soliditylang.org/
- **Tenderly Docs:** https://docs.tenderly.co/

---

## 👨‍💻 Author

**ajit2903** - https://github.com/ajit2903

---

## 📝 License

MIT
