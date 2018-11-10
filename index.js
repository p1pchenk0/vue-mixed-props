"use strict";

exports.__esModule = true;
exports.default = {
  install: function install(Vue) {
    function camelize(str) {
      return str.replace(/-(\w)/g, function (_, c) {
        return c ? c.toUpperCase() : "";
      });
    }

    function hasPropsAsArray(options) {
      return options && options.props && Array.isArray(options.props);
    }

    function hasObjectPropsWithStrings(options) {
      return options && options.props && options.props.toString() === '[object Object]' && '$strings' in options.props
    }

    function normalizeProps(options) {
      var i = options.props.length,
        res = {},
        val = void 0,
        name = void 0;

      while (i--) {
        val = options.props[i];

        if (typeof val === "string") {
          name = camelize(val);
          res[name] = {
            type: null
          };
        } else if (val.toString() === "[object Object]") {
          for (var key in val) {
            var objVal = val[key];
            name = camelize(key);
            res[name] =
              objVal.toString() === "[object Object]" ?
                objVal : {
                  type: objVal
                };
          }
        }
      }

      options.props = res;
    }

    function normalizePropsObject(options) {
      var res = {},
        props = options.props
        val = void 0,
        name = void 0;

      for (var key in props) {
        if (key === '$strings') {
          var i = props.$strings.length;

          while (i--) {
            val = props.$strings[i];
            name = camelize(val);
            res[name] = { type: null };
          }
        } else {
          var objVal = props[key];
          name = camelize(key);
          res[name] =
            objVal.toString() === "[object Object]" ?
              objVal : {
                type: objVal
              };
        }
      }

      options.props = res
    }

    var originalComponentFn = Vue.component;
    var originalInit = Vue.prototype._init;
    var originalExtendFn = Vue.extend;

    Vue.extend = function (extendOptions) {
      if (hasPropsAsArray(extendOptions)) {
        normalizeProps(extendOptions);
      } else if (hasObjectPropsWithStrings(extendOptions)) {
        normalizePropsObject(extendOptions)
      }

      return originalExtendFn.call(Vue, extendOptions);
    };

    Vue.prototype._init = function (options) {
      if (options && options.components) {
        for (var component in options.components) {
          if (hasPropsAsArray(options.components[component])) {
            normalizeProps(options.components[component]);
          } else if (hasObjectPropsWithStrings(options.components[component])) {
            normalizePropsObject(options.components[component])
          }
        }
      }

      originalInit.call(this, options);
    };

    Vue.component = function (id, options) {
      if (hasPropsAsArray(options)) {
        normalizeProps(options);
      } else if (hasObjectPropsWithStrings(options)) {
        normalizePropsObject(options)
      }

      originalComponentFn.call(Vue, id, options);
    };
  }
};