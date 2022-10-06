
# Hexships

A variant of Battleship played on a hex grid

Try it out

- [Static, single player version](https://sguest.github.io/hexships)
- [Hosted, multiplayer version](https://hexships.glitch.me) Note this is on free hosting so there may be a "wake up" delay

## FAQ

### Why a hex grid?

Because [hexagons are the bestagons](https://www.youtube.com/watch?v=thOifuHs6eY)

### Where are the letters and numbers beside the grid?

In a physical game, labelling the grid is critical to enable players to clearly communicate which square they're aiming at. In an electronic version of the game, however, you simply click/tap on the square you want and the computer takes care of the rest.

Also, mapping a coordinate system to a hexagonal grid is not entirely intuitive for a casual observer.

## Deployment

### Local build

`yarn run dev` will launch a static-file version of the site via Vite with hot module reload

`yarn run build` will build static files to the `dist` directory

`yarn start` will run a node server that serves up the static assets and proves a websocket endpoint for multiplayer. Note static assets must be build via `yarn run build` in order to be served up (`yarn run watch` recommended for developing static files while testing in server mode)

### Github Pages - static files

`yarn run publish` - Will run [publish.ts](/build/publish.ts) to build static files then push the `dist` directory to the `gh-pages` branch via git subtree

### Glitch.com - hosted version

Pull the repo on [https://glitch.com](Glitch) (only default branch is supported by the tooling) and then use the terminal to `npm run build`
