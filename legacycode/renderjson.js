function renderJSONObject(object, name) {
    let result = 'object';
    switch (typeof object) {
        case 'string':
        case 'number':
            result = $('\
            <li class="mdl-list__item">\
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">\
                    <input class="mdl-textfield__input" type="text" value="1">\
                    <span class="mdl-textfield__label">startIndex</span>\
                </div>\
            </li>')

            result.find('input').val(object);
            result.find('span').text(name);
            if (typeof object == 'number') result.find('input').prop('type', 'number');
            break;
        case 'boolean':
            result = $('<li class="mdl-list__item">\
                <span class="mdl-list__item-primary-content"></span>\
                <span class="mdl-list__item-secondary-action">\
                    <label class="mdl-switch mdl-js-switch " >\
                    <input type="checkbox" class="mdl-switch__input" />\
                    </label>\
                </span>\
            </li>');
            result.children().first().text(name);
            result.find('input').prop('checked', object);
            break;
        default:
            result = $('\
            <li class="mdl-list__item settings-object">\
                <div class="settings-object-header">\
                    <h5 class="json-object-name">object</h5>\
                </div>\
            </li>')
            result.find('.json-object-name').text(name);
            let list = $(Array.isArray(object) ? '<ol class="mdl-list settings-object-list">' : '<ul class="mdl-list settings-object-list">')

            Object.keys(object).forEach((k, i) => {
                list.append(
                    renderJSONObject(object[k], k)
                )
            });
            result.append(list);

        // for(let [key, value] of Object.entries(object)){
        // // for(let i in object){
        //     if(object.hasOwnProperty(key))
        //     result.find('ol').append(
        //         renderJSONObject(value,key)
        //     )
        // }
    }


    return result;

}

function fillSettingsPage() {
    for (let i in config) {
        let val = config[i];
        let field = $('#config-' + i);
        if (Array.isArray(val) && field.filter('textarea').length) {
            field.val(val.join('\n')).attr('rows', val.length + 1);
            if(val.length) field.parent().addClass('is-dirty')
            else field.parent().removeClass('is-dirty')
        } else if (typeof val == typeof true && field.attr('type') == 'checkbox') {
            field.prop('checked', val);
            if (val) field.parent().addClass('is-checked');
            else field.parent().removeClass('is-checked');
        } else if (typeof val == typeof 1 && field.attr('type') == 'number') {
            field.val(val);
            field.parent().addClass('is-dirty')
        } else {
            val=val.toString();
            field.val(val);
            if(val.length) field.parent().addClass('is-dirty')
            else field.parent().removeClass('is-dirty')
        }
    }
}

function applySettingsPage(){

    for (let i in config) {
        let val = config[i];
        let field = $('#config-' + i);
        if (field.filter('textarea').length) {
            config[i]=field.val().split('\n').filter(function(entry) { return entry.trim() != ''; });
        } else if ( field.attr('type') == 'checkbox') {
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