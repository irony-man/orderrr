# from django import forms
# from django.core.exceptions import ValidationError
# from django.utils.translation import gettext as _
# from phonenumber_field.formfields import PhoneNumberField

# REGISTER_PLACEHOLDERS = {
#     "first_name": "John",
#     "last_name": "Doe",
#     "email": "your.email@example.com",
#     "phone": "+91 012 345 6789",
#     "password": "Atleast 8 characters",
#     "retype_password": "Retype the password",
# }


# class FinishInviteForm(forms.Form):
#     error_css_class = "is-invalid"

#     first_name = forms.CharField(max_length=127, required=True)
#     last_name = forms.CharField(max_length=127, required=True)
#     phone = PhoneNumberField(required=True)
#     password = forms.CharField(widget=forms.PasswordInput)

#     def __init__(self, *args, **kwargs):
#         super(FinishInviteForm, self).__init__(*args, **kwargs)
#         self.fields["first_name"].widget.attrs["autofocus"] = "autofocus"
#         for key in self.fields:
#             self.fields[key].widget.attrs.update(
#                 {
#                     "class": "input is-primary",
#                     "placeholder": REGISTER_PLACEHOLDERS[key],
#                 }
#             )

#     def clean_password(self):
#         passwd = self.cleaned_data.get("password", "")
#         if not passwd or len(passwd) < 8:
#             raise ValidationError(
#                 _("Password should be between 8 and 16 characters long."),
#                 code="invalid",
#                 params={"password": ""},
#             )
#         return passwd


# class PasswordResetRequestForm(forms.Form):
#     email = forms.EmailField(required=True)

#     def __init__(self, *args, **kwargs):
#         super(PasswordResetRequestForm, self).__init__(*args, **kwargs)
#         self.fields["email"].widget.attrs.update(
#             {
#                 "type": "email",
#                 "autofocus": True,
#                 "class": "input is-primary",
#                 "placeholder": "abc@example.com",
#             }
#         )


# class ForgotPasswordResetForm(forms.Form):
#     password = forms.CharField(widget=forms.PasswordInput)
#     retype_password = forms.CharField(widget=forms.PasswordInput)

#     def __init__(self, *args, **kwargs):
#         self.reset_obj = kwargs.pop("reset_obj")
#         super().__init__(*args, **kwargs)
#         for key in self.fields:
#             self.fields[key].widget.attrs.update(
#                 {
#                     "class": "input is-primary",
#                     "placeholder": REGISTER_PLACEHOLDERS[key],
#                 }
#             )

#     def clean(self):
#         cleaned = self.cleaned_data
#         pwd = cleaned.get("password")
#         repwd = cleaned.get("retype_password")
#         if repwd != pwd:
#             raise ValidationError(
#                 {"retype_password": "Password does not match."}
#             )
#         return cleaned
