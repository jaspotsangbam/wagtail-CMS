# Generated by Django 2.2.3 on 2019-08-08 17:08

from django.db import migrations
import wagtail.core.blocks
import wagtail.core.fields


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='menu',
            name='menu_items',
            field=wagtail.core.fields.StreamField([('simple_menu_item', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(help_text='Leave blank to use the page name', required=False)), ('link_page', wagtail.core.blocks.PageChooserBlock(required=False))])), ('multi_menu_item', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(required=False)), ('menu_items', wagtail.core.blocks.StreamBlock([('simple_menu_item', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(help_text='Leave blank to use the page name', required=False)), ('link_page', wagtail.core.blocks.PageChooserBlock(required=False))]))], icon='arrow-left', label='Items'))]))]),
        ),
    ]
