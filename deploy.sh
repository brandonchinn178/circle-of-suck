#!/usr/bin/env bash

set -eux

yarn build
sed -i.bak '/build/d' .gitignore
git add build
git commit -m "Deploying to gh-pages"
git subtree push --prefix build/ origin gh-pages
git reset --hard HEAD~1
rm .gitignore.bak
