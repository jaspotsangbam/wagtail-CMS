# Generated by Django 2.1.8 on 2019-06-26 08:48

from django.db import migrations
import wagtail.core.blocks
import wagtail.core.fields


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0009_auto_20190604_0928'),
    ]

    operations = [
        migrations.AlterField(
            model_name='section',
            name='subsections',
            field=wagtail.core.fields.StreamField([('subsection', wagtail.core.blocks.StructBlock([('subsection_title', wagtail.core.blocks.TextBlock()), ('subsection_content', wagtail.core.blocks.RichTextBlock())]))]),
        ),
    ]
