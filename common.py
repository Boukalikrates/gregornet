#!/usr/bin/python3
# -*- coding: utf-8 -*-
# coding=utf-8
from hashlib import md5
import json
import urllib

def loadconfig(path,local=False):
    try:
        f=open(path+('/.papermache-config.json' if local else '/papermache/config.json'),'r')
        config=json.loads(f.read())
        #config=json.loads('{}')
        f.close()
        return config
    except:
        return {}


ext=lambda name: name[name.rfind('.')+1:]

def web(link):
    return urllib.parse.quote(link, safe='')
    #return link.replace('"','%22').replace("'",'%27').replace('?','%3F').replace('#','%23').replace(';','%3B').replace(' ','%20')

def md5hd(i):
    return md5(i.encode('utf-8')).hexdigest()


lower=lambda i:i.lower()

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