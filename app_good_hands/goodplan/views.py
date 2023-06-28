from django.shortcuts import render
from django.views import View
from django.template.response import TemplateResponse
class FirstSiteView(View):
    """
    View first site
    """

    @staticmethod
    def get(request):
        return TemplateResponse(request, "base.html")


# Create your views here.
