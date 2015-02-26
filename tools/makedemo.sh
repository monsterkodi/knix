#!/usr/bin/env bash

WEB=$(cd $(dirname "$0")/../web; pwd)

cd $WEB
echo `pwd`

rsync ../js/*.js js
rsync ../js/lib/*.js js/lib
rsync ../style/dark.css style
rsync ../style/bright.css style

printf "%s---\ntitle: demo\n---\n" "" > demo.html
cat ../index.html >> demo.html

git commit -am "latest demo"
git push
git status
