const inputs = document.querySelectorAll(".input_inputs");
inputs.forEach(el => {
    el.addEventListener("blur", e => {
        const label = e.target.previousElementSibling;
        if(el.value !== ""){
            label.classList.add("confirmed")
        }
        else{
            label.classList.remove("confirmed")
        }
    })
});