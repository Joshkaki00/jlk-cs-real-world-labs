export const LAYOUT = {
  displayWidth: 760,
  displayHeight: 620,
  headerHeight: 64,
  footerHeight: 40,
  margin: 16,
  guideWidth: 220,
  gap: 12,
} as const;

export const WORKSPACE_WIDTH = LAYOUT.displayWidth
  - LAYOUT.margin * 2 - LAYOUT.guideWidth - LAYOUT.gap;
export const WORKSPACE_HEIGHT = LAYOUT.displayHeight
  - LAYOUT.headerHeight - LAYOUT.footerHeight - LAYOUT.margin * 2;
