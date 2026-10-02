import type { Article } from '../data';
import { drills, scenarios } from '../playbook/data';
import { PracticeLinks } from '../playbook/Board';
import { wikiCatalog, resolveArticleId } from './catalog';

export function ArticleContents({ article }: { article: Article }) {
  return <details className="article-contents" open><summary>On this page</summary><ol>{article.sections.map((section, index) => <li key={section.heading}><button onClick={() => { const heading = document.getElementById(`article-section-${index}`); heading?.scrollIntoView({ block: 'start' }); heading?.focus({ preventScroll: true }); }}>{section.heading}</button></li>)}</ol></details>;
}

export function ArticleSections({ article }: { article: Article }) {
  return <>
    {article.readerLevel && <p className="lesson-meta">{article.readerLevel} · {article.estimatedReadingMinutes} minute read · Original coaching content</p>}
    {article.practiceSafety && <details className="lesson-safety"><summary>{wikiCatalog.safetyNotice.title}</summary>{wikiCatalog.safetyNotice.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<p><strong>For this lesson:</strong> {article.practiceSafety}</p></details>}
    {!!article.learningGoals?.length && <section className="learning-goals"><h2>What you will learn</h2><ul>{article.learningGoals.map(goal => <li key={goal}>{goal}</li>)}</ul></section>}
    {article.sections.map((section, index) => <section key={section.heading}>
      <h2 id={`article-section-${index}`} tabIndex={-1}>{section.heading}</h2>
      {(section.paragraphs ?? section.body.split(/\n\s*\n/)).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      {!!section.bullets?.length && <ul>{section.bullets.map(point => <li key={point}>{point}</li>)}</ul>}
      {!!section.steps?.length && <ol>{section.steps.map(point => <li key={point}>{point}</li>)}</ol>}
      {section.callout && <div className="article-callout">{section.callout}</div>}
    </section>)}
    {!!article.commonMistakes?.length && <section><h2>Common mistakes & useful adjustments</h2><dl className="mistake-list">{article.commonMistakes.map(item => <div key={item.mistake}><dt>{item.mistake}</dt><dd>{item.correction}</dd></div>)}</dl></section>}
    {!!article.progressions?.length && <section><h2>Build the practice</h2><ol>{article.progressions.map(item => <li key={item}>{item}</li>)}</ol></section>}
    {!!article.checklist?.length && <section className="reading-checklist"><h2>Put it into practice</h2><p>Use these prompts to discuss the session with your coach.</p><ul>{article.checklist.map((item, index) => <li key={item}><label><input type="checkbox" name={`checklist-${index}`} /> <span>{item}</span></label></li>)}</ul></section>}
    {!!article.selfChecks?.length && <section className="article-self-checks"><h2>Check your understanding</h2>{article.selfChecks.map(check => <details key={check.question}><summary>{check.question}</summary><p>{check.answer}</p></details>)}</section>}
    {!!article.linkedConcepts?.length && <section className="lesson-concepts"><h2>Useful concepts</h2>{article.linkedConcepts.map(id => { const concept = wikiCatalog.conceptGlossary.find(item => item.id === id); return concept && <details key={id}><summary>{concept.title}</summary><p>{concept.definition}</p><a href={`#/glossary/${id}`}>Open in the local glossary →</a></details>; })}</section>}
    {(article.editorialStatus || article.updatedAt) && <p className="editorial-status">{article.editorialStatus}{article.updatedAt && <> · Reviewed {article.updatedAt}</>}</p>}
  </>;
}

export function ArticlePractice({ article }: { article: Article }) {
  const drillIds = [...new Set([...(article.drillIds ?? []), ...drills.filter(drill => drill.articleIds.includes(article.id)).map(drill => drill.id)])];
  const scenarioIds = [...new Set([...(article.scenarioIds ?? []), ...scenarios.filter(scenario => scenario.articleIds.includes(article.id)).map(scenario => scenario.id)])];
  if (!drillIds.length && !scenarioIds.length) return null;
  return <section className="article-practice"><h2>From reading to practice</h2><PracticeLinks drillIds={drillIds} scenarioIds={scenarioIds} /></section>;
}

export function articleSearchText(article: Article): string {
  return [article.title, article.category, article.summary, ...article.sections.flatMap(section => [section.heading, section.body, ...(section.paragraphs ?? []), ...(section.bullets ?? []), ...(section.steps ?? []), section.callout ?? '']), ...(article.learningGoals ?? []), ...(article.checklist ?? []), ...(article.selfChecks ?? []).flatMap(check => [check.question, check.answer]), ...(article.commonMistakes ?? []).flatMap(item => [item.mistake, item.correction]), ...(article.progressions ?? []), article.practiceSafety ?? ''].join(' ').toLowerCase();
}

export function LessonSourceNotes({ article }: { article: Article }) {
  if (!article.sourceNotes?.length) return null;
  return <div className="lesson-source-notes"><h3>What the sources support</h3>{article.sourceNotes.map(note => <div key={note.sourceId}><p>{note.supports}</p>{note.notClaimed && <p className="evidence-boundary">{note.notClaimed}</p>}<a href={note.url} target="_blank" rel="noreferrer">Inspect original source ↗</a></div>)}</div>;
}

export function Glossary({ id }: { id?: string }) {
  const concept = wikiCatalog.conceptGlossary.find(item => item.id === id);
  const concepts = id ? concept ? [concept] : [] : wikiCatalog.conceptGlossary;
  return <div className="page"><a href="#/wiki" className="breadcrumb">Wiki / Concepts</a><div className="page-heading"><div className="eyebrow">THE LOCAL GLOSSARY</div><h1>{concept?.title ?? (id ? 'Concept not found' : 'A shared language for the play.')}</h1><p>Teaching definitions used in the original atlas lessons.</p></div><div className="glossary-list">{concepts.map(item => <section key={item.id}><h2>{item.title}</h2><p>{item.definition}</p><PracticeLinks articleIds={wikiCatalog.chapters.filter(chapter => chapter.linkedConcepts.includes(item.id)).map(chapter => resolveArticleId(chapter.id))} /></section>)}</div>{id && <a className="text-link" href="#/glossary">Browse all concepts →</a>}</div>;
}
