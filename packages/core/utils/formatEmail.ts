export function formatEmail(value: string) {
  const sanitized = value.replace(/[^\w@.+-]/g, "").toLowerCase();
  const atIndex = sanitized.indexOf("@");
  if (atIndex === -1) {
    return sanitized;
  }

  const local = sanitized.slice(0, atIndex);
  const domainRaw = sanitized.slice(atIndex + 1).replace(/@+/g, "");

  if (!local && !domainRaw) {
    return "";
  }

  if (!domainRaw) {
    return `${local}@`;
  }

  if (!local) {
    return domainRaw;
  }

  return `${local}@${domainRaw}`;
}
