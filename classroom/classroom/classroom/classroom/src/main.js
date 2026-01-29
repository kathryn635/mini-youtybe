import { createComment, createReply, likeComment, deleteComment } from './comments.js';
import { renderComment, renderReply } from './render.js';

const commentsContainer = document.getElementById('comments');
const form = document.getElementById('comment-form');
const textarea = document.getElementById('comment-text');

let comments = [];

// Добавить новый комментарий в память и в DOM
const addComment = (text) => {
  const c = createComment(text);
  comments = [...comments, c];
  const el = renderComment(c);
  // Вложенные ответы пока пустые
  commentsContainer.append(el);
};

// Добавить ответ к комментарию (immutably) и обновить DOM локально
const addReplyTo = (parentId, text) => {
  const r = createReply(parentId, text);
  comments = comments.map((c) => (c.id === parentId ? { ...c, replies: [...c.replies, r] } : c));

  const parentEl = commentsContainer.querySelector(`[data-id="${parentId}"]`);
  if (parentEl) {
    const repliesContainer = parentEl.querySelector('.replies');
    repliesContainer.append(renderReply(r));
  }
};

// Обработчик кастомных событий like/delete/reply
commentsContainer.addEventListener('like', (ev) => {
  const { id, isReply } = ev.detail;
  if (isReply) {
    comments = comments.map((c) => ({ ...c, replies: c.replies.map((r) => (r.id === id ? likeComment(r) : r)) }));
    const el = commentsContainer.querySelector(`[data-reply-id="${id}"]`);
    if (el) {
      const span = el.querySelector('.like-count');
      const r = comments.flatMap((c) => c.replies).find((x) => x.id === id);
      if (span && r) span.textContent = r.likes;
    }
    return;
  }

  // top-level comment
  comments = comments.map((c) => (c.id === id ? likeComment(c) : c));
  const el = commentsContainer.querySelector(`[data-id="${id}"]`);
  if (el) {
    const span = el.querySelector('.like-count');
    const c = comments.find((x) => x.id === id);
    if (span && c) span.textContent = c.likes;
  }
});

commentsContainer.addEventListener('delete', (ev) => {
  const { id, isReply } = ev.detail;
  comments = deleteComment(comments, id);
  if (isReply) {
    const el = commentsContainer.querySelector(`[data-reply-id="${id}"]`);
    if (el && el.parentElement) el.remove();
    return;
  }

  const el = commentsContainer.querySelector(`[data-id="${id}"]`);
  if (el) el.remove();
});

commentsContainer.addEventListener('reply', (ev) => {
  const { id } = ev.detail;
  const parentEl = commentsContainer.querySelector(`[data-id="${id}"]`);
  if (!parentEl) return;

  // Если форма уже есть — не создаём новую
  if (parentEl.querySelector('.small-form')) return;

  const smallForm = document.createElement('form');
  smallForm.classList.add('small-form');

  const input = document.createElement('input');
  input.type = 'text';
  input.required = true;
  input.placeholder = 'Ответить...';

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = 'Ответить';

  smallForm.append(input, btn);

  const repliesContainer = parentEl.querySelector('.replies');
  repliesContainer.append(smallForm);

  smallForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    addReplyTo(id, v);
    smallForm.remove();
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const v = textarea.value.trim();
  if (!v) return;
  addComment(v);
  textarea.value = '';
  textarea.focus();
});

// Экспорт для тестов или отладки
export { comments };
