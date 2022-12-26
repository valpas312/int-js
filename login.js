const form = document.getElementById('form');
const user = localStorage.getItem('username');
const pass = localStorage.getItem('password');
const regBtn = document.getElementById('regBtn');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    //Si el usuario y la contraseña son correctos, se redirige a la pagina principal
    //Si no, se muestra un mensaje de error
    username == user &&  password == pass ? window.location.href = 'index.html' : alert('Incorrect username or password');
});

//Si el usuario quiere registrarse devuelta, se borran los datos del localStorage para mantener un control simple
regBtn.addEventListener('click', () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
});