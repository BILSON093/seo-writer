// In-memory usage tracking with credit system
const creditsMap = new Map<string, number>();
const usageMap = new Map<string, number>();
const FREE_DAILY_LIMIT = 3;

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export async function getCredits(userId: string): Promise<number> {
  return creditsMap.get(userId) ?? 0;
}

export async function addCredits(userId: string, amount: number) {
  const current = creditsMap.get(userId) ?? 0;
  creditsMap.set(userId, current + amount);
}

export async function deductCredit(userId: string): Promise<boolean> {
  const current = creditsMap.get(userId) ?? 0;
  if (current > 0) {
    creditsMap.set(userId, current - 1);
    return true;
  }
  return false;
}

export async function checkUsage(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  credits: number;
  freeRemaining: number;
}> {
  const credits = await getCredits(userId);

  // If user has credits, they can generate
  if (credits > 0) {
    return { allowed: true, remaining: credits, credits, freeRemaining: 0 };
  }

  // Otherwise check free daily limit
  const key = `${userId}:${getToday()}`;
  const used = usageMap.get(key) ?? 0;
  const freeRemaining = Math.max(0, FREE_DAILY_LIMIT - used);

  return {
    allowed: freeRemaining > 0,
    remaining: freeRemaining,
    credits: 0,
    freeRemaining,
  };
}

export async function logUsage(userId: string) {
  const credits = await getCredits(userId);
  if (credits > 0) {
    await deductCredit(userId);
  } else {
    const key = `${userId}:${getToday()}`;
    usageMap.set(key, (usageMap.get(key) ?? 0) + 1);
  }
}
