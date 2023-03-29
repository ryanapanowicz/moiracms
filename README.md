<p align="center"><img src="https://raw.githubusercontent.com/ryanapanowicz/moiracms/main/client/src/assets/svg/moira-logo.svg" width="150"></p>

<p align="center">
    <a href="https://laravel.com/"><img src="https://img.shields.io/badge/laravel-10.5.0-blue" alt="laravel 10.5.0"></a>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/react-18.2.0-blue" alt="react 18.2.0"></a>
    <a href="https://ant.design/"><img src="https://img.shields.io/badge/antd-5.2.0-blue" alt="antd 5.2.0"></a>
</p>

## About Moira CMS

Moira CMS is a simple headless CMS powered by Laravel, GraphQL, React, and Ant Design.

> **Note:** This project was created as a way for me to better learn React, GraphQL, and Ant Design. Moira CMS GraphQL API uses [Lighthouse](https://github.com/nuwave/lighthouse) for the Laravel backend and [Apollo](https://github.com/apollographql/apollo-client) for the React Admin frontend. Moira CMS is currently configured to be used as a portfolio SPA.

- GraphQL API for managing User, Roles, Permissions, Media, and Projects.
- React powered Admin frontend.
- Media upload and management through GraphQL API.

### Installation

#### Laravel Backend Install
- Run ```cp .env.example .env```
- Run ```composer install```
- Run ```npm install```
- Run ```npm dev``` or ```npm run build```
- Add database name, username and password in .env
- Run ```php artisan moiracms:install``` and follow prompts.
- Run ```php artisan serve```

You can interact with the GraphQL API in a development environment by visiting http://localhost:8000/graphiql

#### Admin Frontend Install
- Run ```cd client```
- Run ```npm install```
- Run ```npm start``` or ```npm run build``` for a production build.

## License

Moira CMS is a open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
