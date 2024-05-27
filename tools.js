function openTab(index, id) { 
    const tabContents = document.querySelectorAll(".tabcontent");
    tabContents.forEach(tabContent => {
        tabContent.style.display = "none";
    })
    const activeContent = document.querySelector(`#${id}`);
    activeContent.style.display = "block";
}
