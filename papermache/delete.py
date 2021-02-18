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
    if 'filename' in form and 'path' in form:
        try:
            
            path = form.getvalue('path')
            fn = form.getvalue('filename')
            os.remove(os.environ['DOCUMENT_ROOT']+path+ fn)
            message = 'The file "' + fn + '" was deleted successfully'

        except Exception as e:
            message = 'An error occured: '+str(e).replace(os.environ['DOCUMENT_ROOT'],'')
            

    else:
        message='Nothing to do'

    print("Location: ..{0}?info={1}\n\n".format(form.getvalue('path'),message))