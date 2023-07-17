from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views import View
from django.template.response import TemplateResponse

from .forms import DonationForm
from .models import Donation, Institution, Category
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


class AddDonationView(LoginRequiredMixin, View):
    """
    View AddDonation and post services
    """

    login_url = 'login'

    def get(self, request):
        categories = Category.objects.all()
        institutions = Institution.objects.all()

        context = {
            'categories': categories,
            'institutions': institutions,
        }
        return render(request, 'form.html', context=context)

    def post(self, request):
        quantity = request.POST.get('bags')
        categories = request.POST.getlist('categories')
        institution = request.POST.get('organization')
        address = request.POST.get('address')
        city = request.POST.get('city')
        zip_code = request.POST.get('postcode')
        phone_number = request.POST.get('phone')
        pick_up_date = request.POST.get('date')
        pick_up_time = request.POST.get('time')
        pick_up_comment = request.POST.get('more_info')

        user = request.user
        donation = Donation.objects.create(quantity=quantity, institution_id=int(institution), address=address,
                                           city=city, zip_code=zip_code, phone_number=phone_number,
                                           pick_up_date=pick_up_date, pick_up_time=pick_up_time,
                                           pick_up_comment=pick_up_comment, user=user)
        donation.categories.set(categories)
        donation.save()
        return render(request, 'form-confirmation.html')

class LoginView(View):
    """Login Users"""

    def get(self, request):
        return render(request, "login.html")

    def post(self, request):
        username = request.POST.get("email")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect("first-page")
        else:
            messages.error(request, "Niepoprawna nazwa użytkownika lub hasło.")
            return redirect("login")

class LogoutView(View):
    def get(self, request):
        logout(request)
        return render(request, "index.html")

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


class UserProfileView(LoginRequiredMixin, View):
    template_name = 'user_profile.html'

    def get(self, request):
        user = request.user
        categories = Category.objects.all()
        institutions = Institution.objects.all()
        donations = Donation.objects.all()
        context = {
            'user': user,
            'categories': categories,
            'institutions': institutions,
            'donations': donations
        }
        return render(request, self.template_name, context=context)


