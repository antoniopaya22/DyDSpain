import { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  useCreationStore,
  TOTAL_STEPS,
} from "@/stores/creationStore";
import {
  getClassData,
  isSpellcaster,
  hasSpellsAtLevel1,
} from "@/data/srd";
import type { ClassId } from "@/types/character";

const CURRENT_STEP = 7;

// Simplified cantrip/spell data for the SRD classes at level 1
// In a full implementation this would come from a spells database
const CLASS_CANTRIPS: Record<string, { id: string; nombre: string; descripcion: string }[]> = {
  bardo: [
    { id: "amigos", nombre: "Amigos", descripcion: "Un objetivo te ve como un amigo durante 1 minuto." },
    { id: "burla_viciosa", nombre: "Burla Viciosa", descripcion: "Insultas a una criatura, causando 1d4 daño psíquico." },
    { id: "luz", nombre: "Luz", descripcion: "Un objeto emite luz brillante en 6m." },
    { id: "mano_de_mago", nombre: "Mano de Mago", descripcion: "Creas una mano espectral flotante." },
    { id: "mensaje", nombre: "Mensaje", descripcion: "Susurras un mensaje a una criatura a 36m." },
    { id: "prestidigitacion", nombre: "Prestidigitación", descripcion: "Creas un efecto mágico menor." },
    { id: "reparar", nombre: "Reparar", descripcion: "Reparas una rotura o desgarro en un objeto." },
    { id: "conocer_conjuro", nombre: "Conocer Conjuro", descripcion: "Detectas la presencia de magia a 9m." },
  ],
  brujo: [
    { id: "descarga_ocultista", nombre: "Descarga Ocultista", descripcion: "Un rayo de energía crepitante causa 1d10 daño de fuerza." },
    { id: "toque_helado", nombre: "Toque Helado", descripcion: "Una mano esquelética causa 1d8 daño necrótico." },
    { id: "prestidigitacion", nombre: "Prestidigitación", descripcion: "Creas un efecto mágico menor." },
    { id: "taumaturgia", nombre: "Taumaturgia", descripcion: "Manifiestas un signo menor de poder sobrenatural." },
    { id: "amigos", nombre: "Amigos", descripcion: "Un objetivo te ve como un amigo durante 1 minuto." },
    { id: "hoja_verde_llama", nombre: "Hoja de Llama Verde", descripcion: "El fuego salta de un objetivo a otro." },
  ],
  clerigo: [
    { id: "guia", nombre: "Guía", descripcion: "Otorgas 1d4 extra a una tirada de habilidad." },
    { id: "luz", nombre: "Luz", descripcion: "Un objeto emite luz brillante en 6m." },
    { id: "llama_sagrada", nombre: "Llama Sagrada", descripcion: "Llamas descienden sobre un objetivo causando 1d8 daño radiante." },
    { id: "reparar", nombre: "Reparar", descripcion: "Reparas una rotura o desgarro en un objeto." },
    { id: "resistencia", nombre: "Resistencia", descripcion: "Otorgas 1d4 extra a una tirada de salvación." },
    { id: "taumaturgia", nombre: "Taumaturgia", descripcion: "Manifiestas un signo menor de poder sobrenatural." },
    { id: "palabra_de_resplandor", nombre: "Palabra de Resplandor", descripcion: "Pronuncias una palabra divina que causa daño radiante." },
  ],
  druida: [
    { id: "druida_artesania", nombre: "Druidismo", descripcion: "Creas un efecto natural menor." },
    { id: "guia", nombre: "Guía", descripcion: "Otorgas 1d4 extra a una tirada de habilidad." },
    { id: "llamarada", nombre: "Llamarada", descripcion: "Lanzas una mota de fuego que causa 1d8 daño de fuego." },
    { id: "resistencia", nombre: "Resistencia", descripcion: "Otorgas 1d4 extra a una tirada de salvación." },
    { id: "shillelagh", nombre: "Shillelagh", descripcion: "Imbuyes un garrote o bastón con poder natural." },
    { id: "latigo_espinas", nombre: "Látigo de Espinas", descripcion: "Creas un largo tallo espinoso que azota a un enemigo." },
  ],
  hechicero: [
    { id: "descarga_ocultista", nombre: "Rayo de Escarcha", descripcion: "Un rayo de luz blanco-azulada causa 1d8 daño de frío." },
    { id: "llama_sagrada", nombre: "Rayo de Fuego", descripcion: "Lanzas una mota de fuego que causa 1d10 daño de fuego." },
    { id: "luz", nombre: "Luz", descripcion: "Un objeto emite luz brillante en 6m." },
    { id: "mano_de_mago", nombre: "Mano de Mago", descripcion: "Creas una mano espectral flotante." },
    { id: "mensaje", nombre: "Mensaje", descripcion: "Susurras un mensaje a una criatura a 36m." },
    { id: "prestidigitacion", nombre: "Prestidigitación", descripcion: "Creas un efecto mágico menor." },
    { id: "toque_helado", nombre: "Toque Helado", descripcion: "Una mano esquelética causa 1d8 daño necrótico." },
    { id: "descarga_electrica", nombre: "Descarga Eléctrica", descripcion: "Lanzas un arco de electricidad que causa 1d8 de daño." },
  ],
  mago: [
    { id: "rayo_escarcha", nombre: "Rayo de Escarcha", descripcion: "Un rayo de luz blanco-azulada causa 1d8 daño de frío." },
    { id: "rayo_fuego", nombre: "Rayo de Fuego", descripcion: "Lanzas una mota de fuego que causa 1d10 daño de fuego." },
    { id: "luz", nombre: "Luz", descripcion: "Un objeto emite luz brillante en 6m." },
    { id: "mano_de_mago", nombre: "Mano de Mago", descripcion: "Creas una mano espectral flotante." },
    { id: "mensaje", nombre: "Mensaje", descripcion: "Susurras un mensaje a una criatura a 36m." },
    { id: "prestidigitacion", nombre: "Prestidigitación", descripcion: "Creas un efecto mágico menor." },
    { id: "toque_helado", nombre: "Toque Helado", descripcion: "Una mano esquelética causa 1d8 daño necrótico." },
    { id: "ilusion_menor", nombre: "Ilusión Menor", descripcion: "Creas un sonido o imagen ilusoria." },
    { id: "descarga_electrica", nombre: "Descarga Eléctrica", descripcion: "Lanzas un arco de electricidad que causa 1d8." },
    { id: "chorro_acido", nombre: "Chorro de Ácido", descripcion: "Lanzas una burbuja de ácido que causa 1d6 daño." },
  ],
};

