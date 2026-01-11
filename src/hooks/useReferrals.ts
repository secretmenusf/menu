import { useState, useCallback, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  referralService,
  type ReferralStats,
  type ReferredFriend,
  type ReferralStatus,
} from '@/services/referralService';

export type { ReferralStatus, ReferredFriend };

export interface ReferralData {
  referralCode: string;
  referralLink: string;
  invitesRemaining: number;
  invitesUsed: number;
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  freeMealsEarned: number;
  freeMealsAvailable: number;
  referredFriends: ReferredFriend[];
}

const MAX_INVITES = 10;

export function useReferrals() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch referral stats from database
  const fetchStats = useCallback(async () => {
    if (!user) {
      setStats(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await referralService.getReferralStats(user.id);
      setStats(data);
    } catch {
      setError('Failed to load referral data');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch stats on mount and when user changes
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Get referral code from profile (database-generated) or stats
  const referralCode = useMemo(() => {
    return stats?.referralCode || profile?.referral_code || '';
  }, [stats?.referralCode, profile?.referral_code]);

  // Generate referral link
  const referralLink = useMemo(() => {
    if (!referralCode) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/signup?ref=${referralCode}`;
  }, [referralCode]);

  // Invites remaining (from database)
  const invitesRemaining = useMemo(() => {
    return stats?.invitesRemaining ?? profile?.invites_remaining ?? MAX_INVITES;
  }, [stats?.invitesRemaining, profile?.invites_remaining]);

  // Full referral data
  const referralData: ReferralData = useMemo(() => ({
    referralCode,
    referralLink,
    invitesRemaining,
    invitesUsed: stats?.invitesUsed ?? (MAX_INVITES - invitesRemaining),
    totalReferrals: stats?.totalReferrals ?? 0,
    pendingReferrals: stats?.pendingReferrals ?? 0,
    completedReferrals: stats?.completedReferrals ?? 0,
    freeMealsEarned: stats?.freeMealsEarned ?? 0,
    freeMealsAvailable: stats?.freeMealsEarned ?? 0,
    referredFriends: stats?.referredFriends ?? [],
  }), [referralCode, referralLink, invitesRemaining, stats]);

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

  // Refresh referral data
  const refreshReferrals = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  // Check if user can still invite
  const canInvite = invitesRemaining > 0;

  return {
    referralData,
    referralCode,
    referralLink,
    invitesRemaining,
    canInvite,
    isLoading,
    error,
    copyReferralLink,
    copyReferralCode,
    shareVia,
    refreshReferrals,
  };
}

export default useReferrals;
