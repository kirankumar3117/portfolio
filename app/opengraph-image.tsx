import { ImageResponse } from 'next/og';
import { profile } from '@/data/profile';

export const alt = 'Kiran Kumar Challagiri, full-stack developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: '80px',
          border: '2px solid #d2d0c8',
          background: '#f5f4f0',
          color: '#171715',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, marginBottom: 22 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: '#c52d21' }} />
            {profile.role.toUpperCase()}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 87, fontWeight: 700, letterSpacing: '-6px', lineHeight: 1.04 }}>
            <div>Kiran Kumar</div>
            <div style={{ display: 'flex' }}>Challagiri<span style={{ color: '#c52d21' }}>.</span></div>
          </div>
          <div style={{ fontSize: 22, marginTop: 28, color: '#5c5b56' }}>softwareguru.in</div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 250,
            height: 250,
            border: '10px solid #d2d0c8',
            borderRadius: 44,
            background: '#171715',
            color: '#f5f4f0',
            fontSize: 105,
            fontWeight: 700,
            letterSpacing: '-9px',
          }}
        >
          KK<span style={{ color: '#ff6958' }}>.</span>
        </div>
      </div>
    ),
    size,
  );
}
