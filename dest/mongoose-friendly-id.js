var ObjectId, slug, __iced_k, __iced_k_noop;

__iced_k = __iced_k_noop = function() {};

slug = require('speakingurl-add-korean');

ObjectId = require('mongoose').Types.ObjectId;

module.exports = function(schema, properties) {
  schema.add({
    slug: {
      type: 'String'
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
    var data, err, prop, props, slugged, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    slugged = null;
    if (typeof properties === "string") {
      slugged = slug(this[properties]);
    }
    if (typeof properties === "function") {
      slugged = slug(properties(this));
    }
    if (Array.isArray(properties)) {
      props = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = properties.length; _i < _len; _i++) {
          prop = properties[_i];
          _results.push(this[prop]);
        }
        return _results;
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
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/Users/victor/projects/custom_npm/mongoose-friendly-id/src/mongoose-friendly-id.coffee"
        });
        _this.collection.findOne({
          _id: {
            $ne: new ObjectId(_this.id)
          },
          slugs: slugged
        }, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              return data = arguments[1];
            };
          })(),
          lineno: 45
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        if (data) {
          slugged = _this.id;
        }
        if (!_this.slugs) {
          _this.slugs = [];
        }
        if (_this.slugs && _this.slugs.indexOf(slugged) === -1) {
          _this.slugs.push(slugged);
        }
        _this.slug = slugged;
        return next();
      };
    })(this));
  });
};
