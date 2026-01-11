/**
 * SF Secret Menu - Referral Service
 *
 * Handles all referral-related database operations:
 * - Get referral stats for a user
 * - Process referrals on signup
 * - Track referral status changes
 */

import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;
type Referral = Tables<'referrals'>;

export type ReferralStatus = 'pending' | 'signed_up' | 'first_order' | 'active';

export interface ReferredFriend {
  id: string;
  name: string | null;
  email: string | null;
  status: ReferralStatus;
  referredAt: Date;
  signedUpAt: Date | null;
  firstOrderAt: Date | null;
  rewardEarned: boolean;
}

export interface ReferralStats {
  referralCode: string | null;
  invitesRemaining: number;
  invitesUsed: number;
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  freeMealsEarned: number;
  referredFriends: ReferredFriend[];
}

/**
 * Get referral statistics for a user
 */
export async function getReferralStats(userId: string): Promise<ReferralStats | null> {
  // Get user profile with referral info
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('referral_code, invites_remaining')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    return null;
  }

  // Get referrals made by this user
  const { data: referrals, error: referralsError } = await supabase
    .from('referrals')
    .select(`
      id,
      referral_code,
      status,
      created_at,
      signed_up_at,
      first_order_at,
      referred_id
    `)
    .eq('referrer_id', userId)
    .order('created_at', { ascending: false });

  if (referralsError) {
    return null;
  }

  // Get referred users' profiles
  const referredIds = (referrals || [])
    .filter(r => r.referred_id)
    .map(r => r.referred_id as string);

  let referredProfiles: Record<string, Profile> = {};
  if (referredIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name, email')
      .in('id', referredIds);

    if (profiles) {
      referredProfiles = profiles.reduce((acc, p) => {
        acc[p.id] = p;
        return acc;
      }, {} as Record<string, Profile>);
    }
  }

  // Helper to safely mask email
  const maskEmail = (email: string | null): string | null => {
    if (!email || !email.includes('@')) return null;
    const [local, domain] = email.split('@');
    if (!local || !domain) return null;
    return `${local[0]}***@${domain}`;
  };

  // Map referrals to ReferredFriend format
  const referredFriends: ReferredFriend[] = (referrals || []).map(r => {
    const referredProfile = r.referred_id ? referredProfiles[r.referred_id] : null;
    const maskedEmail = maskEmail(referredProfile?.email ?? null);

    return {
      id: r.id,
      name: referredProfile?.name || null,
      email: maskedEmail,
      status: r.status as ReferralStatus,
      referredAt: new Date(r.created_at),
      signedUpAt: r.signed_up_at ? new Date(r.signed_up_at) : null,
      firstOrderAt: r.first_order_at ? new Date(r.first_order_at) : null,
      rewardEarned: r.status === 'first_order' || r.status === 'active',
    };
  });

  // Calculate stats
  const totalReferrals = referredFriends.length;
  const pendingReferrals = referredFriends.filter(
    f => f.status === 'pending' || f.status === 'signed_up'
  ).length;
  const completedReferrals = referredFriends.filter(
    f => f.status === 'first_order' || f.status === 'active'
  ).length;
  const invitesUsed = 10 - (profile.invites_remaining || 0);

  return {
    referralCode: profile.referral_code,
    invitesRemaining: profile.invites_remaining || 0,
    invitesUsed,
    totalReferrals,
    pendingReferrals,
    completedReferrals,
    freeMealsEarned: completedReferrals, // 1 free meal per completed referral
    referredFriends,
  };
}

/**
 * Process a referral when a new user signs up with a referral code
 */
export async function processReferral(
  referredUserId: string,
  referralCode: string
): Promise<{ success: boolean; error?: string }> {
  // Call the database function to process the referral
  const { data, error } = await supabase.rpc('process_referral', {
    referred_user_id: referredUserId,
    referrer_code: referralCode.toUpperCase(),
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: data === true };
}

/**
 * Validate a referral code exists and has available invites
 */
export async function validateReferralCode(code: string): Promise<{
  valid: boolean;
  referrerName?: string;
  invitesAvailable?: boolean;
}> {
  const { data, error } = await supabase
    .from('profiles')
    .select('name, invites_remaining')
    .eq('referral_code', code.toUpperCase())
    .single();

  if (error || !data) {
    return { valid: false };
  }

  return {
    valid: true,
    referrerName: data.name || undefined,
    invitesAvailable: (data.invites_remaining || 0) > 0,
  };
}

/**
 * Update referral status when user makes their first order
 */
export async function updateReferralOnFirstOrder(userId: string): Promise<void> {
  // Find the referral record where this user was referred
  const { data: referral, error: findError } = await supabase
    .from('referrals')
    .select('id, status')
    .eq('referred_id', userId)
    .single();

  if (findError || !referral) {
    // User wasn't referred, nothing to update
    return;
  }

  // Only update if status is 'signed_up'
  if (referral.status === 'signed_up') {
    await supabase
      .from('referrals')
      .update({
        status: 'first_order',
        first_order_at: new Date().toISOString(),
      })
      .eq('id', referral.id);
  }
}

export const referralService = {
  getReferralStats,
  processReferral,
  validateReferralCode,
  updateReferralOnFirstOrder,
};

export default referralService;
