#!/bin/bash
source .env
mongo $CONNECTION_STRING < sim_user.js