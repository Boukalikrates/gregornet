let failcount = 0;
let listdir = [];
let config = {};
let cache = {};
let serverinfo = { root: '', path: '', mods: '' };
let loadingcard = false;





function listeners() {
    "use strict";
    $('#filter').keyup(filter);
    $('img.stream-image').mouseover(function () {
        $('#size-' + $(this).attr('id')).html(this.naturalWidth + 'x' + this.naturalHeight)
    })

    $('.modechanger').click(function () {
        changemode($(this).attr('data-mode'))
    })

    $('.sortoption').click(function () {
        sort($(this).attr('data-sort'))
    })

    $('#clear-filter').click(function () {
        $('#filter').val('');
        filter('');
    })

    $('#sort-normal').click(function () {
        if (pathStorage('reverse') == 'yes') {
            pathStorage('reverse', 'no');
            $('#sort-normal').removeClass('reverse');
        } else {
            pathStorage('reverse', 'yes');
            $('#sort-normal').addClass('reverse');
        }

        sort();
    })

    $('body').keydown(function (e) {
        // e.preventDefault();
        switch (e.key) {
            case "F5":
                location = location;
                break;
            case "Backspace":
                location = '..';
                break;
            case "Home":
                e.preventDefault();
                $('main').scrollTop(0);
                break;
            case "End":
                e.preventDefault();
                $('main').scrollTop(999999999);
                break;
            case "ArrowDown":
                e.preventDefault();
                closestli();
                break;
            case "ArrowUp":
                e.preventDefault();
                closestli(true);
                break;
        }
    })


    $('.change-page-first').click(function () {
        loadcardph(0);
    })

    $('.change-page-prev').click(function () {
        loadcardph(+pathStorage('page') - 1);
    })

    $('.change-page-next').click(function () {
        loadcardph(+pathStorage('page') + 1);
    })

    $('.change-page-last').click(function () {
        loadcardph(Math.ceil(listdir.length / config.pagesize) - 1);
    })

    $('#splitpages').change(splitpages)
    $('#pagenumber').click(function () {
        let newnumber = prompt('Page number', pathStorage('page'));
        if (typeof newnumber == typeof '' && newnumber !== '') loadcardph(+newnumber);
    })

}










function init() {
    listeners();

    if (pathStorage('reverse') == 'yes') {
        $('#sort-normal').addClass('reverse');
    }



    $('#splitpages').prop('checked', pathStorage('splitpages') == 'yes');
    splitpages();


    $('#slidepages').change(function () {
        loadcardph(+$('#slidepages').prop('value'));
    })
    $('#pagenumber').click(function () {
        let newnumber = prompt('Page number', pathStorage('page'));
        if (typeof newnumber == typeof '' && newnumber !== '') loadcardph(+newnumber);
    })


    $('.spn').each(function () {
    })
    $('*[id][draggable=true]').each(function () {
        this.ondragstart = function (e) {
            //            e.dataTransfer.setData("datalink", e.target.dataset.link);
            e.dataTransfer.setData("text", e.target.id);
        }
    })
    $('*[data-drop]').each(function () {
        this.ondragover = function (e) {

            e.preventDefault();
        }

        this.ondrop = function (e) {

            e.preventDefault();
            let data = '' + e.dataTransfer.getData("text");
            if (e.target.id + '' != data) e.target.appendChild(document.getElementById(data));
        }
    })
    $('.loadmore').click(loadcards)

    $('main').scroll(function () {
        if ($('.page-content').height() - $('main').scrollTop() - $('main').height() < 200) {
            loadcards();
        }
    })

    var dialog = $('dialog')[0];
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    $('.show-upload').click(function () {
        dialog.showModal();
    })
    $('dialog').find('.close').click(function () {
        dialog.close();
    });

    $('#globalaudio audio').on('timeupdate', function () {
        let currentTime = $(this).prop('currentTime');
        let duration = $(this).prop('duration');
        $('#audioprogress')[0].MaterialProgress.setProgress(100 * currentTime / duration);
        if (currentTime == 0 && $(this).prop('paused')) {
            $('#audio-output').text('--:--')
        } else {
            $('#audio-output').text(humantime(currentTime) + ' / ' + humantime(duration))
        }
    }).on('ended', function () {
        if ($('#audio-autoplay').prop('checked')) {
            audionext();
        }
    });
    $('#audio-play-btn').click(audioplay)
    $('#audio-stop-btn').click(audiostop)
    $('#audio-next-btn').click(audionext)





    $.get('/papermache/listdir.py?path=' + encodeURIComponent(serverinfo.path), function (data, status) {
        if (status == 'success') {
            config = data.config;
            listdir = data.listdir;
            sort();
        }
    });

    changemode();
    window.onstorage = function (e) {
        if (e.key == 'mode') changemode();
    }
}

function pathStorage(key, value) {
    if (value !== undefined) {
        localStorage[key + '@' + serverinfo.path] = value;
    }
    return localStorage[key + '@' + serverinfo.path];
}

