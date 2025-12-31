import Title from '@shared/components/Title';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import CButton from '@shared/components/CButton';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useState, useMemo } from 'react';
import {
  useMutationPostExtrato,
  useQueryGetExtrato,
} from '@features/extrato/hooks';
import { Slide, toast } from 'react-toastify';
import { Loading } from '@shared/components/Loading';
import { NumericFormat } from 'react-number-format';

interface FormValues {
  descricao: string;
  valor?: number;
  conta: string;
}

const initialValues: FormValues = {
  descricao: '',
  valor: undefined,
  conta: '',
};


const validationSchema = Yup.object({
  descricao: Yup.string().required('Informe a descrição do boleto'),

  valor: Yup.number()
    .typeError('Informe um valor válido')
    .moreThan(0, 'O valor deve ser maior que zero')
    .required('Informe o valor do boleto'),

  conta: Yup.string().required(
    'Selecione a conta de onde o valor será debitado'
  ),
});

export default function PageBoleto() {
  const [formKey, setFormKey] = useState(0);
  const { data } = useQueryGetExtrato();
  const postMutation = useMutationPostExtrato();

  // Calculando saldo
  const saldoPorConta = useMemo<Record<string, number>>(() => {
    if (!data) return Object.create(null);

    return data.reduce((acc, item: any) => {
      const conta = item.conta ?? 'global';
      acc[conta] = (acc[conta] || 0) + Number(item.valor);
      return acc;
    }, Object.create(null));
  }, [data]);

  return (
    <>
      <Loading show={postMutation.isPending} />
      <Title title="Pagar Boleto" />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {        
          const valorNumerico = values.valor ?? 0;
          const saldoConta =
            saldoPorConta[values.conta] ?? saldoPorConta['global'] ?? 0;
          if (saldoConta < valorNumerico) {
            toast.warning('Saldo insuficiente para pagar o boleto.');
            return;
          }

          const now = new Date();

          try {
            await postMutation.mutateAsync({
              values: {
                tipo: 'pagamento',
                descricao: values.descricao,
                horario: now.toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                valor: -Math.abs(valorNumerico),
                icone: 'LanguageIcon',
                data: now.toISOString().slice(0, 10),
                conta: values.conta,
              },
            });

            toast.success('Boleto pago com sucesso!', {
              position: 'top-right',
              autoClose: 9000,
              theme: 'colored',
              transition: Slide,
            });

            resetForm();
            setFormKey((k) => k + 1);
          } catch (error) {
            console.error('Erro ao realizar pagamento do boleto:', error);
            toast.error('Erro ao realizar pagamento do boleto.');
          }
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          setFieldValue,
          errors,
          touched,
        }) => (
          <Box
            sx={{ p: 3, bgcolor: '#ffffff' }}
            component="form"
            onSubmit={handleSubmit}
          >
            <Typography sx={{ mb: 1, fontWeight: 'bold' }}>
              Descrição do boleto
            </Typography>

            <TextField
              fullWidth
              variant="standard"
              placeholder="Ex: Conta de luz"
              name="descricao"
              value={values.descricao}
              onChange={handleChange}
              error={touched.descricao && Boolean(errors.descricao)}
              helperText={touched.descricao && errors.descricao}
              sx={{ mb: 4 }}
            />

            <Typography sx={{ mb: 1, fontWeight: 'bold' }}>
              Qual valor do boleto?
            </Typography>

            <NumericFormat
              key={formKey}
              customInput={TextField}
              variant="standard"
              fullWidth
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              value={values.valor}
              onValueChange={(v) => setFieldValue('valor', v.floatValue)}
              error={touched.valor && Boolean(errors.valor)}
              helperText={touched.valor && errors.valor}
              sx={{ mb: 4 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                },
              }}
            />

            <Box sx={{ mb: 4 }}>
              <Typography sx={{ mb: 1, fontWeight: 'bold' }}>
                De qual conta vai sair esse valor?
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <CButton
                  color={values.conta === 'conta-corrente' ? 'info' : 'inherit'}
                  text="conta-corrente"
                  onClick={() => setFieldValue('conta', 'conta-corrente')}
                />
                <CButton
                  color={values.conta === 'poupanca' ? 'info' : 'inherit'}
                  text="poupanca"
                  onClick={() => setFieldValue('conta', 'poupanca')}
                />
              </Box>
              {touched.conta && errors.conta && (
                <Typography
                  color="error"
                  sx={{ mt: 1, textAlign: 'center', fontSize: '12px' }}
                >
                  {errors.conta}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <CButton
                color="primary"
                text="Concluir"
                type="submit"
                disabled={postMutation.isPending}
              />
            </Box>
          </Box>
        )}
      </Formik>
    </>
  );
}
