slug = require 'speakingurl-add-korean'
ObjectId = require('mongoose').Types.ObjectId
iced = require 'iced-runtime'

module.exports = (schema, properties) ->

  schema.add
    slug: 
      type: 'String'
      uniq: true
  
  schema.add 
    slugs: [ String ]
  
  schema.statics.findByFriendlyId = (id, fields, options, callback) ->
    query = 
      $or: [
        { slugs: id }
      ] 
    if id and id.toString().match /^[0-9a-fA-F]{24}$/ 
      query.$or.push _id: id
    @findOne query, fields, options, callback
  
  schema.pre 'save', (next) ->
    slugged = null
    
    slugged = slug @[properties] if typeof properties is "string"
    slugged = slug properties(@) if typeof properties is "function"
    
    if Array.isArray properties
      props = for prop in properties
        @[prop]
      slugged = slug props.join " "
    
      
    unless slugged
      if @slug
        return next() 
      else
        slugged = @id

    await 
      @collection
      .findOne
        _id: 
          $ne: new ObjectId(@id) 
        slugs: slugged 
      , defer(err, data)

    if data
      slugged = @id 
    
    @slugs = [] unless @slugs
    @slugs.push slugged if @slugs and @slugs.indexOf(slugged) is -1
    @slug = slugged

    next()
