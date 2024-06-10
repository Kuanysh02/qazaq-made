filterSelection("all")

function filterSelection(c) {
    let x = document.getElementsByClassName("filter");
    if (c === "all") c = "";
    for (let i = 0; i < x.length; i++) {
        removeClass(x[i], "show");
        if (x[i].className.indexOf(c) > -1) addClass(x[i], "show");
    }
}

function addClass(element, name) {
    let i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) === -1) {element.className += " " + arr2[i];}
    }
}

function removeClass(element, name) {
    let i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        while (arr1.indexOf(arr2[i]) > -1) {
            arr1.splice(arr1.indexOf(arr2[i]), 1);
        }
    }
    element.className = arr1.join(" ");
}

const btnContainer = document.getElementById("myBtnContainer");
const btns = btnContainer.getElementsByClassName("button");
for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function(){
        const current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
    });
}
