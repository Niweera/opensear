#!/bin/bash

set -e

printf "\nNow running worker...\n"

node --experimental-specifier-resolution=node /runner.js "$1"
