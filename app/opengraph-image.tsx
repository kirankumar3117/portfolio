import { ImageResponse } from 'next/og';

// Image metadata
export const alt = 'Kiran Kumar - Senior Full Stack Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #000000, #1a1a1a)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                    border: '20px solid #9333ea', // Purple Border
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {/* Logo Box */}
                    <div style={{
                        width: '80px', height: '80px', background: '#9333ea', borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 40, fontWeight: 'bold'
                    }}>
                        KK
                    </div>
                    <div style={{ fontSize: 60, fontWeight: 'bold', color: 'white' }}>
                        SOFTWARE GURU
                    </div>
                </div>
                <div style={{ fontSize: 30, color: '#a855f7', marginTop: '20px', letterSpacing: '2px' }}>
                    SENIOR FULL-STACK ENGINEER
                </div>
            </div>
        ),
        { ...size }
    );
}