export const generateId = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
};

export const formatLikes = (likes) => {
    return likes.toString();
};
