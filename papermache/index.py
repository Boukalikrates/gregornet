#!/usr/bin/python3
# -*- coding: utf-8 -*-
# coding=utf-8
import os
from misaka import html
import json
from common import loadconfig

import cgi,cgitb

def index():
    # root = req.document_root()
    # path = req.uri
    servername=os.environ['SERVER_NAME']
    root = os.environ['DOCUMENT_ROOT']
    path = os.environ['SCRIPT_URL']

    config = loadconfig(root)
    localconfig = loadconfig(root+path,True)
    bodyclass=''
    if 'color' in localconfig:
        bodyclass='mdl-color--{}-100'.format(localconfig['color'])

    f = open(root+'/papermache/skel.html', 'r')
    skel = f.read()
    f.close()

    

    if os.path.isdir(root+path):
        os.chdir(root+path)

        maingrid = ''

        pagesize = config['pagesize']

        listdir = sorted(os.listdir('.'), key=os.path.isdir, reverse=True)

        page=0
        mods = ''

        dirtree = [config['serverName']]+path.split('/')[1:-1]

        # title
        maingrid += '''
        <h2 class=" mdl-cell mdl-cell--12-col m m-stream">{0}</h2>
        '''.format(dirtree[-1])

        # info
        if 'info' in cgi.FieldStorage():
            maingrid += '''
            <div class="mdl-cell mdl-cell--12-col info"><i class="material-icons">info</i><span>{0}</span></div>
            '''.format(cgi.FieldStorage()['info'].value)

        
        # lore
        for i in listdir:
            if page == 0 and i.lower() in config['lores']:

                f = open(i, 'r')
                flore = f.read()
                f.close()
                maingrid += '''
                <article class="lore mdl-cell mdl-cell--12-col  markdown">
                        {0}
                </article>
                '''.format(html(flore))

        # maingrid += '''
        # <div class="mdl-cell mdl-cell--12-col mdl-textfield mdl-js-textfield m m-default m-list">
        #     <input class="mdl-textfield__input" type="text" id="filter">
        #     <label class="mdl-textfield__label" for="filter">Filter</label>
        # </div>
        # '''

        # dirgrid=''
        #dirgrid='<script>var serverinfo='+json.dumps({'root':root,'path':path,'mods':mods})+'; var listdir='+json.dumps(listdir)+'</script>'
        maingrid += '<script>serverinfo=' + \
            json.dumps({'root': root, 'path': path, 'mods': mods})+'</script>'



        #maingrid+='<div class="mdl-cell mdl-cell--12-col"></div>'


        #maingrid+='<div class="mdl-cell mdl-cell--12-col pagenumbers"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored pagebutton back-to-top">Back to top</button></div>'

        return skel.format(main=maingrid,
                           title=dirtree[-1],
                           path='/'.join(dirtree[1:]),
                           bodyclass=bodyclass,
                           ip=servername)
    else:
        return skel.format(main='',
                           title='',
                           path='/',
                           bodyclass=bodyclass,
                           ip=servername)


if __name__ == '__main__':
    cgitb.enable()
    print("Content-Type: text/html; charset=utf-8")
    print()
    print(index())

