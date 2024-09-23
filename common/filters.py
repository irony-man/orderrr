from django_filters import filters, filterset

from common.models import Design


class DesignFilter(filterset.FilterSet):
    user = filters.UUIDFilter(
        field_name="user__userprofile__uid", lookup_expr="exact"
    )
    exclude_user_designs = filters.BooleanFilter(
        method="filter_exclude_user_designs"
    )
    exclude_design = filters.UUIDFilter(method="filter_exclude_design")

    class Meta:
        model = Design
        fields = (
            "user",
            "design_type",
            "exclude_user_designs",
            "exclude_design",
        )

    def filter_exclude_user_designs(self, queryset, name, value):
        if value and self.request.user.is_authenticated:
            return queryset.exclude(user=self.request.user)
        return queryset

    def filter_exclude_design(self, queryset, name, value):
        if value:
            return queryset.exclude(uid=value)
        return queryset
