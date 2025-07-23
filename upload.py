#!/usr/bin/python3
# -*- coding: utf-8 -*-
# coding=utf-8
import cgi
import os
import cgitb
from urllib.parse import unquote
from common import savepathConfig,loadpathConfig
if __name__ == '__main__':
    cgitb.enable()
    print("Content-Type: text/html; charset=utf-8")
    # print()
    form = cgi.FieldStorage()
    # Get filename here.
    message = ''
    if 'filename' in form:
        try:
            filelist = form['filename']
            if type(filelist) != type([]):
                filelist = [filelist]

            # Test if the file was uploaded
            for fileitem in filelist:
                if fileitem.filename:
                    # strip leading path from file name to avoid
                    # directory traversal attacks
                    fn = os.path.basename(fileitem.filename)
                    path=unquote(form.getvalue('path'))
                    open(os.environ['DOCUMENT_ROOT']+'/'+path+'/' + fn, 'wb').write(fileitem.file.read())
                    message += 'The file "' + fn + '" was uploaded successfully. '

                else:
                    message += 'No file was uploaded'
        except Exception as e:
            message = 'An error occured: '+str(e).replace(os.environ['DOCUMENT_ROOT'],'')
            # message = form.getvalue('path')
            

    else:
        message='Nothing to do'

    print("Location: ../{0}/?info={1}\n\n".format(path,message).replace('//','/'))
    print("")
    print(message)