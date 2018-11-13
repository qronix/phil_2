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

function submitUserEdit(event,ele){
    try{
        ele.disabled = true;
        let data = getFormData();
        let dashboard = document.getElementById('dashboard');
        let userid = document.getElementById('userid').innerText;
        console.log(`userid ${userid}`);
        console.log(`data ${userid}`);
        axios.patch(`/users/${userid}`,{data}).then(response=>{
            if(response.status === 200){
                Notification.displayNotification('success',response.data);
                let id = setTimeout(()=>{
                    document.getElementById('usersLink').click();
                },2000);
            }
        }).catch((err)=>{
            console.log(err.data);
            Notification.displayNotification('error',err.response.data);
        });
    }catch(err){
        Notification.displayNotification('error',err);
    }
    event.preventDefault();
    ele.disabled = false;
}

function submitNewUser(event,ele){
    try{
        ele.disabled = true;
        let data = getFormData();
        let dashboard = document.getElementById('dashboard');
        axios.post(`/users`,{data}).then(response=>{
            console.log(`Got status ${response.status}`);
            if(response.status === 200){
                Notification.displayNotification('success',response.data);
                let id = setTimeout(()=>{
                    document.getElementById('usersLink').click();
                },2000);
            }else{
                window.location.href = "/";
            }
        }).catch((err)=>{
            console.log(err.data);
            Notification.displayNotification('error',err.response.data);
        });
    }catch(err){
        Notification.displayNotification('error',err);
    }
    event.preventDefault();
    ele.disabled = false;
}

function getFormData(){
    const targets = document.querySelectorAll('#usereditPanel input');
    let data = {};
    try{
        targets.forEach((input)=>{
            let id = input.getAttribute('id');
            let value = input.value;
            if(id !=='password' && id !=='confirmPassword'){
                if(value!==''){
                    data[id] = value;
                }else{
                    let idCaps = id[0].toUpperCase() + id.split(id[0])[1];
                    throw new Error(`${idCaps} cannot be blank`);
                }
            }else{
                data[id] = input.value; 
            }
        });
        data.role = document.getElementById('role').value;
        data = checkpasswords(data);
        return data;
    }catch(err){
        Notification.displayNotification('error',err.message);
    }
}

function checkpasswords(data){
    let {password,confirmPassword} = data;
    if(password!==''||confirmPassword!==''){
        if(password!==confirmPassword){
            throw new Error('Passwords do not match.');
        }else{
            return data;
        }
    }else{
        return data;
    }
}

function addUser(event,ele){ 
    const url = "/users/add";
    const dashboard = document.getElementById('dashboard');
    axios.get(url)
    .then((response)=>{
        if(response.status===200){
            dashboard.innerHTML = response.data;
        }
    })
    .catch((err)=>{
        Notification.displayNotification('error','Cannot add user at this time');
    });

    event.preventDefault();
}
