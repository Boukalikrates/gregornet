#!/usr/bin/python3
# -*- coding: utf-8 -*-
# coding=utf-8
import os
from random import shuffle

from common import loadconfig, web, ext, md5hd, convert_bytes

# import mutagen

import cgi
import cgitb


def filecard(i, root, path):
    config = loadconfig(root)
    result = ''
    # if i in config['forcehide']:
    #     return ''
    # if config['hideLores'] and i in config['lores']:
    #     return ''
    # if False and  config['hideDotFiles'] and i [:1] == '.':
    #     return ''

    # --- DIRS ---
    linkicon = ' <i class="material-icons" title="Link">call_made</i>' if config['showSymlinkIcons'] and os.path.islink(i) else ''
    if os.path.isdir(i):
        localconfig = loadconfig(root+path+i, True)
        try:
            count = len(os.listdir(i))
            countdiv = '<a draggable="false" href="{link}" class="mdl-card__supporting-text mdl-card--expand">{c} element{s}</a>'.format(
                link=web(i), c=count, s='' if count == 1 else 's')
            if 'thumb' not in localconfig or localconfig['thumb']:
                thumb = '<a href="{link}"  class="dirthumbs mdl-card__media">'.format(
                    link=web(i))
                jcount = 0
                jlist = os.listdir(i)
                shuffle(jlist)

                for j in jlist:
                    lext = ext(j).lower()
                    if lext in config['images']:
                        thumbstyle = '<div class="dirthumb" data-thumb="url(\'/papermache/thumbnail.py?file={0}\') no-repeat top / cover"></div>'
                        thumb += thumbstyle.format(web(path+i+'/'+j))
                        jcount += 1
                        if jcount >= config['maxthumbs']:
                            break

                if jcount == 0:
                    thumb = ''
                else:
                    thumb += '</a>'
            else:
                thumb = ''
        except Exception as e:
            thumb = ''
            countdiv = '<div class="mdl-card__supporting-text ">Error listing folder: {}</div>'.format(
                str(e))
        color=''
        if 'color' in localconfig:
            color = 'mdl-color--{}-200'.format(localconfig['color'])

        card = '''
        <div draggable="false" data-link="{path}{link}" data-drop="true" id="{id}" class="mdl-card mdl-shadow--2dp {color} m m-default m-stream card-dir">
            <a draggable="false" href="{link}" class="mdl-card__title">

                {name}
                {linkicon}
            </a>
            {c}
            {t}
            <!--<div class="mdl-card__actions mdl-card--border m m-default">
                <button  class="mdl-button mdl-button--icon mdl-js-button">
                    <i class="material-icons">folder</i>
                </button>
            </div>-->
        </div>
        '''.format(
            link=web(i),
            id=md5hd(i),
            path=web(path),
            name=i,
            color=color,
            linkicon=linkicon,
            t=thumb,
            c=countdiv
        )

    else:
        card = ''
        lore = ''
        lext = ext(i).lower()
        # and not (lext == 'gif' and i[:-4]+'.mp4' in listdir or lext == 'gif' and i[:-5]+'.mp4' in listdir):
        if lext in config['images']:
            try:
                f = open(i+'.md', 'r')
                lore = f.read()
                f.close()
            except:
                pass
            streamholder = '''
            <figure class="m m-stream stream-holder">
                <img src="/papermache/baseline_photo_white_18dp.png" id="{1}" class="stream-image stream-image-unloaded" loading="lazy" alt="{0}">
                <a href="{0}" class="stream-caption">{2} | <output id="size-{1}"></output></a>
                <figcaption>{lore}</figcaption>
            </figure>
            '''
