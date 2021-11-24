from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.db import IntegrityError

from .models import User

# Create your views here.

def index(request):
    return render(request, 'icalendar/index.html', {
        "nbar": "home"
    })

def login(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
    return render(request, 'icalendar/index.html')

def logout(request):
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
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "icalendar/register.html", {
            "nbar": "profile"
        })

def profile(request):
    return render(request, 'icalendar/index.html', {
        "nbar": "profile"
    })
