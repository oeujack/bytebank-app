import Title from "@shared/components/Title";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import CButton from "@shared/components/CButton";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import {
  useMutationPostExtrato,
  useQueryGetExtrato,
} from "@features/extrato/hooks";
import { Slide, toast } from "react-toastify";
import { Loading } from "@shared/components/Loading";
import { NumericFormat } from "react-number-format";

interface FormValues {
  descricao: string;
  valor: string;
  conta: string;
}

const initialValues: FormValues = {
  descricao: "",
  valor: "",
  conta: "",
};

const validationSchema = Yup.object({
  descricao: Yup.string().required("Informe a descrição do boleto"),
  valor: Yup.string()
    .required("Informe o valor do boleto")
    .test(
      "valor-maior-que-zero",
      "O valor do boleto deve ser maior do que zero",
      (value) => {
        if (!value) return false;

        const valorNumerico = Number(
          value.replace(",", ".").replace("R$", "").trim()
        );

        return !Number.isNaN(valorNumerico) && valorNumerico > 0;
      }
    ),
  conta: Yup.string().required("Selecione a conta para pagamento"),
});

export default function PageBoleto() {
  const [loading, setLoading] = useState(false);
  const { data } = useQueryGetExtrato();
  const postMutation = useMutationPostExtrato();

  return (
    <>
      <Loading show={loading} />
      <Title title="Pagar Boleto" />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          const valorNumerico = Number(
            values.valor.replace(",", ".").replace("R$", "").trim()
          );

          if (Number.isNaN(valorNumerico) || valorNumerico <= 0) {
            toast.warning("Digite um valor válido para o boleto.");
            return;
          }

          const saldoConta = data
            ?.filter((item: any) => !item.conta || item.conta === values.conta)
            .reduce((acc: number, item: any) => acc + Number(item.valor), 0);

          if ((saldoConta ?? 0) < valorNumerico) {
            toast.warning("Saldo insuficiente para pagar o boleto.");
            return;
          }

          const contaLabel =
            values.conta === "conta-corrente"
              ? "Conta Corrente"
              : "Conta Poupança";

          try {
            setLoading(true);

            await postMutation.mutateAsync({
              values: {
                tipo: `Boleto (${contaLabel})`,
                descricao: values.descricao,
                horario: new Date().toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                valor: -Math.abs(valorNumerico),
                icone: "LanguageIcon",
                data: new Date().toISOString().slice(0, 10),
                conta: values.conta,
              },
            });

            toast.success("Boleto pago com sucesso!", {
              position: "top-right",
              autoClose: 9000,
              theme: "colored",
              transition: Slide,
            });

            resetForm();
          } catch (e) {
            console.error({
              title: "Erro ao realizar pagamento do boleto.",
              error: e,
            });
            toast.error("Erro ao realizar pagamento do boleto.");
          } finally {
            setLoading(false);
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
            <Typography sx={{ mb: 1, fontWeight: "bold" }}>
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

            <Typography sx={{ mb: 1, fontWeight: "bold" }}>
              Qual valor do boleto?
            </Typography>

            <NumericFormat
              customInput={TextField}
              variant="standard"
              fullWidth
              thousandSeparator="."
              decimalSeparator=","
              value={values.valor}
              onValueChange={(v) => setFieldValue("valor", v.value)}
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
                  color={values.conta === "conta-poupança" ? "info" : "inherit"}
                  text="conta-poupança"
                  onClick={() => setFieldValue("conta", "conta-poupança")}
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
              <CButton color="primary" text="Concluir" type="submit" />
            </Box>
          </Box>
        )}
      </Formik>
    </>
  );
}
