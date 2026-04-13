import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "../components/AppLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PokéVault — Tu Colección TCG" },
      { name: "description", content: "Dashboard premium para coleccionistas de Pokémon TCG con precios en tiempo real" },
      { property: "og:title", content: "PokéVault — Tu Colección TCG" },
      { property: "og:description", content: "El centro de mandos definitivo para coleccionistas europeos de Trading Card Games" },
    ],
  }),
  component: Index,
});

function Index() {
  return <AppLayout />;
}
