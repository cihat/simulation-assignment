const POISSION_RATE = 3 * 60 * 1000; // 12 minutes
const POISON_DURATION = 10 * 60 * 1000; // 10 minutes
const TIME = 3 * 60 * 60 * 1000; // 3 hours
const computerCount = TIME / POISON_DURATION;

export { POISON_DURATION, POISSION_RATE, TIME, computerCount };
