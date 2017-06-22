#Models

Models are the core of the database OM (Object Relational Mapper). Phew, that's a $25 phrase!

What it means is you define objects to work with here like "Users", "Products", "Media", whatever and
Sails automagically takes care of persisting these into a database. Sails also takes care
of the relations for you. So, for example, you can define that Users have a list of Products that 
they own and then when you fetch a User, you also get all their products.

Sweet!

Well, it's not quite that simple, but you get the idea.

In a model you define the fields by type (like String, Integer, etc.) like so:

```$xslt
module.exports = {

    // Enforce model schema in the case of schemaless databases
    schema: true,

    attributes: {
        /**
         * These are all from ssexy Media
         */
        path: {
            type: 'string',
            required: true,
            notEmpty: true,
            protected: false, //SJM
            defaultsTo: ''
        },

        // TODO: we probably won't use this...
        flags: {
            type: 'json',
            defaultsTo: {"inappropriate": false, "favorite": false, "sticky": false}
        },

        file: {
            type: 'json',
            defaultsTo: {}
        },

```

Sails supports lots of different field types. Refer to the Waterline docs. You can also add
verifiers, so if someone tries to write an email to an integer, for example, Sails will hurl.

You can also add methods to these objects to do specialized things.

There are also "lifecycle" calls that automatically get called by Sails during the objects lifecycle.
For example, if you wanted to encrypt a password before saving it in the DB (and you should!), you can use
the `beforeCreate` method to do that.