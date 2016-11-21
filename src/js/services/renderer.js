var fetchAndRender = function(url, renderer, containerId) {
  fetch(url)
  .then(function(response) {
    return response.text();
  })
  .then(function(responseText) {
    try{
      var repos = JSON.parse(responseText.trim().replace(/\n+/g,'').replace(/\,([\]\}])/g,'$1'))
    } catch(err){
      console.error("No JSON received", err)
      return
    }

    if (!Array.isArray(repos.Body)) {
      console.error("No repos response received")
      return
    }
    
    renderer(repos.Body, containerId)
  });
}

export default fetchAndRender