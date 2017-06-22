#Responses

All of these response methods get attached to `res` object when Sails starts. This is where you can
create a custom `res.yada` method for custom responses. You'll probably not be using this much.

A good simple special one to look at is `proxyError` which takes the error from a SuperAgent call to another
microserver and converts it to something usable for a response.