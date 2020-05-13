<h1 align="center">
  guterpodcast.de
 </h1>

Listen to a Spotify podcast with integrated music, links & infos.
This repository is (at the moment) specifically for the podcast Fest & Flauschig.


## :radio: general.

This web app uses the Spotify Web Playback SDK to play podcasts and songs in the browser. If the SDK is not available on the current device it uses the Spotify API as a fallback to controll Spotify on any other Device. All infos, links & songs were manually created and are stored in an Airtable. Basically this app interrupts the current podcast at a specified time to play songs. When the songs are over it will again play the podcast, but now starting at the point where it was interrupted.

## :computer: development.

To debug/run this repository in your local environment you can choose between using Yarn or Vercel CLI.

### yarn.

Install and setup [Yarn](https://yarnpkg.com/getting-started/install), a package manager for JavaScript node modules. 

Setup
```
yarn install
```

Compiles and hot-reloads for development
```
yarn serve
```

Compiles and minifies for production
```
yarn build
```

Lints and fixes files
```
yarn lint
```

### vercel cli.

**Disclaimer**: This only make sense if you have a Vercel Account and if you plan to use you own data. Please inform yourself about the company and their terms of service before creating an account or using their software.

Install and setup [Vercel CLI](https://vercel.com/download)

Setup
```
now
```

Compiles and hot-reloads for development
```
now dev
```
