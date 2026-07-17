import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    tenderly_mainnet: {
      url: "https://virtual.mainnet.eu.rpc.tenderly.co/ajeetg88/project/0bff59-e0eb38",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1,
    },
    tenderly_sting_shine: {
      url: "https://virtual.mainnet.eu.rpc.tenderly.co/ajeetg88/project/2a6c21-404a4e",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1,
    },
  },
  defaultNetwork: "tenderly_sting_shine",
};

export default config;
