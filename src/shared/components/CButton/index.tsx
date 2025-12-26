'use client';

import { Button } from '@mui/material';
import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<typeof Button> & {
  text: string;
  color?: 'primary' | 'secondary' | 'info' | 'inherit';
};

export default function CButton({ text, color, ...rest }: ButtonProps) {
  return (
    <Button
      color={color}
      variant="contained"
      sx={{
        textTransform: 'none',
        borderRadius: '50px',
        px: 3,
        fontWeight: 600,
        backgroundColor: color === 'primary' ? '#fff' : 'transparent',
        color: color === 'primary' ? '#000' : '#fff',
        border:
          color === 'primary' ? 'none' : '1px solid rgba(255,255,255,0.3)',
        '&:hover': {
          backgroundColor:
            color === 'primary' ? '#e0e0e0' : 'rgba(255,255,255,0.1)',
        },
        ...rest,
      }}
      {...rest}
    >
      {text}
    </Button>
  );
}
