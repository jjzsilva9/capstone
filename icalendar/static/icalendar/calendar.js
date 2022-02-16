
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let current = new Date();
console.log(current.getDate());
console.log(current.getUTCMonth());
var dragged;
document.addEventListener("DOMContentLoaded", function () {
    let date = new Date();
    updateMonth(date);

    $('#eventModal').modal({
        keyboard: true,
        backdrop: false,
        focus: true,
        show: true
    });

    $('#eventDetailsModal').modal({
        keyboard: true,
        backdrop: false,
        focus: true,
        show: true
    });

    $('#eventModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)

    })

    $('#eventDetailsModal').on('show.bs.modal', function (event) {
        $('#eventModal').modal('hide');

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
    removeEvents();
    fetchEvents(date);
    let month = date.getUTCMonth();
    $('#thisMonth').text(months[month] + ' ' + date.getFullYear());
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    var lastDayPrev = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    document.querySelectorAll('.day').forEach(day => {
        //These are event listeners for the drag and drop functionality
        day.addEventListener('dragover', dragOver);
        day.addEventListener('dragenter', dragEnter);
        day.addEventListener('dragleave', dragLeave);
        day.addEventListener('drop', dragDrop);

        //Sets the correct day of the month
        day.querySelector("tr").innerText = day.id - firstDay;

        //If the day isn't in the month, set it to the correct date and shade out
        if (day.querySelector("tr").innerText < 1){
            day.querySelector("tr").innerText =  Number(lastDayPrev) + Number(day.querySelector("tr").innerText);
            day.style.color = "lightgrey";
            day.classList.add('noselect');
        } else if (day.querySelector("tr").innerText > lastDay){
            day.querySelector("tr").innerText = day.querySelector("tr").innerText - lastDay;
            day.style.color = "lightgrey";
        } else {
            //Otherwise, set the data whatever for the modal and make it open the modal on click
            day.setAttribute("data-whatever", `${date.getFullYear()}-${("0"+(date.getUTCMonth()+1)).slice(-2)}-${("0"+day.querySelector("tr").innerText).slice(-2)}`);
            day.style.color = "black";

            //If the day is representing today...
            if ((month == current.getUTCMonth()+1) && day.querySelector("tr").innerText == current.getDate()){
                console.log(day);
            }
            day.onclick = function (e){
                if (e.target.classList.contains('day')){
                    $('#eventModal').modal('show');
                    document.getElementById("date").defaultValue = this.dataset.whatever;
                    $('.close').click(function() {
                        $('#eventModal').modal('hide');
                    })
                };     
            }
        }
    });
}

function fetchEvents(date){
    fetch(`/events/${parseInt(date.getUTCMonth())+1}`)
    .then(response => response.json())
    .then(events => {
        events.forEach(loadEvent);
    })
}

function loadEvent(content) {
    console.log(content)
    const event = document.createElement("tr");
    event.className="event btn btn-secondary";
    event.innerHTML = `<div class="event-time>${content.starttime}</div>"<div class="event-title">${content.title}</div>`;
    event.id = content.id;
    event.setAttribute("draggable", true);
    event.addEventListener("dragstart", dragStart);
    event.addEventListener("dragend", dragEnd);

    event.onclick = function(){
        $('#eventDetailsModal').modal('show');
        var modal = $('#eventDetailsModal');
        modal.find('.modal-title').text(content.title);
        modal.find('.modal-description').text(content.description);
        modal.find('.modal-starttime').text(String(content.starttime).slice(11, 16));
        modal.find('.modal-endtime').text(String(content.endtime).slice(11, 16));
        if (content.task == true){
            modal.find('#taskcompletedlabel').show();
            $('.modal-taskcompleted').show();
            $('.modal-taskcompleted').prop('checked', content.taskcompleted);
            $('#taskcompleted').on('change', function() {
                console.log("task completed status changed");
                if (this.checked){
                    fetch(`/task`, {
                        method: "PUT",
                        body: JSON.stringify({
                            post: content.id,
                            taskcompleted: true
                        })
                    })
                    content.taskcompleted = true;
                } else {
                    fetch(`/task`, {
                        method: "PUT",
                        body: JSON.stringify({
                            post: content.id,
                            taskcompleted: false
                        })
                    })
                    content.taskcompleted = false;
                }
            })
        } else {
            modal.find('.modal-taskcompleted').hide();
            modal.find('#taskcompletedlabel').hide();
        }
        $('.close').click(function() {
            $('#eventDetailsModal').modal('hide');
        })
    }
    
    $(`.day[data-whatever="${content.starttime.slice(0, 10)}"]`).find("table").append(event);
}

function removeEvents(){
    $('.event').remove();
}

//Drag functions
function dragStart(event){
    dragged = event.target;
    //console.log(dragged);
    //console.log("test")
    setTimeout(() => (this.className = "invisible"), 0);
}

function dragEnd(){
    this.className = "event";
}

function dragOver(e){
    e.preventDefault();
}

function dragEnter(e){
    e.preventDefault();
    //console.log(e.target);
    //console.log(this);
}

function dragLeave(){

}

function dragDrop(e){
    e.preventDefault();
    //console.log(dragged);
    //console.log(e.target);
    //console.log("dropped");
    e.target.querySelector("tbody").append(dragged);
    console.log(e.target.getAttribute("data-whatever"));
    fetch(`/task`, {
        method: "PUT",
        body: JSON.stringify({
            post: dragged.id,
            date: e.target.getAttribute("data-whatever")
        })
    })
}
