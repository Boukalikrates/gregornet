#!/usr/bin/python3
# -*- coding: utf-8 -*-
# coding=utf-8
import os
import cgi
import cgitb
import sys
import base64
from PIL import Image
from common import md5hd
from shutil import copyfileobj

if __name__ == '__main__':
    cgitb.enable()
    # print("Content-Type: text/plain; charset=utf-8")
    print("Content-Type: image/png")
    print('Content-transfer-encoding: base64\r')
    # print()

    form = cgi.FieldStorage()
    # Get filename here.
    if 'file' in form:
        fn = form.getvalue('file')
    else:
        fn= 'papermache/photo.jpg'
    ffn=os.environ['DOCUMENT_ROOT']+'/'+ fn
    
    if 'papermache' in ffn: 
        thn=ffn 
    else:
        thn=os.environ['DOCUMENT_ROOT']+'/papermache/thumbs/'+ md5hd(fn) +'.png'
    
    if not os.path.isfile(thn):
        im=Image.open(ffn)
        imsize=min(im.width,im.height)
        im=im.crop((0,0,imsize,imsize))
        im.thumbnail([224,224])
        im.save(thn,'png')

    # print('Status: 303 See other')
    # print('Location: {}'.format(thaddr))
    print()
    sys.stdout.flush()
    print()
    with open(thn, 'rb') as f:
        copyfileobj(f, sys.stdout.buffer)
        # contents = f.read()
        # print(base64.b64encode(contents).decode(encoding='UTF-8'))
        # # print("".join(map(chr, contents)))
        f.close()
    
    print()
            
