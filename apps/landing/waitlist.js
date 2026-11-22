/* Waitlist / early-user form. Sends through FormSubmit to the team inbox.
   Falls back to a normal form POST if fetch is unavailable. */
(function () {
  var form = document.getElementById("waitlist");
  if (!form || !window.fetch) return;
  var status = form.querySelector(".wl-status");
  var button = form.querySelector('button[type="submit"]');
  var endpoint = "https://formsubmit.co/ajax/hamzavelous@gmail.com";

  function say(text, isError) {
    status.textContent = text;
    status.classList.toggle("err", !!isError);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var firstBad = null;
    form.querySelectorAll("[required]").forEach(function (el) {
      var ok = el.checkValidity();
      el.setAttribute("aria-invalid", ok ? "false" : "true");
      if (!ok && !firstBad) firstBad = el;
    });
    if (firstBad) {
      say("Please fill in your name, a valid email and who you are.", true);
      firstBad.focus();
      return;
    }
    if (form.elements._honey.value) return;

    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    data._subject = "ZehenSync " + data.interest.toLowerCase() + " sign-up: " + data.name;

    button.disabled = true;
    say("Sending...");
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (res) {
        if (!res.ok || String(res.body.success) !== "true") throw new Error(res.body.message || "failed");
        form.reset();
        say(data.interest === "Early user"
          ? "Thanks. You're on the early-user list. We'll email you before testing starts."
          : "Thanks. You're on the waitlist. We'll email you when ZehenSync opens.");
      })
      .catch(function () {
        say("That didn't send. Please try again, or email hamzavelous@gmail.com.", true);
      })
      .then(function () { button.disabled = false; });
  });
})();
