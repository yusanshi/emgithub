# emgithub

https://emgithub.com/

Embed a file from GitHub repository just like [GitHub Gist](https://gist.github.com/).

Demo: <https://yusanshi.com/posts/2019-12-17/emgithub/> (scroll to the bottom of the page).

![](https://user-images.githubusercontent.com/36265606/185886623-f5f5685d-1e99-43c8-8de2-085dd6954dd7.gif)

## Get started

There are two ways to use the service:

1. Go to https://emgithub.com/ and paste the URL.
2. Open a file in GitHub and simply add "em" before "github.com" in the address bar.

**ProTip**

- Support permanent links to [a file](https://docs.github.com/en/github/managing-files-in-a-repository/getting-permanent-links-to-files) or [a code snippet](https://docs.github.com/en/github/managing-your-work-on-github/creating-a-permanent-link-to-a-code-snippet) (use `#` to slice code).

- Specify TAB width with `?ts=`. Note when used together with code slicing, you should combine them like this: `?ts=2#L4-L12`.
- Support Markdown (`*.md`) and Jupyter Notebook (`*.ipynb`) rendering.
- If the preview in https://emgithub.com/ is OK but it looks strange when embedded into the target web page, chances are that the styles are overridden by the target web page. In this case, you may need to write some CSS styles to fix it (and `!important` may be needed). Below is the skeleton for embedding which may be helpful for writing CSS styles.

  ```html
  <div class="emgithub-container">
    <div class="emgithub-file">
      <div class="file-data">
        <div class="code-area">
          <!-- for regular code embedding -->
          <a class="copy-btn">Copy</a>
          <pre>
            <code>
              <!-- code content -->
          </code>
        </pre>
        </div>
  
        <div class="html-area markdown-body">
          <!-- for Markdown/Jupyter Notebook  -->
        </div>
      </div>
  
      <div class="file-meta">
        <!-- footer -->
      </div>
    </div>
  </div>
  ```

## Development

You can modify the code and test it by launching an HTTP server in the project directory.

1. Launch an HTTP server.
   ```bash
   git clone https://github.com/yusanshi/emgithub
   cd emgithub
   python -m http.server 8086
   ```
2. Make the changes.
3. Visit <http://localhost:8086/404.html>.
   
   > Don't be confused by the "404". It is how the "adding em in the address bar" works: after adding the "em", the HTTP server (provided by GitHub Pages) can't find the file so it renders `404.html`. Then in the 404 page, the target file is extracted from the URL.

## Create your own emgithub

You may want to create your own **emgithub** for some reasons, like:

- To fit your personal needs.
- For security. Say if <https://emgithub.com/> is hacked...
- For stability. There may be some breaking changes with <https://emgithub.com/> (although I'm trying to avoid this, e.g., when there are major changes, `embed-v2.js`, `embed-v3.js` ... are used. In this way, the former embeddings are not influenced).

To do this, you can use either GitHub Pages or your own web server.

### Use GitHub Pages

If you choose to use GitHub Pages just like <https://emgithub.com/> does, you can fork the project and remove the `CNAME` file. Then go to `Your repository - Settings - GitHub Pages` to setup a custom domain or simply use `username.github.io`.

### Use your own web server

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

- [Highlight.js](https://github.com/highlightjs/highlight.js/) - Javascript syntax highlighter.
- [highlightjs-line-numbers.js](https://github.com/wcoder/highlightjs-line-numbers.js) - Highlight.js line numbers plugin.
- [marked](https://github.com/markedjs/marked) - Markdown parser.
- [github-markdown-css](https://github.com/sindresorhus/github-markdown-css) - GitHub Markdown style.
- [notebookjs](https://github.com/jsvine/notebookjs) - Jupyter/IPython notebooks render.
- [Loading.io](https://loading.io/) - Loading animation.
- [GitHub Corners](https://github.com/tholman/github-corners).
- Icons made by [Vectors Market](https://www.flaticon.com/authors/vectors-market) and [Dave Gandy](https://www.flaticon.com/authors/dave-gandy) from [www.flaticon.com](https://www.flaticon.com/).
