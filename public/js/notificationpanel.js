let notificationPanel = document.getElementById('notificationPanel');
notificationPanel.classList.toggle('notificationHidden');

async function displayNotification(msgType,message){
    switch(msgType){
        case "error":{
            notificationPanel.classList.add('errorMessage');
        }
    }
    notificationPanel.classList.toggle('notificationHidden');
    console.log('showing message');
    await msgDisplayTimer();
    resetPanel();
    console.log('hiding message');
}

function msgDisplayTimer(){
    return new Promise((resolve,reject)=>{
        let id = setTimeout(()=>{clearTimeout(id);resolve();},2000);

    });
}

function resetPanel(){
    notificationPanel.classList.toggle('notificationHidden');
    notificationPanel.classList.remove('errorMessage');
    notificationPanel.classList.remove('warningMessage');
    notificationPanel.classList.remove('successMessage');
}