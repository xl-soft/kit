# sveltekit-docker-mongo-template

## Instalation

Clone package from GitHub
```
gh repo clone xl-soft/sveltekit-docker-mongo-template
```

Install NPM packages
```
npm i
```

create ```.env``` file in the root folder with
```bash
DOMAIN = typostudio.ru # set default domain for ssl
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

Compile project 

```bash
# auto build and deploy
npm run compile 

# if you want only build run
npm run build

# for dev enviroment run
npm run dev
```
