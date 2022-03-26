String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function fadeOut(classToFade) {
    var element = document.getElementsByClassName(classToFade)[0];

    element.style.opacity -= 0.1;
    if(element.style.opacity < 0.0) {
        element.style.opacity = 0.0;
        element.parentNode.removeChild(element)
    } else {
        setTimeout("fadeOut(\"" + classToFade + "\")", 75);
    }
}

function addPostLoad() {
  const importString = document.getElementById("post-load").innerHTML
  const files  = importString.split(",")
  console.log(files);
  for (file of files) {
    const cleanFile = file.trim()
    if (cleanFile &&  cleanFile != "") {
      console.log(`Creating ${cleanFile}`);
      var script = document.createElement("script")
      script.src = cleanFile.replaceAll("\"", "")
      document.body.appendChild(script)
    }

  }
}
function includeHTML() {
  var loaders = []

  var targetElements = {}

  var z, i, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    var elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    const file = elmnt.getAttribute("embedded-html");
    if (file) {
      targetElements[file] = elmnt
      // alert(`Loading contents from ${file}`);
      const loader = new Promise((resolve, reject) => {
        /* Make an HTTP request using the attribute value as the file name: */
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            var elementToChange = targetElements[file]
            if (this.status == 200) {elementToChange.innerHTML = this.responseText;}
            if (this.status == 404) {elementToChange.innerHTML = "Page not found.";}
            /* Remove the attribute, and call this function once more: */
            elementToChange.removeAttribute("embedded-html");
          }
        }
        xhttp.open("GET", file, true);
        xhttp.send();

        resolve(true)
      });

      loaders.push(loader)
    }
  }

  console.log(loaders.length);

  Promise.all(loaders).then((done) => {
    document.getElementsByClassName("loading")[0].style.opacity = 1
    setTimeout(()=>{fadeOut("loading")}, 1000)
    addPostLoad()
  })

}
includeHTML()
