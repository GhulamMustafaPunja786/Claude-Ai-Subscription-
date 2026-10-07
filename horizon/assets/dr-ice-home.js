(function () {
  var root = document.querySelector("[data-dr-ice-home]");
  if (!root) return;

  var tabs = root.querySelectorAll("[data-tab]");
  var panels = root.querySelectorAll("[data-panel]");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var id = tab.getAttribute("data-tab");
      tabs.forEach(function (item) {
        var on = item === tab;
        item.classList.toggle("is-active", on);
        item.setAttribute("aria-selected", on ? "true" : "false");
      });
      panels.forEach(function (panel) {
        var on = panel.getAttribute("data-panel") === id;
        panel.hidden = !on;
        if (on) {
          var scroller = panel.querySelector("[data-product-scroller]");
          if (scroller) scroller.scrollLeft = 0;
        }
      });
    });
  });

  root.querySelectorAll("[data-product-next]").forEach(function (button) {
    button.addEventListener("click", function () {
      var panel = button.closest("[data-panel]");
      var scroller = panel && panel.querySelector("[data-product-scroller]");
      if (!scroller) return;
      scroller.scrollBy({ left: Math.max(260, scroller.clientWidth * 0.72), behavior: "smooth" });
    });
  });
})();
