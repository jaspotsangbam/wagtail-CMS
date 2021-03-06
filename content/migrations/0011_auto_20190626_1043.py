# Generated by Django 2.1.8 on 2019-06-26 10:43

from django.db import migrations
import wagtail.core.blocks
import wagtail.core.fields


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0010_auto_20190626_0848'),
    ]

    operations = [
        migrations.AlterField(
            model_name='section',
            name='lateral_links',
            field=wagtail.core.fields.StreamField([('links', wagtail.core.blocks.PageChooserBlock(required=False))]),
        ),
        migrations.AlterField(
            model_name='section',
            name='related_links',
            field=wagtail.core.fields.StreamField([('links', wagtail.core.blocks.PageChooserBlock(required=False))]),
        ),
    ]
