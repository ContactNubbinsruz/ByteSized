/* ============================================================
   js/notes.js
   ============================================================ */

const API_BASE = '/api/notes';
const STORAGE_KEY = 'learn_completed';

// ── Load notes from server or fallback ──
export async function loadNotes() {
    try {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // data should be an array of { path, title, subject, difficulty, tags, description, content }
        return data;
    } catch (err) {
        console.warn('Failed to load from API, using fallback:', err);
        return loadFallbackNotes();
    }
}

// ── Fallback: load from static manifest + fetch each file ──
async function loadFallbackNotes() {
    try {
        const manifestRes = await fetch('data/manifest.json');
        if (!manifestRes.ok) throw new Error('Manifest not found');
        const manifest = await manifestRes.json();
        const notes = [];
        for (const item of manifest) {
            try {
                const res = await fetch(`data/${item.path}`);
                if (res.ok) {
                    const content = await res.text();
                    notes.push({
                        ...item,
                        content,
                    });
                }
            } catch (e) { /* skip */ }
        }
        return notes;
    } catch (e) {
        console.error('Fallback loading failed:', e);
        return getDemoNotes();
    }
}

// ── Demo notes for initial setup ──
function getDemoNotes() {
    return [{
        path: 'cpp/01-introduction.md',
        title: 'Introduction to C++',
        subject: 'C++',
        difficulty: 'Beginner',
        tags: ['basics', 'syntax'],
        description: 'Getting started with C++ programming.',
        content: `# Introduction to C++\n\nC++ is a powerful general-purpose programming language.\n\n## Key Concepts\n\n- Compiled language\n- Object-oriented\n- Systems programming`
    }, {
        path: 'cpp/02-variables.md',
        title: 'Variables and Types',
        subject: 'C++',
        difficulty: 'Beginner',
        tags: ['basics', 'types', 'variables'],
        description: 'Understanding variables and data types.',
        content: `# Variables and Types\n\nC++ has several built-in types.\n\n\`\`\`cpp\nint x = 42;\ndouble y = 3.14;\n\`\`\``
    }, {
        path: 'cpp/03-pointers.md',
        title: 'Smart Pointers',
        subject: 'C++',
        difficulty: 'Intermediate',
        tags: ['memory', 'pointers', 'RAII'],
        description: 'Learn unique_ptr and shared_ptr.',
        content: `# Smart Pointers\n\nSmart pointers manage memory automatically.\n\n- \`unique_ptr\`: exclusive ownership\n- \`shared_ptr\`: shared ownership`
    }, {
        path: 'python/01-intro.md',
        title: 'Python Basics',
        subject: 'Python',
        difficulty: 'Beginner',
        tags: ['basics', 'syntax'],
        description: 'Getting started with Python.',
        content: `# Python Basics\n\nPython is a high-level, interpreted language.`
    }, {
        path: 'python/02-functions.md',
        title: 'Functions',
        subject: 'Python',
        difficulty: 'Beginner',
        tags: ['functions', 'basics'],
        description: 'Defining and using functions.',
        content: `# Functions\n\n\`\`\`python\ndef greet(name):\n    return f"Hello, {name}"\n\`\`\``
    }];
}

// ── Get a single note ──
export async function getNote(path) {
    try {
        const res = await fetch(`${API_BASE}/${encodeURIComponent(path)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.text();
    } catch (e) {
        // Try fallback
        const notes = await loadFallbackNotes();
        const note = notes.find(n => n.path === path);
        return note ? note.content : null;
    }
}

// ── Save a note ──
export async function saveNote(path, content) {
    try {
        const res = await fetch(`${API_BASE}/${encodeURIComponent(path)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'text/plain' },
            body: content,
        });
        if (!res.ok) throw new Error(`Save failed (${res.status})`);
        return true;
    } catch (e) {
        console.warn('Save failed:', e);
        // Fallback: save to localStorage for demo
        localStorage.setItem(`note_${path}`, content);
        return true;
    }
}

// ── Complete tracking ──
export function getCompleted() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch { return {}; }
}

export function markComplete(path, completed) {
    const map = getCompleted();
    if (completed) {
        map[path] = true;
    } else {
        delete map[path];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function isComplete(path) {
    return !!getCompleted()[path];
}

export function getProgress(notes) {
    const completed = getCompleted();
    const total = notes.length;
    const done = notes.filter(n => completed[n.path]).length;
    return { completed: done, total };
}

// ── Helpers ──
export function getSubjects(notes) {
    const set = new Set(notes.map(n => n.subject).filter(Boolean));
    return Array.from(set).sort();
}

export function getTags(notes) {
    const set = new Set();
    notes.forEach(n => (n.tags || []).forEach(t => set.add(t)));
    return Array.from(set).sort();
}

export function getNotesList(notes) {
    return notes.map(n => n.path);
}
