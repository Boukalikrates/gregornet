let failcount = 0;
let listdir = [];
let playlist = [];
let playlistPath = '';
let config = {};
let pathConfig = {};
let cache = {};
let loadingcard = 0;

const themeColors = { //
    'red': 'D32F2F',
    'pink': 'C2185B',
    'purple': '7B1FA2',
    'deep-purple': '512DA8',
    'indigo': '303F9F',
    'blue': '1976D2',
    'light-blue': '0288D1',
    'cyan': '0097A7',
    'teal': '00796B',
    'green': '388E3C',
    'light-green': '689F38',
    'lime': 'AFB42B',
    'yellow': 'FBC02D',
    'amber': 'FFA000',
    'orange': 'F57C00',
    'deep-orange': 'E64A19',
    'brown': '5D4037',
    'grey': '616161',
    'blue-grey': '455A64',
}
const folderColorList = [
    'folder-color-red',
    'folder-color-pink',
    'folder-color-purple',
    'folder-color-deep-purple',
    'folder-color-indigo',
    'folder-color-blue',
    'folder-color-light-blue',
    'folder-color-cyan',
    'folder-color-teal',
    'folder-color-green',
    'folder-color-light-green',
    'folder-color-lime',
    'folder-color-yellow',
    'folder-color-amber',
    'folder-color-orange',
    'folder-color-deep-orange',
    'folder-color-brown',
    'folder-color-grey',
    'folder-color-blue-grey'
]


