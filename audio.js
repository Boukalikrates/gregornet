
function audioplay(e) {
    if ($('#mediaplayer').hasClass('hidden')) {

        $('#mediaplayer').removeClass('hidden reduced');
    }
    let audio = $('#mediaplayer video');
    let button = $('#audio-play-btn');
    let selected = false;
    let entry = false
    if (typeof e == typeof "string") {
        if (!playlist.find(a => a.random == e)) {
            playlist = listdirFilter(listdir).filter(a => config.audio.includes(a.type) || config.video.includes(a.type));
            playlistPath = location.pathname
        }
        entry = playlist.find(a => a.random == e);

    } else if (typeof e == typeof 2137) {

        let playmode = $('.playmode-radio:checked').val()
        if (playmode == 'loop' || playmode == 'loopsingle') {
            e = (e + playlist.length) % playlist.length
        }
        entry = playlist[e];
        if (!entry) {
            audiostop();
            return;
        }

    } else if (e instanceof jQuery && e.hasClass('card-audio')) {
        // deprecated
        // like totally
        // you should not do it this way
        // this code doesn't even work anymore
        // do not try to uncomment this
        // selected = e;
        // entry = playlist.find( a => a.random == e.parent().attr('data-random'))
    } else if (audio.attr('data-np-index') == '-1') {
        entry = playlist[0];
    }


    if (entry) {
        audio.prop('src', playlistPath + encodeURIComponent(entry.name)).attr('data-np', entry.random).attr('data-np-index', playlist.indexOf(entry));
        $('#audio-title').text(entry.tags.title ? (entry.tags.artist ? entry.tags.artist + ' - ' + entry.tags.title : entry.tags.title) : entry.name);
        


        // https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: entry.tags && entry.tags.title ? entry.tags.title : entry.name,
                artist: entry.tags && entry.tags.artist ? entry.tags.artist : decodeURIComponent(location.pathname),
                album: entry.tags && entry.tags.album ? entry.tags.album : "",
                artwork: [
                    { src: '/gregornet/thumbnail.py?big=1&file=' + encodeURIComponent(location.pathname + entry.name) },
                ]
            });

            navigator.mediaSession.setActionHandler('play', audioplay);
            navigator.mediaSession.setActionHandler('pause', audioplay);
            navigator.mediaSession.setActionHandler('stop', audiostop);
            navigator.mediaSession.setActionHandler('previoustrack', audioprevious);
            navigator.mediaSession.setActionHandler('nexttrack', audionext);


        }

        findAndMarkNowPlaying();

    }

    if (audio.prop('paused')) {
        navigator.mediaSession.playbackState = 'playing';
        audio.trigger('play');
        button.attr('title', 'Pause').children('.material-icons').text('pause');
    } else {
        navigator.mediaSession.playbackState = 'paused';
        audio.trigger('pause');
        button.attr('title', 'Play').children('.material-icons').text('play_arrow');
    }
}
function findAndMarkNowPlaying(){

    $('.now-playing').removeClass('now-playing').find('.play-button i').text('play_arrow');

    if($('#mediaplayer video').attr('data-np')){{
        let selected = $('.mdl-cell[data-random=' + $('#mediaplayer video').attr('data-np') + '] .card-audio');
        if (selected) selected.addClass('now-playing').find('.play-button i').text('music_note');
    }}
}
function audioprogress(e) {
    let currentTime = $(this).prop('currentTime');
    let duration = $(this).prop('duration');
    $('#audioprogress')[0].MaterialProgress.setProgress(100 * currentTime / duration);
    if ($('#audioslider:focus').length == 0)
        $('#audioslider')[0].MaterialSlider.change(100 * currentTime / duration);
    if (currentTime == 0 && $(this).prop('paused')) {
        $('#audio-output').text('--:--')
    } else {
        $('#audio-output').text(isNaN(duration) ? humantime(currentTime) : humantime(currentTime) + ' / ' + humantime(duration))
    }

    if ($(this).prop('videoWidth') && $(this).prop('videoHeight') && $(this).attr('data-np')) {
        $('#mediaplayer').addClass('videoEnabled');
    } else {
        $('#mediaplayer').removeClass('videoEnabled');
    }

    if ('mediaSession' in navigator) {
        navigator.mediaSession.setPositionState({
            duration: duration > 0 && duration < Infinity ? duration : undefined,
            position: currentTime > 0 && currentTime < Infinity ? currentTime : undefined
        });
    }
}
function audioended(e) {
    let playmode = $('.playmode-radio:checked').val()
    switch (playmode) {
        case 'single':
            audiostop();
            break;
        case 'loopsingle':
            audioplay();
            break
        default:
            audionext();

    }
    $('#mediaplayer').removeClass('videoEnabled');
}
function audiostop() {
    let audio = $('#mediaplayer video');
    audio.trigger('pause').prop('currentTime', 0).attr('data-np', '').attr('data-np-index', '-1');
    $('#audio-play-btn').attr('title', 'Play').children('.material-icons').text('play_arrow');
    $('#audio-output').text('--:--');
    $('#audio-title').text('Stopped');

    $('#mediaplayer').removeClass('videoEnabled').addClass('hidden');

    findAndMarkNowPlaying();

    if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'none';
        navigator.mediaSession.metadata = new MediaMetadata();
    }
}
function audionext() {
    let audio = $('#mediaplayer video');
    audioplay(+audio.attr('data-np-index') + 1);
    // let thiscard = $('.card-audio[data-np=' + audio.attr('data-np') + ']')
    // // audiostop();
    // if (thiscard.length == 0) {
    //     audioplay();
    // } else {
    //     let nextcard = thiscard.parent().nextAll().find('.card-audio').first();
    //     if (nextcard.length > 0) {
    //         audioplay(nextcard);
    //     }
    // }
}
function audioprevious() {
    let audio = $('#mediaplayer video');
    audioplay(+audio.attr('data-np-index') - (audio.prop('currentTime') < 5 ? 1 : 0));
    // let thiscard = $('.card-audio[data-np=' + audio.attr('data-np') + ']')
    // audiostop();
    // if (thiscard.length == 0) {
    //     audioplay();
    // } else {
    //     let nextcard = thiscard.parent().prevAll().find('.card-audio').last();
    //     if (nextcard.length > 0) {
    //         audioplay(nextcard);
    //     }
    // }
}