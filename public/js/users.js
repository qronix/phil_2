function handleEdit(event,ele){
    let dashboard = document.getElementById('dashboard');
    let endpoint = ele.getAttribute('href');
    console.log('STUFF');
    axios(endpoint)
    .then((res)=>{
        dashboard.innerHTML = res.data;
    })
    .catch((err)=>{
        console.log(`Got err: ${err}`);
    });
    event.preventDefault();
}

