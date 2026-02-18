/**
 * NotesTab - Orchestrator for character notes
 *
 * Shows: stats bar, quick note, action buttons, search/filter bar, notes list.
 * Heavy UI delegated to NoteEditorModal, NoteCard, NoteFilterBar, QuickNoteBar.
 */

import { useState, useMemo, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCharacterStore } from "@/stores/characterStore";
import { ConfirmDialog, Toast } from "@/components/ui";
import { useTheme, useDialog, useToast } from "@/hooks";
import {
  filterNotes,
  sortNotes,
  type NoteType,
  type Note,
  type NoteFilters,
  type NoteSortOptions,
} from "@/types/notes";
import {
  NoteCard,
  NoteFilterBar,
  NoteEditorModal,
  QuickNoteBar,
} from "@/components/notes";

// ─── Main Component ──────────────────────────────────────────────────

export default function NotesTab() {
  const { colors } = useTheme();
  const { dialogProps, showDestructive } = useDialog();
  const { toastProps, showInfo: showToast } = useToast();
  const {
    character,
    notes,
    customTags,
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
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Editor modal state
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editorInitialType, setEditorInitialType] =
    useState<NoteType>("general");

  // View state
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

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
    setEditorInitialType("general");
    setShowEditor(true);
  };

  const handleCreateDiaryEntry = () => {
    setEditingNote(null);
    setEditorInitialType("diario");
    setShowEditor(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setEditorInitialType(note.tipo);
    setShowEditor(true);
  };

  const handleDeleteNote = (note: Note) => {
    showDestructive(
      "Eliminar nota",
      `¿Eliminar "${note.titulo}"?`,
      async () => {
        await deleteNote(note.id);
        if (expandedNoteId === note.id) setExpandedNoteId(null);
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

  const handleQuickNote = async (content: string) => {
    await addQuickNote(content);
  };

  // ── Render helpers ──

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

  const renderNotesList = () => {
    if (processedNotes.length === 0) {
      const hasFilters =
        searchQuery.trim().length > 0 ||
        activeTagFilter !== null ||
        typeFilter !== null;

      return (
        <View className="bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-6 items-center mb-4">
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
              <Text className="text-white text-sm font-semibold">
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
        {processedNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            customTags={customTags}
            isExpanded={expandedNoteId === note.id}
            onToggleExpand={() =>
              setExpandedNoteId(
                expandedNoteId === note.id ? null : note.id,
              )
            }
            onEdit={() => handleEditNote(note)}
            onDelete={() => handleDeleteNote(note)}
            onTogglePin={() => handleTogglePin(note.id)}
          />
        ))}
      </View>
    );
  };

  const renderStatsBar = () => (
    <View className="bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
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

        <QuickNoteBar onSubmit={handleQuickNote} onShowToast={showToast} />

        {renderActionButtons()}

        <NoteFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          sortOptions={sortOptions}
          onSortChange={setSortOptions}
          activeTagFilter={activeTagFilter}
          onTagFilterChange={setActiveTagFilter}
          showSortOptions={showSortOptions}
          onToggleSortOptions={() => setShowSortOptions(!showSortOptions)}
        />

        {renderNotesList()}
      </ScrollView>

      <NoteEditorModal
        visible={showEditor}
        editingNote={editingNote}
        initialType={editorInitialType}
        onClose={() => setShowEditor(false)}
        onShowToast={showToast}
        onShowDestructive={showDestructive}
      />

      <ConfirmDialog {...dialogProps} />
      <Toast {...toastProps} />
    </View>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

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
