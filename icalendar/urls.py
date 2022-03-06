from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('login', views.login_view, name="login"),
    path('logout', views.logout_view, name="logout"),
    path('register', views.register, name="register"),
    path('post', views.post, name="post"),
    path('events/<month>', views.events, name="events"),
    path('task', views.task, name="task"),
    path('date', views.date, name="date"),
    path('notes/<date>', views.notes, name="notes")
]