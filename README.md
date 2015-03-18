
## mongoose-friendly-id

a simple mongoose plugin that populates `.slug` when the given `prop` is set.

## installation

```bash
$ npm install mongoose-friendly-id
```

## Usage

```coffee
slug = require 'mongoose-friendly-id'
schema.plugin slug, 'name'

User = mongoose.model 'User', schema

user = new User
user.name = 'Hello world'
user.slug #=> 'hello-world'
user.slugs #=> ['hello-world']

user.name = 'Beautiful world'
user.slug #=> 'beautiful-world'
user.slugs #=> ['hello-world', 'beautiful-world']

user2 = new User
user2.slug #=> ObjectId('54ffa7b0f7ce3ce55b6d8515')
user2.slugs #=> [ObjectId('54ffa7b0f7ce3ce55b6d8515')]

User.findByFiriendlyId 'hello-world', (err, user) ->
  user.slug #=> 'hello-world'
  user.slugs #=> ['hello-world', 'beautiful-world']

```

To use different slug candidates pass them as array

```coffee
slug = require 'mongoose-friendly-id'
schema.plugin slug, ['name', 'job']

User = mongoose.model 'User', schema

user = new User( name: 'Victor Kim', job: 'coffeescript programmer')
user.slug #=> 'victor-kim-coffeescript-programmer'
user.slugs #=> ['victor-kim-coffeescript-programmer']

````

To use different slug candidates pass them as function

```coffee
slug = require 'mongoose-friendly-id'
schema.plugin slug, (model) ->
  "#{model.name}--#{model.job}" if model.name and model.job
  
User = mongoose.model 'User', schema
user = new User( name: 'Victor Kim', job: 'coffeescript programmer')
user.slug #=> 'victor-kim--coffeescript-programmer'
user.slugs #=> ["victor-kim--coffeescript-programmer"]

````


## License

MIT
