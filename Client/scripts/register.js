window.onload = main;

function main() {
    console.log('CARGADO');
    sendRegisterForm();
}

function sendRegisterForm() {
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', e => {
        e.preventDefault();


        const name = form[0].value;
        const lastname = form[1].value;
        const username = form[2].value;
        const password = form[3].value;
        const email = form[4].value;

        const body = JSON.stringify({
            name,
            lastname,
            username,
            password,
            email,
        });

        console.log(body);

        fetch('http://localhost:3000/users/register', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: body
        }).then(async res => {
            if(res.ok) {
                setTimeout(() => {
                    window.location.href = '/protected';
                }, 5000);
            } else {
                const { error } = await res.json();
                alert(error);
            }
        }).catch(() => {
            console.error('Error al realizar la petición al servidor');
        });
    });
}
