import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Typography,
  IconButton,
  Box,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ButtonServices from "@components/ButtonServices";
import type { Extrato } from "src/types/Extrato";
import { NumericFormat } from "react-number-format";
import {
  useMutationDeleteExtrato,
  useMutationUpdateExtrato,
  useQueryGetExtratoInfinity,
} from "@hooks/useQueryExtrato";
import { agruparPorData } from "@utils/agrupaPorData";
import { Slide, toast } from "react-toastify";
import Swal from "sweetalert2";
import { formatarDataGrupo } from "@utils/formataDataGrupo";
import { formatarValor } from "@utils/formataValor";
import { getIconComponent } from "@utils/getIconComponent";
import { Loading } from "@components/Loading";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type ExtratoListProps = {
  filtro: string;
  filtroData: Date | null;
};

export default function ExtratoList({
  filtro,
  filtroData,
}: Readonly<ExtratoListProps>) {
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [novoValor, setNovoValor] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useQueryGetExtratoInfinity();
  const updateMutate = useMutationUpdateExtrato();
  const deleteMutate = useMutationDeleteExtrato();
  function normalizeDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  const todosExtratos: Extrato[] = (data?.pages ?? []).flatMap(
    (page) => page.data
  );
  //Removendo duplicados
  const uniqueExtratos = Array.from(
    new Map(todosExtratos.map((item) => [item.id, item])).values()
  );

  // Aplica filtros
  const hoje = normalizeDate(new Date());
  const filtroDataNormalized = filtroData ? normalizeDate(filtroData) : null;
  const gruposFiltrados = agruparPorData(
    uniqueExtratos.filter((item) => {
      const busca = filtro.toLowerCase();
      const valorFiltro = filtro.replace(/[^\d,.-]/g, "").replace(",", ".");
      const dataItem = normalizeDate(new Date(item.data));
      const passaFiltroTexto =
        item.descricao.toLowerCase().includes(busca) ||
        item.tipo.toLowerCase().includes(busca) ||
        item.valor?.toString().includes(valorFiltro);

      const passaFiltroData =
        !filtroDataNormalized ||
        (dataItem >= filtroDataNormalized && dataItem <= hoje);
      return passaFiltroTexto && passaFiltroData;
    })
  );

  // Ordena dados
  const datasOrdenadas = gruposFiltrados
    ? Object.keys(gruposFiltrados).sort((a, b) => (a > b ? -1 : 1))
    : [];

  // Click Editar
  function handleEditClick(item: Extrato) {
    setEditandoId(item.id);
    setNovoValor(item.valor.toString().replace(".", ","));
  }

  // Atualizar
  async function handleUpdate(item: Extrato) {
    if (!item) return;

    const valorSanitizado = novoValor
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim();

    const valorNumber = Number(valorSanitizado);

    if (isNaN(valorNumber)) {
      console.log("Valor inválido:", valorSanitizado);
      toast.error("Valor inválido!");
      return;
    }

    try {
      setLoading(true);

      await updateMutate.mutateAsync({ id: item.id, valor: Number(novoValor) });

      toast.success("Extrato atualizado com sucesso.", {
        position: "top-right",
        autoClose: 9000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
      });

      setEditandoId(null);
      setNovoValor("");
    } catch (e) {
      console.error("Erro ao atualizar:", e);
      toast.error("Erro ao atualizar o extrato.");
    } finally {
      setLoading(false);
    }
  }

  // Remover
  async function handleDelete(item: Extrato) {
    if (!item) return;

    try {
      const result = await Swal.fire({
        title: "Você tem certeza?",
        html: `<p>Esta ação removerá o extrato. Deseja continuar?</p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, remover!",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#236B7A",
      });

      if (result.isConfirmed) {
        setLoading(true);

        await deleteMutate.mutateAsync({ id: item.id });

        toast.success("Extrato excluído com sucesso.", {
          position: "top-right",
          autoClose: 9000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Slide,
        });
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (e) {
      console.error("Erro ao excluir:", e);
    } finally {
      setLoading(false);
    }
  }

  // Cancelar
  function handleCancel() {
    setEditandoId(null);
    setNovoValor("");
  }

  return (
    <>
      <Loading show={loading} />
      <Box
        onScroll={(e) => {
          const target = e.currentTarget;
          const isNearBottom =
            target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
          if (isNearBottom && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        sx={{
          width: "100%",
          mx: 2,
          maxHeight: "60vh",
          overflowY: "auto",
          scrollbarGutter: "stable",
          borderRadius: 2,
          p: 1,
        }}
      >
        <List
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {datasOrdenadas.map((data) => (
            <React.Fragment key={data}>
              <Typography
                variant="h6"
                sx={{
                  mt: 2,
                  ml: 2,
                  fontWeight: 600,
                }}
              >
                {formatarDataGrupo(data)}
              </Typography>
              {gruposFiltrados[data]
                .slice()
                .sort((a, b) =>
                  a.horario < b.horario ? 1 : a.horario > b.horario ? -1 : 0
                )
                .map((item) => {
                  const isNegative = item.valor < 0;
                  const isEditing = editandoId === item.id;
                  return (
                    <ListItem
                      key={item.id}
                      secondaryAction={
                        isEditing ? (
                          <>
                            <IconButton
                              edge="end"
                              aria-label="save"
                              sx={{ color: "#388e3c", mr: 2 }}
                              onClick={() => handleUpdate(item)}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="cancel"
                              sx={{ color: "#d32f2f" }}
                              onClick={handleCancel}
                            >
                              <CloseIcon />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton
                              edge="end"
                              aria-label="edit"
                              sx={{ color: "#000", mr: 2 }}
                              onClick={() => handleEditClick(item)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              sx={{ color: "#000" }}
                              onClick={() => handleDelete(item)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )
                      }
                      sx={{
                        flexWrap: "wrap",
                      }}
                    >
                      <ListItemAvatar sx={{ mr: 2 }}>
                        <ButtonServices
                          icon={React.createElement(
                            getIconComponent(item.icone)
                          )}
                          disabled
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.tipo}
                        secondary={
                          <>
                            <Typography component="span" variant="inherit">
                              {item.descricao}
                            </Typography>
                            <br />
                            <Typography component="span" variant="caption">
                              {item.horario}
                            </Typography>
                          </>
                        }
                        sx={{
                          flex: 2,
                          "& .MuiListItemText-primary": { color: "#000" },
                          "& .MuiListItemText-secondary": { color: "#000" },
                        }}
                      />
                      <ListItemText
                        secondary={
                          isEditing ? (
                            <NumericFormat
                              size="small"
                              customInput={TextField}
                              value={novoValor}
                              prefix="R$ "
                              thousandSeparator="."
                              decimalSeparator=","
                              onValueChange={(values) =>
                                setNovoValor(values.value)
                              }
                              sx={{ width: 90 }}
                            />
                          ) : (
                            formatarValor(item.valor)
                          )
                        }
                        sx={{
                          "& .MuiListItemText-secondary": (theme) => ({
                            color: isNegative
                              ? theme.palette.error.main
                              : theme.palette.success.main,
                            fontWeight: 600,
                          }),
                          textAlign: "center",
                        }}
                      />
                    </ListItem>
                  );
                })}
            </React.Fragment>
          ))}
        </List>
        {isFetchingNextPage && (
          <Typography
            variant="body2"
            sx={{ textAlign: "center", width: "100%", mt: 2 }}
          >
            Carregando mais...
          </Typography>
        )}
      </Box>
    </>
  );
}
