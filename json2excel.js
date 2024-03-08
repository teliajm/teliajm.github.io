/* Settings */
const downloadJSON = false
const shortTimestamp = true
const baseUrl = "https://cso-internal.ccs.teliacompany.net"
const recordingBaseUrl = "https://tools-k8s.ace.teliacompany.net/voice/convhub/monitor/recordings/"

/* Initialize "events choice" if not set already, default to include */
if(localStorage.getItem("j2e_includeEvents") === null) localStorage.setItem("j2e_includeEvents", "checked")

/* Toggle function for including or excluding events */
function toggleIncludeEvents(event) {
    if(event.target.checked) localStorage.setItem("j2e_includeEvents", "checked")
    else localStorage.setItem("j2e_includeEvents", "")
}

/* Import Excel functionality */
let XLSX = {}
await import('https://teliajm.github.io/xlsx.mjs').then(m => XLSX = m)

let jsonData = {}

/* Intercept request headers to reuse for API calls (including bearer token) */
const requestHeaders = {}
const originalXMLHttpRequest_setRequestHeader = XMLHttpRequest.prototype.setRequestHeader
XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
    requestHeaders[header] = value
    originalXMLHttpRequest_setRequestHeader.call(this, header, value)
}

/* Intercept API calls to get current history search */
const originalXMLHttpRequest_open = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, async, user, password) {

    if(!url.includes("/history/v1/dialogs")) return originalXMLHttpRequest_open.apply(this, arguments)
    
    this.addEventListener('load', function() {
        if(this.responseText && this.responseText.includes("page_count")) {
            jsonData = JSON.parse(this.responseText)
            jsonData.requestUrl = url
            insertDownloadButton(jsonData?.total)
        }
    })
               
    return originalXMLHttpRequest_open.apply(this, arguments)
}

/* Add download button to Dialogs tab */
async function insertDownloadButton(dialogsCount) {
    const downloadButton = document.querySelector("button.download")
    if(downloadButton) {
      if(dialogsCount === 0) downloadButton.remove()
      else downloadButton.innerText = `Download ${dialogsCount} logs`
      return
    }
    const searchButton = document.querySelector(".ca-config-table-container .ca-search-button:not(.download)")
    searchButton.insertAdjacentHTML("afterEnd",`
    <button onclick="downloadLogs()" style="margin-left:10px" type="button" class="download v-btn v-btn--is-elevated v-btn--has-bg theme--light v-size--small primary">
        <span class="v-btn__content">
             Download ${dialogsCount} logs
        </span>
    </button>
    <input ${localStorage.getItem("j2e_includeEvents")} onclick="toggleIncludeEvents(event)" style="margin-left: 10px" type="checkbox" id="includeEvents"> 
    <label style="margin-left: 10px" for="includeEvents">Include events</label>
    `)
}

/* Download logs on button click */
let downloading = false
async function downloadLogs() {
    
    if(downloading || !jsonData?.requestUrl) return

    const urlParams = new URLSearchParams(window.location.search)
    const apiParams = new URLSearchParams(jsonData.requestUrl.split("?").pop())

    let extension = urlParams.get("extension")
    if(extension) extension += "_"
    else extension = ""

    const startDate = apiParams.get("date-from").split("T")[0].replace(/-/g,"")
    const untilDate = apiParams.get("date-to").split("T")[0].replace(/-/g,"")
    
    downloading = true
    const button = document.querySelector("button.download")

    /* Create the JSON download file */
    var json = await createLogFile(startDate, untilDate)

    transformJsonToExcel(json, extension, startDate, untilDate)

    if(downloadJSON) {
        var blob = new Blob([JSON.stringify(json)], {type: "application/json"})
        var url  = URL.createObjectURL(blob)
        
        var a = document.createElement('a')

        a.download = `${extension}${startDate}-${untilDate}.json`
        a.href = url
        a.target = "_blank"
        a.click() 
    }
    
    /* Reset download button */
    downloading = false
    button.innerText = `Download ${jsonData.total} logs`
    
}

