#!/usr/bin/python3
# -*- coding: utf-8 -*-
# coding=utf-8
import cgi
import os
import cgitb
from urllib.parse import unquote
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

    print('\n'+message)

    # print("Location: ../{0}?info={1}\n\n".format(form.getvalue('returnpath'),message))