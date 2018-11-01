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
    let dashboard = document.getElementById('dashboard');
    let userid = document.getElementById('userid');
    let response = await axios.patch(`/users/${userid}`);

    


}

