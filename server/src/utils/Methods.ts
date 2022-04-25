export const compileTriggers = (triggers: string[]): string[] => {
  return triggers.map((t) => t.replace("{PREFIX}", process.env.PREFIX));
};

export const formatRank = (tier: string, rank: string): string => {
  const RANK_HASH: Record<string, string> = {
    IV: "Four",
    III: "Three",
    II: "Two",
    I: "One",
  };

  tier = tier.toLowerCase().replace(/(^|[\s\xA0])[^\s\xA0]/g, (s) => {
    return s.toUpperCase();
  });

  if (["Challenger", "Grandmaster", "Master"].includes(tier)) return tier;
  return `${tier} ${RANK_HASH[rank]}`;
};
