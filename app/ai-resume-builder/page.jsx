import AIResumeBuilder from '@/components/tools/AIResumeBuilder';

export const metadata = {
  title: 'Free AI Resume Builder — Create Professional Resumes in Minutes | ConvertLinx',
  description: 'Build a professional, ATS-friendly resume for free with AI-powered content enhancement. Choose from 3 templates, download as PDF. No signup required.',
  keywords: 'AI resume builder, free resume builder, resume maker, professional resume, ATS-friendly resume, AI resume, resume generator, online resume builder, create resume free, download resume PDF',
  openGraph: {
    title: 'Free AI Resume Builder — ConvertLinx',
    description: 'Create a professional resume in minutes with AI enhancement. Free, no signup.',
    type: 'website',
    url: 'https://convertlinx.com/ai-resume-builder',
  },
};

export default function Page() {
  return <AIResumeBuilder />;
}