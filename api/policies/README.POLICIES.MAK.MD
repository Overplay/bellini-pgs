#Policies

Policies are little snippets of code run as middleware when processing an incoming request. Typically,
they are used to enforce security policies.

Policies are "attached" to various endpoints via the `config/policies.js` code.

Example: 
```
MediaController: {
        '*':                true,
        'upload':           [ 'sessionAuth' ],
        'download':         [ 'isGET', 'sessionAuth'],
        'deleteAllEntries': false
    },
```

The `*` route tells Sails how to handle anything not explicitly called out. In this case,
we allow access to anyone to any route not listed. This is, in fact, a really shitty policy
because it means the database can be tragically f-d with.

`media/upload` require the request to go through the `sessionAuth` policy which checks to make sure the
user has been authenticated.

`media/deleteAllEntries` is explicitly disabled. Probably a good thing.

A policy looks a lot like a controller endpoint, except it has a `next` function that must be called
to continue any chain of policies (you can have multiple in the array).

This super-sophisitcated policy makes sure the request is a GET:

```$xslt
module.exports = function ( req, res, next ) {

    if ( req.method == 'GET' )
        return next()

    return res.badRequest({error: "Bad Verb [1]"});

};
```