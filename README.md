# Project template

After clonning project throw git hub into your repository, you need use cd and go to the current directory, when you should write
`npm install` in the command promt. After that you need paste this command into comand promt: `npm install --save-dev sass` and 
one more command `npm run compile`. Next command using for build a server`npm install --save-dev concurrently live-server` and
for ability to use `npm run dev` to build a project at all by using only to commands with `npm install`.

Also for working all of this scripts, need to add into package.json, next script:
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "compile": "sass src/scss:dist/css --no-source-map",
    "watch": "sass --watch src/scss/css --no-source-map",
    "serve": "live-server . --open=src/index.html",
    "dev": "npm run compile && concurrently -k 'npm:watch' 'npm'"
  }

Also I used this comand for check quality of the project:
`npm install --save-dev eslint @eslint/js globals stylelint stylelint-config-standard-scss`

And for this i create 2 new files: stylelint.config.mjs and eslint.config.mjs.
After that i changed scripts section in package.json:
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "compile": "sass src/scss:dist/css --no-source-map",
    "watch": "sass --watch src/scss:dist/css --no-source-map",
    "serve": "live-server . --open=src/index.html",
    "dev": "npm run compile && concurrently -k 'npm:watch' 'npm:serve'",
    "lint": "npm run lint:js && npm run lint:scss",
    "lint:js": "eslint \"src/js/**/*.js\"",
    "lint:scss": "stylelint \"src/scss/**/*.scss\" --config stylelint.config.mjs",
    "lint:fix": "eslint \"src/js/**/*.js\" --fix && stylelint \"src/scss/**/*.scss\" --config stylelint.config.mjs --fix"
  }

And used command `npm run lint`. 

