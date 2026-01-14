#!/bin/bash

BRANCH=$(git rev-parse --abbrev-ref HEAD)
# echo $BRANCH
git push origin $BRANCH
git push gitee $BRANCH