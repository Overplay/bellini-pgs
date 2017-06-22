#Hooks

This folder holds what are called "hooks" that are typically repetitive tasks the Sails server
runs periodically. Let's say you want to grab the TV lineups every hour and then update the
database. Do that kind of stuff here.

The syntax, like everything in Sails, is by convention. Have a look at an example hook to 
puzzle it out.

Each hook lives in its own folder which, by convention, must end in the word `Hook`. Inside the folder
must be an `index.js` which Sails calls into at boot time in this order:
- `configure` method
- `initialize` method

All other methods and work are on you. If you want something to run every hour, you'll need a `setInterval` that does that, as an example.