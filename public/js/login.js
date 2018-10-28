let loginButton = document.getElementById('loginSubmitButton');

loginButton.addEventListener('click',(event)=>{
    login();
    event.preventDefault();
});

var login = async ()=>{
    let usernameInput = document.getElementById('userName');
    let passwordInput = document.getElementById('password');
    let username = usernameInput.value;
    let password = passwordInput.value;
    if(isRealString(username) && isRealString(password)){
        try{
            axios.post(window.location + 'users/login',{
                username,
                password
            }).then(function(response){
                document.open();
                document.write(response.data);
                document.close();
            }).catch(function(error){
                let err = JSON.parse(JSON.stringify(error));
                let errorMessage = err.response.data.error;
                Notification.displayNotification('error',errorMessage).catch((err)=>console.log(err));
            });
        }catch(err){
             Notification.displayNotification('error',err.message).catch((err)=>console.log(err));
        }
    }else{
        if(!isRealString(username)&&!isRealString(password)){
             Notification.displayNotification("error","Credentials cannot be blank").catch((err)=>console.log(err));
        }
        else if(!isRealString(username)){
             Notification.displayNotification('error',"Username is invalid").catch((err)=>console.log(err));
        }else if(!isRealString(password)){
             Notification.displayNotification('error',"Password is invalid").catch((err)=>console.log(err));
        }
    }
    usernameInput.value="";
    passwordInput.value="";
}