const CLASS_SPELLS_LV1: Record<string, { id: string; nombre: string; descripcion: string }[]> = {
  bardo: [
    { id: "curar_heridas", nombre: "Curar Heridas", descripcion: "Curas 1d8 + mod. de conjuración PG a una criatura." },
    { id: "detectar_magia", nombre: "Detectar Magia", descripcion: "Detectas la presencia de magia a 9m." },
    { id: "palabra_curativa", nombre: "Palabra Curativa", descripcion: "Curas 1d4 + mod. PG a distancia con una acción adicional." },
    { id: "dormir", nombre: "Dormir", descripcion: "5d8 PG de criaturas caen dormidas." },
    { id: "encanto_persona", nombre: "Encanto de Persona", descripcion: "Un humanoide te ve como un amigo." },
    { id: "identificar", nombre: "Identificar", descripcion: "Aprendes las propiedades de un objeto mágico." },
    { id: "onda_atronadora", nombre: "Onda Atronadora", descripcion: "Cada criatura en un cubo de 4.5m sufre 2d8 daño de trueno." },
    { id: "hablar_con_animales", nombre: "Hablar con Animales", descripcion: "Puedes comunicarte con bestias durante 10 minutos." },
  ],
  brujo: [
    { id: "encanto_persona", nombre: "Encanto de Persona", descripcion: "Un humanoide te ve como un amigo." },
    { id: "armadura_de_agathys", nombre: "Armadura de Agathys", descripcion: "Ganas 5 PG temporales y dañas a quien te golpee." },
    { id: "maleficio", nombre: "Maleficio", descripcion: "Maldices a un objetivo para 1d6 daño necrótico extra." },
    { id: "texto_ilusorio", nombre: "Texto Ilusorio", descripcion: "Escribes un mensaje que solo ciertos lectores pueden ver." },
    { id: "proteccion_bien_mal", nombre: "Protección contra el Bien y el Mal", descripcion: "Proteges a una criatura de celestiales, demonios, etc." },
  ],
  clerigo: [
    { id: "curar_heridas", nombre: "Curar Heridas", descripcion: "Curas 1d8 + mod. de conjuración PG." },
    { id: "detectar_magia", nombre: "Detectar Magia", descripcion: "Detectas la presencia de magia a 9m." },
    { id: "bendicion", nombre: "Bendición", descripcion: "Hasta 3 criaturas suman 1d4 a ataques y salvaciones." },
    { id: "escudo_de_fe", nombre: "Escudo de Fe", descripcion: "+2 a CA de una criatura durante 10 minutos." },
    { id: "palabra_curativa", nombre: "Palabra Curativa", descripcion: "Curas 1d4 + mod. PG a distancia." },
    { id: "imponer_manos", nombre: "Santuario", descripcion: "Un objetivo es protegido: atacantes deben pasar salvación de SAB." },
    { id: "infligir_heridas", nombre: "Infligir Heridas", descripcion: "Ataque cuerpo a cuerpo: 3d10 daño necrótico." },
    { id: "mando", nombre: "Mando", descripcion: "Das una orden de una palabra a una criatura." },
  ],
  druida: [
    { id: "curar_heridas", nombre: "Curar Heridas", descripcion: "Curas 1d8 + mod. de conjuración PG." },
    { id: "detectar_magia", nombre: "Detectar Magia", descripcion: "Detectas la presencia de magia a 9m." },
    { id: "hablar_con_animales", nombre: "Hablar con Animales", descripcion: "Te comunicas con bestias durante 10 min." },
    { id: "enredar", nombre: "Enredar", descripcion: "Plantas que atrapan a criaturas en un área de 6m." },
    { id: "nube_niebla", nombre: "Nube de Niebla", descripcion: "Creas una esfera de niebla de 6m de radio." },
    { id: "onda_atronadora", nombre: "Onda Atronadora", descripcion: "Cada criatura en un cubo de 4.5m sufre 2d8 de trueno." },
    { id: "buenas_bayas", nombre: "Buenas Bayas", descripcion: "Creas 10 bayas que curan 1 PG cada una." },
  ],
  hechicero: [
    { id: "detectar_magia", nombre: "Detectar Magia", descripcion: "Detectas la presencia de magia a 9m." },
    { id: "escudo", nombre: "Escudo", descripcion: "Reacción: +5 a CA hasta tu siguiente turno." },
    { id: "proyectil_magico", nombre: "Proyectil Mágico", descripcion: "3 dardos de fuerza causan 1d4+1 cada uno. No fallan." },
    { id: "dormir", nombre: "Dormir", descripcion: "5d8 PG de criaturas caen dormidas." },
    { id: "manos_ardientes", nombre: "Manos Ardientes", descripcion: "Un cono de 4.5m causa 3d6 daño de fuego." },
    { id: "encanto_persona", nombre: "Encanto de Persona", descripcion: "Un humanoide te ve como un amigo." },
  ],
  mago: [
    { id: "detectar_magia", nombre: "Detectar Magia", descripcion: "Detectas la presencia de magia a 9m." },
    { id: "escudo", nombre: "Escudo", descripcion: "Reacción: +5 a CA hasta tu siguiente turno." },
    { id: "proyectil_magico", nombre: "Proyectil Mágico", descripcion: "3 dardos de fuerza causan 1d4+1 cada uno." },
    { id: "dormir", nombre: "Dormir", descripcion: "5d8 PG de criaturas caen dormidas." },
    { id: "manos_ardientes", nombre: "Manos Ardientes", descripcion: "Un cono de 4.5m causa 3d6 daño de fuego." },
    { id: "encanto_persona", nombre: "Encanto de Persona", descripcion: "Un humanoide te ve como un amigo." },
    { id: "armadura_de_mago", nombre: "Armadura de Mago", descripcion: "Tu CA base es 13 + mod. DES durante 8 horas." },
    { id: "identificar", nombre: "Identificar", descripcion: "Aprendes las propiedades de un objeto mágico." },
    { id: "nube_niebla", nombre: "Nube de Niebla", descripcion: "Creas una esfera de niebla de 6m." },
    { id: "caida_de_pluma", nombre: "Caída de Pluma", descripcion: "Hasta 5 criaturas caen suavemente." },
  ],
};

