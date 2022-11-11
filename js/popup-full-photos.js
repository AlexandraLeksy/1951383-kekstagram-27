import {isEscapeKey} from './util.js';

// Число прогружаемых комментариев
const COUNT_LOAD_COMMENT = 5;

// "боди" сайта
const body = document.querySelector('body');
// Фото крупным планом
const bigPicture = document.querySelector('.big-picture');
// Кнопка "закрыть" фото
const cancelBigPicture = bigPicture.querySelector('.big-picture__cancel');

const bigPreview = document.querySelector('.big-picture__img img');
const bigLikes = bigPicture.querySelector('.likes-count');
// Общий счетчик комментариев
const commentsCount = bigPicture.querySelector('.comments-count');
// Кнопка "Загрузить еще"
const commentsLoader = bigPicture.querySelector('.comments-loader');
// Список комментариев к фото
const commentsList = bigPicture.querySelector('.social__comments');
// Шаблон комментария
const commentTemplate = bigPicture.querySelector('.social__comment');
// Счетчик загруженных комментариев
const counterLoadComment = bigPicture.querySelector('.social__comment-count');
// Описание большого фото
const bigDescription = bigPicture.querySelector('.social__caption');


// Очищение данных
const clearPictureCommentsData = () => {
  commentsList.innerHTML = '';
};

// Функция для слушателя при нажатии Esc
const onPopupEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPhoto();
  }
};

// Функция для закрытия
function closeBigPhoto () {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
  clearPictureCommentsData();

  // Удаляем слушатель копки закрытия
  cancelBigPicture.removeEventListener('click', closeBigPhoto);
  // Удаляем слушатель Esc
  document.removeEventListener('keydown', onPopupEscKeydown);
  // Удаляем слушатель кнопки "Загрузить еще"
  commentsLoader.removeEventListener('click', closeBigPhoto);
  // Очищаем данные
  clearPictureCommentsData ();
}

// Функция для создания комментария
const createComment = ({avatar, name, message}) => {
  // Копирование комментария для наполнения
  const newComment = commentTemplate.cloneNode(true);

  // Нашли картинку по классу
  const imgComments = newComment.querySelector('.social__picture');
  // Нашли абзац по классу
  const textComments = newComment.querySelector('.social__text');
  // Наполнение данными из массива
  imgComments.src = avatar;
  imgComments.alt = name;
  textComments.textContent = message;

  // Навешиваем каждому комментарию класс hidden
  newComment.classList.add('hidden');
  // Получаем комментарий
  return newComment;
};

// Функция для скрытия кнопки "Загрузить еще"
// В функцию попадают "скрытые" комментарии
const hideButtonShowMore = (hiddenComments) => {
  // Если их длина меньше 5
  if (hiddenComments.length <= COUNT_LOAD_COMMENT) {
    // Кнопка скрывается
    commentsLoader.classList.add('hidden');
  }
};

// Функция для показа пяти комментариев
const showMore = () => {
  // Находим все спрятанные комментарии в списке
  const hidden = commentsList.querySelectorAll('.hidden');
  // Запускаем цикл, который крутится пока счетчик меньше 5 комментариев
  // и меньше кол-ва скрытых комментариев
  for (let i = 0; i < COUNT_LOAD_COMMENT && i < hidden.length; i++) {
    // У каждого элемента убираем класс hidden
    hidden[i].classList.remove('hidden');
  }
  // И скрываем кнопку
  hideButtonShowMore(hidden);
};

// "живая" строка загруженных комментариев
const liveCommentCounter = () => {
  counterLoadComment.textContent = `${commentsCount.textContent - commentsList.querySelectorAll('.hidden').length} из ${commentsCount.textContent} комментариев`;
};

// Функция для показа комментариев
const onClickUploadComment = (evt) => {
  evt.preventDefault();
  showMore();
  liveCommentCounter();
};

// Функция при открытии окна
const openBigPhoto = ({ url, likes, comments, description }) => {
  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');
  commentsLoader.classList.remove('hidden');

  // Наполнение данными
  bigPreview.src = url;
  bigLikes.textContent = likes;
  commentsCount.textContent = comments.length;
  bigDescription.textContent = description;

  // Очищаем форму
  clearPictureCommentsData();
  // Создаем фрагмент
  const commentsListFragment = document.createDocumentFragment();

  // Цикл для создания списка комментариев
  for (let i = 0; i < comments.length; i++) {
    // Пока счетчик i не дойдет до общего кол-ва комментариев генерим комментарии
    // Добавляем их в список
    const newComment = createComment(comments[i]);
    // Затем список добавляем в созданный ранее объект
    commentsListFragment.append(newComment);
  }

  // Объект присоединяем в список
  commentsList.append(commentsListFragment);

  // Вызываем функцию для показа пяти комментариев
  showMore();
  // Добавляем строку со счетчиками комментариев
  liveCommentCounter();

  // Добавляем слушатели
  // Cлушатель для кнопки-крестика
  cancelBigPicture.addEventListener('click', closeBigPhoto);
  // Слушатель для кнопки Esc
  document.addEventListener('keydown', onPopupEscKeydown);
  // Cлушатель для кнопки "Загрузить еще"
  commentsLoader.addEventListener('click', onClickUploadComment);
};

export { openBigPhoto };

