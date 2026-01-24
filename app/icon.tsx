import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 20,
                    background: 'linear-gradient(to bottom right, #9333ea, #000000)', // Purple to Black
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: '8px', // Rounded corners (like an app icon)
                    fontWeight: 800,
                    border: '2px solid #ffffff30',
                }}
            >
                KK
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    );
}