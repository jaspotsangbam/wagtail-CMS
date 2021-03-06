from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin

from wagtail.admin import urls as wagtailadmin_urls
from wagtail.core import urls as wagtail_urls
from wagtail.documents import urls as wagtaildocs_urls

from . import welsh_urls

from courses import urls as courses_urls
from institutions import urls as institution_urls

from core import views as core_views
from search import views as search_views
from coursefinder import views as coursefinder_views
from courses import views as course_views

urlpatterns = [
    url(r'^django-admin/', admin.site.urls),

    url(r'^admin/', include(wagtailadmin_urls)),
    url(r'^documents/', include(wagtaildocs_urls)),

    url(r'^search/$', search_views.search, name='search'),
    url(r'^results/$', coursefinder_views.results, name='results'),
    url(r'^feedback',  core_views.submit_feedback, name='submit_feedback'),

    url(r'^narrow-search/$', coursefinder_views.narrow_search, name='narrow_search'),
    url(r'^course-finder/results/$', coursefinder_views.course_finder_results, name='course_finder_results'),

    url(r'^widget/', include('widget.urls')),
    url(r'^Widget/', include('widget.urls')),
    url(r'^course-details/', include(courses_urls)),
    url(r'^institution-details/', include(institution_urls)),
    url(r'^course-comparison/', course_views.compare_courses),

    url(r'(?P<language>[\w\-]+?)/', include(welsh_urls)),

    # For anything not caught by a more specific rule above, hand over to
    # Wagtail's page serving mechanism. This should be the last pattern in
    # the list:
    url(r'', include(wagtail_urls)),

    # Alternatively, if you want Wagtail pages to be served from a subpath
    # of your site, rather than the site root:
    #    url(r'^pages/', include(wagtail_urls)),
]


if settings.DEBUG:
    from django.conf.urls.static import static
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns

    # Serve static and media files from development server
    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
