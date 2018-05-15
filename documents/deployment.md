# Document deployment
## Config source code:
### Frontend:
- Config port url call server in file: /frontend/src/app/app.constants.ts line 9, with variable const SERVER_API_URL (default = 3002)
### Server:
- Config port run server infile: /server/config/config.js line 1, with const SERVER_PORT (default = 3002).
## Setting on server Ubuntu 16.04:
- Install Nodejs v8.11.1 LTS
- Install Mongodb
- Install Nginx 1.10.3 or lastest.
## Deploy development:
### Deploy Frontend:
- Access to the directory /frontend: cd frontend
- Install yarn package: npm install -g yarn
- Install all package in file package.json: yarn
- Run Frontend with development environment: yarn start
### Deploy Server:
- Access to the dicrectory /server: cd server
- Install all package in file package.json: yarn
- Rund Server with development environment: yarn start
## Deploy production:
### Deploy Frontend:
- Access to the directory /frontend: cd frontend
- Build for production: yarn build when build done source code build in folder: frontend/target/www
- Setting nginx: sudo nano /etc/nginx/nginx.conf add command in block htttp:
```javascript
server {
    listen       8000;
    listen       [::]:8000;
    server_name  elapay.io;
    root         /home/elapay/frontend/target/www;

    location / {
        root /home/elapay/frontend/target/www;
        index index.html index.html;
        try_files $uri $uri/ /index.html =404;
    }
}
```
### Deploy Server:
- Access to the dicrectory /server: cd server
- Install pm2 process manager: npm install -g pm2
- Run production with pm2 process: pm2 start index.js --interpreter ./node_modules/.bin/babel-node



