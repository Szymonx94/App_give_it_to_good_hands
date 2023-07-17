from django.db import models
from django.contrib.auth.models import User
from phonenumber_field.modelfields import PhoneNumberField
from django.utils.translation import gettext as _


# Create your models here.
class Category(models.Model):
    """
    Model Category
    """
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Institution(models.Model):
    """
    Model for date Institution
    """
    name = models.CharField(max_length=200)
    description = models.TextField()

    INSTITUTION_CHOICES = (
        ("FD", "Fundation"),
        ("NG", "Non-governmental organization"),
        ("LF", "local fundraising")
    )
    type = models.CharField(max_length=200, default="FD", choices=INSTITUTION_CHOICES)
    categories = models.ManyToManyField(Category)

    class Meta:
        verbose_name_plural = 'Institutions'  # Nazwa w panelu administracyjnym

    def __str__(self):
        return self.name  # Wyświetlane dane w przyjazny sposób

class Donation(models.Model):
    quantity = models.PositiveSmallIntegerField()
    categories = models.ManyToManyField(Category)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)
    address = models.CharField(max_length=200)
    phone_number = PhoneNumberField(null=True, blank=True, help_text=_('Contact phone number'))
    city = models.CharField(max_length=32)
    zip_code = models.CharField(null=True, max_length=5)
    pick_up_date = models.DateField(auto_now_add=True)
    pick_up_time = models.TimeField(auto_now_add=True)
    pick_up_comment = models.TextField(null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
