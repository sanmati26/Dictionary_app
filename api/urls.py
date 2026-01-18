from django.urls import path
from .views import getMeaning, loginUser

urlpatterns = [
    path('meaning/<str:word>/', getMeaning),
    path('login/', loginUser),
]



