
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
document.addEventListener("DOMContentLoaded", function () {
    let date = new Date();
    updateMonth(date);
})

function updateMonth(date){
    let month = date.getUTCMonth();
    document.querySelector('#thisMonth').innerText = months[month];
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
    
    var lastDayPrev = new Date(date.getFullYear(), date.getMonth(), 0).getDay();
    console.log(firstDay);
    document.querySelectorAll('.day').forEach(day => {
        day.innerText -= firstDay;
        if (day.innerText < 1){
            day.innerText = lastDayPrev - day.innerText;
            day.style.color = "lightgrey";
        } else if (day.innerText > lastDay){
            day.innerText = day.innerText - lastDay;
            day.style.color = "lightgrey";
        }
    });
}
