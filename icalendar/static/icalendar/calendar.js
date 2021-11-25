
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
document.addEventListener("DOMContentLoaded", function () {
    let date = new Date();
    updateMonth(date);
})

function updateMonth(date){
    let month = date.getUTCMonth();
    document.querySelector('#thisMonth').innerText = months[month];
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    console.log(firstDay);
    document.querySelectorAll('.day').forEach(day => {
        day.innerText -= firstDay;
    });
}