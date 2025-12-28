import { fetch } from 'undici';

const VERCEL_API = 'https://api.vercel.com';
const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID!;

interface VercelDomain {
  name: string;
  verified: boolean;
  verification: Array<{
    type: 'TXT' | 'CNAME';
    domain: string;
    value: string;
    reason: string;
  }>;
}

export async function addDomainToVercel(domain: string): Promise<VercelDomain> {
  const response = await fetch(
    `${VERCEL_API}/v10/projects/${VERCEL_PROJECT_ID}/domains`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Vercel API error: ${error.message}`);
  }

  return response.json();
}

export async function removeDomainFromVercel(domain: string): Promise<void> {
  const response = await fetch(
    `${VERCEL_API}/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to remove domain from Vercel');
  }
}

export async function getDomainConfig(domain: string) {
  const response = await fetch(
    `${VERCEL_API}/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}/config`,
    {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    }
  );

  return response.json();
}

export async function verifyDomain(domain: string): Promise<boolean> {
  // Check DNS records
  const dnsCheck = await checkDNSRecords(domain);
  return dnsCheck.verified;
}

async function checkDNSRecords(domain: string) {
  // Use DNS lookup to verify A/CNAME records point to Vercel
  // Implementation using dns.promises.resolve()
}
