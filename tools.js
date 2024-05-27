function openTab(index, id) { 
    const tabContents = document.querySelectorAll(".tabcontent");
    tabContents.forEach(tabContent => {
        tabContent.style.display = "none";
    })
    const activeContent = document.querySelector(`#${id}`);
    activeContent.style.display = "block";

    const tabs = document.querySelectorAll(".tablinks");
    tabs.forEach(tab => {
        tab.style.boxShadow = "rgb(204, 204, 204) 0px 0.5px";
    })
    const activeTab = tabs[index-1];
    activeTab.style.boxShadow = "rgb(255, 255, 255) 0.5px 1px 0px";
}
