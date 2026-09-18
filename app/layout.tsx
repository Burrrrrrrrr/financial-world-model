import type { Metadata } from 'next';
import './globals.css';
import { sitePath } from './sitePath';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://127.0.0.1:3000'),
  title: '金融世界模型 · Master Curriculum',
  description: '从市场微观结构到复杂系统研究的七层金融市场认知课程。',
  openGraph: {
    title: '金融世界模型',
    description: '从市场微观结构到复杂系统研究的七层金融市场认知课程。',
    images: [sitePath('/og.png')],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '金融世界模型',
    description: '从市场微观结构到复杂系统研究的七层金融市场认知课程。',
    images: [sitePath('/og.png')],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href={sitePath('/favicon.svg')} type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
