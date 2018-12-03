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
    let rolenameRows         = document.querySelectorAll('.roleRow');
    let editPanels           = document.querySelectorAll('.editRolePanel');
    let permissionCheckBoxes = document.querySelectorAll('.permCheckBox');
     
    rolenameRows.forEach((ele)=>{
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
        0 = span with rolename
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

function cancelNewRole(event,ele){
    const rolesLink = document.getElementById('rolesLink');
    rolesLink.click();
    event.preventDefault();
}

function submitNewRole(event,ele){
    try{
        debugger;
        if(rolename=checkrolename()){
            if(permissions = getPermissions()){
                const data = buildRoleData(rolename, permissions);
                if(data){
                    const url = '/role';
                    axios.post(url,{
                        data
                    })
                    .then((res)=>{
                        console.log(`Got response: ${res}`);
                    })
                    .catch((err)=>{
                        console.log(`Got error: ${err}`);
                    });
                }
            }else{
                Notification.displayNotification('error','Permission data is invalid');
                return false;
            }
        }else{
            Notification.displayNotification('error','rolename is invalid');
            return false;
        }
    }catch(err){
        console.log(`Error occurred ${err}`);
        Notification.displayNotification('error','An error occurred, could not submit new role');
    }
    event.preventDefault();
}

function checkrolename(){
    const rolename = document.getElementById('roleName').value.trim();
    if(rolename.length === 0 || rolename==='' || rolename===undefined){
        return false;
    }else{
        return rolename;
    }
}

function getPermissions(){
    const permissions = document.querySelectorAll('.rolePerm');
    return permissions;
}

function buildRoleData(rolename, permissionData){
    let permissions = {};
    if(permissionData.length !==0){
        permissionData.forEach((item)=>{
            let permissionName = item.children[0].innerText;
            let permissionValue = item.children[1].checked;
            permissions[permissionName] = permissionValue;
        });
        let data = {
            rolename,
            permissions
        };
        return data;
    }else{
        throw new Error('Permissions data is invalid');
    }
}