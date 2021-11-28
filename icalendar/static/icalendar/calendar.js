
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
document.addEventListener("DOMContentLoaded", function () {
    let date = new Date();
    updateMonth(date);

    document.querySelector('#nextMonth').onclick = function(){
        date.setMonth(date.getMonth()+1);
        updateMonth(date);
    }
    document.querySelector('#prevMonth').onclick = function(){
        date.setMonth(date.getMonth()-1);
        updateMonth(date);
    }
})

function updateMonth(date){
    let month = date.getUTCMonth();
    document.querySelector('#thisMonth').innerText = months[month] + ' ' + date.getFullYear();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    
    var lastDayPrev = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    document.querySelectorAll('.day').forEach(day => {
        day.setAttribute("data-toggle", "modal");
        day.setAttribute("data-target", "#eventModal");
        day.innerText = day.id - firstDay;
        day.style.color = "black"
        if (day.innerText < 1){
            day.innerText =  Number(lastDayPrev) + Number(day.innerText);
            day.style.color = "lightgrey";
        } else if (day.innerText > lastDay){
            day.innerText = day.innerText - lastDay;
            day.style.color = "lightgrey";
        }
    });
}
