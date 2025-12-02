export function showAlert(type, message) {
    const prevAlert = document.getElementById('alert');

    if(prevAlert === null) {
        const alertContainer = document.getElementById('alert-container');
        const alert = document.createElement('div');
        const alertContent = document.createTextNode(message);

        alert.setAttribute('class', `alert alert-${type}`);
        alert.setAttribute('id', 'alert');
        alert.setAttribute('role', 'alert');

        alert.appendChild(alertContent);
        alertContainer.appendChild(alert);
    }
}

export function hideAlert() {
    const alert = document.getElementById('alert');
    alert.remove();
}
