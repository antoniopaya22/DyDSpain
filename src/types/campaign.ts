/**
 * Tipos para la gestión de partidas/campañas (HU-01)
 */

export interface Campaign {
  /** Identificador único (UUID) */
  id: string;
  /** Nombre de la partida */
  nombre: string;
  /** Descripción o notas de la campaña */
  descripcion?: string;
  /** URI de la imagen o icono */
  imagen?: string;
  /** Referencia al personaje asociado */
  personajeId?: string;
  /** Fecha de creación */
  creadoEn: string;
  /** Fecha de última modificación/acceso */
  actualizadoEn: string;
}

export interface CreateCampaignInput {
  nombre: string;
  descripcion?: string;
  imagen?: string;
}

export interface UpdateCampaignInput {
  nombre?: string;
  descripcion?: string;
  imagen?: string;
}
