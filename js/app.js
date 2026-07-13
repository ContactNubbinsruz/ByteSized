/* ============================================================
   js/app.js
   ============================================================ */

import { loadNotes, getNote, saveNote, getNotesList, getSubjects, getTags, markComplete, isComplete, getProgress } from './notes.js';
import { renderMarkdown, renderTree, renderNoteFooter, renderRelated } from './ui.js';

// ── State ──
let allNotes = [];
let currentPath = '';
let currentContent = '';
let isEditMode = false;
let filteredPaths = [];
let currentIndex = -1;

// ── DOM refs ──
const $ = id => document.getElementById(id);
const treeWrap = $('file-tree-wrap');
const markdownView = $('markdown-view');
const editorArea = $('editor-area');
const editorTextarea = $('editor-textarea');
const emptyState = $('empty-state');
const filePathDisplay = $('file-path-display');
const editToggle = $('edit-toggle');
const saveBtn = $('save-btn');
const completeToggle = $('complete-toggle');
const searchInput = $('search-input');
const filterSubject = $('filter-subject');
const filterDifficulty = $('filter-difficulty');
const tagContainer = $('tag-filter-container');
const noteFooter = $('note-footer');
const relatedSection = $('related-section');
const relatedTags = $('related-tags');
const relatedList = $('related-list');
const prevBtn = $('prev-btn');
const nextBtn = $('next-btn');
const navCounter = $('nav-counter');
const progressText = $('progress-text');
const progressPct = $('progress-pct');
const progressFill = $('progress-fill');
const contextMenu = $('context-menu');
const sidebar = $('sidebar');
const menuToggle = $('menu-toggle');

// ── Load data ──
async function loadAll() {
    allNotes = await loadNotes();
    populateFilters();
    renderTreeView(allNotes);
    updateProgress();

    // Auto-select first note if available
    const list = getFilteredList();
    if (list.length > 0) {
        selectNote(list[0]);
    } else {
        showEmpty();
    }
}

function getFilteredList() {
    const search = searchInput.value.toLowerCase().trim();
    const subject = filterSubject.value;
    const difficulty = filterDifficulty.value;
    const activeTags = Array.from(document.querySelectorAll('.tag-chip.active')).map(el => el.dataset.tag);

    return allNotes.filter(n => {
        if (search && !n.title.toLowerCase().includes(search) && !n.content.toLowerCase().includes(search)) return false;
        if (subject && n.subject !== subject) return false;
        if (difficulty && n.difficulty !== difficulty) return false;
        if (activeTags.length > 0 && !activeTags.some(t => n.tags.includes(t))) return false;
        return true;
    }).map(n => n.path);
}

function populateFilters() {
    const subjects = getSubjects(allNotes);
    filterSubject.innerHTML = '<option value="">All Subjects</option>' +
        subjects.map(s => `<option value="${s}">${s}</option>`).join('');

    const tags = getTags(allNotes);
    tagContainer.innerHTML = tags.map(t =>
        `<span class="tag-chip" data-tag="${t}">${t}</span>`
    ).join('');
    tagContainer.querySelectorAll('.tag-chip').forEach(el => {
        el.addEventListener('click', () => {
            el.classList.toggle('active');
            applyFilters();
        });
    });
}

function applyFilters() {
    const list = getFilteredList();
    renderTreeView(allNotes, list);
    if (list.length > 0 && !list.includes(currentPath)) {
        selectNote(list[0]);
    } else if (list.length === 0) {
        showEmpty('No notes match your filters.');
    } else if (currentPath) {
        // Keep current if still in list
    }
    updateNav();
}

function renderTreeView(notes, filterList) {
    const list = filterList || notes.map(n => n.path);
    const html = renderTree(notes, list, currentPath);
    treeWrap.innerHTML = html;

    // Attach click events
    treeWrap.querySelectorAll('.tree-file').forEach(el => {
        el.addEventListener('click', () => {
            selectNote(el.dataset.path);
        });
    });
    treeWrap.querySelectorAll('.tree-folder > .folder-label').forEach(el => {
        el.addEventListener('click', () => {
            el.closest('.tree-folder').classList.toggle('open');
        });
    });

    // Rebuild lucide icons
    if (window.lucide) lucide.createIcons();
}

