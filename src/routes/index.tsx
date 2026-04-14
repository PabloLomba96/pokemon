import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "../components/AppLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DexPoke — Tu Colección TCG" },
      { name: "description", content: "Plataforma profesional para coleccionistas de Pokémon TCG con precios en tiempo real" },
      { property: "og:title", content: "DexPoke — Tu Colección TCG" },
      { property: "og:description", content: "El centro de mandos definitivo para coleccionistas europeos de Trading Card Games" },
    ],
  }),
  component: Index,
});

function Index() {
  return <AppLayout />;
}
