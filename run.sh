#!/bin/bash

cd FrontEnd
npm run dev &     # Start frontend in background, so script continues

cd ../BackEnd
bash run.sh       # Start backend as foreground process

wait              # (optional) Wait for all background jobs before exiting script
