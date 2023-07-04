from django.shortcuts import render
from django.views import View
from django.template.response import TemplateResponse
from .models import Donation, Institution

class LandingPageView(View):
    """
    View first site
    """

    @staticmethod
    def get( request):
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