function selectNote(path) {
    const note = allNotes.find(n => n.path === path);
    if (!note) return;

    currentPath = path;
    currentContent = note.content;
    isEditMode = false;
    markdownView.style.display = 'block';
    editorArea.style.display = 'none';
    saveBtn.style.display = 'none';
    emptyState.style.display = 'none';
    noteFooter.style.display = 'block';

    // Render content
    markdownView.innerHTML = renderMarkdown(note.content);
    markdownView.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));

    filePathDisplay.textContent = note.title || path;

    // Update active state in tree
    treeWrap.querySelectorAll('.tree-file').forEach(el => {
        el.classList.toggle('active', el.dataset.path === path);
    });

    // Update complete toggle
    const completed = isComplete(path);
    completeToggle.innerHTML = `<i data-lucide="${completed ? 'check-circle' : 'circle'}" class="icon"></i>`;
    if (window.lucide) lucide.createIcons();

    // Update edit button
    editToggle.innerHTML = '<i data-lucide="pencil" class="icon"></i>';

    // Render footer
    renderNoteFooter(note, allNotes, currentIndex, getFilteredList().length);
    renderRelated(note, allNotes, relatedTags, relatedList);

    // Update nav
    updateNav();
    updateProgress();

    // Store last viewed
    localStorage.setItem('lastNote', path);
}

function showEmpty(msg) {
    emptyState.style.display = 'flex';
    markdownView.style.display = 'none';
    editorArea.style.display = 'none';
    noteFooter.style.display = 'none';
    filePathDisplay.textContent = '';
    if (msg) {
        emptyState.querySelector('p').textContent = msg;
    } else {
        emptyState.querySelector('p').textContent = 'Select a note from the sidebar to begin learning.';
    }
}

function updateNav() {
    const list = getFilteredList();
    currentIndex = list.indexOf(currentPath);
    const total = list.length;

    if (total === 0) {
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        navCounter.textContent = '0 / 0';
        return;
    }

    prevBtn.disabled = currentIndex <= 0;
    nextBtn.disabled = currentIndex >= total - 1;
    navCounter.textContent = `${currentIndex + 1} / ${total}`;
}

function updateProgress() {
    const { completed, total } = getProgress(allNotes);
    progressText.textContent = `${completed} / ${total} complete`;
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
    progressPct.textContent = `${pct}%`;
    progressFill.style.width = `${pct}%`;
}

// ── Navigation ──
function goPrev() {
    const list = getFilteredList();
    const idx = list.indexOf(currentPath);
    if (idx > 0) selectNote(list[idx - 1]);
}

function goNext() {
    const list = getFilteredList();
    const idx = list.indexOf(currentPath);
    if (idx < list.length - 1) selectNote(list[idx + 1]);
}

// ── Edit / Save ──
editToggle.addEventListener('click', () => {
    if (!currentPath) return;
    if (isEditMode) {
        // Cancel: revert
        isEditMode = false;
        editorArea.style.display = 'none';
        markdownView.style.display = 'block';
        saveBtn.style.display = 'none';
        editToggle.innerHTML = '<i data-lucide="pencil" class="icon"></i>';
        if (window.lucide) lucide.createIcons();
        markdownView.innerHTML = renderMarkdown(currentContent);
        markdownView.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
    } else {
        isEditMode = true;
        markdownView.style.display = 'none';
        editorArea.style.display = 'block';
        saveBtn.style.display = 'inline-flex';
        editToggle.innerHTML = '<i data-lucide="x" class="icon"></i>';
        editorTextarea.value = currentContent;
        if (window.lucide) lucide.createIcons();
        editorTextarea.focus();
    }
});

saveBtn.addEventListener('click', async () => {
    if (!currentPath) return;
    const newContent = editorTextarea.value;
    const success = await saveNote(currentPath, newContent);
    if (success) {
        currentContent = newContent;
        const note = allNotes.find(n => n.path === currentPath);
        if (note) note.content = newContent;
        // Exit edit mode
        isEditMode = false;
        editorArea.style.display = 'none';
        markdownView.style.display = 'block';
        saveBtn.style.display = 'none';
        editToggle.innerHTML = '<i data-lucide="pencil" class="icon"></i>';
        markdownView.innerHTML = renderMarkdown(newContent);
        markdownView.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
        // Update tree (content may have changed metadata)
        await loadAll();
    }
});

