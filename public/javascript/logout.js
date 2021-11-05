async function logout() {
    console.log('hello world');
    const response = await fetch('/api/users/logout', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        console.log('response ok');
        document.location.replace('/');
    } else {
        alert(response.statusText);
    }
}
document.querySelector('#logout').addEventListener('click', logout);