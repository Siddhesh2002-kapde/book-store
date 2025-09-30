from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser
from .serializers import RegisterSerializer, SetNewPasswordSerializer, PasswordResetRequestSerializer,UserSerializer
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import smart_bytes, smart_str
from django.core.mail import send_mail
from drf_yasg.utils import swagger_auto_schema
from django.contrib.auth import authenticate

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
   
    
    def get_permissions(self):
        if self.action in ['register', 'login', 'password_reset_request', 'password_reset_confirm']:
            return [AllowAny()]
        return [IsAuthenticated()]

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def verify_token(self, request):
        user = request.user 
        user_data = UserSerializer(user).data
        print("user_data-----------------",user_data)
        return Response({
            "valid": True,
            "user": user_data
        }, status=status.HTTP_200_OK)
        
    @action(detail=False, methods=["post"])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
       
        data.pop("confirm_password")

     
        is_staff = data.pop("is_staff")

       
        user = CustomUser.objects.create_user(
            email=data["email"],
            password=data["password"],
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            phone=data.get("phone", ""),
            is_staff=is_staff
        )

        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
  
    @action(detail=False, methods=["post"])
    def login(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"detail": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(email=email, password=password)
        if not user:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        tokens = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        
        user_data = UserSerializer(user).data

        # Return both tokens and user info
        return Response({
            "tokens": tokens,
            "user": user_data
        }, status=status.HTTP_200_OK)

    
    @action(detail=False, methods=["post"])
    def password_reset_request(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        user = CustomUser.objects.get(email=email)
        uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
        token = PasswordResetTokenGenerator().make_token(user)
        reset_link = f"http://localhost:3000/reset-password/{uidb64}/{token}/"
        send_mail("Password Reset", f"Reset link: {reset_link}", "noreply@example.com", [email],fail_silently=False,)
        return Response({"message": "Password reset link sent"}, status=status.HTTP_200_OK)

   
    @action(detail=False, methods=["patch"], url_path="reset-password/(?P<uidb64>[^/.]+)/(?P<token>[^/.]+)")
    def password_reset_confirm(self, request, uidb64=None, token=None):
        serializer = SetNewPasswordSerializer(data={**request.data, "uidb64": uidb64, "token": token})
        serializer.is_valid(raise_exception=True)

        try:
            uid = smart_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(id=uid)
        except Exception:
            return Response({"error": "Invalid UID"}, status=400)

        if not PasswordResetTokenGenerator().check_token(user, token):
            return Response({"error": "Token is invalid or expired"}, status=400)

        user.set_password(serializer.validated_data["password"])
        user.save()
        return Response({"message": "Password reset successful"}, status=200)

   
    @action(detail=False, methods=["post"])
    def logout(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