// ── Complete toggle ──
completeToggle.addEventListener('click', () => {
    if (!currentPath) return;
    const completed = !isComplete(currentPath);
    markComplete(currentPath, completed);
    const icon = completed ? 'check-circle' : 'circle';
    completeToggle.innerHTML = `<i data-lucide="${icon}" class="icon"></i>`;
    if (window.lucide) lucide.createIcons();
    // Update tree item
    const el = treeWrap.querySelector(`.tree-file[data-path="${currentPath}"]`);
    if (el) {
        el.classList.toggle('completed', completed);
        const badge = el.querySelector('.file-complete');
        if (badge) badge.textContent = completed ? '✓' : '';
    }
    updateProgress();
});

// ── Search ──
searchInput.addEventListener('input', applyFilters);
filterSubject.addEventListener('change', applyFilters);
filterDifficulty.addEventListener('change', applyFilters);

// ── Previous / Next ──
prevBtn.addEventListener('click', goPrev);
nextBtn.addEventListener('click', goNext);

// ── Keyboard shortcuts ──
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault();
        goPrev(); }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault();
        goNext(); }
    if (e.key === 'e' && !e.metaKey && !e.ctrlKey) { editToggle.click(); }
    if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        if (isEditMode) { e.preventDefault();
            saveBtn.click(); }
    }
});

// ── Context Menu ──
editorTextarea.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (editorArea.style.display === 'none') return;
    const x = Math.min(e.clientX, window.innerWidth - 220 - 10);
    const y = Math.min(e.clientY, window.innerHeight - 380 - 10);
    contextMenu.style.left = x + 'px';
    contextMenu.style.top = y + 'px';
    contextMenu.style.display = 'block';
});

document.addEventListener('click', (e) => {
    if (!contextMenu.contains(e.target)) {
        contextMenu.style.display = 'none';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') contextMenu.style.display = 'none';
});

contextMenu.querySelectorAll('.ctx-item').forEach(item => {
    item.addEventListener('click', () => {
        insertMarkdown(item.dataset.action);
        contextMenu.style.display = 'none';
        editorTextarea.focus();
    });
});

function insertMarkdown(action) {
    const ta = editorTextarea;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.substring(start, end);
    let insert = '';
    switch (action) {
        case 'h1':
            insert = `# ${selected || 'Heading 1'}`;
            break;
        case 'h2':
            insert = `## ${selected || 'Heading 2'}`;
            break;
        case 'h3':
            insert = `### ${selected || 'Heading 3'}`;
            break;
        case 'bullet-list':
            insert = (selected || 'Item').split('\n').map(l => `- ${l}`).join('\n');
            break;
        case 'numbered-list':
            insert = (selected || 'Item').split('\n').map((l, i) => `${i+1}. ${l}`).join('\n');
            break;
        case 'task-list':
            insert = (selected || 'Task').split('\n').map(l => `- [ ] ${l}`).join('\n');
            break;
        case 'code-block': {
            const lang = prompt('Language:', '') || '';
            insert = `\`\`\`${lang}\n${selected || '// code'}\n\`\`\``;
            break;
        }
        case 'expandable': {
            const title = prompt('Title:', 'Expand') || 'Expand';
            insert = `:::expand ${title}\n${selected || 'Content'}\n:::`;
            break;
        }
        case 'table':
            insert =
                `| Header 1 | Header 2 | Header 3 |\n| -------- | -------- | -------- |\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |`;
            break;
        case 'blockquote':
            insert = (selected || 'Quote').split('\n').map(l => `> ${l}`).join('\n');
            break;
        case 'hr':
            insert = '---';
            break;
        case 'link': {
            const url = prompt('URL:', 'https://') || '#';
            insert = `[${selected || 'link text'}](${url})`;
            break;
        }
        case 'image': {
            const url = prompt('Image URL:', 'https://') || '#';
            insert = `![${selected || 'alt text'}](${url})`;
            break;
        }
        default:
            return;
    }
    ta.value = ta.value.substring(0, start) + insert + ta.value.substring(end);
    ta.selectionStart = ta.selectionEnd = start + insert.length;
    ta.dispatchEvent(new Event('input'));
}

// ── Refresh ──
$('refresh-btn').addEventListener('click', loadAll);

// ── Menu Toggle (mobile) ──
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Close sidebar on note click (mobile)
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 540 && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && e.target.closest('.main')) {
            sidebar.classList.remove('open');
        }
    }
});

// ── Init ──
loadAll().then(() => {
    // Restore last viewed
    const last = localStorage.getItem('lastNote');
    if (last && allNotes.some(n => n.path === last)) {
        selectNote(last);
    }
});
