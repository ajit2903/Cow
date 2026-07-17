
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";

contract Counter {
    uint256 private count;
    address public owner = 0x615EB86539d45B7adDF41Bc585b7e18B10D94dB8;

    event CountIncremented(uint256 newCount);
    event CountDecremented(uint256 newCount);

    constructor() {
        count = 0;
    }

    function increment() public {
        count += 1;
        emit CountIncremented(count);
    }

    function decrement() public {
        count -= 1;
        emit CountDecremented(count);
    }

    function getCount() public view returns (uint256) {
        return count;
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}

contract DeployCounter is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Counter counter = new Counter();

        vm.stopBroadcast();

        console.log("============================================================");
        console.log("✅ DEPLOYMENT SUCCESSFUL!");
        console.log("============================================================");
        console.log("Contract: Counter");
        console.log("Deployed at:", address(counter));
        console.log("Owner Address: 0x615EB86539d45B7adDF41Bc585b7e18B10D94dB8");
        console.log("============================================================");
    }
}