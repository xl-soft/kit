<br/>
<br/>
<div align="middle">
    <img src="https://psv4.userapi.com/c235031/u539876810/docs/d37/1e1afb8d52e2/logo.png?extra=wYozL4OsYI_0jkbpSKg4P1U5yvQGt8iak7Fu7raPEsyBGyjhHULXMqYbTyJA_XkqWdYz64iHx5TmZzXMKxjTJ62N1q5u_XzgQgZboxQq03-DFesmeupw6ob19ljL1msOAg6YCovRZ7aH2sQQgFh5nWrJhG0" height=50>
</div>

#

<h3 align="center" style="margin-bottom: 15px;">
    <strong>KIT - I can't think of an acronym, but in Russian it's a whale</strong> 
</h3>

<p align="right">
    <img src="https://psv4.userapi.com/c237231/u539876810/docs/d56/57a57bb21448/docker.png?extra=kPMpSQP4_sZBVU1idzima8IUUd_oI1RP1YqBSTMx_cb3ex-7ZvZlSf7XszV3Jij7UXFqLr-NAyKa2JafTw8MXE9QX3sqoBp3fAdSA5_RBHCinc7CN7sogu5hn5vYFr05H7B3ciOG3Meg5sGAXThkhc-llEo" />
</p>

__Ссылки:__
* <a href="#description">Description</a>
* <a href="#install">Instalation</a>
* <a href="#build">Building</a>

<h2 id="description"><strong>Description</strong></h2>

KIT - is the ready for deployment template

__Configured:__
* Docker
* NGINX SSL auto-generation
* SvelteKit
* MongoDB

<h2 id="install"><strong>Instalation</strong></h2>

Clone package from GitHub
```
gh repo clone xl-soft/kit
```

Install NPM packages
```
npm i
```

create ```.env``` file in the root folder with
```bash
DOMAIN = example.com # set default domain for ssl
MONGO_USER = exampleuser  # set username
MONGO_PASSWORD = exampleuserpassword # set password
# networking
FRONTEND_PORT = 8000
```

Change name in package.json
``` json
{
    "name": "set_project_name_here",
}
```

<h2 id="build"><strong>Building</strong></h2>

Run npm script for building / testing

```bash
# auto build and deploy
npm run compile 

# if you want only build run
npm run build

# for dev enviroment run
npm run dev
```
<div align="center" style="margin-top:50px">
  <a href="https://vk.com/xlsoftware" target="_blank" rel="noreferrer">
    <img src="https://sun9-55.userapi.com/impg/w3CcQj5NWwxbqnROSewa4pqAHzNgWubZ0LSv2g/1a5h9_xUpOs.jpg?size=1280x607&quality=96&sign=da87ca5623eb2d97f3472966b007b5f1&type=album" width=500>
  </a>
</div>

<div align="center" style="opacity: 0.2; margin-top:50px">
  <a href="https://vk.com/xlsoftware" target="_blank" rel="noreferrer">
    <img src="https://github.com/xl-soft/press-tools/raw/master/src/assets/img/powered.svg" width=150>
  </a>
</div>

