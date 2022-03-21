function removeHash () {
    history.pushState("", document.title, window.location.pathname + window.location.search);
}

window.addEventListener("load", function load() {
  Array.prototype.forEach.call(document.querySelectorAll("[data-item]"), function(el) {
    var loc = el.getAttribute("href").substr(1);
    if ("_" + loc === window.location.hash.substr(1)) {
      focus(loc, "focus");
    } else if (loc === window.location.hash.substr(1)) {
      focus(loc);
    }
    el.addEventListener("click", function(click) {
      if (!el.getAttribute("href") || el.getAttribute("href").substr(0, 1) !== "#") {
        return;
      }
      var loc = el.getAttribute("href").substr(1);
      var y = el.getBoundingClientRect().y;
      if ("_" + loc === window.location.hash.substr(1)) {
        focus(loc);
        click.preventDefault();
        window.location.hash = loc;
        window.scrollBy({
          behavior: "instant",
          top: el.getBoundingClientRect().y - y,
        });
      } else if (loc === window.location.hash.substr(1)) {
        focus("");
        removeHash();
        click.preventDefault();
        window.scrollBy({
          behavior: "instant",
          top: el.getBoundingClientRect().y - y,
        });
      } else {
        if (window.location.hash.length > 1) {
          focus(loc);
          click.preventDefault();
          var scrollY = window.scrollY;
          window.location.hash = loc;
          // Keep scroll position
          window.scrollTo({
            behavior: "instant",
            top: scrollY,
          });
          // Unless the content goes off screen.
          var rect = el.getBoundingClientRect();
          if (rect.top < 0 || rect.bottom > window.innerHeight) {
            el.scrollIntoView(true);
          }
        } else {
          click.preventDefault();
          window.location.hash = "_" + loc;
          focus(loc, "focus");
          window.scrollBy({
            behavior: "instant",
            top: el.getBoundingClientRect().y - y,
          });
        }
      }
    });
  });
});

function focus(which, focus) {
  Array.prototype.forEach.call(document.querySelectorAll("[data-content]"), function(el) {
    if (el.dataset.content === which || which === "") {
      el.style.maxHeight = "";
      el.style.marginTop = "";
      el.style.marginBottom = "";
    } else {
      el.style.maxHeight = "0";
      if (focus === "focus") {
        el.style.marginTop = "0";
        el.style.marginBottom = "0";
      } else {
        el.style.marginTop = "";
        el.style.marginBottom = "";
      }
    }
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-item=focus], [data-item=hash]"), function(el) {
    el.dataset.item = "";
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-item]"), function(el) {
    el.parentElement.style.display = focus === "focus" ? "none" : "";
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-padding], [data-heading]"), function(el) {
    el.style.display = focus === "focus" ? "none" : "";
  });
  Array.prototype.forEach.call(document.querySelectorAll("[href='#"+which+"'][data-item]"), function(el) {
    el.dataset.item = focus || "hash";
    el.parentElement.style.display = "";
    if (focus === "focus") {
      var level = Infinity;
      var i = 0;
      var scanning = el;
      while (scanning = (scanning.previousElementSibling || scanning.parentElement)) {
        if (scanning.matches("[data-heading]")) {
          console.log(scanning, level);
          if (scanning.dataset.heading < level) {
            scanning.style.display = "";
            level = scanning.dataset.heading;
          }
        }
      }
    }
  });
  var el = document.querySelector("[data-fill]");
  if (el) el.dataset.fill = focus ? "none" : "fill";
}
