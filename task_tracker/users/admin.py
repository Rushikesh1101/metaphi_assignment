from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Task

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # You can customize list_display, fieldsets, etc. here if you like.
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions',   {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'employee', 'task_date', 'hours_spent', 'status')
    list_filter = ('status', 'task_date', 'tags')
    search_fields = ('title', 'description', 'tags', 'employee__username')
    readonly_fields = ('status',)  # status is managed via approval endpoints