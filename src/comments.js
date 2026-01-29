import { generateId } from './utils.js';

// 1️⃣  нового комментария
export const createComment = (text) => {
    return {
        id: generateId(),
        text: text.trim(),
        likes: 0,
        replies: []
    };
};

// создание ответа
export const createReply = (parentId, text) => {
    return {
        id: generateId(),
        parentId: parentId,
        text: text.trim(),
        likes: 0
    };
};

//  увеличение лайков
export const likeComment = (comment) => {
    return {
        ...comment,
        likes: comment.likes + 1
    };
};

//  удаление комментария
export const deleteComment = (comments, id) => {
    return comments.filter(comment => comment.id !== id);
};

//для поиска комментария
export const findCommentById = (comments, id) => {
    return comments.find(comment => comment.id === id);
};

//  для добавления ответа
export const addReplyToComment = (comments, commentId, reply) => {
    return comments.map(comment => {
        if (comment.id === commentId) {
            return {
                ...comment,
                replies: [...comment.replies, reply]
            };
        }
        return comment;
    });
};

//  для удаления ответа
export const deleteReply = (comments, commentId, replyId) => {
    return comments.map(comment => {
        if (comment.id === commentId) {
            return {
                ...comment,
                replies: comment.replies.filter(reply => reply.id !== replyId)
            };
        }
        return comment;
    });
};
