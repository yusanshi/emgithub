embed();

function embed() {
  const params = (new URL(document.currentScript.src)).searchParams;
  const className = params.toString();
  const target = new URL(params.get("target"));
  const style = params.get("style");
  const lineNumbers = params.get("lineNumbers") == "on";
  const border = params.get("border") == "on";
  const fileSource = params.get("fileSource") == "on";
  const pathSplit = target.pathname.split("/");
  const user = pathSplit[1];
  const repository = pathSplit[2];
  const branch = pathSplit[4];
  const file = pathSplit.slice(5, pathSplit.length).join("/");
  const rawFile = `https://raw.githubusercontent.com/${user}/${repository}/${branch}/${file}`;

  // Reserving space for code area should be done in early time
  // or the div may not be found later
  document.write(`
  <style>.lds-ring{margin:1rem auto;position:relative;width:60px;height:60px}.lds-ring div{box-sizing:border-box;display:block;position:absolute;width:48px;height:48px;margin:6px;border:6px solid #fff;border-radius:50%;animation:lds-ring 1.2s cubic-bezier(0.5,0,0.5,1) infinite;border-color:#888 transparent transparent transparent}.lds-ring div:nth-child(1){animation-delay:-.45s}.lds-ring div:nth-child(2){animation-delay:-.3s}.lds-ring div:nth-child(3){animation-delay:-.15s}@keyframes lds-ring{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>
  <div class="${className}"><div class="lds-ring"><div></div><div></div><div></div><div></div></div></div>
  <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/highlight.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/styles/${style}.min.css">
  <link rel="stylesheet" href="https://emgithub.com/main.css">
  `);

  fetch(rawFile).then(function (response) {
    if (response.ok) {
      return response.text();
    }
    throw new Error(`${response.status} ${response.statusText}`);
  }).then(function (text) {
    console.log(`Succeeded in fetching ${rawFile}`);
    const allDiv = document.getElementsByClassName(className);
    for (let i = 0; i < allDiv.length; i++) {
      if (allDiv[i].getElementsByClassName("lds-ring").length) {
        if (typeof hljs == "undefined") {
          console.log("Trying to reload highlight.js");
          const hljsScript = document.createElement("script");
          hljsScript.onload = function () {
            console.log("Succeeded reloading highlight.js");
            embedCodeToTarget(allDiv[i], text, border, lineNumbers, fileSource, target, rawFile);
          }
          hljsScript.src = "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/highlight.min.js";
          allDiv[i].insertAdjacentElement("afterend", hljsScript);
        } else {
          embedCodeToTarget(allDiv[i], text, border, lineNumbers, fileSource, target, rawFile);
        }
      }
    }
  }).catch(function (error) {
    console.log(`Failed to process ${rawFile}: ${error.message}`);
    const allDiv = document.getElementsByClassName(className);
    for (let i = 0; i < allDiv.length; i++) {
      if (allDiv[i].getElementsByClassName("lds-ring").length) {
        embedCodeToTarget(allDiv[i], `Failed to process ${rawFile}: ${error.message}`, border, lineNumbers, fileSource, target, rawFile);
      }
    }
  });
}

function embedCodeToTarget(targetDiv, codeText, border, lineNumbers, fileSource, target, rawFile) {
  const pre = document.createElement("pre");
  pre.setAttribute("style", "margin: 0;")
  const code = document.createElement("code");
  code.textContent = codeText;
  const file = document.createElement("div");
  const fileBody = document.createElement("div");
  const fileMeta = document.createElement("div");
  hljs.highlightBlock(code);
  pre.appendChild(code);
  if (border) {
    file.classList.add("file-border");
  }
  if (lineNumbers) {
    //TODO fileBody and pre
  }
  if (fileSource) {
    // TODO fileMeta
    fileMeta.classList.add("file-meta");
  }
  fileBody.appendChild(pre);
  file.appendChild(fileBody);
  file.appendChild(fileMeta);
  targetDiv.innerHTML = "";
  targetDiv.appendChild(file);
}
