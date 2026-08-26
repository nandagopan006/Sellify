from .serializers import SignupSerializer,LoginSerializer

from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView


class SignupAPIView(APIView):
    
    def post(self,request):
        serializer=SignupSerializer(data=request.data)
        
        if serializer.is_valid():
            user=serializer.save()
            
            return Response({"message":"User created successfully.",
                            "user":{
                                "id": user.id,
                                "username": user.username,
                                "email": user.email,
                            },
                },
                            status=status.HTTP_201_CREATED)
            
        
        return Response({
            
            "message":"signup failed",
            "error":serializer.errors,
        },
                        status=status.HTTP_400_BAD_REQUEST,)
        
        
class LoginAPIView(APIView):
    
    def post(self,request):
        
        serializer=LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            
            data=serializer.validated_data
            user=data["user"]
            
            return Response({
                
                
                    "message": "Login successful.",
                    "access": data["access"],
                    "refresh": data["refresh"],
                    
            },status=status.HTTP_200_OK
                            )
        
        return Response( {
                "message": "Login failed.",
                "errors": serializer.errors,
            },
            status=status.HTTP_401_UNAUTHORIZED,)