async function transformJsonToExcel(json, extension, startDate, untilDate) {

    /* Include events or not */
    const includeEvents = document.querySelector("#includeEvents").checked
    
    /* Regular expression to remove HTML */
    let regex = /(<([^>]+)>)/ig
    
    /* Create worksheet from JSON */
    let rows = []
    
    for (var dialog in json.dialogs) {
        dialog = json.dialogs[dialog]
        let customer = dialog?.customer_name
        let channel = dialog?.channel
        let channel_session_id = dialog?.channel_session_id
        let termination_reason = dialog?.termination_reason
        for(var session in dialog.sessions) {
            session = dialog.sessions[session]
            let session_id = session?.remote_agent_session_id
            let dialog_id = session?.dialog_id

            let timestamp = ""
            let utterenceRecordingId = ""
            let transcript = ""
            let eventName = ""
            let currentPage = ""
            let response = ""
            let intent = ""
            let parameters = ""
            let userInput = false

            let timestamp_len = 0
            let customer_len = 0
            let channel_len = 0
            let channel_session_id_len = 0
            let termination_reason_len = 0
            let session_id_len = 0
            let dialog_id_len = 0
            let transcript_len = 0
            let utterenceRecordingId_len = 0
            let response_len = 0
            let intent_len = 0
            let currentPage_len = 0
            let parameters_len = 0

            let step = 0
            
            for(var event in session.dialog_events) {
                event = session.dialog_events[event]

                if(event?.type == "INPUT") {
                    userInput = false
                    
                    timestamp = event?.created
                    utterenceRecordingId = event?.payload?.input?.speechRecognitionInput?.utterenceRecordingId
                    if(event?.payload?.input?.eventInput?.name) {
                        eventName = event?.payload?.input?.eventInput?.name
                        if(includeEvents) userInput = true
                    }
                    else if(event?.payload?.input?.systemEventInput?.type) {
                        eventName = event?.payload?.input?.systemEventInput?.type
                        userInput = true
                    }
                    else {
                        eventName = ""
                        transcript = event?.payload?.input?.speechRecognitionInput?.recognitionResults[0]?.transcription?.transcript
                        userInput = true
                    }

                    if(shortTimestamp && timestamp && timestamp.indexOf(".") !== -1) timestamp = timestamp.split(".")[0].replace("T"," ")

                    if(!transcript) transcript = ""
                    if(!eventName) eventName = ""
                    if(timestamp.length > timestamp_len) timestamp_len = timestamp.length
                    if(transcript.length > transcript_len) transcript_len = transcript.length
                }
                if(event?.type == "DIALOGFLOW_CX_RESPONSE") {
                    if(event?.payload?.matchType === "INTENT") {
                        intent = event?.payload?.intent
                    }
                    else if(event?.payload?.matchType === "NO_INPUT") {
                        intent = ""
                    }
                    currentPage = event?.payload?.currentPage
                }
                if(event?.type == "OUTPUT") {
                    if(event?.payload?.output?.responses) {
                        response = event?.payload?.output?.responses[0]?.directAudioResponse?.transcript
                        if(response) response = response.replace(regex, "")
                    }
                    else response = ""
           
                    parameters = event?.payload?.output?.action?.transferOperatorAction?.parameters
                    if(parameters) parameters = JSON.stringify(parameters)

                    if(userInput) {
                        step++
                        rows.push({
                            "Timestamp": timestamp,
                            "Customer": customer,
                            "Channel": channel,
                            "C-Session ID": channel_session_id,
                            "Termination Reason": termination_reason,
                            "Session ID": session_id,
                            "Dialog ID": dialog_id,
                            "Nr": step,
                            "Event": eventName,
                            "Transcript": transcript,
                            "Utterance Recording ID": utterenceRecordingId,
                            "Response": response,
                            "Intent": intent,
                            "Page": currentPage,
                            "Parameters": parameters
                        })
                    }
                }
            }
        }
    }    
    let worksheet = XLSX.utils.json_to_sheet(rows);

    /* Set row widths */
    worksheet["!cols"] = [
        { wch: 17 }, // Timestamp
        { wch: 11 }, // Customer
        { wch: 15 }, // Channel
        { wch: 10 }, // Channel session ID
        { wch: 19 }, // Termination reason
        { wch: 35 }, // Session ID,
        { wch: 35 }, // Dialog ID
        { wch: 2 },  // Nr
        { wch: 15 }, // Event        
        { wch: 25 }, // Transcript
        { wch: 35 }, // UtteranceID
        { wch: 30 }, // Response
        { wch: 24 }, // Intent
        { wch: 35 }, // Page
        { wch: 40 }, // Parameters
    ]

    /* Make Utterance ID a clickable link */
    Object.keys(worksheet).filter(k => k[0] === "K").filter(v => worksheet[v].v).forEach(c => {
        worksheet[c].l = { Target: `${recordingBaseUrl}${worksheet[c].v}`, Tooltip: `${recordingBaseUrl}${worksheet[c].v}` }
    })

    /* Set filename to (first) customer name if no extension */
    if((!extension || extension === "") && rows.length > 0 && rows[0]?.Customer) extension = rows[0]?.Customer + "_"
    
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Conversational Hub logs");
    XLSX.writeFile(workbook, `${extension}${startDate}-${untilDate}.xlsb`);    
}

async function createLogFile(startDate, untilDate) {

    const button = document.querySelector("button.download")
    button.innerText = "Please wait..."
    
    let dialogs = []
    let dialogsUrl = jsonData.requestUrl.replace(/page=[0-9]*/,"page=1").replace(/page-size=[0-9]*/,"page-size=50")
    let response = await fetch(dialogsUrl, {
      "headers": requestHeaders,
      "method": "GET"
    })
    let result = await response.json()
    let pageCount = result.page_count
    result?.dialogs.forEach(dialog => {
        dialogs.push(dialog.id)
    })
    if(pageCount > 1) {
        for(page = 2; page <= pageCount; page++) {
            let dialogsUrl = jsonData.requestUrl.replace(/page=[0-9]*/,"page=" + page).replace(/page-size=[0-9]*/,"page-size=50")
            const response = await fetch(dialogsUrl, {
              "headers": requestHeaders,
              "method": "GET"
            })
            const result = await response.json()
            result?.dialogs.forEach(dialog => {
                dialogs.push(dialog.id)
            })
        }
    }
    
    const delay = (ms = 0) => new Promise((r) => setTimeout(r, ms))

    const dialogCount = jsonData?.dialogs.length
    let iterator = 0

    let json = {dialogs: []}

    await Promise.all(
      //dialogs.slice(0,10).map(async (dialog, index) => {
      dialogs.map(async (dialog, index) => {  
        await delay(index * 50)
      
        const response = await fetchDialogJson(dialog) 
        const result = await response.json()
        json.dialogs.push(result)
        
        iterator++                
        button.innerText = "Logs fetched: " + iterator          
          
      })
    )

    /* Sort cronologically */
    json.dialogs.sort((a, b) => (a.created_at > b.created_at) ? 1 : -1)

    return json
    
}

async function fetchDialogJson(dialogId) {
    const dialogUrl = `${baseUrl}/history/v1/dialogs/${dialogId}?minimal=false`
    const json = await fetch(dialogUrl, {
      "headers": requestHeaders,
      "method": "GET"
    })
    return json
}