function init() {
    "use strict";
    $('#filter').keyup(loadPage);
    $('img.stream-image').mouseover(function () {
        $('#size-' + $(this).attr('id')).html(this.naturalWidth + 'x' + this.naturalHeight)
    })


    $('.modechanger').click(function () {
        changemode($(this).attr('data-mode'))
    })

    $('.sortoption').click(function () {
        sort($(this).attr('data-sort'), $(this).attr('data-reverse'));
    })

    $('.set-color-button').click(function () {

        $('#file-modify-action').val('savePathConfig')
        $('#file-modify-path').val(location.pathname)
        $('#file-modify-name').val('color')
        $('#file-modify-val').val($(this).attr('data-set-color'))

        $('#file-modify-return-path').val(location.pathname)
        $('#file-modify-form').trigger('submit');
    })

    $('#clear-filter').click(function () {
        $('#filter').val('');
        filter('');
    })

    $('#sort-normal').click(function () {
        if (pathStorage('reverse') == 'yes') {
            pathStorage('reverse', 'no');
        } else {
            pathStorage('reverse', 'yes');
        }
        sort();
    })

    //letting me know if user has touchscreen
    $('body').one('touchstart', function () {
        $('body').addClass('touchstart')
    })
    $(document).on('scrollend', function () {
        lazyLoadNextImage();
        lazyLoadNextThumbnail();
    })
    window.onresize = calculateGridRow;

    $('body').keydown(function (e) {
        // e.preventDefault();
        switch (e.key) {
            case "F5":
                location = location;
                break;
            case "Backspace":
                if (!$('input:focus, textarea:focus, *[contenteditable=true]:focus').length)
                    location = '..';
                break;
            case "Home":
                e.preventDefault();
                $('html').animate({
                    scrollTop: 0
                }, 100)
                break;
            case "End":
                e.preventDefault();
                $('html').animate({
                    scrollTop: $('.mdl-layout').height() - $('html').height()
                }, 100)
                break;
            case "ArrowDown":
                if (!$('input:focus, textarea:focus, *[contenteditable=true]:focus').length) {
                    e.preventDefault();
                    closestli();
                }
                break;
            case "ArrowUp":
                if (!$('input:focus, textarea:focus, *[contenteditable=true]:focus').length) {
                    e.preventDefault();
                    closestli(true);
                }
                break;
        }
    })


    $('.change-page-first').click(function () {
        loadPage(0);
    })

    $('.change-page-prev').click(function () {
        loadPage(+pathStorage('page') - 1);
    })

    $('.scroll-top').click(function () {
        $('html').scrollTop(0);
    })

    $('.change-page-next').click(function () {
        loadPage(+pathStorage('page') + 1);
    })

    $('.change-page-last').click(function () {
        loadPage(Math.ceil(listdir.length / config.pageSize) - 1);
    })

    // dark mode detection
    $('.dark-mode-switch, .theme-radio').change(toggleDarkTheme);
    $('.stickyheader-radio').change(toggleStickyHeader);
    $('.playmode-radio').change(togglePlayMode);
    window.matchMedia("(prefers-color-scheme: dark)").onchange = toggleDarkTheme;

    $('#pagenumber').click(function () {
        let newnumber = prompt('Page number', pathStorage('page') + +config.startIndex);
        if (typeof newnumber == typeof '' && newnumber !== '') loadPage(+newnumber - config.startIndex);
    })


    $('#mediaplayer video').on('timeupdate', audioprogress).on('ended', audioended);

    $('#audioslider').change(function () {
        let duration = $('#mediaplayer video').prop('duration');
        let newTime = duration * $(this).val() / 100;
        $('#mediaplayer video').prop('currentTime', newTime);
    })
    $('#audio-hide-btn').click(function () {
        $('#mediaplayer').addClass('reduced')
    })
    $('#audio-show-btn').click(function () {
        $('#mediaplayer').removeClass('reduced')
    })
    $('#audio-play-btn').click(audioplay)
    $('#audio-stop-btn').click(audiostop)
    $('#audio-next-btn').click(audionext)
    $('#audio-previous-btn').click(audioprevious)


    $('.page-reload-btn').click(loadFolder)
    $('.new-folder').click(newFolder)
    $('.back-button').click(function () {
        history.back();
    })


    $('#slidepages').change(function () {
        loadPage(+$('#slidepages').prop('value'));
    })

    // $('.loadmore').click(loadcards)

    // $('html').scroll(function () {
    //     if ($('.page-content').height() - $('html').scrollTop() - $('html').height() < 200) {
    //         loadcards();
    //     }
    // })

    $('.internallink').click(internallink);

    $('body').each(function () {
        function dragstart(e) {
            e.preventDefault();
            $('body').addClass('acceptsDrag');
        }

        this.ondragleave = function (e) {
            e.preventDefault();
        }

        this.ondragend = function () { setTimeout(internallink, 100) };
        this.ondragenter = dragstart;

        this.ondragover = dragstart
        this.ondragstart = drag
        this.ondrop = drop;

    })



    // https://www.geeksforgeeks.org/how-to-submit-a-form-using-ajax-in-jquery/
    $("#file-modify-form").submit(function (e) {
        e.preventDefault();
        let form = $(this);
        let url = form.attr('action');
        // console.log(url)
        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            success: function (data) {
                loadFolder()
                // console.log(data)
                showSnackbar(data)
            },
            error: function (data) {
                loadFolder()
                showSnackbar(data)
            }
        });
    });


    $('.show-upload').click(function () {
        $('#file-upload-name').click();
    })

    $('#file-upload-name').on('change', function (e) {
        $("#file-upload-form").submit();

    });

    $('*[id][draggable=true]').each(function () {
        this.ondragstart = function (e) {
            //            e.dataTransfer.setData("datalink", e.target.dataset.link);
            e.dataTransfer.setData("text", e.target.id);
        }
        this.ondrop = function (e) {
            console.log(e)
        }
    })


    window.onpopstate = internallink;
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params['info']) {
        showSnackbar(params['info']);
    }


    loadFolder()
}










