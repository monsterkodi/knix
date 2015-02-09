#!/usr/bin/env bash

WEB=$(cd $(dirname "$0")/../web; pwd)

cd $WEB
echo `pwd`
# echo 'copy json ...'
rsync ../js/*.js js
rsync ../js/lib/*.js js/lib
# echo 'copy style ...'
rsync ../style/dark.css style
rsync ../style/bright.css style
# echo 'copy index ...'
rsync ../index.html demo.html
