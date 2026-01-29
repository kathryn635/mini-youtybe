//  ХУДОЖНИК - он берёт комментарии и РИСУЕТ их на странице!
//Функция renderComment - рисует ОДИН комментарий

// Получает: комментарий + что делать при кликах
// Возвращает: готовый HTML 
export const renderComment = (comment, onLike, onReply, onDelete, onReplySubmit) => {
    
    // 1. Делаем главную КОРОБКУ для комментария
    const commentEl = document.createElement('div');
    commentEl.className = 'comment';                 // Называем её "comment"
    commentEl.dataset.id = comment.id;             
    
    // 2. Делаем БУМАЖКУ с текстом комментария
    const textEl = document.createElement('p');
    textEl.className = 'comment-text';
    textEl.textContent = comment.text;            
    
    // 3. Делаем КОРОБОЧКУ для кнопок
    const actionsEl = document.createElement('div');
    actionsEl.className = 'comment-actions';
    
    // 4. Кнопка ЛАЙК 
    const likeBtn = document.createElement('button');
    likeBtn.className = 'like-btn';
    likeBtn.textContent = ` Лайк (${comment.likes})`;
    likeBtn.addEventListener('click', () => {
        onLike(comment.id);  
    });
    
    // 5. Кнопка ОТВЕТИТЬ
    const replyBtn = document.createElement('button');
    replyBtn.className = 'reply-btn';
    replyBtn.textContent = 'Ответить';
    replyBtn.addEventListener('click', () => {
        onReply(comment.id);  // Говорим: "Хочу ответить на этот комментарий!"
    });
    
    // 6. Кнопка УДАЛИТЬ 🗑️
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Удалить';
    deleteBtn.addEventListener('click', () => {
        onDelete(comment.id);  // Говорим: "Удалить этот комментарий!"
    });
    
    // 7. Кладём все кнопки в коробочку
    actionsEl.appendChild(likeBtn);
    actionsEl.appendChild(replyBtn);
    actionsEl.appendChild(deleteBtn);
    
    // 8. ПОМЕЩЕНИЕ для ответов 
    const repliesContainer = document.createElement('div');
    repliesContainer.className = 'replies';
    
    // 9. Делаем ФОРМУ для ответа 
    const replyForm = document.createElement('div');
    replyForm.className = 'reply-form';
    replyForm.style.display = 'none';  
    
    // Поле для ввода текста ответа
    const replyInput = document.createElement('input');
    replyInput.type = 'text';
    replyInput.placeholder = 'Напишите ответ...';
    
    // Кнопка ОТПРАВИТЬ ответ
    const submitReplyBtn = document.createElement('button');
    submitReplyBtn.textContent = 'Отправить';
    submitReplyBtn.addEventListener('click', () => {
        const replyText = replyInput.value.trim();  // Берём текст
        if (replyText) {  // Если не пусто
            onReplySubmit(comment.id, replyText);  // Отправляем
            replyInput.value = '';  // Очищаем поле
            replyForm.style.display = 'none';  // Прячем форму
        }
    });
    
    // Кнопка ОТМЕНА
    const cancelReplyBtn = document.createElement('button');
    cancelReplyBtn.textContent = 'Отмена';
    cancelReplyBtn.addEventListener('click', () => {
        replyForm.style.display = 'none';  // Просто прячем форму
    });
    
    // Кладём всё в форму
    replyForm.appendChild(replyInput);
    replyForm.appendChild(submitReplyBtn);
    replyForm.appendChild(cancelReplyBtn);
    
    // 10. Собираем ВСЁ в главную коробку:
    commentEl.appendChild(textEl);            // Текст
    commentEl.appendChild(actionsEl);         // Кнопки
    commentEl.appendChild(repliesContainer);  // Место для ответов
    commentEl.appendChild(replyForm);         // Форма ответа
    
    // 11. Если уже есть ответы - рисуем их тоже!
    if (comment.replies && comment.replies.length > 0) {
        // Для каждого ответа...
        comment.replies.forEach(reply => {
            // Рисуем ответ (ниже есть функция renderReply)
            const replyEl = renderReply(reply, comment.id, onLike, onDelete);
            // Кладём ответ в помещение для ответов
            repliesContainer.appendChild(replyEl);
        });
    }
    
    // 12. Возвращаем готовую коробку с комментарием!
    return commentEl;
};

//  Функция renderReply - рисует ОДИН ответ на комментарий
// Ответ похож на комментарий, но проще!
export const renderReply = (reply, parentId, onLike, onDelete) => {
    
    // 1. Делаем коробку для ответа
    const replyEl = document.createElement('div');
    replyEl.className = 'reply';
    replyEl.dataset.id = reply.id;            // Номер ответа
    replyEl.dataset.parentId = parentId;      // Номер родительского комментария
    
    // 2. Бумажка с текстом ответа
    const textEl = document.createElement('p');
    textEl.className = 'reply-text';
    textEl.textContent = reply.text;
    
    // 3. Коробочка для кнопок (только лайк и удалить)
    const actionsEl = document.createElement('div');
    actionsEl.className = 'reply-actions';
    
    // 4. Кнопка ЛАЙК  для ответа
    const likeBtn = document.createElement('button');
    likeBtn.className = 'like-btn';
    likeBtn.textContent = `Лайк (${reply.likes})`;
    likeBtn.addEventListener('click', () => {
        // Говорим: "Этот ответ понравился!" (true = это ответ, не комментарий)
        onLike(parentId, reply.id, true);
    });
    
    // 5. Кнопка УДАЛИТЬ 🗑️ для ответа
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Удалить';
    deleteBtn.addEventListener('click', () => {
        // Говорим: "Удалить этот ответ!" (true = это ответ)
        onDelete(parentId, reply.id, true);
    });
    
    // 6. Кладём кнопки в коробочку
    actionsEl.appendChild(likeBtn);
    actionsEl.appendChild(deleteBtn);
    
    // 7. Собираем ответ:
    replyEl.appendChild(textEl);     // Текст
    replyEl.appendChild(actionsEl);  // Кнопки
    
    // 8. Возвращаем готовый ответ!
    return replyEl;
};

//  Функция renderAllComments - рисует ВСЕ комментарии сразу!
export const renderAllComments = (comments, container, callbacks) => {
    
    // 1. Очищаем место на странице (выкидываем старые рисунки)
    container.innerHTML = '';
    
    // 2. Для КАЖДОГО комментария в списке...
    comments.forEach(comment => {
        // 3. Рисуем этот комментарий
        const commentEl = renderComment(
            comment,                     // Сам комментарий
            callbacks.onLikeComment,    // Что делать при лайке
            callbacks.onReplyClick,     // Что делать при нажатии "Ответить"
            callbacks.onDeleteComment,  // Что делать при удалении
            callbacks.onReplySubmit     // Что делать при отправке ответа
        );
        
        // 4. Кладём нарисованный комментарий на страницу
        container.appendChild(commentEl);
    });
};

