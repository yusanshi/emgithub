embed();

function embed() {
  const params = (new URL(document.currentScript.src)).searchParams;
  const className = params.toString();
  const target = new URL(params.get("target"));
  const style = params.get("style");
  const isDarkStyle = style.includes("dark");
  const showLineNumbers = params.get("showLineNumbers") == "on";
  const showFileMeta = params.get("showFileMeta") == "on";
  const pathSplit = target.pathname.split("/");
  const user = pathSplit[1];
  const repository = pathSplit[2];
  const branch = pathSplit[4];
  const file = pathSplit.slice(5, pathSplit.length).join("/");
  const rawFileURL = `https://raw.githubusercontent.com/${user}/${repository}/${branch}/${file}`;

  // Reserving space for code area should be done in early time
  // or the div may not be found later
  document.write(`
  <style>.lds-ring{margin:1rem auto;position:relative;width:60px;height:60px}.lds-ring div{box-sizing:border-box;display:block;position:absolute;width:48px;height:48px;margin:6px;border:6px solid #fff;border-radius:50%;animation:lds-ring 1.2s cubic-bezier(0.5,0,0.5,1) infinite;border-color:#888 transparent transparent transparent}.lds-ring div:nth-child(1){animation-delay:-.45s}.lds-ring div:nth-child(2){animation-delay:-.3s}.lds-ring div:nth-child(3){animation-delay:-.15s}@keyframes lds-ring{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>
  <div class="${className}"><div class="lds-ring"><div></div><div></div><div></div><div></div></div></div>
  <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/highlight.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/styles/${style}.min.css">
  <link rel="stylesheet" href="https://emgithub.com/main.css">
  `);

  fetch(rawFileURL).then(function (response) {
    if (response.ok) {
      return response.text();
    }
    throw new Error(`${response.status} ${response.statusText}`);
  }).then(function (text) {
    console.log(`Succeeded in fetching ${rawFileURL}`);
    const allDiv = document.getElementsByClassName(className);
    for (let i = 0; i < allDiv.length; i++) {
      if (allDiv[i].getElementsByClassName("lds-ring").length) {
        if (typeof hljs == "undefined") {
          console.log("Trying to reload highlight.js");
          const hljsScript = document.createElement("script");
          hljsScript.onload = function () {
            console.log("Succeeded reloading highlight.js");
            embedCodeToTarget(allDiv[i], text, showLineNumbers, showFileMeta, isDarkStyle, target.href, rawFileURL);
          }
          hljsScript.src = "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/highlight.min.js";
          allDiv[i].insertAdjacentElement("afterend", hljsScript);
        } else {
          embedCodeToTarget(allDiv[i], text, showLineNumbers, showFileMeta, isDarkStyle, target.href, rawFileURL);
        }
      }
    }
  }).catch(function (error) {
    const errorMsg = `Failed to process ${rawFileURL}
Error: ${error.message}`;
    console.log(errorMsg);
    const allDiv = document.getElementsByClassName(className);
    for (let i = 0; i < allDiv.length; i++) {
      if (allDiv[i].getElementsByClassName("lds-ring").length) {
        embedCodeToTarget(allDiv[i], errorMsg, showLineNumbers, showFileMeta, isDarkStyle, target.href, rawFileURL, 'plaintext');
      }
    }
  });
}

function embedCodeToTarget(targetDiv, codeText, showLineNumbers, showFileMeta, isDarkStyle, fileURL, rawFileURL, extra_class) {
  const pre = document.createElement("pre");
  pre.setAttribute("style", "margin: 0;")
  const code = document.createElement("code");
  if (extra_class) {
    code.classList.add(extra_class);
  }
  code.textContent = codeText;
  hljs.highlightBlock(code);
  pre.appendChild(code);
  const fileContainer = document.createElement("div");
  const fileBody = document.createElement("div");
  const fileMeta = document.createElement("div");
  fileContainer.classList.add("file-container");
  fileBody.classList.add("file-body");
  if (showLineNumbers) {
    //TODO fileBody and pre
  }
  if (showFileMeta) {
    const fileURLSplit = fileURL.split("/");
    fileMeta.innerHTML = `<a target="_blank" href="${rawFileURL}" style="float:right">view raw</a>
    <a target="_blank" href="${fileURL}">${fileURLSplit[fileURLSplit.length - 1]}</a>
    Powered by <a target="_blank" href="https://emgithub.com">EmGithub.com</a>`
    fileMeta.classList.add("file-meta");
    if (!isDarkStyle) {
      fileMeta.classList.add("file-meta-light");
    } else {
      fileMeta.classList.add("file-meta-dark");
    }
  }
  fileBody.appendChild(pre);
  fileContainer.appendChild(fileBody);
  fileContainer.appendChild(fileMeta);
  targetDiv.innerHTML = "";
  targetDiv.appendChild(fileContainer);
}
