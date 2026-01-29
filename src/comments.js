export let nextId = 1
export let nextReplyId = 101
export const createComment = text => {
  return {
    id: nextId++,
    text,
    likes: 0,
    replies: [],
  }
}

export const createReply = (parentId, text) => {
  return { id: nextReplyId++, parentId, text, likes: 0 }
}

export const likeComment = comment => {
  return {
    ...comment,
    likes: comment.likes + 1,
  }
}

export const deleteComment = (comments, id) => {
  return comments.filter(comment => comment.id !== id)
}