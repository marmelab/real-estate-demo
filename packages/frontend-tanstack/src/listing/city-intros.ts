import type { TargetCity } from "@remix-v3-demo/domain/listing/target-cities";

export const CITY_INTROS: Record<TargetCity["slug"], string> = {
  paris:
    "Appartements haussmanniens, hôtels particuliers et penthouses avec vue sur la tour Eiffel : découvrez notre sélection de biens d'exception dans les plus beaux arrondissements de Paris.",
  lyon: "Des Brotteaux à la Presqu'île, en passant par le Vieux Lyon et la Croix-Rousse : nos appartements et maisons de prestige au cœur de la capitale des Gaules.",
  nice: "Carré d'Or, Mont Boron, Cimiez : villas avec vue mer et appartements bourgeois sélectionnés sur la Côte d'Azur, entre la Promenade des Anglais et le port.",
  cannes:
    "Sur la Croisette, en Californie ou à Palm Beach : villas et appartements de prestige à Cannes, à quelques pas des plages et du Palais des Festivals.",
};
