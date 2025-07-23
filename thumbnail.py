#!/usr/bin/python3
# -*- coding: utf-8 -*-
# coding=utf-8
import os
import cgi
import cgitb
import subprocess
import sys
from urllib.parse import unquote
from common import loadconfig, md5hd,ext
from shutil import copyfileobj
from random import shuffle
# from python_video_thumbnail import VideoFrames

if __name__ == '__main__':
    cgitb.enable()
    # print("Content-Type: text/html; charset=utf-8\n")
    print("Content-Type: image/webp")
    print('Content-transfer-encoding: base64\r')
    # print()
    config = loadconfig()
    form = cgi.FieldStorage()


    # determine size
    size=224
    if 'size' in form:
        formsize = form.getvalue('size')
        if formsize == 's':
            size = 50
        elif formsize == 'm':
            size = 512
        elif formsize == 'l':
            size = 1200
        elif formsize == 'h':
            size = 3000

    # Get filename here.
    if 'file' in form:
        fn = form.getvalue('file')
    else:
        fn = 'gregornet/broken_image.png'
    ffn = os.environ['DOCUMENT_ROOT']+'/' + unquote(fn)

    if os.path.isdir(ffn):
        jlist = os.listdir(ffn)
        shuffle(jlist)
        for i in jlist:
            lext = ext(i).lower()
            if lext in config['images']:
                ffn = ffn+'/'+i
                break

    if 'gregornet/' in ffn:
        thn = ffn
    else:
        #thn = os.environ['DOCUMENT_ROOT'] + \
        #    '/gregornet/thumbs/' + md5hd(ffn) + '.webp'
        thn = '/var/www/gregornet-thumbs/{}{}.webp'.format('' if size == 224 else size, md5hd(ffn)) 

    if not os.path.isfile(thn):
        try:
            # cheap workaround sorry
            subprocess.call(['ffmpeg', '-i', ffn, '-ss', '00:00:00.000','-vf','scale=w={}:h={}:force_original_aspect_ratio=increase'.format(size,size), '-vframes', '1', thn])


            # if ffn[-4:] == '.svg':
            #     svg2png(url=ffn, write_to=thn,
            #             output_width=224, output_height=224,)
            # elif ffn[-4:] == '.mp4':
            #     pass
            # else:
            #     im = Image.open(ffn)
            #     imaspect=im.width/im.height
            #     if imaspect<1: imaspect=1/imaspect
            #     imsize = int(imaspect*224)
            #     # im = im.crop((0, 0, imsize, imsize))
            #     im.thumbnail([imsize, imsize])
            #     im.save(thn, 'webp')
        except Exception as e:
            thn = 'broken_image.png'

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
