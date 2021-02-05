$("button").on("click", function showValues(e) {
  e.preventDefault();
  let title = $('input[type="text"]').val();
  let description = $('textarea').val();
  let reqForm = {
    title: `${title}`,
    description: `${description}`
  };
  console.log("reqForm: " + reqForm.title + "description: " + reqForm.description);
  $("form, button").addClass("hidden");
  $("p").removeClass("hidden");
  $("p").append(`<br>Title: ${reqForm.title} <br>Description: ${reqForm.description}`);
});

