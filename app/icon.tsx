import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          borderRadius: 7,
          background: '#171715',
          color: '#f5f4f0',
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: '-1px',
        }}
      >
        KK<span style={{ color: '#ff6958' }}>.</span>
      </div>
    ),
    size,
  );
}