function loadFolder() {

    if ($('body').hasClass('settings-page') && location.pathname != '/gregornet/') {
        applySettingsPage();
    }

    $('.error-5xx , .error-disconnected').hide();
    // listeners();



    $('.dark-mode-switch').prop('checked', localStorage['darkTheme'] !== 'no');
    toggleDarkTheme();

    // $('#splitpages').prop('checked', pathStorage('splitpages') !== 'no');
    // pathStorage('splitpages', 'yes')



    // while(location.pathname.includes('//')) history.replaceState({},'',location.pathname)

    if (location.pathname == '/gregornet/') {
        $('.settings-tabs>.mdl-tabs__tab-bar, .back-button').show()
        // $('.toolbar').hide()
        if (!$('body').hasClass('settings-page')) {
            $('.settings-tabs>.mdl-tabs__panel, .settings-tabs>.mdl-tabs__tab-bar>.mdl-tabs__tab').removeClass('is-active');
            $('.settings-tabs .settings-local').addClass('is-active');
        } else {
        }


        // $('.settings-general input,.settings-general textarea').on('change', applySettingsPage);

        $('body').addClass('settings-page')
    } else {
        $('.settings-tabs>.mdl-tabs__tab-bar, .back-button').hide()
        $('.settings-tabs>.mdl-tabs__panel, .settings-tabs>.mdl-tabs__tab-bar>.mdl-tabs__tab').removeClass('is-active')
        $('.settings-tabs .settings-about').addClass('is-active')
        // $('.toolbar').show()

        $('body').removeClass('settings-page')
    }

    if (config.serverName) {

        let pathtree = location.pathname.split('/');
        pathtree = pathtree.filter((n) => n.length > 0);
        let title = pathtree.length > 0 ? decodeURIComponent(pathtree[pathtree.length - 1]) : config.serverName;
        document.title = pathtree.length > 0 ? title + ' - ' + config.serverName : title;
        $('.title').text(title);

        $('.pathtree').html('');
        for (let i = -1; i < pathtree.length; i++) {
            let elem = $('<a class="mdl-chip internallink" draggable="false">').append($('<span class="mdl-chip__text">').text(i < 0 ? config.serverName : decodeURIComponent(pathtree[i]))).attr('href', i == -1 ? '/.' : '/' + pathtree.slice(0, i + 1).join('/')).click(internallink)
            $('.pathtree').append(elem, '<span> &nbsp;</span>');

        }
    }
    if (pathStorage('reverse') == 'yes') {
        $('#sort-normal').addClass('reverse');
    } else {
        $('#sort-normal').removeClass('reverse');
    }

    $.get('/gregornet/listdir.py?path=' + encodeURIComponent(location.pathname), function (data, status) {
        if (status == 'success') {
            if (data.config) config = data.config;
            if (data.listdir) listdir = data.listdir; else listdir = [];
            if (data.pathConfig) pathConfig = data.pathConfig;

            $('.pathtree').html('');
            $('.loadspinner').hide();
            let pathtree = location.pathname.split('/');
            pathtree = pathtree.filter((n) => n.length > 0);
            let title = pathtree.length > 0 ? decodeURIComponent(pathtree[pathtree.length - 1]) : config.serverName
            for (let i = -1; i < pathtree.length; i++) {
                let link = i == -1 ? '/.' : '/' + pathtree.slice(0, i + 1).join('/')
                let elem = $('<a class="mdl-chip internallink" draggable="false">').append($('<span class="mdl-chip__text">').text(i < 0 ? config.serverName : decodeURIComponent(pathtree[i]))).attr({ 'href': link, 'data-drop': link }).click(internallink)
                if (i == pathtree.length - 1) elem.addClass('chip-colored');
                $('.pathtree').append(elem, '<span> &nbsp;</span>');
            }

            $('.lore').remove();
            if (data.lores) {
                let loreelem = $('.here-goes-lore')

                for (let i = 0; i < data.lores.length; i++) {
                    loreelem = $('<article class="lore full-width markdown">').html(data.lores[i]).insertAfter(loreelem);

                }
            }

            // $('body').addClass()
            document.title = pathtree.length > 0 ? title + ' - ' + config.serverName : title;
            $('.title').text(title);

            $('#file-upload-path').val(location.pathname)

            if (location.pathname != '/gregornet/') {
                $('body').removeClass(folderColorList)
                let folderColorClass = 'folder-color-' + pathConfig['color']
                if (folderColorList.includes(folderColorClass)) {
                    $('body').addClass(folderColorClass);
                    $('meta[name=theme-color]').attr('content', '#' + themeColors[pathConfig['color']]);
                } else {
                    $('meta[name=theme-color]').attr('content', '');
                }
            }


            fillSettingsPage();

            // if(config.darkTheme)$('body').addClass('dark'); else $('body').removeClass('dark');

            setTimeout(sort, 1);
        } else {

        }
    }).fail(function (data, status, error) {
        $('.loadspinner').hide();
        if (error) {
            console.log(error)
            $('.error-5xx').show();
        } else {
            $('.error-disconnected').show();
        }
    });

    changemode();
    toggleDarkTheme();
    toggleStickyHeader();
    togglePlayMode();
    window.onstorage = function (e) {
        if (e.key == 'mode') changemode();
    }
}
function internallink(e) {

    e && e.preventDefault();
    $('body').removeClass('acceptsDrag');
    clearTimeout(loadingcard)
    $('.item *').each(function () { componentHandler.downgradeElements(this) })
    $('.item, .itemph, .pagechip, .info, .lore').remove();
    $('#filter').val('')
    $('.loadspinner').show();
    if ($(this).attr('href')) {
        let newLocation = (($(this).attr('href')) + '/').replace('/./', '/');
        if (decodeURIComponent(location.pathname) != newLocation)
            history.pushState({}, '', newLocation);
    }
    setTimeout(loadFolder, 10)
    // loadFolder();

}
function drag(e) {
    console.log(e)
    e.dataTransfer.setData("gregornet", 'gregornet');
    e.dataTransfer.setData("path", decodeURIComponent(e.target.dataset.path));
    e.dataTransfer.setData("name", decodeURIComponent(e.target.dataset.name));
}

