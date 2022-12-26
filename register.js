const form = document.getElementById('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    //Si existe un usuario y una contraseña, se redirige a la pagina principal
    //Y se guardan los datos en el localStorage
    //Si no, se muestra un mensaje de error
    username.length &&  password.length ? (
        window.location.href = 'index.html',
        localStorage.setItem('username', username),
        localStorage.setItem('password', password)
    ) : alert('Please fill in all fields');
});