import { Button, type SxProps, type Theme } from '@mui/material';
import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<typeof Button> & {
  text: string;
  color?: 'primary' | 'secondary' | 'info' | 'inherit';
  sx?: SxProps<Theme>;
};

export default function CButton({ text, color, sx, ...rest }: ButtonProps) {
  const isPrimary = color === 'primary';
  const isSelected = color === 'info';

  return (
    <Button
      variant="contained"
      {...rest}
      sx={{
        textTransform: 'none',
        borderRadius: '50px',
        px: 3,
        fontWeight: 600,
        boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
        color: isPrimary ? '#ffffff' : '#000000',
        backgroundColor: isPrimary ? '#000000' : '#ffffff',
        border: isSelected ? '1px solid #000000' : '',
        '&:hover': {
          backgroundColor: isPrimary ? '#333333' : '#f5f5f5',
        },
        ...sx,
      }}
    >
      {text}
    </Button>
  );
}
