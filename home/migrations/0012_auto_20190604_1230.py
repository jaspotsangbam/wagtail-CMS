# Generated by Django 2.1.8 on 2019-06-04 12:30

from django.db import migrations
import wagtail.core.blocks
import wagtail.core.fields


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0011_auto_20190604_1215'),
    ]

    operations = [
        migrations.AlterField(
            model_name='homepage',
            name='links',
            field=wagtail.core.fields.StreamField([('link', wagtail.core.blocks.StructBlock([('page', wagtail.core.blocks.PageChooserBlock()), ('title', wagtail.core.blocks.CharBlock()), ('subtitle', wagtail.core.blocks.CharBlock())]))]),
        ),
    ]
