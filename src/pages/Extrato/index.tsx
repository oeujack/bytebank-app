import React, { useEffect, useState } from "react";
import LanguageIcon from "@mui/icons-material/Language";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Title from "@components/Title";
import { Box } from "@mui/material";
import ExtratoList from "@components/ExtratoList";
import Filtro from "@components/Filtro";

const iconeMap: Record<string, React.ReactElement> = {
  LanguageIcon: <LanguageIcon sx={{ fontSize: 32 }} />,
  AttachMoneyIcon: <AttachMoneyIcon sx={{ fontSize: 32 }} />,
  StorefrontIcon: <StorefrontIcon sx={{ fontSize: 32 }} />,
};

export default function PageExtrato() {
  const [dados, setDados] = useState<any[]>([]);
  const [filtro, setFiltro] = useState("");
  const [filtroData, setFiltroData] = useState<Date | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/extrato")
      .then((res) => res.json())
      .then((data) => {
        const dadosComIcone = data.map((item: any) => ({
          ...item,
          icone: iconeMap[item.icone] || null,
        }));
        setDados(dadosComIcone);
      });
  }, []);

  return (
    <>
      <Title title="Extrato da conta-corrente" />
      <Filtro filtro={filtro} setFiltro={setFiltro} setFiltroData={setFiltroData} />
      <Box
        sx={{
          height: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#ffffff",
        }}
      >
        <ExtratoList filtro={filtro} filtroData={filtroData}/>
      </Box>
    </>
  );
}
