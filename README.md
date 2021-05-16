# UN_webpage
Company home page


### generate minified css files
>npm install -g sass postcss postcss-cli autoprefixer

>sass assets/SASS/main/main.scss:assets/css/style.min.css --style=compressed && postcss assets/css/style.min.css --replace --use autoprefixer