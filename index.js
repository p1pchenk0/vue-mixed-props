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
      return options && options.props && options.props.toString() === '[object Object]' && '$strings' in options.props;
    }

    function normalizeObjectProp(key, val, res) {
      var objVal = val[key];
      res[camelize(key)] = objVal.toString() === "[object Object]" ? objVal : { type: objVal };
    }

    function normalizeStringProp(val, res) {
      res[camelize(val)] = { type: null };
    }

    function normalizeProps(options) {
      var i = options.props.length,
        res = {},
        val = void 0;

      while (i--) {
        val = options.props[i];

        if (typeof val === "string") {
          normalizeStringProp(val, res)
        } else if (val.toString() === "[object Object]") {
          for (var key in val) {
            normalizeObjectProp(key, val, res);
          }
        }
      }

      options.props = res;
    }

    function normalizePropsObject(options) {
      var res = {},
        props = options.props;

      for (var key in props) {
        if (key === '$strings') {
          var i = props.$strings.length;

          while (i--) {
            normalizeStringProp(props.$strings[i], res)
          }
        } else {
          normalizeObjectProp(key, props, res);
        }
      }

      options.props = res;
    }

    function checkIfNormalizationIsNeeded(options) {
      if (hasPropsAsArray(options)) {
        normalizeProps(options);
      } else if (hasObjectPropsWithStrings(options)) {
        normalizePropsObject(options);
      }
    }

    var originalComponentFn = Vue.component;
    var originalInit = Vue.prototype._init;
    var originalExtendFn = Vue.extend;

    Vue.extend = function (extendOptions) {
      checkIfNormalizationIsNeeded(extendOptions);

      return originalExtendFn.call(Vue, extendOptions);
    };

    Vue.prototype._init = function (options) {
      if (options && options.components) {
        for (var component in options.components) {
          checkIfNormalizationIsNeeded(options.components[component])
        }
      }

      originalInit.call(this, options);
    };

    Vue.component = function (id, options) {
      checkIfNormalizationIsNeeded(options)

      originalComponentFn.call(Vue, id, options);
    };
  }
};