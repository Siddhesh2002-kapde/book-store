from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "email", "first_name", "last_name", "password", "confirm_password","is_staff"]

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return attrs

    


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self,value):
        if not CustomUser.objects.filter(email = value).exists():
            raise serializers.ValidationError("User with this email does not exist!")
        return value
    

class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    uidb64 = serializers.CharField()
    token = serializers.CharField()

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return attrs
    
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        # Include fields you want to expose
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "is_staff",
            "is_active"
        ]
        read_only_fields = ["id", "is_staff", "is_active", "date_joined"]
        
        
class OTPRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()