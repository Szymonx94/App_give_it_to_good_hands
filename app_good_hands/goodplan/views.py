from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.views import View
from django.template.response import TemplateResponse
from .models import Donation, Institution
from django.contrib import messages


class LandingPageView(View):
    """
    View first site
    """

    @staticmethod
    def get(request):
        total_bags = Donation.objects.count()
        supported_org = Institution.objects.count()
        institutions = Institution.objects.all()
        institution_type = institutions.values('type').distinct()
        context = {
            "total_bags": total_bags,
            "supported_org": supported_org,
            'institutions': institutions,
            'institution_type': institution_type,
        }
        return render(request, "index.html", context)


class AddDonationView(View):
    """
    View AddDonation
    """

    @staticmethod
    def get(request):
        return TemplateResponse(request, "form.html")


class LoginView(View):
    """Login Users"""

    def get(self, request):
        return render(request, "login.html")


class RegisterView(View):
    """ View registratrion for new users"""

    def get(self, request):
        return render(request, "register.html")

    def post(self, request):
        name = request.POST.get('name')
        surname = request.POST.get('surname')
        email = request.POST.get('email')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')

        if password != password2:
            messages.error(request, "Passwords do not match.")
            return redirect('register')

        if User.objects.filter(email=email).exists():
            messages.error(request, "User with this email already exists.")
            return redirect('register')

        if name and surname and email and password:
            user = User.objects.create_user(first_name=name, last_name=surname, email=email, password=password,
                                            username=email)
            user.save()

            messages.success(request, "You have been registered successfully!")
            return redirect('login')

        messages.error(request, "An error occurred during registration.")
        return redirect('register')
