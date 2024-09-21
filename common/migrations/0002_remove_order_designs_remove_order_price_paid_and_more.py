# Generated by Django 5.1.1 on 2024-09-21 03:37

import uuid

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models

import common.custom_fields


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="order",
            name="designs",
        ),
        migrations.RemoveField(
            model_name="order",
            name="price_paid",
        ),
        migrations.AddField(
            model_name="order",
            name="address",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.PROTECT,
                to="common.address",
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="order",
            name="card",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.PROTECT,
                to="common.card",
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="order",
            name="delivery_fee",
            field=common.custom_fields.PositiveFloatField(default=40.0),
        ),
        migrations.AlterField(
            model_name="card",
            name="card_number",
            field=models.CharField(
                max_length=16,
                validators=[django.core.validators.MinLengthValidator(16)],
            ),
        ),
        migrations.CreateModel(
            name="DesignOrderInstance",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("uid", models.UUIDField(default=uuid.uuid4, unique=True)),
                ("created", models.DateTimeField(auto_now_add=True)),
                ("updated", models.DateTimeField(auto_now=True)),
                ("base_price", common.custom_fields.PositiveFloatField()),
                ("discount", common.custom_fields.PercentField(default=0)),
                ("quantity", models.PositiveIntegerField(default=1)),
                (
                    "design",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to="common.design",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.AddField(
            model_name="order",
            name="design_order_instances",
            field=models.ManyToManyField(to="common.designorderinstance"),
        ),
    ]
