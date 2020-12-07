const loginBtn = document.getElementById("loginBtn");
const emailTxt = document.getElementById("email_tf");
const passwordTxt = document.getElementById("password_tf");


loginBtn.addEventListener('click', e => {
    email = emailTxt.value;
    password = passwordTxt.value;
    
    promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(e => {
        alert("Authentecation failed please try again with valid email and password")
    });
});
