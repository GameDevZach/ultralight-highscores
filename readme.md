
# High Score Server Lite

Swiftly deploy your own open-source highscore server for game jams and prototypes.

_Only the admin functions can be considered relatively secure. There is no protection against spoofing highscores unless you use a middleware server (like Epic Online Services) with authentication to keep the client key from your users. That kind of thing is out of scope for a jam - but highscores shouldn't be!_

## Two-step deployment on Glitch

Use Glitch's remix feature to deploy immediately!

Copy the variables from sample.env into env and write your own keys. The client key will be used by your game and the admin key you keep secret, to use the maintenance endpoints yourself (whenever those get developed).

## Developing locally
Install npm packs locally from the project root with "npm install".

Make your local .env file by copying sample.env

Create a folder called /.data/ so that the database has a directory to go in.

The server can be started via console with "npm run start" from the project root.

The test folder contains Request markup that can be used with the VSCode Extension "Rest Client".


Copyright 2025 :: Zachary Helm :: CC-BY 

_Leaving this readme in your Glitch remix is enough for attribution. Have fun :)_