#            if i+'.md' in listdir:
#                ii=i+'.md'
#                f=open(ii,'r')
#                flore=unicode(f.read(), errors='replace')
#                f.close()
#                streamholder+='''
#                <div class="m m-stream markdown stream-holder">
#                    {0}
#                </div>
#                '''.format(html(flore))

        elif lext in config['videos']:
            streamholder = '<div class="m m-stream stream-holder"><video src="{0}" class="stream-image" controls loop muted autoplay></video></div>'

        elif lext in config['audio']:
            streamholder = '<div class="m m-stream stream-holder"><audio src="{0}" class="stream-image" controls  preload="none"  ></audio></div>'
        else:
            streamholder = ''
        card += streamholder.format(web(i), md5hd(i), i, lore=lore)

        fsize = convert_bytes( os.path.getsize(i))
        calss = ''
        thumb = ''
        lore = ''
        actions = ''
        if lext in config['images']:
            thumb = 'data-thumb="url(\'{0}\') top / cover"'.format('/papermache/thumbnail.py?file='+web(path+i))
            lore = '''
            <a href="{0}" class="mdl-card__supporting-text mdl-card--expand">
            </a>
            '''.format(web(i))
            calss = 'card-image '

        elif lext in config['html']:
            lore = '''
            <div class=" mdl-card--expand">    
                <div class="iframe-holder"><iframe sandbox src="{0}"></iframe></div>
            </div>
            '''.format(web(i))
            calss = 'card-html '

        elif lext in config['audio']:
            thumb = 'data-np="{0}"'.format(md5hd(i))
            # tracktitle=str(mutagen)
            lore = '''
            <div class="mdl-card__supporting-text mdl-card--expand">
                {0}
            </div>
            '''.format('')
            actions = '''
            <button class="mdl-button mdl-button--icon mdl-js-button play-button" data-np="{1}" data-href="{0}">
                <i class="material-icons">play_arrow</i>
            </button>
            <a class="mdl-button mdl-button--icon mdl-js-button" href="{0}" download>
                <i class="material-icons">get_app</i>
            </a>
            '''.format(web(i), md5hd(i))
            calss = 'card-audio '

        else:
            lore = '''
            <div class="mdl-card__supporting-text  mdl-card--expand">
                <span>{}</span>
            </div>
            '''.format(fsize)
        card += '''
        <div class="mdl-card mdl-shadow--2dp m m-default {calss}" {t}>
            <a href="{link}"  class="mdl-card__title  filetitle">                        
                {name}
                {linkicon}
            </a>
            {lore}
            
            <div class="mdl-card__actions  mdl-card--border cardactions">
                {actions}
                <div class="mdl-layout-spacer"></div>
                <button class="mdl-button mdl-button--icon mdl-js-button" id="menu-{id}">
                    <i class="material-icons">more_vert</i>
                </button>
            </div>
            
            <ul class="mdl-menu mdl-menu--top-right mdl-js-menu mdl-js-ripple-effect"
                for="menu-{id}">
                <li class="mdl-menu__item fileremover" data-name="{name}" data-link="path={path}&filename={link}">Delete</li>
            </ul>
            <div class="mdl-card__menu">
            </div>
        </div>
        '''.format(
            link=web(i),
            name=i,
            id=md5hd(i),
            t=thumb,
            path=web(path),
            calss=calss,
            lore=lore,
            linkicon=linkicon,
            actions=actions
        )

    # --- LIST ---
    icon = 'insert_drive_file'
    if os.path.isdir(i):
        icon = 'folder'
    else:
        lext = ext(i).lower()
        if lext in config['images']:
            icon = 'image'
        if lext in config['audio']:
            icon = 'music_note'
        if lext in config['videos']:
            icon = 'movie'
        if lext in config['html']:
            icon = 'code'

#    item='''
#    <li class="item mdl-cell mdl-cell--stretch afterbase">
#        <a href="{link}" class="mdl-list__item-primary-content dirtitle m m-list">
#            <i class="material-icons mdl-list__item-icon">folder</i>
#            {name}
#        </a>
#        {card}
#    </li>
#    '''
    item = '''
        
        <a href="{link}" class="mdl-list__item-primary-content dirtitle m m-list" data-type="{icon}">
            <i class="material-icons mdl-list__item-icon">{icon}</i>
            {name}
        </a>
        {card}
        <!-- Pa;p;ermache Card -->
    '''
    result += item.format(
        link=web(i),
        name=i,
        icon=icon,
        card=card
    )

    return result


if __name__ == '__main__':
    cgitb.enable()
    print("Content-Type: text/html; charset=utf-8")
    print()

    form = cgi.FieldStorage()

    root = os.environ['DOCUMENT_ROOT']
    path = form.getvalue('path')
    i = form.getvalue('i')
    os.chdir(root+path)
    print(filecard(i, root, path))
