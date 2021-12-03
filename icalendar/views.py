from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.db import IntegrityError
import datetime
from django.http.response import JsonResponse

from .models import User, Event

# Create your views here.

def index(request):
    if request.user.is_authenticated:
        users = User.objects.exclude(username=request.user.username)
    else:
        users = User.objects.all()
    return render(request, 'icalendar/index.html', {
        "nbar": "home",
        "users": users
    })

def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "icalendar/login.html", {
                "message": "Invalid username or password",
                "nbar":"login"
            })
    else:
        return render(request, 'icalendar/login.html', {
            "nbar": "login"
        })

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register (request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["password2"]
        if password != confirmation:
            return render(request, "icalendar/register.html")

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "icalendar/register.html", {
                "nbar": "register",
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "icalendar/register.html", {
            "nbar": "register"
        })

def post(request):
    if request.method == "POST":
        title = request.POST["title"]
        description = request.POST["description"]
        start_time = request.POST["start-time"]
        end_time = request.POST["end-time"]
        date = request.POST["date"]
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
        start_time = datetime.datetime(int(date[0:4]), int(date[5:7]), int(date[8:10]), int(start_time[0:2]), int(start_time[3:5]))
        end_time = datetime.datetime(int(date[0:4]), int(date[5:7]), int(date[8:10]), int(end_time[0:2]), int(end_time[3:5]))
        
        event = Event.objects.create(title=title, description=description, starttime=start_time, endtime=end_time, host=host, task=task)
        event.save()
        for account in users:
            user = User.objects.get(id=account)
            event.users.add(user)
    return HttpResponseRedirect(reverse("index"))

def events(request, month):
    events = Event.objects.filter(starttime__month=month)
    print(events)
    return JsonResponse([event.serialize() for event in events], safe=False)
