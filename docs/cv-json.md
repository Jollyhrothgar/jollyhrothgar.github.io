# cv.json: the public CV export

mikebeaumier.com builds its CV page from one file, `src/data/cv.json`. This document says what
that file must contain and how to produce it from the resume repo
(`github.com/Jollyhrothgar/resume`, source file `people/mike/resume.yaml`).

The machine-checkable version of this spec is [`cv.schema.json`](cv.schema.json). The exporter
must validate its output against it before writing anything.

## The one rule: nothing is public unless marked public

`resume.yaml` is private. It holds a phone number, deals in progress, customer names, internal
project codenames and job-search wording. All of that is fine in a private repo and wrong on a
website. So the exporter works from an allowlist:

- An item is exported only if it carries `public: true` (or a `public:` mapping, see below).
- An item without a `public` key is left out. A new project added to `resume.yaml` stays off the
  website until someone marks it.
- Only fields named in this spec are copied. Unknown fields are dropped, never passed through.

### Marking items in resume.yaml

Add a `public` key to any company, role, project, academic entry, degree or skill group:

```yaml
- name: "Ad Query Forecasting to Prioritize Content Review for New URLs"
  year: "2022-2023"
  public: true                     # export as written
  accomplishments: [...]

- name: "Pythia Data Catalogue — Metadata Registry Architecture"
  public:                          # export, with public wording
    name: "Metadata registry architecture"
    summary: "Designed the metadata registry that the team's data platform adopted."
    highlights:
      - "..."
```

A mapping under `public` replaces the matching fields with public-safe wording. Use it whenever
the private text names an internal codename, a customer, or anything under NDA. A parent must be
public for its children to be exported: a public project under a non-public role is dropped.

### Never exported, whatever is marked

The exporter must refuse to write these, even if marked public:

- `contact.phone`, and any street address
- `contact.email`, unless copied deliberately into `public.email` (see `basics`)
- `summary`: it is written for job applications ("Seeking challenging roles..."). The site has
  its own bio. Use `basics.headline` instead.
- Projects whose `status` begins with "In progress", unless their `public` mapping sets
  `allowInProgress: true`
- The `skills.tools_and_platforms.google_internal` group, and anything else that names an
  employer's internal tools
- Leave and other non-work entries (for example the "Parental Leave" project)
- Anything from `out/`, `output/`, `job_descriptions/` or a tailored resume. Export from
  `people/mike/resume.yaml` only.

As a final check, the exporter scans the finished JSON for a denylist of strings it must never
contain: the phone number, and internal codenames such as VulnX, VulnSynth, Pythia, Hephaestus,
Delbot, PLX, Lifeguard, Pangea, AIF. Keep that list in the resume repo next to the exporter. If any
string matches, exit non-zero and write nothing.

## File format

UTF-8 JSON, 2-space indent, trailing newline. Everything is newest first. All text is plain
text: no Markdown, no HTML. The site escapes and formats it.

The output must be deterministic. The same `resume.yaml` produces the same bytes, so there is no
generation timestamp. CI can then commit only when something actually changed.

### Dates

