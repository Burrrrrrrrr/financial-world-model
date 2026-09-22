/* eslint-disable @next/next/no-html-link-for-pages -- Vinext's Link runtime currently breaks production navigation; native anchors preserve the course route. */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { lessonRegistry } from '../../lessons/registry';
import { sitePath } from '../../sitePath';

type LessonPageProps = {
  params: Promise<{ slug: string }>;
};

const readingPaths = [
  { id: 'core' as const, label: '最短核心路径', intro: (count: number) => `第一次延伸先走这 ${count} 项：用最少阅读建立本节核心机制、证据边界与可实现性；按卡片顺序阅读。` },
  { id: 'models' as const, label: '模型深化', intro: (count: number) => `这 ${count} 项深化本节的模型、估计与约束；先修不足时先读每张卡的建议路线，不必强行通读证明。` },
  { id: 'evidence' as const, label: '实证与数据', intro: (count: number) => `这 ${count} 项从可观察变量、识别设计和数据能力出发，专门训练“能看到什么”与“能声称什么”的边界。` },
  { id: 'systems' as const, label: '系统、案例与验证', intro: (count: number) => `这 ${count} 项把微观机制放回财富选择、融资约束、事件链和模型验证中；重点检查反馈怎样闭合、怎样断开。` },
  { id: 'rules' as const, label: '法域规则', intro: (count: number) => `这 ${count} 项按本节实际涉及的主体、产品和法域分支排列；不要把不同规则串成一条全球标准。` },
];

const publicationPrintLessonIds = new Set(['4.02', '4.03', '4.04', '4.05', '4.06', '4.07']);
const interactivePrintSectionIds = new Set([
  'international-monetary-interactive-section',
  'safe-asset-interactive-section',
  'treasury-curve-interactive-section',
  'dollar-funding-interactive-section',
]);

