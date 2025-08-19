document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const entriesTableBody = document.getElementById("entriesTableBody");
  const storageKey = "user-entries";

  // Display entries from Local Storage
  const displayEntries = () => {
    const entries = JSON.parse(localStorage.getItem(storageKey)) || [];
    entriesTableBody.innerHTML = "";

    if (entries.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No entries yet.</td>`;
      entriesTableBody.appendChild(row);
      return;
    }

    entries.forEach((entry) => {
      const row = document.createElement("tr");
      const escapeHTML = (str) =>
        str.replace(
          /[&<>"']/g,
          (tag) =>
            ({
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': "&quot;",
              "'": "&#39;",
            }[tag])
        );

      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${escapeHTML(
          entry.name
        )}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${escapeHTML(
          entry.email
        )}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${escapeHTML(
          entry.password
        )}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${escapeHTML(
          entry.dob
        )}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${
          entry.terms ? "Yes" : "No"
        }</td>
      `;
      entriesTableBody.appendChild(row);
    });
  };

  // Form validation
  const validateForm = () => {
    let isValid = true;
    document
      .querySelectorAll(".error-message")
      .forEach((el) => (el.textContent = ""));

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const dob = document.getElementById("dob").value;
    const terms = document.getElementById("terms").checked;

    if (!name) {
      document.getElementById("nameError").textContent =
        "Please fill in this field.";
      isValid = false;
    }

    if (!email) {
      document.getElementById("emailError").textContent =
        "Please fill in this field.";
      isValid = false;
    } else if (!email.includes("@")) {
      document.getElementById(
        "emailError"
      ).textContent = `Please include an '@' in the email address. '${email}' is missing an '@'.`;
      isValid = false;
    }

    if (!password) {
      document.getElementById("passwordError").textContent =
        "Please fill in this field.";
      isValid = false;
    }

    if (!dob) {
      document.getElementById("dobError").textContent =
        "Please fill in this field.";
      isValid = false;
    } else {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      if (age < 18) {
        document.getElementById(
          "dobError"
        ).textContent = `You must be at least 18 years old.`;
        isValid = false;
      } else if (age > 55) {
        document.getElementById(
          "dobError"
        ).textContent = `You must be no older than 55 years old.`;
        isValid = false;
      }
    }

    if (!terms) {
      document.getElementById("termsError").textContent =
        "Please tick this box if you want to proceed.";
      isValid = false;
    }

    return isValid;
  };

  // Form submit
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (validateForm()) {
      const formData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim(),
        dob: document.getElementById("dob").value,
        terms: document.getElementById("terms").checked,
      };

      const entries = JSON.parse(localStorage.getItem(storageKey)) || [];
      entries.push(formData);
      localStorage.setItem(storageKey, JSON.stringify(entries));

      displayEntries();
      form.reset();
    }
  });

  // Initial load
  displayEntries();
});
