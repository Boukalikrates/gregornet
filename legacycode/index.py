#!/usr/bin/python3
# -*- coding: utf-8 -*-
# coding=utf-8
raise Exception(__file__+' is deprecated, do not launch this!!1')
import os
from misaka import html
import json

import misaka
from common import loadconfig, loadpathConfig

import cgitb

def index():
    # root = req.document_root()
    # path = req.uri
    # servername=os.environ['SERVER_NAME']
    root = os.environ['DOCUMENT_ROOT']
    path = os.environ['SCRIPT_URL']

    # config = loadconfig()
    # pathConfig = loadpathConfig(path)
    # bodyclass=''
    # if 'color' in pathConfig:
    #     bodyclass='folder-color-{0}'.format(pathConfig['color'])

    with open(root+'/gregornet/skel.html', 'r') as f:
        skel = f.read()

    return skel
        

    if os.path.isdir(root+path):
        os.chdir(root+path)

        maingrid = ''


        listdir = sorted(os.listdir('.'), key=os.path.isdir, reverse=True)

        page=0


        # title
        # maingrid += '''
        # <h2 class=" mdl-cell mdl-cell--12-col m m-stream">{0}</h2>
        # '''.format(dirtree[-1])

        # info
        # if 'info' in cgi.FieldStorage():
        #     maingrid += '''
        #     <div class="mdl-cell mdl-cell--12-col info"><i class="material-icons">info</i><span>{0}</span></div>
        #     '''.format(cgi.FieldStorage()['info'].value)

        
        # lore
        # for i in listdir:
        #     if page == 0 and i.lower() in config['lores']:

        #         f = open(i, 'r')
        #         flore = f.read()
        #         f.close()
        #         maingrid += '''
        #         <article class="lore mdl-cell mdl-cell--12-col  markdown">
        #                 {0}
        #         </article>
        #         '''.format(misaka.html(flore,misaka.EXT_TABLES|misaka.EXT_FENCED_CODE|misaka.EXT_FOOTNOTES|misaka.EXT_MATH,misaka.HTML_ESCAPE))

        # maingrid += '''
        # <div class="mdl-cell mdl-cell--12-col mdl-textfield mdl-js-textfield m m-default m-list">
        #     <input class="mdl-textfield__input" type="text" id="filter">
        #     <label class="mdl-textfield__label" for="filter">Filter</label>
        # </div>
        # '''

        # dirgrid=''
        #dirgrid='<script>var serverinfo='+json.dumps({'root':root,'path':path})+'; var listdir='+json.dumps(listdir)+'</script>'
        # maingrid += '<script>serverinfo=' + \
        #     json.dumps({'root': root, 'path': path})+'</script>'



        #maingrid+='<div class="mdl-cell mdl-cell--12-col"></div>'


        #maingrid+='<div class="mdl-cell mdl-cell--12-col pagenumbers"><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored pagebutton back-to-top">Back to top</button></div>'

        return skel.format(main=maingrid)
    else:
        return skel.format(main='')


if __name__ == '__main__':
    cgitb.enable()
    print("Content-Type: text/html; charset=utf-8")
    print()
    with open(os.environ['DOCUMENT_ROOT']+'/gregornet/skel.html', 'r') as f:
        print (f.read())
    # print(index())

