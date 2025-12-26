import Title from "@shared/components/Title";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import CButton from "@shared/components/CButton";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Slide, toast } from "react-toastify";
import { useMutationPostExtrato } from "@features/extrato/hooks";
import { Loading } from "@shared/components/Loading";
import { NumericFormat } from "react-number-format";

interface FormValues {
  valor?: number;
  conta: string;
}

const initialValues: FormValues = {
  valor: undefined,
  conta: "",
};

const contaLabelMap: Record<string, string> = {
  "conta-corrente": "Conta Corrente",
  "poupanca": "Conta Poupança",
};

const validationSchema = Yup.object({
  valor: Yup.number()
    .typeError("Informe um valor válido")
    .moreThan(0, "O valor a depositar deve ser maior do que zero")
    .required("Informe o valor a ser depositado"),

  conta: Yup.string().required("Selecione a conta para depósito"),
});

export default function PageDeposito() {
  const [formKey, setFormKey] = useState(0);
  const postMutation = useMutationPostExtrato();

  return (
    <>
      <Loading show={postMutation.isPending} />
      <Title title="Realizar depósito" />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          const valorNumerico = values.valor ?? 0;
          const contaLabel = contaLabelMap[values.conta] ?? values.conta;
          const now = new Date();

          try {
            await postMutation.mutateAsync({
              values: {
                tipo: "Depósito",
                descricao: contaLabel,
                horario: now.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                valor: valorNumerico,
                icone: "AttachMoneyIcon",
                data: now.toISOString().slice(0, 10),
                conta: values.conta,
              },
            });

            toast.success("Depósito realizado com sucesso!", {
              position: "top-right",
              autoClose: 9000,
              theme: "colored",
              transition: Slide,
            });

            resetForm();
            setFormKey((k) => k + 1);
          } catch (error) {
            console.error("Erro ao realizar o depósito:", error);
            toast.error("Erro ao realizar o depósito.");
          }
        }}
      >
        {({ values, handleSubmit, setFieldValue, errors, touched }) => (
          <Box
            sx={{ p: 3, bgcolor: "#ffffff" }}
            component="form"
            onSubmit={handleSubmit}
          >
            <Typography sx={{ mb: 1, fontWeight: "bold" }}>
              Qual valor deseja depositar?
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
                Em qual conta você depositará esse valor?
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
