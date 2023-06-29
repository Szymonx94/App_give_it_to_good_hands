from django.shortcuts import render
from django.views import View
from django.template.response import TemplateResponse
class LandingPageView(View):
    """
    View first site
    """

    @staticmethod
    def get(request):
        return TemplateResponse(request, "base.html")

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
        # form = RegistrationForm()
        return render(request, "register.html") #{"form": form})