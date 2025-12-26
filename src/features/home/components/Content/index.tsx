import { Box, Typography } from '@mui/material';

export default function Content() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        px: { xs: 2, md: 6 },
        pt: { xs: '140px', md: '100px' },
        pb: { xs: '100px', md: '80px' },
        minHeight: { xs: 'auto', md: '100vh' },
        width: '100%',
      }}
    >
      <Box
        sx={{
          maxWidth: '800px',
          textAlign: 'left',
          animation: 'fadeInLeft 1s ease-out',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            color: 'white',
            fontWeight: '600',
            fontSize: { xs: '2.5rem', sm: '4rem', md: '5.5rem' },
            lineHeight: 1.1,
            mb: 2,
            letterSpacing: '-0.02em',
          }}
        >
          Bem vindo(a) <br /> ao Bytebank.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: { xs: '0.95rem', md: '1.1rem' },
            mb: 5,
            maxWidth: '450px',
            lineHeight: 1.6,
          }}
        >
          Encontre suporte para cada etapa da sua jornada financeira, desde
          conta corrente e poupança até planejamento de aposentadoria.
        </Typography>
      </Box>
    </Box>
  );
}
