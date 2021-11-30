
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
document.addEventListener("DOMContentLoaded", function () {
    let date = new Date();
    updateMonth(date);

    $('#eventModal').modal({
        keyboard: true,
        backdrop: false,
        focus: true,
        show: true
    });

    $('#eventModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        var day = button.innerText;
        var modal = $(this);
        modal.find('.modal-day').text(day);

    })
    $('#nextMonth').click(function(){
        date.setMonth(date.getMonth()+1);
        updateMonth(date);
    })
    $('#prevMonth').click(function(){
        date.setMonth(date.getMonth()-1);
        updateMonth(date);
    })
})

function updateMonth(date){
    let month = date.getUTCMonth();
    $('#thisMonth').text(months[month] + ' ' + date.getFullYear());
    //$('#date').val(date);
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    
    var lastDayPrev = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    document.querySelectorAll('.day').forEach(day => {
        day.onclick = function (){
            $('#eventModal').modal('show');
            $('.close').click(function() {
                $('#eventModal').modal('hide');
            })
        }
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
