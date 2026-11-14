#!/usr/bin/env bash
# split_test_locked.sh PAGE [flags]: runs split_test.js but only one headless Chromium at a time on this machine
# (the Claude app's cgroup allows 512 processes and threads; several parallel browsers exhaust it).
exec flock -w 1800 /tmp/split-test.lock node "$(dirname "$0")/split_test.js" "$@"
