import React, { useMemo } from 'react';

interface TocItem {
  id: string;
  text: string;
}

interface TableOfContentsProps {
  content: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const toc = useMemo(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = Array.from(doc.querySelectorAll('h2'));
    
    return headings.map((h2, index) => {
      // Ensure H2 has an ID, or generate one from text
      if (!h2.id) {
        h2.id = `section-${index}-${h2.textContent?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'heading'}`;
      }
      return { id: h2.id, text: h2.textContent || '' };
    });
  }, [content]);

  if (toc.length === 0) return null;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 mb-8">
      <h3 className="text-xs font-black uppercase tracking-wider text-amber-500 mb-4 font-mono">Table of Contents</h3>
      <ul className="space-y-2">
        {toc.map(item => (
          <li key={item.id}>
            <a 
              href={`#${item.id}`} 
              className="text-[13px] text-slate-300 hover:text-white transition-colors block leading-relaxed"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(item.id);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
