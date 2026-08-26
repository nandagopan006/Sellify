from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
import re
from rest_framework_simplejwt.tokens import RefreshToken

class SignupSerializer(serializers.ModelSerializer):
    
    password=serializers.CharField(write_only=True,
                                   min_length=8,
                                   error_messages={
            "min_length": "Password must be at least 8 characters long."
        },)
    
    class Meta:
        model = User
        fields = ["username", "email", "password"]
        
        extra_kwargs = {
            "email": {
                "required": True, "allow_blank": False,
                "error_messages": { "invalid": "Please provide a valid email address."}}}


    def validate_username(self,value):
        
        username=value.strip()
        
        if len(username)< 3 :
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        
        #for starts with a letter
        if not re.match(r"^[a-zA-Z]", username ):
            raise serializers.ValidationError("Username must start with a letter.")
        
        if not re.match(r"^[a-zA-Z0-9_]+$", username):
            raise serializers.ValidationError(
                "Username can only contain letters, numbers, and underscores."
            )
            
        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        
        return username
    
    def validate_email(self,value):
        email=value.strip().lower()
        
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("A user with this email address already exists.")
        
        return email
    
    def validate_password(self,value):
        
        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError(
                "Password must contain at least one uppercase letter."
            )
            
        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError(
                "Password must contain at least one lowercase letter."
            )
            
        if not re.search(r"[0-9]", value):
            raise serializers.ValidationError(
                "Password must contain at least one digit."
            )
            
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise serializers.ValidationError(
                "Password must contain at least one special character."
            )
            
        try :
            validate_password(value)
        except DjangoValidationError as e :
            raise serializers.ValidationError(list(e.message))
        
        return value
    
    def create(self,validated_data):
        return User.objects.create_user(**validated_data)
    
    
class LoginSerializer(serializers.Serializer):
    
    email=serializers.EmailField()
    password=serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        email= attrs['email']
        password = attrs["password"] 
        
        try :
            user =User.objects.get(email=email)
        except User.DoesNotExist :
            raise serializers.ValidationError(
                 {"message": "Invalid email or password."}
            )
        
        if not user.check_password(password):
            raise serializers.ValidationError(
                {"message": "Invalid email or password."}
            )
            
        refresh =RefreshToken.for_user(user)
        
        return {
                "user":user,
                "access":str(refresh.access_token),
                "refresh":str(refresh)
        }
        
class LogoutSerializer(serializers.Serializer):
    refresh=serializers.CharField()
    
    def validate(self,attrs):
        
        self.token=RefreshToken(attrs["refresh"])
        return attrs
    
    def save(self, **kwargs):
        self.token.blacklist()
        