function loadPage(n) {
    //for (let i = 0; i < filteredListdir.length; i++) {
    $('.item, .itemph, .pagechip').remove();
    let filteredListdir = listdirFilter(listdir);
    let start = 0;
    let end = filteredListdir.length;
    let pageSize = config.pageSize > 0 ? config.pageSize : Infinity;
    let pagescount = Math.ceil(filteredListdir.length / pageSize);
    // if (pathStorage('splitpages') == 'yes' && pagescount > 1) {
    if (pagescount > 1) {

        if (typeof (n) == 'number') {
            n = Math.floor(Math.min(Math.max(n, 0), pagescount - 1));
            pathStorage('page', n)
        } else if (pathStorage('page')) {
            n = Math.min(Math.max(+pathStorage('page'), 0), pagescount - 1);
        } else {
            n = +pathStorage('page', 0);
        }

        $('.pagesbuttons').show();


        for (let i = 0; i < pagescount; i++) {
            $('.pagechips').append('<span class="mdl-chip pagechip' + (i == n ? ' spnc chip-colored' : '') + '"> <b class="mdl-chip__text">' + (i + +config.startIndex) + '</b></span> ');
        }
        $('.pagechip').click(function () {
            loadPage(+$(this).text() - config.startIndex)
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

        start = pageSize * n;
        end = Math.min(pageSize * (n + 1), filteredListdir.length);
    } else {
        $('.lore .page-end').show();
        $('.pagesbuttons').hide();
    }
    if (filteredListdir.length > 0) {
        $('.emptyfolder').hide();
    } else {
        $('.emptyfolder').show();
    }

    $('#pagenumber').text(n + +config.startIndex);
    $('.item, .itemph').remove();
    for (let i = start; i < end; i++) {

        let card = filecard(filteredListdir[i]);
        card.insertBefore($('.afterbase').last());

        preparecard(card);

        // $('<li class="mdl-cell mdl-cell--stretch mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--2-col-phone itemph" ></li>').text(filteredListdir[i].name).insertBefore($('.afterbase').last());
        // preparecard(filecard(filteredListdir[i]).insertBefore($('.afterbase').last()))
    }
    // loadcards();

    componentHandler.upgradeDom();
    scrollpagechips();
    lazyLoadNextImage();
    lazyLoadNextThumbnail();
    findAndMarkNowPlaying();
    $('html').animate({
        scrollTop: 0
    }, 100)
}
function listdirFilter(listdir) {

    // let query = $('#filter').val().toLowerCase().split(' ');
    return listdir
    // return listdir.filter(function (a) {
    //     let fail = false;
    //     for (let i = 0; i < query.length; i++) {
    //         //if ($(this).find('.dirtitle').text().toLowerCase().includes(query[i])) {
    //         if (a.name.toLowerCase().includes(query[i])) {
    //             //is good
    //         } else {
    //             fail = true;
    //             break;
    //         }
    //     }

    //     return !fail;

    // })
}


// function loadcards() {
//     clearTimeout(loadingcard);
//     for (let i = 0; i < config.pageSize; i++) {

//         if ($('.itemph:visible').length > 0) {
//             let item = $('.itemph:visible').first();
//             // if (item.position().top > 2000) break;
//             let itemname = item.text()
//             let card = filecard(listdir.filter((n) => n.name == itemname)[0]);;
//             item = item.replaceWith(card);
//             // console.log(item);
//             preparecard(card)
//         }



//     }
//     // loadingcard = setTimeout(loadcards, 1000);

//     // if (!loadingcard) {
//     //     loadingcard = true;
//     //     for (let i = 0; i < 8; i++) { loadcard(); }
//     // }
// }
// function loadcard() {
//     if ($('.itemph:visible').length > 0) {
//         let item = $('.itemph:visible').first().removeClass('itemph');
//         // item.hide();
//         let itemname = item.text();
//         if (cache[itemname]) {
//             item.html(cache[item.text()]);
//             preparecard(item);
//             loadcard();
//         } else {
//             let qs = '?i=' + encodeURIComponent(itemname) + '&path=' + encodeURIComponent(location.pathname);
//             item.load('/gregornet/filecard.py' + qs, function (data, status) {
//                 if (data.includes('<!-- Pa;p;ermache Card -->')) {
//                     // cache[itemname] = data;
//                     failcount = 0;
//                     preparecard(item);
//                     loadcard();
//                     // if ($('.item').length % config.pageSize != 0) {
//                     //     loadcard();
//                     // } else {
//                     //     loadingcard = false;
//                     //     $('.loadmore').show();
//                     // }
//                 } else {
//                     failcount++;
//                     item.addClass('itemph')
//                     if (failcount > 3) {
//                         loadingcard = false;
//                         $('.loadmore').show();
//                         loadfailed();
//                     } else {
//                         loadcard();
//                     }
//                 }
//             })
//         }
//     } else {
//         loadingcard = false;
//         $('.loadmore').hide();

//     }
// }

// function loadfailed() {
//     let notification = document.querySelector('.mdl-js-snackbar');
//     let data = {
//         message: 'Load of an element failed',
//         actionHandler: loadcards,
//         actionText: 'Retry',
//         timeout: 10000
//     };
//     notification.MaterialSnackbar.showSnackbar(data);
// }




function filecard(file) {
    let link = encodeURIComponent(file.name)
    let path = encodeURIComponent(location.pathname);

    let item = $('<i class="mdl-cell mdl-cell--stretch item" >')

    let card = $('<div draggable="true">');

    let cardTitleText = $('<div class="filetitletext">').text(file.name)
    let cardTitle = $('<a class="mdl-card__title filetitle" draggable="false">').attr('href', link).append(cardTitleText);
    if (config.showSymlinkIcons && file.islink)
        cardTitle.append('<i class="material-icons" title="Link">call_made</i>');


    if (file.isdir) {


        cardTitle.addClass('internallink')

        let countdiv = $('<a draggable="false" class="mdl-card__supporting-text mdl-card--expand internallink">').attr('href', link).text(file.naturalsize)

        let thumbdiv = $('<a draggable="false" class="dirthumbs mdl-card__media internallink">').attr('href', link)
        for (let j = 0; j < file.thumbs.length; j++) {
            // $('<div class="dirthumb">').appendTo(thumbdiv)
            // $('<div class="dirthumb">').css('background', 'url("/gregornet/thumbnail.py?file=' + encodeURIComponent(file.thumbs[j]) + '")  no-repeat top / cover').appendTo(thumbdiv)
            $('<div class="dirthumb thumb-notloaded">').attr('data-thumb', encodeURIComponent(file.thumbs[j])).appendTo(thumbdiv)
        }


        card.attr({
            'data-link': path + link
        })
        item.attr('data-drop', path + link);
        card.addClass('mdl-card mdl-shadow--2dp mk m-default m-stream card-dir').append(countdiv, thumbdiv)
        if (file.color) item.addClass('folder-color-' + file.color)
        // if (file.color) card.addClass('colored mdl-color--' + file.color + '-200')








    } else {
        let lore = $('<div class="mdl-card__supporting-text  mdl-card--expand">');
        if (file.tags) {
            if (file.tags.artist) $('<div class="supporting-text-bold">').text(file.tags.artist).appendTo(lore)
            if (file.tags.title) $('<div class="supporting-text-bolder">').text(file.tags.title).appendTo(lore)
            if (file.tags.album) $('<div>').text(file.tags.album).appendTo(lore)
        }
        $('<div>').text(file.naturalsize).appendTo(lore);
        let actions = [];

        if (config.images.includes(file.type)) {
            let streamholder = $('<figure class="m m-stream stream-holder stream-notloaded">')

            // $('<img src="/gregornet/baseline_photo_white_18dp.png" class="stream-image stream-image-notloaded" loading="lazy">').attr({ src: '/gregornet/thumbnail.py?file='+path+link, 'id': file.random, 'alt': file.name }).appendTo(streamholder);
            $('<img src="" class="stream-image stream-image-notloaded" >')
            .attr({ 'data-thumb-src': '/gregornet/thumbnail.py?file=' + path + encodeURIComponent(link), 'id': file.random, 'alt': file.name })
            .on('click',function(){$(this).toggleClass('zoomed')})
            .appendTo(streamholder);


            $('<a class="stream-caption">').attr('href', link).text(file.name + ' | ').append($('<output>').text('Thumbnail loading...').attr('id', 'size-' + file.random)).appendTo(streamholder);
            item.append(streamholder);

            $('<figcaption>').html(file.lore).appendTo(streamholder);

            lore = $('<a draggable="false" class="mdl-card__supporting-text mdl-card--expand filepreview">').attr('href', link)

            card.addClass('card-image thumbnail thumb-notloaded').attr('data-thumb',encodeURIComponent(location.pathname + item.find('a').attr('href')))
            item.addClass('stream-holder-item')

            cardTitle.addClass('filepreview')
            // card.attr('data-thumb','url(\'/gregornet/thumbnail.py?file='+path + link+'\') no-repeat top / cover')
        }
        if (config.html.includes(file.type)) {
            lore = $('<div class=" mdl-card--expand">')
            lore.append('<div class="iframe-holder">').children().append('<iframe sandbox>').children().attr('src', link)
            card.addClass('card-html')
        }
        if ((config.audio.includes(file.type) && config.readAudioCovers) || config.video.includes(file.type)) {
            lore = $('<a draggable="false" class="mdl-card__supporting-text mdl-card--expand">').attr('href', link)

            card.addClass('card-video thumbnail')
        }
        if (config.audio.includes(file.type) || config.video.includes(file.type)) {
            actions.push($('<button class="mdl-button mdl-button--icon mdl-js-button play-button" title="Play">').attr({
                'data-np': file.random,
                'data-href': link
            }).append('<i class="material-icons">play_arrow</i>'))
            actions.push($('<a class="mdl-button mdl-button--icon mdl-js-button download-button" title="Download" download>').attr('href', link).append('<i class="material-icons">get_app</i>'))

            // gaytag
            actions.push($('<a class="mdl-button mdl-button--icon mdl-js-button download-button" title="Edit tags" target="_blank" >').attr('href', '/Pisane/gaytag/tageditor.html?' + path + link).append('<i class="material-icons">code</i>'))

            card.addClass('card-audio m-stream')
        }

        if (lore) card.append(lore);

        let cardActions = $('<div class="mdl-card__actions  mdl-card--border cardactions">');
        if (actions) cardActions.append(actions);
        cardActions.append('<div class="mdl-layout-spacer">');
        $('<button class="mdl-button mdl-button--icon mdl-js-button" title="Options">').attr('id', 'menu-' + file.random).append('<i class="material-icons">more_vert</i>').appendTo(cardActions);
        cardActions.appendTo(card);

        let cardMenu = $('<div class="mdl-menu mdl-menu--top-right mdl-js-menu mdl-js-ripple-effect">').attr('for', 'menu-' + file.random)
        $('<div class="mdl-menu__item filepreview" >').text('Preview').appendTo(cardMenu);
        $('<a class="mdl-menu__item" download>').text('Download').attr({
            'href': link
        }).appendTo(cardMenu);
        $('<div class="mdl-menu__item filerenamer">').text('Rename').attr({
            'data-dir': path,
            'data-path': path + link
        }).appendTo(cardMenu);
        $('<div class="mdl-menu__item fileremover">').text('Delete').attr({
            'data-name': file.name,
            'data-link': 'path=' + path + '&filename=' + link,
            'data-path': path + link
        }).appendTo(cardMenu);
        cardMenu.appendTo(item);



        card.addClass('mdl-card mdl-shadow--2dp m m-default m-list')

    }
    card.attr({
        'data-name': file.name,
        'data-path': path + link,
        'href': link
    })

    let icon = 'insert_drive_file';
    let icontype = 'File'
    if (file.isdir) {
        icon = 'folder';
        icontype = 'Folder';
    } else if (config.images.includes(file.type)) {
        icon = 'image';
        icontype = 'Image';
    } else if (config.audio.includes(file.type)) {
        icon = 'music_note';
        icontype = 'Audio';
    } else if (config.video.includes(file.type)) {
        icon = 'movie';
        icontype = 'Video';
    } else if (config.html.includes(file.type)) {
        icon = 'code';
        icontype = 'HTML file';
    }
    // let listItem = $('<a class="mdl-list__item-primary-content dirtitle internallink m mm-list">').attr({ 'data-type': icon, href: file.name }).text(file.name)
    // $('<i class="material-icons mdl-list__item-icon">').text(icon).prependTo(listItem)

    cardTitle.prepend('<i class="material-icons" title="' + icontype + '">' + icon + '</i>');
    card.prepend(cardTitle)

    item.attr('data-random', file.random);
    item.prepend(card);
    // item.append(listItem)
    return item;
}


function preparecard(item) {
    item.removeClass('itemph').addClass('item');
    item.find('.play-button').click(function (event) {
        event.preventDefault();
        audioplay($(this).parents('.mdl-cell').attr('data-random'));
        // audioplay($(this).parents('.card-audio'));
    });
    // changemode(null, item);
    // componentHandler.upgradeElements(item.find('.mdl-progress'));
    // componentHandler.upgradeElements(item.find('.mdl-menu'));
    item[0].ondragstart = drag;
    item.find('.thumbnail').each(function () {
        // $(this).css('background', $(this).attr('data-thumb'))
        // $(this).css('background-image', 'url("/gregornet/thumbnail.py?file=' + encodeURIComponent(location.pathname + item.find('a').attr('href')) + '")')

    })
    item.find('.fileremover').each(function () {
        $(this).click(function () {
            if (confirm('Delete file ' + $(this).attr('data-name') + '?')) {
                $('#file-modify-action').val('delete');
                $('#file-modify-path').val(decodeURIComponent($(this).attr('data-path')));
                $('#file-modify-return-path').val(location.pathname);

                $('#file-modify-form').trigger('submit');

                // location = '/gregornet/delete.py?' + $(this).attr('data-link')
            }
        })
    })
    item.find('.filerenamer').each(function () {
        $(this).click(function () {
            let oldfiletitle = $(this).parents().filter('.mdl-cell').find('.filetitle');
            let filetitle = $('<div class="mdl-card__title filetitle renaming">').append(oldfiletitle.contents())
            //.addClass('renaming');
            oldfiletitle.replaceWith(filetitle);

            filetitle.parent().prop('draggable', false);
            // filetitle.css('pointer-events', 'none')
            // filetitle.css('color', 'red')
            // filetitle.click(function(e){
            //     e.preventDefault();
            //     return 21==37;
            // })
            let filetitletext = filetitle.find('.filetitletext');
            filetitletext.attr('data-oldname', filetitletext.text()).prop('contenteditable', true).focus()
                .on('blur', function () {
                    finishRenaming($(this));

                }).on('keydown', function (e) {
                    if (e.key == 'Escape') {
                        finishRenaming($(this), true);
                    } else if (e.key == 'Enter') {
                        $(this).blur();
                        finishRenaming($(this), false);
                    }
                })

            //https://stackoverflow.com/questions/6139107/programmatically-select-text-in-a-contenteditable-html-element
            let range = document.createRange();
            range.selectNodeContents(filetitle.find('.filetitletext')[0]);
            let sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);


        })
    })


    item.find('.filepreview').each(function () {
        $(this).click(filePreview);
    })


    item.find('a.internallink').click(internallink);

}

function filePreview(e) {
    e && e.preventDefault();

    if($(this).parents().filter('.item.previewing').length){

        $('.previewing').removeClass('previewing');
        return;
    }
    $('.previewing').removeClass('previewing');
    let item =  $(this).parents().filter('.item')
    // determine row to put element in
    let count = 1;
    let previtems = item.prevAll().each(function(){
        if($(this).css('display')=='none') return;
        if($(this).hasClass('item')){
            count+=1;
        }else{
            count+=4;
        }
    });
    console.log(Math.ceil(count/4))
    item.children('.stream-holder')[0].style.gridRow=Math.ceil(count/4)+1;


    item.addClass('previewing');
    lazyLoadNextImage();
}
function finishRenaming(obj, rejectChanges = false) {
    let filetitle = obj.parent();
    filetitle.css('pointer-events', '').removeClass('renaming');
    filetitle.off('click');
    obj.prop('contenteditable', false);
    window.getSelection().removeAllRanges();

    let result = obj.text();
    let button = obj.parents().filter('.mdl-cell').find('.filerenamer');
    if (rejectChanges || result == '' || result == '.' || result == '..' || result == obj.attr('data-oldname')) {
        obj.text(obj.attr('data-oldname'));
        let oldfiletitle = $('<a class="mdl-card__title filetitle">').attr('href', decodeURIComponent(button.attr('data-path'))).append(filetitle.contents())
        filetitle.replaceWith(oldfiletitle);
    } else {
        console.log(decodeURIComponent(button.attr('data-path')))
        $('#file-modify-action').val('move')
        $('#file-modify-path').val(decodeURIComponent(button.attr('data-path')))
        $('#file-modify-new-path').val(decodeURIComponent(button.attr('data-dir')) + result)
        $('#file-modify-return-path').val(location.pathname)
        $('#file-modify-form').trigger('submit');
    }
}

function lazyLoadNextImage() {
    if($('.stream-loading').length) return;
    // if($('.mode-stream img.stream-image-thumbnailed').length > 6 || !$('.mode-stream img.stream-image-notloaded').length){
    //     $('.mode-stream img.stream-image-thumbnailed').eq(0).each(function () {
    //         $('#size-' + $(this).attr('id')).text('Loading...')
    //         $(this).attr('src', encodeURIComponent( $(this).attr('alt'))).one('load', function () {
    //             $(this).removeClass('stream-image-thumbnailed').addClass('stream-image-loaded')
    //             $('#size-' + $(this).attr('id')).text(this.naturalWidth + 'x' + this.naturalHeight)
    //             lazyLoadNextImage();
    //         })
    //     })
    // }else if($('.mode-stream img.stream-image-notloaded').length){
    // $('.mode-stream img.stream-image-notloaded').eq(0).each(function () {
    //     $('#size-' + $(this).attr('id')).text('Waiting for thumbnail...')
    //     $(this).attr('src',  $(this).attr('data-thumb-src')).one('load', function () {
    //         $(this).removeClass('stream-image-notloaded').addClass('stream-image-thumbnailed')
    //         $('#size-' + $(this).attr('id')).text('Waiting for load...')
    //         lazyLoadNextImage();
    //     })
    // })
    // }
    let selector = $('.mode-stream .stream-notloaded img, .previewing .stream-notloaded img');
    if (selector.length) {
        selector.eq(0).each(function () {
            let thisdis = $(this).offset().top - $('html').scrollTop()
            if(thisdis>$('html').height()*5) return;
            if($(this).attr('src')!="") return;

                $(this).parent().removeClass('stream-notloaded').addClass('stream-loading')
            $('#size-' + $(this).attr('id')).text('Loading...')
            $(this).attr('src', encodeURIComponent($(this).attr('alt'))).one('load', function () {
                // $(this).removeClass('stream-image-notloaded').addClass('stream-image-loaded')
                $(this).parent().removeClass('stream-notloaded stream-loading').addClass('stream-loaded')
                $('#size-' + $(this).attr('id')).text(this.naturalWidth + 'x' + this.naturalHeight)
                lazyLoadNextImage();
            })
        })
    }
}
// lazyLoadNextImage()
function lazyLoadNextThumbnail(){
    if($('.mode-list, .thumb-loading').length) return;
    let selector = $('.thumb-notloaded');
    if (selector.length) {
        selector.each(function () {
            if($(this).css('display')=='none') selector=selector.not(this);
            let thisdis = ($(this).offset().top - $('html').scrollTop())/$('html').height();
            if(0 > thisdis || thisdis > 2) selector=selector.not(this);
        })
    }
    selector.eq(0).each(function(){
        $(this).removeClass('thumb-notloaded').addClass('thumb-loading');
        $('<img class="hidden">').attr('src','/gregornet/thumbnail.py?file='+$(this).attr('data-thumb')).appendTo($(this)).on('load',function(){
            $(this).parent().css('background-image','url("'+ $(this).attr('src') +'")').removeClass('thumb-loading');
            $(this).remove();
            lazyLoadNextThumbnail();
        })
    });

    // console.log(selector.length)
}