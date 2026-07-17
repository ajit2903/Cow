// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/Counter.sol";

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
        console.log("============================================================");
    }
}
