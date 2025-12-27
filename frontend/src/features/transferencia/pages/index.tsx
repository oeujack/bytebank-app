import Title from "@shared/components/Title";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import CButton from "@shared/components/CButton";
import { useState, useMemo } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Slide, toast } from "react-toastify";
import {
  useMutationPostExtrato,
  useQueryGetExtrato,
} from "@features/extrato/hooks";
import { NumericFormat } from "react-number-format";
import { Loading } from "@shared/components/Loading";

interface FormValues {
  destinatario: string;
  valor?: number;
  conta: string;
}

const initialValues: FormValues = {
  destinatario: "",
  valor: undefined,
  conta: "",
};

const contaLabelMap: Record<string, string> = {
  "conta-corrente": "Conta Corrente",
  "poupanca": "Conta Poupança",
};

// Validações de campos do formulário
const validationSchema = Yup.object({
  destinatario: Yup.string().required("Informe o destinatário"),

  valor: Yup.number()
    .typeError("Informe um valor válido")
    .moreThan(0, "O valor deve ser maior que zero")
    .required("Informe o valor a ser transferido"),

  conta: Yup.string().required(
    "Selecione a conta de onde o valor será retirado"
  ),
});

export default function PageTransferir() {
  const [formKey, setFormKey] = useState(0);
  const { data } = useQueryGetExtrato();
  const postMutation = useMutationPostExtrato();

  // Calculando saldo
  const saldoPorConta = useMemo<Record<string, number>>(() => {
    if (!data) return Object.create(null);

    return data.reduce((acc, item: any) => {
      const conta = item.conta ?? "global";
      acc[conta] = (acc[conta] || 0) + Number(item.valor);
      return acc;
    }, Object.create(null));
  }, [data]);

  return (
    <>
      <Loading show={postMutation.isPending} />
      <Title title="Realizar tranferência" />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          //Validação de saldo suficiente
          const valorNumerico = values.valor ?? 0;
          const saldoConta =
            saldoPorConta[values.conta] ?? saldoPorConta["global"] ?? 0;
          if (saldoConta < valorNumerico) {
            toast.warning("Saldo insuficiente para realizar a transferência.");
            return;
          }

          const now = new Date();
          const contaLabel = contaLabelMap[values.conta] ?? values.conta;

          try {
            await postMutation.mutateAsync({
              values: {
                tipo: `Transferência (${contaLabel})`,
                descricao: values.destinatario,
                horario: now.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                valor: -Math.abs(valorNumerico),
                icone: "LanguageIcon",
                data: now.toISOString().slice(0, 10),
                conta: values.conta,
              },
            });

            toast.success("Transferência realizada com sucesso!", {
              position: "top-right",
              autoClose: 9000,
              theme: "colored",
              transition: Slide,
            });

            resetForm();
            setFormKey((k) => k + 1);
          } catch (error) {
            console.error("Erro ao realizar a transferência:", error);
            toast.error("Erro ao realizar a transferência.");
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
            sx={{ p: 3, bgcolor: "#ffffff" }}
            component="form"
            onSubmit={handleSubmit}
          >
            <Typography
              variant="subtitle1"
              color="textSecondary"
              sx={{ mb: 1, fontWeight: "bold" }}
            >
              Para quem deseja transferir?
            </Typography>

            <TextField
              fullWidth
              variant="standard"
              placeholder="Nome do destinatário"
              name="destinatario"
              value={values.destinatario}
              onChange={handleChange}
              error={touched.destinatario && Boolean(errors.destinatario)}
              helperText={touched.destinatario && errors.destinatario}
              sx={{ mb: 4 }}
            />

            <Typography
              variant="subtitle1"
              color="textSecondary"
              sx={{ mb: 1, fontWeight: "bold" }}
            >
              Qual valor você deseja transferir?
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
              onValueChange={(v) => setFieldValue("valor", v.floatValue)}
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
              <Typography sx={{ mb: 1, fontWeight: "bold" }}>
                De qual conta vai sair esse valor?
              </Typography>

              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <CButton
                  color={values.conta === "conta-corrente" ? "info" : "inherit"}
                  text="conta-corrente"
                  onClick={() => setFieldValue("conta", "conta-corrente")}
                />
                <CButton
                  color={values.conta === "poupanca" ? "info" : "inherit"}
                  text="poupanca"
                  onClick={() => setFieldValue("conta", "poupanca")}
                />
              </Box>
              {touched.conta && errors.conta && (
                <Typography
                  color="error"
                  sx={{ mt: 1, textAlign: "center", fontSize: "12px" }}
                >
                  {errors.conta}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
