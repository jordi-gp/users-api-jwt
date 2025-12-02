import { showAlert, hideAlert } from "./alerts.js";

window.onload = main;

function main() {
    sendRegisterForm();
}

function sendRegisterForm() {
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', e => {
        e.preventDefault();

        const name = form[0].value;
        const lastname = form[1].value;
        const username = form[2].value;
        const email = form[3].value;
        const password = form[4].value;

        const body = JSON.stringify({
            name,
            lastname,
            username,
            email,
            password
        });

        fetch('http://localhost:3000/users/register', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: body
        }).then(async res => {
            if(res.ok) {
                showAlert('success', 'Registro correcto accediendo al portal...');

                setTimeout(() => {
                    hideAlert();
                    window.location.href = '/protected';
                }, 2500);
            } else {
                showAlert('danger', 'Error al registrar, vuelve a intentar-lo');
                setTimeout(() => {
                    hideAlert();
                }, 5000);
            }
        }).catch(() => {
            console.error('Error al realizar la petición al servidor');
        });
    });
}