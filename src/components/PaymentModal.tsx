import { useState } from 'react';
import { useAccount, useChainId, useSwitchChain, useSendTransaction, useWriteContract, useWaitForTransactionReceipt, useConfig } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import { mainnet, base } from 'wagmi/chains';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PAYMENT_CONFIG, ERC20_ABI } from '@/lib/wagmi';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  regularMeals: number;
  premiumMeals: number;
  totalUsd: number;
}

type PaymentToken = 'ETH' | 'USDC' | 'USDT';
type Network = 'mainnet' | 'base';

const PaymentModal = ({ isOpen, onClose, regularMeals, premiumMeals, totalUsd }: PaymentModalProps) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { toast } = useToast();
  
  const [selectedToken, setSelectedToken] = useState<PaymentToken>('USDC');
  const [selectedNetwork, setSelectedNetwork] = useState<Network>('base');
  const [ethPrice, setEthPrice] = useState<number>(3500); // Default, should fetch from API
  
  // ETH transaction
  const { sendTransaction, data: ethTxHash, isPending: isEthPending } = useSendTransaction();
  
  // Token transaction
  const { writeContract, data: tokenTxHash, isPending: isTokenPending } = useWriteContract();
  
  // Wait for transaction receipts
  const { isLoading: isEthConfirming, isSuccess: isEthConfirmed } = useWaitForTransactionReceipt({ hash: ethTxHash });
  const { isLoading: isTokenConfirming, isSuccess: isTokenConfirmed } = useWaitForTransactionReceipt({ hash: tokenTxHash });

  const isConfirming = isEthConfirming || isTokenConfirming;
  const isConfirmed = isEthConfirmed || isTokenConfirmed;
  const isPending = isEthPending || isTokenPending;

  const targetChainId = selectedNetwork === 'mainnet' ? mainnet.id : base.id;
  const isCorrectNetwork = chainId === targetChainId;

  const handleNetworkSwitch = async () => {
    try {
      await switchChain({ chainId: targetChainId });
    } catch (error) {
      toast({
        title: "Network switch failed",
        description: "Please switch networks manually in your wallet",
        variant: "destructive",
      });
    }
  };

  const handlePayment = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (totalUsd < PAYMENT_CONFIG.minimumOrder) {
      toast({
        title: "Minimum order not met",
        description: `Minimum order is $${PAYMENT_CONFIG.minimumOrder}`,
        variant: "destructive",
      });
      return;
    }

    if (!isCorrectNetwork) {
      await handleNetworkSwitch();
      return;
    }

    try {
      if (selectedToken === 'ETH') {
        const ethAmount = totalUsd / ethPrice;
        sendTransaction({
          to: PAYMENT_CONFIG.recipientAddress,
          value: parseEther(ethAmount.toFixed(18)),
        });
      } else {
        const tokenAddress = PAYMENT_CONFIG.tokens[selectedNetwork][selectedToken as 'USDC' | 'USDT'];
        // USDC and USDT both use 6 decimals
        const amount = parseUnits(totalUsd.toString(), 6);
        
        writeContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'transfer',
          args: [PAYMENT_CONFIG.recipientAddress, amount],
        } as any);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment",
        variant: "destructive",
      });
    }
  };

  // Success handler
  if (isConfirmed) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-card border-border max-w-md">
          <div className="flex flex-col items-center py-8 gap-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <DialogTitle className="font-display text-xl tracking-wider">PAYMENT CONFIRMED</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Your order for {regularMeals + premiumMeals} meals has been placed.
              We'll prepare your weekly menu with care.
            </DialogDescription>
            <Button onClick={onClose} className="mt-4 font-display tracking-wider">
              CLOSE
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl tracking-wider text-center">COMPLETE PAYMENT</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {regularMeals > 0 && `${regularMeals} regular meal${regularMeals > 1 ? 's' : ''} × $${PAYMENT_CONFIG.regularMealPrice}`}
            {regularMeals > 0 && premiumMeals > 0 && ' + '}
            {premiumMeals > 0 && `${premiumMeals} premium meal${premiumMeals > 1 ? 's' : ''} × $${PAYMENT_CONFIG.premiumMealPrice}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Network selection */}
          <div className="space-y-3">
            <Label className="font-display text-xs tracking-wider">NETWORK</Label>
            <RadioGroup
              value={selectedNetwork}
              onValueChange={(v) => setSelectedNetwork(v as Network)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="base" id="base" />
                <Label htmlFor="base" className="cursor-pointer">Base</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mainnet" id="mainnet" />
                <Label htmlFor="mainnet" className="cursor-pointer">Ethereum</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Token selection */}
          <div className="space-y-3">
            <Label className="font-display text-xs tracking-wider">PAY WITH</Label>
            <RadioGroup
              value={selectedToken}
              onValueChange={(v) => setSelectedToken(v as PaymentToken)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="USDC" id="usdc" />
                <Label htmlFor="usdc" className="cursor-pointer">USDC</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="USDT" id="usdt" />
                <Label htmlFor="usdt" className="cursor-pointer">USDT</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ETH" id="eth" />
                <Label htmlFor="eth" className="cursor-pointer">ETH</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Order summary */}
          <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${totalUsd.toFixed(2)}</span>
            </div>
            {totalUsd < PAYMENT_CONFIG.minimumOrder && (
              <div className="flex items-center gap-2 text-destructive text-xs">
                <AlertCircle size={14} />
                <span>Minimum order: ${PAYMENT_CONFIG.minimumOrder}</span>
              </div>
            )}
            <div className="border-t border-border pt-2 flex justify-between font-display tracking-wider">
              <span>TOTAL</span>
              <span>
                {selectedToken === 'ETH' 
                  ? `~${(totalUsd / ethPrice).toFixed(4)} ETH`
                  : `${totalUsd.toFixed(2)} ${selectedToken}`
                }
              </span>
            </div>
          </div>

          {/* Network mismatch warning */}
          {isConnected && !isCorrectNetwork && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive flex items-center gap-2">
              <AlertCircle size={16} />
              <span>Please switch to {selectedNetwork === 'mainnet' ? 'Ethereum' : 'Base'}</span>
            </div>
          )}

          {/* Action button */}
          <Button
            onClick={handlePayment}
            disabled={!isConnected || isPending || isConfirming || totalUsd < PAYMENT_CONFIG.minimumOrder}
            className="w-full font-display tracking-wider"
          >
            {!isConnected ? (
              'CONNECT WALLET FIRST'
            ) : isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> CONFIRM IN WALLET</>
            ) : isConfirming ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> CONFIRMING...</>
            ) : !isCorrectNetwork ? (
              'SWITCH NETWORK'
            ) : (
              `PAY $${totalUsd.toFixed(2)}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
