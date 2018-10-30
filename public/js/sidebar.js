function initSideBar(){
    let dashboard = document.getElementById('dashboard');
    let linkTargets = document.querySelectorAll('.sideNavRow');

    linkTargets.forEach((target)=>{
        let endpoint = target.getAttribute('id').split('L')[0];
        let urlRoot = window.location.href.split('/dashboard')[0];
        let url = `${urlRoot}/${endpoint}`;
        target.addEventListener('click',(event)=>{
            if(endpoint==='home' || endpoint==='signout'){
                window.location.href = `${urlRoot}/${endpoint}`;
            }else{
                axios(url)
                .then((response)=>{
                    dashboard.innerHTML = response.data;
                })
                .catch((error)=>{
                    console.log(error);
                });
                event.preventDefault();
            }
        });
    });
}