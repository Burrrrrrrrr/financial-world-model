const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const siteBasePath = configuredBasePath.endsWith('/')
  ? configuredBasePath.slice(0, -1)
  : configuredBasePath;

export function sitePath(value: string) {
  if (!value || value.startsWith('#') || /^(?:[a-z]+:)?\/\//i.test(value)) return value;
  const normalized = value.startsWith('/') ? value : `/${value}`;
  return `${siteBasePath}${normalized}`;
}
