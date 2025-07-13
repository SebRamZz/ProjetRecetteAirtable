#!/bin/sh
set -e

ollama serve &
SERVER_PID=$!

sleep 2

ollama pull phi3

wait $SERVER_PID 