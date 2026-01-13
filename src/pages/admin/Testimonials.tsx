import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Video, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestimonialSubmission {
  id: string;
  name: string;
  email: string | null;
  rating: number;
  text: string | null;
  consent: boolean;
  video_url: string | null;
  image_urls: string[] | null;
  social_platform: string | null;
  social_handle: string | null;
  social_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const statusStyles: Record<TestimonialSubmission['status'], string> = {
  pending: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
  approved: 'bg-green-500/15 text-green-600 border-green-500/30',
  rejected: 'bg-red-500/15 text-red-500 border-red-500/30',
};

export default function Testimonials() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<TestimonialSubmission[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | TestimonialSubmission['status']>('pending');
  const [loading, setLoading] = useState(false);

  const loadSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('testimonial_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Unable to load testimonials',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setSubmissions((data ?? []) as TestimonialSubmission[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return submissions;
    return submissions.filter(item => item.status === statusFilter);
  }, [statusFilter, submissions]);

  const updateStatus = async (id: string, status: TestimonialSubmission['status']) => {
    const { error } = await supabase
      .from('testimonial_submissions')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setSubmissions(prev => prev.map(item => (item.id === id ? { ...item, status } : item)));
    toast({
      title: 'Status updated',
      description: `Testimonial marked as ${status}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-[0.1em] mb-2">TESTIMONIALS</h1>
          <p className="text-muted-foreground font-body">
            Review and approve video testimonials from customers.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadSubmissions} disabled={loading}>
            <RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-[0.1em]">SUBMISSIONS</CardTitle>
          <CardDescription>
            {filtered.length} testimonial{filtered.length === 1 ? '' : 's'} shown
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
              No testimonials found for this filter.
            </div>
          )}

          {filtered.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border/40 bg-card/40 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-sm tracking-[0.15em] text-foreground">{item.name}</h3>
                    <Badge variant="outline" className={cn('text-[10px]', statusStyles[item.status])}>
                      {item.status.toUpperCase()}
                    </Badge>
                    {item.consent && (
                      <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/40">
                        CONSENT
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.email ?? 'No email provided'}</p>
                  <p className="text-xs text-muted-foreground">Rating: {item.rating} / 5</p>
                  {item.social_url && (
                    <a
                      href={item.social_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.social_platform ? item.social_platform.toUpperCase() : 'SOCIAL'}{' '}
                      {item.social_handle || 'View profile'}
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => updateStatus(item.id, 'approved')}>
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => updateStatus(item.id, 'rejected')}>
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>

              {item.text && (
                <p className="mt-4 text-sm text-muted-foreground">{item.text}</p>
              )}

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {item.video_url && (
                  <div className="rounded-xl border border-border/50 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Video className="h-4 w-4" />
                      Video testimonial
                    </div>
                    <video controls className="w-full rounded-lg">
                      <source src={item.video_url} />
                    </video>
                  </div>
                )}
                {item.image_urls && item.image_urls.length > 0 && (
                  <div className="rounded-xl border border-border/50 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <ImageIcon className="h-4 w-4" />
                      Uploaded photos
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {item.image_urls.map((url, idx) => (
                        <img key={`${item.id}-img-${idx}`} src={url} alt="Review upload" className="h-20 w-full rounded-lg object-cover" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
