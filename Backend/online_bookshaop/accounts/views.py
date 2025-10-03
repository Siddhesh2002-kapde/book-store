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
import random
from django.core.signing import TimestampSigner,BadSignature,SignatureExpired
signer = TimestampSigner()

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
   
    
    def get_permissions(self):
        if self.action in ['register', 'login', 'password_reset_request_otp', 'password_reset']:
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


    @action(detail=False,methods=["post"],permission_classes=[AllowAny])
    def password_reset_request_otp(self,request):
        email = request.data.get("email")
        
        if not email:   
            return Response({"detail":"Email required"},status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"detail":"User not found"},status=status.HTTP_400_BAD_REQUEST)
        otp = str(random.randint(100000,999999))
        
        token = signer.sign(f"{user.id}:{otp}")
        
        return Response({"otp":otp,"token":token},status = status.HTTP_200_OK)
    
    @action(detail=False,methods=["post"],permission_classes = [AllowAny])
    def password_reset(self,request):
        email = request.data.get("email")
        otp = request.data.get("otp")
        token = request.data.get("token")
        new_password = request.data.get("password")
        
        if not all([email,otp,token,new_password]):
            return Response({"detail":"All fields are required"},status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"detail":"User not found"},status=status.HTTP_400_BAD_REQUEST)
        
        try:
            value = signer.unsign(token ,max_age=300)
            print("values-------------",value)
        except SignatureExpired:
            return Response({"detail":"OTP expired"},status = status.HTTP_400_BAD_REQUEST)
        except BadSignature:
            return Response({"detail":"Invalid token"},status=status.HTTP_400_BAD_REQUEST)
        
        user_id, corrent_otp = value.split(":")
        print("user_id, correct_otp:-----------",user_id,corrent_otp)
        if str(user.id)!= user_id or otp!= corrent_otp:
            return Response({"detail":"Invalid OTP"},status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        return Response({"detail":"Password reset successfully"},status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["post"])
    def logout(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
