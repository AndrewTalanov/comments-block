"use strict";

const arrayComments = [];

const form = document.getElementById('form');
const list = document.querySelector('.comments-list');

const counter = document.querySelector('h3');

const inputName = document.querySelector('input[name=name]');
const inputText = document.querySelector('textarea');

const buttonSubmit = document.querySelector('button[type=submit]');

const disabled = {
    name: false,
    text: false,
}

// Убираем сообщение об ошибке, когда вводим текст
inputName.addEventListener('focus', () => hiddenError(inputName));
inputText.addEventListener('focus', () => hiddenError(inputText));

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = Date.now();

    const name = clearValue(inputName.value);
    const text = clearValue(inputText.value);

    // Если дата не введена, то получаем сегодняшнюю
    const date = new Date(document.querySelector('input[name=date]').value) == 'Invalid Date' ? new Date() : new Date(document.querySelector('input[name=date]').value);

    // Валидируем значения инпутов, в объект disabled отмечаем какие поля прошли проверку
    checkedValue(inputName, 3);
    checkedValue(inputText, 5);

    if (disabled.name && disabled.text) {

        // Получаем текущее время
        let time = new Date();
        time = `${time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}`;

        const comment = {
            id: id,
            name: name,
            time: time,
            date: date,
            text: text,
            like: false
        }

        arrayComments.unshift(comment);

        inputText.value = '';

        // Перерисовываем комментарии
        reload();
    } else {
        // Выводим ошибки
        isError();
    }
});


function isError() {

    const nameError = document.getElementById('name-error');
    const textError = document.getElementById('text-error');

    disabled.name ? nameError.classList.add('d-none') : nameError.classList.remove('d-none');
    disabled.text ? textError.classList.add('d-none') : textError.classList.remove('d-none');
}


function reload() {
    drawComments(arrayComments);
    counterComments(arrayComments);
}

function drawComments(data) {

    let commentsHTML = ''

    data.forEach(el => {

        commentsHTML += `
            <div class="comment" data-id=${el.id}>
                <div class="comment-info">
                    <p class="comment-name">${el.name}</p>
                    <div class="comment-date"><p>${getStringDay(el.date)}, ${el.time}</p> <p>${fixedDate(el.date)}</p></div>
                    <div class="comment-icons">
                        ${el.like ? '<img src="./img/like-active.svg" class="comment-like" alt="сердечко">' : '<img src="./img/like.svg" class="comment-like" alt="сердечко">'}                        
                        <img src="./img/basket.svg" class="comment-remove" alt="корзина">
                    </div>
                </div>
                <p class="comment-text">${el.text}</p>
            </div>
        `
    });

    list.innerHTML = commentsHTML;

    joinFunc();
}

function counterComments(data) {
    
    const length = data.length;
    
    if (length >= 11 && length <= 14) {
        counter.innerHTML = `${length} Комментариев`;
        return;
    }

    let lastSymbol = length.toString();
    lastSymbol = lastSymbol[lastSymbol.length - 1];

    if (lastSymbol == 1) {
        counter.innerHTML = `${length} Комментарий`;
    } else if (lastSymbol >= 2 && lastSymbol <= 4) {
        counter.innerHTML = `${length} Комментария`;
    } else if (lastSymbol >= 5 && lastSymbol <= 9) {
        counter.innerHTML = `${length} Комментариев`;
    } else if (lastSymbol == 0) {
        counter.innerHTML = `${length} Комментариев`;
    }
}

// Получаем даду в привычном нам виде
function fixedDate(date) {

    const currentDate = new Date();
    
    // если в инпуте указана дата из будущего, то меняем на текущую
    if (Date.parse(date) > Date.parse(currentDate)) {
        return new Date().toLocaleDateString('rus-RU');
    }

    return date.toLocaleDateString('rus-RU');
}

// Сегодня, вчера, недавно
function getStringDay(date) {

    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let currentDate = new Date();

    // если ввели дату из будущего, то чтоб лишний раз не считать, выводим сразу "сегодня"
    if (Date.parse(date) > Date.parse(currentDate)) {
        return 'Сегодня';
    }

    currentDate = currentDate.toString().split(' ');
    const commentDate = date.toString().split(' ');

    const currentDay = currentDate[2];
    const commentDay = commentDate[2];

    const currentMonth = month.findIndex( (el) => el == currentDate[1].toString());
    const commentMonth = month.findIndex( (el) => el == commentDate[1].toString());

    const currentYear = currentDate[3];
    const commentYear = commentDate[3];

    if (currentYear == commentYear) {
        if (currentMonth == commentMonth || currentDay - 1 == commentDay) {
            if (currentDay == commentDay) {
                return 'Сегодня';
            }
            else if (currentDay - 1 == commentDay) {
                return 'Вчера';
            }
            else if (currentDay - 1 > commentDay) {
                return 'Недавно';
            }
        } else {
            const diff = currentMonth - commentMonth;
            
            if (diff == 1) {
                return 'В прошлом месяце';
            } else {
                return `${diff} мес. назад`;
            }
        }
    } else {
        const diff = currentYear - commentYear;
            
        if (diff == 1) {
            return 'В прошлом году';
        } else {
            return `${diff} года назад`;
        }
    }
}

// После отрисовки комментариев, цепляем на каждый события
function joinFunc() {
    
    const removeButtons = document.querySelectorAll('.comment-remove');
    const likeButtons = document.querySelectorAll('.comment-like');

    removeButtons.forEach(el => el.addEventListener('click', deleteComment));
    likeButtons.forEach(el => el.addEventListener('click', likeComment));
}

function deleteComment(e) {

    const comment = e.srcElement.closest('div[data-id]');
    const id = comment.getAttribute('data-id');

    arrayComments.forEach((el, i) => {
        if (el.id == id) {
            arrayComments.splice(i, 1);
        }
    });
    
    reload();
}

function likeComment(e) {
    
    const comment = e.srcElement.closest('div[data-id]');
    const id = comment.getAttribute('data-id');

    arrayComments.forEach((el, i) => {
        if (el.id == id) {
            el.like ? el.like = false : el.like = true; 
        }
    });

    reload();
}

// чистим инпуты от тегов
function clearValue(value) {
    const regex = /( |<([^>]+)>)/ig;
    return value.replace(regex, " ");
}

function hiddenError(input) {

    const name = input.getAttribute('name');
    const messageError = document.getElementById(`${name}-error`);
    
    input.style.border = '';
    messageError.classList.add('d-none');
}

function isDisabled(name, bool) {
    disabled[name] = bool;
}

// проверяем поля по переданным параметрам
function checkedValue(input, ...params) {

    const attrName = input.getAttribute('name');
    const [length] = params;

    if (input.value.length < length) {
        input.style.border = '1px solid red';
        isDisabled(attrName, false);
    } else {
        input.style.border = '';
        isDisabled(attrName, true);
    }
}