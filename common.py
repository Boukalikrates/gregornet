#!/usr/bin/python3
# -*- coding: utf-8 -*-
# coding=utf-8
from hashlib import md5
import json
import urllib
import os


def saveConfig(value):
    with open(os.environ['DOCUMENT_ROOT']+('/gregornet/config.json'), 'w') as configfile:
        configfile.write(value)


with open(os.environ['DOCUMENT_ROOT']+('/gregornet/config.json'), 'r') as configfile:
    config = json.loads(configfile.read())
    configIncomplete=False
    # defaults
    if type(config)!=dict:
        configIncomplete=True
        config={}
    if 'serverName' not in config or type(config['serverName'])!=str:
        configIncomplete=True
        config['serverName']='Gregornet'
    if 'maxThumbs' not in config or type(config['maxThumbs'])!=int:
        configIncomplete=True
        config['maxThumbs']=2
    if 'pageSize' not in config or type(config['pageSize'])!=int:
        configIncomplete=True
        config['pageSize']=60
    if 'startIndex' not in config or type(config['startIndex'])!=int:
        configIncomplete=True
        config['startIndex']=1
    if 'randomPrefix' not in config or type(config['randomPrefix'])!=str:
        configIncomplete=True
        config['randomPrefix']='{0}'
    if 'hideLores' not in config or type(config['hideLores'])!=bool:
        configIncomplete=True
        config['hideLores']=False
    if 'hideDotFiles' not in config or type(config['hideDotFiles'])!=bool:
        configIncomplete=True
        config['hideDotFiles']=False
    if 'showSymlinkIcons' not in config or type(config['showSymlinkIcons'])!=bool:
        configIncomplete=True
        config['showSymlinkIcons']=False
    if 'showParent' not in config or type(config['showParent'])!=bool:
        configIncomplete=True
        config['showParent']=False
    if 'readAudioTags' not in config or type(config['readAudioTags'])!=bool:
        configIncomplete=True
        config['readAudioTags']=False
    if 'forceHide' not in config or type(config['forceHide'])!=list:
        configIncomplete=True
        config['forceHide']=[
            "gregornet",
            "cgi-bin",
            ".gregornet-config.json",
            "lost+found"]
    if 'lores' not in config or type(config['lores'])!=list:
        configIncomplete=True
        config['lores']=[
            "lore.md",
            "readme.md",
            "readme.markdown",
            "read.me",
            "readme.txt",
            "readme",
            "license.txt",
            "license"
    ]
    if 'images' not in config or type(config['images'])!=list:
        configIncomplete=True
        config['images']=[
            "jpg",
            "jpeg",
            "gif",
            "png",
            "bmp",
            "svg",
            "webp",
            "jxl"
    ]
    if 'video' not in config or type(config['video'])!=list:
        configIncomplete=True
        config['video']=[
            "mp4",
            "webm",
            "avi"
    ]
    if 'audio' not in config or type(config['audio'])!=list:
        configIncomplete=True
        config['audio']=[
            "mp3",
            "wav",
            "m4a",
            "ogg",
            "flac"
    ]
    if 'html' not in config or type(config['html'])!=list:
        configIncomplete=True
        config['html']=[
            "php",
            "html",
            "htm"
    ]
    if configIncomplete:
        saveConfig(json.dumps(config))
    


with open(os.environ['DOCUMENT_ROOT']+('/gregornet/pathConfig.json'), 'r') as pathConfigfile:
    pathConfig = json.loads(pathConfigfile.read())


def loadconfig():
    return config


def loadpathConfig(path):
    try:
        config = pathConfig.copy()
        pathlist = path.split('/')
        for i in pathlist:
            if (len(i) > 0):
                config = config['/'+i]
        for i in list(config.keys()).copy():
            if i[0] == '/':
                config.pop(i)
        return config
    except Exception as e:
        return {}


def savepathConfig(path, name, value):
    global pathConfig
    tempobj = {name: value}
    config=pathConfig
    pathlist = path.split('/')
    for i in pathlist:
        if (len(i) > 0):
            if '/'+i not in config:
                config['/'+i]={}
            config = config['/'+i]

    config.update(tempobj)
    with open(os.environ['DOCUMENT_ROOT']+('/gregornet/pathConfig.json'), 'w') as configfile:
        configfile.write(json.dumps(pathConfig))
        


def ext(name): return name[name.rfind('.')+1:]


def web(link):
    return urllib.parse.quote(link, safe='')
    # return link.replace('"','%22').replace("'",'%27').replace('?','%3F').replace('#','%23').replace(';','%3B').replace(' ','%20')


def md5hd(i):
    try:
        return md5(i.encode('utf-8')).hexdigest()
    except:
        return md5(i.encode('ascii', 'ignore')).hexdigest()


def lower(i): return i.lower()


def randomi(i):
    return ''


def convert_bytes(num):
    """
    this function will convert bytes to MB.... GB... etc
    """
    if num < 1024.0:
        return "%3.0f bytes" % (num)
    num /= 1024.0
    for x in ['KB', 'MB', 'GB', 'TB']:
        if num < 1024.0:
            return "%3.1f %s" % (num, x)
        num /= 1024.0
    return "%3.1f PB" % (num)
