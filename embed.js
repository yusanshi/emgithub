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

  // Add Highlight.js, CSS for spinner, and reserve space for code area
  // reserving space for code area should be done earlier than loading of Highlight.js
  // To avoid `Found 0 div` problem.
  document.write(`
  <style>.lds-ring{margin:0 auto;position:relative;width:60px;height:60px}.lds-ring div{box-sizing:border-box;display:block;position:absolute;width:48px;height:48px;margin:6px;border:6px solid #fff;border-radius:50%;animation:lds-ring 1.2s cubic-bezier(0.5,0,0.5,1) infinite;border-color:#888 transparent transparent transparent}.lds-ring div:nth-child(1){animation-delay:-.45s}.lds-ring div:nth-child(2){animation-delay:-.3s}.lds-ring div:nth-child(3){animation-delay:-.15s}@keyframes lds-ring{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>
  <div class="${pathSplit.join("-")}"><div class="lds-ring"><div></div><div></div><div></div><div></div></div></div>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/styles/${style}.min.css">
  <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/highlight.min.js"></script>
  `);

  fetch(rawFile).then(function (response) {
    return response.text()
  }).then(function (text) {
    console.log(`Succeeded in fetching ${rawFile}`);
    var allDiv = document.getElementsByClassName(pathSplit.join("-"));
    for (var i = 0; i < allDiv.length; i++) {
      if (allDiv[i].getElementsByClassName("lds-ring").length) {
        var pre = document.createElement("pre");
        var code = document.createElement("code");
        code.textContent = text;
        hljs.highlightBlock(code);
        pre.appendChild(code);
        allDiv[i].innerHTML = "";
        allDiv[i].appendChild(pre);
      }
    }
  }).catch(function (error) {
    console.log(`Failed to write ${rawFile}: ${error.message}`);
    var allDiv = document.getElementsByClassName(pathSplit.join("-"));
    for (var i = 0; i < allDiv.length; i++) {
      if (allDiv[i].getElementsByClassName("lds-ring").length) {
        var pre = document.createElement("pre");
        var code = document.createElement("code");
        code.textContent = `Failed to write ${rawFile}: ${error.message}`;
        hljs.highlightBlock(code);
        pre.appendChild(code);
        allDiv[i].innerHTML = "";
        allDiv[i].appendChild(pre);
      }
    }
  });
}