`resume.yaml` writes dates freehand ("May 2018 - 2021", "Sept 2009 - Aug 2016", "October 2025 -
Present"). Export them as:

- `start`, `end`: `"YYYY-MM"` when the month is known, otherwise `"YYYY"`.
- `end: null` means "present".
- If a date can't be parsed, fail with the offending text. Never guess.

### Top level

```json
{
  "schemaVersion": 1,
  "source": { "repo": "Jollyhrothgar/resume", "commit": "162cba5" },
  "basics": { ... },
  "experience": [ ... ],
  "education": [ ... ],
  "publications": [ ... ],
  "skills": [ ... ]
}
```

`source.commit` is the short SHA of the resume repo commit the export was made from.

### basics

| Field      | Required | Notes |
|------------|----------|-------|
| `name`     | yes      | |
| `headline` | yes      | One line, e.g. "Data scientist and ML engineer. PhD in experimental particle physics." |
| `location` | no       | Region-level and set on purpose (`public.location`), e.g. "Southern California". Not copied from `contact.location`. |
| `email`    | no       | Only from `public.email`. |
| `links`    | yes      | `[{ "label": "LinkedIn", "url": "..." }]`. Include GitHub, LinkedIn, INSPIRE-HEP, Google Scholar. |

### experience

One entry per organization. Companies (`experience:` in the YAML) and academic, fellowship and
volunteer entries (`academic_and_volunteer:`) all go here, told apart by `kind`.

```json
{
  "kind": "work",
  "organization": "Mercedes-Benz Research & Development North America",
  "location": "Sunnyvale, CA",
  "roles": [
    {
      "title": "Senior Machine Learning Engineer",
      "start": "2017-06",
      "end": "2018-04",
      "summary": "",
      "highlights": ["Built and improved MBUX consistency testing framework across multiple platforms."],
      "projects": []
    }
  ]
}
```

- `kind`: `"work" | "research" | "fellowship" | "volunteer"`.
- `roles[]`: one per title held. An academic entry, which has a single `role`, becomes a
  one-item `roles` array.
- `summary`: optional one paragraph. Take it from the YAML's `research:` text or a role-level
  summary, joined into a single line.
- `highlights`: the role's own bullets (`accomplishments`).
- `projects[]`, for roles that list projects:

```json
{
  "name": "Ad Query Forecasting to Prioritize Content Review for New URLs",
  "year": "2022-2023",
  "role": "Lead Data Scientist / Machine Learning Engineer",
  "summary": "One paragraph from `context`, single line.",
  "highlights": ["..."],
  "technologies": ["..."]
}
```

Leave out `status`. For past work it adds nothing on a CV page.

**Keep it short.** This is a website, not the full record. Aim for at most 4 highlights per
project and 6 projects per role, and pick the strongest when marking. Over the limit is a warning,
not an error.

**The PhD entry** should carry the hands-on collaboration work as highlights. Today
`resume.yaml` lacks these: data acquisition, detector construction (RPCs), the spin monitor, shift
duty. Add them to `resume.yaml` first. Then export them like any other bullets.

### education

```json
{ "degree": "PhD, Experimental Particle Physics", "institution": "University of California, Riverside", "start": "2009-09", "end": "2016-08", "note": "" }
```

`note` holds an optional thesis title or honors.

### publications

`resume.yaml` has no publications yet. Add a `publications:` list to it in this shape, mark
entries `public: true`, and export them as-is:

```json
{
  "title": "...",
  "venue": "Phys. Rev. D 93, ...",
  "year": 2016,
  "type": "article",
  "url": "https://inspirehep.net/literature/...",
  "collaboration": "PHENIX",
  "authorCount": 400,
  "selected": true,
  "contribution": "One plain sentence on what Mike personally did for this paper."
}
```

- `type`: `"article" | "instrumentation" | "proceedings" | "talk" | "thesis"`.
- `url`: INSPIRE-HEP first, then DOI, then arXiv.
- `collaboration`, `authorCount`: only for collaboration papers. The site uses them to show the
  paper honestly ("PHENIX Collaboration, ~400 authors") with Mike's contribution next to it.
- `selected: true` marks the short list shown on the CV page, at most 6. `contribution` is
  required when `selected` is true. Unselected entries can be left out completely, because the
  INSPIRE and Scholar links in `basics.links` cover the full record.

### skills

Flatten the YAML's nested groups into labeled lists. Merge subgroups into their parent, and
leave out whole groups that aren't public.

```json
[
  { "group": "Machine learning", "items": ["Applied Machine Learning", "Causal Inference", "..."] },
  { "group": "Programming and data", "items": ["Python", "SQL", "Rust", "..."] }
]
```

Write each `group` label in sentence case by hand (via `public.group`). Don't derive it from the
YAML key.

## Delivering the file

1. **For now:** run the exporter locally and copy the output to `src/data/cv.json` in the site
   repo's `redesign` branch.
2. **Later, in CI:** when `people/mike/resume.yaml` changes on `main` in the resume repo, run the
   exporter, validate, run the denylist check, then commit `src/data/cv.json` to the site repo,
   or open a PR there. The token for that lives in the resume repo's secrets. The site repo
   never gets access to the resume repo.

## Changing the format

Additive changes (new optional fields) keep `schemaVersion: 1`. Renaming or removing a field, or
making a field required, bumps the version, and the site and the exporter change together.
