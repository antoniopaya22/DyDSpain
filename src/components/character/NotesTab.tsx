/**
 * NotesTab - Pestaña de notas del personaje
 * Muestra: lista de notas, crear/editar/eliminar, etiquetas, búsqueda,
 * fijar notas y notas rápidas.
 */

import { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  ToastAndroid,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCharacterStore } from "@/stores/characterStore";
import { ConfirmDialog } from "@/components/ui";
import { useDialog } from "@/hooks/useDialog";
import {
  NOTE_TYPE_NAMES,
  PREDEFINED_TAG_NAMES,
  PREDEFINED_TAG_ICONS,
  PREDEFINED_TAG_COLORS,
  getPredefinedTags,
  filterNotes,
  sortNotes,
  getNotPreview,
  getNextSessionNumber,
  type NoteType,
  type PredefinedTag,
  type Note,
  type NoteFilters,
  type NoteSortOptions,
  type NoteTag,
} from "@/types/notes";
import { useTheme } from "@/hooks/useTheme";

// ─── Helpers ─────────────────────────────────────────────────────────

function showToast(message: string) {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
}

const PREDEFINED_TAGS = getPredefinedTags();

function getTagById(id: string, customTags: NoteTag[]): NoteTag | undefined {
  return (
    PREDEFINED_TAGS.find((t) => t.id === id) ??
    customTags.find((t) => t.id === id)
  );
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

// ─── Main Component ──────────────────────────────────────────────────

export default function NotesTab() {
  const { isDark, colors } = useTheme();
  const { dialogProps, showDestructive } = useDialog();
  const {
    character,
    notes,
    customTags,
    addNote,
    updateNote,
    deleteNote,
    togglePinNote,
    addQuickNote,
  } = useCharacterStore();

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<NoteType | null>(null);
  const [sortOptions, setSortOptions] = useState<NoteSortOptions>({
    field: "fechaModificacion",
    order: "desc",
  });

  // Create/Edit modal state
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editorTitle, setEditorTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [editorType, setEditorType] = useState<NoteType>("general");
  const [editorTags, setEditorTags] = useState<string[]>([]);
  const [editorSessionNumber, setEditorSessionNumber] = useState("");
  const [editorSessionDate, setEditorSessionDate] = useState("");

  // Quick note state
  const [showQuickNote, setShowQuickNote] = useState(false);
  const [quickNoteContent, setQuickNoteContent] = useState("");

  // View state
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);

  if (!character) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-dark-500 dark:text-dark-300 text-base">
          No se ha cargado ningún personaje
        </Text>
      </View>
    );
  }

  // ── Filtered & sorted notes ──

  const processedNotes = useMemo(() => {
    const filters: NoteFilters = {
      searchQuery: searchQuery.trim() || undefined,
      tagIds: activeTagFilter ? [activeTagFilter] : undefined,
      tipo: typeFilter ?? undefined,
    };

    const filtered = filterNotes(notes, filters);
    return sortNotes(filtered, sortOptions);
  }, [notes, searchQuery, activeTagFilter, typeFilter, sortOptions]);

  // ── Actions ──

  const handleCreateNote = () => {
    setEditingNote(null);
    setEditorTitle("");
    setEditorContent("");
    setEditorType("general");
    setEditorTags([]);
    setEditorSessionNumber("");
    setEditorSessionDate("");
    setShowEditor(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setEditorTitle(note.titulo);
    setEditorContent(note.contenido);
    setEditorType(note.tipo);
    setEditorTags([...note.etiquetas]);
    setEditorSessionNumber(
      note.numeroSesion !== null ? String(note.numeroSesion) : "",
    );
    setEditorSessionDate(note.fechaSesion ?? "");
    setShowEditor(true);
  };

  const handleSaveNote = async () => {
    if (!editorTitle.trim()) {
      showToast("El título es obligatorio");
      return;
    }

    try {
      if (editingNote) {
        // Update existing note
        await updateNote(editingNote.id, {
          titulo: editorTitle.trim(),
          contenido: editorContent.trim(),
          tipo: editorType,
          etiquetas: editorTags,
          numeroSesion:
            editorType === "diario" && editorSessionNumber
              ? parseInt(editorSessionNumber, 10)
              : null,
          fechaSesion:
            editorType === "diario" && editorSessionDate
              ? editorSessionDate
              : null,
        });
        showToast("Nota actualizada");
      } else {
        // Create new note
        await addNote({
          personajeId: character.id,
          partidaId: character.campaignId,
          titulo: editorTitle.trim(),
          contenido: editorContent.trim(),
          tipo: editorType,
          etiquetas: editorTags,
          numeroSesion:
            editorType === "diario" && editorSessionNumber
              ? parseInt(editorSessionNumber, 10)
              : null,
          fechaSesion:
            editorType === "diario" && editorSessionDate
              ? editorSessionDate
              : null,
        });
        showToast("Nota creada");
      }
      setShowEditor(false);
    } catch (err) {
      showToast("Error al guardar la nota");
    }
  };

  const handleDeleteNote = (note: Note) => {
    showDestructive(
      "Eliminar nota",
      `¿Eliminar "${note.titulo}"?`,
      async () => {
        await deleteNote(note.id);
        if (expandedNoteId === note.id) {
          setExpandedNoteId(null);
        }
        showToast("Nota eliminada");
      },
      { confirmText: "Eliminar", cancelText: "Cancelar" },
    );
  };

  const handleTogglePin = async (noteId: string) => {
    await togglePinNote(noteId);
    const note = notes.find((n) => n.id === noteId);
    showToast(note?.fijada ? "Nota desanclada" : "Nota fijada");
  };

  const handleQuickNote = async () => {
    if (!quickNoteContent.trim()) {
      showToast("Escribe algo para la nota rápida");
      return;
    }

    try {
      await addQuickNote(quickNoteContent.trim());
      setQuickNoteContent("");
      setShowQuickNote(false);
      showToast("Nota rápida creada");
    } catch (err) {
      showToast("Error al crear la nota rápida");
    }
  };

  const handleToggleEditorTag = (tagId: string) => {
    if (editorTags.includes(tagId)) {
      setEditorTags(editorTags.filter((t) => t !== tagId));
    } else {
      setEditorTags([...editorTags, tagId]);
    }
  };

  const handleCreateDiaryEntry = () => {
    setEditingNote(null);
    setEditorTitle("");
    setEditorContent("");
    setEditorType("diario");
    setEditorTags([]);
    const nextSession = getNextSessionNumber(notes);
    setEditorSessionNumber(String(nextSession));
    setEditorSessionDate(new Date().toISOString().split("T")[0]);
    setShowEditor(true);
  };

  // ── Render Sections ──

  const renderSearchBar = () => (
    <View className="flex-row items-center bg-gray-100 dark:bg-surface rounded-xl px-3 py-2 border border-dark-100 dark:border-surface-border mb-3">
      <Ionicons name="search" size={18} color={colors.textMuted} />
      <TextInput
        className="flex-1 text-dark-900 dark:text-white text-sm ml-2.5"
        placeholder="Buscar notas..."
        placeholderTextColor={colors.textMuted}
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCorrect={false}
        returnKeyType="search"
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery("")}>
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFilterRow = () => (
    <View className="mb-3">
      {/* Type filter + Sort */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row">
          <FilterChip
            label="Todas"
            isActive={typeFilter === null}
            onPress={() => setTypeFilter(null)}
          />
          <FilterChip
            label="General"
            isActive={typeFilter === "general"}
            onPress={() =>
              setTypeFilter(typeFilter === "general" ? null : "general")
            }
          />
          <FilterChip
            label="Diario"
            isActive={typeFilter === "diario"}
            onPress={() =>
              setTypeFilter(typeFilter === "diario" ? null : "diario")
            }
          />
        </View>

        <TouchableOpacity
          className="flex-row items-center bg-gray-200 dark:bg-dark-700 rounded-lg px-2.5 py-1.5 border border-dark-100 dark:border-surface-border active:bg-gray-300 dark:active:bg-dark-600"
          onPress={() => setShowSortOptions(!showSortOptions)}
        >
          <Ionicons name="swap-vertical" size={14} color={colors.textMuted} />
          <Text className="text-dark-500 dark:text-dark-300 text-[10px] ml-1">
            Ordenar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sort options dropdown */}
      {showSortOptions && (
        <View className="bg-white dark:bg-surface-card rounded-lg border border-dark-100 dark:border-surface-border p-2 mb-2">
          {(
            [
              {
                field: "fechaModificacion" as const,
                label: "Fecha de modificación",
              },
              { field: "fechaCreacion" as const, label: "Fecha de creación" },
              { field: "titulo" as const, label: "Título" },
              {
                field: "numeroSesion" as const,
                label: "Número de sesión",
              },
            ] as const
          ).map((option) => (
            <TouchableOpacity
              key={option.field}
              className={`flex-row items-center justify-between py-2 px-2 rounded-lg ${
                sortOptions.field === option.field ? "bg-primary-500/10" : ""
              }`}
              onPress={() => {
                if (sortOptions.field === option.field) {
                  setSortOptions({
                    ...sortOptions,
                    order: sortOptions.order === "desc" ? "asc" : "desc",
                  });
                } else {
                  setSortOptions({ field: option.field, order: "desc" });
                }
                setShowSortOptions(false);
              }}
            >
              <Text
                className={`text-xs ${
                  sortOptions.field === option.field
                    ? "text-primary-400 font-semibold"
                    : "text-dark-500 dark:text-dark-300"
                }`}
              >
                {option.label}
              </Text>
              {sortOptions.field === option.field && (
                <Ionicons
                  name={
                    sortOptions.order === "desc" ? "arrow-down" : "arrow-up"
                  }
                  size={12}
                  color={colors.accentRed}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Tag filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        {PREDEFINED_TAGS.map((tag) => {
          const isActive = activeTagFilter === tag.id;
          return (
            <TouchableOpacity
              key={tag.id}
              className={`flex-row items-center rounded-full px-3 py-1.5 mr-2 border ${
                isActive
                  ? "border-opacity-50"
                  : "bg-gray-200 dark:bg-dark-700 border-dark-100 dark:border-surface-border"
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: `${tag.color}20`,
                      borderColor: `${tag.color}50`,
                    }
                  : undefined
              }
              onPress={() => setActiveTagFilter(isActive ? null : tag.id)}
            >
              <Text className="text-xs mr-1">{tag.icon}</Text>
              <Text
                className="text-[10px] font-semibold"
                style={{ color: isActive ? tag.color : colors.textSecondary }}
              >
                {tag.nombre}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderQuickNoteBar = () => (
    <View className="bg-white dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-3 mb-4">
      {!showQuickNote ? (
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => setShowQuickNote(true)}
        >
          <View className="h-9 w-9 rounded-full bg-primary-500/20 items-center justify-center mr-3">
            <Ionicons name="flash" size={18} color={colors.accentRed} />
          </View>
          <Text className="text-dark-500 dark:text-dark-300 text-sm flex-1">
            Nota rápida...
          </Text>
          <Ionicons name="create-outline" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      ) : (
        <View>
          <TextInput
            className="bg-gray-200 dark:bg-dark-700 rounded-xl px-4 py-3 text-dark-900 dark:text-white text-sm border border-dark-100 dark:border-surface-border mb-2 min-h-[70px]"
            placeholder="Escribe tu nota rápida aquí..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={quickNoteContent}
            onChangeText={setQuickNoteContent}
            autoFocus
            maxLength={500}
          />
          <View className="flex-row justify-end">
            <TouchableOpacity
              className="mr-2 px-4 py-2 rounded-lg active:bg-gray-300 dark:active:bg-dark-600"
              onPress={() => {
                setShowQuickNote(false);
                setQuickNoteContent("");
              }}
            >
              <Text className="text-dark-500 dark:text-dark-300 text-xs font-semibold">
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${
                quickNoteContent.trim()
                  ? "bg-primary-500 active:bg-primary-600"
                  : "bg-gray-300 dark:bg-dark-600 opacity-50"
              }`}
              onPress={handleQuickNote}
              disabled={!quickNoteContent.trim()}
            >
              <Text className="text-dark-900 dark:text-white text-xs font-semibold">
                Guardar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const renderNoteCard = (note: Note) => {
    const isExpanded = expandedNoteId === note.id;
    const noteTags = note.etiquetas
      .map((id) => getTagById(id, customTags))
      .filter(Boolean) as NoteTag[];

    return (
      <TouchableOpacity
        key={note.id}
        className="bg-white dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border mb-2 overflow-hidden"
        onPress={() => setExpandedNoteId(isExpanded ? null : note.id)}
        onLongPress={() => handleEditNote(note)}
        activeOpacity={0.7}
      >
        {/* Header */}
        <View className="p-3">
          <View className="flex-row items-start">
            {/* Pin indicator */}
            {note.fijada && (
              <View className="mr-2 mt-0.5">
                <Ionicons name="pin" size={14} color={colors.accentAmber} />
              </View>
            )}

            {/* Type indicator */}
            <View
              className="h-8 w-8 rounded-lg items-center justify-center mr-3"
              style={{
                backgroundColor:
                  note.tipo === "diario"
                    ? `${colors.accentBlue}20`
                    : `${colors.textMuted}20`,
              }}
            >
              <Ionicons
                name={
                  note.tipo === "diario"
                    ? "journal-outline"
                    : "document-text-outline"
                }
                size={16}
                color={
                  note.tipo === "diario" ? colors.accentBlue : colors.textMuted
                }
              />
            </View>

            {/* Note info */}
            <View className="flex-1">
              <Text
                className="text-dark-900 dark:text-white text-sm font-semibold"
                numberOfLines={isExpanded ? undefined : 1}
              >
                {note.titulo}
              </Text>

              {/* Session info for diary notes */}
              {note.tipo === "diario" && note.numeroSesion !== null && (
                <Text className="text-blue-400 text-[10px] font-medium mt-0.5">
                  Sesión #{note.numeroSesion}
                  {note.fechaSesion ? ` · ${note.fechaSesion}` : ""}
                </Text>
              )}

              {/* Preview (only when not expanded) */}
              {!isExpanded && note.contenido.trim().length > 0 && (
                <Text
                  className="text-dark-400 text-xs mt-0.5"
                  numberOfLines={2}
                >
                  {getNotPreview(note.contenido, 100)}
                </Text>
              )}

              {/* Tags */}
              {noteTags.length > 0 && (
                <View className="flex-row flex-wrap mt-1.5">
                  {noteTags.map((tag) => (
                    <View
                      key={tag.id}
                      className="flex-row items-center rounded-full px-2 py-0.5 mr-1.5 mb-1"
                      style={{ backgroundColor: `${tag.color}20` }}
                    >
                      <Text className="text-[10px]">{tag.icon}</Text>
                      <Text
                        className="text-[10px] font-medium ml-0.5"
                        style={{ color: tag.color }}
                      >
                        {tag.nombre}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Date */}
              <Text className="text-dark-300 dark:text-dark-500 text-[10px] mt-1">
                {formatDate(note.fechaModificacion)}
              </Text>
            </View>

            {/* Actions indicator */}
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={16}
              color={colors.textMuted}
              style={{ marginTop: 2 }}
            />
          </View>
        </View>

        {/* Expanded content */}
        {isExpanded && (
          <View className="px-3 pb-3 border-t border-dark-100 dark:border-surface-border/50">
            {/* Full content */}
            {note.contenido.trim().length > 0 ? (
              <Text className="text-dark-600 dark:text-dark-200 text-sm leading-6 mt-3 mb-3">
                {note.contenido}
              </Text>
            ) : (
              <Text className="text-dark-300 dark:text-dark-500 text-sm italic mt-3 mb-3">
                Sin contenido
              </Text>
            )}

            {/* Master visibility badge */}
            {note.visibleParaMaster && (
              <View className="flex-row items-center mb-3">
                <Ionicons
                  name="eye-outline"
                  size={12}
                  color={colors.accentAmber}
                />
                <Text className="text-gold-700 dark:text-gold-400 text-[10px] ml-1">
                  Visible para el Master
                </Text>
              </View>
            )}

            {/* Sent by master badge */}
            {note.enviadaPorMaster && (
              <View className="flex-row items-center mb-3">
                <Ionicons
                  name="person-circle-outline"
                  size={12}
                  color={colors.accentPurple}
                />
                <Text className="text-purple-400 text-[10px] ml-1">
                  Enviada por el Master
                </Text>
              </View>
            )}

            {/* Metadata */}
            <View className="bg-gray-200 dark:bg-dark-700 rounded-lg p-2.5 mb-3">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-dark-300 dark:text-dark-500 text-[10px]">
                  Creada
                </Text>
                <Text className="text-dark-400 text-[10px]">
                  {formatDate(note.fechaCreacion)}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-dark-300 dark:text-dark-500 text-[10px]">
                  Modificada
                </Text>
                <Text className="text-dark-400 text-[10px]">
                  {formatDate(note.fechaModificacion)}
                </Text>
              </View>
            </View>

            {/* Action buttons */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row">
                <TouchableOpacity
                  className={`flex-row items-center rounded-lg px-3 py-2 mr-2 border ${
                    note.fijada
                      ? "bg-amber-500/15 border-amber-500/30"
                      : "bg-gray-200 dark:bg-dark-700 border-dark-100 dark:border-surface-border"
                  } active:opacity-70`}
                  onPress={() => handleTogglePin(note.id)}
                >
                  <Ionicons
                    name={note.fijada ? "pin" : "pin-outline"}
                    size={14}
                    color={note.fijada ? colors.accentAmber : colors.textMuted}
                  />
                  <Text
                    className="text-xs font-semibold ml-1"
                    style={{
                      color: note.fijada
                        ? colors.accentAmber
                        : colors.textSecondary,
                    }}
                  >
                    {note.fijada ? "Desanclar" : "Fijar"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center bg-gray-200 dark:bg-dark-700 border border-dark-100 dark:border-surface-border rounded-lg px-3 py-2 mr-2 active:bg-gray-300 dark:active:bg-dark-600"
                  onPress={() => handleEditNote(note)}
                >
                  <Ionicons
                    name="create-outline"
                    size={14}
                    color={colors.accentBlue}
                  />
                  <Text className="text-blue-400 text-xs font-semibold ml-1">
                    Editar
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                className="flex-row items-center bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 active:bg-red-500/25"
                onPress={() => handleDeleteNote(note)}
              >
                <Ionicons
                  name="trash-outline"
                  size={14}
                  color={colors.accentDanger}
                />
                <Text className="text-red-400 text-xs font-semibold ml-1">
                  Eliminar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderNotesList = () => {
    if (processedNotes.length === 0) {
      const hasFilters =
        searchQuery.trim().length > 0 ||
        activeTagFilter !== null ||
        typeFilter !== null;

      return (
        <View className="bg-white dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-6 items-center mb-4">
          <View className="h-16 w-16 rounded-full bg-gray-200 dark:bg-dark-700 items-center justify-center mb-4">
            <Ionicons
              name={hasFilters ? "search-outline" : "document-text-outline"}
              size={32}
              color={colors.textMuted}
            />
          </View>
          <Text className="text-dark-900 dark:text-white text-base font-semibold text-center mb-1">
            {hasFilters ? "Sin resultados" : "Sin notas"}
          </Text>
          <Text className="text-dark-500 dark:text-dark-300 text-sm text-center leading-5 mb-4">
            {hasFilters
              ? "No se encontraron notas con los filtros actuales."
              : "Crea tu primera nota para empezar a registrar tu aventura."}
          </Text>
          {hasFilters ? (
            <TouchableOpacity
              className="bg-gray-200 dark:bg-dark-700 rounded-lg px-4 py-2.5 active:bg-gray-300 dark:active:bg-dark-600"
              onPress={() => {
                setSearchQuery("");
                setActiveTagFilter(null);
                setTypeFilter(null);
              }}
            >
              <Text className="text-dark-600 dark:text-dark-200 text-sm font-semibold">
                Limpiar filtros
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-primary-500 rounded-lg px-6 py-2.5 active:bg-primary-600"
              onPress={handleCreateNote}
            >
              <Text className="text-dark-900 dark:text-white text-sm font-semibold">
                Crear nota
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold uppercase tracking-wider">
            {processedNotes.length} nota(s)
          </Text>
        </View>
        {processedNotes.map(renderNoteCard)}
      </View>
    );
  };

  const renderActionButtons = () => (
    <View className="flex-row mb-4">
      <TouchableOpacity
        className="flex-1 bg-primary-500/15 border border-primary-500/30 rounded-card p-3 mr-2 flex-row items-center justify-center active:bg-primary-500/25"
        onPress={handleCreateNote}
      >
        <Ionicons
          name="add-circle-outline"
          size={18}
          color={colors.accentRed}
        />
        <Text className="text-primary-400 text-sm font-semibold ml-2">
          Nueva Nota
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 bg-blue-500/15 border border-blue-500/30 rounded-card p-3 ml-2 flex-row items-center justify-center active:bg-blue-500/25"
        onPress={handleCreateDiaryEntry}
      >
        <Ionicons name="journal-outline" size={18} color={colors.accentBlue} />
        <Text className="text-blue-400 text-sm font-semibold ml-2">
          Diario de Sesión
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderEditorModal = () => (
    <Modal
      visible={showEditor}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setShowEditor(false)}
    >
      <KeyboardAvoidingView
        className="flex-1 bg-gray-50 dark:bg-dark-800"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Editor Header */}
        <View className="flex-row items-center justify-between px-5 pt-14 pb-3 border-b border-dark-100 dark:border-surface-border">
          <TouchableOpacity
            className="h-10 w-10 rounded-full bg-gray-100 dark:bg-surface items-center justify-center active:bg-gray-50 dark:active:bg-surface-light"
            onPress={() => {
              if (editorTitle.trim() || editorContent.trim()) {
                showDestructive(
                  "Descartar cambios",
                  "¿Estás seguro de que quieres salir? Se perderán los cambios.",
                  () => setShowEditor(false),
                  { confirmText: "Descartar", cancelText: "Seguir editando" },
                );
              } else {
                setShowEditor(false);
              }
            }}
          >
            <Ionicons name="close" size={22} color="white" />
          </TouchableOpacity>

          <Text className="text-dark-900 dark:text-white text-base font-semibold">
            {editingNote ? "Editar Nota" : "Nueva Nota"}
          </Text>

          <TouchableOpacity
            className={`rounded-lg px-4 py-2 ${
              editorTitle.trim()
                ? "bg-primary-500 active:bg-primary-600"
                : "bg-gray-300 dark:bg-dark-600 opacity-50"
            }`}
            onPress={handleSaveNote}
            disabled={!editorTitle.trim()}
          >
            <Text className="text-dark-900 dark:text-white text-sm font-semibold">
              Guardar
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Note type toggle */}
          <View className="flex-row mt-4 mb-4 bg-gray-200 dark:bg-dark-700 rounded-xl p-1">
            <TouchableOpacity
              className={`flex-1 rounded-lg py-2.5 items-center flex-row justify-center ${
                editorType === "general"
                  ? "bg-gray-50 dark:bg-surface-light"
                  : "bg-transparent"
              }`}
              onPress={() => setEditorType("general")}
            >
              <Ionicons
                name="document-text-outline"
                size={16}
                color={
                  editorType === "general"
                    ? colors.textPrimary
                    : colors.textMuted
                }
              />
              <Text
                className={`text-sm font-medium ml-1.5 ${
                  editorType === "general"
                    ? "text-dark-900 dark:text-white"
                    : "text-dark-400"
                }`}
              >
                General
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 rounded-lg py-2.5 items-center flex-row justify-center ${
                editorType === "diario"
                  ? "bg-gray-50 dark:bg-surface-light"
                  : "bg-transparent"
              }`}
              onPress={() => setEditorType("diario")}
            >
              <Ionicons
                name="journal-outline"
                size={16}
                color={
                  editorType === "diario" ? colors.accentBlue : colors.textMuted
                }
              />
              <Text
                className={`text-sm font-medium ml-1.5 ${
                  editorType === "diario" ? "text-blue-400" : "text-dark-400"
                }`}
              >
                Diario
              </Text>
            </TouchableOpacity>
          </View>

          {/* Session fields (diary only) */}
          {editorType === "diario" && (
            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-dark-500 dark:text-dark-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Nº Sesión
                </Text>
                <TextInput
                  className="bg-gray-100 dark:bg-surface rounded-xl px-4 py-3 text-dark-900 dark:text-white text-sm border border-dark-100 dark:border-surface-border"
                  placeholder={String(getNextSessionNumber(notes))}
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={editorSessionNumber}
                  onChangeText={setEditorSessionNumber}
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-dark-500 dark:text-dark-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Fecha de sesión
                </Text>
                <TextInput
                  className="bg-gray-100 dark:bg-surface rounded-xl px-4 py-3 text-dark-900 dark:text-white text-sm border border-dark-100 dark:border-surface-border"
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textMuted}
                  value={editorSessionDate}
                  onChangeText={setEditorSessionDate}
                />
              </View>
            </View>
          )}

          {/* Title */}
          <Text className="text-dark-500 dark:text-dark-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
            Título <Text className="text-primary-500">*</Text>
          </Text>
          <TextInput
            className="bg-gray-100 dark:bg-surface rounded-xl px-4 py-3 text-dark-900 dark:text-white text-base border border-dark-100 dark:border-surface-border mb-4"
            placeholder="Título de la nota"
            placeholderTextColor={colors.textMuted}
            value={editorTitle}
            onChangeText={setEditorTitle}
            maxLength={200}
            autoFocus={!editingNote}
          />

          {/* Content */}
          <Text className="text-dark-500 dark:text-dark-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
            Contenido
          </Text>
          <TextInput
            className="bg-gray-100 dark:bg-surface rounded-xl px-4 py-3 text-dark-900 dark:text-white text-sm border border-dark-100 dark:border-surface-border mb-4 min-h-[200px]"
            placeholder="Escribe el contenido de tu nota aquí..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            value={editorContent}
            onChangeText={setEditorContent}
            maxLength={5000}
          />

          {/* Tags */}
          <Text className="text-dark-500 dark:text-dark-300 text-xs font-semibold uppercase tracking-wider mb-2">
            Etiquetas
          </Text>
          <View className="flex-row flex-wrap mb-4">
            {PREDEFINED_TAGS.map((tag) => {
              const isSelected = editorTags.includes(tag.id);
              return (
                <TouchableOpacity
                  key={tag.id}
                  className={`flex-row items-center rounded-full px-3 py-2 mr-2 mb-2 border ${
                    isSelected
                      ? "border-opacity-50"
                      : "border-dark-100 dark:border-surface-border"
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: `${tag.color}20`,
                          borderColor: `${tag.color}50`,
                        }
                      : { backgroundColor: colors.bgSecondary }
                  }
                  onPress={() => handleToggleEditorTag(tag.id)}
                >
                  <Text className="text-xs mr-1">{tag.icon}</Text>
                  <Text
                    className="text-xs font-medium"
                    style={{
                      color: isSelected ? tag.color : colors.textSecondary,
                    }}
                  >
                    {tag.nombre}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={12}
                      color={tag.color}
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Character count */}
          <View className="flex-row justify-end mb-4">
            <Text className="text-dark-300 dark:text-dark-500 text-[10px]">
              {editorContent.length}/5000 caracteres
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );

  // Stats section showing total notes count
  const renderStatsBar = () => (
    <View className="bg-white dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
      <View className="flex-row justify-between">
        <StatBadge
          icon="document-text"
          label="Total"
          value={String(notes.length)}
          color={colors.textMuted}
        />
        <StatBadge
          icon="journal"
          label="Diario"
          value={String(notes.filter((n) => n.tipo === "diario").length)}
          color={colors.accentBlue}
        />
        <StatBadge
          icon="pin"
          label="Fijadas"
          value={String(notes.filter((n) => n.fijada).length)}
          color={colors.accentAmber}
        />
        <StatBadge
          icon="today"
          label="Sesiones"
          value={String(
            new Set(
              notes
                .filter((n) => n.tipo === "diario" && n.numeroSesion !== null)
                .map((n) => n.numeroSesion),
            ).size,
          )}
          color={colors.accentGreen}
        />
      </View>
    </View>
  );

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderStatsBar()}
        {renderQuickNoteBar()}
        {renderActionButtons()}
        {renderSearchBar()}
        {renderFilterRow()}
        {renderNotesList()}
      </ScrollView>

      {renderEditorModal()}

      {/* Custom dialog (replaces Alert.alert) */}
      <ConfirmDialog {...dialogProps} />
    </View>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function FilterChip({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className={`rounded-full px-3 py-1.5 mr-2 border ${
        isActive
          ? "bg-primary-500/20 border-primary-500/50"
          : "bg-gray-200 dark:bg-dark-700 border-dark-100 dark:border-surface-border"
      }`}
      onPress={onPress}
    >
      <Text
        className={`text-[10px] font-semibold ${
          isActive ? "text-primary-400" : "text-dark-500 dark:text-dark-300"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function StatBadge({
  icon,
  label,
  value,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View className="items-center flex-1">
      <Ionicons name={icon} size={18} color={color} />
      <Text className="text-dark-900 dark:text-white text-lg font-bold mt-0.5">
        {value}
      </Text>
      <Text className="text-dark-400 text-[10px] uppercase tracking-wider">
        {label}
      </Text>
    </View>
  );
}
