from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, LoginSerializer
from rest_framework import viewsets, status
from .models import Task
from .serializers import TaskSerializer, TaskApprovalSerializer
import psycopg2
from psycopg2 import sql
from psycopg2.extras import execute_values
import os
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
import json
from django.core.serializers import serialize

DJANGO_DB = {
    'ENGINE':   'django.db.backends.postgresql',
    'NAME':     'task_tracker_db',
    'USER':     'postgres',
    'PASSWORD': 'root',
    'HOST':     'localhost',
    'PORT':     '5432',
}

def get_db_connection():
    conn = psycopg2.connect(
        dbname=  DJANGO_DB['NAME'],
        user=    DJANGO_DB['USER'],
        password=DJANGO_DB['PASSWORD'],
        host=    DJANGO_DB['HOST'],
        port=    DJANGO_DB['PORT'],
    )
    return conn


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        conn = get_db_connection()
        cur = conn.cursor()
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            print(
                authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password'],
            ),
                "...................mskskksks"
            )
            query = f"""
                    SELECT * FROM public.users_user WHERE username = '{serializer.validated_data['username']}'
                """
            
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password'],
            )


            cur.execute(query)
            columns = [desc[0] for desc in cur.description]  # Get column names
            users_data = [dict(zip(columns, row)) for row in cur.fetchall()]
            print(users_data,'..............................................')
            if users_data:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'role': users_data[0]['role'],
                    'assignmanager': users_data[0]['assignmanager']

                }, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'manager':
            return Response({'message': 'Welcome to the Manager Dashboard'})
        return Response({'message': 'Welcome to the Employee Dashboard'})




class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        if request.user.role == 'manager':
            conn = get_db_connection()
            cur = conn.cursor()

            # Get the current manager's username
            manager_username = request.user.username
            print(manager_username, 'lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll')
            # Fetch all Task objects where the manager is assigned
            tasks = Task.objects.filter(assignmanager=manager_username).order_by('-id')
            task_data = self.get_serializer(tasks, many=True).data

            # Extract employee details
            employee_list = []
            unique_employee_ids = set()

            for task in tasks:
                if task.employee:  # Assuming `employee` is a foreign key
                    employee_id = task.employee
                    try:
                        query = f"""
                            SELECT username, id FROM public.users_user WHERE username = '{employee_id}'
                        """
                        cur.execute(query)
                        columns = [desc[0] for desc in cur.description]
                        user_data = cur.fetchone()
                        if user_data:
                            employee_dict = dict(zip(columns, user_data))  # Convert row to dictionary
                            employee_id = employee_dict.get("id")  # Assuming "id" is the unique identifier
                            
                            # Append only if the ID is not already in the set
                            if employee_id not in unique_employee_ids:
                                employee_list.append(employee_dict)
                                unique_employee_ids.add(employee_id)
                    except Exception as e:
                        print(f"Error fetching employee data: {e}")

            # Return the response
            return Response({
                "tasks": task_data,
                "employee_list": employee_list
            })

        # return Task.objects.filter(employee=self.request.user).order_by('-id')
        tasks = Task.objects.filter(employee=self.request.user).order_by('-id')
        task_data = self.get_serializer(tasks, many=True).data
        return Response({
                "tasks": task_data,
            })

    def perform_create(self, serializer):
        print(self.request.user)  # Check if the user is authenticated
        print(self.request.user.id)  # Ensure the user ID is retrieved
        serializer.save(employee=self.request.user)

    def update(self, request, *args, **kwargs):
        task = self.get_object()
        if task.status not in ['Pending', 'Rejected']:
            return Response(
                {"error": "You cannot edit an approved task."},
                status=http_status.HTTP_400_BAD_REQUEST
            )

        # Let DRF perform its normal update (this only writes the fields from request.data)
        response = super().update(request, *args, **kwargs)

        # Now force status back to Pending
        task.status = 'Pending'
        task.save(update_fields=['status'])

        # Return the DRF-updated data plus our forced status
        data = response.data
        data['status'] = 'Pending'
        return Response(data)


class TaskApprovalViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        # Ensure only managers can approve
        if request.user.role != 'manager':
            return Response({"error": "Only managers can approve tasks."}, status=status.HTTP_403_FORBIDDEN)

        task = get_object_or_404(Task, pk=pk)
        if task.status != 'Pending':
            return Response({"error": "Task is already processed."}, status=status.HTTP_400_BAD_REQUEST)

        task.status = 'Approved'
        task.save(update_fields=['status'])
        return Response({"message": "Task approved successfully."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        # Ensure only managers can reject
        if request.user.role != 'manager':
            return Response({"error": "Only managers can reject tasks."}, status=status.HTTP_403_FORBIDDEN)

        task = get_object_or_404(Task, pk=pk)
        if task.status != 'Pending':
            return Response({"error": "Task is already processed."}, status=status.HTTP_400_BAD_REQUEST)

        reason = request.data.get('reason', '').strip()
        if not reason:
            return Response({"error": "Rejection reason is required."}, status=status.HTTP_400_BAD_REQUEST)

        task.status = 'Rejected'
        task.rejection_comment = reason
        task.save(update_fields=['status', 'rejection_comment'])
        return Response({"message": "Task rejected successfully."}, status=status.HTTP_200_OK)
    

class ManagerListView(APIView):
    """
    API view to fetch the list of managers.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            # Establish a connection to the database
            conn = get_db_connection()
            cur = conn.cursor()

            # Query to fetch managers
            query = """
                SELECT id, username, email FROM public.users_user WHERE role = 'manager'
            """
            cur.execute(query)

            # Get the column names and fetch all rows
            columns = [desc[0] for desc in cur.description]
            manager_list = [dict(zip(columns, row)) for row in cur.fetchall()]

            # Close the database connection
            cur.close()
            conn.close()

            return Response({
                "managers": manager_list
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error fetching managers: {e}")
            return Response({
                "error": "Failed to fetch managers. Please try again later."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
