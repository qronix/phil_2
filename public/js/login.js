let loginButton = document.getElementById('loginSubmitButton');

loginButton.addEventListener('click',(event)=>{
    console.log('logging in');
    login();
    event.preventDefault();
});

var login=()=>{
    let username = document.getElementById('userName').value;
    let password = document.getElementById('password').value;

    console.log(`Username: ${username} and password: ${password}`);
    displayNotification('error','Test error message');
}