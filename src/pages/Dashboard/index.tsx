import ButtonServices from '@components/ButtonServices';
import { Box } from '@mui/material';
import { Link } from '@tanstack/react-router';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CardComponents from '@components/CardComponents';
import CardPoupanca from '@components/CardPoupanca';
import CardInvestimentos from '@components/CardInvestimentos';
import CardServicos from '@components/CardServicos';
import ChartView from '@components/Chart';

export default function PageDashboard() {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          py: 5,
          px: 20,
          justifyContent: 'space-evenly',
          borderBottom: '1px solid #454545',
          color: '#ffffff',
        }}
      >
        <Link to="/transferir" className="navigationLink">
          <ButtonServices
            icon={<CurrencyExchangeIcon fontSize="large" />}
            label="Transferir"
            color="info"
          />
        </Link>

        <Link to="/boleto" className="navigationLink">
          <ButtonServices
            icon={<ReceiptIcon fontSize="large" />}
            label="Pagar Boleto"
            color="info"
          />
        </Link>
      </Box>
      <Box>
        <Box>
          <CardComponents title="Poupança">
            <CardPoupanca />
          </CardComponents>
          <CardComponents title="Movimento diário">
            <ChartView />
          </CardComponents>
          <CardComponents title="Investimentos">
            <CardInvestimentos />
          </CardComponents>
          <CardComponents title="Outros serviços">
            <CardServicos />
          </CardComponents>
        </Box>
      </Box>
    </>
  );
}
