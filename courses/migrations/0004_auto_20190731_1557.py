# Generated by Django 2.2.3 on 2019-07-31 15:57

from django.db import migrations
import wagtail.core.blocks
import wagtail.core.fields


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0003_auto_20190712_0845'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coursedetailpage',
            name='accordions',
            field=wagtail.core.fields.StreamField([('satisfaction_panel', wagtail.core.blocks.StructBlock([('heading', wagtail.core.blocks.CharBlock(required=False)), ('lead_text', wagtail.core.blocks.CharBlock(required=False)), ('teaching_stats_header', wagtail.core.blocks.CharBlock(required=False)), ('learning_opportunities_stats_header', wagtail.core.blocks.CharBlock(required=False)), ('assessment_stats_header', wagtail.core.blocks.CharBlock(required=False)), ('organisation_stats_header', wagtail.core.blocks.CharBlock(required=False)), ('learning_resources_stats_header', wagtail.core.blocks.CharBlock(required=False)), ('learning_community_stats_header', wagtail.core.blocks.CharBlock(required=False)), ('student_voice_stats_header', wagtail.core.blocks.CharBlock(required=False)), ('nhs_placement_stats_header', wagtail.core.blocks.CharBlock(required=False))], icon='collapse-down', required=True)), ('entry_information_panel', wagtail.core.blocks.StructBlock([('heading', wagtail.core.blocks.CharBlock(required=False)), ('qualification_heading', wagtail.core.blocks.CharBlock(required=False)), ('qualification_intro', wagtail.core.blocks.CharBlock(required=False)), ('qualification_label_explanation_heading', wagtail.core.blocks.CharBlock(required=False)), ('tariffs_heading', wagtail.core.blocks.CharBlock(required=False)), ('tariffs_intro', wagtail.core.blocks.CharBlock(required=False))], icon='collapse-down', required=True)), ('after_one_year_panel', wagtail.core.blocks.StructBlock([('heading', wagtail.core.blocks.CharBlock(required=False)), ('section_heading', wagtail.core.blocks.CharBlock(required=False)), ('intro', wagtail.core.blocks.CharBlock(required=False)), ('lead', wagtail.core.blocks.CharBlock(required=False)), ('label_explanation_heading', wagtail.core.blocks.CharBlock(required=False))], icon='collapse-down', required=True)), ('after_course_panel', wagtail.core.blocks.StructBlock([('heading', wagtail.core.blocks.CharBlock(required=False)), ('section_heading', wagtail.core.blocks.CharBlock(required=False)), ('six_month_earnings_heading', wagtail.core.blocks.CharBlock(required=False)), ('three_years_earnings_heading', wagtail.core.blocks.CharBlock(required=False)), ('six_month_employment_heading', wagtail.core.blocks.CharBlock(required=False)), ('six_month_employment_intro', wagtail.core.blocks.CharBlock(required=False)), ('six_month_employment_lead', wagtail.core.blocks.CharBlock(required=False)), ('six_month_employment_roles_heading', wagtail.core.blocks.CharBlock(required=False)), ('six_month_employment_roles_intro', wagtail.core.blocks.CharBlock(required=False)), ('six_month_employment_roles_lead', wagtail.core.blocks.CharBlock(required=False)), ('six_month_employment_roles_label_explanation_heading', wagtail.core.blocks.CharBlock(required=False))], icon='collapse-down', required=True)), ('accreditation_panel', wagtail.core.blocks.StructBlock([('heading', wagtail.core.blocks.CharBlock(required=False)), ('section_heading', wagtail.core.blocks.CharBlock(required=False))], icon='collapse-down', required=True))]),
        ),
    ]
