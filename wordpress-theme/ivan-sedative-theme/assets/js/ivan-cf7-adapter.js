(function () {
  "use strict";

  if (window.__ivanCf7AdapterInstalled) return;
  window.__ivanCf7AdapterInstalled = true;

  var MODAL_CLASS = "ivan-cf7-modal-open";
  var ERROR_CLASS = "ivan-cf7-invalid";
  var messages = {
    required: "Ovo polje je obavezno.",
    consent: "Potrebno je da potvrdite saglasnost pre slanja upita.",
    email: "Unesite ispravnu email adresu.",
    phone: "Unesite ispravan broj telefona, na primer +381 60 1234567.",
    dateFormat: "Unesite datum u formatu dan/mesec/godina.",
    datePast: "Uneti datum je već prošao.",
    dateRange: "Unesite realan budući datum.",
    sent: "Hvala vam na poverenju. Vaš upit je primljen i javićemo se u najkraćem roku.",
    invalid: "Proverite označena polja i pokušajte ponovo.",
    failed: "Došlo je do greške pri slanju. Pokušajte ponovo ili nas kontaktirajte direktno.",
    spam: "Slanje nije uspelo. Osvežite stranicu i pokušajte ponovo.",
  };

  var translations = {
    "Please fill out this field.": messages.required,
    "Please choose an option.": messages.required,
    "The field is required.": messages.required,
    "Please accept the terms to proceed.": messages.consent,
    "Please enter a valid email address.": messages.email,
    "Thank you for your message. It has been sent.": messages.sent,
    "One or more fields have an error. Please check and try again.": messages.invalid,
    "There was an error trying to send your message. Please try again later.": messages.failed,
    "There was an error trying to send your message. Please try again later or contact the administrator by another method.": messages.failed,
    "There was an error trying to send your message. Please try again later.": messages.failed,
    "There was an error trying to send your message. Please try again later or contact the administrator by another method.": messages.failed,
  };

  function getInquiryForm(node) {
    if (!node || !node.closest) return null;
    var form = node.closest(".wpcf7-host form");
    if (!form) {
      var host = node.closest(".wpcf7-host");
      form = host ? host.querySelector("form") : null;
    }
    return form && form.querySelector(".ivan-cf7") ? form : null;
  }

  function unlockBody() {
    var elements = [document.body, document.documentElement];
    elements.forEach(function (element) {
      if (!element) return;
      element.style.overflow = "";
      element.style.overflowX = "";
      element.style.overflowY = "";
      element.style.touchAction = "";
      element.classList.remove(MODAL_CLASS);
    });
  }

  function closeSuccessModal() {
    var modal = document.querySelector(".ivan-cf7-success-modal");
    if (modal) modal.remove();
    unlockBody();
  }

  function showSuccessModal(form) {
    closeSuccessModal();

    var modal = document.createElement("div");
    modal.className = "ivan-cf7-success-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "ivan-cf7-success-title");
    modal.innerHTML =
      '<div class="ivan-cf7-success-modal__backdrop" data-ivan-cf7-close></div>' +
      '<section class="ivan-cf7-success-modal__panel">' +
        '<button class="ivan-cf7-success-modal__close" type="button" aria-label="Zatvori" data-ivan-cf7-close>&times;</button>' +
        '<p class="ivan-cf7-success-modal__eyebrow">LIVE MUSIC EXPERIENCE</p>' +
        '<h2 class="ivan-cf7-success-modal__title" id="ivan-cf7-success-title">UPIT JE USPEŠNO POSLAT</h2>' +
        '<p class="ivan-cf7-success-modal__copy">' + messages.sent + '</p>' +
        '<p class="ivan-cf7-success-modal__info">Slanje upita ne znači automatsku rezervaciju termina. Termin se potvrđuje tek nakon dogovora, avansa i ugovora.</p>' +
        '<div class="ivan-cf7-success-modal__actions">' +
          '<button class="ivan-cf7-success-modal__action" type="button" data-ivan-cf7-close>ZATVORI</button>' +
          '<a class="ivan-cf7-success-modal__action ivan-cf7-success-modal__action--primary" href="/hvala">DETALJI POTVRDE</a>' +
        '</div>' +
      '</section>';

    document.body.appendChild(modal);
    document.body.classList.add(MODAL_CLASS);
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.documentElement.classList.add(MODAL_CLASS);
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.touchAction = "none";

    var closeButton = modal.querySelector(".ivan-cf7-success-modal__close");
    if (closeButton) closeButton.focus();

    try {
      window.dispatchEvent(new CustomEvent("ivan:cf7-success", { detail: { form: form } }));
    } catch (error) {}
  }

  function getFieldWrap(input) {
    return input.closest(".wpcf7-form-control-wrap") || input.closest("label") || input.parentElement;
  }

  function clearInlineError(input) {
    var wrap = getFieldWrap(input);
    if (!wrap) return;
    input.classList.remove(ERROR_CLASS);
    input.removeAttribute("aria-invalid");
    var customError = wrap.querySelector(".ivan-cf7-inline-error");
    if (customError) customError.remove();
  }

  function setInlineError(input, message) {
    var wrap = getFieldWrap(input);
    if (!wrap) return false;
    clearInlineError(input);
    input.classList.add(ERROR_CLASS);
    input.setAttribute("aria-invalid", "true");
    var error = document.createElement("span");
    error.className = "ivan-cf7-inline-error";
    error.setAttribute("data-ivan-cf7-error", input.name || "field");
    error.textContent = message;
    wrap.appendChild(error);
    return false;
  }

  function parseDate(value) {
    var match = String(value || "").trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) return null;
    var day = parseInt(match[1], 10);
    var month = parseInt(match[2], 10);
    var year = parseInt(match[3], 10);
    var date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function validateRequired(input, report) {
    if (!input.required || String(input.value || "").trim()) {
      clearInlineError(input);
      return true;
    }
    return report ? setInlineError(input, messages.required) : false;
  }

  function validateEmail(input, report) {
    var value = String(input.value || "").trim();
    if (!value) return validateRequired(input, report);
    if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value)) {
      clearInlineError(input);
      return true;
    }
    return report ? setInlineError(input, messages.email) : false;
  }

  function validatePhone(input, report) {
    var value = String(input.value || "").trim();
    if (!value) return validateRequired(input, report);
    var digits = value.replace(/\D/g, "");
    if (/^\+?[\d\s()./-]+$/.test(value) && digits.length >= 9 && digits.length <= 15) {
      clearInlineError(input);
      return true;
    }
    return report ? setInlineError(input, messages.phone) : false;
  }

  function validateDate(input, report) {
    var value = String(input.value || "").trim();
    if (!value) return validateRequired(input, report);
    var date = parseDate(value);
    if (!date) return report ? setInlineError(input, messages.dateFormat) : false;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return report ? setInlineError(input, messages.datePast) : false;
    var limit = new Date(today.getFullYear() + 10, today.getMonth(), today.getDate());
    if (date > limit) return report ? setInlineError(input, messages.dateRange) : false;
    clearInlineError(input);
    return true;
  }

  function validateConsent(form, report) {
    var input = form.querySelector(".ivan-cf7-consent input[type=checkbox], input[name=consent][type=checkbox], input[name=acceptance][type=checkbox]");
    if (!input || input.checked) {
      if (input) clearInlineError(input);
      return true;
    }
    return report ? setInlineError(input, messages.consent) : false;
  }

  function validateForm(form, report) {
    var valid = true;
    var required = form.querySelectorAll(".ivan-cf7 input[required], .ivan-cf7 textarea[required], .ivan-cf7 select[required]");
    required.forEach(function (input) {
      if (input.type !== "checkbox" && !validateRequired(input, report)) valid = false;
    });

    var email = form.querySelector('[name="your-email"]');
    if (email && !validateEmail(email, report)) valid = false;
    var phone = form.querySelector('[name="your-phone"]');
    if (phone && !validatePhone(phone, report)) valid = false;
    form.querySelectorAll(".ivan-cf7-date").forEach(function (input) {
      if (!validateDate(input, report)) valid = false;
    });
    if (!validateConsent(form, report)) valid = false;

    if (!valid && report) {
      var first = form.querySelector("." + ERROR_CLASS);
      if (first && first.focus) {
        try { first.focus({ preventScroll: true }); } catch (error) { first.focus(); }
      }
    }
    return valid;
  }

  function translateText(root) {
    if (!root) return;
    root.querySelectorAll(".wpcf7-not-valid-tip, .wpcf7-response-output").forEach(function (node) {
      var text = node.textContent.trim();
      if (translations[text]) node.textContent = translations[text];
    });
    root.querySelectorAll("select option").forEach(function (option) {
      var text = option.textContent.trim();
      if (text === "Please choose an option." || text === "--- Please choose an option ---") {
        option.textContent = "Izaberite opciju";
      }
    });
  }

  function normalizeSubmit(root) {
    if (!root) return;
    root.querySelectorAll(".ivan-cf7-submit").forEach(function (button) {
      if (button.tagName === "INPUT") {
        button.value = "POŠALJI UPIT";
      } else {
        button.textContent = "POŠALJI UPIT";
      }
    });
  }

  function prepare(root) {
    var scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll(".wpcf7-host").forEach(function (host) {
      if (!host.querySelector(".ivan-cf7")) return;
      host.querySelectorAll("form").forEach(function (form) {
        form.setAttribute("novalidate", "novalidate");
      });
      normalizeSubmit(host);
      translateText(host);
    });
  }

  document.addEventListener("submit", function (event) {
    var form = getInquiryForm(event.target);
    if (form && !validateForm(form, true)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  document.addEventListener("blur", function (event) {
    var input = event.target;
    var form = getInquiryForm(input);
    if (!form || !input.matches) return;
    if (input.matches('[name="your-email"]')) validateEmail(input, true);
    if (input.matches('[name="your-phone"]')) validatePhone(input, true);
    if (input.matches(".ivan-cf7-date")) validateDate(input, true);
  }, true);

  document.addEventListener("change", function (event) {
    var input = event.target;
    var form = getInquiryForm(input);
    if (!form || !input.matches) return;
    if (input.matches(".ivan-cf7-consent input[type=checkbox], input[name=consent][type=checkbox], input[name=acceptance][type=checkbox]")) {
      validateConsent(form, true);
    }
  });

  document.addEventListener("click", function (event) {
    var close = event.target && event.target.closest ? event.target.closest("[data-ivan-cf7-close]") : null;
    if (close) closeSuccessModal();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeSuccessModal();
  });

  document.addEventListener("wpcf7mailsent", function (event) {
    var form = getInquiryForm(event.target);
    if (!form) return;
    translateText(form);
    showSuccessModal(form);
  });

  ["wpcf7invalid", "wpcf7mailfailed", "wpcf7spam", "wpcf7submit"].forEach(function (eventName) {
    document.addEventListener(eventName, function (event) {
      var form = getInquiryForm(event.target);
      if (!form) return;
      window.setTimeout(function () {
        translateText(form);
        normalizeSubmit(form);
      }, 0);
    });
  });

  ["pagehide", "popstate", "beforeunload"].forEach(function (eventName) {
    window.addEventListener(eventName, closeSuccessModal);
  });

  function start() {
    prepare(document);
    if (document.body && window.MutationObserver) {
      new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          mutation.addedNodes.forEach(function (node) {
            if (node.nodeType === 1) prepare(node.parentElement || node);
          });
        });
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
