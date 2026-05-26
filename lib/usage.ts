// In-memory usage tracking (resets on server restart, good enough for launch)
const usageMap = new Map<string, number>();
const FREE_DAILY_LIMIT = 3;

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export async function checkUsage(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  isPro: boolean;
}> {
  const key = `${userId}:${getToday()}`;
  const used = usageMap.get(key) ?? 0;
  const remaining = Math.max(0, FREE_DAILY_LIMIT - used);

  return {
    allowed: remaining > 0,
    remaining,
    isPro: false, // Stripe integration coming soon
  };
}

export async function logUsage(userId: string) {
  const key = `${userId}:${getToday()}`;
  usageMap.set(key, (usageMap.get(key) ?? 0) + 1);
}
