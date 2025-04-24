from .views import RegisterView, LoginView, DashboardView, TaskViewSet, TaskApprovalViewSet, ManagerListView
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'tasks/approval', TaskApprovalViewSet, basename='task-approval')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('managers/', ManagerListView.as_view(), name='manager-list'),

]
