embed();

function embed() {
  var url = new URL(document.currentScript.src);
  var target = new URL(url.searchParams.get("target"));
  var pathSplit = target.pathname.split("/");
  var user = pathSplit[1];
  var repository = pathSplit[2];
  var branch = pathSplit[4];
  var file = pathSplit.slice(5, pathSplit.length).join("/");
  var rawFile = `https://raw.githubusercontent.com/${user}/${repository}/${branch}/${file}`;

  document.write(`<div class="${pathSplit.join("-")}"></div>`);

  fetch(rawFile).then(function (response) {
    return response.text()
  }).then(function (text) {
    var allDiv = document.getElementsByClassName(pathSplit.join("-"));
    for (var i = 0; i < allDiv.length; i++) {
      // Avoid duplicate when the same code is embeded more than once
      if (!allDiv[i].hasChildNodes()) {
        allDiv[i].innerHTML = `
        <link rel="stylesheet" href="https://github.githubassets.com/assets/gist-embed-123720f37c57ce9a8f29de081c38ed61.css">
        <div class="gist">
          <div class="gist-file">
            <div class="gist-data">
              <div class="js-gist-file-update-container js-task-list-container file-box">
                <div class="file">
                  <div itemprop="text" class="Box-body p-0 blob-wrapper data">
                    <table class="highlight tab-size js-file-line-container" data-tab-size="8">
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="gist-meta">
              <a target="_blank" href="${rawFile}" style="float:right">view raw</a>
              <a target="_blank" href="${target.href}">${pathSplit[pathSplit.length - 1]}</a>
              hosted with &#10084; by <a target="_blank"
                href="https://emgithub.com/">EmGithub.com</a>
            </div>
          </div>
        </div>
        `;

        allDiv[i].getElementsByClassName("js-file-line-container")[0].appendChild(document.createTextNode(text));
      }
    };
  }).catch(function (error) {
    var allDiv = document.getElementsByClassName(filter(rawFile));
    for (var i = 0; i < allDiv.length; i++) {
      if (!allDiv[i].hasChildNodes()) {
        allDiv[i].appendChild(document.createTextNode(`Failed to fetch ${rawFile}: ${error.message}`));
      }
    };
  });
}