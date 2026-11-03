/** Pure verification rules. Prices are integer cents, never floating-point euros. */
export const MIN_READ_GAP_MS = 20_000;
const identityFields = ['id', 'train', 'from', 'to', 'date', 'departure', 'arrival', 'direct'];
export const fingerprint = journey => JSON.stringify(identityFields.map(key => journey[key]));

export function minutes(time) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new TypeError('Invalid departure time');
  const [hours, mins] = time.split(':').map(Number);
  return hours * 60 + mins;
}

export function evaluate(journey, first, second, settings) {
  if (!Number.isSafeInteger(settings.thresholdCents) || settings.thresholdCents <= 0) {
    throw new TypeError('Threshold must be positive integer cents');
  }
  const outside = journey.direct !== true || journey.from !== settings.from || journey.to !== settings.to
    || journey.date !== settings.date || minutes(journey.departure) <= minutes(settings.after);
  if (outside) return { status: 'excluded', reason: 'Outside the selected journey rules.' };
  const valid = read => read && read.identity === fingerprint(journey)
    && Number.isSafeInteger(read.priceCents) && read.priceCents > 0
    && read.currency === 'EUR' && Number.isFinite(read.at);
  if (!valid(first) || !valid(second)) {
    return { status: 'unavailable', reason: 'A valid, matching source observation is missing.' };
  }
  if (second.at - first.at < MIN_READ_GAP_MS) {
    return { status: 'unavailable', reason: 'Independent reads must be at least 20 seconds apart.' };
  }
  if (second.at - first.at > 300_000) {
    return { status: 'unavailable', reason: 'The observation pair is too far apart to confirm.' };
  }
  if (first.priceCents !== second.priceCents) {
    return { status: 'mismatch', reason: 'The two independent prices disagree.' };
  }
  if (second.priceCents >= settings.thresholdCents) {
    return { status: 'above', reason: 'Verified price is at or above the strict threshold.', priceCents: second.priceCents };
  }
  return { status: 'ready', reason: 'Same journey. Same price. Below your limit.', priceCents: second.priceCents };
}

/** A transport is injected. This repository supplies only a local fake transport. */
export class Monitor {
  constructor(transport) {
    if (typeof transport !== 'function') throw new TypeError('A transport function is required');
    this.transport = transport;
    this.ledger = new Map();
  }

  async check(journey, first, second, settings) {
    const result = evaluate(journey, first, second, settings);
    if (result.status !== 'ready') return result;
    const key = fingerprint(journey);
    const existing = this.ledger.get(key);
    if (existing?.status === 'delivered') return { ...result, status: 'duplicate', reason: 'Already delivered for this journey. No repeat.' };
    if (existing?.status === 'pending') return { ...result, status: 'uncertain', reason: 'Delivery needs review. Automatic retry blocked.' };
    // Reserve synchronously, before awaiting transport, to prevent concurrent sends.
    this.ledger.set(key, { status: 'pending' });
    try {
      const receipt = await this.transport({ journey: { ...journey }, priceCents: result.priceCents });
      if (!receipt || typeof receipt.id !== 'string' || receipt.id.length === 0) throw new Error('Missing receipt');
      this.ledger.set(key, { status: 'delivered', id: receipt.id });
      return { ...result, status: 'delivered', reason: 'Simulated alert delivered.', receipt: receipt.id };
    } catch {
      return { ...result, status: 'uncertain', reason: 'Delivery needs review. Automatic retry blocked.' };
    }
  }

  reset() { this.ledger.clear(); }
}
