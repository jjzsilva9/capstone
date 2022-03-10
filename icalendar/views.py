from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.db import IntegrityError
import datetime
from django.http.response import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt

from .models import User, Event, Month

#Main view
def index(request):
    if request.user.is_authenticated:
        #If logged in, don't include the user in the other users selection when creating an event
        users = User.objects.exclude(username=request.user.username)
    else:
        users = User.objects.all()
    #Render the main page, with the home button "pressed"
    return render(request, 'icalendar/index.html', {
        "nbar": "home",
        "users": users
    })

#View for logging in a user
def login_view(request):
    #If information has been posted to the server
    if request.method == "POST":
        #Get the username and password
        username = request.POST["username"]
        password = request.POST["password"]
        
        #Validate them
        user = authenticate(request, username=username, password=password)
        
        #If they are successful
        if user is not None:
            #Log them in
            login(request, user)
            #Load the main page
            return HttpResponseRedirect(reverse("index"))
        #Otherwise
        else:
            #Load the login page with the error message
            return render(request, "icalendar/login.html", {
                "message": "Invalid username or password",
                "nbar":"login"
            })
    #Otherwise, load the login page as they have to post information for this view
    else:
        return render(request, 'icalendar/login.html', {
            "nbar": "login"
        })
    
#View for logging out a user
def logout_view(request):
    #Log them out
    logout(request)
    return HttpResponseRedirect(reverse("index"))

#View for registering an account
def register (request):
    #If information has been posted
    if request.method == "POST":
        #Get the information posted
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        confirmation = request.POST["password2"]
        
        #Ensure password matches confirmation
        if password != confirmation:
            return render(request, "icalendar/register.html")

        #Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        #If it fails, return to register with error message
        except IntegrityError:
            return render(request, "icalendar/register.html", {
                "nbar": "register",
                "message": "Username already taken."
            })
        #Otherwise, log them in and load the main page
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    #Load the register page if no information posted
    else:
        return render(request, "icalendar/register.html", {
            "nbar": "register"
        })

#View for creating an event
def post(request):
    #If information has been posted
    if request.method == "POST":
        #Get the event information posted 
        title = request.POST["title"]
        description = request.POST["description"]
        start_time = request.POST["start-time"]
        end_time = request.POST["end-time"]
        date = request.POST["date"]
        #Check if they included a task or other users
        try:
            task = request.POST["task"]
            task = True
        except:
            task = False
        try:
            users = request.POST["users"]
        except:
            users = []
        host = request.POST["host"]
        host = User.objects.get(id=host)
        #Format the starttime and endtime to the proper datetime objects
        start_time = datetime.datetime(int(date[0:4]), int(date[5:7]), int(date[8:10]), int(start_time[0:2]), int(start_time[3:5]))
        end_time = datetime.datetime(int(date[0:4]), int(date[5:7]), int(date[8:10]), int(end_time[0:2]), int(end_time[3:5]))
        #Create the event
        event = Event.objects.create(title=title, description=description, starttime=start_time, endtime=end_time, host=host, task=task)
        #Save it
        event.save()
        #For each account mentioned in the other users, reference them
        for account in users:
            user = User.objects.get(id=account)
            event.users.add(user)
    return HttpResponseRedirect(reverse("index"))
   
#View for returning a users' events for a specific month
def events(request, month):
    #If logged in
    if request.user.is_authenticated:
        #Get the user
        user = User.objects.get(id=request.user.id)
        #Get the events for that month
        events = Event.objects.filter(starttime__month=month)
        #Formatting for JSON response
        list = [event.serialize() for event in events]
        #Add each event to a list if it belongs to the user or if they are mentioned in it (multiple users)
        total=[]
        for event in list:
            if event["host"] == user.username:
                total.append(event)
            elif len(event["users"]):
                if str(user.id) in event["users"][0]:
                    total.append(event)
        #Return the list of events
        return JsonResponse(sorted(total, key=lambda d: d['starttime']), safe=False)
    #Return an empty list of events if not logged in
    return JsonResponse([], safe=False)
    
#View for completing/uncompleting a task
@csrf_exempt
def task(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        event = Event.objects.get(id=data.get("post"))
        #Find out if the task is getting checked or unchecked
        if data["taskcompleted"]:
            done = data.get("taskcompleted")
            #Save it in the database
            if done == True:
                event.taskcompleted = True
            else:
                event.taskcompleted = False
        event.save()
        return HttpResponse(status=204)

#View for changing the date of an event by drag and drop
@csrf_exempt
def date(request):
    if request.method == "PUT":
        #Get the important information
        data = json.loads(request.body)
        event = Event.objects.get(id=data.get("post"))
        date = data.get("date")
        #Format the starttime and endtime
        starttime = datetime.datetime(int(date[0:4]), int(date[5:7]), int(date[8:10]), int(event.starttime.hour), int(event.starttime.minute))
        endtime = datetime.datetime(int(date[0:4]), int(date[5:7]), int(date[8:10]), int(event.endtime.hour), int(event.endtime.minute))
        #Save them to the database
        event.starttime = starttime
        event.endtime = endtime
        event.save()
        return HttpResponse(status=204)

#View for creating, fetching or editing monthly notes
#Not done yet but will be more notes
@csrf_exempt
def notes(request, date):
    if request.user.is_authenticated:
        newdate = datetime.datetime(int(date[:4]), int(date[4:])+1, 1)
        print(newdate)
        if request.method == "PUT":
            print("hello")
        elif request.method == "GET":
            try:
                month = Month.objects.get(user=User.objects.get(id=request.user.id), month=newdate)
                if month:
                    print(month.notes)
                    return JsonResponse(month, safe=False)
            except:
                print("Type some notes here...")
                return JsonResponse("Type some notes here...", safe=False)
        elif request.method == "POST":
            print("HELLO")
            
    return HttpResponse(status=204)
