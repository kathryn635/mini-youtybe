export const renderComment = (comment) => {
  const el = document.createElement('div');
  el.classList.add('comment');
  el.dataset.id = comment.id;

  const text = document.createElement('p');
  text.textContent = comment.text;

  const meta = document.createElement('div');
  meta.classList.add('meta');

  const controls = document.createElement('div');
  controls.classList.add('controls');

  const likeBtn = document.createElement('button');
  likeBtn.type = 'button';
  likeBtn.classList.add('like');
  likeBtn.textContent = '👍';
  const likeCount = document.createElement('span');
  likeCount.classList.add('like-count');
  likeCount.textContent = comment.likes;
  likeBtn.append(likeCount);

  const replyBtn = document.createElement('button');
  replyBtn.type = 'button';
  replyBtn.classList.add('reply-btn');
  replyBtn.textContent = 'Ответить';

  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.classList.add('delete-btn');
  delBtn.textContent = 'Удалить';

  controls.append(likeBtn, replyBtn, delBtn);
  meta.append(controls);

  const repliesContainer = document.createElement('div');
  repliesContainer.classList.add('replies');

  el.append(meta, text, repliesContainer);

  // События — делегируем через кастомные события, чтобы main.js мог обрабатывать их централизованно
  likeBtn.addEventListener('click', () => {
    el.dispatchEvent(new CustomEvent('like', { bubbles: true, detail: { id: comment.id, isReply: false } }));
  });

  replyBtn.addEventListener('click', () => {
    el.dispatchEvent(new CustomEvent('reply', { bubbles: true, detail: { id: comment.id } }));
  });

  delBtn.addEventListener('click', () => {
    el.dispatchEvent(new CustomEvent('delete', { bubbles: true, detail: { id: comment.id, isReply: false } }));
  });

  return el;
};

export const renderReply = (reply) => {
  const el = document.createElement('div');
  el.classList.add('reply');
  el.dataset.replyId = reply.id;

  const text = document.createElement('p');
  text.textContent = reply.text;

  const controls = document.createElement('div');
  controls.classList.add('controls');

  const likeBtn = document.createElement('button');
  likeBtn.type = 'button';
  likeBtn.classList.add('like');
  likeBtn.textContent = '👍';
  const likeCount = document.createElement('span');
  likeCount.classList.add('like-count');
  likeCount.textContent = reply.likes;
  likeBtn.append(likeCount);

  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.classList.add('delete-btn');
  delBtn.textContent = 'Удалить';

  controls.append(likeBtn, delBtn);

  el.append(text, controls);

  likeBtn.addEventListener('click', () => {
    el.dispatchEvent(new CustomEvent('like', { bubbles: true, detail: { id: reply.id, isReply: true, parentId: reply.parentId } }));
  });

  delBtn.addEventListener('click', () => {
    el.dispatchEvent(new CustomEvent('delete', { bubbles: true, detail: { id: reply.id, isReply: true, parentId: reply.parentId } }));
  });

  return el;
};