function drop(e) {

    e.preventDefault();
    // let data = '' + e.dataTransfer.getData("text");
    // if (e.target.id + '' != data) e.target.appendChild(document.getElementById(data));
    let targetPath = location.pathname;
    let targetPatents = $(e.target).parents()
    for (let i = 0; i < targetPatents.length; i++) {
        let ii = targetPatents.eq(i);
        if (ii.attr('data-drop')) {
            targetPath = ii.attr('data-drop') + '/';
            break;
        }
    }
    if (e.dataTransfer.files.length) {
        let files = e.dataTransfer.files;
        $('#file-upload-name').prop('files', files);
        $('#file-upload-form').trigger('submit');
    }
    if (e.dataTransfer.getData("gregornet")) {
        let oldpath = e.dataTransfer.getData("path").toString();
        let newpath = targetPath + e.dataTransfer.getData("name").toString();

        if (oldpath == newpath) return;
        preventScroll = $('html').scrollTop();

        $('#file-modify-action').val('move');
        $('#file-modify-path').val(oldpath);
        $('#file-modify-new-path').val(newpath);
        $('#file-modify-return-path').val(location.pathname);
        $('#file-modify-form').trigger('submit');

    }
    // console.log(e.dataTransfer);
    console.log(e);
}

function newFolder() {

    let newFolderName = prompt('New folder name', '')
    if (newFolderName) {

        preventScroll = $('html').scrollTop();

        $('#file-modify-action').val('newFolder')
        $('#file-modify-new-path').val(location.pathname + newFolderName)
        $('#file-modify-return-path').val(location.pathname)
        $('#file-modify-form').trigger('submit');
    }
}

function showSnackbar(message) {
    let notification = document.querySelector('.mdl-js-snackbar');
    notification.MaterialSnackbar.showSnackbar({
        message: message
    });
}

