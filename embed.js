embed();

function embed() {
  var url = new URL(document.currentScript.src);
  var target = new URL(url.searchParams.get("target"));
  var style = url.searchParams.get("style");
  var lineNumbers = url.searchParams.get("lineNumbers") == "on";
  var border = url.searchParams.get("border") == "on";
  var fileSource = url.searchParams.get("fileSource") == "on";
  var pathSplit = target.pathname.split("/");
  var user = pathSplit[1];
  var repository = pathSplit[2];
  var branch = pathSplit[4];
  var file = pathSplit.slice(5, pathSplit.length).join("/");
  var rawFile = `https://raw.githubusercontent.com/${user}/${repository}/${branch}/${file}`;

  // Add Highlight.js, CSS for spinner, and reserve space for code area
  // Reserving space for code area should be done in early time
  // or the div may not be found later
  document.write(`
  <style>.lds-ring{margin:3rem auto;position:relative;width:60px;height:60px}.lds-ring div{box-sizing:border-box;display:block;position:absolute;width:48px;height:48px;margin:6px;border:6px solid #fff;border-radius:50%;animation:lds-ring 1.2s cubic-bezier(0.5,0,0.5,1) infinite;border-color:#888 transparent transparent transparent}.lds-ring div:nth-child(1){animation-delay:-.45s}.lds-ring div:nth-child(2){animation-delay:-.3s}.lds-ring div:nth-child(3){animation-delay:-.15s}@keyframes lds-ring{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>
  <div class="${pathSplit.join("-")}"><div class="lds-ring"><div></div><div></div><div></div><div></div></div></div>
  <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/highlight.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/styles/${style}.min.css">
  `);

  fetch(rawFile).then(function (response) {
    if (response.ok) {
      return response.text();
    }
    throw new Error(`${response.status} ${response.statusText}`);
  }).then(function (text) {
    console.log(`Succeeded in fetching ${rawFile}`);
    var allDiv = document.getElementsByClassName(pathSplit.join("-"));
    for (var i = 0; i < allDiv.length; i++) {
      if (allDiv[i].getElementsByClassName("lds-ring").length) {
        var pre = document.createElement("pre");
        var code = document.createElement("code");
        code.textContent = text;
        try {
          hljs.highlightBlock(code);
          pre.appendChild(code);
          allDiv[i].innerHTML = "";
          allDiv[i].appendChild(pre);
        } catch (error) {
          console.log(error);
          console.log("Trying to reload highlight.js");
          var hljsScript = document.createElement("script");
          hljsScript.targetDiv = allDiv[i];
          hljsScript.onload = function () {
            console.log("Succeeded reloading highlight.js");
            hljs.highlightBlock(code);
            pre.appendChild(code);
            // TODO: Optimization required. 
            // If I use `allDiv[i]` directly here, error occurred, telling me that `allDiv[i]` is undefined.
            // So I have to attach it to `hljsScript` and access it with `this`. 
            // But why `pre` and `code` is available here?
            this.targetDiv.innerHTML = "";
            this.targetDiv.appendChild(pre);
          }
          hljsScript.src = "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/highlight.min.js";
          allDiv[i].insertAdjacentElement("afterend", hljsScript);
        }
      }
    }
  }).catch(function (error) {
    console.log(`Failed to process ${rawFile}: ${error.message}`);
    var allDiv = document.getElementsByClassName(pathSplit.join("-"));
    for (var i = 0; i < allDiv.length; i++) {
      if (allDiv[i].getElementsByClassName("lds-ring").length) {
        var pre = document.createElement("pre");
        var code = document.createElement("code");
        code.textContent = `Failed to process ${rawFile}: ${error.message}`;
        pre.appendChild(code);
        allDiv[i].innerHTML = "";
        allDiv[i].appendChild(pre);
      }
    }
  });
}
