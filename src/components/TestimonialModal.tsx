import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Camera, CheckCircle2, Loader2, Star, UploadCloud, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MAX_DURATION_SECONDS = 120;

const QUESTIONS = [
  'What did you love most about your meals?',
  'How did Secret Menu fit into your week?',
  'What dish surprised you the most?',
  'Would you recommend Secret Menu to a friend? Why?',
];

type Step = 'setup' | 'recording' | 'review' | 'submitted';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const getFileExt = (type: string) => {
  if (type.includes('webm')) return 'webm';
  if (type.includes('mp4')) return 'mp4';
  if (type.includes('quicktime')) return 'mov';
  if (type.includes('ogg')) return 'ogv';
  if (type.includes('png')) return 'png';
  if (type.includes('jpeg')) return 'jpg';
  if (type.includes('gif')) return 'gif';
  return 'bin';
};

const getRandomId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const TestimonialModal = ({ open, onOpenChange }: Props) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('setup');
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MAX_DURATION_SECONDS);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [socialPlatform, setSocialPlatform] = useState('');
  const [socialHandle, setSocialHandle] = useState('');
  const [socialUrl, setSocialUrl] = useState('');
  const [consent, setConsent] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const latestVideoUrlRef = useRef<string | null>(null);
  const latestImagePreviewsRef = useRef<string[]>([]);

  const hasVideo = Boolean(videoBlob || videoFile);

  const resetState = useCallback(() => {
    if (latestVideoUrlRef.current) {
      URL.revokeObjectURL(latestVideoUrlRef.current);
    }
    latestImagePreviewsRef.current.forEach(url => URL.revokeObjectURL(url));
    setStep('setup');
    setIsRecording(false);
    setTimeLeft(MAX_DURATION_SECONDS);
    setVideoBlob(null);
    setVideoFile(null);
    setVideoUrl(null);
    setImageFiles([]);
    setImagePreviews([]);
    setSocialPlatform('');
    setSocialHandle('');
    setSocialUrl('');
    setIsSubmitting(false);
    chunksRef.current = [];
    if (previewRef.current) {
      previewRef.current.srcObject = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open, resetState]);

  useEffect(() => {
    latestVideoUrlRef.current = videoUrl;
  }, [videoUrl]);

  useEffect(() => {
    latestImagePreviewsRef.current = imagePreviews;
  }, [imagePreviews]);

  useEffect(() => {
    return () => {
      if (latestVideoUrlRef.current) {
        URL.revokeObjectURL(latestVideoUrlRef.current);
      }
      latestImagePreviewsRef.current.forEach(url => URL.revokeObjectURL(url));
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (step === 'recording' && mediaStreamRef.current && previewRef.current) {
      previewRef.current.srcObject = mediaStreamRef.current;
      const playPromise = previewRef.current.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => undefined);
      }
    }
  }, [step]);

  const startTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    setTimeLeft(MAX_DURATION_SECONDS);
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          window.clearInterval(timerRef.current as number);
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = async () => {
    try {
      if (typeof MediaRecorder === 'undefined') {
        toast({
          title: 'Recording not supported',
          description: 'Your browser does not support video recording. Please upload a video file instead.',
          variant: 'destructive',
        });
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      if (previewRef.current) {
        previewRef.current.srcObject = stream;
        const playPromise = previewRef.current.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => undefined);
        }
      }

      const preferredType = 'video/webm;codecs=vp8,opus';
      const mimeType = MediaRecorder.isTypeSupported(preferredType) ? preferredType : undefined;
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = event => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blobType = recorder.mimeType || 'video/webm';
        const blob = new Blob(chunksRef.current, { type: blobType });
        const url = URL.createObjectURL(blob);
        setVideoBlob(blob);
        setVideoUrl(url);
        setStep('review');
        setIsRecording(false);
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null;
        }
      };

      recorder.start();
      setStep('recording');
      setIsRecording(true);
      startTimer();
    } catch (error) {
      toast({
        title: 'Camera access needed',
        description: 'Please allow camera and microphone access to record your testimonial.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleVideoUpload = (file: File | null) => {
    if (!file) return;
    if (latestVideoUrlRef.current) {
      URL.revokeObjectURL(latestVideoUrlRef.current);
    }
    setVideoFile(file);
    setVideoBlob(null);
    const nextUrl = URL.createObjectURL(file);
    setVideoUrl(nextUrl);
    setStep('review');
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    const next = Array.from(files);
    latestImagePreviewsRef.current.forEach(url => URL.revokeObjectURL(url));
    const previews = next.map(file => URL.createObjectURL(file));
    setImageFiles(next);
    setImagePreviews(previews);
  };

  const canSubmit = useMemo(() => {
    return Boolean(name.trim()) && rating > 0 && (hasVideo || imageFiles.length > 0 || message.trim());
  }, [hasVideo, imageFiles.length, message, name, rating]);

  const uploadFile = async (path: string, file: File, contentType?: string) => {
    const { error } = await supabase.storage.from('testimonials').upload(path, file, {
      upsert: false,
      contentType: contentType || file.type,
    });
    if (error) throw error;
    const { data } = supabase.storage.from('testimonials').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast({
        title: 'Missing details',
        description: 'Please add your name, rating, and a video or photo review.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let videoUrlPublic: string | null = null;

      const videoToUpload = videoFile || (videoBlob ? new File([videoBlob], `testimonial.${getFileExt(videoBlob.type)}`, { type: videoBlob.type }) : null);

      if (videoToUpload) {
        const videoPath = `videos/${Date.now()}-${getRandomId()}.${getFileExt(videoToUpload.type)}`;
        videoUrlPublic = await uploadFile(videoPath, videoToUpload, videoToUpload.type);
      }

      const imageUrls: string[] = [];
      for (const image of imageFiles) {
        const imagePath = `images/${Date.now()}-${getRandomId()}.${getFileExt(image.type)}`;
        const url = await uploadFile(imagePath, image, image.type);
        imageUrls.push(url);
      }

      const { error } = await supabase
        .from('testimonial_submissions')
        .insert({
          user_id: user?.id ?? null,
          name: name.trim(),
          email: email.trim() || null,
          rating,
          text: message.trim() || null,
          consent,
          video_url: videoUrlPublic,
          image_urls: imageUrls.length > 0 ? imageUrls : null,
          social_platform: socialPlatform || null,
          social_handle: socialHandle.trim() || null,
          social_url: socialUrl.trim() || null,
          status: 'pending',
        });

      if (error) throw error;

      setStep('submitted');
      toast({
        title: 'Thank you!',
        description: 'Your review is received and will be published after approval.',
      });
    } catch (error) {
      toast({
        title: 'Submission failed',
        description: 'Please try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, idx) => {
        const starValue = idx + 1;
        return (
          <button
            key={starValue}
            type="button"
            onClick={() => setRating(starValue)}
            className="p-1"
          >
            <Star className={cn('h-4 w-4', starValue <= rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground')} />
          </button>
        );
      })}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        {step === 'setup' && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-lg tracking-wider text-foreground flex items-center gap-2">
                <Video className="h-5 w-5 text-muted-foreground" />
                Share Your Video Review
              </DialogTitle>
              <DialogDescription>
                Take up to 120 seconds. You can record or upload a video, and add photos too.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
                <p className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-3">PROMPTS</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {QUESTIONS.map(question => (
                    <li key={question} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
                <p className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-3">DEVICE CHECK</p>
                <div className="flex flex-col gap-3">
                  <Button onClick={startRecording} className="font-display tracking-wider">
                    <Camera className="mr-2 h-4 w-4" />
                    RECORD MY VIDEO
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setStep('review')}
                    className="font-display tracking-wider"
                  >
                    CONTINUE WITHOUT VIDEO
                  </Button>
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs tracking-wider">UPLOAD A VIDEO FILE</Label>
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(event) => handleVideoUpload(event.target.files?.[0] || null)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs tracking-wider">UPLOAD PHOTOS (OPTIONAL)</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => handleImageUpload(event.target.files)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 'recording' && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-lg tracking-wider text-foreground flex items-center gap-2">
                <Camera className="h-5 w-5 text-muted-foreground" />
                Recording Your Testimonial
              </DialogTitle>
              <DialogDescription>
                Keep it short and heartfelt. You can stop anytime.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border/60 bg-black/70 overflow-hidden">
                <video
                  ref={previewRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-64 object-cover"
                />
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{isRecording ? 'Recording...' : 'Paused'}</span>
                <span>{Math.max(0, timeLeft)}s left</span>
              </div>

              <Button onClick={stopRecording} variant="destructive" className="font-display tracking-wider">
                STOP RECORDING
              </Button>
            </div>
          </>
        )}

        {step === 'review' && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-lg tracking-wider text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                Review Your Submission
              </DialogTitle>
              <DialogDescription>
                Confirm the details below before sending.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {videoUrl && (
                <video controls className="w-full rounded-2xl border border-border/60">
                  <source src={videoUrl} />
                </video>
              )}

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {imagePreviews.map((preview, idx) => (
                    <img
                      key={`${preview}-${idx}`}
                      src={preview}
                      alt="Review upload"
                      className="h-20 w-full rounded-xl object-cover"
                    />
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs tracking-wider">RATING</Label>
                {renderStars()}
              </div>

              <div className="space-y-2">
                <Label className="text-xs tracking-wider">YOUR NAME</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs tracking-wider">YOUR EMAIL (OPTIONAL)</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" type="email" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs tracking-wider">WRITTEN REVIEW (OPTIONAL)</Label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Add a short note..." />
              </div>

              <div className="space-y-2">
                <Label className="text-xs tracking-wider">SOCIAL PROFILE (OPTIONAL)</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Select value={socialPlatform} onValueChange={setSocialPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="x">X / Twitter</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={socialHandle}
                    onChange={(e) => setSocialHandle(e.target.value)}
                    placeholder="@yourhandle"
                  />
                </div>
                <Input
                  value={socialUrl}
                  onChange={(e) => setSocialUrl(e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>

              <label className="flex items-start gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border"
                />
                I give permission to use this testimonial in marketing materials.
              </label>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <Button variant="outline" onClick={() => setStep('setup')} className="font-display tracking-wider">
                  RECORD AGAIN
                </Button>
                <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting} className="font-display tracking-wider">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      SENDING...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="mr-2 h-4 w-4" />
                      CONFIRM & SEND
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'submitted' && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-lg tracking-wider text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Thank You
              </DialogTitle>
              <DialogDescription>
                Your testimonial is received. We will review it shortly.
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-center">
              <Button onClick={() => onOpenChange(false)} className="font-display tracking-wider">
                CLOSE
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
