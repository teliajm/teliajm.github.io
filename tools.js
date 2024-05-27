const tabs = document.querySelectorAll(".tablinks");
if(tabs) tabs[0].style.fontWeight = "600";
function openTab(index, id) { 
    const tabContents = document.querySelectorAll(".tabcontent");
    tabContents.forEach(tabContent => {
        tabContent.style.display = "none";
    })
    const activeContent = document.querySelector(`#${id}`);
    activeContent.style.display = "block";

    const tabs = document.querySelectorAll(".tablinks");
    tabs.forEach(tab => {
        tab.style.fontWeight = "normal";
    })
    const activeTab = tabs[index-1];
    activeTab.style.fontWeight = "600";
}
