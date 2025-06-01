addEventListener("DOMContentLoaded", function() {
    charge_content("project_page.php")
});

function charge_content(url) {
    fetch(url).then(response => {
        if (!response.ok) {
            throw new Error("Error in the server response");
        }
        return response.text();
    }).then((html)=> {

        const content_div = document.getElementById("html_container");
        content_div.innerHTML = html;

        delete_old_scripts(); 
        call_scripts(content_div);
    }).catch((error) => {
        console.error("Error loading content:", error);
        const content_div = document.getElementById("html_container");
        content_div.innerHTML = "<p>Error loading content. Please try again later.</p>";
    });
}

document.body.addEventListener("click", function (event) {
        const link = event.target.closest("a");
        if (link && link.getAttribute("href") && !link.getAttribute("target")) {
            event.preventDefault();
            charge_content(link.getAttribute("href"));
        }
});

function delete_old_scripts() {
    document.querySelectorAll("script[data-dynamic]").forEach(script => script.remove());
}

function call_scripts(element) {
  const scripts = element.querySelectorAll("script");

  scripts.forEach((old_script) => {
    const new_script = document.createElement("script");

    new_script.setAttribute("data-dynamic", "true");
      if (old_script.src) {
          relative_src = is_absolute_url_js(old_script);
          new_script.src = relative_src;
            if (!document.querySelector(`script[src="${relative_src}"]`)) {
                document.body.appendChild(new_script);
            }
      } else {
        
          new_script.textContent = old_script.textContent;
          document.body.appendChild(new_script);
      }

      old_script.remove();
  });
}

function is_absolute_url_js(url) {
const is_absolute_url = /^https?:\/\//i.test(url.src);
return is_absolute_url ? url.src : relative_route(url.src);
}
function relative_route(url) {
  const urlObj = new URL(url, window.location.origin);
  return urlObj.pathname;
}
