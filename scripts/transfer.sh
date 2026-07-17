#!/bin/bash

# Cow Protocol - ETH Transfer Script
# Transfer 2 ETH from 0x3a09c40f8f7b93c8c7e09a5422e56dfe7c7d2794 to 0x06ee840642a33367ee59fca237f270d5119d1356

set -e

echo "🚀 Starting ETH Transfer on Tenderly Virtual Network..."
echo ""
echo "From: 0x3a09c40f8f7b93c8c7e09a5422e56dfe7c7d2794"
echo "To: 0x06ee840642a33367ee59fca237f270d5119d1356"
echo "Amount: 2 ETH"
echo "Network: Tenderly Sting Shine (Mainnet Fork)"
echo ""

# Check if foundry is installed
if ! command -v cast &> /dev/null; then
    echo "❌ Foundry is not installed. Installing now..."
    curl -L https://foundry.paradigm.xyz | bash
    foundryup
fi

echo "✅ Foundry is installed"
echo ""

# Execute the transfer
echo "📤 Executing transfer..."
cast send \
    --rpc-url https://virtual.mainnet.eu.rpc.tenderly.co/ajeetg88/project/2a6c21-404a4e \
    --private-key 0xb87f755b877723b50363c39825da6fcf95583b36744dd5aa4f7f9fa00441bd6d \
    0x06ee840642a33367ee59fca237f270d5119d1356 \
    --value 2ether

echo ""
echo "✅ Transfer completed successfully!"
echo ""
echo "📊 To verify the transaction:"
echo "   Visit: https://dashboard.tenderly.co/ajeetg88/project/node/5dd92507-47d2-4f45-9e53-6b0e735b473b"
