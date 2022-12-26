const form = document.getElementById('form');
const user = localStorage.getItem('username');
const pass = localStorage.getItem('password');
const regBtn = document.getElementById('regBtn');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    username == user &&  password == pass ? window.location.href = 'index.html' : alert('Incorrect username or password');
});

regBtn.addEventListener('click', () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
});