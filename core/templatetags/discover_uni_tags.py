from urllib.parse import urlencode

from django import template

from CMS.enums import enums
from CMS.translations import DICT
from content.models import Section

register = template.Library()


@register.simple_tag
def queryparams(*_, **kwargs):
    safe_args = {key: value for key, value in kwargs.items() if value is not None}
    if safe_args:
        return '?{}'.format(urlencode(safe_args))
    return ''


@register.simple_tag
def get_translation(*_, **kwargs):
    key = kwargs.get('key')
    language = kwargs.get('language')
    string = DICT.get(key).get(language) if key in DICT else ''

    if not string:
        string = DICT.get(key).get(enums.languages.ENGLISH) if key in DICT else ''

    if 'substitutions' in kwargs:
        string = string % kwargs.get('substitutions')
    return string


@register.simple_tag
def create_list(*args):
    return args


@register.simple_tag
def insert_values_to_rich_text(*_, **kwargs):
    list(kwargs.get('substitutions'))
    return kwargs.get('content').source % (kwargs.get('substitutions'))


@register.simple_tag
def length_of_list(view_list):
    return len(view_list)


@register.simple_tag
def menu_content_pages_for_language(language):
    Section.get_all_for_language
