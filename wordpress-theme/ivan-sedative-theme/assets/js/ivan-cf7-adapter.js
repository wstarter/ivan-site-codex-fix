(function () {
  "use strict";

  if (window.__ivanCf7AdapterInstalled) return;
  window.__ivanCf7AdapterInstalled = true;

  var MODAL_CLASS = "ivan-cf7-modal-open";
  var ERROR_CLASS = "ivan-cf7-invalid";
  var RANGE_MIN = 500;
  var RANGE_MAX = 50000;
  var RANGE_STEP = 500;
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
    [document.body, document.documentElement].forEach(function (element) {
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

  function dispatchSuccess(form) {
    try {
      var event = new CustomEvent("ivan:cf7-success", {
        cancelable: true,
        detail: { form: form },
      });
      return !window.dispatchEvent(event);
    } catch (error) {
      return false;
    }
  }

  function showSuccessModal(form) {
    closeSuccessModal();
    if (dispatchSuccess(form)) return;

    var modal = document.createElement("div");
    modal.className = "ivan-cf7-success-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "ivan-cf7-success-title");
    modal.innerHTML =
      '<div class="ivan-cf7-success-modal__backdrop" data-ivan-cf7-close></div>' +
      '<section class="ivan-cf7-success-modal__panel">' +
        '<button class="ivan-cf7-success-modal__close" type="button" aria-label="Zatvori" data-ivan-cf7-close>&times;</button>' +
        '<p class="ivan-cf7-success-modal__eyebrow">SEDATIVE BAND</p>' +
        '<h2 class="ivan-cf7-success-modal__title" id="ivan-cf7-success-title">UPIT JE USPEŠNO POSLAT</h2>' +
        '<p class="ivan-cf7-success-modal__copy">' + messages.sent + '</p>' +
        '<p class="ivan-cf7-success-modal__info">Slanje upita ne znači automatsku rezervaciju termina. Termin se potvrđuje tek nakon dogovora, avansa i ugovora.</p>' +
        '<div class="ivan-cf7-success-modal__actions">' +
          '<a class="ivan-cf7-success-modal__action" href="/">POČETNA</a>' +
          '<a class="ivan-cf7-success-modal__action" href="/instagram">INSTAGRAM</a>' +
          '<a class="ivan-cf7-success-modal__action ivan-cf7-success-modal__action--primary" href="/dostupni-termini">TERMINI</a>' +
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
  }

  function getFieldWrap(input) {
    return input.closest(".wpcf7-form-control-wrap") || input.closest("label") || input.parentElement;
  }

  function clearInlineError(input) {
    var wrap = getFieldWrap(input);
    if (!wrap) return;
    input.classList.remove(ERROR_CLASS);
    input.removeAttribute("aria-invalid");
    wrap.querySelectorAll(".ivan-cf7-inline-error").forEach(function (error) {
      error.remove();
    });
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

  function clearConsentError(form) {
    var consent = form.querySelector(".ivan-cf7-consent");
    if (!consent) return;
    consent.classList.remove(ERROR_CLASS);
    consent.querySelectorAll(".ivan-cf7-consent-error").forEach(function (error) {
      error.remove();
    });
    var input = consent.querySelector("input[type=checkbox]");
    if (input) clearInlineError(input);
  }

  function setConsentError(form) {
    var consent = form.querySelector(".ivan-cf7-consent");
    if (!consent) return false;
    clearConsentError(form);
    consent.classList.add(ERROR_CLASS);
    var error = document.createElement("span");
    error.className = "ivan-cf7-consent-error";
    error.textContent = messages.consent;
    consent.appendChild(error);
    return false;
  }

  function clearGroupError(group) {
    group.classList.remove(ERROR_CLASS);
    group.removeAttribute("aria-invalid");
    group.querySelectorAll(".ivan-cf7-inline-error").forEach(function (error) {
      error.remove();
    });
  }

  function setGroupError(group, message) {
    clearGroupError(group);
    group.classList.add(ERROR_CLASS);
    group.setAttribute("aria-invalid", "true");
    var error = document.createElement("span");
    error.className = "ivan-cf7-inline-error";
    error.textContent = message;
    group.appendChild(error);
    return false;
  }

  function isRequired(input) {
    return input.required ||
      input.getAttribute("aria-required") === "true" ||
      input.classList.contains("wpcf7-validates-as-required");
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

  function maskDateValue(value) {
    var digits = String(value || "").replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4);
  }

  function validateRequired(input, report) {
    if (!isRequired(input) || String(input.value || "").trim()) {
      clearInlineError(input);
      return true;
    }
    return report ? setInlineError(input, messages.required) : false;
  }

  function validateBasicRequired(input, report) {
    if (!isRequired(input) || !input.matches("input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=submit]), textarea, select")) {
      return true;
    }
    if (input.matches('[name="your-email"], [name="your-phone"], .ivan-cf7-date')) return true;
    return validateRequired(input, report);
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
      clearConsentError(form);
      return true;
    }
    return report ? setConsentError(form) : false;
  }

  function radioGroupLooksRequired(group) {
    if (
      group.classList.contains("ivan-cf7-required-radio") ||
      group.getAttribute("aria-required") === "true" ||
      group.getAttribute("data-required") === "true" ||
      group.hasAttribute("data-error")
    ) {
      return true;
    }
    var row = group.closest(".ivan-cf7-row");
    var label = row ? row.querySelector(".ivan-cf7-label, .ivan-cf7-copy") : null;
    return !!(label && label.textContent.indexOf("*") !== -1);
  }

  function getRequiredRadioGroups(form) {
    var groups = [];
    form.querySelectorAll(".ivan-cf7-options, .ivan-cf7-pills").forEach(function (group) {
      if (!group.querySelector("input[type=radio]") || !radioGroupLooksRequired(group)) return;
      if (groups.indexOf(group) === -1) groups.push(group);
    });
    return groups;
  }

  function validateRequiredRadios(form, report) {
    var valid = true;
    getRequiredRadioGroups(form).forEach(function (group) {
      if (group.querySelector("input[type=radio]:checked, input[type=checkbox]:checked")) {
        clearGroupError(group);
      } else {
        valid = false;
        if (report) setGroupError(group, messages.required);
      }
    });
    return valid;
  }

  function validateForm(form, report) {
    var valid = true;
    var required = form.querySelectorAll(
      ".ivan-cf7 input[required], .ivan-cf7 textarea[required], .ivan-cf7 select[required], " +
      ".ivan-cf7 input[aria-required=true], .ivan-cf7 textarea[aria-required=true], .ivan-cf7 select[aria-required=true], " +
      ".ivan-cf7 input.wpcf7-validates-as-required, .ivan-cf7 textarea.wpcf7-validates-as-required, .ivan-cf7 select.wpcf7-validates-as-required"
    );
    required.forEach(function (input) {
      if (!input.matches("[type=checkbox], [type=radio], [type=submit], [type=range]") && !validateRequired(input, report)) {
        valid = false;
      }
    });

    var email = form.querySelector('[name="your-email"]');
    if (email && !validateEmail(email, report)) valid = false;
    var phone = form.querySelector('[name="your-phone"]');
    if (phone && !validatePhone(phone, report)) valid = false;
    form.querySelectorAll(".ivan-cf7-date").forEach(function (input) {
      if (!validateDate(input, report)) valid = false;
    });
    if (!validateRequiredRadios(form, report)) valid = false;
    if (!validateConsent(form, report)) valid = false;

    return valid;
  }

  function getValidationTarget(form) {
    var candidates = form.querySelectorAll(
      ".ivan-cf7-consent." + ERROR_CLASS + ", " +
      ".ivan-cf7-options." + ERROR_CLASS + ", " +
      ".ivan-cf7-pills." + ERROR_CLASS + ", " +
      "." + ERROR_CLASS + ", .wpcf7-not-valid"
    );
    for (var index = 0; index < candidates.length; index += 1) {
      var candidate = candidates[index];
      var rect = candidate.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) return candidate;
    }
    return candidates[0] || null;
  }

  function revealValidationTarget(form) {
    window.requestAnimationFrame(function () {
      var target = getValidationTarget(form);
      if (!target) return;
      var block = target.closest(".ivan-cf7-row, .ivan-cf7-section, .ivan-cf7-consent, .ivan-cf7-options, .ivan-cf7-pills, .wpcf7-form-control-wrap") || target;
      try {
        block.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      } catch (error) {
        block.scrollIntoView(false);
      }
      if (target.matches && target.matches("input, select, textarea, button")) {
        try {
          target.focus({ preventScroll: true });
        } catch (error) {
          target.focus();
        }
      }
    });
  }

  function surfaceValidation(form) {
    var valid = validateForm(form, true);
    if (!valid) revealValidationTarget(form);
    return valid;
  }

  function hasCf7Runtime(form) {
    return !!(window.wpcf7 || form.classList.contains("wpcf7-form"));
  }

  function isSubmitControl(target) {
    if (!target || !target.closest) return false;
    return !!target.closest('.ivan-cf7-submit input[type="submit"], input.wpcf7-submit, .ivan-cf7-submit button[type="submit"], button.wpcf7-submit');
  }

  function translateText(root) {
    if (!root || !root.querySelectorAll) return;
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
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('.ivan-cf7-submit input[type="submit"], input.wpcf7-submit').forEach(function (input) {
      input.value = "POŠALJI UPIT";
    });
    root.querySelectorAll(".ivan-cf7-submit svg, .ivan-cf7-submit .icon, .ivan-cf7-submit [data-icon]").forEach(function (icon) {
      icon.remove();
    });
  }

  function normalizeBudgetValue(value) {
    var parsed = parseInt(value, 10);
    if (!Number.isFinite(parsed)) parsed = RANGE_MIN;
    return Math.min(RANGE_MAX, Math.max(RANGE_MIN, Math.round(parsed / RANGE_STEP) * RANGE_STEP));
  }

  function formatBudget(value) {
    return normalizeBudgetValue(value).toLocaleString("sr-RS") + "€";
  }

  function updateBudgetRange(input) {
    if (!input) return;
    input.min = String(RANGE_MIN);
    input.max = String(RANGE_MAX);
    input.step = String(RANGE_STEP);
    var value = normalizeBudgetValue(input.value);
    input.value = String(value);
    var progress = ((value - RANGE_MIN) / (RANGE_MAX - RANGE_MIN)) * 100;
    input.style.setProperty("--ivan-range-progress", progress + "%");
    var budget = input.closest(".ivan-cf7-budget") || input.parentElement;
    if (!budget || !budget.querySelector) return;
    var output = budget.querySelector("[data-budget-output], .ivan-cf7-budget-current");
    if (output) output.textContent = formatBudget(value);
  }

  function initBudgetRanges(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll(
      '.ivan-cf7-budget-range input[type="range"], input[type="range"].ivan-cf7-budget-range, input[type="range"][name="budget-range"]'
    ).forEach(updateBudgetRange);
  }

  function updateRadioStates(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll(".ivan-cf7-options .wpcf7-list-item, .ivan-cf7-pills .wpcf7-list-item").forEach(function (item) {
      item.classList.toggle("is-checked", !!item.querySelector("input:checked"));
    });
  }

  function getHosts(root) {
    var hosts = [];
    if (root && root.matches && root.matches(".wpcf7-host")) hosts.push(root);
    if (root && root.querySelectorAll) {
      root.querySelectorAll(".wpcf7-host").forEach(function (host) {
        if (hosts.indexOf(host) === -1) hosts.push(host);
      });
    }
    return hosts;
  }

  function prepare(root) {
    getHosts(root || document).forEach(function (host) {
      if (!host.querySelector(".ivan-cf7")) return;
      normalizeSubmit(host);
      translateText(host);
      initBudgetRanges(host);
      updateRadioStates(host);
    });
  }

  document.addEventListener("click", function (event) {
    if (!isSubmitControl(event.target)) return;
    var form = getInquiryForm(event.target);
    if (form) surfaceValidation(form);
  }, true);

  document.addEventListener("invalid", function (event) {
    var form = getInquiryForm(event.target);
    if (!form || !event.target.matches) return;
    validateBasicRequired(event.target, true);
    if (event.target.matches('[name="your-email"]')) validateEmail(event.target, true);
    if (event.target.matches('[name="your-phone"]')) validatePhone(event.target, true);
    if (event.target.matches(".ivan-cf7-date")) validateDate(event.target, true);
    revealValidationTarget(form);
  }, true);

  document.addEventListener("submit", function (event) {
    var form = getInquiryForm(event.target);
    if (!form) return;
    if (!surfaceValidation(form) && !hasCf7Runtime(form)) {
      event.preventDefault();
    }
  });

  document.addEventListener("blur", function (event) {
    var input = event.target;
    var form = getInquiryForm(input);
    if (!form || !input.matches) return;
    if (input.matches('[name="your-email"]')) validateEmail(input, true);
    if (input.matches('[name="your-phone"]')) validatePhone(input, true);
    if (input.matches(".ivan-cf7-date")) validateDate(input, true);
  }, true);

  document.addEventListener("input", function (event) {
    var input = event.target;
    var form = getInquiryForm(input);
    if (!form || !input.matches) return;
    if (input.matches(".ivan-cf7-date") && input.type !== "date") {
      input.value = maskDateValue(input.value);
    }
    validateBasicRequired(input, true);
    if (input.matches('.ivan-cf7-budget-range input[type="range"], input[type="range"].ivan-cf7-budget-range, input[type="range"][name="budget-range"]')) {
      updateBudgetRange(input);
    }
  });

  document.addEventListener("change", function (event) {
    var input = event.target;
    var form = getInquiryForm(input);
    if (!form || !input.matches) return;
    validateBasicRequired(input, true);
    if (input.matches('.ivan-cf7-budget-range input[type="range"], input[type="range"].ivan-cf7-budget-range, input[type="range"][name="budget-range"]')) {
      updateBudgetRange(input);
    }
    if (input.matches(".ivan-cf7-options input, .ivan-cf7-pills input")) {
      updateRadioStates(form);
      validateRequiredRadios(form, true);
    }
    if (input.matches(".ivan-cf7-consent input[type=checkbox], input[name=consent][type=checkbox], input[name=acceptance][type=checkbox]")) {
      validateConsent(form, true);
    }
  });

  ["keyup", "pointerup"].forEach(function (eventName) {
    document.addEventListener(eventName, function (event) {
      var input = event.target;
      var form = getInquiryForm(input);
      if (!form || !input.matches) return;
      if (input.matches('.ivan-cf7-budget-range input[type="range"], input[type="range"].ivan-cf7-budget-range, input[type="range"][name="budget-range"]')) {
        updateBudgetRange(input);
      }
    });
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
      if (eventName === "wpcf7mailfailed" || eventName === "wpcf7spam") {
        closeSuccessModal();
      }
      window.setTimeout(function () {
        translateText(form);
        normalizeSubmit(form);
        initBudgetRanges(form);
        updateRadioStates(form);
        if (eventName === "wpcf7invalid") {
          validateForm(form, true);
          revealValidationTarget(form);
        }
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
