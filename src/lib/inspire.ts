// Publication count from INSPIRE-HEP, fetched once per build. The deploy workflow rebuilds the
// site weekly so the count stays current.

let pending: Promise<number | null> | undefined;

// authorUrl is an INSPIRE author profile, e.g. https://inspirehep.net/authors/1291623.
// Returns null if the count can't be fetched, so a failed request never fails the build.
export function publicationCount(authorUrl: string): Promise<number | null> {
  pending ??= fetchCount(authorUrl);
  return pending;
}

async function fetchCount(authorUrl: string): Promise<number | null> {
  const recid = authorUrl.match(/\/authors\/(\d+)/)?.[1];
  if (!recid) return null;

  const url = new URL('https://inspirehep.net/api/literature');
  url.searchParams.set('q', `authors.recid:${recid}`);
  url.searchParams.set('size', '1');
  url.searchParams.set('fields', 'control_number');

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const total = (await response.json())?.hits?.total;
    return typeof total === 'number' ? total : null;
  } catch (error) {
    console.warn(`INSPIRE publication count unavailable: ${error}`);
    return null;
  }
}
