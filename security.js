function openProModal() {
    document.getElementById('password-modal').style.display = 'flex';
}

function closeProModal() {
    document.getElementById('password-modal').style.display = 'none';
    document.getElementById('pro-password').value = '';
    document.getElementById('error-message').innerText = '';
}

// Lista de accesos permitidos. Cada objeto contiene el hash de la contraseña y la URL encriptada.
// Para agregar nuevos códigos, usa el generador.html
const accessList = [
    // Ejemplo: Contraseña "888@protest"
    {
        // Contraseña: "888@protest"
        hash: "ebdd95c7fbb9216e20018bf0e32323b67e9fdac6c8c7cc527ee3f085bb18030f",
        payload: "U2FsdGVkX18wYV3/cOd+TZZpACsyBo04qrU+ICsHMRCV3EKlUET46NQuxRGn0k/o"
    }
];

function verifyPassword() {
    const password = document.getElementById('pro-password').value;
    const errorMsg = document.getElementById('error-message');
    
    if(!password) {
        errorMsg.innerText = "Por favor, ingresá un código.";
        return;
    }

    // Calcular el hash SHA256 de la contraseña ingresada
    const hash = CryptoJS.SHA256(password).toString();

    // Buscar si el hash existe en nuestra lista
    const match = accessList.find(item => item.hash === hash);

    if (match) {
        // La contraseña es correcta (el hash coincide).
        // Intentamos desencriptar la URL usando la contraseña ingresada como llave.
        try {
            const bytes = CryptoJS.AES.decrypt(match.payload, password);
            const url = bytes.toString(CryptoJS.enc.Utf8);
            
            if(url && url.includes('pro-')) {
                // Redirigir a la URL desencriptada
                window.location.href = url;
            } else {
                errorMsg.innerText = "Error al procesar el acceso.";
            }
        } catch(e) {
            errorMsg.innerText = "Error de desencriptación.";
        }
    } else {
        errorMsg.innerText = "Código incorrecto. Inténtalo nuevamente.";
    }
}

// Permitir presionar "Enter" para enviar
document.getElementById('pro-password').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        verifyPassword();
    }
});
