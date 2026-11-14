import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cvPdf from './integrations/cv-pdf.mjs';

export default defineConfig({
  site: 'https://mikebeaumier.com',
  integrations: [
    mdx(),
    // /cv/ats/ is only there to be printed to a PDF
    sitemap({ filter: (page) => !page.endsWith('/cv/ats/') }),
    cvPdf(),
  ],
});
