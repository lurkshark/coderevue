# Hilo Guessing Game

A simple JavaScript guessing game that can be installed as a progressive-web-application on your mobile phone. Follow along with the tutorials on CodeREVUE.net to learn more about how this all fits together. Feel free to open an issue if you run into any issues.

- [Create a scene system for PixiJS](https://coderevue.net/posts/create-scene-system-pixijs/)

## Local Develpment

This project uses a `docker-compose` build container to simplify dependencies. You'll need to have Docker Desktop installed to use the following commands. If you'd rather use your own machine then just run the `npm` commands directly.

### Install Dependencies

This needs to be done once before continuing.

```sh
docker-compose run development npm install
```

### Develpment Server

This will launch a local development server accessible at http://localhost:8080 with a hot-module-reload connection on port 8081. If you need to modify these ports you'll need to make a change to the `docker-compose.yml` and `package.json` files.

```sh
docker-compose run --service-ports development npm start
```

### Build

This will build a poduction-ready bundle in the `dist` directory that can be uploaded to your server.

```sh
docker-compose run development npm build
```

### Clean

```sh
docker-compose run development npm clean
docker-compose down --remove-orphans
```
