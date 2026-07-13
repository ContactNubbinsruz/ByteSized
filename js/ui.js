/* ============================================================
   js/ui.js
   ============================================================ */

import { isComplete } from './notes.js';

// ── Markdown renderer with expandable blocks ──
let renderer;

export function initRenderer() {
    renderer = new marked.Renderer();

    renderer.code = function(token, lang) {
        let text = '';
        let language = '';
        if (typeof token === 'object' && token !== null) {
            text = token.text || token.raw || '';
            language = token.lang || lang || '';
        } else {
            text = String(token || '');
            language = String(lang || '');
        }
        const validLang = language && hljs.getLanguage(language) ? language : 'plaintext';
        let highlighted;
        try {
            highlighted = hljs.highlight(text, { language: validLang }).value;
        } catch (e) {
            highlighted = text.replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' } [m] || m));
        }
        return `<pre><code class="hljs language-${validLang}">${highlighted}</code></pre>`;
    };

    // Store renderer globally
    window.__renderer = renderer;
}

// ── Process expandable blocks ──
function processExpandableBlocks(markdown) {
    const pattern = /^:::expand\s+(.+?)\s*\n([\s\S]*?)^:::/gm;
    let result = markdown;
    const blocks = [];
    let match;
    pattern.lastIndex = 0;
    while ((match = pattern.exec(markdown)) !== null) {
        blocks.push({
            full: match[0],
            title: (match[1] || '').trim(),
            content: (match[2] || '').trim(),
        });
    }
    for (let i = blocks.length - 1; i >= 0; i--) {
        const b = blocks[i];
        const content = b.content || '';
        let renderedContent = '';
        if (content) {
            try {
                renderedContent = marked.parse(String(content), { renderer: window.__renderer, gfm: true, breaks: true });
            } catch (e) {
                renderedContent = `<pre>${content}</pre>`;
            }
        }
        const html = `<div class="expandable-block" onclick="window.toggleExpandable(this)">
          <div class="expandable-summary">
            <span class="exp-arrow">▸</span>
            ${b.title || 'Expand'}
          </div>
          <div class="expandable-body">${renderedContent}</div>
        </div>`;
        result = result.replace(b.full, html);
    }
    return result;
}

window.toggleExpandable = function(el) {
    el.classList.toggle('open');
};

// ── Render markdown to HTML ──
export function renderMarkdown(text) {
    if (!text) return '<p>Empty note.</p>';
    try {
        if (!window.__renderer) initRenderer();
        let processed = processExpandableBlocks(text);
        const html = marked.parse(processed, { renderer: window.__renderer, gfm: true, breaks: true });
        return html;
    } catch (e) {
        console.error('Markdown error:', e);
        return `<p style="color:#e57373;">Error rendering: ${e.message}</p>`;
    }
}

// ── Build tree HTML ──
export function renderTree(notes, filterList, activePath) {
    // Build a tree structure from notes
    const tree = buildTree(notes);

    function renderNode(node, path = '') {
        if (node.type === 'file') {
            const isActive = node.path === activePath;
            const completed = isComplete(node.path);
            return `<div class="tree-node tree-file${isActive ? ' active' : ''}${completed ? ' completed' : ''}" data-path="${node.path}">
                <span class="file-icon"><i data-lucide="${node.icon || 'file-text'}" class="icon"></i></span>
                <span class="file-name">${node.name}</span>
                ${completed ? '<span class="file-complete">✓</span>' : ''}
            </div>`;
        }

        // Folder
        const childrenHtml = node.children && node.children.length > 0 ?
            node.children.map(c => renderNode(c, path + '/' + node.name)).join('') :
            '<div class="empty-folder">empty</div>';

        // Check if any children are visible in filter
        const hasVisible = node.children && node.children.some(c => {
            if (c.type === 'file') return filterList.includes(c.path);
            return true; // folders always show
        });

        if (!hasVisible && filterList) return '';

        return `<div class="tree-node tree-folder" data-path="${path}/${node.name}">
            <div class="folder-label">
                <span class="arrow"><i data-lucide="chevron-right" class="icon"></i></span>
                <i data-lucide="folder" class="icon" style="width:14px;height:14px;stroke:currentColor;"></i>
                ${node.name}
            </div>
            <div class="children">${childrenHtml}</div>
        </div>`;
    }

    return tree.map(node => renderNode(node, '')).join('');
}

// ── Build tree from flat notes ──
function buildTree(notes)
{
    const tree = {};

    notes.forEach(note =>
    {
        const subject =
            note.subject || "General";

        const section =
            note.section || "Misc";

        if (!tree[subject])
            tree[subject] = {};

        if (!tree[subject][section])
            tree[subject][section] = [];

        tree[subject][section].push(note);
    });

    const result = [];

    for (const subjectName in tree)
    {
        const subjectFolder =
        {
            type: "folder",
            name: subjectName,
            children: []
        };

        const sections =
            tree[subjectName];

        for (const sectionName in sections)
        {
            const sectionFolder =
            {
                type: "folder",
                name: sectionName,
                children: []
            };

            sections[sectionName]
                .sort((a,b)=>
                    (a.order ?? 999)
                    - (b.order ?? 999));

            sections[sectionName]
                .forEach(note =>
                {
                    sectionFolder.children.push(
                    {
                        type: "file",
                        name: note.title,
                        path: note.path,
                        icon: "file-text"
                    });
                });

            subjectFolder.children.push(
                sectionFolder
            );
        }

        result.push(subjectFolder);
    }

    return result;
}

// ── Render note footer (nav + related) ──
export function renderNoteFooter(note, allNotes, index, total) {
    // Handled by app.js directly
}

// ── Render related notes ──
export function renderRelated(note, allNotes, tagsContainer, listContainer) {
    if (!note || !note.tags || note.tags.length === 0) {
        tagsContainer.closest('.related-section').style.display = 'none';
        return;
    }

    tagsContainer.closest('.related-section').style.display = 'block';

    // Show tags
    tagsContainer.innerHTML = note.tags.map(t =>
        `<span class="related-tag">${t}</span>`
    ).join('');

    // Find related notes (same tags, excluding self)
    const related = allNotes.filter(n =>
        n.path !== note.path && n.tags && n.tags.some(t => note.tags.includes(t))
    );

    if (related.length === 0) {
        listContainer.innerHTML = '<span style="font-size:0.7rem;color:var(--muted);">No related notes found.</span>';
        return;
    }

    listContainer.innerHTML = related.map(n =>
        `<a class="related-item" data-path="${n.path}">${n.title || n.path}</a>`
    ).join('');

    listContainer.querySelectorAll('.related-item').forEach(el => {
        el.addEventListener('click', () => {
            // Trigger note selection via custom event
            document.dispatchEvent(new CustomEvent('selectNote', { detail: { path: el.dataset.path } }));
        });
    });
}
