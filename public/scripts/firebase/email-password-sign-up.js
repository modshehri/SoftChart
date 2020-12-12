const singupBtn = document.getElementById("signupBtn");
const emailTxt = document.getElementById("email_tf");
const passwordTxt = document.getElementById("password_tf");
const confirmPasswordTxt = document.getElementById("confirm_password_tf");

singupBtn.addEventListener('click', e => {
    email = emailTxt.value;
    password = passwordTxt.value;
    confirmPassword = confirmPasswordTxt.value;

    if (password.length > 7){
        if(password == confirmPassword){
            if (validateEmail(email)){
                promise = auth.createUserWithEmailAndPassword(email, password);
                promise.catch(e => {
                    alert("Authentecation failed please try again with valid email and password")
                });
            }else {
                alert("The email is not valid");
            }
        }else{
            alert("The password does not match its confirmation");
        }
    }else {
        alert("Password is too short (less than 8 characters)")
    }


});

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};