import { serve } from 'https://deno.land/std@0.203.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (!STRIPE_SECRET_KEY) {
    return new Response(JSON.stringify({ error: 'Stripe secret key missing' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const payload = await req.json();
    const amount = Number(payload?.amount);
    const currency = (payload?.currency || 'usd').toLowerCase();

    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid donation amount' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const unitAmount = Math.round(amount * 100);

    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('payment_method_types[0]', 'card');
    params.append('line_items[0][quantity]', '1');
    params.append('line_items[0][price_data][currency]', currency);
    params.append('line_items[0][price_data][unit_amount]', String(unitAmount));
    params.append('line_items[0][price_data][product_data][name]', 'Donation — The Zoolabs Foundation');
    params.append(
      'line_items[0][price_data][product_data][description]',
      '100% tax deductible donation to The Zoolabs Foundation (501(c)(3)). EIN #883538992.',
    );
    params.append('metadata[donation_type]', 'zoo-ngo');
    params.append('metadata[tax_deductible]', 'true');
    params.append('metadata[ein]', '883538992');
    params.append('metadata[organization]', 'The Zoolabs Foundation');
    params.append('success_url', payload?.success_url);
    params.append('cancel_url', payload?.cancel_url);

    if (payload?.email) {
      params.append('customer_email', payload.email);
    }

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await stripeRes.json();

    if (!stripeRes.ok) {
      console.error('Stripe API error:', session);
      return new Response(JSON.stringify({ error: session?.error?.message || 'Stripe error' }), {
        status: stripeRes.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Stripe donation session error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create donation session';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