function pathStorage(key, value) {
    let storage;
    try {
        storage = JSON.parse(localStorage['pathStorage']);
    } catch (e) {
        storage = ({})
        localStorage['pathStorage'] = '{}'
        console.log('storage unreadable')
    }
    let pathtree = location.pathname.split('/');
    pathtree[0] = '/'
    if (value == undefined) {

        for (let i = 0; i < pathtree.length - 1; i++) {
            if (pathtree[i].length == 0) continue;
            let path = '/' + pathtree[i];
            if (storage[path] !== undefined)
                storage = storage[path];
            if (storage[key] !== undefined)
                value = storage[key];
        }
        return value;
    }
    else {
        var placeToSave = storage;
        for (let i = 0; i < pathtree.length - 1; i++) {
            if (pathtree[i].length == 0) continue;
            let path = '/' + pathtree[i];
            if (placeToSave[path] == undefined)
                placeToSave[path] = {};

            placeToSave = placeToSave[path];
        }
        placeToSave[key] = value;
        localStorage['pathStorage'] = JSON.stringify(storage);
        return value;
    }

    if (value !== undefined) {
        localStorage[key + '@' + location.pathname] = value;
    }
    return localStorage[key + '@' + location.pathname];
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
    $('#modechanger-menu-button>i').text('view_' + (mode == 'default' ? 'module' : mode))
    $('.modechanger-menu li').removeClass('bold').filter('.m-' + mode).addClass('bold')

    if (mode == 'stream') {
        $('.previewing').removeClass('previewing')
        $('.stream-holder').each(function () {
            this.style.gridRow = '';
        })
    } else calculateGridRow();

    lazyLoadNextImage();
    lazyLoadNextThumbnail();
    // item = item ? item : $('.item');
    // item.each(function () {

    //     $(this).removeClass('blackitem mdl-list__item hidden mdl-cell--3-col mdl-cell--6-col full-width mdl-cell--4-col-tablet mdl-cell--8-col-tablet mdl-cell--2-col-phone mdl-cell--4-col-phone');

    //     switch (mode) {
    //         case 'default':
    //             // $(this).addClass('mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--2-col-phone');
    //             break;
    //         case 'list':
    //             // $(this).addClass('mdl-cell--6-col mdl-cell--8-col-tablet mdl-cell--4-col-phone');
    //             // $(this).addClass('mdl-list__item mdl-cell--6-col mdl-cell--4-col-tablet mdl-cell--4-col-phone');
    //             break;
    //         case 'stream':
    //             switch ($(this).find('.dirtitle').attr('data-type')) {
    //                 case 'folder':
    //                 case 'movie':
    //                 case 'music_note':
    //                     // $(this).addClass('blackitem mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--2-col-phone');
    //                     $(this).addClass('mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--2-col-phone');
    //                     break;
    //                 case 'image':
    //                     $(this).addClass('full-width mdl-cell--8-col-tablet mdl-cell--4-col-phone');
    //                     break;
    //                 default:
    //                     $(this).addClass('hidden')
    //             }
    //             break;
    //     }
    // })
}

// function splitpages() {
//     split = pathStorage('splitpages', $('#splitpages').prop('checked') ? 'yes' : 'no') == 'yes';
//     if (split) {
//         // $('.pagesbuttons').show();
//         $('#splitpages').parent().addClass('is-checked');
//     } else {
//         // $('.pagesbuttons').hide();
//         $('#splitpages').parent().removeClass('is-checked');
//     }


//     loadPage()
// }

