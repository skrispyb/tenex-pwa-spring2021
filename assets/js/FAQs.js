// Back button
$("#back_btn").click(function goBack() {
  window.history.back();
});

// =========== Accordion =================
var acc = document.getElementsByClassName("accordion");
let arrow = document.getElementsByClassName("arrow");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    // this.classList.toggle("active");
    this.children[0].children[1].children[0].classList.toggle("rotate");
    this.children[1].classList.toggle("hidden");
  });
}
