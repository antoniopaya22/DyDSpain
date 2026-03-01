/**
 * Registro estático de avatares de personaje.
 * GENERADO AUTOMÁTICAMENTE — no editar manualmente.
 * Ejecutar: node scripts/generate-avatar-registry.js
 */

import type { ImageSourcePropType } from "react-native";
import type { ClassId, RaceId, Sexo } from "@/types/character";

// Clave: `${classId}_${raceId}_${sexo}`
type AvatarKey = `${ClassId}_${RaceId}_${Sexo}`;

export const AVATAR_REGISTRY: Partial<Record<AvatarKey, ImageSourcePropType>> = {
  "barbaro_hada_femenino": require("../../assets/images/personajes/barbaro/Hada_Female.png"),
  "barbaro_hada_masculino": require("../../assets/images/personajes/barbaro/Hada_Male.png"),
  "barbaro_liebren_femenino": require("../../assets/images/personajes/barbaro/Liebren_Female.png"),
  "barbaro_liebren_masculino": require("../../assets/images/personajes/barbaro/Liebren_Male.png"),
  "bardo_hada_femenino": require("../../assets/images/personajes/bardo/Hada_Female.png"),
  "bardo_hada_masculino": require("../../assets/images/personajes/bardo/Hada_Male.png"),
  "brujo_hada_femenino": require("../../assets/images/personajes/brujo/Hada_Female.png"),
  "brujo_hada_masculino": require("../../assets/images/personajes/brujo/Hada_Male.png"),
  "clerigo_hada_femenino": require("../../assets/images/personajes/clerigo/Hada_Female.png"),
  "clerigo_hada_masculino": require("../../assets/images/personajes/clerigo/Hada_Male.png"),
  "druida_hada_femenino": require("../../assets/images/personajes/druida/Hada_Female.png"),
  "druida_hada_masculino": require("../../assets/images/personajes/druida/Hada_Male.png"),
  "explorador_hada_femenino": require("../../assets/images/personajes/explorador/Hada_Female.png"),
  "explorador_hada_masculino": require("../../assets/images/personajes/explorador/Hada_Male.png"),
  "guerrero_hada_femenino": require("../../assets/images/personajes/guerrero/Hada_Female.png"),
  "guerrero_hada_masculino": require("../../assets/images/personajes/guerrero/Hada_Male.png"),
  "hechicero_hada_femenino": require("../../assets/images/personajes/hechicero/Hada_Female.png"),
  "hechicero_hada_masculino": require("../../assets/images/personajes/hechicero/Hada_Male.png"),
  "mago_hada_femenino": require("../../assets/images/personajes/mago/Hada_Female.png"),
  "mago_hada_masculino": require("../../assets/images/personajes/mago/Hada_Male.png"),
  "monje_hada_femenino": require("../../assets/images/personajes/monje/Hada_Female.png"),
  "monje_hada_masculino": require("../../assets/images/personajes/monje/Hada_Male.png"),
  "paladin_hada_femenino": require("../../assets/images/personajes/paladin/Hada_Female.png"),
  "paladin_hada_masculino": require("../../assets/images/personajes/paladin/Hada_Male.png"),
  "picaro_hada_femenino": require("../../assets/images/personajes/picaro/Hada_Female.png"),
  "picaro_hada_masculino": require("../../assets/images/personajes/picaro/Hada_Male.png"),
};
