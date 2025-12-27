import { Backdrop, Typography } from "@mui/material";
import HashLoader from 'react-spinners/HashLoader'

interface LoadingProps {
  show?: boolean;
}

export function Loading({ show = false }: LoadingProps) {
  return (
    <Backdrop open={show} sx={{
      color: "#fff",
      zIndex: (theme) => theme.zIndex.drawer + 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>
      <HashLoader color="#236B7A" />
      <Typography>Carregando...</Typography>
    </Backdrop>
  )
}