#!/bin/sh

HOOKS_PATH="./githooks"

echo "Set local hooks path to $HOOKS_PATH"
git config --local core.hooksPath $HOOKS_PATH
