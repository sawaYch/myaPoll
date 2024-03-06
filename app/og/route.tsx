/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          background: '#222222',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          tw='opacity-30 absolute'
          width='1024'
          height='570'
          src={'https://myapoll.vercel.app/mya-bg.png'}
          alt='og-image'
        />
        <h2 tw='flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-left'>
          <span tw='text-white/70 ml-2'>Welcome</span>
          <span tw='text-pink-600 text-6xl'>MyaPoll🐼</span>
        </h2>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
