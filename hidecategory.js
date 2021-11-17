var humany_hideLastCategory = ( function(){

  document.head.appendChild(document.createElement("style")).innerHTML = `
      .humany-route-link {
          animation-duration:.001s;
          animation-name:hideLastCategory}
      @keyframes hideLastCategory {
          from{opacity:.99}to{opacity:1}
      }  
  `;

  var hideLastCategory = function(event) {
    //console.log("Something was added:" + event.target.innerText);
    if (event.animationName === "hideLastCategory") {
        var valid = true;
        document.querySelectorAll(".humany-guide-category-list:last-of-type ul li a").forEach(a => {
            var id = a.getAttribute("aria-describedby").split("-")[0];
            var href = a.href.split("/").pop().split("-")[0].replace("c","");
            if(id != href) {
                //console.log("Not valid: " + id);
                valid = false;
            }
            //console.log(id + "-" + href);
        })
        if(valid) {
          document.querySelector(".humany-guide-category-list:last-of-type ul").style.display = "grid";
          document.querySelector("div[data-name='guide-category-list']").style.display = "flex";
        }
        else {
          document.querySelector(".humany-guide-category-list:last-of-type ul").style.display = "none";
          document.querySelector("div[data-name='guide-category-list']").style.display = "none";
        }
    }
  }
  document.addEventListener("animationstart", hideLastCategory, false);
  document.addEventListener("MSAnimationStart", hideLastCategory, false);
  document.addEventListener("webkitAnimationStart", hideLastCategory, false);

}() );
