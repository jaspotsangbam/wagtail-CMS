# Generated by Django 2.2.3 on 2019-08-05 15:39

from django.db import migrations, models
import wagtail.core.fields


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0016_auto_20190612_1437'),
    ]

    operations = [
        migrations.AddField(
            model_name='homepage',
            name='intro',
            field=wagtail.core.fields.RichTextField(blank=True),
        ),
        migrations.AlterField(
            model_name='homepage',
            name='header',
            field=models.TextField(blank=True),
        ),
    ]