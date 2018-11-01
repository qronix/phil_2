function initSideBar(){
    let dashboard = document.getElementById('dashboard');
    let linkTargets = document.querySelectorAll('.sideNavRow');
    let sideBar = document.getElementById('side-bar');
    let sideRows = document.querySelectorAll('.sideNavRow');

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
    sideBar.addEventListener('mouseenter',(event)=>{
        sideBar.style.width = '200px';
        toggleLinks();

    });
    sideBar.addEventListener('mouseleave',(event)=>{    
        toggleLinks();
        sideBar.style.width = '50px';
        dashboard.style.marginLeft = '50px';
    });
}

function toggleLinks(){
    let sideLinks = document.querySelectorAll('.sideNavLink');
    let icons = document.querySelectorAll('.navIcon');
    let phoneIcon = document.getElementById('phoneIcon');
    
    try{
        phoneIcon.classList.toggle('phoneIconShift');
    }catch(err){
    }

    icons.forEach((icon)=>{
        icon.classList.toggle('floatLeft');
    });
    
    sideLinks.forEach((link)=>{
        link.classList.toggle('hidden');
    });
}