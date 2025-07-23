#!/usr/bin/python3
# -*- coding: utf-8 -*-
# coding=utf-8

import os
import json
from datetime import datetime
from random import shuffle

from common import convert_bytes,  md5hd, loadconfig, loadpathConfig, ext

from urllib.parse import unquote
import misaka
import mutagen

import cgi
import cgitb

def listdir(path):
        config = loadconfig()
        result = []
        lores = []
        listdir = os.listdir('.')
        if config['showParent'] and path != '/': 
            listdir.append('..')

        for i in listdir:
          try:
            if not(i in config['forceHide'] or (i[0] == '.' and config['hideDotFiles'] and i!='..')):
                pathConfig = loadpathConfig(path+i)
                random = md5hd(i + config['randomPrefix'].format(
                    str(datetime.today())[0:10],
                    y=str(datetime.today())[0:4],
                    mo=str(datetime.today())[0:7],
                    d=str(datetime.today())[0:10],
                    h=str(datetime.today())[0:13],
                    m=str(datetime.today())[0:16],
                    s=str(datetime.today())[0:19],
                    ))
                isdir=os.path.isdir(i)
                color = pathConfig['color'] if 'color' in pathConfig else ''
                try:
                    size = len(os.listdir(i)) if isdir else os.path.getsize(i)
                    naturalsize=('{} element{}'.format(size,'' if size==1 else 's')) if isdir else convert_bytes(os.path.getsize(i))
                except Exception as e:
                    size=0
                    naturalsize = str(e)
                    
                lore = ''
                try:
                    with open(i+'.md') as f:
                        
                        lore = misaka.html(f.read(),misaka.EXT_TABLES|misaka.EXT_FENCED_CODE|misaka.EXT_FOOTNOTES|misaka.EXT_MATH,misaka.HTML_ESCAPE)
                except:
                    pass
                

                tags = {}
                # https://id3.org/id3v2.4.0-structure
                # https://id3.org/id3v2.4.0-frames
                if config['readAudioTags'] and (i.split('.')[-1]).lower() in config['audio']:
                    try:
                        tag = mutagen.File(i)
                        if tag.tags.get('TIT2'):
                            tags ['title']=(str(tag.tags.get('TIT2').text[0]))
                        elif tag.tags.get('title'):
                            tags ['title']=(str(tag.tags.get('title')[0]))

                        if tag.tags.get('TPE1'):
                            tags ['artist']=(str(tag.tags.get('TPE1').text[0]))
                        elif tag.tags.get('artist'):
                            tags ['artist']=(str(tag.tags.get('artist')[0]))

                        if tag.tags.get('TALB'):
                            tags ['album']=(str(tag.tags.get('TALB').text[0]))
                        elif tag.tags.get('album'):
                            tags ['album']=(str(tag.tags.get('album')[0]))

                    except Exception as e:
                        pass

                
                thumbs = []
                if config['maxThumbs']>0:
                    try:
                        thumbscount = 0
                        iliistdir = os.listdir(i)
                        shuffle(iliistdir)

                        for j in iliistdir:
                            if thumbscount >= config['maxThumbs']:
                                break
                            lext = ext(j).lower()
                            if lext in config['images'] or lext in config['video'] or (lext in config['audio'] and config['readAudioCovers']):
                                thumbs.append(path+i+'/'+j)
                                thumbscount += 1
                        pass
                    except:
                        pass
                result.append({
                    'name': i,
                    'type': (i.split('.')[-1]).lower() if '.' in i else '',
                    'size': size,
                    'naturalsize': naturalsize,
                    'random': random,
                    'isdir': isdir,
                    'islink': os.path.islink(i),
                    'modified': os.path.getmtime(i),
                    'color': color,
                    'lore': lore,
                    'thumbs': thumbs,
                    'tags': tags,
                    'pathConfig': pathConfig
                })
            
            if i.lower() in config['lores']:
                try:
                    with open(i) as f:
                        lores.append(misaka.html(f.read(),misaka.EXT_TABLES|misaka.EXT_FENCED_CODE|misaka.EXT_FOOTNOTES|misaka.EXT_MATH,misaka.HTML_ESCAPE))
                except:
                    pass
          except Exception as e:
            lores.append(str(e))
        return json.dumps({'listdir': result,'lores':lores, 'config': config,'pathConfig':loadpathConfig(path)})
   

if __name__ == '__main__':
    cgitb.enable()
    print("Content-Type: application/json; charset=utf-8")
    print()

    form = cgi.FieldStorage()
    try:
        root = os.environ['DOCUMENT_ROOT']
        path = unquote(form.getvalue('path'))
        os.chdir(root+path)
        # print(path)
        print(listdir(path))
    except Exception as e:

        print(json.dumps({'listdir':[],'lores':[str(e)],'config':loadconfig(),'pathConfig':{}}))
