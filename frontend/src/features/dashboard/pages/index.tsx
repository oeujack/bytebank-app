import ButtonServices from '@shared/components/ButtonServices';
import { Box } from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CardComponents from '@shared/components/CardComponents';
import CardPoupanca from '@shared/components/CardPoupanca';
import CardInvestimentos from '@shared/components/CardInvestimentos';
import CardServicos from '@shared/components/CardServicos';
import ChartView from '@shared/components/Chart';
import { Link } from 'react-router-dom';

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
