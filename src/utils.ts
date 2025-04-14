export function parseDuration(duration: string): number {
  const regex = /^(\d+)([smhd])$/;
  const match = duration.match(regex);

  if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7d

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return value;
  }
}
