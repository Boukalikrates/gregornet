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

