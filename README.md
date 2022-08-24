[![Tests for sprint 13](https://github.com/acherrry/express-mesto-gha/actions/workflows/tests-13-sprint.yml/badge.svg)](https://github.com/acherrry/express-mesto-gha/actions/workflows/tests-13-sprint.yml) [![Tests for sprint 14](https://github.com/acherrry/express-mesto-gha/actions/workflows/tests-14-sprint.yml/badge.svg)](https://github.com/acherrry/express-mesto-gha/actions/workflows/tests-14-sprint.yml)
# Проект Mesto фронтенд + бэкенд

## О проекте
В текущей проектной работе я начала разрабатывать бэкенд (сервер) проекта Mesto.
В app.js выполнено подключение к серверу MongoDB. Имя созданной базы данные - mestodb.
В проекте две сущности: пользователь и карточки. Созданы схемы и модели для каждой сущности.
Созданы контроллеры и роуты для пользователей и карточек.

Приложение корректно обрабатывает запросы по следующим роутам:
`GET /users` — возвращает всех пользователей из базы;
`GET /users/:userId` — возвращает пользователя по _id ;
`POST /users` — создаёт пользователя с переданными в теле запроса name , about и avatar ;
`PATCH /users/me` — обновляет профиль пользователя;
`PATCH /users/me/avatar` — обновляет аватар пользователя;
`GET /cards` — возвращает все карточки из базы;
`POST /cards` — создаёт карточку с переданными в теле запроса name и link , устанавливает поле owner для карточки;
`DELETE /cards/:cardId` — удаляет карточку по _id ;
`PUT /cards/:cardId/likes` — ставит лайк карточке;
`DELETE /cards/:cardId/likes` — убирает лайк с карточки.

В случаях, если при запросе что-то идет не так — возвращается соответствующий код ошибки:
400 — переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля;
404 — карточка или пользователь не найден.
500 — ошибка по-умолчанию.

## Директории проекта

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки   
`/models` — папка с файлами описания схем пользователя и карточки  

## Запуск проекта

`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload
`npm run lint` — запускает сервер линтер (линтер отлавливает ошибки и следит за единообразием кода)
