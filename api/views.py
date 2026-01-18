import requests
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET'])
def getMeaning(request, word):
    url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{word}"
    res = requests.get(url) 

    if res.status_code == 200:
        return Response(res.json())
    else:
        return Response({"error": "Word not found"}, status=404)


@api_view(['POST'])
def loginUser(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = User.objects.filter(username=username).first()
    if user is None or not user.check_password(password):
        return Response({"error": "Invalid username or password"}, status=400)

    refresh = RefreshToken.for_user(user)
    return Response({
        "message": "Login successful",
        "refresh": str(refresh),
        "access": str(refresh.access_token)
    })
