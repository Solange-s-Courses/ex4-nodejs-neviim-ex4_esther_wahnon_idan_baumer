'use strict';

const USED_EMAIL = "***this email is already in use. Please choose a different one"

function validate_form(form) {
    const email = document.getElementById('email').value.trim().toLowerCase();
    const error = document.getElementById('validEmail');
    fetch('/api/login/email', {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({email}),
    })
        .then(response => response.json())
        .then(userEmail => {

            if (userEmail.exist) {
                error.innerText = USED_EMAIL;
            } else
                form.submit();
        })
        .catch((err) =>
            error.innerText = "something really bad happened! please refresh" + err.toString());
    return false;


}




