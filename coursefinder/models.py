import math

from django.db.models.fields import TextField

from wagtail.core.models import Page
from wagtail.core.fields import StreamField, RichTextField
from wagtail.core import blocks
from wagtail.admin.edit_handlers import FieldPanel, StreamFieldPanel

from coursefinder import request_handler
from coursefinder.utils import choose_country_sibling_finder, mode_of_study_sibling_finder, \
    choose_subject_sibling_finder, narrow_search_sibling_finder, postcode_sibling_finder, summary_sibling_finder, \
    results_sibling_finder
from errors.models import ApiError


class CourseFinderLandingPage(Page):
    header = TextField(blank=True)
    subheader = TextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('header', classname="full"),
        FieldPanel('subheader', classname="full")
    ]

    @property
    def country_finder_page(self):
        return choose_country_sibling_finder(self.get_children().specific())

    def has_country_finder_page(self):
        return self.country_finder_page is not None


class CourseFinderChooseCountry(Page):
    page_order = 1
    question = TextField(blank=True)
    next_section = StreamField([
        ('section', blocks.PageChooserBlock())
    ])

    content_panels = Page.content_panels + [
        FieldPanel('question', classname="full"),
        StreamFieldPanel('next_section', classname="full")
    ]

    @property
    def next_page(self):
        return mode_of_study_sibling_finder(self)

    @property
    def back_page(self):
        return self.get_parent()


class CourseFinderModeOfStudy(Page):
    page_order = 2
    question = TextField(blank=True)
    helper_text = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('question', classname="full"),
        FieldPanel('helper_text', classname="full")
    ]

    @property
    def next_page(self):
        return choose_subject_sibling_finder(self)

    @property
    def back_page(self):
        return choose_country_sibling_finder(self.get_siblings().specific())


class CourseFinderChooseSubject(Page):
    page_order = 3
    question = TextField(blank=True)
    helper_text = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('question', classname="full"),
        FieldPanel('helper_text', classname="full")
    ]

    @property
    def next_page(self):
        return narrow_search_sibling_finder(self)

    @property
    def back_page(self):
        return mode_of_study_sibling_finder(self)


class CourseFinderNarrowSearch(Page):
    page_order = 4
    use_skip_form = True
    question = TextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('question', classname="full")
    ]

    @property
    def back_page(self):
        return choose_subject_sibling_finder(self)


class CourseFinderTownCity(Page):
    page_order = 5
    use_skip_form = True
    question = TextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('question', classname="full")
    ]

    @property
    def next_page(self):
        return summary_sibling_finder(self)

    @property
    def back_page(self):
        return narrow_search_sibling_finder(self)


class CourseFinderUni(Page):
    page_order = 6
    use_skip_form = True
    question = TextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('question', classname="full")
    ]

    @property
    def next_page(self):
        return summary_sibling_finder(self)

    @property
    def back_page(self):
        return narrow_search_sibling_finder(self)


class CourseFinderPostcode(Page):
    page_order = 7
    use_skip_form = True
    question = TextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('question', classname="full")
    ]

    @property
    def next_page(self):
        return summary_sibling_finder(self)

    @property
    def back_page(self):
        return narrow_search_sibling_finder(self)


class CourseFinderSummary(Page):
    page_order = 8
    header = TextField(blank=True)
    country_section_title = TextField(blank=True)
    mode_of_study_section_title = TextField(blank=True)
    subjects_section_title = TextField(blank=True)
    narrow_by_section_title = TextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('header', classname="full"),
        FieldPanel('country_section_title', classname="full"),
        FieldPanel('mode_of_study_section_title', classname="full"),
        FieldPanel('subjects_section_title', classname="full"),
        FieldPanel('narrow_by_section_title', classname="full")
    ]

    @property
    def next_page(self):
        return results_sibling_finder(self)

    @property
    def back_page(self):
        return postcode_sibling_finder(self)


class CourseFinderResults(Page):
    page_order = 9
    header = TextField(blank=True)
    related_links_title = TextField(blank=True)
    related_links = StreamField([
        ('links', blocks.PageChooserBlock()),
    ])

    content_panels = Page.content_panels + [
        FieldPanel('header', classname="full"),
        FieldPanel('related_links_title'),
        StreamFieldPanel('related_links', classname="full"),
    ]


class BaseSearch:

    def __init__(self, page, count):
        self.page = int(page)
        self.count = int(count)
        self.offset = self.count * (self.page - 1)
        self.total_courses = None
        self.total_institutions = None
        self.results = None

    @property
    def show_previous_icon(self):
        return False if len(self.pages_to_left) == 0 else True

    @property
    def previous_page(self):
        return self.page - 1

    @property
    def pages_to_left(self):
        if self.page == 1:
            return []
        elif self.page == self.total_page_count and self.total_page_count != 2:
            return [self.page - 2, self.previous_page]
        else:
            return [self.previous_page]

    @property
    def pages_to_right(self):
        if self.page == self.total_page_count:
            return []
        elif self.page == 1 and self.total_page_count != 2:
            return [self.next_page, self.page + 2]
        else:
            return [self.next_page]

    @property
    def next_page(self):
        return self.page + 1

    @property
    def show_next_icon(self):
        return False if len(self.pages_to_right) == 0 else True

    @property
    def total_page_count(self):
        return math.ceil(self.total_institutions / self.count)


class CourseSearch:

    def __init__(self, course, institution):
        self.course = course
        self.institution = institution
        self.total_courses = None
        self.total_institutions = None
        self.results = None

    def execute(self):
        response = request_handler.query_course_and_institution(self.course, self.institution)
        error = None

        if response.ok:
            data = response.json()
            self.total_courses = data.get('total_number_of_courses')
            self.total_institutions = data.get('total_results')
            self.results = data.get('items')
        else:
            error = ApiError(response.status_code, 'searching courses for %s %s' %
                             (self.institution, self.course))

        return error


class CourseFinderSearch(BaseSearch):

    def __init__(self, subject, institution, mode, countries, page, count):
        super().__init__(page, count)
        self.subject = subject
        self.institution = institution
        self.mode = mode
        self.countries = countries

    def execute(self):
        response = request_handler.course_finder_query(self.subject, self.institution, self.mode, self.countries,
                                                       self.count, self.offset)
        error = None

        if response.ok:
            data = response.json()
            self.total_courses = data.get('total_number_of_courses')
            self.total_institutions = data.get('total_results')
            self.results = data.get('items')
        else:
            error = ApiError(response.status_code, 'searching courses for %s, %s, %s, %s' %
                             (self.subject, self.institution, self.mode, self.countries))

        return error
