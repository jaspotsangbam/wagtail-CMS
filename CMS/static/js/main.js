(function ($) {
    
    // ie polyfill for Includes
    if (!String.prototype.includes) {
      String.prototype.includes = function(search, start) {
        if (typeof start !== 'number') {
          start = 0;
        }

        if (start + search.length > this.length) {
          return false;
        } else {
          return this.indexOf(search, start) !== -1;
        }
      };
    }
    
    // ACCORDION
    var Accordion = function(wrapper) {
        this.wrapper = $(wrapper);
        this.setup();
    }

    Accordion.prototype = {
        setup: function() {
            this.anchor = '#' + this.wrapper[0].id;
            this.header = this.wrapper.find('[class$=accordion-header]');
            this.body  = this.wrapper.find('[class$=accordion-body]');
            this.expandIcon = this.wrapper.find('.expand');
            this.collapseIcon = this.wrapper.find('.collapse');

            this.setInitialView()
            this.startWatchers();
        },

        setInitialView: function() {
            if (this.anchor === window.location.hash) {
                this.collapseIcon.show();
                this.header.addClass('open');
                this.header.attr('aria-expanded', true);
            } else {
                this.body.hide();
                this.expandIcon.show();
            }
        },

        startWatchers: function() {
            var that = this;
            this.header.click(this.handleAccordionToggle.bind(this));

            this.header.keydown(function(evt) {
                if(evt.which === 13 || evt.which === 32) {
                  that.handleAccordionToggle();
                }
            });
        },

        handleAccordionToggle: function() {
            if (this.header.hasClass('open')) {
                this.header.attr('aria-expanded', false);
                this.body.hide();
                this.expandIcon.show();
                this.collapseIcon.hide();
                this.header.removeClass('open');
            }
            else {
                this.header.attr('aria-expanded', true);
                this.body.show();
                this.expandIcon.hide();
                this.collapseIcon.show();
                this.header.addClass('open');
            }
        }
    }


    // BOOKMARK NAV
    var NavBookMarkBtn = function(btn) {
    this.btn = $(btn);
    this.setup();
}

    NavBookMarkBtn.prototype = {
        setup: function() {
            this.navBar = $('.discover-uni-nav');
            this.loadSelectedCourses();
            this.startWatcher();
        },

        loadSelectedCourses: function() {
            if (JSON.parse(localStorage.getItem('comparisonCourses'))) {
                this.selectedCourses = JSON.parse(localStorage.getItem('comparisonCourses'));
            } else {
                this.selectedCourses = [];
            }

            if (this.selectedCourses.length) {
              this.btn.text(this.selectedCourses.length);
            }
        },

        startWatcher: function() {
            var that = this;
            this.navBar.on('loadeddata', function() {
                that.loadSelectedCourses();
            })
        }
    }


    // COOKIE BANNER
    var CookieBanner = function(wrapper) {
        this.wrapper = $(wrapper);
        this.setup();
    }

    CookieBanner.prototype = {
        setup: function() {
            this.acceptBtn = this.wrapper.find('.cookie-banner__ok');
            this.findOutMoreBtn = this.wrapper.find('.cookie-banner__find-out-more');

            this.startWatchers();
        },

        startWatchers: function() {
            var that = this;

            this.acceptBtn.click(function() {
                document.cookie = "discoverUniCookies=accepted;";
                that.wrapper.hide();
            });
        }
    }


    // DROPDOWN
    var PageDropdowns = function(dropdowns) {
        this.dropdownsList = $(dropdowns);
        this.setup()
    }

    PageDropdowns.prototype = {
        setup: function() {
            this.dropdowns = [];
            this.initialiseDropdowns();
            this.startCloseWatcher();
        },

        initialiseDropdowns: function() {
            for (var i = 0; i < this.dropdownsList.length; i++) {
                this.dropdowns.push(new Dropdown(this.dropdownsList[i], this.closeAll.bind(this)));
            }
        },

        startCloseWatcher: function() {
            var that = this;
            $(document).click(function() {
                that.closeAll();
            });
        },

        closeAll: function(activeSelector) {
            for (var i = 0; i < this.dropdowns.length; i++) {
                this.dropdowns[i].closeOptionList();
            }

            if (activeSelector) {
                activeSelector.openOptionList();
            }
        }
    }

    var Dropdown = function(wrapper, closeCallback) {
        this.wrapper = $(wrapper);
        this.closeCallback = closeCallback;
        this.setup();
    }

    Dropdown.prototype = {
        setup: function() {
            this.baseSelect = this.wrapper.find('select');
            this.options = [];
            this.createUISelect();
        },

        createUISelect: function() {
            var baseSelect = this.baseSelect[0];
            var uiSelect = document.createElement("div");
            uiSelect.setAttribute("class", "select-selected");
            uiSelect.setAttribute('tabindex', 0)
            this.wrapper.append(uiSelect);
            this.uiSelect = this.wrapper.find('.select-selected');
            this.startWatcher();
            this.createOptionList();
            this.baseSelect.hide();
        },

        createOptionList: function() {
            var baseSelect = this.baseSelect[0];
            var optionList = document.createElement("div");
            optionList.setAttribute("class", "select-items select-hide");
            for (var i = 0; i < baseSelect.length; i++) {
                var optionId = baseSelect.id + '-' + i;
                this.options.push(new DropdownOption(baseSelect[i], optionId, optionList, this.handleSelection.bind(this)));
            }
            this.wrapper.append(optionList)
            this.optionList = this.wrapper.find('.select-items');
        },

        resetOptionList: function() {
            this.optionList.remove();
            this.createOptionList();
            this.uiSelect[0].innerHTML = this.options[0].baseOption[0].innerHTML;
        },

        startWatcher: function() {
            var that = this;

            this.uiSelect.click(function(evt) {
                evt.stopPropagation();
                activeSelector = that;
                if (that.uiSelect.hasClass('select-arrow-active')) {
                    var activeSelector = null;
                }
                that.closeCallback(activeSelector);
            });

            this.uiSelect.keydown(function(evt) {
                if (event.which === 13) {
                    evt.stopPropagation();
                    activeSelector = that;
                    if (that.uiSelect.hasClass('select-arrow-active')) {
                        var activeSelector = null;
                    }
                    that.closeCallback(activeSelector);
                }
            });

            this.wrapper.keydown(function(evt) {
                if (event.which === 27) {
                    that.closeCallback(null);
                }
            });

            this.baseSelect.on('loadeddata', function() {
                that.resetOptionList();
            })
        },

        openOptionList: function() {
            this.optionList.toggleClass("select-hide");
            this.uiSelect.toggleClass("select-arrow-active");
        },

        closeOptionList: function() {
            this.optionList.addClass("select-hide");
            this.uiSelect.removeClass("select-arrow-active");
        },

        handleSelection: function(selection) {
            for (var i = 0; i < this.baseSelect[0].length; i++) {
                if (this.baseSelect[0][i].innerHTML == selection.baseOption[0].innerHTML) {
                    this.baseSelect[0].selectedIndex = i;
                    this.baseSelect.trigger('change');
                    this.uiSelect[0].innerHTML = selection.baseOption[0].innerHTML;
                    for (var j = 0; j < this.options.length; j++) {
                        this.options[j].unselect();
                    }
                    selection.markSelected();
                }
            }
        }
    }

    var DropdownOption = function(option, index, listContainer, selectionCallback) {
        this.baseOption = $(option);
        this.index = index;
        this.listContainer = $(listContainer);
        this.selectionCallback = selectionCallback;
        this.setup();
    }

    DropdownOption.prototype = {
        setup: function() {
            this.value = this.baseOption[0].text;
            this.createUIOption();
            this.startWatcher();
        },

        createUIOption: function() {
            var uiOption = document.createElement("div");
            uiOption.setAttribute("id", this.index);
            uiOption.setAttribute("class", 'option');
            uiOption.setAttribute('tabindex', 0)
            uiOption.innerHTML = this.baseOption[0].innerHTML;
            if (this.baseOption[0].disabled) {
                uiOption.setAttribute("class", 'select-hide');
            }
            this.listContainer.append(uiOption);
            this.uiOption = this.listContainer.find('#' + this.index);
        },

        startWatcher: function() {
            var that = this;
            this.uiOption.click(function() {
                that.selectionCallback(that);
            });

            this.uiOption.keydown(function() {
                if (event.which === 13) {
                    that.selectionCallback(that);
                }
            });
        },

        unselect: function() {
            this.uiOption.removeClass("same-as-selected");
        },

        markSelected: function() {
            this.uiOption.addClass("same-as-selected");
        }
    }


    //FEEDBACK FORM
    var FeedbackForm = function(wrapper) {
        this.wrapper = $(wrapper);
        this.setup();
    }

    FeedbackForm.prototype = {
        setup: function() {
            this.toggleBtn = this.wrapper.find('.feedback-form__toggle');
            this.formHeading = this.wrapper.find('.feedback-form__message');
            this.feedbackThankYou = this.wrapper.find('.feedback-form__thank-you');
            this.formBody = this.wrapper.find('.feedback-form__body');
            this.errorMessage = this.wrapper.find('.feedback-form__error-message');
            this.form = this.wrapper.find('.feedback-form__form');
            this.submitBtn = this.wrapper.find('.feedback-form__submit-button');

            this.startWatchers();
        },

        startWatchers: function() {
            var that = this;
            this.toggleBtn.click(function() {
                that.formBody.show();
            });

            this.submitBtn.click(function() {
                var formData = that.form.serializeArray();
                data = {
                    "page": window.location.href,
                }

                for (var i = 0; i < formData.length; i++) {
                    data[formData[i].name] = formData[i].value;
                }

                var url = window.location.origin + '/feedback';
                $.post(url, data, function(data,status,xhr) {
                    that.handleSubmissionSuccess();
                }, 'json')
                .fail(function(data,status,xhr) {
                    that.handleSubmissionError();
                });
            })
        },

        handleFormClose: function() {
            this.formBody.hide();
            this.form[0].reset();
        },

        handleSubmissionSuccess: function() {
            this.errorMessage.hide();
            this.handleFormClose();
            this.formHeading.hide();
            this.feedbackThankYou.show();
        },

        handleSubmissionError: function() {
            this.errorMessage.show();
        }
    }


    //NAV BAR
    var NavBar = function(wrapper) {
        this.wrapper = $(wrapper);
        this.setup();
    }

    NavBar.prototype = {
        setup: function() {
            this.mobileBurgerButton = this.wrapper.find('#burger-menu');
            this.mobileCloseButton = this.wrapper.find('#close-menu');
            this.mobileMenuBody = this.wrapper.find('.discover-uni-nav__mobile-links');

            this.initialiseDropdowns();
            this.startWatchers();
        },

        initialiseDropdowns: function() {
            this.dropdowns = []
            var dropdowns = this.wrapper.find('.discover-uni-nav__desktop-dropdown');
            for (var i = 0; i < dropdowns.length; i++) {
                this.dropdowns.push(new NavDropdown(dropdowns[i]));
            }
        },

        startWatchers: function() {
            var that = this;
            this.mobileBurgerButton.click(function() {
                that.mobileMenuBody.show();
                that.mobileBurgerButton.hide();
                that.mobileCloseButton.show();
            });

            this.mobileCloseButton.click(function() {
                that.mobileMenuBody.hide();
                that.mobileCloseButton.hide();
                that.mobileBurgerButton.show();
            });
        }
    }

    var NavDropdown =  function(wrapper) {
        this.wrapper = $(wrapper);
        this.setup();
    }

    NavDropdown.prototype = {
        setup: function() {
            this.toggle = this.wrapper.find('.discover-uni-nav__desktop-dropdown-toggle');
            this.body = this.wrapper.find('.discover-uni-nav__desktop-dropdown-body');

            this.startWatcher();
        },

        startWatcher: function() {
            var that = this;
            this.toggle.click(function() {
                that.body.toggle();
            });
        }
    }


    // SEARCH DROPDOWN
    var SearchDropdown = function(container) {
        this.container = $(container);
        this.minSearchTermLength = 3;
        this.setup()
    }

    SearchDropdown.prototype = {
        setup: function() {
            this.selectionField = this.container.find('.selection-field');
            this.fieldName = this.selectionField[0].name;
            this.searchField = $(this.container.find('.search-field-input')[0]);
            this.optionList = $(this.container.find('.options-list'));
            this.placeholder = $(this.optionList.find('.placeholder'));
            this.initialiseSelect();
            this.watchForFocus();
            this.watchForSearchTerm();
        },

        initialiseSelect: function() {
            var that = this;
            $.each(JSON.parse(localStorage.getItem("uniJSON")), function(index, item) {
                var optionId = that.fieldName + '-' + index;
                var optionValue = '"' + item.name + '"';

                var option = document.createElement("option");
                option.setAttribute("id", optionId);
                option.setAttribute("value", optionValue);
                option.innerHTML = item.name;
                that.selectionField.append(option);
            });
            this.selectOptions = this.selectionField.find('option');
            this.initialiseOptions();
        },

        initialiseOptions: function() {
            this.options = []
            for (var i = 0; i < this.selectOptions.length; i++) {
                this.options.push(new SearchOption(this.selectOptions[i], this.optionList, this.handleSelection.bind(this)));
            }
        },

        watchForFocus: function() {
            var that = this;
            this.searchField.focus(function() {
                that.optionList.show();
            });

            $(document).click(function(e) {
                if (!that.container[0].contains(e.target)) {
                  that.optionList.hide();
                }
            });
        },

        watchForSearchTerm: function() {
            var that = this;
            this.searchField.keyup(function(e) {
                if (e.target.value.length >= that.minSearchTermLength) {
                    that.placeholder.hide();
                    that.filterOptionsList(e.target.value);
                } else {
                    that.placeholder.show();
                    that.clearFilter();
                }
            });
        },

        clearFilter: function() {
            for (var i = 0; i < this.options.length; i++) {
                this.options[i].hideOption();
            }
        },

        clearSearch: function() {
            this.searchField[0].value = '';
            this.clearFilter();
        },

        filterOptionsList: function(searchTerm) {
            var searchTerm = searchTerm.toLowerCase();
            for (var i = 0; i < this.options.length; i++) {
                this.options[i].filterForSearch(searchTerm, this.selectionField.value);
            }
        },

        handleSelection: function(option) {
            this.clearSearch();
            this.searchField[0].value = option.textValue;
            this.optionList.hide();
        }
    }

    var SearchOption = function(option, wrapper, handleSelectionCallback) {
        this.option = option;
        this.wrapper = wrapper;

        this.handleSelection = handleSelectionCallback;
        this.setup();
    }

    SearchOption.prototype = {
        setup: function() {
            this.textValue = this.option.innerText;
            this.id = this.option.id;
            this.idValue = this.option.value;

            this.createUIOption();
            this.watchForSelection();
        },

        createUIOption: function() {
            var uiOption = document.createElement("div");
            uiOption.setAttribute("id", this.id);
            uiOption.setAttribute("class", 'option');
            uiOption.innerHTML = this.textValue;
            this.wrapper.append(uiOption);
            this.uiOption = this.wrapper.find('#' + this.id);
            if (this.option.disabled) {
                this.uiOption.hide();
            }
        },

        watchForSelection: function() {
            var that = this;
            $(this.uiOption).click(function(e) {
                that.option.selected = true;
                that.handleSelection(that);
            })
        },

        filterForSearch: function(searchTerm, selectedOptions) {
            if (this.textValue.toLowerCase().indexOf(searchTerm) > -1) {
                $(this.uiOption).show();
            } else {
                $(this.uiOption).hide();
            }
        },

        hideOption: function() {
            $(this.uiOption).hide();
        }
    }


    // SUBJECT CHOOSER
    var SubjectSelector = function(wrapper) {
        this.wrapper = $(wrapper);
        this.setup()
    }

    SubjectSelector.prototype = {
        setup: function() {
            this.subjectAreaSelector = this.wrapper.find('#subjectArea');
            this.subjectSelector = this.wrapper.find('#subject');
            this.subjectCodeSelector = this.wrapper.find('#subjectCode');
            this.subjectQuery = $('#subject_query');
            if (this.subjectQuery.length > 0) {
                this.initialSelection = this.subjectQuery.val().split(',');
            } else {
                this.initialSelection = null;
            }

            this.loadSubjectData();
            this.startWatchers();
        },

        loadSubjectData: function() {
            var that = this;
            if (localStorage.getItem("subjectJSON") === null) {
                $.getJSON("/static/jsonfiles/subject-codes.json", function(result) {
                    result.sort(function(a, b){
                        if (a.englishname < b.englishname) { return -1; }
                        if (a.englishname > b.englishname) { return 1; }
                        return 0;
                    });

                    localStorage.setItem("subjectJSON", JSON.stringify(result));

                    that.subjectData = result;
                    that.initialiseSelectors();
                })
            } else {
                this.subjectData = JSON.parse(localStorage.getItem("subjectJSON"));
                this.initialiseSelectors();
            }
        },

        initialiseSelectors: function() {
            for (var i = 0; i < this.subjectData.length; i++) {
                var item = this.subjectData[i];

                if (item.level === "1") {
                    var selected = this.initialSelection && this.initialSelection[0].indexOf(item.code) !== -1;
                    this.subjectAreaSelector.append(this.createOption(item.code, item.englishname, selected));
                }

                if (item.level === "2") {
                    var selected = this.initialSelection && this.initialSelection[0].indexOf(item.code) !== -1;
                    this.subjectSelector.append(this.createOption(item.code, item.englishname, selected));
                    if (selected) {
                        this.toggleCodeSelector();
                    }
                }

                if (item.level === "3") {
                    var selected = this.initialSelection && this.initialSelection.length === 1 && this.initialSelection[0] === item.code;
                    this.subjectCodeSelector.append(this.createOption(item.code, item.englishname, selected, item.code));
                }
            }

            this.subjectOptions = this.subjectSelector.find('option');
            this.subjectCodeOptions = this.subjectCodeSelector.find('option');
            this.subjectAreaSelector.trigger('loadeddata');
            this.subjectSelector.trigger('loadeddata');
            this.subjectCodeSelector.trigger('loadeddata');
        },

        createOption: function(value, text, selected, data) {
            var option = document.createElement("option");
            option.setAttribute("value", value);
            option.innerHTML = text;
            if (data) {
                option.setAttribute('data-code', data);
            }
            if (selected) {
                option.setAttribute('selected', true);
            }
            return option;
        },

        startWatchers: function() {
            var that = this;

            this.subjectAreaSelector.change(this.handleAreaSelection.bind(this));

            this.subjectSelector.change(this.handleSubjectSelection.bind(this));
        },

        handleAreaSelection: function() {
            for (var i = 0; i < this.subjectOptions.length; i++) {
                var option = this.subjectOptions[i];
                $(option).removeAttr("disabled");
                if (option.value.indexOf(this.subjectAreaSelector[0].value) === -1) {
                    $(option).attr("disabled", "disabled");
                }
            }
            this.subjectSelector.trigger('loadeddata');
        },

        handleSubjectSelection: function() {
            var all = ''
            for (var i = 0; i < this.subjectCodeOptions.length; i++) {
                var option = this.subjectCodeOptions[i];
                $(option).attr("disabled", "disabled");
                if (option.dataset.code.includes(this.subjectSelector[0].value)) {
                    $(option).removeAttr("disabled");
                    all += option.value + ',';
                }
            }
            this.subjectCodeOptions[0].value = all;

            this.toggleCodeSelector();

            this.subjectCodeSelector.trigger('loadeddata');
        },

        toggleCodeSelector: function() {
            this.subjectCodeSelector.removeClass('hidden');
            this.subjectCodeSelector.addClass('visible');
        }
    }

    function init() {
        $.urlParam = function (name) {
            var results = new RegExp('[\?&]' + name + '=([^&#]*)')
                              .exec(window.location.search);

            return (results !== null) ? results[1] || 0 : false;
        }

        // Course finder

        $.getJSON("/static/jsonfiles/institutions.json", function(result) {
            var version = result.version;
            var institutions = result.institutions;

            if (version + "" !== localStorage.getItem("uniJSONVersion") || localStorage.getItem("uniJSON") === null) {
                institutions.sort(function(a, b){
                    if(a.order_by_name < b.order_by_name) { return -1; }
                    if(a.order_by_name > b.order_by_name) { return 1; }
                    return 0;
                });

                localStorage.setItem("uniJSON", JSON.stringify(institutions));
                localStorage.setItem("uniJSONVersion", version);
            }
        })

        if (localStorage.getItem("subjectJSON") === null) {
            $.getJSON("/static/jsonfiles/subject-codes.json", function(result) {
                result.sort(function(a, b){
                    if (a.englishname < b.englishname) { return -1; }
                    if (a.englishname > b.englishname) { return 1; }
                    return 0;
                });

                localStorage.setItem("subjectJSON", JSON.stringify(result));
            })
        }

        var accordions = $('[class$=accordion]');
        for (var i = 0; i < accordions.length; i++) {
            new Accordion(accordions[i]);
        }

        var bookmarkBtns = $('.nav-bookmark__count');
        for (var i = 0; i < bookmarkBtns.length; i++) {
            new NavBookMarkBtn(bookmarkBtns[i]);
        }

        var cookieBanner = $('.cookie-banner');
        for (var i = 0; i < cookieBanner.length; i++) {
            new CookieBanner(cookieBanner[i]);
        }

        var dropdowns = $('[class$=selector]');
        new PageDropdowns(dropdowns);

        var feedbackForm = $('.feedback-form__wrapper');
        for (var i = 0; i < feedbackForm.length; i++) {
            new FeedbackForm(feedbackForm[i]);
        }

        var navBar = $('.discover-uni-nav');
        for (var i = 0; i < navBar.length; i++) {
            new NavBar(navBar[i]);
        }

        var searchDropdowns = $('.search-dropdown');
        for (var i = 0; i < searchDropdowns.length; i++) {
            new SearchDropdown(searchDropdowns[i]);
        }

        var selectorsWrapper = $('.subject-picker');
        for (var i = 0; i < selectorsWrapper.length; i++) {
            new SubjectSelector(selectorsWrapper[0]);
        }

        // GOOGLE  ANALYTICS
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-147556197-1');
    }

    $(document).on('page:load', init);
    $(init)
}(jQuery))
