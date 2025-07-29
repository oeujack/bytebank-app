import Title from '@components/Title';
import { Box, TextField, Typography } from '@mui/material';
import CButton from '@components/CButton';
import { useState } from 'react';
import { useMutationPostExtrato, useQueryGetExtratoInfinity } from '@hooks/useQueryExtrato';
import { Slide, toast } from 'react-toastify';
import { Loading } from '@components/Loading';
import { NumericFormat } from 'react-number-format';
import type { Extrato } from 'src/types/Extrato';

export default function PageBoleto() {
  const [conta, setConta] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [loading, setLoading] = useState(false);
  const { data } = useQueryGetExtratoInfinity()
  const postMutation = useMutationPostExtrato();

  const todosExtratos: Extrato[] = (data?.pages ?? []).flatMap(
      (page) => page.data
    );

  function handleConta(contaSelecionada: string) {
    setConta(contaSelecionada);
  }

  async function handleConcluir() {
    if (!descricao || !valor || !conta) {
      toast.warning('Preencha todos os campos e selecione a conta.');
      return;
    }

    const valorNumerico = Number(valor.replace(',', '.').replace('R$', '').trim());
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      toast.warning('Digite um valor válido para o boleto.');
      return;
    }


    const saldoConta = todosExtratos?.filter((item: any) => !item.conta || item.conta === conta
    )
      .reduce((acc: number, item: any) => acc + Number(item.valor), 0);

    const saldoAjustado = Number(saldoConta?.toFixed(2));
    const valorAjustado = Number(valorNumerico.toFixed(2));

    if (saldoAjustado < valorAjustado) {
      toast.warning('Saldo insuficiente para pagar o boleto.');
      return;
    }

    const contaLabel =
      conta === 'conta-corrente'
        ? 'Conta Corrente'
        : conta === 'conta-poupança'
          ? 'Conta Poupança'
          : conta;

    try {
      setLoading(true);
      await postMutation.mutateAsync({
        values: {
          tipo: `Boleto (${contaLabel})`,
          descricao,
          horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          valor: -Math.abs(valorNumerico),
          icone: 'LanguageIcon',
          data: new Date().toISOString().slice(0, 10),
          conta,
        }
      });

      toast.success('Boleto pago com sucesso!', {
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

      setDescricao('');
      setValor('');
      setConta('');

      await new Promise((resolve) => setTimeout(resolve, 500));

    } catch (e) {
      console.error('Erro ao realizar pagamento do boleto:', e);
      toast.error('Erro ao realizar pagamento do boleto.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Loading show={loading} />
      <Title title="Pagar Boleto" />

      <Box sx={{ p: 3, bgcolor: '#ffffff' }}>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          sx={{ mb: 1, fontWeight: 'bold' }}
        >
          Descrição do boleto
        </Typography>
        <TextField
          fullWidth
          variant="standard"
          placeholder="Ex: Conta de luz"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
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
          Qual valor do boleto?
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
              color={conta === 'conta-corrente' ? 'info' : 'inherit'}
              text="conta-corrente"
              onClick={() => handleConta('conta-corrente')}
            />
            <CButton
              color={conta === 'conta-poupança' ? 'info' : 'inherit'}
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