function printSourceLocator(url: string) {
  const doi = url.match(/(?:https?:\/\/(?:dx\.)?doi\.org\/|\/doi\/)(10\.\d{4,9}\/[^\s?#]+)/i)?.[1];
  return doi ? `DOI: ${doi}` : url;
}

export function generateStaticParams() {
  return Object.keys(lessonRegistry).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = lessonRegistry[slug];

  if (!lesson) return {};

  const title = `${lesson.id} ${lesson.title} · 金融世界模型`;
  const description = `${lesson.subtitle}。${lesson.readingTime}，含互动示例、学术参考文献与延伸阅读。`;

  return {
    title,
    description,
    openGraph: { title, description, images: [] },
    twitter: { card: 'summary', title, description, images: [] },
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const lesson = lessonRegistry[slug];

  if (!lesson) notFound();

  const Content = lesson.Content;
  const currentReviews = lesson.reviews.filter(
    (review) => review.revision === lesson.revision && review.decision === 'approved',
  );
  const approvedKinds = new Set(currentReviews.map((review) => review.kind));
  const isReviewed = lesson.reviewStatus === 'double-reviewed'
    && approvedKinds.has('accuracy')
    && approvedKinds.has('pedagogy');
  const hasCurrentReviewRecord = lesson.reviews.some((review) => review.revision === lesson.revision);
  const hasPublicationPrintNavigation = publicationPrintLessonIds.has(lesson.id);
  const printIndexSections = hasPublicationPrintNavigation
    ? [
        ...lesson.sections.filter((section) => !interactivePrintSectionIds.has(section.id)),
        { id: 'references', label: '参考文献' },
        { id: 'reading-list', label: '延伸阅读' },
      ]
    : [];
  const reviewFor = (kind: 'accuracy' | 'pedagogy') => currentReviews.find((review) => review.kind === kind);
  const renderReadingCard = (item: (typeof lesson.readingList)[number], index: number) => {
    const isExternal = /^https?:\/\//i.test(item.url);
    const destination = isExternal ? '在新标签打开' : item.url.startsWith('#') ? '页内定位' : '站内打开';

    const cardBody = (
      <>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <h3>{item.title}</h3>
        <b>{item.scope}</b>
        <p>{item.reason}</p>
        {item.guide ? <small><b>建议路线：</b>{item.guide}</small> : null}
      </>
    );

    if (item.links?.length) {
      return (
        <article className="reading-card" key={item.title}>
          {cardBody}
          <div className="reading-card-links" aria-label={`${item.title}的主阅读与配对来源`} role="group">
            <a
              data-print-locator={hasPublicationPrintNavigation && isExternal ? printSourceLocator(item.url) : undefined}
              href={item.url}
              rel={isExternal ? 'noreferrer' : undefined}
              target={isExternal ? '_blank' : undefined}
            >主阅读{isExternal ? ' ↗' : ''}</a>
            {item.links.map((link) => {
              const linkIsExternal = /^https?:\/\//i.test(link.url);
              return <a
                data-print-locator={hasPublicationPrintNavigation && linkIsExternal ? printSourceLocator(link.url) : undefined}
                href={link.url}
                key={link.label}
                rel={linkIsExternal ? 'noreferrer' : undefined}
                target={linkIsExternal ? '_blank' : undefined}
              >{link.label}{linkIsExternal ? ' ↗' : ''}</a>;
            })}
          </div>
        </article>
      );
    }

    return (
      <a
        aria-label={`${item.title}（${destination}）`}
        data-print-locator={hasPublicationPrintNavigation && isExternal ? printSourceLocator(item.url) : undefined}
        href={item.url}
        key={item.title}
        rel={isExternal ? 'noreferrer' : undefined}
        target={isExternal ? '_blank' : undefined}
      >
        {cardBody}
      </a>
    );
  };
  const populatedReadingPaths = readingPaths.filter((path) => lesson.readingList.some((item) => item.group === path.id));

  return (
    <main className="lesson-page" data-lesson-id={lesson.id}>
      <a className="skip-link" href="#lesson-content">跳到课程正文</a>
      <header className="lesson-topbar">
        <a className="lesson-back" href={sitePath('/')}>
          <span aria-hidden="true">←</span>
          <span>返回总目录</span>
        </a>
        <p>{lesson.chapterTitle}</p>
        <span className={isReviewed ? 'review-pill reviewed' : 'review-pill'}>
          {isReviewed ? '双重独立审稿完成' : hasCurrentReviewRecord ? '双重独立审稿修订中' : '作者草稿 · 尚未双审'}
        </span>
      </header>

      <section className="lesson-hero">
        <div className="lesson-hero-copy">
          <p className="lesson-label">CHAPTER {lesson.chapter} · MECHANISM UNIT {lesson.id}</p>
          <h1>{lesson.title}</h1>
          <p className="lesson-subtitle">{lesson.subtitle}</p>
          <div className="lesson-meta" aria-label="课程信息" role="group">
            <div><span>阅读时间</span><strong>{lesson.readingTime}</strong></div>
            <div><span>先修知识</span><strong>{lesson.prerequisite}</strong></div>
            <div><span>最后校订</span><strong>{lesson.updatedAt}</strong></div>
          </div>
        </div>
        <div className={isReviewed ? 'review-seal reviewed' : 'review-seal'}>
          <span>{isReviewed ? 'REVIEWED' : hasCurrentReviewRecord ? 'IN REVIEW' : 'AUTHOR DRAFT'}</span>
          <strong>{isReviewed ? '双审通过' : hasCurrentReviewRecord ? '双审修订中' : '作者草稿'}</strong>
          <p>{isReviewed ? '事实与论证审稿 · 教学与结构审稿' : hasCurrentReviewRecord ? '已收到审稿记录，当前版本仍未获双重批准' : '尚未冻结，也尚未取得两名独立审稿人批准'}</p>
        </div>
      </section>

      <div className="lesson-layout">
        <aside className="lesson-toc">
          <p>ON THIS PAGE · 本节目录</p>
          <nav aria-label="本节目录">
            {lesson.sections.map((section, index) => (
              <a href={`#${section.id}`} key={section.id}>
                <span>{String((lesson.sectionNumberStart ?? 0) + index).padStart(2, '0')}</span>{section.label}
              </a>
            ))}
          </nav>
          <div className="toc-note">
            <span>阅读方法</span>
            <p>先顺着机制链完整读一遍，再操作本节互动实验；最后用“理解检查”检验自己能否脱离原文解释。</p>
          </div>
        </aside>

        <article className="lesson-article" id="lesson-content" tabIndex={-1}>
          {printIndexSections.length > 0 ? (
            <nav className="lesson-print-index" id="lesson-print-index" aria-label={`${lesson.id}纸面目录`}>
              <p>PRINT INDEX · 纸面目录</p>
              <h2>主要板块与机制索引</h2>
              <p className="lesson-print-index-note">数字版可点击条目跳转；浏览器直接打印不显示未经分页器确认的页码，正式PDF可在排版后写入真实页码。</p>
              <ol>
                {printIndexSections.map((section, index) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>
                      <span className="lesson-print-index-order">{String(index + 1).padStart(2, '0')}</span>
                      <span className="lesson-print-index-label">{section.label}</span>
                      <span className="lesson-print-index-page" data-print-page-for={section.id} />
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          <Content />

          <section className="references-section" id="references">
            <p className="section-kicker">REFERENCES · 本节参考文献</p>
            <h2>关键专业判断应当能够回到来源</h2>
            <p className="references-intro">
              下列来源会按本节需要涵盖经典理论与专著、同行评审研究、工作论文、机构白皮书、
              交易所或指数公司方法书，以及监管与公共机构的一手分析；它们的证据层级并不相同。
              “证据用途与边界”栏明确标出本节实际提取的命题与不能外推的边界，避免只堆砌书目。
            </p>
            <ol className="reference-list">
              {lesson.references.map((reference) => (
                <li id={`ref-${reference.id}`} key={reference.id}>
                  <span>{String(reference.id).padStart(2, '0')}</span>
                  <div>
                    <p>{reference.authors} ({reference.year}).</p>
                    <a
                      aria-label={`${reference.title}（在新标签打开）`}
                      data-print-locator={hasPublicationPrintNavigation ? printSourceLocator(reference.url) : undefined}
                      href={reference.url}
                      rel="noreferrer"
                      target="_blank"
                    >{reference.title} ↗</a>
                    <em>
                      {reference.publication}
                      {reference.accessedAt ? <> · 访问日期 <span className="reference-accessed-at">{reference.accessedAt}</span></> : ''}
                    </em>
                    <small><b>证据用途与边界：</b>{reference.use}</small>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="reading-section" id="reading-list">
            <p className="section-kicker">DEEPER READING · 延伸阅读</p>
            <h2>如果要从“理解机制”走向系统学习</h2>
            {lesson.readingListOrder !== 'source' && lesson.readingList.some((item) => item.group) ? (
              <div className="reading-paths">
                {populatedReadingPaths.map((path, pathIndex) => {
                  const items = lesson.readingList.filter((item) => item.group === path.id);
                  if (items.length === 0) return null;
                  return (
                    <section aria-labelledby={`reading-path-${path.id}`} className="reading-path" key={path.id}>
                      <div className="reading-path-head">
                        <span>{String(pathIndex + 1).padStart(2, '0')}</span>
                        <div><h3 id={`reading-path-${path.id}`}>{path.label}</h3><p>{path.intro(items.length)}</p></div>
                      </div>
                      <div className="reading-grid">
                        {items.map((item, itemIndex) => renderReadingCard(item, itemIndex))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <div className="reading-grid">
                {lesson.readingList.map(renderReadingCard)}
              </div>
            )}
          </section>

          <section className="review-record" aria-label="审稿记录">
            <div>
              <p>QUALITY CONTROL · 审稿记录</p>
              <h2>{isReviewed ? '本节已经完成两轮独立审稿' : '本节初稿需由两位独立审稿人复核'}</h2>
            </div>
            <div className="review-slots">
              <article>
                <span>REVIEW 01</span><b>事实、术语、公式与引用</b>
                <p>{reviewFor('accuracy')?.summary ?? '当前修订版本待复核'}</p>
              </article>
              <article>
                <span>REVIEW 02</span><b>教学结构、反例与可理解性</b>
                <p>{reviewFor('pedagogy')?.summary ?? '当前修订版本待复核'}</p>
              </article>
            </div>
          </section>

          <nav className="lesson-next" aria-label="课程导航">
            {lesson.previous ? (
              <a href={sitePath(`/learn/${lesson.previous.slug}`)}>← 上一节 · {lesson.previous.label}</a>
            ) : <a href={sitePath('/')}>← 返回完整课程地图</a>}
            {lesson.next?.slug ? (
              <a href={sitePath(`/learn/${lesson.next.slug}`)}>下一节 · {lesson.next.label} →</a>
            ) : lesson.next ? <span>下一节 · {lesson.next.label}　即将编写</span> : null}
          </nav>
        </article>
      </div>
    </main>
  );
}
