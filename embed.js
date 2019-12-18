embed();

function embed() {
  var url = new URL(document.currentScript.src);
  var target = new URL(url.searchParams.get("target"));
  var style = url.searchParams.get("style");
  var pathSplit = target.pathname.split("/");
  var user = pathSplit[1];
  var repository = pathSplit[2];
  var branch = pathSplit[4];
  var file = pathSplit.slice(5, pathSplit.length).join("/");
  var rawFile = `https://raw.githubusercontent.com/${user}/${repository}/${branch}/${file}`;

  // For Highlight.js
  document.write(`
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/styles/${style}.min.css">
  <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/highlight.min.js"></script>
  `);

  // Reserve space for code
  document.write(`<div class="${pathSplit.join("-")}"></div>`);

  fetch(rawFile).then(function (response) {
    return response.text()
  }).then(function (text) {
    console.log(`Succeeded in fetching ${rawFile}`);
    var allDiv = document.getElementsByClassName(pathSplit.join("-"));
    console.log(`Found ${allDiv.length} div`);
    for (var i = 0; i < allDiv.length; i++) {
      // Avoid duplicate when the same code is embeded more than once
      if (!allDiv[i].hasChildNodes()) {
        allDiv[i].innerHTML = `<pre><code>${text}</code></pre>`;
        hljs.highlightBlock(allDiv[i]);
        console.log(`Code "${text.slice(0, 30)}..." is written and highlighted`);
      } else {
        console.log(`Child detected. Skipp writing code "${text.slice(0, 30)}..."`);
      }
    };
  }).catch(function (error) {
    console.log(`Fail to fetch ${rawFile}: ${error.message}`);
    var allDiv = document.getElementsByClassName(pathSplit.join("-"));
    for (var i = 0; i < allDiv.length; i++) {
      if (!allDiv[i].hasChildNodes()) {
        allDiv[i].innerHTML = `<pre><code>Failed to fetch ${rawFile}: ${error.message}</code></pre>`;
        hljs.highlightBlock(allDiv[i]);
      }
    };
  });
}