function changemode(mode, item) {
    if (mode) {
        pathStorage('mode', mode);
    } else if (pathStorage('mode')) {
        mode = pathStorage('mode');
    } else {
        mode = pathStorage('mode', 'default');
    }
    $('body').removeClass('mode-default mode-stream mode-list').addClass('mode-' + mode);

    item = item ? item : $('.item');
    item.each(function () {

        $(this).removeClass('blackitem mdl-list__item hidden mdl-cell--3-col mdl-cell--6-col mdl-cell--12-col mdl-cell--4-col-tablet mdl-cell--8-col-tablet mdl-cell--2-col-phone mdl-cell--4-col-phone');

        switch (mode) {
            case 'default':
                $(this).addClass('mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--2-col-phone');
                break;
            case 'list':
                $(this).addClass('mdl-list__item mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--4-col-phone');
                break;
            case 'stream':
                switch ($(this).find('.dirtitle').attr('data-type')) {
                    case 'folder':
                        $(this).addClass('blackitem mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--2-col-phone');
                        break;
                    case 'image':
                    case 'movie':
                    case 'audio':
                        $(this).addClass('mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone');
                        break;
                    default:
                        $(this).addClass('hidden')
                }
                break;
        }
    })
}

function splitpages() {
    split = pathStorage('splitpages', $('#splitpages').prop('checked') ? 'yes' : 'no') == 'yes';
    if (split) {
        $('.pagesbuttons').show();
        $('#splitpages').parent().addClass('is-checked');
    } else {
        $('.pagesbuttons').hide();
        $('#splitpages').parent().removeClass('is-checked');
    }


    loadcardph()
}

function sort(mode) {
    if (mode) {
        pathStorage('sort', mode);
    } else if (pathStorage('sort')) {
        mode = pathStorage('sort');
    } else {
        mode = pathStorage('sort', 'name');
    }
    // if (reverse) {
    //     localStorage['reverse'] = reverse;
    // } else if (localStorage) {
    //     reverse = localStorage['reverse'];
    // } else {
    //     reverse = localStorage['reverse'] = 'no';
    // }

    reverse = pathStorage('reverse');
    $('#sort-things1').text($('.sortoption[data-sort=' + mode + ']').attr('title'));

    listdir.sort(function (a, b) {
        let c = reverse == 'yes' ? b : a;
        let d = reverse == 'yes' ? a : b;
        if (c.isdir != d.isdir) return d.isdir - c.isdir;
        switch (mode) {
            case 'modified':
                return d.modified - c.modified;
            case 'random':
                return c.random.localeCompare(d.random);
            case 'name':
            default:
                return c.name.localeCompare(d.name, undefined, { numeric: true, sensitivity: 'base' });

        }
    });

    loadcardph();

}



function filter(item) {
    item = item.html ? item : $('.item, .itemph');
    let query = $('#filter').val().toLowerCase().split(' ');
    item.each(function (a, b) {
        let fail = false;
        for (let i = 0; i < query.length; i++) {
            //if ($(this).find('.dirtitle').text().toLowerCase().includes(query[i])) {
            if ($(this).text().toLowerCase().includes(query[i])) {
                //is good
            } else {
                fail = true;
                break;
            }
        }

        fail ? $(this).addClass('filtered') : $(this).removeClass('filtered');

    })
}

function stylize(item) { }

function scrollpagechips() {
    let pagechips = $('.pagechips');
    let pagechip = pagechips.find('.pagechip.spnc');
    if (pagechips.length > 0 && pagechip.length > 0)
        pagechips.animate({
            scrollLeft: pagechip.position().left + pagechips.scrollLeft() + (pagechip.outerWidth() - pagechips.outerWidth()) / 2
        }, 2000)
}

function closestli(reverse) {
    let proximity = reverse ? -Infinity : Infinity;
    let closest;

    $('.item').each(function () {
        let thisdis = $(this).offset().top;// + (reverse ? $(this).height() : 0);
        let condition = reverse ? (-100 > thisdis && thisdis > proximity) : (100 < thisdis && thisdis < proximity);
        if (condition) {
            proximity = thisdis;
            closest = $(this);
        }

    })
    if (closest) {
        $('main').scrollTop($('main').scrollTop() + closest.offset().top)
    } else if (reverse) {
        $('main').scrollTop(0)
    } else {
        $('main').scrollTop(1e10)

    }

    return closest;
}


function humantime(time) {
    if (isNaN(time)) return 'NaN';
    result = '';
    time = Math.floor(time)
    if (time < 0) {
        result += '-';
        time *= -1;
    }
    if (time >= 3600) {
        result += Math.floor(time / 3600);
        result += ':';
        if (time % 3600 < 600) {
            result += '0';
        }
    }
    result += Math.floor(time / 60) % 60;
    result += ':';
    if (time % 60 < 10) {
        result += '0';
    }
    result += time % 60;
    return result;
}

window.addEventListener('load', init);
