
function audioplay(e) {
    $('#globalaudio').removeClass('hidden')
    let audio = $('#globalaudio audio');
    let button = $('#audio-play-btn');
    let selected = false;
    if (e instanceof jQuery && e.hasClass('card-audio')) {
        selected = e;
    } else if (audio.attr('data-np') == '0') {
        selected = $('.card-audio').first();
    }
    if (selected) {
        audio.prop('src', selected.find('a').attr('href')).attr('data-np', selected.attr('data-np'));
        $('#audio-title').text(selected.find('.filetitle').text());
        $('.play-button').removeClass('dance').find('i').text('play_arrow');
        selected.find('.play-button').addClass('dance').find('i').text('music_note');
    }

    if (audio.prop('paused')) {
        audio.trigger('play');
        button.children('.material-icons').text('pause');
    } else {
        audio.trigger('pause');
        button.children('.material-icons').text('play_arrow');
    }
}
function audiostop() {
    let audio = $('#globalaudio audio');
    audio.trigger('pause').prop('currentTime', 0).attr('data-np', '0');
    $('#audio-play-btn').children('.material-icons').text('play_arrow');
    $('#audio-output').text('--:--');
    $('#audio-title').text('Stopped');
    $('.play-button').removeClass('dance').find('i').text('play_arrow');
}
function audionext() {
    let audio = $('#globalaudio audio');
    let thiscard = $('.card-audio[data-np=' + audio.attr('data-np') + ']')
    audiostop();
    if (thiscard.length == 0) {
        audioplay();
    } else {
        let nextcard = thiscard.parent().nextAll().find('.card-audio').first();
        if (nextcard.length > 0) {
            audioplay(nextcard);
        }
    }
}