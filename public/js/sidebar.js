function initSideBar(){
    let dashboard = document.getElementById('dashboard');
    let linkTargets = document.querySelectorAll('.sideNavRow');

    linkTargets.forEach((target)=>{
        let endpoint = target.getAttribute('id').split('L')[0];
        target.addEventListener('click',(event)=>{
             
            event.preventDefault();
        });
    });
}