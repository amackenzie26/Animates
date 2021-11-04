// Get the modal
var loginModal = document.getElementById("loginModal");
var signupModal = document.getElementById("signupModal");

async function loginFormHandler(event) {
    event.preventDefault();

    const username = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if (username && password) {
        const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                username,
                password
            }),
            headers: { 'Content-Type': 'application/json'}
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        }else {
            alert('Failed to log in');
        }
    }
}
//login modal
function loginDisplay(event) {
    event.preventDefault()
    console.log("login modal display activated")
    loginModal.style.display="inline"
}
//signup modal
function signupDisplay(event) {
    event.preventDefault()
    console.log("signup modal activated")
    signupModal.style.display="inline"
}

// Hides login modal by clicking on window
window.onclick = (function(event){
    event.preventDefault()
    if (event.target == loginModal){
      loginModal.style.display="none"
      
    } if (event.target == signupModal) {
        signupModal.style.display="none"
    }
  })

//click to redirect to signup modal
document.querySelector('#signupRedirect').addEventListener('click', signupDisplay);

//Hides signup modal by clicking on window
// window.onclick = (function(event){
//     if (event.target == signupModal){
//       signupModal.style.display="none"
//     }
//   })
document.querySelector('#login').addEventListener('click', loginDisplay);
// document.querySelector('#signup').addEventListener('click', signupDisplay);
// document.querySelector('.login-form').addEventListener('submit', loginFormHandler);