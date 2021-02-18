#!/usr/bin/python3
# -*- coding: utf-8 -*-
# coding=utf-8

import os
import json
from datetime import date

from common import md5hd,loadconfig

import cgi, cgitb 

def listdir(root,path):
    config=loadconfig(root)
    result=[]
    listdir=os.listdir('.')

    for i in listdir:
        if not(i in config['forcehide'] or (i[0]=='.' and config['hideDotFiles'])):
            result.append({
                'name':i, 
                'random':md5hd(i+config['randomprefix'].format(str(date.today()))), 
                'isdir':os.path.isdir(i),
                'modified': os.path.getmtime(i)
            })

        
    return json.dumps({'listdir':result,'config':config})




if __name__ == '__main__':
    cgitb.enable()
    print("Content-Type: application/json; charset=utf-8")
    print()

    form = cgi.FieldStorage() 

    root = os.environ['DOCUMENT_ROOT']
    path = form.getvalue('path')
    os.chdir(root+path)
    # print(path)
    print(listdir(root,path))
