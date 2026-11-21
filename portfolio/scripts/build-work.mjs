// Use the public content export and the same Work renderer as the browser.
// No browser draft or browser API is needed to publish the project notes.
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
const read = file => readFile(path.join(root, file), 'utf8');
const [template, content, helpers, work] = await Promise.all(
  ['index.html', 'content.js', 'shared.js', 'work.js'].map(read)
);
const assignment = content.trim().match(/^window\.PORTFOLIO\s*=\s*([\s\S]+?);?$/);
if (!assignment) throw new Error('Expected a portfolio export in content.js');
const data = JSON.parse(assignment[1]);
const renderer = vm.createContext({ URL, data, window: { PORTFOLIO: data } });
vm.runInContext(helpers, renderer, { filename: 'shared.js' });
vm.runInContext(work, renderer, { filename: 'work.js' });

const origin = 'https://micoszportfolio.vercel.app';
const { esc, projectSlug, projectPath, workProject, workArchive } = renderer;
const pages = [{
  route: '/work/',
  slug: '',
  title: 'Work',
  summary: data.workArchiveIntro,
  body: workArchive(data.projects, false)
}];
const slugs = new Set();
for (const [index, project] of data.projects.entries()) {
  const slug = projectSlug(project, index);
  if (!/^[a-zA-Z0-9_-]+$/.test(slug) || slugs.has(slug)) {
    throw new Error('Project IDs must be distinct URL slugs: ' + slug);
  }
  slugs.add(slug);
  pages.push({
    slug,
    route: projectPath(project, index),
    title: project.name,
    summary: project.description,
    body: workProject(project, index, false)
  });
}

// dist contains only the static site, rebuilt from versioned inputs.
await rm(output, { recursive: true, force: true });
await mkdir(output);
for (const entry of await readdir(root)) {
  if (entry.endsWith('.js') || entry.endsWith('.css') ||
      ['assets', 'work-studies', 'robots.txt', 'index.html'].includes(entry)) {
    await cp(path.join(root, entry), path.join(output, entry), { recursive: true });
  }
}

for (const page of pages) {
  const directory = path.join(output, page.route);
  const name = esc(data.name);
  const html = template
    .replace(/<title>.*?<\/title>/, () => '<title>' + esc(page.title) + ' — ' + name + '</title>')
    .replace(/<meta name="author"[^>]*>/, () => '<meta name="author" content="' + name + '">')
    .replace(/<meta name="description"[^>]*>/, () => '<meta name="description" content="' + esc(page.summary) + '">')
    .replace(/<link rel="canonical"[^>]*>/, () => '<link rel="canonical" href="' + esc(origin + page.route) + '">')
    .replace(/(<b id="brand"[^>]*>).*?(<\/b>)/, (_, open, close) => open + name + close)
    .replace(/(id="foot">).*?(<\/a>)/, (_, open, close) => open + name + ' ↗' + close)
    .replace('<body>', () => '<body data-page="work" data-work-slug="' + esc(page.slug) + '">')
    .replace(/(<main id="main" tabindex="-1">)[\s\S]*?(<\/main>)/, (_, open, close) => open + page.body + close);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), html);
}

const routes = ['/', ...pages.map(page => page.route)];
const entries = routes.map(route => '  <url><loc>' + esc(origin + route) + '</loc></url>');
await writeFile(path.join(output, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + entries.join('\n') + '\n</urlset>\n');
console.log('Published HTML for the Work index and ' + data.projects.length + ' projects.');
