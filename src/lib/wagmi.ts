import { http, createConfig } from 'wagmi';
import { mainnet, base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, base],
  connectors: [
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});

// Payment configuration
export const PAYMENT_CONFIG = {
  recipientAddress: '0xdA93811B968bA9d3b69EeF9b0178DA651006Cf5C' as `0x${string}`,
  regularMealPrice: 50, // USD
  premiumMealPrice: 80, // USD
  minimumOrder: 200, // USD
  
  // Token addresses
  tokens: {
    mainnet: {
      USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as `0x${string}`,
      USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as `0x${string}`,
    },
    base: {
      USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`,
      USDT: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2' as `0x${string}`,
    },
  },
} as const;

// ERC20 ABI for token transfers
export const ERC20_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
] as const;
