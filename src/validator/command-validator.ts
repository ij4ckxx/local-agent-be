export function validateWingetCommand(command: string): boolean {
  const safePattern =
    /^winget\s+(install|uninstall)\s+.+/i;

  return safePattern.test(command);
}