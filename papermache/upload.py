#!/usr/bin/python3
# -*- coding: utf-8 -*-
# coding=utf-8
import cgi
import os
import cgitb
if __name__ == '__main__':
    cgitb.enable()
    print("Content-Type: text/html; charset=utf-8")
    # print()
    form = cgi.FieldStorage()
    # Get filename here.
    if 'filename' in form:
        try:
            fileitem = form['filename']
            # Test if the file was uploaded
            if fileitem.filename:
                # strip leading path from file name to avoid
                # directory traversal attacks
                fn = os.path.basename(fileitem.filename)
                open(os.environ['DOCUMENT_ROOT']+'/'+form.getvalue('path')+'/' + fn, 'wb').write(fileitem.file.read())
                message = 'The file "' + fn + '" was uploaded successfully'

            else:
                message = 'No file was uploaded'
        except Exception as e:
            message = 'An error occured: '+str(e).replace(os.environ['DOCUMENT_ROOT'],'')
            

    else:
        message='Nothing to do'

    print("Location: ../{0}/?info={1}\n\n".format(form.getvalue('path'),message))