async function initRoles(){
    await pageIsReady();
    setupHandlers();
}

function pageIsReady(){
    return new Promise((resolve,reject)=>{
        let dashboard = document.querySelector('#dashboard');
        var observer = new MutationObserver(function(mutations){
            if(mutations===undefined){
                resolve();
            }
            mutations.forEach((mutation)=>{
                if(mutation.type === 'attributes'){
                    observer.disconnect();
                    resolve();
                }
                if(mutation.type === 'childList' && mutations.length === 1){
                    observer.disconnect();
                    resolve();
                }
            });
        });
        var config = {attributes: true, childList: true, characterData:true};
        observer.observe(dashboard,config);
    });
}

function setupHandlers(){
    let roleNameRows         = document.querySelectorAll('.roleRow');
    let editPanels           = document.querySelectorAll('.editRolePanel');
    let permissionCheckBoxes = document.querySelectorAll('.permCheckBox');
     
    roleNameRows.forEach((ele)=>{
        ele.addEventListener("click",()=>toggleStyling(ele));
    });
    editPanels.forEach((ele)=>{
        ele.addEventListener("click",(event)=>{
            event.stopPropagation();
        });
    });

    permissionCheckBoxes.forEach((ele)=>{
        ele.addEventListener('click',()=>modifyPermission(ele));
    });
}
function toggleStyling(ele){
    /*Ele children:
        0 = span with roleName
        1 = span with arrow
        2 = editRolePanel

        animation: animateArrow 0.2s linear;
        animation-fill-mode: forwards;
    */
    let arrow = ele.children[1];
    let editRolePanel = ele.children[2];
    // arrow.style.animation = "animateArrow 0.2s linear";
    // arrow.style.animationFillMode = "forwards";
    // arrow.style.animationState = "playing";
    if(arrow.classList.contains('clickedArrow')){
        arrow.classList.remove('clickedArrow');
        arrow.classList.add('unclickedArrow');
        arrow.style.animationState = "playing";
        editRolePanel.style.display = "none";
    }else if(arrow.classList.contains('unclickedArrow')){
        arrow.classList.remove('unclickedArrow');
        arrow.classList.add('clickedArrow');
        arrow.style.animationState = "playing";
        editRolePanel.style.display = "flex";
    }else{
        arrow.classList.add('clickedArrow');
        editRolePanel.style.display = "flex";        
    }
}

function modifyPermission(ele){
    let permission = ele.getAttribute('permission');
    let checked    = ele.checked;
    let roleId     = ele.parentElement.parentElement.getAttribute('id');

    axios.patch(`/role/${roleId}`,{
        permission,
        checked
    })
    .then((res)=>{
        console.log(`Got res ${res}`);
    })
    .catch((err)=>{
        console.log(`Got error: ${err}`);
    });
}

function loadAddRole(event,ele){
    const dashboard = document.getElementById('dashboard');

    const url = '/role/add';
    axios.get(url)
    .then((res)=>{
        dashboard.innerHTML = res.data;
    })
    .catch((err)=>{
        console.log(`Got error: ${err}`);
    });

    event.preventDefault();
}