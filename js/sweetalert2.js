function addRowHandlers() {
  $( "table tr" ).click(function() {
    if($(this).find("td a.source-link").length){
      var rawlink = $(this).find("td a.source-link").attr("href");
      var xhr = new XMLHttpRequest();

      function xhr2json(url, callback) {
        xhr.open("GET", url, true);
        xhr.onload = function (e) {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              callback(JSON.parse(xhr.responseText));
            } else {
              console.error(xhr.statusText);
            }
          }
        };
        xhr.send(null);
      }

      function ajaxLoad(url, spanId, attr) {
        $.ajax({url: url, success: function(result){
          $(spanId).html(result[attr]);
        }});
      }

      var regex_github = /^http[s]?:\/\/github\.com\/([a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38})\/([a-z\d](?:[a-z\d]|-(?=[a-z\d]))*)/i;
      // https://github.com/user/repo
      var regex_gitlab = /^http[s]?:\/\/gitlab\.com\/([a-z\d_\-\. ]*)\/([a-z\d_][a-z\d_\-\. ]*)/i;
      // https://gitlab.com/user/repo/
      var regex_bitbucket = /^http[s]?:\/\/bitbucket\.org\/([a-z\d_\-\. ]*)\/([a-z\d_][a-z\d_\-\. ]*)/i;
      // https://bitbucket.org/user/repo
      var regex_sourceforge = /^http[s]?:\/\/(?:www\.)?sourceforge\.net\/projects\/([a-z\d_][a-z\d_\-\. ]*)/i;
      // https://www.sourceforge.net/projects/project_name/

      if((res = rawlink.match(regex_github))) {
        var github_user = res[1];
        var github_repo = res[2];
        xhr2json(`https://api.github.com/repos/${github_user}/${github_repo}`, function(json_data){
          Swal({
            html: `<div class="card">
            <header class="card-header">
              <p class="card-header-title">
                ${json_data['name']}
              </p>
              <a href="#" class="card-header-icon" aria-label="more options">
                <span class="icon">
                  <i class="fab fa-github" aria-hidden="true"></i>
                </span>
              </a>
            </header>
            <div class="card-content">
              <div class="content has-text-left">
                <ul>
                  <li><span class="has-text-weight-semibold">Owner</span>: <a href="${json_data['owner']['html_url']}">${json_data['owner']['login']}</a></li>
                  <li><span class="has-text-weight-semibold">Repository</span>: <a href="${json_data['html_url']}">${json_data['full_name']}</a></li>
                  <li><span class="has-text-weight-semibold">Description</span>: ${json_data['description']}</li>
                  <li><span class="has-text-weight-semibold">Language</span>: ${json_data['language']}</li>
                  <li><span class="has-text-weight-semibold">License</span>: ${json_data['license'] ? json_data['license']['name'] : 'none'}</li>
                  <li><span class="has-text-weight-semibold">Fork</span>: ${json_data['forks_count']}</li>
                  <li><span class="has-text-weight-semibold">Open issues</span>: ${json_data['open_issues_count']}</li>
                  <li><span class="has-text-weight-semibold">Open pull requests</span>: <a href="${json_data['html_url']+'/pulls/'}">see</a></li>
                  <li><span class="has-text-weight-semibold">Stars</span>: ${json_data['watchers']}</li>
                  <li><span class="has-text-weight-semibold">Subscribers</span>: ${json_data['subscribers_count']}</li>
                </ul> 
              </div>
            </div>
          </div>`
          });
        });
      } else if((res = rawlink.match(regex_gitlab))) {
        var gitlab_user = res[1];
        var gitlab_repo = res[2];
        xhr2json(`https://gitlab.com/api/v4/projects/${gitlab_user}%2F${gitlab_repo}`, function(json_data){
          Swal({
            html: `<div class="card">
            <header class="card-header">
              <p class="card-header-title">
                ${json_data['name']}
              </p>
              <a href="#" class="card-header-icon" aria-label="more options">
                <span class="icon">
                  <i class="fab fa-gitlab" aria-hidden="true"></i>
                </span>
              </a>
            </header>
            <div class="card-content">
              <div class="content has-text-left">
                <ul>
                  <li><span class="has-text-weight-semibold">Owner</span>: <a href="https://gitlab.com/${gitlab_user}">${gitlab_user}</a></li>
                  <li><span class="has-text-weight-semibold">Repository</span>: <a href="${json_data['web_url']}">${json_data['path_with_namespace']}</a></li>
                  <li><span class="has-text-weight-semibold">Description</span>: ${json_data['description']}</li>
                  <li><span class="has-text-weight-semibold">Fork</span>: ${json_data['forks_count']}</li>
                  <li><span class="has-text-weight-semibold">Open issues</span>: <a href="${json_data['web_url']+'/issues'}">see</a></li>
                  <li><span class="has-text-weight-semibold">Open merge requests</span>: <a href="${json_data['web_url']+'/merge_requests'}">see</a></li>
                  <li><span class="has-text-weight-semibold">Stars</span>: ${json_data['star_count']}</li>
                </ul> 
              </div>
            </div>
          </div>`
          });
        });
      } else if((res = rawlink.match(regex_bitbucket))) {
        var bitbucket_user = res[1];
        var bitbucket_repo = res[2];
        xhr2json(`https://api.bitbucket.org/2.0/repositories/${bitbucket_user}/${bitbucket_repo}`, function(json_data){
          Swal({
            html: `<div class="card">
            <header class="card-header">
              <p class="card-header-title">
                ${json_data['name']}
              </p>
              <a href="#" class="card-header-icon" aria-label="more options">
                <span class="icon">
                  <i class="fab fa-bitbucket" aria-hidden="true"></i>
                </span>
              </a>
            </header>
            <div class="card-content">
              <div class="content has-text-left">
                <ul>
                  <li><span class="has-text-weight-semibold">Owner</span>: <a href="${json_data['owner']['links']['html']['href']}">${json_data['owner']['username']}</a></li>
                  <li><span class="has-text-weight-semibold">Repository</span>: <a href="${json_data['links']['html']['href']}">${json_data['full_name']}</a></li>
                  <li><span class="has-text-weight-semibold">Description</span>: ${json_data['description']}</li>
                  <li><span class="has-text-weight-semibold">Language</span>: ${json_data['language']}</li>
                  <li><span class="has-text-weight-semibold">Fork</span>: <span id="bitbucket-forks"></span></li>
                  <li><span class="has-text-weight-semibold">Open issues</span>: <a href="${json_data['links']['html']['href']+'/issues?status=new&status=open'}">see</a></li>
                  <li><span class="has-text-weight-semibold">Open pull requests</span>: <a href="${json_data['links']['html']['href']+'/pull-requests/'}">see</a></li>
                  <li><span class="has-text-weight-semibold">Watchers</span>: <a href="${json_data['links']['html']['href']+'#followers'}">see</a></li>
                </ul> 
              </div>
            </div>
          </div>`
          });
          ajaxLoad(json_data['links']['forks']['href'],'#bitbucket-forks', 'size');
        });
      } else if((res = rawlink.match(regex_sourceforge))) {
        var sourceforge_project = res[1];

        function sourceforge_dev(arr) {
          var list_str = "";
          arr.forEach(function(item){
            list_str += `<a href='${item.url}'>${item.username}</a>, `;
          });
          return list_str.slice(0,-2);
        }

        function sourceforge_cat(arr) {
          var list_str = "";
          arr.forEach(function(item){
            list_str += `${item.fullname}, `;
          });
          return list_str.slice(0,-2);
        }

        xhr2json(`https://sourceforge.net/rest/p/${sourceforge_project}`, function(json_data){
          Swal({
            html: `<div class="card">
            <header class="card-header">
              <p class="card-header-title">
                ${json_data['name']}
              </p>
            </header>
            <div class="card-content">
              <div class="content has-text-left">
                <ul>
                  <li><span class="has-text-weight-semibold">Developers</span>: ${sourceforge_dev(json_data['developers'])}</li>
                  <li><span class="has-text-weight-semibold">Repository</span>: <a href="${json_data['url']}">${json_data['shortname']}</a></li>
                  <li><span class="has-text-weight-semibold">Description</span>: ${json_data['summary'] ? json_data['summary'] : json_data['short_description']}</li>
                  <li><span class="has-text-weight-semibold">Language</span>: ${sourceforge_cat(json_data['categories']['language'])}</li>
                  <li><span class="has-text-weight-semibold">License</span>: ${sourceforge_cat(json_data['categories']['license'])}</li>
                  <li><span class="has-text-weight-semibold">Topics</span>: ${sourceforge_cat(json_data['categories']['topic'])}</li>
                  <li><span class="has-text-weight-semibold">Audience</span>: ${sourceforge_cat(json_data['categories']['audience'])}</li>
                  <li><span class="has-text-weight-semibold">Translation</span>: ${sourceforge_cat(json_data['categories']['translation'])}</li>
                  <li><span class="has-text-weight-semibold">OS</span>: ${sourceforge_cat(json_data['categories']['os'])}</li>
                </ul> 
              </div>
            </div>
          </div>`
          });
        });
      }
    }
  });
}
window.addEventListener('load', addRowHandlers);