function toggleDarkTheme() {
    let currentMode = $('.theme-radio:checked').val()
    if (!currentMode) {
        {
            // If none of the radios is selected, take information from localStorage.
            // If information in localStorage not present, assume default.
            if (!localStorage['darkTheme']) localStorage['darkTheme'] = 'default'
            currentMode = localStorage['darkTheme'];

        }
    }
    localStorage['darkTheme'] = currentMode;

    switch (currentMode) {
        case 'black':
            $(':root').css('color-scheme', 'dark');
            $('#theme-black-radio').prop('checked', true).parent().addClass('is-checked');
            break
        case 'dark':
            $(':root').css('color-scheme', 'dark');
            $('#theme-dark-radio').prop('checked', true).parent().addClass('is-checked');
            break
        case 'light':
            $(':root').css('color-scheme', 'light');
            $('#theme-light-radio').prop('checked', true).parent().addClass('is-checked');
            break
        default:
            $(':root').css('color-scheme', '');
            $('#theme-default-radio').prop('checked', true).parent().addClass('is-checked');
            break
    }

    if (currentMode == 'black') {
        $('body').addClass('black dark night');
    } else
        if (currentMode == 'dark' || currentMode != 'light' && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            $('body').addClass('dark night').removeClass('black');
            $('.dark-mode-switch').parent().addClass('is-checked');
        } else {
            $('body').removeClass('black dark night');
            $('.dark-mode-switch').parent().removeClass('is-checked');
        }

}
function toggleStickyHeader() {
    let currentMode = $('.stickyheader-radio:checked').val()
    if (!currentMode) {
        {
            // If none of the radios is selected, take information from localStorage.
            // If information in localStorage not present, assume default.
            if (!localStorage['stickyHeader']) localStorage['stickyHeader'] = 'default'
            currentMode = localStorage['stickyHeader'];

        }
    }
    localStorage['stickyHeader'] = currentMode;

    switch (currentMode) {
        case 'sometimes':
            $('#stickyheader-sometimes-radio').prop('checked', true).parent().addClass('is-checked');
            break
        case 'never':
            $('#stickyheader-never-radio').prop('checked', true).parent().addClass('is-checked');
            break
        default:
            $('#stickyheader-default-radio').prop('checked', true).parent().addClass('is-checked');
            break
    }
    if (currentMode == 'default') {
        $('body').addClass('stickyheader-default').removeClass('stickyheader-sometimes');
    } else if (currentMode == 'sometimes') {
        $('body').addClass('stickyheader-sometimes').removeClass('stickyheader-default');
    } else {
        $('body').removeClass('stickyheader-default stickyheader-sometimes');
    }


}

function togglePlayMode() {
    let currentMode = $('.playmode-radio:checked').val()
    if (!currentMode) {
        {
            // If none of the radios is selected, take information from localStorage.
            // If information in localStorage not present, assume default.
            if (!localStorage['playmode']) localStorage['playmode'] = 'default'
            currentMode = localStorage['playmode'];

        }
    }

    localStorage['playmode'] = currentMode;

    switch (currentMode) {
        case 'loop':
            $('#playmode-loop-radio').prop('checked', true).parent().addClass('is-checked');
            break
        case 'single':
            $('#playmode-single-radio').prop('checked', true).parent().addClass('is-checked');
            break
        case 'loopsingle':
            $('#playmode-loopsingle-radio').prop('checked', true).parent().addClass('is-checked');
            break
        default:
            $('#playmode-default-radio').prop('checked', true).parent().addClass('is-checked');
    }
}

function sort(mode, reverse) {
    if (mode) {
        pathStorage('sort', mode);
    } else if (pathStorage('sort')) {
        mode = pathStorage('sort');
    } else {
        mode = pathStorage('sort', 'name');
    }
    if (reverse) {
        pathStorage('reverse', reverse);
    } else if (pathStorage('reverse')) {
        reverse = pathStorage('reverse');
    } else {
        reverse = pathStorage('reverse') = 'no';
    }

    if (pathStorage('reverse') == 'yes') {
        $('#sort-normal').addClass('reverse');
    } else {
        $('#sort-normal').removeClass('reverse');
    }
    // $('#sort-things1').text('Sort by ' + $('.sortoption[data-sort=' + mode + ']').attr('title'));

    listdir.sort(function (a, b) {
        let c = reverse == 'yes' ? b : a;
        let d = reverse == 'yes' ? a : b;
        if (c.isdir != d.isdir) return d.isdir - c.isdir;
        switch (mode) {
            case 'modified':
                return d.modified - c.modified;
            case 'random':
                return c.random.localeCompare(d.random);
            case 'size':
                return c.size - d.size;
            case 'type':
                let ctype = c.type + '.' + c.name;
                let dtype = d.type + '.' + d.name;
                return ctype.localeCompare(dtype, undefined, { numeric: true, sensitivity: 'base' });
            case 'name':
            default:
                return c.name.localeCompare(d.name, undefined, { numeric: true, sensitivity: 'base' });

        }
    });

    loadPage();

}