export default function SpellsStep() {
  const router = useRouter();
  const { id: campaignId } = useLocalSearchParams<{ id: string }>();

  const {
    draft,
    setSpellChoices,
    saveDraft,
    loadDraft,
  } = useCreationStore();

  const [selectedCantrips, setSelectedCantrips] = useState<string[]>([]);
  const [selectedSpells, setSelectedSpells] = useState<string[]>([]);
  const [autoSkipped, setAutoSkipped] = useState(false);
  const hasAutoSkipped = useRef(false);

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        if (!campaignId) return;
        await loadDraft(campaignId);
        const currentDraft = useCreationStore.getState().draft;
        if (currentDraft?.spellChoices) {
          setSelectedCantrips(currentDraft.spellChoices.cantrips ?? []);
          setSelectedSpells(currentDraft.spellChoices.spells ?? []);
        }

        // Auto-skip for non-spellcasters (only once per mount to avoid loop)
        if (!hasAutoSkipped.current && currentDraft?.clase) {
          const classData = getClassData(currentDraft.clase);
          const shouldSkip =
            classData.casterType === "none" ||
            (classData.cantripsAtLevel1 === 0 && classData.spellsAtLevel1 === 0);

          if (shouldSkip) {
            hasAutoSkipped.current = true;
            setAutoSkipped(true);
            setSpellChoices({ cantrips: [], spells: [] });
            await saveDraft();
            router.replace({
              pathname: "/campaigns/[id]/character/create/equipment",
              params: { id: campaignId },
            });
          }
        }
      };
      init();
    }, [campaignId])
  );

  const classId = draft?.clase;
  const classData = classId ? getClassData(classId) : null;
  const maxCantrips = classData?.cantripsAtLevel1 ?? 0;
  const maxSpells = classData?.spellsAtLevel1 ?? 0;

  const availableCantrips = classId ? (CLASS_CANTRIPS[classId] ?? []) : [];
  const availableSpells = classId ? (CLASS_SPELLS_LV1[classId] ?? []) : [];

  const isValid =
    selectedCantrips.length === maxCantrips &&
    (maxSpells === 0 || selectedSpells.length === maxSpells);

  const handleToggleCantrip = (id: string) => {
    setSelectedCantrips((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= maxCantrips) return prev;
      return [...prev, id];
    });
  };

  const handleToggleSpell = (id: string) => {
    setSelectedSpells((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= maxSpells) return prev;
      return [...prev, id];
    });
  };

  const handleNext = async () => {
    if (!isValid) return;
    setSpellChoices({
      cantrips: selectedCantrips,
      spells: selectedSpells,
      spellbook: classId === "mago" ? selectedSpells : undefined,
    });
    await saveDraft();
    router.push({
      pathname: "/campaigns/[id]/character/create/equipment",
      params: { id: campaignId },
    });
  };

  const handleBack = () => {
    if (selectedCantrips.length > 0 || selectedSpells.length > 0) {
      setSpellChoices({
        cantrips: selectedCantrips,
        spells: selectedSpells,
      });
    }
    router.back();
  };

  const progressPercent = (CURRENT_STEP / TOTAL_STEPS) * 100;

  // If auto-skipping, show nothing (brief flash)
  if (autoSkipped) {
    return (
      <View style={styles.container}>
        <View style={styles.skipContainer}>
          <Ionicons name="flash-outline" size={48} color="#666699" />
          <Text style={styles.skipText}>
            Tu clase no lanza conjuros a nivel 1.
          </Text>
          <Text style={styles.skipSubtext}>Continuando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={22} color="white" />
            </TouchableOpacity>
            <Text style={styles.stepText}>
              Paso {CURRENT_STEP} de {TOTAL_STEPS}
            </Text>
            <View style={{ height: 40, width: 40 }} />
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="flame-outline" size={40} color="#c62828" />
          </View>
          <Text style={styles.title}>Hechizos Iniciales</Text>
          <Text style={styles.subtitle}>
            {classData
              ? `Como ${classData.nombre}, puedes elegir ${maxCantrips} truco${maxCantrips !== 1 ? "s" : ""}${maxSpells > 0 ? ` y ${maxSpells} conjuro${maxSpells !== 1 ? "s" : ""} de nivel 1` : ""}.`
              : "Elige tus trucos y conjuros iniciales."}
          </Text>
          {classData?.spellcastingAbility && (
            <View style={styles.aptitudBadge}>
              <Ionicons name="sparkles" size={14} color="#fbbf24" />
              <Text style={styles.aptitudText}>
                Aptitud mágica:{" "}
                {classData.spellcastingAbility === "car"
                  ? "Carisma"
                  : classData.spellcastingAbility === "int"
                  ? "Inteligencia"
                  : classData.spellcastingAbility === "sab"
                  ? "Sabiduría"
                  : classData.spellcastingAbility.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Cantrips Section */}
        {maxCantrips > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trucos (Cantrips)</Text>
              <View style={styles.counterBadge}>
                <Text
                  style={[
                    styles.counterText,
                    selectedCantrips.length === maxCantrips && styles.counterTextValid,
                  ]}
                >
                  {selectedCantrips.length} / {maxCantrips}
                </Text>
              </View>
            </View>

            {availableCantrips.map((cantrip) => {
              const isSelected = selectedCantrips.includes(cantrip.id);
              const isDisabled = !isSelected && selectedCantrips.length >= maxCantrips;

              return (
                <TouchableOpacity
                  key={cantrip.id}
                  style={[
                    styles.spellCard,
                    isSelected && styles.spellCardSelected,
                    isDisabled && styles.spellCardDisabled,
                  ]}
                  onPress={() => handleToggleCantrip(cantrip.id)}
                  disabled={isDisabled && !isSelected}
                >
                  <View style={styles.spellCardRow}>
                    <View
                      style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected,
                      ]}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={16} color="white" />
                      )}
                    </View>
                    <View style={styles.spellInfo}>
                      <Text
                        style={[
                          styles.spellName,
                          isSelected && styles.spellNameSelected,
                        ]}
                      >
                        {cantrip.nombre}
                      </Text>
                      <Text style={styles.spellDesc} numberOfLines={2}>
                        {cantrip.descripcion}
                      </Text>
                    </View>
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelBadgeText}>Truco</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Level 1 Spells Section */}
        {maxSpells > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Conjuros de Nivel 1</Text>
              <View style={styles.counterBadge}>
                <Text
                  style={[
                    styles.counterText,
                    selectedSpells.length === maxSpells && styles.counterTextValid,
                  ]}
                >
                  {selectedSpells.length} / {maxSpells}
                </Text>
              </View>
            </View>

            {availableSpells.map((spell) => {
              const isSelected = selectedSpells.includes(spell.id);
              const isDisabled = !isSelected && selectedSpells.length >= maxSpells;

              return (
                <TouchableOpacity
                  key={spell.id}
                  style={[
                    styles.spellCard,
                    isSelected && styles.spellCardSelected,
                    isDisabled && styles.spellCardDisabled,
                  ]}
                  onPress={() => handleToggleSpell(spell.id)}
                  disabled={isDisabled && !isSelected}
                >
                  <View style={styles.spellCardRow}>
                    <View
                      style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected,
                      ]}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={16} color="white" />
                      )}
                    </View>
                    <View style={styles.spellInfo}>
                      <Text
                        style={[
                          styles.spellName,
                          isSelected && styles.spellNameSelected,
                        ]}
                      >
                        {spell.nombre}
                      </Text>
                      <Text style={styles.spellDesc} numberOfLines={2}>
                        {spell.descripcion}
                      </Text>
                    </View>
                    <View style={[styles.levelBadge, styles.levelBadgeLv1]}>
                      <Text style={styles.levelBadgeText}>Nv.1</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            {classId === "mago" && (
              <View style={styles.infoBox}>
                <Ionicons name="book" size={18} color="#fbbf24" />
                <Text style={styles.infoBoxText}>
                  Como mago, los conjuros seleccionados se añadirán a tu libro
                  de hechizos. Podrás preparar un número limitado cada día.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !isValid && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!isValid}
        >
          <Text style={styles.nextButtonText}>Siguiente: Equipamiento</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  scroll: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#1e1e38",
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    color: "#8c8cb3",
    fontSize: 14,
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#1e1e38",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#c62828",
    borderRadius: 3,
  },
  titleSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  iconCircle: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "rgba(198,40,40,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#8c8cb3",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  aptitudBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(251,191,36,0.15)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 12,
  },
  aptitudText: {
    color: "#fbbf24",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#d9d9e6",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  counterBadge: {
    backgroundColor: "#23233d",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#3a3a5c",
  },
  counterText: {
    color: "#fbbf24",
    fontSize: 13,
    fontWeight: "bold",
  },
  counterTextValid: {
    color: "#22c55e",
  },
  spellCard: {
    backgroundColor: "#23233d",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#3a3a5c",
  },
  spellCardSelected: {
    borderColor: "#c62828",
    backgroundColor: "#2a1a2e",
  },
  spellCardDisabled: {
    opacity: 0.4,
  },
  spellCardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    height: 28,
    width: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#666699",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxSelected: {
    borderColor: "#c62828",
    backgroundColor: "#c62828",
  },
  spellInfo: {
    flex: 1,
    marginRight: 8,
  },
  spellName: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 2,
  },
  spellNameSelected: {
    color: "#ffffff",
  },
  spellDesc: {
    color: "#8c8cb3",
    fontSize: 12,
    lineHeight: 17,
  },
  levelBadge: {
    backgroundColor: "#2d2d52",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  levelBadgeLv1: {
    backgroundColor: "rgba(59,130,246,0.2)",
  },
  levelBadgeText: {
    color: "#b3b3cc",
    fontSize: 11,
    fontWeight: "700",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(251,191,36,0.1)",
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(251,191,36,0.2)",
  },
  infoBoxText: {
    color: "#d9d9e6",
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 10,
    flex: 1,
  },
  skipContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  skipText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 8,
  },
  skipSubtext: {
    color: "#8c8cb3",
    fontSize: 15,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#3a3a5c",
  },
  nextButton: {
    backgroundColor: "#c62828",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonDisabled: {
    backgroundColor: "#2d2d44",
    opacity: 0.5,
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
});
