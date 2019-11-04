#!/usr/bin/env bash

set -eux

if [[ $(git rev-parse HEAD) != $(git rev-parse master) ]]; then
    echo 'not on master branch'
    exit 1
fi

yarn build
git subtree split --prefix build -b gh-pages
git push --force origin gh-pages:gh-pages
git branch -D gh-pages
