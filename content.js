const bookMarkImgURL = chrome.runtime.getURL("assets/bookmark.png")
window.addEventListener("load",addBookMarkButton);
const AZ_PROBLEM_KEY = "AZ_PROBLEM_KEY";

const observer = new MutationObserver(()=>{
    addBookMarkButton();
});

observer.observe(document.body,{childList:true,subtree:true});
addBookMarkButton();

function onProblemPage(){
    return window.location.pathname.startsWith('/problems/');
}
function addBookMarkButton(){

    if(!onProblemPage() || document.getElementById("add-bookmark-button")) return;

    const bookMarkButton = document.createElement('img');
    bookMarkButton.id = "add-bookmark-button";
    bookMarkButton.src = bookMarkImgURL;
    bookMarkButton.style.height = "42px";
    bookMarkButton.style.width = "42px";
    
    const container = document.getElementsByClassName(
      "ant-row  d-flex gap-4 mt-1 css-19gw05y"
    )[0];
    container.insertAdjacentElement("beforeEnd",bookMarkButton);
    bookMarkButton.addEventListener('click' , clickHandler);
}

async function clickHandler(){
    const currBokkmarks =await getCurrentBookmarks();
    const url = window.location.href;
    const id  =extractUniqueId(url);
    const problemname = document.getElementsByClassName(
      "Header_resource_heading__cpRp1 rubik fw-bold mb-0 fs-4"
    )[0].innerHTML;
    // console.log(id);
    if(currBokkmarks.some((bookmark)=>bookmark.id===id)) return;
    const bookMarkObj={
        id:id,
        name:problemname,
        url:url
    }

    const updatedBookMark = [...currBokkmarks , bookMarkObj];

    chrome.storage.sync.set({AZ_PROBLEM_KEY:updatedBookMark},()=>{
        console.log("Updated the bookmarks correctly to" , updatedBookMark)
    })

}



 function extractUniqueId(url) {
  const parts = url.split("problems/");
  if (parts.length > 1) {
    const rest = parts[1];
    const id = rest.split(/[/?#]/)[0]; // in case there's extra stuff after
    return id;
  } else {
    throw new Error("No unique ID found in the URL");
  }
}

function getCurrentBookmarks(){
    return new Promise((resolve,reject)=>{
        chrome.storage.sync.get([AZ_PROBLEM_KEY] , (results)=>{
            resolve(results[AZ_PROBLEM_KEY] || []);
        });
    });
}