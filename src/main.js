
//  Лего!
// Она говорит, что делать когда ты нажимаешь разные кнопки

//  Берем детальки 
// Из comments.js - детальки для работы с текстом
// Из render.js - детальки для рисования на экране
import { 
    createComment, 
    createReply, 
    likeComment, 
    deleteComment, 
    addReplyToComment,
    deleteReply,
    findCommentById 
} from './comments.js';
import { renderAllComments } from './render.js';

//  Наша КОРОБКА с комментариями ( пустая пока чтоооооооо)
let comments = [];

//  Функция "НАЧАТЬ ИГРУ"
const startGame = () => {
    
    // Ищем на странице важные штуки:
    // 1. Место, где будем строить комментарии 
    const commentsList = document.getElementById('comments-list');
    // 2. Форма - где пишем новый комментарий
    const commentForm = document.getElementById('comment-form');
    // 3. Поле ввода - где печатаем текст
    const commentInput = document.getElementById('comment-input');
    
    // Если что-то не нашли - кричим "Ой!"
    if (!commentsList || !commentForm || !commentInput) {
        console.error('Ой-ой! Не нашёл где мне делать комментарии! ');
        return;
    }
    
    //  Делаем ПУЛЬТ УПРАВЛЕНИЯ для всех кнопок:
    //  кнопки на джойстике - у каждой своё задание!
    
    const gameControls = {
        //  КНОПКА "ЛАЙК" - когда нажали сердечко 
        onLikeComment: (commentId, replyId = null, isReply = false) => {
            // Если лайкнули ОТВЕТ (маленький комментарий)
            if (isReply && replyId) {
                // Ищем большой комментарий, где лежит этот ответ
                const bigComment = findCommentById(comments, commentId);
                if (bigComment) {
                    // Ищем внутри маленький ответ
                    const replyIndex = bigComment.replies.findIndex(r => r.id === replyId);
                    if (replyIndex !== -1) {
                        // Говорим: "Этому ответу +1 лайк!"
                        const updatedReply = likeComment(bigComment.replies[replyIndex]);
                        bigComment.replies[replyIndex] = updatedReply;
                        // Перерисовываем экран
                        redrawEverything();
                    }
                }
            } else {
                // Если лайкнули БОЛЬШОЙ комментарий
                // Ищем его в коробке
                const commentIndex = comments.findIndex(c => c.id === commentId);
                if (commentIndex !== -1) {
                    // Говорим: "Этому комментарию +1 лайк!"
                    comments[commentIndex] = likeComment(comments[commentIndex]);
                    // Перерисовываем экран
                    redrawEverything();
                }
            }
        },
        
        //  КНОПКА "УДАЛИТЬ" - когда нажали мусорку
        onDeleteComment: (commentId, replyId = null, isReply = false) => {
            // Если удаляем ОТВЕТ
            if (isReply && replyId) {
                // Выкидываем маленький ответ из коробки
                comments = deleteReply(comments, commentId, replyId);
            } else {
                // Если удаляем БОЛЬШОЙ комментарий
                // Выкидываем его из коробки
                comments = deleteComment(comments, commentId);
            }
            // Перерисовываем экран
            redrawEverything();
        },
        
        //  КНОПКА "ОТВЕТИТЬ" - когда нажали "Ответить"
        onReplyClick: (commentId) => {
            // Находим на экране комментарий
            const commentEl = document.querySelector(`.comment[data-id="${commentId}"]`);
            if (commentEl) {
                // Ищем внутри него форму для ответа
                const replyForm = commentEl.querySelector('.reply-form');
                //  если форма спрятана - показываем, если видна - прячем!
                replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
            }
        },
        
        //  КНОПКА "ОТПРАВИТЬ ОТВЕТ" - когда написали ответ и отправили
        onReplySubmit: (commentId, replyText) => {
            // Лепим новый маленький ответ
            const reply = createReply(commentId, replyText);
            // Приклеиваем его к большому комментарию
            comments = addReplyToComment(comments, commentId, reply);
            // Перерисовываем экран
            redrawEverything();
        }
    };
    
    // Когда пишем НОВЫЙ комментарий и нажимаем "Отправить"
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Не даём странице "прыгнуть" (перезагрузиться)
        
        // Берём то, что напечатали
        const text = commentInput.value.trim();
        
        // Если написали что-то (не пусто)
        if (text) {
            // Лепим нового человечка-комментарий
            const newComment = createComment(text);
            // Кладем его в нашу коробку
            comments.push(newComment);
            // Очищаем поле ввода (как стереть мел с доски)
            commentInput.value = '';
            // Перерисовываем экран
            redrawEverything();
        }
    });
    
    //  Функция "ПЕРЕРИСОВАТЬ ВСЁ НА ЭКРАНЕ"
    const redrawEverything = () => {
        // Говорим художнику: "Нарисуй все комментарии из коробки!"
        renderAllComments(comments, commentsList, gameControls);
        // Обновляем счётчик (сколько всего комментариев)
        updateCounter();
    };
    
    //  Функция "СЧИТАТЬ КОММЕНТАРИИ"
    const updateCounter = () => {
        // Считаем: большие комментарии + маленькие ответы
        const totalComments = comments.reduce((total, comment) => {
            return total + 1 + comment.replies.length;
        }, 0);
        
        // Находим на экране место, где пишем цифру
        const countElement = document.querySelector('.comments-count');
        if (countElement) {
            // Пишем: "5 комментариев"
            countElement.textContent = `${totalComments} комментариев`;
        }
    };
    
    //  КНОПКА "ДОБАВИТЬ ПРИМЕРЫ" (демо-данные)
    const addDemoBtn = document.getElementById('add-demo');
    if (addDemoBtn) {
        addDemoBtn.addEventListener('click', () => {
            // Берём готовые примеры комментариев (как Лего из коробки)
            const demoComments = [
                {
                    id: 1,
                    text: "Отличное видео!",
                    likes: 5,
                    replies: [
                        { id: 101, parentId: 1, text: "Согласен!", likes: 2 },
                        { id: 102, parentId: 1, text: "Спасибо!", likes: 1 }
                    ]
                },
                {
                    id: 2,
                    text: "Можешь ещё такое?",
                    likes: 3,
                    replies: []
                }
            ];
            
            // Добавляем примеры в нашу коробку
            comments = [...comments, ...demoComments];
            // Перерисовываем экран
            redrawEverything();
        });
    }
    
    //  КНОПКА "УБРАТЬ ВСЁ"
    const clearAllBtn = document.getElementById('clear-all');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            // Высыпаем всё из коробки!
            comments = [];
            // Перерисовываем экран (он будет пустой)
            redrawEverything();
        });
    }
    
    //  В начале игры - рисуем начальный экран
    redrawEverything();
};

// Когда страница полностью загрузилась - НАЧИНАЕМ ИГРУ!
document.addEventListener('DOMContentLoaded', startGame);
