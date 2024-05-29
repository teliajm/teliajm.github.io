
document.addEventListener("DOMContentLoaded", function() {
    function waitForHumany(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    //observer.disconnect();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    waitForHumany(".humany-widget").then(elm => {
        const {fetch: origFetch} = window;
        window.fetch = async (...args) => {
          const response = await origFetch(...args);
          if(args.length > 0 && args[0].indexOf("/contacts") !== -1) {
              response
                .clone()
                .json()
                .then(json => {           
                    if(json.Matches === -1) return;
                    matchList = json.Matches;
                    if(matchList !== null){
                        var entrancesAndIds = matchList.map(match => {
                            var id = match.Id;
                            var entrance = match.Exits[0].Adapter?.Settings?.entrance;
                            if(entrance) return {entrance, id};
                        }).filter(item => item !== undefined);
                        waitForHumany(".humany-contact-list").then(elm =>{
                            getOpeningHours(entrancesAndIds)
                        })
                    }
                    
                })
                .catch(err => console.error(err)) 
          }
          return response;
        };
    });    
})

/*API-call for getting the opening hours*/
async function getOpeningHours(entrancesAndIds){
    entrancesAndIds.forEach(async ({entrance, id}) => {
        if (!entrance) return;

        const customer = "eon";
        const days = "1";
        const todayTimeStamp = new Date().getTime();
        const yesterdayTimeStamp = todayTimeStamp - 24 * 60 * 60 * 1000;
        const yesterday = new Date(yesterdayTimeStamp);
        const date = yesterday.toLocaleString('sv-SE', { year: 'numeric', month: 'numeric', day: 'numeric' });
        const url = `https://api.ace.teliacompany.net/webapi/client/${customer}/1/entrances/${entrance}/opening-hours?startTime=${date}T22:00:00.000Z&days=${days}`;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {
            var jsonResponse = JSON.parse(xhr.responseText);
            createOpeningHours(jsonResponse, id)
          }
        }
        xhr.send();
    });
}
/*Create the element that contains the opening hours*/
function createOpeningHours(jsonResponse, id){
    var contactMethodId = id;
    var interval ="";
    var openingInterval = jsonResponse.resultData.openingHours[0].intervals;

    for (let i = 0; i < openingInterval.length; i++) {
        var openHours = openingInterval[i];
        var openingString = openHours.open;
        var openingDate = new Date(openingString);
        var openingHour = openingDate.getHours();
        var openingMinute = openingDate.getMinutes();
        
        var closingString = openHours.close;
        var closingDate = new Date(closingString);
        var closingHour = closingDate.getHours();
        var closingMinute = closingDate.getMinutes();
        if(openingHour === 0 && closingHour === 0){
            closingHour = 24;
        }

        if(openingMinute !== 0 && closingMinute !== 0){
            interval += openingHour + ':' + openingMinute + '-' + closingHour + ':' + closingMinute;
        }
        else if(openingMinute !== 0){
            interval += openingHour + ':' + openingMinute + '-' + closingHour;
        }
        else if(closingMinute !== 0){
            interval += openingHour + '-' + closingHour + ':' + closingMinute;
        }
        else{
            interval += openingHour + '-' + closingHour;
        }
        
        
        if (i !== openingInterval.length - 1) {
            interval += ', ';
        }
    }
    var timeSpan = document.createElement('span');
    timeSpan.setAttribute('aria-label', 'Öppet vardagar: ' + interval);
    timeSpan.innerText = "Öppet vardagar: "+interval;
    var contactMethod = document.querySelector(`.humany-contact-list .humany-list li[data-contact-method="${contactMethodId}"]`)
    if(contactMethod){
        contactMethod.querySelector('.humany-html').appendChild(timeSpan)
        /*span if inline*/
        var timeSpan = document.createElement('span');
        timeSpan.setAttribute('aria-label', 'Öppet vardagar: ' + interval);
        timeSpan.setAttribute('class', 'openingHours');
        timeSpan.innerText = "Öppet vardagar: "+interval;
    }
    else if(document.querySelector(`.humany-conversation:last-child li:last-of-type .humany-conversation-group-list-agent .humany-contact-list .humany-list li[data-contact="${contactMethodId}"]`)){
        contactMethod =document.querySelector(`.humany-conversation:last-child li:last-of-type .humany-conversation-group-list-agent .humany-contact-list .humany-list li[data-contact="${contactMethodId}"] .humany-description`)
        /*p if chatbot*/
        var timeSpan = document.createElement('p');
        timeSpan.setAttribute('aria-label', 'Öppet vardagar: ' + interval);
        timeSpan.setAttribute('class', 'openingHours');
        timeSpan.innerText = "Öppet vardagar: "+interval;
        contactMethod.appendChild(timeSpan)
    }
}

/*Checks the contact methods inside a chatbot*/
function getContactMethodInformation(){
    var contactMethods = Array.from(humany.aceContactMethods);
    var contactList = document.querySelectorAll('.humany-bot-widget .humany-conversation:last-child li:last-of-type .humany-conversation-group-list-agent .humany-contact-list li');
    if(contactMethods.length > 0 && contactList){
        var entrancesAndIds = Array.from(contactList).map((contact, i) => {
            var id = contact.getAttribute('data-contact');
            var contactResult = JSON.parse(contactMethods[i]);
            var entrance = contactResult.entrance;
            if(entrance) return {entrance, id};
        }).filter(item => item !== undefined);

        getOpeningHours(entrancesAndIds);
    }
}


function elmFound (event){
    if(event.animationName === 'contactMethodVisible'){
        getContactMethodInformation()
    }    
}

document.head.appendChild(document.createElement("style")).innerHTML = `
    .humany-bot-widget .humany-contact-list .humany-contact-method {
        animation-duration:.001s;
        animation-name:contactMethodVisible
    }
    @keyframes contactMethodVisible{from{opacity:.99}to{opacity:1}}
`
document.addEventListener("animationstart", elmFound, false);
document.addEventListener("MSAnimationStart", elmFound, false);
document.addEventListener("webkitAnimationStart", elmFound, false);
