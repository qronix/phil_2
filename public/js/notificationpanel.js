let notificationPanel = document.getElementById('notificationPanel');
notificationPanel.classList.toggle('notificationHidden');

async function displayNotification(msgType,message){
    if(isRealString(message)&&isRealString(msgType)){
        if(msgType==='error'){
            notificationPanel.classList.add('errorMessage');
        }else if(msgType ==='warning'){
            notificationPanel.classList.add('warningMessage');
        }else if(msgType === 'success'){
            notificationPanel.classList.add('successMessage');
        }else{
            notificationPanel.classList.add('warningMessage');
        }
    
        notificationPanel.innerText = message;
        notificationPanel.classList.toggle('notificationHidden');
        await msgDisplayTimer();
        resetPanel();
    }else{
        throw new Error('Message or message type sent to notifcation system is not a string');
    }
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