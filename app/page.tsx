'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { chapters, toolUnits, totalUnits } from './curriculum';
import { lessonCatalog } from './lessons/catalog';
import { sitePath } from './sitePath';

export default function Home() {
  const [activeChapter, setActiveChapter] = useState('01');
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const directoryRef = useRef<HTMLElement>(null);
  const active = chapters.find((chapter) => chapter.id === activeChapter) ?? chapters[0];

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === 'Escape' && document.activeElement === searchRef.current) {
        setQuery('');
        searchRef.current?.blur();
      }
    };
    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const allUnits = chapters.flatMap((chapter) =>
      chapter.units.map((unit) => ({ ...unit, chapterId: chapter.id, chapterZh: chapter.zh })),
    );
    if (!normalized) {
      return active.units.map((unit) => ({ ...unit, chapterId: active.id, chapterZh: active.zh }));
    }
    return allUnits.filter((unit) =>
      `${unit.id} ${unit.title} ${unit.question} ${unit.prerequisite} ${unit.links} ${unit.chapterZh}`
        .toLowerCase()
        .includes(normalized),
    );
  }, [active, query]);

  const selectChapter = (chapterId: string) => {
    setActiveChapter(chapterId);
    setQuery('');
    window.setTimeout(() => directoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  const isSearching = query.trim().length > 0;

  return (
    <main className="site-shell">
      <aside className="side-rail">
        <a className="brand" href="#top" aria-label="返回课程首页">
          <span className="brand-mark">W</span>
          <span><b>World Model</b><small>FINANCIAL CURRICULUM</small></span>
        </a>
        <nav className="chapter-nav" aria-label="七章导航">
          <p className="nav-label">CONTENTS · 目录</p>
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              className={activeChapter === chapter.id && !isSearching ? 'nav-item active' : 'nav-item'}
              onClick={() => selectChapter(chapter.id)}
              type="button"
            >
              <span>{chapter.id}</span><span>{chapter.zh}</span>
            </button>
          ))}
        </nav>
        <div className="rail-note">
          <span>CURRICULUM v1.0 · IN PRODUCTION</span>
          <p>{totalUnits} 个机制单元已装入目录。正式正文按“研究—写作—双重独立审稿—校订”的流程逐节发布。</p>
        </div>
      </aside>

      <div className="page" id="top">
        <header className="topbar">
          <div className="breadcrumb">MASTER CURRICULUM / 七层金融世界模型</div>
          <div className="search" role="search">
            <span aria-hidden="true">⌕</span>
            <input
              ref={searchRef}
              aria-label="搜索课程目录"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索全书机制、问题或 prerequisite"
              value={query}
            />
            {query ? <button aria-label="清空搜索" onClick={() => setQuery('')} type="button">×</button> : <kbd>⌘ K</kbd>}
          </div>
        </header>

        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">A SYSTEMS CURRICULUM FOR FINANCIAL MARKETS</p>
            <h1 id="hero-title">理解价格之前，<br />先理解整个系统。</h1>
            <p className="dek">从一笔订单到全球制度，从参与者约束到叙事反馈：这不是七门金融课的拼接，而是一条逐层向外展开、最终重新闭合的因果链。</p>
            <div className="hero-metrics" aria-label="课程统计">
              <div><strong>7</strong><span>核心章节</span></div>
              <div><strong>{totalUnits}</strong><span>机制单元</span></div>
              <div><strong>{toolUnits.length}</strong><span>基础工具</span></div>
            </div>
          </div>
          <div className="system-map" aria-label="金融系统因果主线">
            <p>THE CENTRAL CAUSAL CHAIN</p>
            {['现实世界', '信息与预期', '异质参与者', '目标与约束', '交易行为', '价格与流动性', '跨市场传导', '反馈与新状态'].map((item, index) => (
              <div className="system-node" key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span><b>{item}</b>{index < 7 && <i aria-hidden="true">↓</i>}
              </div>
            ))}
          </div>
        </section>

        <section className="chapter-overview" aria-labelledby="overview-title">
          <div className="section-heading">
            <div><p className="eyebrow">THE SEVEN LAYERS</p><h2 id="overview-title">七章不是分类，而是观察距离的变化</h2></div>
            <p>从离价格最近的机制出发，逐步走向宏观、制度与人类认知，最后回到可验证研究。</p>
          </div>
          <div className="chapter-grid">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                className={activeChapter === chapter.id && !isSearching ? 'chapter-card selected' : 'chapter-card'}
                onClick={() => selectChapter(chapter.id)}
                style={{ '--accent': chapter.accent } as React.CSSProperties}
                type="button"
              >
                <div className="card-top"><span>CHAPTER {chapter.id}</span><b>{chapter.units.length} UNITS</b></div>
                <h3>{chapter.title}</h3><h4>{chapter.zh}</h4><p>{chapter.question}</p>
                <div className="card-foot">展开完整目录 <span>↗</span></div>
              </button>
            ))}
          </div>
        </section>

        <section className="foundations" aria-labelledby="foundations-title">
          <div className="section-heading">
            <div><p className="eyebrow">TOOL LAYER · ON DEMAND</p><h2 id="foundations-title">零号工具层：只在需要时补基础</h2></div>
            <p>它不属于世界观主线，只负责避免数学、合约与数据尺度阻塞后续机制理解。</p>
          </div>
          <div className="tool-grid">
            {toolUnits.map((unit) => (
              <article className="tool-card" key={unit.id}>
                <span>{unit.id}</span><h3>{unit.title}</h3><p>{unit.question}</p><small>{unit.links}</small>
              </article>
            ))}
          </div>
        </section>

        <section className={isSearching ? 'directory search-mode' : 'directory'} aria-labelledby="directory-title" ref={directoryRef}>
          <div className="directory-head" style={{ '--accent': isSearching ? '#1d211f' : active.accent } as React.CSSProperties}>
            <div className="chapter-number">{isSearching ? '⌕' : active.id}</div>
            <div>
              <p>{isSearching ? `GLOBAL SEARCH · ${matches.length} RESULTS` : `CHAPTER ${active.id} · ${active.units.length} MECHANISM UNITS`}</p>
              <h2 id="directory-title">{isSearching ? '全书搜索结果' : active.zh}</h2>
              <h3>{isSearching ? `“${query.trim()}”` : active.title}</h3>
            </div>
            <p className="chapter-question">{isSearching ? '结果同时检索标题、核心问题、先修知识与跨章节接口。' : active.thesis}</p>
          </div>

          <div className="unit-list">
            <div className="unit-columns" aria-hidden="true"><span>UNIT / 核心机制</span><span>它解决的问题</span><span>跨章节接口</span></div>
            {matches.map((unit) => {
              const publishedLesson = lessonCatalog[unit.id];
              return (
              <article className="unit" key={`${unit.chapterId}-${unit.id}`}>
                <div className="unit-title">
                  <span>{unit.id}</span>
                  <div>
                    {isSearching && <em>CHAPTER {unit.chapterId} · {unit.chapterZh}</em>}
                    {publishedLesson ? (
                      <>
                        <a className="unit-lesson-link" href={sitePath(`/learn/${publishedLesson.slug}`)}><h3>{unit.title}<span>阅读正文 ↗</span></h3></a>
                        <em className={publishedLesson.status === 'double-reviewed' ? 'unit-review-status reviewed' : 'unit-review-status'}>
                          {publishedLesson.status === 'double-reviewed' ? '正式内容 · 双审通过' : '作者草稿 · 尚未双审'}
                        </em>
                      </>
                    ) : <h3>{unit.title}</h3>}
                    <small>PREREQUISITE · {unit.prerequisite}</small>
                  </div>
                </div>
                <p>{unit.question}</p>
                <div className="unit-links"><b>INTERFACE</b>{unit.links}</div>
              </article>
              );
            })}
            {matches.length === 0 && (
              <div className="empty-state"><span>0</span><h3>没有找到对应机制</h3><p>可以尝试更短的中文词、英文术语或编号，例如“流动性”“feedback”“7.15”。</p></div>
            )}
          </div>
        </section>

        <footer><span>FINANCIAL WORLD MODEL · MASTER CURRICULUM v1.0</span><span>结构先于内容 · 机制先于名词 · 验证先于确信</span></footer>
      </div>
    </main>
  );
}
