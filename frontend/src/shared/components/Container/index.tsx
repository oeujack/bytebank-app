import Balance from '@shared/components/Balance';
import HeaderComponent from '@shared/components/Header';
import { Container } from '@mui/material';

export default function MainContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Container
        sx={{
          border: '1px solid #454545',
          height: '100%',
          pr: 0,
          pl: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <HeaderComponent />
        <Balance />
        {children}
      </Container>
    </>
  );
}