function filter(item) { }


function stylize(item) { }

function scrollpagechips() {
    let pagechips = $('.pagechips');
    let pagechip = pagechips.find('.pagechip.spnc');
    if (pagechips.length > 0 && pagechip.length > 0)
        pagechips.animate({
            scrollLeft: pagechip.position().left + pagechips.scrollLeft() + (pagechip.outerWidth() - pagechips.outerWidth()) / 2
        }, 1000)
}

function closestli(reverse) {
    let proximity = reverse ? -Infinity : Infinity;
    let closest;
    if ($('.stream-loading').length == 0 && !reverse && $('html').scrollTop() > $('.mdl-layout').height() - $('html').height() - 10) {
        if (+pathStorage('page') == Math.ceil(listdir.length / config.pageSize) - 1) {
            showSnackbar('end of folder')
        } else {
            loadPage(+pathStorage('page') + 1)
        }
    }

    $('.mdl-card, .stream-image').each(function () {
        let thisdis = $(this).offset().top - $('html').scrollTop();// + (reverse ? $(this).height() : 0);
        let condition = reverse ? (-100 > thisdis && thisdis > proximity) : (100 < thisdis && thisdis < proximity);
        if (condition) {
            proximity = thisdis;
            closest = $(this);
        }

    })
    if (closest) {
        let headerOffset = 64 * $('body.stickyheader-default, body.stickyheader-sometimes.mode-default, body.stickyheader-sometimes.mode-list').length
        $('html').scrollTop(closest.offset().top - headerOffset)
    } else if (reverse) {
        $('html').scrollTop(0)
    } else {
        $('html').scrollTop($('.mdl-layout').height() - $('html').height())

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

function fillSettingsPage() {
    for (let i in config) {
        let val = config[i];
        let field = $('#config-' + i);
        if (Array.isArray(val) && field.filter('textarea').length) {
            field.val(val.join('\n')).attr('rows', val.length + 1);
            if (val.length) field.parent().addClass('is-dirty')
            else field.parent().removeClass('is-dirty')
        } else if (typeof val == typeof true && field.attr('type') == 'checkbox') {
            field.prop('checked', val);
            if (val) field.parent().addClass('is-checked');
            else field.parent().removeClass('is-checked');
        } else if (typeof val == typeof 1 && field.attr('type') == 'number') {
            field.val(val);
            field.parent().addClass('is-dirty')
        } else {
            val = val.toString();
            field.val(val);
            if (val.length) field.parent().addClass('is-dirty')
            else field.parent().removeClass('is-dirty')
        }
    }
}

function applySettingsPage() {

    for (let i in config) {
        let val = config[i];
        let field = $('#config-' + i);
        if (field.filter('textarea').length) {
            config[i] = field.val().split('\n').filter(function (entry) { return entry.trim() != ''; });
        } else if (field.attr('type') == 'checkbox') {
            config[i] = field.prop('checked');
        } else if (field.attr('type') == 'number') {
            config[i] = +field.val();
            field.parent().addClass('is-dirty')
        } else {
            config[i] = field.val().toString();
        }
    }

    $('#file-modify-action').val('saveConfig')
    $('#file-modify-val').val(JSON.stringify(config))

    $('#file-modify-return-path').val(location.pathname)
    $('#file-modify-form').trigger('submit');
}

window.addEventListener('load', init);
