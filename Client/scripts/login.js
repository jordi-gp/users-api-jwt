window.onload = main;

function main() {
    sendLoginForm();
}

function sendLoginForm() {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', e => {
        e.preventDefault();

        const username = form[0].value;
        const password = form[1].value;

        const body = JSON.stringify({username: username, password: password});

        fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
