let latestUpdatesInterval,newServiceWorker;
const toast=document.querySelector('.new-version-toast');


startServiceWorker();
startControllerChangeEventListener();


function startServiceWorker(){
    if(!('serviceWorker' in navigator))return;
    window.addEventListener('load', async()=> {
        try {
            const registration=await navigator.serviceWorker.register('./service-worker.js');
            checkLatestUpdates(registration);
        } catch (error) {
            console.log(error)
        }
    });
}

function startControllerChangeEventListener(){
  let refreshing;
  navigator.serviceWorker.addEventListener('controllerchange',  ()=> {
    console.log("control change")
    if (refreshing) return;
    window.location.reload(true);
    refreshing = true;
  });
}


function checkLatestUpdates(registration){
  registration.update();
  runUpdate(registration);
  if (newServiceWorker){
    postSkipWaitingMessage();
    return;
  }
  let milliseconds=5000;
  latestUpdatesInterval=setInterval(runUpdate,milliseconds,registration)
}

function runUpdate(registration) {
  console.log("runUpdate")

  registration.update()
  if (!registration.waiting)return ;
  newServiceWorker = registration.waiting;
  if (!navigator.serviceWorker.controller)return;
  showToast();
  clearInterval(latestUpdatesInterval);
}

function postSkipWaitingMessage(){
  newServiceWorker.postMessage({ action: 'skipWaiting' });
}

toast.addEventListener('click',()=>{
    postSkipWaitingMessage();
    hideToast()
});

function showToast(){
    toast.classList.remove('hide');
}
function hideToast(){
    toast.classList.add('hide')
}