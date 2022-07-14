'use strict';

const validate_form = (form) => {
    const password = document.getElementById("password").value.trim();
    const password2 = document.getElementById("password2").value.trim();
    if (password !== password2) {
        document.getElementById("message").innerHTML = "**The passwords do not match!";
        form.reset();
        return false;
    }
}