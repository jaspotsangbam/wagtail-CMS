from django.shortcuts import render


def widget_iframe(request, uk_prn, kis_course_id, orientation, language, kis_mode):
    context = {
        'uk_prn': uk_prn,
        'kis_course_id': kis_course_id,
        'orientation': orientation,
        'language': language,
        'kis_mode': kis_mode,
    }

    return render(request, 'widget/iframe_widget.html', context)
