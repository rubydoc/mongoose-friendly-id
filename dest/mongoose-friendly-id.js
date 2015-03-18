var ObjectId, slug;

slug = require('speakingurl-add-korean');

ObjectId = require('mongoose').Types.ObjectId;

module.exports = function(schema, properties) {
  schema.add({
    slug: {
      type: 'String',
      unique: true
    }
  });
  schema.add({
    slugs: [String]
  });
  schema.statics.findByFriendlyId = function(id, fields, options, callback) {
    var query;
    query = {
      $or: [
        {
          slugs: id
        }
      ]
    };
    if (id && id.toString().match(/^[0-9a-fA-F]{24}$/)) {
      query.$or.push({
        _id: id
      });
    }
    return this.findOne(query, fields, options, callback);
  };
  return schema.pre('save', function(next) {
    var prop, props, slugged;
    slugged = null;
    if (typeof properties === "string") {
      slugged = slug(this[properties]);
    }
    if (typeof properties === "function") {
      slugged = slug(properties(this));
    }
    if (Array.isArray(properties)) {
      props = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = properties.length; i < len; i++) {
          prop = properties[i];
          results.push(this[prop]);
        }
        return results;
      }).call(this);
      slugged = slug(props.join(" "));
    }
    if (!slugged) {
      if (this.slug) {
        return next();
      } else {
        slugged = this.id;
      }
    }
    return this.collection.findOne({
      _id: {
        $ne: new ObjectId(this.id)
      },
      slugs: slugged
    }, function(err, data) {
      if (data) {
        slugged = this.id;
      }
      if (this.slugs && this.slugs.indexOf(slugged) === -1) {
        this.slugs.push(slugged);
      }
      this.slug = slugged;
      return next();
    });
  });
};
