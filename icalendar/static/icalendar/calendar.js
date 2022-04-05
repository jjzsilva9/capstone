//Used for converting date objects to string
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let current = new Date();
var dragged;

//When the document has loaded
document.addEventListener("DOMContentLoaded", function () {
    let date = new Date();
    
    //Update the month to the current day
    updateMonth(date);
    
    //Settings for modals
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
    
    //When next month pressed, update to the next month
    $('#nextMonth').click(function(){
        date.setMonth(date.getMonth()+1);
        updateMonth(date);
    })
    
    //When previous month pressed, update to the previous month
    $('#prevMonth').click(function(){
        date.setMonth(date.getMonth()-1);
        updateMonth(date);
    })

    $('#saveNotes').click(function(){
        console.log($('#monthNotes').val())
        fetch(`/notes/${String(date.getFullYear()) + String(date.getMonth())}`, 
        {
            method: "POST",
            body: JSON.stringify({
                goals: $('#monthNotes').val()
            })
        })
    })

    $('#hostFilter').on("change", function() {
        filter(date);
    })

    $('#lowFilter').on("change", function() {
        filter(date);
    })

    $('#mediumFilter').on("change", function() {
        filter(date);
    })

    $('#highFilter').on("change", function() {
        filter(date);
    })
})

function filter(date){
    console.log("filters changed");
    var host = $('#hostFilter').is(":checked");
    var low = $('#lowFilter').is(":checked");
    var medium = $('#mediumFilter').is(":checked");
    var high = $('#highFilter').is(":checked");
    user = $('#username').text();
    console.log(user);
    document.querySelectorAll('.event').forEach(event => {
        console.log(event["host"]);
        if (!host && ((event.getAttribute("host")) != user)){
            event.style.display="none";
        } else if ((!low) && (event.classList.contains("btn-success"))) {
            event.style.display="none";
        } else if (!medium && event.classList.contains("btn-warning")) {
            event.style.display="none";
        } else if (!high && event.classList.contains("btn-danger")) {
            event.style.display="none";
        } else {
            event.style.display="inline-block";
        }
    })
}

function updateMonth(date){
    removeEvents();
    fetchEvents(date);
    fetchNotes(date);
    filter(date);
    let month = date.getUTCMonth();
    //Sets to title to the current month and year
    $('#thisMonth').text(months[month] + ' ' + date.getFullYear());
    //Defines key variables for setting the dates
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    var lastDayPrev = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    document.querySelectorAll('.day').forEach(day => {
        //These are event listeners for the drag and drop functionality
        day.addEventListener('dragover', dragOver);
        day.addEventListener('dragenter', dragEnter);
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

//Makes a fetch request to the backend which returns the events for that user for that month
function fetchEvents(date){
    fetch(`/events/${parseInt(date.getUTCMonth())+1}`)
    .then(response => response.json())
    .then(events => {
        events.forEach(loadEvent);
    })
}

//Creates an element for each event
function loadEvent(content) {
    const event = document.createElement("tr");
    event.className="event btn btn-secondary";
    //Sets inner text to contain the starting time and the title
    event.innerHTML = `<div class="event-title text-left">${content.starttime.slice(11, 16)} ${content.title}</div>`;
    event.id = content.id;
    //Allows it to be dragged for drag and drop
    event.setAttribute("draggable", true);
    event.setAttribute("host", content.host);
    event.setAttribute("tag", content.tag);
    event.addEventListener("dragstart", dragStart);
    event.addEventListener("dragend", dragEnd);

    if (content.tag === "LO") {
        event.className="event btn btn-success";
    } else if (content.tag === "ME") {
        event.className="event btn btn-warning";
    } else {
        event.className="event btn btn-danger";
    }
    
    //Fills modal information when clicked
    event.onclick = function(){
        $('#eventDetailsModal').modal('show');
        var modal = $('#eventDetailsModal');
        modal.find('.modal-title').text(content.title);
        modal.find('.modal-description').text(content.description);
        modal.find('.modal-starttime').text(String(content.starttime).slice(11, 16));
        modal.find('.modal-endtime').text(String(content.endtime).slice(11, 16));
        if (content.tag === "LO") {
            modal.find('#tag').addClass("btn btn-success");
            modal.find('#tag').html("Low");
        } else if (content.tag === "ME") {
            modal.find('#tag').addClass("btn btn-warning");
            modal.find('#tag').html("Medium");
        } else {
            modal.find('#tag').addClass("btn btn-danger");
            modal.find('#tag').html("High");
        }
        if (content.task == true){
            modal.find('#taskcompletedlabel').show();
            $('.modal-taskcompleted').show();
            $('.modal-taskcompleted').prop('checked', content.taskcompleted);
            $('#taskcompleted').on('change', function() {
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

//Removes all event instances on the calendar
function removeEvents(){
    $('.event').remove();
}

//Fetches the notes for that user for that month
function fetchNotes(date){
    fetch(`/notes/${String(date.getFullYear()) + String(date.getMonth())}`)
    .then(response => response.json())
    .then(notes => {
        
        console.log(notes);
        if (notes === "Type some notes here..."){
            console.log("placeholder");
            $('#monthNotes').attr("placeholder", notes); 
            $('#monthNotes').html("");
        }else {
            $('#monthNotes').html(notes); 
        }
    })
}

//Drag functions
function dragStart(event){
    dragged = event.target;
    //Makes it invisible when drag starts
    setTimeout(() => (this.className = "invisible"), 0);
}

function dragEnd(){
    //Makes visible again
    content = this.getAttribute("tag");
    if (content === "LO") {
        this.className="event btn btn-success";
    } else if (content === "ME") {
        this.className="event btn btn-warning";
    } else {
        this.className="event btn btn-danger";
    }
}

function dragOver(e){
    e.preventDefault();
}

function dragEnter(e){
    e.preventDefault();
}

function dragDrop(e){
    //Adds event to the new day and tells the back-end this through PUT
    e.preventDefault();
    e.target.querySelector("tbody").append(dragged);
    fetch(`/date`, {
        method: "PUT",
        body: JSON.stringify({
            post: dragged.id,
            date: e.target.getAttribute("data-whatever")
        })
    })
}