#!/usr/bin/python3
# -*- coding: utf-8 -*-
# coding=utf-8
import cgi
import os
import cgitb
from urllib.parse import unquote

from common import saveConfig, savepathConfig
if __name__ == '__main__':
    cgitb.enable()
    print("Content-Type: text/html; charset=utf-8")
    # print()
    form = cgi.FieldStorage()
    message='Nothing to do'
    # Get filename here.
    if form.getvalue('action') == 'delete':
        if  'path' in form:
            try:
                
                path=unquote(form.getvalue('path'))
                os.remove(os.environ['DOCUMENT_ROOT']+path)
                message = 'The file "' + path + '" was deleted successfully'

            except Exception as e:
                message = 'An error occured: '+str(e).replace(os.environ['DOCUMENT_ROOT'],'')
        else:
            message='Missing arguments'
    
    elif form.getvalue('action') == 'move':            
        if 'newpath' in form and 'path' in form:
            try:
                path=unquote(form.getvalue('path'))
                newpath=unquote(form.getvalue('newpath'))
                os.rename(os.environ['DOCUMENT_ROOT']+path,os.environ['DOCUMENT_ROOT']+newpath)
                message = 'The file "' + path + '" was moved successfully'
            except Exception as e:
                message = 'An error occured: '+str(e).replace(os.environ['DOCUMENT_ROOT'],'')

    elif form.getvalue('action') == 'newFolder':            
        if 'newpath' in form:
            try:
                newpath=form.getvalue('newpath')
                os.mkdir(os.environ['DOCUMENT_ROOT']+newpath)
                message = 'The folder "' + newpath + '" was created successfully'
            except Exception as e:
                message = 'An error occured: '+str(e).replace(os.environ['DOCUMENT_ROOT'],'')
    
    elif form.getvalue('action') == 'savePathConfig':
        if 'path' in form and 'name' in form and 'val' in form:
            try:
                path=unquote(form.getvalue('path'))
                name=unquote(form.getvalue('name'))
                val=unquote(form.getvalue('val'))
                savepathConfig(path,name,val)
                message = 'Directory updated successfully'
            except Exception as e:
                message = 'An error occured: '+str(e).replace(os.environ['DOCUMENT_ROOT'],'')

    elif form.getvalue('action') == 'saveConfig':
        if 'val' in form:
            try:
                val=unquote(form.getvalue('val'))
                saveConfig(val)
                message = 'Configuration updated successfully'
            except Exception as e:
                message = 'An error occured: '+str(e).replace(os.environ['DOCUMENT_ROOT'],'')

    print('\n'+message)

    # print("Location: ../{0}?info={1}\n\n".format(form.getvalue('returnpath'),message))