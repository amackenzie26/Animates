// Get the modal
var loginModal = document.getElementById("loginModal");
var signupModal = document.getElementById("signupModal");
var isSignupActive =false; 
var isLoginActive =false; 
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
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            document.location.replace('/');
        } else {
            alert('Failed to log in');
        }
    }
}
//login modal
function loginDisplay(event) {
    event.preventDefault()
    console.log("login modal display activated")
    isLoginActive = true; 
    loginModal.style.display = "inline"
}
//signup modal
function signupDisplay(event) {
    event.preventDefault()
    console.log("signup modal activated"); 
    isSignupActive = true; 
    signupModal.style.display = "inline"
}

// Hides login modal by clicking on window
window.onclick = (function (event) {
    event.preventDefault(); 
    //console.log(event.target, loginModal, signupModal); 
    if(isLoginActive){ 
        signupModal.style.display = "none"
        isLoginActive = false; 
        console.log("deactivate login ", isLoginActive); 
    }else { 
        loginModal.style.display = "none"
    }

    if(isSignupActive){ 
        loginModal.style.display = "none"
        isSignupActive = false; 
        console.log("deactivate signup ", isSignupActive); 
    }else { 
        signupModal.style.display = "none"
    }


    // if (event.target == signupModal) {
    //     signupModal.style.display = "none"
    // }
})

//click to redirect to signup modal
document.querySelector('#signupRedirect').addEventListener('click', signupDisplay);

//Hides signup modal by clicking on window
// window.onclick = (function(event){
//     if (event.target == signupModal){
//       signupModal.style.display="none"
//     }
//   })
// console.log(document.querySelector('#login'));
if (document.querySelector('#login') !== null) {
    document.querySelector('#login').addEventListener('click', loginDisplay);
}
// document.querySelector('#signup').addEventListener('click', signupDisplay);
document.querySelector('#submitLogin').addEventListener('click', loginFormHandler);