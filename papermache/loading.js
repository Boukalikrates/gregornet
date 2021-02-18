function loadcardph(n) {
    //for (let i = 0; i < listdir.length; i++) {
    $('.item, .itemph, .pagechip').remove();
    let start = 0;
    let end = listdir.length;
    let pagescount = Math.ceil(listdir.length / config.pagesize);
    if (pathStorage('splitpages') == 'yes') {

        if (typeof (n) == 'number') {
            n = Math.min(Math.max(n, 0), pagescount - 1)
            pathStorage('page', n)
        } else if (pathStorage('page')) {
            n = +pathStorage('page');
        } else {
            n = +pathStorage('page', 0);
        }
        for (let i = 0; i < pagescount; i++) {
            $('.pagechips').append('<span class="mdl-chip pagechip' + (i == n ? ' spnc mdl-color--indigo mdl-color-text--white' : '') + '"> <b class="mdl-chip__text">' + i + '</b></span> ');
        }
        $('.pagechip').click(function () {
            loadcardph(+$(this).text())
        })
        if (n == 0) {
            $('.lore').show();
        } else {

            $('.lore').hide();
        }

        if (n == pagescount - 1) {
            $('.page-end').show();
        } else {

            $('.page-end').hide();
        }

        start = config.pagesize * n;
        end = Math.min(config.pagesize * (n + 1), listdir.length);
    } else {
        $('.lore .page-end').show();
    }

    $('#pagenumber').text(n);
    $('.item, .itemph').remove();
    for (let i = start; i < end; i++) {
        $('.afterbase').last().before('<li class="mdl-cell mdl-cell--stretch mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--2-col-phone itemph" >' + listdir[i].name + '</li>');
    }
    loadcards();
    scrollpagechips();
}

function loadcards() {
    if (!loadingcard) {
        loadingcard = true;
        for (let i = 0; i < 8; i++) { loadcard(); }
    }
}
function loadcard() {
    if ($('.itemph:visible').length > 0) {
        let item = $('.itemph:visible').first().removeClass('itemph');
        // item.hide();
        let itemname = item.text();
        if (cache[itemname]) {
            item.html(cache[item.text()]);
            preparecard(item);
            loadcard();
        } else {
            let qs = '?i=' + encodeURIComponent(itemname) + '&path=' + encodeURIComponent(serverinfo.path);
            item.load('/papermache/filecard.py' + qs, function (data, status) {
                if (data.includes('<!-- Pa;p;ermache Card -->')) {
                    // cache[itemname] = data;
                    failcount = 0;
                    preparecard(item);
                    loadcard();
                    // if ($('.item').length % config.pagesize != 0) {
                    //     loadcard();
                    // } else {
                    //     loadingcard = false;
                    //     $('.loadmore').show();
                    // }
                } else {
                    failcount++;
                    item.addClass('itemph')
                    if (failcount > 3) {
                        loadingcard = false;
                        $('.loadmore').show();
                        loadfailed();
                    } else {
                        loadcard();
                    }
                }
            })
        }
    } else {
        loadingcard = false;
        $('.loadmore').hide();

    }
}
function preparecard(item) {
    item.removeClass('itemph').addClass('item');
    item.find('.play-button').click(function (event) {
        event.preventDefault();
        audioplay($(this).parents('.card-audio'));
    });
    filter(item);
    changemode(null, item);
    componentHandler.upgradeElements(item.find('.mdl-progress'));
    componentHandler.upgradeElements(item.find('.mdl-menu'));
    item.find('.dirthumb, .card-image').each(function () {
        $(this).css('background', $(this).attr('data-thumb'))

    })
    item.find('.fileremover').each(function () {
        $(this).click(function () {
            if (confirm('Delete file ' + $(this).attr('data-name') + '?')) {
                location = '/papermache/delete.py?' + $(this).attr('data-link')
            }
        })
    })
    item.find('img.stream-image').eq(0).each(function () {
        $(this).attr('src', $(this).attr('alt')).removeClass('stream-image-unloaded').mouseover(function () {
            $('#size-' + $(this).attr('id')).html(this.naturalWidth + 'x' + this.naturalHeight)
        })
    })
}

function loadfailed() {
    let notification = document.querySelector('.mdl-js-snackbar');
    let data = {
        message: 'Load of an element failed',
        actionHandler: loadcards,
        actionText: 'Retry',
        timeout: 10000
    };
    notification.MaterialSnackbar.showSnackbar(data);
}
