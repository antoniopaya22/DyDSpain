/**
 * Shared styles for Compendium card components
 */

import { StyleSheet } from "react-native";

export const cardStyles = StyleSheet.create({
  // ── Card Container ──
  card: {
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  cardIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },

  // ── Card Detail (expanded) ──
  cardDetail: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
  detailRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
    marginBottom: 4,
  },
  detailSection: {
    marginTop: 14,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    lineHeight: 20,
  },

  // ── Traits ──
  traitItem: {
    marginBottom: 8,
    paddingLeft: 4,
  },
  traitName: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  traitDesc: {
    fontSize: 13,
    lineHeight: 18,
  },

  // ── Subrace ──
  subraceBlock: {
    marginBottom: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  subraceName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subraceDetail: {
    fontSize: 12,
    marginBottom: 4,
  },

  // ── Tags & Badges ──
  skillTagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  skillTagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  moreText: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 4,
  },

  // ── Background extras ──
  equipItem: {
    fontSize: 13,
    lineHeight: 20,
    marginLeft: 4,
  },
  personalityItem: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 4,
  },
});
