import { generateId } from './utils.js';

export const createComment = (text) => {
  const id = generateId();
  return { id, text, likes: 0, replies: [] };
};

export const createReply = (parentId, text) => {
  const id = generateId();
  return { id, parentId, text, likes: 0 };
};

export const likeComment = (comment) => {
  return { ...comment, likes: (comment.likes || 0) + 1 };
};

export const deleteComment = (comments, id) => {
  // Если id соответствует корневому комментарию — удаляем его целиком
  if (comments.some((c) => c.id === id)) {
    return comments.filter((c) => c.id !== id);
  }

  // Иначе считаем, что удаляется ответ — возвращаем новый массив с отфильтрованными replies
  return comments.map((c) => ({ ...c, replies: c.replies.filter((r) => r.id !== id) }));
};
