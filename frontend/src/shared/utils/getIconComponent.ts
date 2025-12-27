import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export function getIconComponent(iconName: string) {
  const icons: Record<string, typeof AttachMoneyIcon> = {
    AttachMoneyIcon,
    CreditCardIcon,
    CompareArrowsIcon,
    ReceiptIcon,
    AccountBalanceIcon,
  };
  return icons[iconName] || AttachMoneyIcon;
}
