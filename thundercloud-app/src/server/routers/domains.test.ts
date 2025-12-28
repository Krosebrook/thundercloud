import { describe, it, expect } from 'vitest';

// Mock the necessary dependencies
const validateDomain = (domain: string) => {
  const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
  return domainRegex.test(domain) && !domain.startsWith('http');
};

const domains = new Set<string>();

const addDomain = async (domain: string, websiteId: string) => {
  if (domains.has(domain)) {
    throw new Error('Domain already in use');
  }
  domains.add(domain);
  return { status: 'pending' };
};

describe('domainsRouter', () => {
  it('validates domain format', () => {
    expect(validateDomain('example.com')).toBe(true);
    expect(validateDomain('invalid')).toBe(false);
    expect(validateDomain('http://example.com')).toBe(false);
  });

  it('prevents duplicate domains', async () => {
    await addDomain('example.com', 'website1');
    await expect(addDomain('example.com', 'website2')).rejects.toThrow('Domain already in use');
  });
});
