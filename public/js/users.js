function handleEdit(event,ele){
    let dashboard = document.getElementById('dashboard');
    let endpoint = ele.getAttribute('href');

    axios(endpoint)
    .then((res)=>{
        dashboard.innerHTML = res.data;
    })
    .catch((err)=>{
        console.log(`Got err: ${err}`);
    });
    event.preventDefault();
}

function cancelEdit(event,ele){
    let dashboard = document.getElementById('dashboard');

    axios('/users')
    .then((res)=>{
        dashboard.innerHTML = res.data;
    })
    .catch((err)=>{
        console.log(`Got err: ${err}`);
    });
    event.preventDefault();
}

async function submitUserEdit(event,ele){
    try{
        if(checkpasswords()){
            let data = getFormData();
            let dashboard = document.getElementById('dashboard');
            let userid = document.getElementById('userid');

            let response = await axios.patch(`/users/${userid}`,{
            });
        }else{
            throw new Error('Password confirmation failed');
        }
    }catch(err){
        Notification.displayNotification('error',err);
    }
}

function getFormData(){
    const targets = document.querySelectorAll('#usereditPanel input');
    let data = {};
    try{
        targets.forEach((input)=>{
            let id = input.getAttribute('id');
            let value = input.value;
            if(id !=='password' && id!=='confirmPassword'){
                if(value!==''){
                    data[id] = value;
                }else{
                    let idCaps = id[0].toUpperCase() + id.split(id[0])[1];
                    throw new Error(`${idCaps} cannot be blank`);
                }
            }
        });
        data.role = document.getElementById('role').value;
        console.log(data);
    }catch(err){
        Notification.displayNotification('error',err.message);
    }
}

function checkpasswords(){
    let passwordInput = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;

    if(passwordInput!==''||confirmPassword!==''){
        if(passwordInput!==confirmPassword){
            Notification.displayNotification('error','Passwords do not match');
            return false;
        }else{
            return true;
        }
    }else{
        return true;
    }
}

