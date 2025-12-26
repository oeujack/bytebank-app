import React, { useMemo, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Typography,
  IconButton,
  Box,
  TextField,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ButtonServices from '@shared/components/ButtonServices';
import { NumericFormat } from 'react-number-format';
import {
  useMutationDeleteExtrato,
  useMutationUpdateExtrato,
  useQueryGetExtrato,
} from '@features/extrato/hooks';
import { agruparPorData, formatarDataGrupo, formatarValor, getIconComponent, isHoje, isNosUltimos7Dias, isOntem, toBase64 } from '@shared/utils';
import { Slide, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { Loading } from '@shared/components/Loading';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@app/providers/store';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { removePdf, uploadPdf } from '@features/extrato/store/pdfSlice';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import type { Extrato } from '@shared/interfaces';

export default function ExtratoList() {
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [novoValor, setNovoValor] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { data } = useQueryGetExtrato();
  const updateMutate = useMutationUpdateExtrato();
  const deleteMutate = useMutationDeleteExtrato();

  const filtro = useSelector((state: RootState) => state.extratoFilter.filtroData);
  const busca = useSelector((state: RootState) => state.extratoFilter.filtroBusca.toLowerCase());

  const dispatch = useDispatch();
  const pdfs = useSelector((state: RootState) => state.pdf);

  async function handlePdfUpload(event: React.ChangeEvent<HTMLInputElement>, extratoId: string) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Apenas arquivos PDF são permitidos.');
      return;
    }

    const base64 = await toBase64(file);
    dispatch(uploadPdf({ extratoId, pdfData: base64 }));
    toast.success('PDF enviado com sucesso!');
  }

  function handlePdfDelete(extratoId: string) {
    dispatch(removePdf({ extratoId }));
    toast.success('PDF removido com sucesso!');
  }

  function handlePdfView(extratoId: string) {
    const pdfData = pdfs[extratoId];
    if (!pdfData) {
      toast.error('Nenhum PDF disponível.');
      return;
    }
    const win = window.open();
    if (win) {
      win.document.write(
        `<iframe src="${pdfData}" frameborder="0" style="width:100%;height:100%;"></iframe>`
      );
    }
  }

  const dataFiltrada = useMemo(() => {
    if (!data) return [];

    return data
      .filter((item) => {
        switch (filtro) {
          case 'hoje':
            return isHoje(item.data);
          case 'ontem':
            return isOntem(item.data);
          case 'ultimos7dias':
            return isNosUltimos7Dias(item.data);
          default:
            return true;
        }
      })
      .filter((item) => {
        if (!busca) return true;

        const texto = `${item.tipo} ${item.descricao} ${item.valor} ${item.data}`.toLowerCase();
        return texto.includes(busca);
      });
  }, [data, filtro, busca]);

  const grupos = agruparPorData(dataFiltrada);

  const datasOrdenadas = grupos
    ? Object.keys(grupos).sort((a, b) => {
        if (a > b) return -1;
        if (a < b) return 1;
        return 0;
      })
    : [];

  function handleEditClick(item: Extrato) {
    setEditandoId(item.id);
    setNovoValor(item.valor.toString().replace('.', ','));
  }

  async function handleUpdate(item: Extrato) {
    if (!item) return;

    const valorSanitizado = novoValor
      .replace('R$', '')
      .replace(/\./g, '')
      .replace(',', '.')
      .trim();

    const valorNumber = Number(valorSanitizado);

    if (isNaN(valorNumber)) {
      toast.error('Valor inválido!');
      return;
    }

    try {
      setLoading(true);

      await updateMutate.mutateAsync({ id: item.id, valor: Number(novoValor) });

      toast.success('Extrato atualizado com sucesso.', {
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

      setEditandoId(null);
      setNovoValor('');
    } catch (e) {
      console.error('Erro ao atualizar:', e);
      toast.error('Erro ao atualizar o extrato.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(item: Extrato) {
    if (!item) return;

    try {
      const result = await Swal.fire({
        title: 'Você tem certeza?',
        html: `<p>Esta ação removerá o extrato. Deseja continuar?</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, remover!',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#236B7A',
      });

      if (result.isConfirmed) {
        setLoading(true);

        await deleteMutate.mutateAsync({ id: item.id });

        toast.success('Extrato excluído com sucesso.', {
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
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (e) {
      console.error('Erro ao excluir:', e);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setEditandoId(null);
    setNovoValor('');
  }

  return (
    <>
      <Loading show={loading} />
      <Box
        sx={{
          width: '100%',
          mx: 2,
          maxHeight: '60vh',
          overflowY: 'auto',
          scrollbarGutter: 'stable',
          borderRadius: 2,
          p: 1,
        }}
      >
        <List
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
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
              {grupos[data]
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
                              disableRipple
                              sx={{ color: '#388e3c', mr: 2 }}
                              onClick={() => handleUpdate(item)}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                            <IconButton
                              edge="end"
                              disableRipple
                              aria-label="cancel"
                              sx={{ color: '#d32f2f' }}
                              onClick={handleCancel}
                            >
                              <CloseIcon />
                            </IconButton>
                          </>
                        ) : (
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Tooltip title="Editar extrato" placement="top" arrow>
                              <IconButton
                                edge="end"
                                disableRipple
                                aria-label="edit"
                                sx={{ color: '#000' }}
                                onClick={() => handleEditClick(item)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Remover extrato" placement="top" arrow>
                              <IconButton
                                edge="end"
                                disableRipple
                                aria-label="delete"
                                sx={{ color: '#000' }}
                                onClick={() => handleDelete(item)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Enviar comprovante" placement="top" arrow>
                              <IconButton
                                disabled={!!pdfs[item.id]}
                                disableRipple
                                component="label"
                                sx={{ color: '#000' }}
                              >
                                <UploadFileIcon />
                                <input
                                  type="file"
                                  accept="application/pdf"
                                  hidden
                                  onChange={(e) => handlePdfUpload(e, item.id)}
                                />
                              </IconButton>
                            </Tooltip>

                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              {pdfs[item.id] && (
                                <Tooltip title="Visualizar comprovante" placement="top" arrow>
                                  <IconButton
                                    sx={{ color: '#000' }}
                                    disableRipple
                                    onClick={() => handlePdfView(item.id)}
                                  >
                                    <PictureAsPdfIcon />
                                  </IconButton>
                                </Tooltip>
                              )}

                              {pdfs[item.id] && (
                                <Tooltip title="Remover comprovante" arrow>
                                  <IconButton
                                    sx={{ color: '#d32f2f' }}
                                    disableRipple
                                    onClick={() => handlePdfDelete(item.id)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </Box>
                        )
                      }
                    >
                      <ListItemAvatar sx={{ mr: 2 }}>
                        <ButtonServices
                          icon={React.createElement(getIconComponent(item.icone))}
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
                          '& .MuiListItemText-primary': { color: '#000' },
                          '& .MuiListItemText-secondary': { color: '#000' },
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
                              onValueChange={(values) => setNovoValor(values.value)}
                              sx={{ width: 200 }}
                            />
                          ) : (
                            formatarValor(item.valor)
                          )
                        }
                        sx={{
                          '& .MuiListItemText-secondary': (theme) => ({
                            color: isNegative
                              ? theme.palette.error.main
                              : theme.palette.success.main,
                            fontWeight: 600,
                          }),
                          textAlign: 'center',
                        }}
                      />
                    </ListItem>
                  );
                })}
            </React.Fragment>
          ))}
          {datasOrdenadas.length === 0 && (
            <Typography
              variant="body1"
              sx={{
                width: '100%',
                textAlign: 'center',
                mt: 4,
                color: 'text.secondary',
                fontStyle: 'italic',
              }}
            >
              Nenhum resultado encontrado.
            </Typography>
          )}
        </List>
      </Box>
    </>
  );
}
