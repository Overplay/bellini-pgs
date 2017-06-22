#Controllers Folder

This folder is parsed by Sails to "attach" routes automagically when it starts up. For example,
let's say you create a controller called `FunController.js`. Each method exported from this
controller will be available as a REST route when the server boots.

So if FunController.js looks like:

```$xslt
module.exports = {

    fun: function(req, res){
        res.ok("Well, that was fun!");
    },

    nofun: function(req, res){
        res.notFound("I cannot find fun!");
    }

}
```

Then you've created two REST endpoints:
- `fun/fun` which responds with the shown text
- `fun/nofun` which tosses a 404

Try them in a browser like:
`http://localhost:2020/fun/fun`

Good times.

Each function is a method on the `exported` object that takes two parameters: req (Request)
and res (Response). Typical the `req` object gives you info about what is being requested (parameters, 
type of request, i.e. VERB, etc. ), and you use `res` to respond appropriately. 

By convention, Sails.js strips the "Controller" part and starts the route with everything in
front of that. So "HangTenController.js" would have it's endpoints at `hangten/...".

Like everything in Sails, you can bypass this automatic route mounting and specifiy a completely 
different way of getting to the endpoint via the `config/route.js` settings. 

Simple example:
`'/login': 'AuthController.loginPage'`

This says if someone enters the URL `/login` to call the `loginPage` method in the `AuthController.js`
file. Easy peasy, right ;)?
