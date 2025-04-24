from rest_framework import serializers
from django.contrib.auth import get_user_model


from .models import Task


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'assignmanager']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role'],
            assignmanager = validated_data['assignmanager']
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['status', 'rejection_comment','employee']

        def create(self, validated_data):
            validated_data['employee'] = self.context['request'].user
            return super().create(validated_data)

class TaskApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'status', 'rejection_comment']
        read_only_fields = ['id']