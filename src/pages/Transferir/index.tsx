import Title from '@components/Title';
import { Box, TextField, Typography } from '@mui/material';
import CButton from '@components/CButton';
import { useState } from 'react';
import { Slide, toast } from 'react-toastify';
import { useMutationPostExtrato, useQueryGetExtratoInfinity } from '@hooks/useQueryExtrato';
import { NumericFormat } from 'react-number-format';
import { Loading } from '@components/Loading';
import type { Extrato } from 'src/types/Extrato';

export default function PageTransferir() {
  const [contaDeposito, setContaDeposito] = useState('');
  const [destinatario, setDestinatario] = useState('');
  const [valor, setValor] = useState('');
  const [loading, setLoading] = useState(false);
  const { data } = useQueryGetExtratoInfinity()
  const postMutation = useMutationPostExtrato();

  const todosExtratos: Extrato[] = (data?.pages ?? []).flatMap(
    (page) => page.data
  );

  function handleConta(conta: string) {
    setContaDeposito(conta);
  }

  async function handleConcluir() {
    if (!destinatario || !valor || !contaDeposito) {
      toast.warning('Preencha todos os campos e selecione a conta.');
      return;
    }

    const valorNumerico = Number(valor.replace(',', '.').replace('R$', '').trim());
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      toast.warning('Digite um valor válido para transferência.');
      return;
    }

    const saldoConta = todosExtratos?.filter((item: any) => item.conta === contaDeposito)
      .reduce((acc: number, item: any) => acc + Number(item.valor), 0);

    const saldoAjustado = Number(saldoConta?.toFixed(2));
    const valorAjustado = Number(valorNumerico.toFixed(2));

    if (saldoAjustado < valorAjustado) {
      toast.warning('Saldo insuficiente para realizar a transferência.');
      return;
    }

    const contaLabel =
      contaDeposito === 'conta-corrente'
        ? 'Conta Corrente'
        : contaDeposito === 'conta-poupança'
          ? 'Conta Poupança'
          : contaDeposito;

    try {
      setLoading(true);

      await postMutation.mutateAsync({
        values: {
          tipo: `Transferência (${contaLabel})`,
          descricao: destinatario,
          horario: new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          valor: -Math.abs(valorNumerico),
          icone: 'LanguageIcon',
          data: new Date().toISOString().slice(0, 10),
          conta: contaDeposito,
        }
      });

      toast.success('Transferência realizada com sucesso!', {
        position: 'top-right',
        autoClose: 9000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Slide,
      });

      setDestinatario('');
      setValor('');
      setContaDeposito('');

      await new Promise((resolve) => setTimeout(resolve, 500));

    } catch (e) {
      console.error('Erro ao realizar a transferência:', e);
      toast.error('Erro ao realizar a transferência.');
    } finally {
      setLoading(false);
    }
  }


  return (
    <>
      <Loading show={loading} />
      <Title title="Realizar tranferência" />

      <Box sx={{ p: 3, bgcolor: '#ffffff' }}>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          sx={{ mb: 1, fontWeight: 'bold' }}
        >
          Para quem deseja transferir?
        </Typography>
        <TextField
          fullWidth
          variant="standard"
          placeholder="Nome do destinatário"
          value={destinatario}
          onChange={(e) => setDestinatario(e.target.value)}
          slotProps={{
            input: {
              disableUnderline: false,
            },
          }}
          sx={{ mb: 4 }}
        />

        <Typography
          variant="subtitle1"
          color="textSecondary"
          sx={{ mb: 1, fontWeight: 'bold' }}
        >
          Qual valor você deseja transferir?
        </Typography>
        <NumericFormat
          placeholder="R$"
          size="small"
          fullWidth
          variant='standard'
          customInput={TextField}
          value={valor}
          prefix="R$ "
          thousandSeparator="."
          decimalSeparator=","
          onValueChange={(values) => setValor(values.value)}
          sx={{ mb: 4 }}
          slotProps={{
            input: {
              disableUnderline: false,
            },
            inputLabel: {
              color: 'error',
            },
          }}
        />


        <Box sx={{ mb: 4, width: '100%' }}>
          <Typography sx={{ mb: 1, fontWeight: 'bold' }}>
            De qual conta vai sair esse valor?
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              justifyContent: 'center',
            }}
          >
            <CButton
              color={contaDeposito === 'conta-corrente' ? 'info' : 'inherit'}
              text="conta-corrente"
              onClick={() => handleConta('conta-corrente')}
            />
            <CButton
              color={contaDeposito === 'conta-poupança' ? 'info' : 'inherit'}
              text="conta-poupança"
              onClick={() => handleConta('conta-poupança')}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CButton color="primary" text="Concluir" onClick={handleConcluir} />
        </Box>
      </Box>
    </>
  );
}
