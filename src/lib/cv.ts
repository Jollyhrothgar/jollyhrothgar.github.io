// Types for src/data/cv.json. The format is specified in docs/cv-json.md.
import data from '../data/cv.json';

export interface Link {
  label: string;
  url: string;
}

export interface Project {
  name: string;
  year?: string;
  role?: string;
  summary?: string;
  highlights: string[];
  technologies?: string[];
}

export interface Role {
  title: string;
  start: string;
  end: string | null;
  summary?: string;
  highlights: string[];
  projects: Project[];
}

export interface Experience {
  kind: 'work' | 'research' | 'fellowship' | 'volunteer';
  organization: string;
  location?: string;
  roles: Role[];
}

export interface Education {
  degree: string;
  institution: string;
  start: string;
  end: string | null;
  note?: string;
}

export interface Publication {
  title: string;
  venue?: string;
  year: number;
  type: 'article' | 'instrumentation' | 'proceedings' | 'talk' | 'thesis';
  url?: string;
  collaboration?: string;
  authorCount?: number;
  selected: boolean;
  contribution?: string;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface CV {
  basics: {
    name: string;
    headline: string;
    location?: string;
    email?: string;
    links: Link[];
  };
  experience: Experience[];
  education: Education[];
  publications: Publication[];
  skills: SkillGroup[];
}

export const cv = data as CV;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "2025-10" -> "Oct 2025", "2012" -> "2012"
function formatDate(date: string): string {
  const [year, month] = date.split('-');
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
}

export function formatRange(start: string, end: string | null): string {
  return `${formatDate(start)} – ${end ? formatDate(end) : 'Present'}`;
}

// Year-only range, for compact lists: "2009 – 2016"
export function formatYears(start: string, end: string | null): string {
  const from = start.slice(0, 4);
  const to = end ? end.slice(0, 4) : 'Present';
  return from === to ? from : `${from} – ${to}`;
}
