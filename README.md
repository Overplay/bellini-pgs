# BELLINI-PGS: Program Guide Microservice

Bellini-PGS is based on the same core architecture as all Bellini Microservices:
- Sails.js
- Automagic grunting of files to `.tmp` is turned off. `assets` served directly.
- Waterlock security based on Cole's fork


Structure Notes
---------------

1. The usual Grunting of `assets` to `.tmp` is turned off. I like to really know how my stuff is going together and this
   is particularly important when using AngularJS. Assets is served directly as the root of the webserver.
   <br>
2. EJS templates are used as the "index.html" of SPA Angular apps. So for example, the UI is bult from `views/ui` by
    merging the uilayout.ejs with uiapp.ejs. These files use EJS includes to grab JS and CSS dependencies from `views/partials`.
    These dependencies live in `assets/**`. 
    <br>
3. Login, Logout and Password reset all have their own EJS templates in `views/users`.
    <br>
