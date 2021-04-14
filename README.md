# Embed Like Gist

https://emgithub.com/

Embed a file from Github repository just like [Github Gist](https://gist.github.com/). Unlike other websites that do similar work, EmGithub.com is a static site hosted on Github Pages. Fetching target files and highlighting are done on your browser.

Related post: https://blog.yusanshi.com/2019-12-17-emgithub/

## Get started

There are two ways to use the service.

Supposed you want to embed the file `https://github.com/pytorch/pytorch/blob/master/torch/nn/cpp.py`. The first way is to visit https://emgithub.com/ and paste the URL. The other is to simply add "em" before "github.com". For this `cpp.py` file, you edit URL into `https://emgithub.com/pytorch/pytorch/blob/master/torch/nn/cpp.py`, then press Enter.

Permanent links to [a file](https://docs.github.com/en/github/managing-files-in-a-repository/getting-permanent-links-to-files) or [a code snippet](https://docs.github.com/en/github/managing-your-work-on-github/creating-a-permanent-link-to-a-code-snippet) are supported.

**ProTip**

- Use `#` to slice code, use `?ts=` to specify TAB width. An example using both of them: `?ts=2#L4-L12`.
- The outermost div has a class attribute `emgithub-container`. Do any hacks you want.

![](https://user-images.githubusercontent.com/36265606/114659094-8a070a00-9d25-11eb-9164-779e91f3ae46.gif)

## TODO

- [x] Support more styles
- [x] Check input
- [x] Show spinner while loading
- [x] Add metadata
- [x] Line count
- [x] Remember options using localStorage
- [x] Code slice
- [ ] Different styles in one page

PR is always welcomed.

## Development

### Test

You can modify the code and test it by launching an HTTP server in the project directory.

1. Launch an HTTP server.

   ```bash
   git clone https://github.com/yusanshi/embed-like-gist
   cd embed-like-gist
   python -m http.server 8086
   ```

2. Make the changes.

3. To test the 404 page, visit <http://localhost:8086/404.html>.

   > Don't be confused by the "404". It is how the "adding em in address bar" works: after adding the "em", the HTTP server (provided by GitHub Pages) can't find the file so it renders `404.html`.

4. To test the real performance when the code is embedded, create a simple HTML file `test.html` in the project root directory like this:

   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>Test</title>
     </head>
     <body style="padding:5rem">
       <h1>JavaScript, All options on</h1>
       <script src="http://localhost:8086/embed.js?target=https%3A%2F%2Fgithub.com%2Fyusanshi%2Fembed-like-gist%2Fblob%2Fmaster%2Fembed.js&style=github&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>
       <br />
       <h1>Plain text, All options off</h1>
       <script src="http://localhost:8086/embed.js?target=https%3A%2F%2Fgithub.com%2Fyusanshi%2Fembed-like-gist%2Fblob%2Fmaster%2FLICENSE&style=github"></script>
       <br />
       <h1>Add more examples yourself...</h1>
     </body>
   </html>
   ```

   Then visit <http://localhost:8086/test.html>.

## Create your own project

You may want to create your own **embed-like-gist** for some reasons, like:

- To fit your personal needs.
- For security. Say if <https://emgithub.com/> is hacked...
- For stability. There may be some breaking changes with <https://emgithub.com/> (I will try to avoid this, but can't make a guarantee).

To do this, you should decide the server to use.

### Use GitHub Pages

If you choose to use GitHub Pages just like <https://emgithub.com/> does, you can fork the project and remove the `CNAME` file. Then go to `Your repository - Settings - GitHub Pages` to setup a custom domain or simply use `username.github.io`.

### Use own web server

If you choose to use your own web server, such as Apache and Nginx, the most important thing to do is to configure the server to serve `404.html` for a not-found request.

For example, here is a simple configuration without HTTPS for Nginx:

```nginx
server {
  listen 80;
  listen [::]:80;

  server_name your_domain.com;

  root /var/www/project_directory;

  location / {
    try_files $uri /404.html;
  }
}
```

## Credits

- [Highlight.js](https://github.com/highlightjs/highlight.js/) - Javascript syntax highlighter;
- [highlightjs-line-numbers.js](https://github.com/wcoder/highlightjs-line-numbers.js) - Highlight.js line numbers plugin;
- [PostScribe](https://github.com/krux/postscribe) - Asynchronously write javascript;
- Icons made by [Vectors Market](https://www.flaticon.com/authors/vectors-market) and [Dave Gandy](https://www.flaticon.com/authors/dave-gandy) from [www.flaticon.com](https://www.flaticon.com/);
- Loading animation by [Loading.io](https://loading.io/);
- CSS style based on [GitHub syntax theme generators](https://github.com/primer/github-syntax-theme-generator);
- [GitHub Corners](https://github.com/tholman/github-corners).
