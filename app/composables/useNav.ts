// Shared off-canvas sidebar state (tablet/mobile drawer).
export const useNav = () => useState<boolean>('navOpen', () => false)
