#!/usr/bin/env bash

WEB=$(cd $(dirname "$0")/../web; pwd)

cd $WEB
echo `pwd`

rsync ../js/*.js js
rsync ../js/lib/*.js js/lib
rsync ../style/dark.css style
rsync ../style/bright.css style
rsync ../index.html demo.html

git commit -am "latest demo"
git push
git status
