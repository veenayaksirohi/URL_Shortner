#!/bin/bash

cd FrontEnd
npm install    # Ensure dependencies are installed
npm run dev &     # Start frontend in background, so script continues

cd ../BackEnd
bash run.sh       # Start backend as foreground process

wait              # (optional) Wait for all background jobs before exiting script
