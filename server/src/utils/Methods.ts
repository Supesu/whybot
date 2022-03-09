export const compileTriggers  = (triggers: string[]): string[] => {
    return triggers.map((t) => t.replace("{PREFIX}", process.env.PREFIX));
}