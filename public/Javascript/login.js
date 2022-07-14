'use strict';

const ERR_MSG = "***this account does not exist in the system , please try again";

const validate_form = (form) => {
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value.trim();
    const error = document.getElementById('message');
    fetch('/api/login/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password}),
    })
        .then(response => response.json())
        .then(userAccount => {
            if (userAccount.exist)
                form.submit();
            else
                error.innerText = ERR_MSG;
        })
        .catch((err) => {
            error.innerText = "something really bad happened! please refresh" + err.toString();
        })

    return false;
}




