import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export type ReferralStatus = 'pending_signup' | 'signed_up' | 'first_order' | 'active';

export interface ReferredFriend {
  id: string;
  name: string;
  email: string;
  status: ReferralStatus;
  referredAt: Date;
  signedUpAt?: Date;
  firstOrderAt?: Date;
  rewardEarned: boolean;
}

export interface ReferralData {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  freeMealsEarned: number;
  freeMealsAvailable: number;
  referredFriends: ReferredFriend[];
}

// Generate a unique referral code from user info
function generateReferralCode(name: string | null, id: string): string {
  const namePart = name
    ? name.split(' ')[0].toUpperCase().slice(0, 6)
    : 'FRIEND';
  const idPart = id.slice(-4).toUpperCase();
  return `${namePart}${idPart}`;
}

// Mock data for development - replace with actual API calls
const mockReferredFriends: ReferredFriend[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 's***@gmail.com',
    status: 'first_order',
    referredAt: new Date('2024-12-01'),
    signedUpAt: new Date('2024-12-02'),
    firstOrderAt: new Date('2024-12-05'),
    rewardEarned: true,
  },
  {
    id: '2',
    name: 'Mike Johnson',
    email: 'm***@yahoo.com',
    status: 'signed_up',
    referredAt: new Date('2024-12-10'),
    signedUpAt: new Date('2024-12-11'),
    rewardEarned: false,
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'e***@outlook.com',
    status: 'pending_signup',
    referredAt: new Date('2024-12-20'),
    rewardEarned: false,
  },
];

export function useReferrals() {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate referral code based on user profile
  const referralCode = useMemo(() => {
    if (!user) return '';
    return generateReferralCode(profile?.name ?? null, user.id);
  }, [user, profile?.name]);

  // Generate referral link
  const referralLink = useMemo(() => {
    if (!referralCode) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/signup?ref=${referralCode}`;
  }, [referralCode]);

  // Calculate stats from mock data
  const stats = useMemo(() => {
    const completed = mockReferredFriends.filter(f => f.status === 'first_order').length;
    const pending = mockReferredFriends.filter(
      f => f.status === 'pending_signup' || f.status === 'signed_up'
    ).length;

    return {
      totalReferrals: mockReferredFriends.length,
      pendingReferrals: pending,
      completedReferrals: completed,
      freeMealsEarned: completed,
      freeMealsAvailable: completed, // Assuming all earned meals are still available
    };
  }, []);

  // Full referral data
  const referralData: ReferralData = useMemo(() => ({
    referralCode,
    referralLink,
    ...stats,
    referredFriends: mockReferredFriends,
  }), [referralCode, referralLink, stats]);

  // Copy referral link to clipboard
  const copyReferralLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      return true;
    } catch (err) {
      setError('Failed to copy link');
      return false;
    }
  }, [referralLink]);

  // Copy referral code to clipboard
  const copyReferralCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      return true;
    } catch (err) {
      setError('Failed to copy code');
      return false;
    }
  }, [referralCode]);

  // Share via different platforms
  const shareVia = useCallback((platform: 'whatsapp' | 'twitter' | 'email' | 'sms') => {
    const message = `Join SF Secret Menu and get exclusive chef-crafted meals delivered weekly! Use my code ${referralCode} for a special welcome.`;
    const encodedMessage = encodeURIComponent(message);
    const encodedLink = encodeURIComponent(referralLink);

    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodedMessage}%20${encodedLink}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedLink}`,
      email: `mailto:?subject=${encodeURIComponent('Join SF Secret Menu!')}&body=${encodedMessage}%0A%0A${encodedLink}`,
      sms: `sms:?body=${encodedMessage}%20${referralLink}`,
    };

    window.open(urls[platform], '_blank');
  }, [referralCode, referralLink]);

  // Refresh referral data (would fetch from API)
  const refreshReferrals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement actual API call
      // const data = await fetchReferralData(user?.id);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    } catch (err) {
      setError('Failed to load referral data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    referralData,
    referralCode,
    referralLink,
    isLoading,
    error,
    copyReferralLink,
    copyReferralCode,
    shareVia,
    refreshReferrals,
  };
}

export default useReferrals;
