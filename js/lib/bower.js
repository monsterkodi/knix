/**
 * @preserve
 * Prototype JavaScript framework, version 1.7.1
 *  (c) 2005-2010 Sam Stephenson
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
 *--------------------------------------------------------------------------*/
/*
 * Prototype JavaScript framework, version 1.7.1
 *  (c) 2005-2010 Sam Stephenson
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
 *--------------------------------------------------------------------------*/
var Prototype = {
  Version: '1.7.1',
  Browser: (function(){
    var ua = navigator.userAgent;
    // Opera (at least) 8.x+ has "Opera" as a [[Class]] of `window.opera`
    // This is a safer inference than plain boolean type conversion of `window.opera`
    var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
    return {
      IE:             !!window.attachEvent && !isOpera,
      Opera:          isOpera,
      WebKit:         ua.indexOf('AppleWebKit/') > -1,
      Gecko:          ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1,
      MobileSafari:   /Apple.*Mobile/.test(ua)
    }
  })(),
  BrowserFeatures: {
    XPath: !!document.evaluate,
    SelectorsAPI: !!document.querySelector,
    ElementExtensions: (function() {
      var constructor = window.Element || window.HTMLElement;
      return !!(constructor && constructor.prototype);
    })(),
    SpecificElementExtensions: (function() {
      // First, try the named class
      if (typeof window.HTMLDivElement !== 'undefined')
        return true;
      var div = document.createElement('div'),
          form = document.createElement('form'),
          isSupported = false;
      if (div['__proto__'] && (div['__proto__'] !== form['__proto__'])) {
        isSupported = true;
      }
      div = form = null;
      return isSupported;
    })()
  },
  ScriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script\\s*>',
  JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
  emptyFunction: function() { },
  K: function(x) { return x }
};
if (Prototype.Browser.MobileSafari)
  Prototype.BrowserFeatures.SpecificElementExtensions = false;
/* Based on Alex Arnell's inheritance implementation. */
var Class = (function() {
  
  // Some versions of JScript fail to enumerate over properties, names of which 
  // correspond to non-enumerable properties in the prototype chain
  var IS_DONTENUM_BUGGY = (function(){
    for (var p in { toString: 1 }) {
      // check actual property name, so that it works with augmented Object.prototype
      if (p === 'toString') return false;
    }
    return true;
  })();
  
  function subclass() {};
  function create() {
    var parent = null, properties = $A(arguments);
    if (Object.isFunction(properties[0]))
      parent = properties.shift();
    function klass() {
      this.initialize.apply(this, arguments);
    }
    Object.extend(klass, Class.Methods);
    klass.superclass = parent;
    klass.subclasses = [];
    if (parent) {
      subclass.prototype = parent.prototype;
      klass.prototype = new subclass;
      parent.subclasses.push(klass);
    }
    for (var i = 0, length = properties.length; i < length; i++)
      klass.addMethods(properties[i]);
    if (!klass.prototype.initialize)
      klass.prototype.initialize = Prototype.emptyFunction;
    klass.prototype.constructor = klass;
    return klass;
  }
  function addMethods(source) {
    var ancestor   = this.superclass && this.superclass.prototype,
        properties = Object.keys(source);
    // IE6 doesn't enumerate `toString` and `valueOf` (among other built-in `Object.prototype`) properties,
    // Force copy if they're not Object.prototype ones.
    // Do not copy other Object.prototype.* for performance reasons
    if (IS_DONTENUM_BUGGY) {
      if (source.toString != Object.prototype.toString)
        properties.push("toString");
      if (source.valueOf != Object.prototype.valueOf)
        properties.push("valueOf");
    }
    for (var i = 0, length = properties.length; i < length; i++) {
      var property = properties[i], value = source[property];
      if (ancestor && Object.isFunction(value) &&
          value.argumentNames()[0] == "$super") {
        var method = value;
        value = (function(m) {
          return function() { return ancestor[m].apply(this, arguments); };
        })(property).wrap(method);
        
        // We used to use `bind` to ensure that `toString` and `valueOf`
        // methods were called in the proper context, but now that we're 
        // relying on native bind and/or an existing polyfill, we can't rely
        // on the nuanced behavior of whatever `bind` implementation is on
        // the page.
        //
        // MDC's polyfill, for instance, doesn't like binding functions that
        // haven't got a `prototype` property defined.
        value.valueOf = (function(method) {
          return function() { return method.valueOf.call(method); };
        })(method);
        
        value.toString = (function(method) {
          return function() { return method.toString.call(method); };
        })(method);
      }
      this.prototype[property] = value;
    }
    return this;
  }
  return {
    create: create,
    Methods: {
      addMethods: addMethods
    }
  };
})();
(function() {
  var _toString = Object.prototype.toString,
      _hasOwnProperty = Object.prototype.hasOwnProperty,
      NULL_TYPE = 'Null',
      UNDEFINED_TYPE = 'Undefined',
      BOOLEAN_TYPE = 'Boolean',
      NUMBER_TYPE = 'Number',
      STRING_TYPE = 'String',
      OBJECT_TYPE = 'Object',
      FUNCTION_CLASS = '[object Function]',
      BOOLEAN_CLASS = '[object Boolean]',
      NUMBER_CLASS = '[object Number]',
      STRING_CLASS = '[object String]',
      ARRAY_CLASS = '[object Array]',
      DATE_CLASS = '[object Date]',
      NATIVE_JSON_STRINGIFY_SUPPORT = window.JSON &&
        typeof JSON.stringify === 'function' &&
        JSON.stringify(0) === '0' &&
        typeof JSON.stringify(Prototype.K) === 'undefined';
        
  
  
  var DONT_ENUMS = ['toString', 'toLocaleString', 'valueOf',
   'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
  
  // Some versions of JScript fail to enumerate over properties, names of which 
  // correspond to non-enumerable properties in the prototype chain
  var IS_DONTENUM_BUGGY = (function(){
    for (var p in { toString: 1 }) {
      // check actual property name, so that it works with augmented Object.prototype
      if (p === 'toString') return false;
    }
    return true;
  })();
        
  function Type(o) {
    switch(o) {
      case null: return NULL_TYPE;
      case (void 0): return UNDEFINED_TYPE;
    }
    var type = typeof o;
    switch(type) {
      case 'boolean': return BOOLEAN_TYPE;
      case 'number':  return NUMBER_TYPE;
      case 'string':  return STRING_TYPE;
    }
    return OBJECT_TYPE;
  }
  
  function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
  }
  function inspect(object) {
    try {
      if (isUndefined(object)) return 'undefined';
      if (object === null) return 'null';
      return object.inspect ? object.inspect() : String(object);
    } catch (e) {
      if (e instanceof RangeError) return '...';
      throw e;
    }
  }
  function toJSON(value) {
    return Str('', { '': value }, []);
  }
  function Str(key, holder, stack) {
    var value = holder[key];
    if (Type(value) === OBJECT_TYPE && typeof value.toJSON === 'function') {
      value = value.toJSON(key);
    }
    var _class = _toString.call(value);
    switch (_class) {
      case NUMBER_CLASS:
      case BOOLEAN_CLASS:
      case STRING_CLASS:
        value = value.valueOf();
    }
    switch (value) {
      case null: return 'null';
      case true: return 'true';
      case false: return 'false';
    }
    var type = typeof value;
    switch (type) {
      case 'string':
        return value.inspect(true);
      case 'number':
        return isFinite(value) ? String(value) : 'null';
      case 'object':
        for (var i = 0, length = stack.length; i < length; i++) {
          if (stack[i] === value) {
            throw new TypeError("Cyclic reference to '" + value + "' in object");
          }
        }
        stack.push(value);
        var partial = [];
        if (_class === ARRAY_CLASS) {
          for (var i = 0, length = value.length; i < length; i++) {
            var str = Str(i, value, stack);
            partial.push(typeof str === 'undefined' ? 'null' : str);
          }
          partial = '[' + partial.join(',') + ']';
        } else {
          var keys = Object.keys(value);
          for (var i = 0, length = keys.length; i < length; i++) {
            var key = keys[i], str = Str(key, value, stack);
            if (typeof str !== "undefined") {
               partial.push(key.inspect(true)+ ':' + str);
             }
          }
          partial = '{' + partial.join(',') + '}';
        }
        stack.pop();
        return partial;
    }
  }
  function stringify(object) {
    return JSON.stringify(object);
  }
  function toQueryString(object) {
    return $H(object).toQueryString();
  }
  function toHTML(object) {
    return object && object.toHTML ? object.toHTML() : String.interpret(object);
  }
  function keys(object) {
    if (Type(object) !== OBJECT_TYPE) { throw new TypeError(); }
    var results = [];
    for (var property in object) {
      if (_hasOwnProperty.call(object, property))
        results.push(property);
    }
    
    // Account for the DontEnum properties in affected browsers.
    if (IS_DONTENUM_BUGGY) {
      for (var i = 0; property = DONT_ENUMS[i]; i++) {
        if (_hasOwnProperty.call(object, property))
          results.push(property);
      }
    }
    
    return results;
  }
  function values(object) {
    var results = [];
    for (var property in object)
      results.push(object[property]);
    return results;
  }
  function clone(object) {
    return extend({ }, object);
  }
  function isElement(object) {
    return !!(object && object.nodeType == 1);
  }
  function isArray(object) {
    return _toString.call(object) === ARRAY_CLASS;
  }
  
  var hasNativeIsArray = (typeof Array.isArray == 'function') 
    && Array.isArray([]) && !Array.isArray({});
  
  if (hasNativeIsArray) {
    isArray = Array.isArray;
  }
  function isHash(object) {
    return object instanceof Hash;
  }
  function isFunction(object) {
    return _toString.call(object) === FUNCTION_CLASS;
  }
  function isString(object) {
    return _toString.call(object) === STRING_CLASS;
  }
  function isNumber(object) {
    return _toString.call(object) === NUMBER_CLASS;
  }
  
  function isDate(object) {
    return _toString.call(object) === DATE_CLASS;
  }
  function isUndefined(object) {
    return typeof object === "undefined";
  }
  extend(Object, {
    extend:        extend,
    inspect:       inspect,
    toJSON:        NATIVE_JSON_STRINGIFY_SUPPORT ? stringify : toJSON,
    toQueryString: toQueryString,
    toHTML:        toHTML,
    keys:          Object.keys || keys,
    values:        values,
    clone:         clone,
    isElement:     isElement,
    isArray:       isArray,
    isHash:        isHash,
    isFunction:    isFunction,
    isString:      isString,
    isNumber:      isNumber,
    isDate:        isDate,
    isUndefined:   isUndefined
  });
})();
Object.extend(Function.prototype, (function() {
  var slice = Array.prototype.slice;
  function update(array, args) {
    var arrayLength = array.length, length = args.length;
    while (length--) array[arrayLength + length] = args[length];
    return array;
  }
  function merge(array, args) {
    array = slice.call(array, 0);
    return update(array, args);
  }
  function argumentNames() {
    var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
      .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
      .replace(/\s+/g, '').split(',');
    return names.length == 1 && !names[0] ? [] : names;
  }
  function bind(context) {
    if (arguments.length < 2 && Object.isUndefined(arguments[0]))
      return this;
    if (!Object.isFunction(this))
      throw new TypeError("The object is not callable.");
      
    var nop = function() {};
    var __method = this, args = slice.call(arguments, 1);
    
    var bound = function() {
      var a = merge(args, arguments);
      // Ignore the supplied context when the bound function is called with
      // the "new" keyword.
      var c = this instanceof bound ? this : context;
      return __method.apply(c, a);
    };
        
    nop.prototype   = this.prototype;
    bound.prototype = new nop();
    return bound;
  }
  function bindAsEventListener(context) {
    var __method = this, args = slice.call(arguments, 1);
    return function(event) {
      var a = update([event || window.event], args);
      return __method.apply(context, a);
    }
  }
  function curry() {
    if (!arguments.length) return this;
    var __method = this, args = slice.call(arguments, 0);
    return function() {
      var a = merge(args, arguments);
      return __method.apply(this, a);
    }
  }
  function delay(timeout) {
    var __method = this, args = slice.call(arguments, 1);
    timeout = timeout * 1000;
    return window.setTimeout(function() {
      return __method.apply(__method, args);
    }, timeout);
  }
  function defer() {
    var args = update([0.01], arguments);
    return this.delay.apply(this, args);
  }
  function wrap(wrapper) {
    var __method = this;
    return function() {
      var a = update([__method.bind(this)], arguments);
      return wrapper.apply(this, a);
    }
  }
  function methodize() {
    if (this._methodized) return this._methodized;
    var __method = this;
    return this._methodized = function() {
      var a = update([this], arguments);
      return __method.apply(null, a);
    };
  }
  
  var extensions = {
    argumentNames:       argumentNames,
    bindAsEventListener: bindAsEventListener,
    curry:               curry,
    delay:               delay,
    defer:               defer,
    wrap:                wrap,
    methodize:           methodize
  };
  
  if (!Function.prototype.bind)
    extensions.bind = bind;
  return extensions;
})());
(function(proto) {
  
  
  function toISOString() {
    return this.getUTCFullYear() + '-' +
      (this.getUTCMonth() + 1).toPaddedString(2) + '-' +
      this.getUTCDate().toPaddedString(2) + 'T' +
      this.getUTCHours().toPaddedString(2) + ':' +
      this.getUTCMinutes().toPaddedString(2) + ':' +
      this.getUTCSeconds().toPaddedString(2) + 'Z';
  }
  
  function toJSON() {
    return this.toISOString();
  }
  
  if (!proto.toISOString) proto.toISOString = toISOString;
  if (!proto.toJSON) proto.toJSON = toJSON;
  
})(Date.prototype);
RegExp.prototype.match = RegExp.prototype.test;
RegExp.escape = function(str) {
  return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};
var PeriodicalExecuter = Class.create({
  initialize: function(callback, frequency) {
    this.callback = callback;
    this.frequency = frequency;
    this.currentlyExecuting = false;
    this.registerCallback();
  },
  registerCallback: function() {
    this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
  },
  execute: function() {
    this.callback(this);
  },
  stop: function() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  },
  onTimerEvent: function() {
    if (!this.currentlyExecuting) {
      // IE doesn't support `finally` statements unless all errors are caught.
      // We mimic the behaviour of `finally` statements by duplicating code
      // that would belong in it. First at the bottom of the `try` statement
      // (for errorless cases). Secondly, inside a `catch` statement which
      // rethrows any caught errors.
      try {
        this.currentlyExecuting = true;
        this.execute();
        this.currentlyExecuting = false;
      } catch(e) {
        this.currentlyExecuting = false;
        throw e;
      }
    }
  }
});
Object.extend(String, {
  interpret: function(value) {
    return value == null ? '' : String(value);
  },
  specialChar: {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '\\': '\\\\'
  }
});
Object.extend(String.prototype, (function() {
  var NATIVE_JSON_PARSE_SUPPORT = window.JSON &&
    typeof JSON.parse === 'function' &&
    JSON.parse('{"test": true}').test;
  function prepareReplacement(replacement) {
    if (Object.isFunction(replacement)) return replacement;
    var template = new Template(replacement);
    return function(match) { return template.evaluate(match) };
  }
  function gsub(pattern, replacement) {
    var result = '', source = this, match;
    replacement = prepareReplacement(replacement);
    if (Object.isString(pattern))
      pattern = RegExp.escape(pattern);
    if (!(pattern.length || pattern.source)) {
      replacement = replacement('');
      return replacement + source.split('').join(replacement) + replacement;
    }
    while (source.length > 0) {
      match = source.match(pattern);
      if (match && match[0].length > 0) {
        result += source.slice(0, match.index);
        result += String.interpret(replacement(match));
        source  = source.slice(match.index + match[0].length);
      } else {
        result += source, source = '';
      }
    }
    return result;
  }
  function sub(pattern, replacement, count) {
    replacement = prepareReplacement(replacement);
    count = Object.isUndefined(count) ? 1 : count;
    return this.gsub(pattern, function(match) {
      if (--count < 0) return match[0];
      return replacement(match);
    });
  }
  function scan(pattern, iterator) {
    this.gsub(pattern, iterator);
    return String(this);
  }
  function truncate(length, truncation) {
    length = length || 30;
    truncation = Object.isUndefined(truncation) ? '...' : truncation;
    return this.length > length ?
      this.slice(0, length - truncation.length) + truncation : String(this);
  }
  function strip() {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
  }
  function stripTags() {
    return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
  }
  function stripScripts() {
    return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
  }
  function extractScripts() {
    var matchAll = new RegExp(Prototype.ScriptFragment, 'img'),
        matchOne = new RegExp(Prototype.ScriptFragment, 'im');
    return (this.match(matchAll) || []).map(function(scriptTag) {
      return (scriptTag.match(matchOne) || ['', ''])[1];
    });
  }
  function evalScripts() {
    return this.extractScripts().map(function(script) { return eval(script); });
  }
  function escapeHTML() {
    return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function unescapeHTML() {
    // Warning: In 1.7 String#unescapeHTML will no longer call String#stripTags.
    return this.stripTags().replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
  }
  function toQueryParams(separator) {
    var match = this.strip().match(/([^?#]*)(#.*)?$/);
    if (!match) return { };
    return match[1].split(separator || '&').inject({ }, function(hash, pair) {
      if ((pair = pair.split('='))[0]) {
        var key = decodeURIComponent(pair.shift()),
            value = pair.length > 1 ? pair.join('=') : pair[0];
        if (value != undefined) {
          value = value.gsub('+', ' ');
          value = decodeURIComponent(value);
        }
        if (key in hash) {
          if (!Object.isArray(hash[key])) hash[key] = [hash[key]];
          hash[key].push(value);
        }
        else hash[key] = value;
      }
      return hash;
    });
  }
  function toArray() {
    return this.split('');
  }
  function succ() {
    return this.slice(0, this.length - 1) +
      String.fromCharCode(this.charCodeAt(this.length - 1) + 1);
  }
  function times(count) {
    return count < 1 ? '' : new Array(count + 1).join(this);
  }
  function camelize() {
    return this.replace(/-+(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
  }
  function capitalize() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
  }
  function underscore() {
    return this.replace(/::/g, '/')
               .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
               .replace(/([a-z\d])([A-Z])/g, '$1_$2')
               .replace(/-/g, '_')
               .toLowerCase();
  }
  function dasherize() {
    return this.replace(/_/g, '-');
  }
  function inspect(useDoubleQuotes) {
    var escapedString = this.replace(/[\x00-\x1f\\]/g, function(character) {
      if (character in String.specialChar) {
        return String.specialChar[character];
      }
      return '\\u00' + character.charCodeAt().toPaddedString(2, 16);
    });
    if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
    return "'" + escapedString.replace(/'/g, '\\\'') + "'";
  }
  function unfilterJSON(filter) {
    return this.replace(filter || Prototype.JSONFilter, '$1');
  }
  function isJSON() {
    var str = this;
    if (str.blank()) return false;
    str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
    str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
    str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
    return (/^[\],:{}\s]*$/).test(str);
  }
  function evalJSON(sanitize) {
    var json = this.unfilterJSON(),
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    if (cx.test(json)) {
      json = json.replace(cx, function (a) {
        return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
      });
    }
    try {
      if (!sanitize || json.isJSON()) return eval('(' + json + ')');
    } catch (e) { }
    throw new SyntaxError('Badly formed JSON string: ' + this.inspect());
  }
  
  function parseJSON() {
    var json = this.unfilterJSON();
    return JSON.parse(json);
  }
  function include(pattern) {
    return this.indexOf(pattern) !== -1;
  }
  function startsWith(pattern, position) {
    position = Object.isNumber(position) ? position : 0;
    // We use `lastIndexOf` instead of `indexOf` to avoid tying execution
    // time to string length when string doesn't start with pattern.
    return this.lastIndexOf(pattern, position) === position;
  }
  function endsWith(pattern, position) {
    pattern = String(pattern);
    position = Object.isNumber(position) ? position : this.length;
    if (position < 0) position = 0;
    if (position > this.length) position = this.length;
    var d = position - pattern.length;
    // We use `indexOf` instead of `lastIndexOf` to avoid tying execution
    // time to string length when string doesn't end with pattern.
    return d >= 0 && this.indexOf(pattern, d) === d;
  }
  function empty() {
    return this == '';
  }
  function blank() {
    return /^\s*$/.test(this);
  }
  function interpolate(object, pattern) {
    return new Template(this, pattern).evaluate(object);
  }
  return {
    gsub:           gsub,
    sub:            sub,
    scan:           scan,
    truncate:       truncate,
    // Firefox 3.5+ supports String.prototype.trim
    // (`trim` is ~ 5x faster than `strip` in FF3.5)
    strip:          String.prototype.trim || strip,
    stripTags:      stripTags,
    stripScripts:   stripScripts,
    extractScripts: extractScripts,
    evalScripts:    evalScripts,
    escapeHTML:     escapeHTML,
    unescapeHTML:   unescapeHTML,
    toQueryParams:  toQueryParams,
    parseQuery:     toQueryParams,
    toArray:        toArray,
    succ:           succ,
    times:          times,
    camelize:       camelize,
    capitalize:     capitalize,
    underscore:     underscore,
    dasherize:      dasherize,
    inspect:        inspect,
    unfilterJSON:   unfilterJSON,
    isJSON:         isJSON,
    evalJSON:       NATIVE_JSON_PARSE_SUPPORT ? parseJSON : evalJSON,
    //ECMA 6 supports contains(), if it exists map include() to contains()
    include:        String.prototype.contains || include,
    // Firefox 18+ supports String.prototype.startsWith, String.prototype.endsWith
    startsWith:     String.prototype.startsWith || startsWith,
    endsWith:       String.prototype.endsWith || endsWith,
    empty:          empty,
    blank:          blank,
    interpolate:    interpolate
  };
})());
var Template = Class.create({
  initialize: function(template, pattern) {
    this.template = template.toString();
    this.pattern = pattern || Template.Pattern;
  },
  evaluate: function(object) {
    if (object && Object.isFunction(object.toTemplateReplacements))
      object = object.toTemplateReplacements();
    return this.template.gsub(this.pattern, function(match) {
      if (object == null) return (match[1] + '');
      var before = match[1] || '';
      if (before == '\\') return match[2];
      var ctx = object, expr = match[3],
          pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
          
      match = pattern.exec(expr);
      if (match == null) return before;
      while (match != null) {
        var comp = match[1].startsWith('[') ? match[2].replace(/\\\\]/g, ']') : match[1];
        ctx = ctx[comp];
        if (null == ctx || '' == match[3]) break;
        expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
        match = pattern.exec(expr);
      }
      return before + String.interpret(ctx);
    });
  }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;
var $break = { };
var Enumerable = (function() {
  function each(iterator, context) {
    try {
      this._each(iterator, context);
    } catch (e) {
      if (e != $break) throw e;
    }
    return this;
  }
  function eachSlice(number, iterator, context) {
    var index = -number, slices = [], array = this.toArray();
    if (number < 1) return array;
    while ((index += number) < array.length)
      slices.push(array.slice(index, index+number));
    return slices.collect(iterator, context);
  }
  function all(iterator, context) {
    iterator = iterator || Prototype.K;
    var result = true;
    this.each(function(value, index) {
      if (!iterator.call(context, value, index, this)) {
          result = false;
          throw $break;
      }
    }, this);
    return result;
  }
  function any(iterator, context) {
    iterator = iterator || Prototype.K;
    var result = false;
    this.each(function(value, index) {
      if (result = !!iterator.call(context, value, index, this))
        throw $break;
    }, this);
    return result;
  }
  function collect(iterator, context) {
    iterator = iterator || Prototype.K;
    var results = [];
    this.each(function(value, index) {
      results.push(iterator.call(context, value, index, this));
    }, this);
    return results;
  }
  function detect(iterator, context) {
    var result;
    this.each(function(value, index) {
      if (iterator.call(context, value, index, this)) {
        result = value;
        throw $break;
      }
    }, this);
    return result;
  }
  function findAll(iterator, context) {
    var results = [];
    this.each(function(value, index) {
      if (iterator.call(context, value, index, this))
        results.push(value);
    }, this);
    return results;
  }
  function grep(filter, iterator, context) {
    iterator = iterator || Prototype.K;
    var results = [];
    if (Object.isString(filter))
      filter = new RegExp(RegExp.escape(filter));
    this.each(function(value, index) {
      if (filter.match(value))
        results.push(iterator.call(context, value, index, this));
    }, this);
    return results;
  }
  function include(object) {
    if (Object.isFunction(this.indexOf) && this.indexOf(object) != -1)
      return true;
    var found = false;
    this.each(function(value) {
      if (value == object) {
        found = true;
        throw $break;
      }
    });
    return found;
  }
  function inGroupsOf(number, fillWith) {
    fillWith = Object.isUndefined(fillWith) ? null : fillWith;
    return this.eachSlice(number, function(slice) {
      while(slice.length < number) slice.push(fillWith);
      return slice;
    });
  }
  function inject(memo, iterator, context) {
    this.each(function(value, index) {
      memo = iterator.call(context, memo, value, index, this);
    }, this);
    return memo;
  }
  function invoke(method) {
    var args = $A(arguments).slice(1);
    return this.map(function(value) {
      return value[method].apply(value, args);
    });
  }
  function max(iterator, context) {
    iterator = iterator || Prototype.K;
    var result;
    this.each(function(value, index) {
      value = iterator.call(context, value, index, this);
      if (result == null || value >= result)
        result = value;
    }, this);
    return result;
  }
  function min(iterator, context) {
    iterator = iterator || Prototype.K;
    var result;
    this.each(function(value, index) {
      value = iterator.call(context, value, index, this);
      if (result == null || value < result)
        result = value;
    }, this);
    return result;
  }
  function partition(iterator, context) {
    iterator = iterator || Prototype.K;
    var trues = [], falses = [];
    this.each(function(value, index) {
      (iterator.call(context, value, index, this) ?
        trues : falses).push(value);
    }, this);
    return [trues, falses];
  }
  function pluck(property) {
    var results = [];
    this.each(function(value) {
      results.push(value[property]);
    });
    return results;
  }
  function reject(iterator, context) {
    var results = [];
    this.each(function(value, index) {
      if (!iterator.call(context, value, index, this))
        results.push(value);
    }, this);
    return results;
  }
  function sortBy(iterator, context) {
    return this.map(function(value, index) {
      return {
        value: value,
        criteria: iterator.call(context, value, index, this)
      };
    }, this).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }).pluck('value');
  }
  function toArray() {
    return this.map();
  }
  function zip() {
    var iterator = Prototype.K, args = $A(arguments);
    if (Object.isFunction(args.last()))
      iterator = args.pop();
    var collections = [this].concat(args).map($A);
    return this.map(function(value, index) {
      return iterator(collections.pluck(index));
    });
  }
  function size() {
    return this.toArray().length;
  }
  function inspect() {
    return '#<Enumerable:' + this.toArray().inspect() + '>';
  }
  return {
    each:       each,
    eachSlice:  eachSlice,
    all:        all,
    every:      all,
    any:        any,
    some:       any,
    collect:    collect,
    map:        collect,
    detect:     detect,
    findAll:    findAll,
    select:     findAll,
    filter:     findAll,
    grep:       grep,
    include:    include,
    member:     include,
    inGroupsOf: inGroupsOf,
    inject:     inject,
    invoke:     invoke,
    max:        max,
    min:        min,
    partition:  partition,
    pluck:      pluck,
    reject:     reject,
    sortBy:     sortBy,
    toArray:    toArray,
    entries:    toArray,
    zip:        zip,
    size:       size,
    inspect:    inspect,
    find:       detect
  };
})();
function $A(iterable) {
  if (!iterable) return [];
  // Safari <2.0.4 crashes when accessing property of a node list with property accessor.
  // It nevertheless works fine with `in` operator, which is why we use it here
  if ('toArray' in Object(iterable)) return iterable.toArray();
  var length = iterable.length || 0, results = new Array(length);
  while (length--) results[length] = iterable[length];
  return results;
}
function $w(string) {
  if (!Object.isString(string)) return [];
  string = string.strip();
  return string ? string.split(/\s+/) : [];
}
Array.from = $A;
(function() {
  var arrayProto = Array.prototype,
      slice = arrayProto.slice,
      _each = arrayProto.forEach,
      _entries = arrayProto.entries; // use native browser JS 1.6 implementation if available
  function each(iterator, context) {
    for (var i = 0, length = this.length >>> 0; i < length; i++) {
      if (i in this) iterator.call(context, this[i], i, this);
    }
  }
  if (!_each) _each = each;
  
  function clear() {
    this.length = 0;
    return this;
  }
  function first() {
    return this[0];
  }
  function last() {
    return this[this.length - 1];
  }
  function compact() {
    return this.select(function(value) {
      return value != null;
    });
  }
  function flatten() {
    return this.inject([], function(array, value) {
      if (Object.isArray(value))
        return array.concat(value.flatten());
      array.push(value);
      return array;
    });
  }
  function without() {
    var values = slice.call(arguments, 0);
    return this.select(function(value) {
      return !values.include(value);
    });
  }
  function reverse(inline) {
    return (inline === false ? this.toArray() : this)._reverse();
  }
  function uniq(sorted) {
    return this.inject([], function(array, value, index) {
      if (0 == index || (sorted ? array.last() != value : !array.include(value)))
        array.push(value);
      return array;
    });
  }
  function intersect(array) {
    return this.uniq().findAll(function(item) {
      return array.indexOf(item) !== -1;
    });
  }
  function clone() {
    return slice.call(this, 0);
  }
  function size() {
    return this.length;
  }
  function inspect() {
    return '[' + this.map(Object.inspect).join(', ') + ']';
  }
  function indexOf(item, i) {
    if (this == null) throw new TypeError();
    
    var array = Object(this), length = array.length >>> 0;
    if (length === 0) return -1;
    
    // The rules for the `fromIndex` argument are tricky. Let's follow the
    // spec line-by-line.
    i = Number(i);
    if (isNaN(i)) {
      i = 0;
    } else if (i !== 0 && isFinite(i)) {
      // Equivalent to ES5's `ToInteger` operation.
      i = (i > 0 ? 1 : -1) * Math.floor(Math.abs(i));
    }
    
    // If the search index is greater than the length of the array,
    // return -1.
    if (i > length) return -1;
    
    // If the search index is negative, take its absolute value, subtract it
    // from the length, and make that the new search index. If it's still
    // negative, make it 0.
    var k = i >= 0 ? i : Math.max(length - Math.abs(i), 0);
    for (; k < length; k++)
      if (k in array && array[k] === item) return k;
    return -1;
  }
  
  function lastIndexOf(item, i) {
    if (this == null) throw new TypeError();
    
    var array = Object(this), length = array.length >>> 0;
    if (length === 0) return -1;
    
    // The rules for the `fromIndex` argument are tricky. Let's follow the
    // spec line-by-line.
    if (!Object.isUndefined(i)) {
      i = Number(i);
      if (isNaN(i)) {
        i = 0;
      } else if (i !== 0 && isFinite(i)) {
        // Equivalent to ES5's `ToInteger` operation.
        i = (i > 0 ? 1 : -1) * Math.floor(Math.abs(i));
      }
    } else {
      i = length;
    }
    
    // If fromIndex is positive, clamp it to the last index in the array;
    // if it's negative, subtract its absolute value from the array's length.
    var k = i >= 0 ? Math.min(i, length - 1) :
     length - Math.abs(i);
    // (If fromIndex is still negative, it'll bypass this loop altogether and
    // return -1.)
    for (; k >= 0; k--)
      if (k in array && array[k] === item) return k;
    return -1;
  }
  // Replaces a built-in function. No PDoc needed.
  //
  // Used instead of the broken version of Array#concat in some versions of
  // Opera. Made to be ES5-compliant.
  function concat(_) {
    var array = [], items = slice.call(arguments, 0), item, n = 0;
    items.unshift(this);
    for (var i = 0, length = items.length; i < length; i++) {
      item = items[i];
      if (Object.isArray(item) && !('callee' in item)) {
        for (var j = 0, arrayLength = item.length; j < arrayLength; j++) {
          if (j in item) array[n] = item[j];
          n++;
        }
      } else {
        array[n++] = item;
      }
    }
    array.length = n;
    return array;
  }
  
  // Certain ES5 array methods have the same names as Prototype array methods
  // and perform the same functions.
  //
  // Prototype's implementations of these methods differ from the ES5 spec in
  // the way a missing iterator function is handled. Prototype uses 
  // `Prototype.K` as a default iterator, while ES5 specifies that a
  // `TypeError` must be thrown. Implementing the ES5 spec completely would 
  // break backward compatibility and would force users to pass `Prototype.K`
  // manually. 
  //
  // Instead, if native versions of these methods exist, we wrap the existing
  // methods with our own behavior. This has very little performance impact.
  // It violates the spec by suppressing `TypeError`s for certain methods,
  // but that's an acceptable trade-off.
  
  function wrapNative(method) {
    return function() {
      if (arguments.length === 0) {
        // No iterator was given. Instead of throwing a `TypeError`, use
        // `Prototype.K` as the default iterator.
        return method.call(this, Prototype.K);
      } else if (arguments[0] === undefined) {
        // Same as above.
        var args = slice.call(arguments, 1);
        args.unshift(Prototype.K);
        return method.apply(this, args);
      } else {
        // Pass straight through to the native method.
        return method.apply(this, arguments);
      }
    };
  }
  
  // Note that #map, #filter, #some, and #every take some extra steps for
  // ES5 compliance: the context in which they're called is coerced to an
  // object, and that object's `length` property is coerced to a finite
  // integer. This makes it easier to use the methods as generics.
  //
  // This means that they behave a little differently from other methods in
  // `Enumerable`/`Array` that don't collide with ES5, but that's OK.
  
  function map(iterator) {
    if (this == null) throw new TypeError();
    iterator = iterator || Prototype.K;
    var object = Object(this);
    var results = [], context = arguments[1], n = 0;
    for (var i = 0, length = object.length >>> 0; i < length; i++) {
      if (i in object) {
        results[n] = iterator.call(context, object[i], i, object);
      }
      n++;
    }
    results.length = n;
    return results;
  }
  
  if (arrayProto.map) {
    map = wrapNative(Array.prototype.map);
  }
  
  function filter(iterator) {
    if (this == null || !Object.isFunction(iterator))
      throw new TypeError();
    
    var object = Object(this);
    var results = [], context = arguments[1], value;
    for (var i = 0, length = object.length >>> 0; i < length; i++) {
      if (i in object) {
        value = object[i];
        if (iterator.call(context, value, i, object)) {
          results.push(value);
        }
      }
    }
    return results;
  }
  if (arrayProto.filter) {
    // `Array#filter` requires an iterator by nature, so we don't need to
    // wrap it.
    filter = Array.prototype.filter;
  }
  function some(iterator) {
    if (this == null) throw new TypeError();
    iterator = iterator || Prototype.K;
    var context = arguments[1];
    var object = Object(this);
    for (var i = 0, length = object.length >>> 0; i < length; i++) {
      if (i in object && iterator.call(context, object[i], i, object)) {
        return true;
      }
    }
      
    return false;
  }
  
  if (arrayProto.some) {
    var some = wrapNative(Array.prototype.some);
  }
  
  
  function every(iterator) {
    if (this == null) throw new TypeError();
    iterator = iterator || Prototype.K;
    var context = arguments[1];
    var object = Object(this);
    for (var i = 0, length = object.length >>> 0; i < length; i++) {
      if (i in object && !iterator.call(context, object[i], i, object)) {
        return false;
      }
    }
      
    return true;
  }
  
  if (arrayProto.every) {
    var every = wrapNative(Array.prototype.every);
  }
  
  function entries() {
    if (this == null) throw new TypeError();
    return this.map(function(i,index) {
        return [index,i];
    });
  }
  // Prototype's `Array#inject` behaves similarly to ES5's `Array#reduce`.
  var _reduce = arrayProto.reduce;
  function inject(memo, iterator) {
    iterator = iterator || Prototype.K;
    var context = arguments[2];
    // The iterator must be bound, as `Array#reduce` always binds to
    // `undefined`.
    return _reduce.call(this, iterator.bind(context), memo);
  }
  
  // Piggyback on `Array#reduce` if it exists; otherwise fall back to the
  // standard `Enumerable.inject`.
  if (!arrayProto.reduce) {
    var inject = Enumerable.inject;
  }
  Object.extend(arrayProto, Enumerable);
  if (!arrayProto._reverse)
    arrayProto._reverse = arrayProto.reverse;
  Object.extend(arrayProto, {
    _each:     _each,
    
    map:       map,
    collect:   map,
    select:    filter,
    filter:    filter,
    findAll:   filter,
    some:      some,
    any:       some,
    every:     every,
    all:       every,
    inject:    inject,
    
    clear:     clear,
    first:     first,
    last:      last,
    compact:   compact,
    flatten:   flatten,
    without:   without,
    reverse:   reverse,
    uniq:      uniq,
    intersect: intersect,
    clone:     clone,
    toArray:   clone,
    size:      size,
    inspect:   inspect,
    entries:   _entries || entries
  });
  // fix for opera
  var CONCAT_ARGUMENTS_BUGGY = (function() {
    return [].concat(arguments)[0][0] !== 1;
  })(1,2);
  if (CONCAT_ARGUMENTS_BUGGY) arrayProto.concat = concat;
  // Use native browser JS 1.6 implementations if available.
  if (!arrayProto.indexOf) arrayProto.indexOf = indexOf;
  if (!arrayProto.lastIndexOf) arrayProto.lastIndexOf = lastIndexOf;
})();
function $H(object) {
  return new Hash(object);
};
var Hash = Class.create(Enumerable, (function() {
  function initialize(object) {
    this._object = Object.isHash(object) ? object.toObject() : Object.clone(object);
  }
  // Docs for #each even though technically it's implemented by Enumerable
  // Our _internal_ each
  function _each(iterator, context) {
    var i = 0;
    for (var key in this._object) {
      var value = this._object[key], pair = [key, value];
      pair.key = key;
      pair.value = value;
      iterator.call(context, pair, i);
      i++;
    }
  }
  function set(key, value) {
    return this._object[key] = value;
  }
  function get(key) {
    // simulating poorly supported hasOwnProperty
    if (this._object[key] !== Object.prototype[key])
      return this._object[key];
  }
  function unset(key) {
    var value = this._object[key];
    delete this._object[key];
    return value;
  }
  function toObject() {
    return Object.clone(this._object);
  }
  
  
  function keys() {
    return this.pluck('key');
  }
  function values() {
    return this.pluck('value');
  }
  function index(value) {
    var match = this.detect(function(pair) {
      return pair.value === value;
    });
    return match && match.key;
  }
  function merge(object) {
    return this.clone().update(object);
  }
  function update(object) {
    return new Hash(object).inject(this, function(result, pair) {
      result.set(pair.key, pair.value);
      return result;
    });
  }
  // Private. No PDoc necessary.
  function toQueryPair(key, value) {
    if (Object.isUndefined(value)) return key;
    
    value = String.interpret(value);
    // Normalize newlines as \r\n because the HTML spec says newlines should
    // be encoded as CRLFs.
    value = value.gsub(/(\r)?\n/, '\r\n');
    value = encodeURIComponent(value);
    // Likewise, according to the spec, spaces should be '+' rather than
    // '%20'.
    value = value.gsub(/%20/, '+');
    return key + '=' + value;
  }
  function toQueryString() {
    return this.inject([], function(results, pair) {
      var key = encodeURIComponent(pair.key), values = pair.value;
      
      if (values && typeof values == 'object') {
        if (Object.isArray(values)) {
          // We used to use `Array#map` here to get the query pair for each
          // item in the array, but that caused test regressions once we
          // added the sparse array behavior for array iterator methods.
          // Changed to an ordinary `for` loop so that we can handle
          // `undefined` values ourselves rather than have them skipped.
          var queryValues = [];
          for (var i = 0, len = values.length, value; i < len; i++) {
            value = values[i];
            queryValues.push(toQueryPair(key, value));            
          }
          return results.concat(queryValues);
        }
      } else results.push(toQueryPair(key, values));
      return results;
    }).join('&');
  }
  function inspect() {
    return '#<Hash:{' + this.map(function(pair) {
      return pair.map(Object.inspect).join(': ');
    }).join(', ') + '}>';
  }
  function clone() {
    return new Hash(this);
  }
  return {
    initialize:             initialize,
    _each:                  _each,
    set:                    set,
    get:                    get,
    unset:                  unset,
    toObject:               toObject,
    toTemplateReplacements: toObject,
    keys:                   keys,
    values:                 values,
    index:                  index,
    merge:                  merge,
    update:                 update,
    toQueryString:          toQueryString,
    inspect:                inspect,
    toJSON:                 toObject,
    clone:                  clone
  };
})());
Hash.from = $H;
Object.extend(Number.prototype, (function() {
  function toColorPart() {
    return this.toPaddedString(2, 16);
  }
  function succ() {
    return this + 1;
  }
  function times(iterator, context) {
    $R(0, this, true).each(iterator, context);
    return this;
  }
  function toPaddedString(length, radix) {
    var string = this.toString(radix || 10);
    return '0'.times(length - string.length) + string;
  }
  function abs() {
    return Math.abs(this);
  }
  function round() {
    return Math.round(this);
  }
  function ceil() {
    return Math.ceil(this);
  }
  function floor() {
    return Math.floor(this);
  }
  return {
    toColorPart:    toColorPart,
    succ:           succ,
    times:          times,
    toPaddedString: toPaddedString,
    abs:            abs,
    round:          round,
    ceil:           ceil,
    floor:          floor
  };
})());
function $R(start, end, exclusive) {
  return new ObjectRange(start, end, exclusive);
}
var ObjectRange = Class.create(Enumerable, (function() {
  function initialize(start, end, exclusive) {
    this.start = start;
    this.end = end;
    this.exclusive = exclusive;
  }
  function _each(iterator, context) {
    var value = this.start, i;
    for (i = 0; this.include(value); i++) {
      iterator.call(context, value, i);
      value = value.succ();
    }
  }
  function include(value) {
    if (value < this.start)
      return false;
    if (this.exclusive)
      return value < this.end;
    return value <= this.end;
  }
  return {
    initialize: initialize,
    _each:      _each,
    include:    include
  };
})());
var Abstract = { };
var Try = {
  these: function() {
    var returnValue;
    for (var i = 0, length = arguments.length; i < length; i++) {
      var lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) { }
    }
    return returnValue;
  }
};
var Ajax = {
  getTransport: function() {
    return Try.these(
      function() {return new XMLHttpRequest()},
      function() {return new ActiveXObject('Msxml2.XMLHTTP')},
      function() {return new ActiveXObject('Microsoft.XMLHTTP')}
    ) || false;
  },
  activeRequestCount: 0
};
Ajax.Responders = {
  responders: [],
  _each: function(iterator, context) {
    this.responders._each(iterator, context);
  },
  register: function(responder) {
    if (!this.include(responder))
      this.responders.push(responder);
  },
  unregister: function(responder) {
    this.responders = this.responders.without(responder);
  },
  dispatch: function(callback, request, transport, json) {
    this.each(function(responder) {
      if (Object.isFunction(responder[callback])) {
        try {
          responder[callback].apply(responder, [request, transport, json]);
        } catch (e) { }
      }
    });
  }
};
Object.extend(Ajax.Responders, Enumerable);
Ajax.Responders.register({
  onCreate:   function() { Ajax.activeRequestCount++ },
  onComplete: function() { Ajax.activeRequestCount-- }
});
Ajax.Base = Class.create({
  initialize: function(options) {
    this.options = {
      method:       'post',
      asynchronous: true,
      contentType:  'application/x-www-form-urlencoded',
      encoding:     'UTF-8',
      parameters:   '',
      evalJSON:     true,
      evalJS:       true
    };
    Object.extend(this.options, options || { });
    this.options.method = this.options.method.toLowerCase();
    if (Object.isHash(this.options.parameters))
      this.options.parameters = this.options.parameters.toObject();
  }
});
Ajax.Request = Class.create(Ajax.Base, {
  _complete: false,
  initialize: function($super, url, options) {
    $super(options);
    this.transport = Ajax.getTransport();
    this.request(url);
  },
  request: function(url) {
    this.url = url;
    this.method = this.options.method;
    var params = Object.isString(this.options.parameters) ?
          this.options.parameters :
          Object.toQueryString(this.options.parameters);
    if (!['get', 'post'].include(this.method)) {
      // simulate other verbs over post
      params += (params ? '&' : '') + "_method=" + this.method;
      this.method = 'post';
    }
    if (params && this.method === 'get') {
      // when GET, append parameters to URL
      this.url += (this.url.include('?') ? '&' : '?') + params;
    }
    this.parameters = params.toQueryParams();
    try {
      var response = new Ajax.Response(this);
      if (this.options.onCreate) this.options.onCreate(response);
      Ajax.Responders.dispatch('onCreate', this, response);
      this.transport.open(this.method.toUpperCase(), this.url,
        this.options.asynchronous);
      if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);
      this.transport.onreadystatechange = this.onStateChange.bind(this);
      this.setRequestHeaders();
      this.body = this.method == 'post' ? (this.options.postBody || params) : null;
      this.transport.send(this.body);
      /* Force Firefox to handle ready state 4 for synchronous requests */
      if (!this.options.asynchronous && this.transport.overrideMimeType)
        this.onStateChange();
    }
    catch (e) {
      this.dispatchException(e);
    }
  },
  onStateChange: function() {
    var readyState = this.transport.readyState;
    if (readyState > 1 && !((readyState == 4) && this._complete))
      this.respondToReadyState(this.transport.readyState);
  },
  setRequestHeaders: function() {
    var headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-Prototype-Version': Prototype.Version,
      'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
    };
    if (this.method == 'post') {
      headers['Content-type'] = this.options.contentType +
        (this.options.encoding ? '; charset=' + this.options.encoding : '');
      /* Force "Connection: close" for older Mozilla browsers to work
       * around a bug where XMLHttpRequest sends an incorrect
       * Content-length header. See Mozilla Bugzilla #246651.
       */
      if (this.transport.overrideMimeType &&
          (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
            headers['Connection'] = 'close';
    }
    // user-defined headers
    if (typeof this.options.requestHeaders == 'object') {
      var extras = this.options.requestHeaders;
      if (Object.isFunction(extras.push))
        for (var i = 0, length = extras.length; i < length; i += 2)
          headers[extras[i]] = extras[i+1];
      else
        $H(extras).each(function(pair) { headers[pair.key] = pair.value });
    }
    // skip null or undefined values
    for (var name in headers)
      if (headers[name] != null)
        this.transport.setRequestHeader(name, headers[name]);
  },
  success: function() {
    var status = this.getStatus();
    return !status || (status >= 200 && status < 300) || status == 304;
  },
  getStatus: function() {
    try {
      // IE sometimes returns 1223 for a 204 response.
      if (this.transport.status === 1223) return 204;
      return this.transport.status || 0;
    } catch (e) { return 0 }
  },
  respondToReadyState: function(readyState) {
    var state = Ajax.Request.Events[readyState], response = new Ajax.Response(this);
    if (state == 'Complete') {
      try {
        this._complete = true;
        (this.options['on' + response.status]
         || this.options['on' + (this.success() ? 'Success' : 'Failure')]
         || Prototype.emptyFunction)(response, response.headerJSON);
      } catch (e) {
        this.dispatchException(e);
      }
      var contentType = response.getHeader('Content-type');
      if (this.options.evalJS == 'force'
          || (this.options.evalJS && this.isSameOrigin() && contentType
          && contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
        this.evalResponse();
    }
    try {
      (this.options['on' + state] || Prototype.emptyFunction)(response, response.headerJSON);
      Ajax.Responders.dispatch('on' + state, this, response, response.headerJSON);
    } catch (e) {
      this.dispatchException(e);
    }
    if (state == 'Complete') {
      // avoid memory leak in MSIE: clean up
      this.transport.onreadystatechange = Prototype.emptyFunction;
    }
  },
  isSameOrigin: function() {
    var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
    return !m || (m[0] == '#{protocol}//#{domain}#{port}'.interpolate({
      protocol: location.protocol,
      domain: document.domain,
      port: location.port ? ':' + location.port : ''
    }));
  },
  getHeader: function(name) {
    try {
      return this.transport.getResponseHeader(name) || null;
    } catch (e) { return null; }
  },
  evalResponse: function() {
    try {
      return eval((this.transport.responseText || '').unfilterJSON());
    } catch (e) {
      this.dispatchException(e);
    }
  },
  dispatchException: function(exception) {
    (this.options.onException || Prototype.emptyFunction)(this, exception);
    Ajax.Responders.dispatch('onException', this, exception);
  }
});
Ajax.Request.Events =
  ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];
Ajax.Response = Class.create({
  // Don't document the constructor; should never be manually instantiated.
  initialize: function(request){
    this.request = request;
    var transport  = this.transport  = request.transport,
        readyState = this.readyState = transport.readyState;
    if ((readyState > 2 && !Prototype.Browser.IE) || readyState == 4) {
      this.status       = this.getStatus();
      this.statusText   = this.getStatusText();
      this.responseText = String.interpret(transport.responseText);
      this.headerJSON   = this._getHeaderJSON();
    }
    if (readyState == 4) {
      var xml = transport.responseXML;
      this.responseXML  = Object.isUndefined(xml) ? null : xml;
      this.responseJSON = this._getResponseJSON();
    }
  },
  status:      0,
  statusText: '',
  getStatus: Ajax.Request.prototype.getStatus,
  getStatusText: function() {
    try {
      return this.transport.statusText || '';
    } catch (e) { return '' }
  },
  getHeader: Ajax.Request.prototype.getHeader,
  getAllHeaders: function() {
    try {
      return this.getAllResponseHeaders();
    } catch (e) { return null }
  },
  getResponseHeader: function(name) {
    return this.transport.getResponseHeader(name);
  },
  getAllResponseHeaders: function() {
    return this.transport.getAllResponseHeaders();
  },
  _getHeaderJSON: function() {
    var json = this.getHeader('X-JSON');
    if (!json) return null;
    try {
      // Browsers expect HTTP headers to be ASCII and nothing else. Running
      // them through `decodeURIComponent` processes them with the page's
      // specified encoding.
      json = decodeURIComponent(escape(json));
    } catch(e) {
      // Except Chrome doesn't seem to need this, and calling
      // `decodeURIComponent` on text that's already in the proper encoding
      // will throw a `URIError`. The ugly solution is to assume that a
      // `URIError` raised here signifies that the text is, in fact, already 
      // in the correct encoding, and treat the failure as a good sign.
      //
      // This is ugly, but so too is sending extended characters in an HTTP
      // header with no spec to back you up.
    }
    
    try {
      return json.evalJSON(this.request.options.sanitizeJSON ||
        !this.request.isSameOrigin());
    } catch (e) {
      this.request.dispatchException(e);
    }
  },
  _getResponseJSON: function() {
    var options = this.request.options;
    if (!options.evalJSON || (options.evalJSON != 'force' &&
      !(this.getHeader('Content-type') || '').include('application/json')) ||
        this.responseText.blank())
          return null;
    try {
      return this.responseText.evalJSON(options.sanitizeJSON ||
        !this.request.isSameOrigin());
    } catch (e) {
      this.request.dispatchException(e);
    }
  }
});
Ajax.Updater = Class.create(Ajax.Request, {
  initialize: function($super, container, url, options) {
    this.container = {
      success: (container.success || container),
      failure: (container.failure || (container.success ? null : container))
    };
    options = Object.clone(options);
    var onComplete = options.onComplete;
    options.onComplete = (function(response, json) {
      this.updateContent(response.responseText);
      if (Object.isFunction(onComplete)) onComplete(response, json);
    }).bind(this);
    $super(url, options);
  },
  updateContent: function(responseText) {
    var receiver = this.container[this.success() ? 'success' : 'failure'],
        options = this.options;
    if (!options.evalScripts) responseText = responseText.stripScripts();
    if (receiver = $(receiver)) {
      if (options.insertion) {
        if (Object.isString(options.insertion)) {
          var insertion = { }; insertion[options.insertion] = responseText;
          receiver.insert(insertion);
        }
        else options.insertion(receiver, responseText);
      }
      else receiver.update(responseText);
    }
  }
});
Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
  initialize: function($super, container, url, options) {
    $super(options);
    this.onComplete = this.options.onComplete;
    this.frequency = (this.options.frequency || 2);
    this.decay = (this.options.decay || 1);
    this.updater = { };
    this.container = container;
    this.url = url;
    this.start();
  },
  start: function() {
    this.options.onComplete = this.updateComplete.bind(this);
    this.onTimerEvent();
  },
  stop: function() {
    this.updater.options.onComplete = undefined;
    clearTimeout(this.timer);
    (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
  },
  updateComplete: function(response) {
    if (this.options.decay) {
      this.decay = (response.responseText == this.lastText ?
        this.decay * this.options.decay : 1);
      this.lastText = response.responseText;
    }
    this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency);
  },
  onTimerEvent: function() {
    this.updater = new Ajax.Updater(this.container, this.url, this.options);
  }
});
(function(GLOBAL) {
  
  var UNDEFINED;
  var SLICE = Array.prototype.slice;
  
  // Try to reuse the same created element as much as possible. We'll use
  // this DIV for capability checks (where possible) and for normalizing
  // HTML content.
  var DIV = document.createElement('div');
  
  function $(element) {
    if (arguments.length > 1) {
      for (var i = 0, elements = [], length = arguments.length; i < length; i++)
        elements.push($(arguments[i]));
      return elements;
    }
    
    if (Object.isString(element))
      element = document.getElementById(element);
    return Element.extend(element);
  }
  
  GLOBAL.$ = $;
  
  
  // Define the DOM Level 2 node type constants if they're missing.
  if (!GLOBAL.Node) GLOBAL.Node = {};
  
  if (!GLOBAL.Node.ELEMENT_NODE) {
    Object.extend(GLOBAL.Node, {
      ELEMENT_NODE:                1,
      ATTRIBUTE_NODE:              2,
      TEXT_NODE:                   3,
      CDATA_SECTION_NODE:          4,
      ENTITY_REFERENCE_NODE:       5,
      ENTITY_NODE:                 6,
      PROCESSING_INSTRUCTION_NODE: 7,
      COMMENT_NODE:                8,
      DOCUMENT_NODE:               9,
      DOCUMENT_TYPE_NODE:         10,
      DOCUMENT_FRAGMENT_NODE:     11,
      NOTATION_NODE:              12
    });
  }
  
  // The cache for all our created elements.
  var ELEMENT_CACHE = {};
  
  // For performance reasons, we create new elements by cloning a "blank"
  // version of a given element. But sometimes this causes problems. Skip
  // the cache if:
  //   (a) We're creating a SELECT element (troublesome in IE6);
  //   (b) We're setting the `type` attribute on an INPUT element
  //       (troublesome in IE9).
  function shouldUseCreationCache(tagName, attributes) {
    if (tagName === 'select') return false;
    if ('type' in attributes) return false;
    return true;
  }
  
  // IE requires that `name` and `type` attributes be set this way.
  var HAS_EXTENDED_CREATE_ELEMENT_SYNTAX = (function(){
    try {
      var el = document.createElement('<input name="x">');
      return el.tagName.toLowerCase() === 'input' && el.name === 'x';
    } 
    catch(err) {
      return false;
    }
  })();
  
  
  var oldElement = GLOBAL.Element;
  function Element(tagName, attributes) {
    attributes = attributes || {};
    tagName = tagName.toLowerCase();
    
    if (HAS_EXTENDED_CREATE_ELEMENT_SYNTAX && attributes.name) {
      tagName = '<' + tagName + ' name="' + attributes.name + '">';
      delete attributes.name;
      return Element.writeAttribute(document.createElement(tagName), attributes);
    }
    
    if (!ELEMENT_CACHE[tagName])
      ELEMENT_CACHE[tagName] = Element.extend(document.createElement(tagName));
    
    var node = shouldUseCreationCache(tagName, attributes) ?
     ELEMENT_CACHE[tagName].cloneNode(false) : document.createElement(tagName);
     
    return Element.writeAttribute(node, attributes);
  }
  
  GLOBAL.Element = Element;
  
  Object.extend(GLOBAL.Element, oldElement || {});
  if (oldElement) GLOBAL.Element.prototype = oldElement.prototype;
  
  Element.Methods = { ByTag: {}, Simulated: {} };
  // Temporary object for holding all our initial element methods. We'll add
  // them all at once at the bottom of this file.
  var methods = {};
  
  var INSPECT_ATTRIBUTES = { id: 'id', className: 'class' };
  function inspect(element) {
    element = $(element);
    var result = '<' + element.tagName.toLowerCase();
    
    var attribute, value;
    for (var property in INSPECT_ATTRIBUTES) {
      attribute = INSPECT_ATTRIBUTES[property];
      value = (element[property] || '').toString();
      if (value) result += ' ' + attribute + '=' + value.inspect(true);
    }
    
    return result + '>';
  }
  
  methods.inspect = inspect;
  
  // VISIBILITY
  
  function visible(element) {
    return $(element).style.display !== 'none';
  }
  
  function toggle(element, bool) {
    element = $(element);
    if (Object.isUndefined(bool))
      bool = !Element.visible(element);
    Element[bool ? 'show' : 'hide'](element);
    
    return element;
  }
  function hide(element) {
    element = $(element);
    element.style.display = 'none';
    return element;
  }
  
  function show(element) {
    element = $(element);
    element.style.display = '';
    return element;
  }
  
  
  Object.extend(methods, {
    visible: visible,
    toggle:  toggle,
    hide:    hide,
    show:    show
  });
  
  // MANIPULATION
  
  function remove(element) {
    element = $(element);
    element.parentNode.removeChild(element);
    return element;
  }
  
  // see: http://support.microsoft.com/kb/276228
  var SELECT_ELEMENT_INNERHTML_BUGGY = (function(){
    var el = document.createElement("select"),
        isBuggy = true;
    el.innerHTML = "<option value=\"test\">test</option>";
    if (el.options && el.options[0]) {
      isBuggy = el.options[0].nodeName.toUpperCase() !== "OPTION";
    }
    el = null;
    return isBuggy;
  })();
  // see: http://msdn.microsoft.com/en-us/library/ms533897(VS.85).aspx
  var TABLE_ELEMENT_INNERHTML_BUGGY = (function(){
    try {
      var el = document.createElement("table");
      if (el && el.tBodies) {
        el.innerHTML = "<tbody><tr><td>test</td></tr></tbody>";
        var isBuggy = typeof el.tBodies[0] == "undefined";
        el = null;
        return isBuggy;
      }
    } catch (e) {
      return true;
    }
  })();
  
  var LINK_ELEMENT_INNERHTML_BUGGY = (function() {
    try {
      var el = document.createElement('div');
      el.innerHTML = "<link />";
      var isBuggy = (el.childNodes.length === 0);
      el = null;
      return isBuggy;
    } catch(e) {
      return true;
    }
  })();
  
  var ANY_INNERHTML_BUGGY = SELECT_ELEMENT_INNERHTML_BUGGY ||
   TABLE_ELEMENT_INNERHTML_BUGGY || LINK_ELEMENT_INNERHTML_BUGGY;    
  var SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING = (function () {
    var s = document.createElement("script"),
        isBuggy = false;
    try {
      s.appendChild(document.createTextNode(""));
      isBuggy = !s.firstChild ||
        s.firstChild && s.firstChild.nodeType !== 3;
    } catch (e) {
      isBuggy = true;
    }
    s = null;
    return isBuggy;
  })();
  
  function update(element, content) {
    element = $(element);
    
    // Purge the element's existing contents of all storage keys and
    // event listeners, since said content will be replaced no matter
    // what.
    var descendants = element.getElementsByTagName('*'),
     i = descendants.length;
    while (i--) purgeElement(descendants[i]);
    
    if (content && content.toElement)
      content = content.toElement();
      
    if (Object.isElement(content))
      return element.update().insert(content);
      
    
    content = Object.toHTML(content);
    var tagName = element.tagName.toUpperCase();
    
    if (tagName === 'SCRIPT' && SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING) {
      // Scripts are not evaluated when updating a SCRIPT element.
      element.text = content;
      return element;
    }
    
    if (ANY_INNERHTML_BUGGY) {
      if (tagName in INSERTION_TRANSLATIONS.tags) {
        while (element.firstChild)
          element.removeChild(element.firstChild);
        
        var nodes = getContentFromAnonymousElement(tagName, content.stripScripts());        
        for (var i = 0, node; node = nodes[i]; i++)
          element.appendChild(node);
        
      } else if (LINK_ELEMENT_INNERHTML_BUGGY && Object.isString(content) && content.indexOf('<link') > -1) {
        // IE barfs when inserting a string that beings with a LINK
        // element. The workaround is to add any content to the beginning
        // of the string; we'll be inserting a text node (see
        // getContentFromAnonymousElement below).
        while (element.firstChild)
          element.removeChild(element.firstChild);
          
        var nodes = getContentFromAnonymousElement(tagName,
         content.stripScripts(), true);
        
        for (var i = 0, node; node = nodes[i]; i++)
          element.appendChild(node);
      } else {
        element.innerHTML = content.stripScripts();
      }
    } else {
      element.innerHTML = content.stripScripts();
    }
    
    content.evalScripts.bind(content).defer();
    return element;
  }
  
  function replace(element, content) {
    element = $(element);
    
    if (content && content.toElement) {
      content = content.toElement();      
    } else if (!Object.isElement(content)) {
      content = Object.toHTML(content);
      var range = element.ownerDocument.createRange();
      range.selectNode(element);
      content.evalScripts.bind(content).defer();
      content = range.createContextualFragment(content.stripScripts());
    }
      
    element.parentNode.replaceChild(content, element);
    return element;
  }
  
  var INSERTION_TRANSLATIONS = {
    before: function(element, node) {
      element.parentNode.insertBefore(node, element);
    },
    top: function(element, node) {
      element.insertBefore(node, element.firstChild);
    },
    bottom: function(element, node) {
      element.appendChild(node);
    },
    after: function(element, node) {
      element.parentNode.insertBefore(node, element.nextSibling);
    },
    
    tags: {
      TABLE:  ['<table>',                '</table>',                   1],
      TBODY:  ['<table><tbody>',         '</tbody></table>',           2],
      TR:     ['<table><tbody><tr>',     '</tr></tbody></table>',      3],
      TD:     ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
      SELECT: ['<select>',               '</select>',                  1]
    }
  };
  
  var tags = INSERTION_TRANSLATIONS.tags;
  
  Object.extend(tags, {
    THEAD: tags.TBODY,
    TFOOT: tags.TBODY,
    TH:    tags.TD
  });
  
  function replace_IE(element, content) {
    element = $(element);
    if (content && content.toElement)
      content = content.toElement();
    if (Object.isElement(content)) {
      element.parentNode.replaceChild(content, element);
      return element;
    }
    
    content = Object.toHTML(content);
    var parent = element.parentNode, tagName = parent.tagName.toUpperCase();
    
    if (tagName in INSERTION_TRANSLATIONS.tags) {
      var nextSibling = Element.next(element);
      var fragments = getContentFromAnonymousElement(
       tagName, content.stripScripts());
      
      parent.removeChild(element);
      
      var iterator;
      if (nextSibling)
        iterator = function(node) { parent.insertBefore(node, nextSibling) };
      else
        iterator = function(node) { parent.appendChild(node); }
        
      fragments.each(iterator);
    } else {
      // We don't need to special-case this one.
      element.outerHTML = content.stripScripts();
    }
    
    content.evalScripts.bind(content).defer();
    return element;
  }
  
  if ('outerHTML' in document.documentElement)
    replace = replace_IE;
  
  function isContent(content) {
    if (Object.isUndefined(content) || content === null) return false;
    
    if (Object.isString(content) || Object.isNumber(content)) return true;
    if (Object.isElement(content)) return true;    
    if (content.toElement || content.toHTML) return true;
    
    return false;
  }
  
  // This private method does the bulk of the work for Element#insert. The
  // actual insert method handles argument normalization and multiple
  // content insertions.
  function insertContentAt(element, content, position) {
    position   = position.toLowerCase();
    var method = INSERTION_TRANSLATIONS[position];
    
    if (content && content.toElement) content = content.toElement();
    if (Object.isElement(content)) {
      method(element, content);
      return element;
    }
    
    content = Object.toHTML(content);      
    var tagName = ((position === 'before' || position === 'after') ?
     element.parentNode : element).tagName.toUpperCase();
    
    var childNodes = getContentFromAnonymousElement(tagName, content.stripScripts());
    
    if (position === 'top' || position === 'after') childNodes.reverse();
    
    for (var i = 0, node; node = childNodes[i]; i++)
      method(element, node);
      
    content.evalScripts.bind(content).defer();    
  }
  function insert(element, insertions) {
    element = $(element);
    
    if (isContent(insertions))
      insertions = { bottom: insertions };
      
    for (var position in insertions)
      insertContentAt(element, insertions[position], position);
    
    return element;    
  }
  
  function wrap(element, wrapper, attributes) {
    element = $(element);
    
    if (Object.isElement(wrapper)) {
      // The wrapper argument is a DOM node.
      $(wrapper).writeAttribute(attributes || {});      
    } else if (Object.isString(wrapper)) {
      // The wrapper argument is a string representing a tag name.
      wrapper = new Element(wrapper, attributes);
    } else {
      // No wrapper was specified, which means the second argument is a set
      // of attributes.
      wrapper = new Element('div', wrapper);
    }
    
    if (element.parentNode)
      element.parentNode.replaceChild(wrapper, element);
    
    wrapper.appendChild(element);
    
    return wrapper;
  }
  
  function cleanWhitespace(element) {
    element = $(element);
    var node = element.firstChild;
    
    while (node) {
      var nextNode = node.nextSibling;
      if (node.nodeType === Node.TEXT_NODE && !/\S/.test(node.nodeValue))
        element.removeChild(node);
      node = nextNode;
    }
    return element;
  }
  
  function empty(element) {
    return $(element).innerHTML.blank();
  }
  
  // In older versions of Internet Explorer, certain elements don't like
  // having innerHTML set on them — including SELECT and most table-related
  // tags. So we wrap the string with enclosing HTML (if necessary), stick it
  // in a DIV, then grab the DOM nodes.
  function getContentFromAnonymousElement(tagName, html, force) {
    var t = INSERTION_TRANSLATIONS.tags[tagName], div = DIV;
    
    var workaround = !!t;
    if (!workaround && force) {
      workaround = true;
      t = ['', '', 0];
    }
    
    if (workaround) {
      div.innerHTML = '&#160;' + t[0] + html + t[1];
      div.removeChild(div.firstChild);
      for (var i = t[2]; i--; )
        div = div.firstChild;
    } else {
      div.innerHTML = html;
    }
    
    return $A(div.childNodes);
    //return SLICE.call(div.childNodes, 0);
  }
  
  function clone(element, deep) {
    if (!(element = $(element))) return;
    var clone = element.cloneNode(deep);
    if (!HAS_UNIQUE_ID_PROPERTY) {
      clone._prototypeUID = UNDEFINED;
      if (deep) {
        var descendants = Element.select(clone, '*'),
         i = descendants.length;
        while (i--)
          descendants[i]._prototypeUID = UNDEFINED;
      }
    }
    return Element.extend(clone);
  }
  
  // Performs cleanup on a single element before it is removed from the page.
  function purgeElement(element) {
    var uid = getUniqueElementID(element);
    if (uid) {
      Element.stopObserving(element);
      if (!HAS_UNIQUE_ID_PROPERTY)
        element._prototypeUID = UNDEFINED;
      delete Element.Storage[uid];
    }
  }
  
  function purgeCollection(elements) {
    var i = elements.length;
    while (i--)
      purgeElement(elements[i]);
  }
  
  function purgeCollection_IE(elements) {
    var i = elements.length, element, uid;
    while (i--) {
      element = elements[i];
      uid = getUniqueElementID(element);
      delete Element.Storage[uid];
      delete Event.cache[uid];
    }
  }
  
  if (HAS_UNIQUE_ID_PROPERTY) {
    purgeCollection = purgeCollection_IE;
  }
  
  
  function purge(element) {
    if (!(element = $(element))) return;
    purgeElement(element);
    
    var descendants = element.getElementsByTagName('*'),
     i = descendants.length;
     
    while (i--) purgeElement(descendants[i]);
    
    return null;
  }
  
  Object.extend(methods, {
    remove:  remove,
    update:  update,
    replace: replace,
    insert:  insert,
    wrap:    wrap,
    cleanWhitespace: cleanWhitespace,
    empty:   empty,
    clone:   clone,
    purge:   purge
  });
  
  // TRAVERSAL
  
  function recursivelyCollect(element, property, maximumLength) {
    element = $(element);
    maximumLength = maximumLength || -1;
    var elements = [];
    
    while (element = element[property]) {
      if (element.nodeType === Node.ELEMENT_NODE)
        elements.push(Element.extend(element));
        
      if (elements.length === maximumLength) break;
    }
    
    return elements;    
  }
  
  function ancestors(element) {
    return recursivelyCollect(element, 'parentNode');
  }
  
  function descendants(element) {
    return Element.select(element, '*');
  }
  
  function firstDescendant(element) {
    element = $(element).firstChild;
    while (element && element.nodeType !== Node.ELEMENT_NODE)
      element = element.nextSibling;
    return $(element);
  }
  
  function immediateDescendants(element) {
    var results = [], child = $(element).firstChild;
    
    while (child) {
      if (child.nodeType === Node.ELEMENT_NODE)
        results.push(Element.extend(child));
      
      child = child.nextSibling;
    }
    
    return results;
  }
  
  function previousSiblings(element) {
    return recursivelyCollect(element, 'previousSibling');
  }
  
  function nextSiblings(element) {
    return recursivelyCollect(element, 'nextSibling');
  }
  
  function siblings(element) {
    element = $(element);    
    var previous = previousSiblings(element),
     next = nextSiblings(element);
    return previous.reverse().concat(next);
  }
  
  function match(element, selector) {
    element = $(element);
    
    // If selector is a string, we assume it's a CSS selector.
    if (Object.isString(selector))
      return Prototype.Selector.match(element, selector);
      
    // Otherwise, we assume it's an object with its own `match` method.
    return selector.match(element);
  }
  
  
  // Internal method for optimizing traversal. Works like 
  // `recursivelyCollect`, except it stops at the first match and doesn't
  // extend any elements except for the returned element.
  function _recursivelyFind(element, property, expression, index) {
    element = $(element), expression = expression || 0, index = index || 0;
    if (Object.isNumber(expression)) {
      index = expression, expression = null;
    }
    
    while (element = element[property]) {
      // Skip any non-element nodes.
      if (element.nodeType !== 1) continue;
      // Skip any nodes that don't match the expression, if there is one.
      if (expression && !Prototype.Selector.match(element, expression))
        continue;
      // Skip the first `index` matches we find.
      if (--index >= 0) continue;
      
      return Element.extend(element);
    }
  }
  
  
  function up(element, expression, index) {
    element = $(element);
    if (arguments.length === 1) return $(element.parentNode);
    return _recursivelyFind(element, 'parentNode', expression, index);
  }
  function down(element, expression, index) {
    if (arguments.length === 1) return firstDescendant(element);
    element = $(element), expression = expression || 0, index = index || 0;
    
    if (Object.isNumber(expression))
      index = expression, expression = '*';
    
    var node = Prototype.Selector.select(expression, element)[index];
    return Element.extend(node);
  }
  function previous(element, expression, index) {
    return _recursivelyFind(element, 'previousSibling', expression, index);
  }
  
  function next(element, expression, index) {
    return _recursivelyFind(element, 'nextSibling', expression, index);
  }
    
  function select(element) {
    element = $(element);
    var expressions = SLICE.call(arguments, 1).join(', ');
    return Prototype.Selector.select(expressions, element);
  }
  function adjacent(element) {
    element = $(element);
    var expressions = SLICE.call(arguments, 1).join(', ');
    var siblings = Element.siblings(element), results = [];
    for (var i = 0, sibling; sibling = siblings[i]; i++) {
      if (Prototype.Selector.match(sibling, expressions))
        results.push(sibling);
    }
    
    return results;
  }
  
  function descendantOf_DOM(element, ancestor) {
    element = $(element), ancestor = $(ancestor);
    while (element = element.parentNode)
      if (element === ancestor) return true;
    return false;
  }
  
  function descendantOf_contains(element, ancestor) {
    element = $(element), ancestor = $(ancestor);
    // Some nodes, like `document`, don't have the "contains" method.
    if (!ancestor.contains) return descendantOf_DOM(element, ancestor);
    return ancestor.contains(element) && ancestor !== element;
  }
  
  function descendantOf_compareDocumentPosition(element, ancestor) {
    element = $(element), ancestor = $(ancestor);
    return (element.compareDocumentPosition(ancestor) & 8) === 8;
  }
  
  var descendantOf;
  if (DIV.compareDocumentPosition) {
    descendantOf = descendantOf_compareDocumentPosition;
  } else if (DIV.contains) {
    descendantOf = descendantOf_contains;
  } else {
    descendantOf = descendantOf_DOM;
  }
  
  
  Object.extend(methods, {
    recursivelyCollect:   recursivelyCollect,
    ancestors:            ancestors,
    descendants:          descendants,
    firstDescendant:      firstDescendant,
    immediateDescendants: immediateDescendants,
    previousSiblings:     previousSiblings,
    nextSiblings:         nextSiblings,
    siblings:             siblings,
    match:                match,
    up:                   up,
    down:                 down,
    previous:             previous,
    next:                 next,
    select:               select,
    adjacent:             adjacent,
    descendantOf:         descendantOf,
    
    // ALIASES
    getElementsBySelector: select,
    
    childElements:         immediateDescendants
  });
  
  
  // ATTRIBUTES
  var idCounter = 1;
  function identify(element) {
    element = $(element);
    var id = Element.readAttribute(element, 'id');
    if (id) return id;
    
    // The element doesn't have an ID of its own. Give it one, first ensuring
    // that it's unique.
    do { id = 'anonymous_element_' + idCounter++ } while ($(id));
    
    Element.writeAttribute(element, 'id', id);
    return id;
  }
  
  function readAttribute(element, name) {
    return $(element).getAttribute(name);
  }
  
  function readAttribute_IE(element, name) {
    element = $(element);
    
    // If the attribute name exists in the value translation table, it means
    // we should use a custom method for retrieving that attribute's value.
    var table = ATTRIBUTE_TRANSLATIONS.read;
    if (table.values[name])
      return table.values[name](element, name);
      
    // If it exists in the name translation table, it means the attribute has
    // an alias.
    if (table.names[name]) name = table.names[name];
    
    // Special-case namespaced attributes.
    if (name.include(':')) {
      if (!element.attributes || !element.attributes[name]) return null;
      return element.attributes[name].value;
    }
    
    return element.getAttribute(name);
  }
  
  function readAttribute_Opera(element, name) {
    if (name === 'title') return element.title;
    return element.getAttribute(name);
  }
  
  var PROBLEMATIC_ATTRIBUTE_READING = (function() {
    // This test used to set 'onclick' to `Prototype.emptyFunction`, but that
    // caused an (uncatchable) error in IE 10. For some reason, switching to
    // an empty array prevents this issue.
    DIV.setAttribute('onclick', []);
    var value = DIV.getAttribute('onclick');
    var isFunction = Object.isArray(value);
    DIV.removeAttribute('onclick');
    return isFunction;
  })();
  
  if (PROBLEMATIC_ATTRIBUTE_READING) {
    readAttribute = readAttribute_IE;
  } else if (Prototype.Browser.Opera) {
    readAttribute = readAttribute_Opera;
  }
  
  
  function writeAttribute(element, name, value) {
    element = $(element);
    var attributes = {}, table = ATTRIBUTE_TRANSLATIONS.write;
    
    if (typeof name === 'object') {
      attributes = name;
    } else {
      attributes[name] = Object.isUndefined(value) ? true : value;
    }
    
    for (var attr in attributes) {
      name = table.names[attr] || attr;
      value = attributes[attr];
      if (table.values[attr])
        name = table.values[attr](element, value) || name;
      if (value === false || value === null)
        element.removeAttribute(name);
      else if (value === true)
        element.setAttribute(name, name);
      else element.setAttribute(name, value);
    }
    return element;
  }
  
  function hasAttribute(element, attribute) {
    attribute = ATTRIBUTE_TRANSLATIONS.has[attribute] || attribute;
    var node = $(element).getAttributeNode(attribute);
    return !!(node && node.specified);
  }
  
  GLOBAL.Element.Methods.Simulated.hasAttribute = hasAttribute;
  
  function classNames(element) {
    return new Element.ClassNames(element);
  }
  
  var regExpCache = {};
  function getRegExpForClassName(className) {
    if (regExpCache[className]) return regExpCache[className];
    
    var re = new RegExp("(^|\\s+)" + className + "(\\s+|$)");
    regExpCache[className] = re;
    return re;
  }
  
  function hasClassName(element, className) {
    if (!(element = $(element))) return;
    
    var elementClassName = element.className;
    // We test these common cases first because we'd like to avoid creating
    // the regular expression, if possible.
    if (elementClassName.length === 0) return false;
    if (elementClassName === className) return true;
    
    return getRegExpForClassName(className).test(elementClassName);
  }
  
  function addClassName(element, className) {
    if (!(element = $(element))) return;
    
    if (!hasClassName(element, className))
      element.className += (element.className ? ' ' : '') + className;
      
    return element;
  }
  
  function removeClassName(element, className) {
    if (!(element = $(element))) return;
    
    element.className = element.className.replace(
     getRegExpForClassName(className), ' ').strip();
     
    return element;
  }
  
  function toggleClassName(element, className, bool) {
    if (!(element = $(element))) return;
    
    if (Object.isUndefined(bool))
      bool = !hasClassName(element, className);
      
    var method = Element[bool ? 'addClassName' : 'removeClassName'];
    return method(element, className);
  }
  
  var ATTRIBUTE_TRANSLATIONS = {};
  
  // Test attributes.
  var classProp = 'className', forProp = 'for';
  
  // Try "className" first (IE <8)
  DIV.setAttribute(classProp, 'x');
  if (DIV.className !== 'x') {
    // Try "class" (IE >=8)
    DIV.setAttribute('class', 'x');
    if (DIV.className === 'x')
      classProp = 'class';
  }
  
  var LABEL = document.createElement('label');
  LABEL.setAttribute(forProp, 'x');
  if (LABEL.htmlFor !== 'x') {
    LABEL.setAttribute('htmlFor', 'x');
    if (LABEL.htmlFor === 'x')
      forProp = 'htmlFor';
  }
  LABEL = null;
  
  function _getAttr(element, attribute) {
    return element.getAttribute(attribute);
  }
  
  function _getAttr2(element, attribute) {
    return element.getAttribute(attribute, 2);
  }
  
  function _getAttrNode(element, attribute) {
    var node = element.getAttributeNode(attribute);
    return node ? node.value : '';
  }
  
  function _getFlag(element, attribute) {
    return $(element).hasAttribute(attribute) ? attribute : null;
  }
  
  // Test whether attributes like `onclick` have their values serialized.
  DIV.onclick = Prototype.emptyFunction;
  var onclickValue = DIV.getAttribute('onclick');
  
  var _getEv;
  
  // IE <8
  if (String(onclickValue).indexOf('{') > -1) {
    // intrinsic event attributes are serialized as `function { ... }`
    _getEv = function(element, attribute) {
      var value = element.getAttribute(attribute);
      if (!value) return null;
      value = value.toString();
      value = value.split('{')[1];
      value = value.split('}')[0];
      return value.strip();
    };
  } 
  // IE >=8
  else if (onclickValue === '') {
    // only function body is serialized
    _getEv = function(element, attribute) {
      var value = element.getAttribute(attribute);
      if (!value) return null;
      return value.strip();
    };
  }
  
  ATTRIBUTE_TRANSLATIONS.read = {
    names: {
      'class':     classProp,
      'className': classProp,
      'for':       forProp,
      'htmlFor':   forProp
    },
        
    values: {
      style: function(element) {
        return element.style.cssText.toLowerCase();
      },
      title: function(element) {
        return element.title;
      }
    }
  };
  
  ATTRIBUTE_TRANSLATIONS.write = {
    names: {
      className:   'class',
      htmlFor:     'for',
      cellpadding: 'cellPadding',
      cellspacing: 'cellSpacing'
    },
    
    values: {
      checked: function(element, value) {
        element.checked = !!value;
      },
      
      style: function(element, value) {
        element.style.cssText = value ? value : '';
      }
    }
  };
  
  ATTRIBUTE_TRANSLATIONS.has = { names: {} };
  
  Object.extend(ATTRIBUTE_TRANSLATIONS.write.names,
   ATTRIBUTE_TRANSLATIONS.read.names);
   
  var CAMEL_CASED_ATTRIBUTE_NAMES = $w('colSpan rowSpan vAlign dateTime ' +
   'accessKey tabIndex encType maxLength readOnly longDesc frameBorder');
   
  for (var i = 0, attr; attr = CAMEL_CASED_ATTRIBUTE_NAMES[i]; i++) {
    ATTRIBUTE_TRANSLATIONS.write.names[attr.toLowerCase()] = attr;
    ATTRIBUTE_TRANSLATIONS.has.names[attr.toLowerCase()]   = attr;
  }
  
  // The rest of the oddballs.
  Object.extend(ATTRIBUTE_TRANSLATIONS.read.values, {
    href:        _getAttr2,
    src:         _getAttr2,
    type:        _getAttr,
    action:      _getAttrNode,
    disabled:    _getFlag,
    checked:     _getFlag,
    readonly:    _getFlag,
    multiple:    _getFlag,
    onload:      _getEv,
    onunload:    _getEv,
    onclick:     _getEv,
    ondblclick:  _getEv,
    onmousedown: _getEv,
    onmouseup:   _getEv,
    onmouseover: _getEv,
    onmousemove: _getEv,
    onmouseout:  _getEv,
    onfocus:     _getEv,
    onblur:      _getEv,
    onkeypress:  _getEv,
    onkeydown:   _getEv,
    onkeyup:     _getEv,
    onsubmit:    _getEv,
    onreset:     _getEv,
    onselect:    _getEv,
    onchange:    _getEv    
  });
  
  
  Object.extend(methods, {
    identify:        identify,
    readAttribute:   readAttribute,
    writeAttribute:  writeAttribute,
    classNames:      classNames,
    hasClassName:    hasClassName,
    addClassName:    addClassName,
    removeClassName: removeClassName,
    toggleClassName: toggleClassName
  });
  
  
  // STYLES
  function normalizeStyleName(style) {
    if (style === 'float' || style === 'styleFloat')
      return 'cssFloat';
    return style.camelize();
  }
  
  function normalizeStyleName_IE(style) {
    if (style === 'float' || style === 'cssFloat')
      return 'styleFloat';
    return style.camelize();
  }
  function setStyle(element, styles) {
    element = $(element);
    var elementStyle = element.style, match;
    
    if (Object.isString(styles)) {
      // Set the element's CSS text directly.
      elementStyle.cssText += ';' + styles;
      if (styles.include('opacity')) {
        var opacity = styles.match(/opacity:\s*(\d?\.?\d*)/)[1];
        Element.setOpacity(element, opacity);
      }
      return element;
    }
    
    for (var property in styles) {
      if (property === 'opacity') {
        Element.setOpacity(element, styles[property]);
      } else {
        var value = styles[property];
        if (property === 'float' || property === 'cssFloat') {
          // Browsers disagree on whether this should be called `cssFloat`
          // or `styleFloat`. Check both.
          property = Object.isUndefined(elementStyle.styleFloat) ?
           'cssFloat' : 'styleFloat';
        }
        elementStyle[property] = value;
      }
    }
    
    return element;    
  }
  
  function getStyle(element, style) {
    if (style === 'opacity') return getOpacity(element);
    element = $(element);
    style = normalizeStyleName(style);
    // Try inline styles first.
    var value = element.style[style];
    if (!value || value === 'auto') {
      // Reluctantly retrieve the computed style.
      var css = document.defaultView.getComputedStyle(element, null);
      value = css ? css[style] : null;
    }
    
    return value === 'auto' ? null : value;
  }
  
  function getStyle_Opera(element, style) {
    switch (style) {
      case 'height': case 'width':
        // returns '0px' for hidden elements; we want it to return null
        if (!Element.visible(element)) return null;
        
        // Certain versions of Opera return border-box dimensions instead of
        // content-box dimensions, so we need to determine if we should
        // subtract padding and borders from the value.
        var dim = parseInt(getStyle(element, style), 10);
        
        if (dim !== element['offset' + style.capitalize()])
          return dim + 'px';
       
        return Element.measure(element, style);
        
      default: return getStyle(element, style);
    }
  }
  
  function getStyle_IE(element, style) {
    if (style === 'opacity') return getOpacity_IE(element);
    element = $(element);
    style = normalizeStyleName_IE(style);
    // Try inline styles first.
    var value = element.style[style];    
    if (!value && element.currentStyle) {
      // Reluctantly retrieve the current style.
      value = element.currentStyle[style];
    }
    
    if (value === 'auto') {
      // If we need a dimension, return null for hidden elements, but return
      // pixel values for visible elements.
      if ((style === 'width' || style === 'height') && Element.visible(element))
        return Element.measure(element, style) + 'px';
      return null;
    }
    
    return value;    
  }
  
  function stripAlphaFromFilter_IE(filter) {
    return (filter || '').replace(/alpha\([^\)]*\)/gi, '');
  }
  
  function hasLayout_IE(element) {
    if (!element.currentStyle || !element.currentStyle.hasLayout)
      element.style.zoom = 1;
    return element;
  }
  // Opacity feature test borrowed from Modernizr.
  var STANDARD_CSS_OPACITY_SUPPORTED = (function() {
    DIV.style.cssText = "opacity:.55";
    return /^0.55/.test(DIV.style.opacity);
  })();
  function setOpacity(element, value) {
    element = $(element);
    if (value == 1 || value === '') value = '';
    else if (value < 0.00001) value = 0;    
    element.style.opacity = value;    
    return element;
  }
  
  // The IE versions of `setOpacity` and `getOpacity` are aware of both
  // the standard approach (an `opacity` property in CSS) and the old-style
  // IE approach (a proprietary `filter` property). They are written to
  // prefer the standard approach unless it isn't supported.
  var setOpacity_IE = STANDARD_CSS_OPACITY_SUPPORTED ? setOpacity : function(element, value) {
    element = $(element);
    var style = element.style;
    if (!element.currentStyle || !element.currentStyle.hasLayout)
      style.zoom = 1;
    var filter = Element.getStyle(element, 'filter');
     
    if (value == 1 || value === '') {
      // Remove the `alpha` filter from IE's `filter` CSS property. If there
      // is anything left after removal, put it back where it was; otherwise
      // remove the property.
      filter = stripAlphaFromFilter_IE(filter);
      if (filter) style.filter = filter;
      else style.removeAttribute('filter');      
      return element;
    }
    
    if (value < 0.00001) value = 0;
        
    style.filter = stripAlphaFromFilter_IE(filter) + 
     ' alpha(opacity=' + (value * 100) + ')';
     
    return element;
  };
  
  
  function getOpacity(element) {
    element = $(element);
    // Try inline styles first.
    var value = element.style.opacity;
    if (!value || value === 'auto') {
      // Reluctantly retrieve the computed style.
      var css = document.defaultView.getComputedStyle(element, null);
      value = css ? css.opacity : null;
    }
    return value ? parseFloat(value) : 1.0;
  }
  
  // Prefer the standard CSS approach unless it's not supported.
  var getOpacity_IE = STANDARD_CSS_OPACITY_SUPPORTED ? getOpacity : function(element) {
    var filter = Element.getStyle(element, 'filter');
    if (filter.length === 0) return 1.0;
    var match = (filter || '').match(/alpha\(opacity=(.*)\)/i);
    if (match && match[1]) return parseFloat(match[1]) / 100;
    return 1.0;
  };
  
  
  Object.extend(methods, {
    setStyle:   setStyle,
    getStyle:   getStyle,
    setOpacity: setOpacity,
    getOpacity: getOpacity
  });
  if (Prototype.Browser.Opera) {
    // Opera also has 'styleFloat' in DIV.style
    methods.getStyle = getStyle_Opera;
  } else if ('styleFloat' in DIV.style) {
    methods.getStyle = getStyle_IE;
    methods.setOpacity = setOpacity_IE;
    methods.getOpacity = getOpacity_IE;
  }
  
  // STORAGE
  var UID = 0;
  
  GLOBAL.Element.Storage = { UID: 1 };
  
  function getUniqueElementID(element) {
    if (element === window) return 0;
    // Need to use actual `typeof` operator to prevent errors in some
    // environments when accessing node expandos.
    if (typeof element._prototypeUID === 'undefined')
      element._prototypeUID = Element.Storage.UID++;
    return element._prototypeUID;
  }
  
  // In Internet Explorer, DOM nodes have a `uniqueID` property. Saves us
  // from inventing our own.
  function getUniqueElementID_IE(element) {
    if (element === window) return 0;
    // The document object's `uniqueID` property changes each time you read it.
    if (element == document) return 1;
    return element.uniqueID;
  }
  
  var HAS_UNIQUE_ID_PROPERTY = ('uniqueID' in DIV);
  if (HAS_UNIQUE_ID_PROPERTY)
    getUniqueElementID = getUniqueElementID_IE;
  
  function getStorage(element) {
    if (!(element = $(element))) return;
    
    var uid = getUniqueElementID(element);
    
    if (!Element.Storage[uid])
      Element.Storage[uid] = $H();
      
    return Element.Storage[uid];
  }
  
  function store(element, key, value) {
    if (!(element = $(element))) return;
    var storage = getStorage(element);
    if (arguments.length === 2) {
      // Assume we've been passed an object full of key/value pairs.
      storage.update(key);
    } else {
      storage.set(key, value);
    }
    return element;
  }
  
  function retrieve(element, key, defaultValue) {
    if (!(element = $(element))) return;
    var storage = getStorage(element), value = storage.get(key);
    
    if (Object.isUndefined(value)) {
      storage.set(key, defaultValue);
      value = defaultValue;
    }
    
    return value;
  }
  
  
  Object.extend(methods, {
    getStorage: getStorage,
    store:      store,
    retrieve:   retrieve
  });
  
  
  // ELEMENT EXTENSION
  var Methods = {}, ByTag = Element.Methods.ByTag,
   F = Prototype.BrowserFeatures;
  
  // Handle environments which support extending element prototypes
  // but don't expose the standard class name.
  if (!F.ElementExtensions && ('__proto__' in DIV)) {
    GLOBAL.HTMLElement = {};
    GLOBAL.HTMLElement.prototype = DIV['__proto__'];
    F.ElementExtensions = true;
  }
  
  // Certain oddball element types can't be extended in IE8.
  function checkElementPrototypeDeficiency(tagName) {
    if (typeof window.Element === 'undefined') return false;
    var proto = window.Element.prototype;
    if (proto) {
      var id = '_' + (Math.random() + '').slice(2),
       el = document.createElement(tagName);
      proto[id] = 'x';
      var isBuggy = (el[id] !== 'x');
      delete proto[id];
      el = null;
      return isBuggy;
    }
    
    return false;    
  }
  
  var HTMLOBJECTELEMENT_PROTOTYPE_BUGGY = 
   checkElementPrototypeDeficiency('object');
  
  function extendElementWith(element, methods) {
    for (var property in methods) {
      var value = methods[property];
      if (Object.isFunction(value) && !(property in element))
        element[property] = value.methodize();
    }
  }
  
  // Keeps track of the UIDs of extended elements.
  var EXTENDED = {};
  function elementIsExtended(element) {
    var uid = getUniqueElementID(element);
    return (uid in EXTENDED);
  }
  
  function extend(element) {
    if (!element || elementIsExtended(element)) return element;
    if (element.nodeType !== Node.ELEMENT_NODE || element == window)
      return element;
      
    var methods = Object.clone(Methods),
     tagName = element.tagName.toUpperCase();
     
    // Add methods for specific tags.
    if (ByTag[tagName]) Object.extend(methods, ByTag[tagName]);
    
    extendElementWith(element, methods);
    EXTENDED[getUniqueElementID(element)] = true;
    return element;
  }
  
  // Because of the deficiency mentioned above, IE8 needs a very thin version
  // of Element.extend that acts like Prototype.K _except_ when the element
  // is one of the problematic types.
  function extend_IE8(element) {
    if (!element || elementIsExtended(element)) return element;
    
    var t = element.tagName;
    if (t && (/^(?:object|applet|embed)$/i.test(t))) {
      extendElementWith(element, Element.Methods);
      extendElementWith(element, Element.Methods.Simulated);
      extendElementWith(element, Element.Methods.ByTag[t.toUpperCase()]);
    }
    
    return element;
  }
  // If the browser lets us extend specific elements, we can replace `extend`
  // with a thinner version (or, ideally, an empty version).
  if (F.SpecificElementExtensions) {
    extend = HTMLOBJECTELEMENT_PROTOTYPE_BUGGY ? extend_IE8 : Prototype.K;
  }
  
  function addMethodsToTagName(tagName, methods) {
    tagName = tagName.toUpperCase();
    if (!ByTag[tagName]) ByTag[tagName] = {};
    Object.extend(ByTag[tagName], methods);
  }
  
  function mergeMethods(destination, methods, onlyIfAbsent) {
    if (Object.isUndefined(onlyIfAbsent)) onlyIfAbsent = false;
    for (var property in methods) {
      var value = methods[property];
      if (!Object.isFunction(value)) continue;
      if (!onlyIfAbsent || !(property in destination))
        destination[property] = value.methodize();
    }
  }
  
  function findDOMClass(tagName) {
    var klass;
    var trans = {
      "OPTGROUP": "OptGroup", "TEXTAREA": "TextArea", "P": "Paragraph",
      "FIELDSET": "FieldSet", "UL": "UList", "OL": "OList", "DL": "DList",
      "DIR": "Directory", "H1": "Heading", "H2": "Heading", "H3": "Heading",
      "H4": "Heading", "H5": "Heading", "H6": "Heading", "Q": "Quote",
      "INS": "Mod", "DEL": "Mod", "A": "Anchor", "IMG": "Image", "CAPTION":
      "TableCaption", "COL": "TableCol", "COLGROUP": "TableCol", "THEAD":
      "TableSection", "TFOOT": "TableSection", "TBODY": "TableSection", "TR":
      "TableRow", "TH": "TableCell", "TD": "TableCell", "FRAMESET":
      "FrameSet", "IFRAME": "IFrame"
    };
    if (trans[tagName]) klass = 'HTML' + trans[tagName] + 'Element';
    if (window[klass]) return window[klass];
    klass = 'HTML' + tagName + 'Element';
    if (window[klass]) return window[klass];
    klass = 'HTML' + tagName.capitalize() + 'Element';
    if (window[klass]) return window[klass];
    var element = document.createElement(tagName),
     proto = element['__proto__'] || element.constructor.prototype;
        
    element = null;
    return proto;
  }
  
  function addMethods(methods) {
    if (arguments.length === 0) addFormMethods();
    
    if (arguments.length === 2) {
      // Tag names have been specified.
      var tagName = methods;
      methods = arguments[1];
    }
    
    if (!tagName) {
      Object.extend(Element.Methods, methods || {});
    } else {
      if (Object.isArray(tagName)) {
        for (var i = 0, tag; tag = tagName[i]; i++)
          addMethodsToTagName(tag, methods);
      } else {
        addMethodsToTagName(tagName, methods);
      }
    }
    
    var ELEMENT_PROTOTYPE = window.HTMLElement ? HTMLElement.prototype :
     Element.prototype;
     
    if (F.ElementExtensions) {
      mergeMethods(ELEMENT_PROTOTYPE, Element.Methods);
      mergeMethods(ELEMENT_PROTOTYPE, Element.Methods.Simulated, true);
    }
    
    if (F.SpecificElementExtensions) {
      for (var tag in Element.Methods.ByTag) {
        var klass = findDOMClass(tag);
        if (Object.isUndefined(klass)) continue;
        mergeMethods(klass.prototype, ByTag[tag]);
      }
    }
    
    Object.extend(Element, Element.Methods);
    Object.extend(Element, Element.Methods.Simulated);
    delete Element.ByTag;
    delete Element.Simulated;
    
    Element.extend.refresh();
    
    // We need to replace the element creation cache because the nodes in the
    // cache now have stale versions of the element methods.
    ELEMENT_CACHE = {};
  }
  
  Object.extend(GLOBAL.Element, {
    extend:     extend,
    addMethods: addMethods
  });
  
  if (extend === Prototype.K) {
    GLOBAL.Element.extend.refresh = Prototype.emptyFunction;
  } else {
    GLOBAL.Element.extend.refresh = function() {
      if (Prototype.BrowserFeatures.ElementExtensions) return;
      Object.extend(Methods, Element.Methods);
      Object.extend(Methods, Element.Methods.Simulated);
      // All existing extended elements are stale and need to be refreshed.
      EXTENDED = {};
    };
  }
  
  function addFormMethods() {
    // Add relevant element methods from the forms API.
    Object.extend(Form, Form.Methods);
    Object.extend(Form.Element, Form.Element.Methods);
    Object.extend(Element.Methods.ByTag, {
      "FORM":     Object.clone(Form.Methods),
      "INPUT":    Object.clone(Form.Element.Methods),
      "SELECT":   Object.clone(Form.Element.Methods),
      "TEXTAREA": Object.clone(Form.Element.Methods),
      "BUTTON":   Object.clone(Form.Element.Methods)
    });
  }
  Element.addMethods(methods);
  // Prevent IE leaks on DIV and ELEMENT_CACHE
  function destroyCache_IE() {
    DIV = null;
    ELEMENT_CACHE = null;
  }
  if (window.attachEvent)
    window.attachEvent('onunload', destroyCache_IE);
})(this);
(function() {
  
  // Converts a CSS percentage value to a decimal.
  // Ex: toDecimal("30%"); // -> 0.3
  function toDecimal(pctString) {
    var match = pctString.match(/^(\d+)%?$/i);
    if (!match) return null;
    return (Number(match[1]) / 100);
  }
  
  // A bare-bones version of Element.getStyle. Needed because getStyle is
  // public-facing and too user-friendly for our tastes. We need raw,
  // non-normalized values.
  //
  // Camel-cased property names only.
  function getRawStyle(element, style) {
    element = $(element);
    // Try inline styles first.
    var value = element.style[style];
    if (!value || value === 'auto') {
      // Reluctantly retrieve the computed style.
      var css = document.defaultView.getComputedStyle(element, null);
      value = css ? css[style] : null;
    }
    
    if (style === 'opacity') return value ? parseFloat(value) : 1.0;
    return value === 'auto' ? null : value;
  }
  
  function getRawStyle_IE(element, style) {
    // Try inline styles first.
    var value = element.style[style];    
    if (!value && element.currentStyle) {
      // Reluctantly retrieve the current style.
      value = element.currentStyle[style];
    }
    return value;
  }
  
  // Quickly figures out the content width of an element. Used instead of
  // `element.measure('width')` in several places below; we don't want to 
  // call back into layout code recursively if we don't have to.
  //
  // But this means it doesn't handle edge cases. Use it when you know the
  // element in question is visible and will give accurate measurements.
  function getContentWidth(element, context) {
    var boxWidth = element.offsetWidth;
    
    var bl = getPixelValue(element, 'borderLeftWidth',  context) || 0;
    var br = getPixelValue(element, 'borderRightWidth', context) || 0;
    var pl = getPixelValue(element, 'paddingLeft',      context) || 0;
    var pr = getPixelValue(element, 'paddingRight',     context) || 0;
    
    return boxWidth - bl - br - pl - pr;
  }
  
  if ('currentStyle' in document.documentElement) {
    getRawStyle = getRawStyle_IE;
  }
  
  
  // Can be called like this:
  //   getPixelValue("11px");
  // Or like this:
  //   getPixelValue(someElement, 'paddingTop');  
  function getPixelValue(value, property, context) {
    var element = null;
    if (Object.isElement(value)) {
      element = value;
      value = getRawStyle(element, property);
    }
    if (value === null || Object.isUndefined(value)) {
      return null;
    }
    
    // Non-IE browsers will always return pixels if possible.
    // (We use parseFloat instead of parseInt because Firefox can return
    // non-integer pixel values.)
    if ((/^(?:-)?\d+(\.\d+)?(px)?$/i).test(value)) {
      return window.parseFloat(value);
    }
    var isPercentage = value.include('%'), isViewport = (context === document.viewport);
    
    // When IE gives us something other than a pixel value, this technique
    // (invented by Dean Edwards) will convert it to pixels.
    //
    // (This doesn't work for percentage values on elements with `position: fixed`
    // because those percentages are relative to the viewport.)
    if (/\d/.test(value) && element && element.runtimeStyle && !(isPercentage && isViewport)) {
      var style = element.style.left, rStyle = element.runtimeStyle.left; 
      element.runtimeStyle.left = element.currentStyle.left;
      element.style.left = value || 0;  
      value = element.style.pixelLeft;
      element.style.left = style;
      element.runtimeStyle.left = rStyle;
      
      return value;
    }
    // For other browsers, we have to do a bit of work.
    // (At this point, only percentages should be left; all other CSS units
    // are converted to pixels by getComputedStyle.)
    if (element && isPercentage) {
      // The `context` argument comes into play for percentage units; it's
      // the thing that the unit represents a percentage of. When an
      // absolutely-positioned element has a width of 50%, we know that's
      // 50% of its offset parent. If it's `position: fixed` instead, we know
      // it's 50% of the viewport. And so on.
      context = context || element.parentNode;
      var decimal = toDecimal(value), whole = null;
      
      var isHorizontal = property.include('left') || property.include('right') ||
       property.include('width');
       
      var isVertical   = property.include('top') || property.include('bottom') ||
        property.include('height');
        
      if (context === document.viewport) {
        if (isHorizontal) {
          whole = document.viewport.getWidth();
        } else if (isVertical) {
          whole = document.viewport.getHeight();
        }
      } else {
        if (isHorizontal) {
          whole = $(context).measure('width');
        } else if (isVertical) {
          whole = $(context).measure('height');
        }
      }
      
      return (whole === null) ? 0 : whole * decimal;
    }
    
    // If we get this far, we should probably give up.
    return 0;
  }
  
  // Turns plain numbers into pixel measurements.
  function toCSSPixels(number) {
    if (Object.isString(number) && number.endsWith('px'))
      return number;
    return number + 'px';    
  }
  
  // Shortcut for figuring out if an element is `display: none` or not.
  function isDisplayed(element) {
    while (element && element.parentNode) {
      var display = element.getStyle('display');
      if (display === 'none') {
        return false;
      }
      element = $(element.parentNode);
    }
    return true;
  }
  
  // In IE6-7, positioned elements often need hasLayout triggered before they
  // report accurate measurements.
  var hasLayout = Prototype.K;  
  if ('currentStyle' in document.documentElement) {
    hasLayout = function(element) {
      if (!element.currentStyle.hasLayout) {
        element.style.zoom = 1;
      }
      return element;
    };
  }
  // Converts the layout hash property names back to the CSS equivalents.
  // For now, only the border properties differ.
  function cssNameFor(key) {
    if (key.include('border')) key = key + '-width';
    return key.camelize();
  }
  
  Element.Layout = Class.create(Hash, {
    initialize: function($super, element, preCompute) {
      $super();
      this.element = $(element);
      
      // nullify all properties keys
      Element.Layout.PROPERTIES.each( function(property) {
        this._set(property, null);
      }, this);
      
      // The 'preCompute' boolean tells us whether we should fetch all values
      // at once. If so, we should do setup/teardown only once. We set a flag
      // so that we can ignore calls to `_begin` and `_end` elsewhere.
      if (preCompute) {
        this._preComputing = true;
        this._begin();
        Element.Layout.PROPERTIES.each( this._compute, this );
        this._end();
        this._preComputing = false;
      }
    },
    
    _set: function(property, value) {
      return Hash.prototype.set.call(this, property, value);
    },    
    
    // TODO: Investigate.
    set: function(property, value) {
      throw "Properties of Element.Layout are read-only.";
    },
    
    get: function($super, property) {
      // Try to fetch from the cache.
      var value = $super(property);
      return value === null ? this._compute(property) : value;
    },
    
    // `_begin` and `_end` are two functions that are called internally 
    // before and after any measurement is done. In certain conditions (e.g.,
    // when hidden), elements need a "preparation" phase that ensures
    // accuracy of measurements.
    _begin: function() {
      if (this._isPrepared()) return;
      
      var element = this.element;
      if (isDisplayed(element)) {
        this._setPrepared(true);
        return;
      }
      
      // If we get this far, it means this element is hidden. To get usable
      // measurements, we must remove `display: none`, but in a manner that 
      // isn't noticeable to the user. That means we also set
      // `visibility: hidden` to make it invisible, and `position: absolute`
      // so that it won't alter the document flow when displayed.
      //
      // Once we do this, the element is "prepared," and we can make our
      // measurements. When we're done, the `_end` method cleans up our
      // changes.
      
      // Remember the original values for some styles we're going to alter.
      var originalStyles = {
        position:   element.style.position   || '',
        width:      element.style.width      || '',
        visibility: element.style.visibility || '',
        display:    element.style.display    || ''
      };
      
      // We store them so that the `_end` method can retrieve them later.
      element.store('prototype_original_styles', originalStyles);
      
      var position = getRawStyle(element, 'position'), width = element.offsetWidth;
      if (width === 0 || width === null) {
        // Opera/IE won't report the true width of the element through
        // `getComputedStyle` if it's hidden. If we got a nonsensical value,
        // we need to show the element and try again.
        element.style.display = 'block';
        width = element.offsetWidth;
      }
      
      // Preserve the context in case we get a percentage value.  
      var context = (position === 'fixed') ? document.viewport :
       element.parentNode;
       
      var tempStyles = {
        visibility: 'hidden',
        display:    'block'
      };
      
      // If the element's `position: fixed`, it's already out of the document
      // flow, so it's both unnecessary and inaccurate to set
      // `position: absolute`.
      if (position !== 'fixed') tempStyles.position = 'absolute';
       
      element.setStyle(tempStyles);
      
      var positionedWidth = element.offsetWidth, newWidth;
      if (width && (positionedWidth === width)) {
        // If the element's width is the same both before and after
        // we set absolute positioning, that means:
        //  (a) it was already absolutely-positioned; or
        //  (b) it has an explicitly-set width, instead of width: auto.
        // Either way, it means the element is the width it needs to be
        // in order to report an accurate height.
        newWidth = getContentWidth(element, context);
      } else if (position === 'absolute' || position === 'fixed') {
        // Absolute- and fixed-position elements' dimensions don't depend
        // upon those of their parents.
        newWidth = getContentWidth(element, context);
      } else {
        // Otherwise, the element's width depends upon the width of its
        // parent.
        var parent = element.parentNode, pLayout = $(parent).getLayout();
        newWidth = pLayout.get('width') -
         this.get('margin-left') -
         this.get('border-left') -
         this.get('padding-left') -
         this.get('padding-right') -
         this.get('border-right') -
         this.get('margin-right');
      }
      
      // Whatever the case, we've now figured out the correct `width` value
      // for the element.
      element.setStyle({ width: newWidth + 'px' });
      
      // The element is now ready for measuring.
      this._setPrepared(true);
    },
    
    _end: function() {
      var element = this.element;
      var originalStyles = element.retrieve('prototype_original_styles');
      element.store('prototype_original_styles', null);
      element.setStyle(originalStyles);
      this._setPrepared(false);
    },
    
    _compute: function(property) {
      var COMPUTATIONS = Element.Layout.COMPUTATIONS;
      if (!(property in COMPUTATIONS)) {
        throw "Property not found.";
      }
      
      return this._set(property, COMPUTATIONS[property].call(this, this.element));
    },
    
    _isPrepared: function() {
      return this.element.retrieve('prototype_element_layout_prepared', false);
    },
    
    _setPrepared: function(bool) {
      return this.element.store('prototype_element_layout_prepared', bool);
    },
    
    toObject: function() {
      var args = $A(arguments);
      var keys = (args.length === 0) ? Element.Layout.PROPERTIES :
       args.join(' ').split(' ');
      var obj = {};
      keys.each( function(key) {
        // Key needs to be a valid Element.Layout property.
        if (!Element.Layout.PROPERTIES.include(key)) return;
        var value = this.get(key);
        if (value != null) obj[key] = value;
      }, this);
      return obj;
    },
    
    toHash: function() {
      var obj = this.toObject.apply(this, arguments);
      return new Hash(obj);
    },
    
    toCSS: function() {
      var args = $A(arguments);
      var keys = (args.length === 0) ? Element.Layout.PROPERTIES :
       args.join(' ').split(' ');
      var css = {};
      keys.each( function(key) {
        // Key needs to be a valid Element.Layout property...
        if (!Element.Layout.PROPERTIES.include(key)) return;        
        // ...but not a composite property.
        if (Element.Layout.COMPOSITE_PROPERTIES.include(key)) return;
        var value = this.get(key);
        if (value != null) css[cssNameFor(key)] = value + 'px';
      }, this);
      return css;
    },
    
    inspect: function() {
      return "#<Element.Layout>";
    }
  });
  
  Object.extend(Element.Layout, {
    PROPERTIES: $w('height width top left right bottom border-left border-right border-top border-bottom padding-left padding-right padding-top padding-bottom margin-top margin-bottom margin-left margin-right padding-box-width padding-box-height border-box-width border-box-height margin-box-width margin-box-height'),
    
    COMPOSITE_PROPERTIES: $w('padding-box-width padding-box-height margin-box-width margin-box-height border-box-width border-box-height'),
    
    COMPUTATIONS: {
      'height': function(element) {
        if (!this._preComputing) this._begin();
        
        var bHeight = this.get('border-box-height');
        if (bHeight <= 0) {
          if (!this._preComputing) this._end();
          return 0;
        }
        
        var bTop = this.get('border-top'),
         bBottom = this.get('border-bottom');
        var pTop = this.get('padding-top'),
         pBottom = this.get('padding-bottom');
        if (!this._preComputing) this._end();
        return bHeight - bTop - bBottom - pTop - pBottom;
      },
      
      'width': function(element) {
        if (!this._preComputing) this._begin();
        
        var bWidth = this.get('border-box-width');
        if (bWidth <= 0) {
          if (!this._preComputing) this._end();
          return 0;
        }
        var bLeft = this.get('border-left'),
         bRight = this.get('border-right');
        var pLeft = this.get('padding-left'),
         pRight = this.get('padding-right');
         
        if (!this._preComputing) this._end();
        return bWidth - bLeft - bRight - pLeft - pRight;
      },
      
      'padding-box-height': function(element) {
        var height = this.get('height'),
         pTop = this.get('padding-top'),
         pBottom = this.get('padding-bottom');
         
        return height + pTop + pBottom;
      },
      'padding-box-width': function(element) {
        var width = this.get('width'),
         pLeft = this.get('padding-left'),
         pRight = this.get('padding-right');
         
        return width + pLeft + pRight;
      },
      
      'border-box-height': function(element) {
        if (!this._preComputing) this._begin();
        var height = element.offsetHeight;
        if (!this._preComputing) this._end();
        return height;
      },
            
      'border-box-width': function(element) {
        if (!this._preComputing) this._begin();
        var width = element.offsetWidth;
        if (!this._preComputing) this._end();
        return width;
      },
      
      'margin-box-height': function(element) {
        var bHeight = this.get('border-box-height'),
         mTop = this.get('margin-top'),
         mBottom = this.get('margin-bottom');
         
        if (bHeight <= 0) return 0;
         
        return bHeight + mTop + mBottom;        
      },
      'margin-box-width': function(element) {
        var bWidth = this.get('border-box-width'),
         mLeft = this.get('margin-left'),
         mRight = this.get('margin-right');
        if (bWidth <= 0) return 0;
         
        return bWidth + mLeft + mRight;
      },
      
      'top': function(element) {
        var offset = element.positionedOffset();
        return offset.top;
      },
      
      'bottom': function(element) {
        var offset = element.positionedOffset(),
         parent = element.getOffsetParent(),
         pHeight = parent.measure('height');
        
        var mHeight = this.get('border-box-height');
        
        return pHeight - mHeight - offset.top;
        // 
        // return getPixelValue(element, 'bottom');
      },
      
      'left': function(element) {
        var offset = element.positionedOffset();
        return offset.left;
      },
      
      'right': function(element) {
        var offset = element.positionedOffset(),
         parent = element.getOffsetParent(),
         pWidth = parent.measure('width');
        
        var mWidth = this.get('border-box-width');
        
        return pWidth - mWidth - offset.left;
        //  
        // return getPixelValue(element, 'right');
      },
      
      'padding-top': function(element) {
        return getPixelValue(element, 'paddingTop');
      },
      
      'padding-bottom': function(element) {
        return getPixelValue(element, 'paddingBottom');
      },
      
      'padding-left': function(element) {
        return getPixelValue(element, 'paddingLeft');
      },
      
      'padding-right': function(element) {
        return getPixelValue(element, 'paddingRight');
      },
      
      'border-top': function(element) {
        return getPixelValue(element, 'borderTopWidth');
      },
      
      'border-bottom': function(element) {
        return getPixelValue(element, 'borderBottomWidth');
      },
      
      'border-left': function(element) {
        return getPixelValue(element, 'borderLeftWidth');
      },
      
      'border-right': function(element) {
        return getPixelValue(element, 'borderRightWidth');
      },
      
      'margin-top': function(element) {
        return getPixelValue(element, 'marginTop');
      },
      
      'margin-bottom': function(element) {
        return getPixelValue(element, 'marginBottom');
      },
      
      'margin-left': function(element) {
        return getPixelValue(element, 'marginLeft');
      },
      
      'margin-right': function(element) {
        return getPixelValue(element, 'marginRight');
      }
    }
  });
  
  // An easier way to compute right and bottom offsets.
  if ('getBoundingClientRect' in document.documentElement) {
    Object.extend(Element.Layout.COMPUTATIONS, {
      'right': function(element) {
        var parent = hasLayout(element.getOffsetParent());
        var rect = element.getBoundingClientRect(),
         pRect = parent.getBoundingClientRect();
         
        return (pRect.right - rect.right).round();
      },
      
      'bottom': function(element) {
        var parent = hasLayout(element.getOffsetParent());
        var rect = element.getBoundingClientRect(),
         pRect = parent.getBoundingClientRect();
         
        return (pRect.bottom - rect.bottom).round();
      }
    });
  }
  
  Element.Offset = Class.create({
    initialize: function(left, top) {
      this.left = left.round();
      this.top  = top.round();
      
      // Act like an array.
      this[0] = this.left;
      this[1] = this.top;
    },
    
    relativeTo: function(offset) {
      return new Element.Offset(
        this.left - offset.left, 
        this.top  - offset.top
      );
    },
    
    inspect: function() {
      return "#<Element.Offset left: #{left} top: #{top}>".interpolate(this);
    },
    
    toString: function() {
      return "[#{left}, #{top}]".interpolate(this);
    },
    
    toArray: function() {
      return [this.left, this.top];
    }
  });
  
  function getLayout(element, preCompute) {
    return new Element.Layout(element, preCompute);
  }
    
  function measure(element, property) {
    return $(element).getLayout().get(property);  
  }
  function getHeight(element) {
    return Element.getDimensions(element).height;
  }
  
  function getWidth(element) {
    return Element.getDimensions(element).width;
  }
  function getDimensions(element) {
    element = $(element);
    var display = Element.getStyle(element, 'display');
    
    if (display && display !== 'none') {
      return { width: element.offsetWidth, height: element.offsetHeight };
    }
    
    // All *Width and *Height properties give 0 on elements with
    // `display: none`, so show the element temporarily.
    var style = element.style;
    var originalStyles = {
      visibility: style.visibility,
      position:   style.position,
      display:    style.display
    };
    
    var newStyles = {
      visibility: 'hidden',
      display:    'block'
    };
    // Switching `fixed` to `absolute` causes issues in Safari.
    if (originalStyles.position !== 'fixed')
      newStyles.position = 'absolute';
    
    Element.setStyle(element, newStyles);
    
    var dimensions = {
      width:  element.offsetWidth,
      height: element.offsetHeight
    };
    
    Element.setStyle(element, originalStyles);
    return dimensions;
  }
  
  function getOffsetParent(element) {
    element = $(element);
    
    // For unusual cases like these, we standardize on returning the BODY
    // element as the offset parent.
    if (isDocument(element) || isDetached(element) || isBody(element) || isHtml(element))
      return $(document.body);
    // IE reports offset parent incorrectly for inline elements.
    var isInline = (Element.getStyle(element, 'display') === 'inline');
    if (!isInline && element.offsetParent) return isHtml(element.offsetParent) ? $(document.body) : $(element.offsetParent);
    
    while ((element = element.parentNode) && element !== document.body) {
      if (Element.getStyle(element, 'position') !== 'static') {
        return isHtml(element) ? $(document.body) : $(element);
      }
    }
    
    return $(document.body);
  }
  
  
  function cumulativeOffset(element) {
    element = $(element);
    var valueT = 0, valueL = 0;
    if (element.parentNode) {
      do {
        valueT += element.offsetTop  || 0;
        valueL += element.offsetLeft || 0;
        element = element.offsetParent;
      } while (element);
    }
    return new Element.Offset(valueL, valueT);
  }
  
  function positionedOffset(element) {    
    element = $(element);
    // Account for the margin of the element.
    var layout = element.getLayout();
    
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
      if (element) {
        if (isBody(element)) break;
        var p = Element.getStyle(element, 'position');
        if (p !== 'static') break;
      }
    } while (element);
    
    valueT -= layout.get('margin-top');
    valueL -= layout.get('margin-left');
    
    return new Element.Offset(valueL, valueT);
  }
  function cumulativeScrollOffset(element) {
    var valueT = 0, valueL = 0;
    do {
      if(element == document.body){
        valueT += (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop || 0;
        valueL += (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft || 0;
        break;
      } else {
        valueT += element.scrollTop  || 0;
        valueL += element.scrollLeft || 0;
        element = element.parentNode;
      }
    } while (element);
    return new Element.Offset(valueL, valueT);
  }
  function viewportOffset(forElement) {
    var valueT = 0, valueL = 0, docBody = document.body;
    forElement = $(forElement);
    var element = forElement;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      // Safari fix
      if (element.offsetParent == docBody &&
        Element.getStyle(element, 'position') == 'absolute') break;
    } while (element = element.offsetParent);
    element = forElement;
    do {
      // Opera < 9.5 sets scrollTop/Left on both HTML and BODY elements.
      // Other browsers set it only on the HTML element. The BODY element
      // can be skipped since its scrollTop/Left should always be 0.
      if (element != docBody) {
        valueT -= element.scrollTop  || 0;
        valueL -= element.scrollLeft || 0;
      }
    } while (element = element.parentNode);    
    return new Element.Offset(valueL, valueT);
  }
  
  function absolutize(element) {
    element = $(element);
    
    if (Element.getStyle(element, 'position') === 'absolute') {
      return element;
    }
    
    var offsetParent = getOffsetParent(element);    
    var eOffset = element.viewportOffset(),
     pOffset = offsetParent.viewportOffset();
     
    var offset = eOffset.relativeTo(pOffset);
    var layout = element.getLayout();    
    
    element.store('prototype_absolutize_original_styles', {
      position: element.getStyle('position'),
      left:     element.getStyle('left'),
      top:      element.getStyle('top'),
      width:    element.getStyle('width'),
      height:   element.getStyle('height')
    });
    
    element.setStyle({
      position: 'absolute',
      top:    offset.top + 'px',
      left:   offset.left + 'px',
      width:  layout.get('width') + 'px',
      height: layout.get('height') + 'px'
    });
    
    return element;
  }
  
  function relativize(element) {
    element = $(element);
    if (Element.getStyle(element, 'position') === 'relative') {
      return element;
    }
    
    // Restore the original styles as captured by Element#absolutize.
    var originalStyles = 
     element.retrieve('prototype_absolutize_original_styles');
    
    if (originalStyles) element.setStyle(originalStyles);
    return element;
  }
  
  
  function scrollTo(element) {
    element = $(element);
    var pos = Element.cumulativeOffset(element);
    window.scrollTo(pos.left, pos.top);
    return element;
  }
  
  function makePositioned(element) {
    element = $(element);
    var position = Element.getStyle(element, 'position'), styles = {};
    if (position === 'static' || !position) {
      styles.position = 'relative';
      // When an element is `position: relative` with an undefined `top` and
      // `left`, Opera returns the offset relative to positioning context.
      if (Prototype.Browser.Opera) {
        styles.top  = 0;
        styles.left = 0;
      }
      Element.setStyle(element, styles);
      Element.store(element, 'prototype_made_positioned', true);
    }
    return element;
  }
  
  function undoPositioned(element) {
    element = $(element);
    var storage = Element.getStorage(element),
     madePositioned = storage.get('prototype_made_positioned');
    
    if (madePositioned) {
      storage.unset('prototype_made_positioned');
      Element.setStyle(element, {
        position: '',
        top:      '',
        bottom:   '',
        left:     '',
        right:    ''
      });
    }  
    return element;
  }
  
  function makeClipping(element) {
    element = $(element);
    
    var storage = Element.getStorage(element),
     madeClipping = storage.get('prototype_made_clipping');
    
    // The "prototype_made_clipping" storage key is meant to hold the
    // original CSS overflow value. A string value or `null` means that we've
    // called `makeClipping` already. An `undefined` value means we haven't.
    if (Object.isUndefined(madeClipping)) {
      var overflow = Element.getStyle(element, 'overflow');
      storage.set('prototype_made_clipping', overflow);
      if (overflow !== 'hidden')
        element.style.overflow = 'hidden';
    }
    
    return element;
  }
  
  function undoClipping(element) {
    element = $(element);
    var storage = Element.getStorage(element),
     overflow = storage.get('prototype_made_clipping');
    
    if (!Object.isUndefined(overflow)) {
      storage.unset('prototype_made_clipping');
      element.style.overflow = overflow || '';
    }
    
    return element;
  }
  
  function clonePosition(element, source, options) {
    options = Object.extend({
      setLeft:    true,
      setTop:     true,
      setWidth:   true,
      setHeight:  true,
      offsetTop:  0,
      offsetLeft: 0
    }, options || {});
    
    // Find page position of source.    
    source  = $(source);
    element = $(element);    
    var p, delta, layout, styles = {};
    if (options.setLeft || options.setTop) {
      p = Element.viewportOffset(source);
      delta = [0, 0];
      // A delta of 0/0 will work for `positioned: fixed` elements, but
      // for `position: absolute` we need to get the parent's offset.
      if (Element.getStyle(element, 'position') === 'absolute') {
        var parent = Element.getOffsetParent(element);
        if (parent !== document.body) delta = Element.viewportOffset(parent);
      }
    }
    if (options.setWidth || options.setHeight) {
      layout = Element.getLayout(source);
    }
    // Set position.
    if (options.setLeft)
      styles.left = (p[0] - delta[0] + options.offsetLeft) + 'px';
    if (options.setTop)
      styles.top  = (p[1] - delta[1] + options.offsetTop)  + 'px';
    
    if (options.setWidth)
      styles.width  = layout.get('border-box-width')  + 'px';
    if (options.setHeight)
      styles.height = layout.get('border-box-height') + 'px';
    
    return Element.setStyle(element, styles);
  }
  
    
  if (Prototype.Browser.IE) {
    // IE doesn't report offsets correctly for static elements, so we change them
    // to "relative" to get the values, then change them back.
    getOffsetParent = getOffsetParent.wrap(
      function(proceed, element) {
        element = $(element);
        
        // For unusual cases like these, we standardize on returning the BODY
        // element as the offset parent.
        if (isDocument(element) || isDetached(element) || isBody(element) || isHtml(element))
          return $(document.body);
        var position = element.getStyle('position');
        if (position !== 'static') return proceed(element);
        element.setStyle({ position: 'relative' });
        var value = proceed(element);
        element.setStyle({ position: position });
        return value;
      }
    );
    
    positionedOffset = positionedOffset.wrap(function(proceed, element) {
      element = $(element);
      if (!element.parentNode) return new Element.Offset(0, 0);
      var position = element.getStyle('position');
      if (position !== 'static') return proceed(element);
      // Trigger hasLayout on the offset parent so that IE6 reports
      // accurate offsetTop and offsetLeft values for position: fixed.
      var offsetParent = element.getOffsetParent();
      if (offsetParent && offsetParent.getStyle('position') === 'fixed')
        hasLayout(offsetParent);
      element.setStyle({ position: 'relative' });
      var value = proceed(element);
      element.setStyle({ position: position });
      return value;
    });
  } else if (Prototype.Browser.Webkit) {    
    // Safari returns margins on body which is incorrect if the child is absolutely
    // positioned.  For performance reasons, redefine Element#cumulativeOffset for
    // KHTML/WebKit only.
    cumulativeOffset = function(element) {
      element = $(element);
      var valueT = 0, valueL = 0;
      do {
        valueT += element.offsetTop  || 0;
        valueL += element.offsetLeft || 0;
        if (element.offsetParent == document.body) {
          if (Element.getStyle(element, 'position') == 'absolute') break;
        }
        element = element.offsetParent;
      } while (element);
      return new Element.Offset(valueL, valueT);
    };
  }
  
  
  Element.addMethods({
    getLayout:              getLayout,
    measure:                measure,
    getWidth:               getWidth,
    getHeight:              getHeight,
    getDimensions:          getDimensions,
    getOffsetParent:        getOffsetParent,
    cumulativeOffset:       cumulativeOffset,
    positionedOffset:       positionedOffset,
    cumulativeScrollOffset: cumulativeScrollOffset,
    viewportOffset:         viewportOffset,    
    absolutize:             absolutize,
    relativize:             relativize,
    scrollTo:               scrollTo,
    makePositioned:         makePositioned,
    undoPositioned:         undoPositioned,
    makeClipping:           makeClipping,
    undoClipping:           undoClipping,
    clonePosition:          clonePosition
  });
  
  function isBody(element) {
    return element.nodeName.toUpperCase() === 'BODY';
  }
  
  function isHtml(element) {
    return element.nodeName.toUpperCase() === 'HTML';
  }
  
  function isDocument(element) {
    return element.nodeType === Node.DOCUMENT_NODE;
  }
  
  function isDetached(element) {
    return element !== document.body &&
     !Element.descendantOf(element, document.body);
  }
  
  // If the browser supports the nonstandard `getBoundingClientRect`
  // (currently only IE and Firefox), it becomes far easier to obtain
  // true offsets.
  if ('getBoundingClientRect' in document.documentElement) {
    Element.addMethods({
      viewportOffset: function(element) {
        element = $(element);        
        if (isDetached(element)) return new Element.Offset(0, 0);
        var rect = element.getBoundingClientRect(),
         docEl = document.documentElement;
        // The HTML element on IE < 8 has a 2px border by default, giving
        // an incorrect offset. We correct this by subtracting clientTop
        // and clientLeft.
        return new Element.Offset(rect.left - docEl.clientLeft,
         rect.top - docEl.clientTop);
      }
    }); 
  }
  
  
})();
(function() {
  
  var IS_OLD_OPERA = Prototype.Browser.Opera &&
   (window.parseFloat(window.opera.version()) < 9.5);
  var ROOT = null;
  function getRootElement() {
    if (ROOT) return ROOT;    
    ROOT = IS_OLD_OPERA ? document.body : document.documentElement;
    return ROOT;
  }
  function getDimensions() {
    return { width: this.getWidth(), height: this.getHeight() };
  }
  
  function getWidth() {
    return getRootElement().clientWidth;
  }
  
  function getHeight() {
    return getRootElement().clientHeight;
  }
  
  function getScrollOffsets() {
    var x = window.pageXOffset || document.documentElement.scrollLeft ||
     document.body.scrollLeft;
    var y = window.pageYOffset || document.documentElement.scrollTop ||
     document.body.scrollTop;
     
    return new Element.Offset(x, y);
  }
  
  document.viewport = {
    getDimensions:    getDimensions,
    getWidth:         getWidth,
    getHeight:        getHeight,
    getScrollOffsets: getScrollOffsets
  };
  
})();
window.$$ = function() {
  var expression = $A(arguments).join(', ');
  return Prototype.Selector.select(expression, document);
};
Prototype.Selector = (function() {
  
  function select() {
    throw new Error('Method "Prototype.Selector.select" must be defined.');
  }
  function match() {
    throw new Error('Method "Prototype.Selector.match" must be defined.');
  }
  function find(elements, expression, index) {
    index = index || 0;
    var match = Prototype.Selector.match, length = elements.length, matchIndex = 0, i;
    for (i = 0; i < length; i++) {
      if (match(elements[i], expression) && index == matchIndex++) {
        return Element.extend(elements[i]);
      }
    }
  }
  
  function extendElements(elements) {
    for (var i = 0, length = elements.length; i < length; i++) {
      Element.extend(elements[i]);
    }
    return elements;
  }
  
  
  var K = Prototype.K;
  
  return {
    select: select,
    match: match,
    find: find,
    extendElements: (Element.extend === K) ? K : extendElements,
    extendElement: Element.extend
  };
})();
/*!
 * Sizzle CSS Selector Engine v1.9.4-pre
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-06-03
 */
(function( window, undefined ) {
var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,
	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,
	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},
	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,
	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},
	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
	// Regular expressions
	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),
	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",
	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",
	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),
	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),
	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),
	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),
	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},
	rnative = /^[^{]+\{\s*\[native \w/,
	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,
	rescape = /'|\\/g,
	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?
		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :
		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}
function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;
	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}
	context = context || document;
	results = results || [];
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}
	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}
	if ( documentIsHTML && !seed ) {
		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}
			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;
			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}
		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;
			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );
				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";
				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}
			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}
	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}
function createCache() {
	var keys = [];
	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}
function assert( fn ) {
	var div = document.createElement("div");
	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;
	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );
	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}
	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}
	return a ? 1 : -1;
}
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;
			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};
support = Sizzle.support = {};
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;
	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}
	// Set our document
	document = doc;
	docElem = doc.documentElement;
	// Support tests
	documentIsHTML = !isXML( doc );
	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}
	/* Attributes
	---------------------------------------------------------------------- */
	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});
	/* getElement(s)By*
	---------------------------------------------------------------------- */
	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});
	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";
		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});
	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});
	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}
	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );
			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}
				return tmp;
			}
			return results;
		};
	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};
	/* QSA/matchesSelector
	---------------------------------------------------------------------- */
	// QSA and matchesSelector support
	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];
	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];
	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";
			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}
			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});
		assert(function( div ) {
			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );
			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}
			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}
			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}
	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {
		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}
	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );
	/* Contains
	---------------------------------------------------------------------- */
	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};
	/* Sorting
	---------------------------------------------------------------------- */
	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );
		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {
				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}
				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}
			return compare & 4 ? -1 : 1;
		}
		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;
		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}
		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}
		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}
		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :
			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};
	return doc;
};
Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};
Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}
	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );
	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {
		try {
			var ret = matches.call( elem, expr );
			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}
	return Sizzle( expr, document, null, [elem] ).length > 0;
};
Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};
Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}
	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;
	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};
Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;
	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );
	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}
	return results;
};
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;
	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes
	return ret;
};
Expr = Sizzle.selectors = {
	// Can be adjusted by the user
	cacheLength: 50,
	createPseudo: markFunction,
	match: matchExpr,
	attrHandle: {},
	find: {},
	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},
	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );
			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );
			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}
			return match.slice( 0, 4 );
		},
		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();
			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}
				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );
			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}
			return match;
		},
		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];
			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}
			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];
			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {
				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}
			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},
	filter: {
		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},
		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];
			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},
		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );
				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}
				result += "";
				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},
		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";
			return first === 1 && last === 0 ?
				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :
				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;
					if ( parent ) {
						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}
						start = [ forward ? parent.firstChild : parent.lastChild ];
						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {
								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}
						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];
						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {
								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}
									if ( node === elem ) {
										break;
									}
								}
							}
						}
						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},
		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );
			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}
			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}
			return fn;
		}
	},
	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );
			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;
					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),
		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),
		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),
		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {
						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),
		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},
		"root": function( elem ) {
			return elem === docElem;
		},
		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},
		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},
		"disabled": function( elem ) {
			return elem.disabled === true;
		},
		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},
		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			return elem.selected === true;
		},
		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},
		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},
		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},
		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},
		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},
		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},
		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),
		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),
		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),
		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),
		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),
		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),
		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};
Expr.pseudos["nth"] = Expr.pseudos["eq"];
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();
function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];
	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}
	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;
	while ( soFar ) {
		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}
		matched = false;
		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}
		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}
		if ( !matched ) {
			break;
		}
	}
	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}
function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}
function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;
	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :
		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;
			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}
function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}
function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;
	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}
	return newUnmatched;
}
function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,
			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),
			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,
			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?
					// ...intermediate processing is necessary
					[] :
					// ...otherwise use results directly
					results :
				matcherIn;
		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}
		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );
			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}
		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}
				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {
						seed[temp] = !(results[temp] = elem);
					}
				}
			}
		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}
function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,
		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];
	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );
			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}
	return elementMatcher( matchers );
}
function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);
			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}
			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}
				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}
					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}
			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}
				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}
					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}
				// Add matches to results
				push.apply( results, setMatched );
				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {
					Sizzle.uniqueSort( results );
				}
			}
			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}
			return unmatched;
		};
	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}
compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];
	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}
		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};
function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}
function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );
	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {
			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {
				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}
			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];
				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {
						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}
						break;
					}
				}
			}
		}
	}
	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;
support.detectDuplicates = hasDuplicate;
setDocument();
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}
if ( typeof define === "function" && define.amd ) {
	define(function() { return Sizzle; });
} else {
	window.Sizzle = Sizzle;
}
})( window );
Prototype._original_property = window.Sizzle;
;(function(engine) {
  var extendElements = Prototype.Selector.extendElements;
  function select(selector, scope) {
    return extendElements(engine(selector, scope || document));
  }
  function match(element, selector) {
    return engine.matches(selector, [element]).length == 1;
  }
  Prototype.Selector.engine = engine;
  Prototype.Selector.select = select;
  Prototype.Selector.match = match;
})(Sizzle);
window.Sizzle = Prototype._original_property;
delete Prototype._original_property;
var Form = {
  reset: function(form) {
    form = $(form);
    form.reset();
    return form;
  },
  serializeElements: function(elements, options) {
    // An earlier version accepted a boolean second parameter (hash) where
    // the default if omitted was false; respect that, but if they pass in an
    // options object (e.g., the new signature) but don't specify the hash option,
    // default true, as that's the new preferred approach.
    if (typeof options != 'object') options = { hash: !!options };
    else if (Object.isUndefined(options.hash)) options.hash = true;
    var key, value, submitted = false, submit = options.submit, accumulator, initial;
    
    if (options.hash) {
      initial = {};
      accumulator = function(result, key, value) {
        if (key in result) {
          if (!Object.isArray(result[key])) result[key] = [result[key]];
          result[key] = result[key].concat(value);
        } else result[key] = value;
        return result;
      };
    } else {
      initial = '';
      accumulator = function(result, key, values) {
        if (!Object.isArray(values)) {values = [values];}
        if (!values.length) {return result;}
        // According to the spec, spaces should be '+' rather than '%20'.
        var encodedKey = encodeURIComponent(key).gsub(/%20/, '+');
        return result + (result ? "&" : "") + values.map(function (value) {
          // Normalize newlines as \r\n because the HTML spec says newlines should
          // be encoded as CRLFs.
          value = value.gsub(/(\r)?\n/, '\r\n');
          value = encodeURIComponent(value);
          // According to the spec, spaces should be '+' rather than '%20'.
          value = value.gsub(/%20/, '+');
          return encodedKey + "=" + value;
        }).join("&");
      };
    }
    
    return elements.inject(initial, function(result, element) {
      if (!element.disabled && element.name) {
        key = element.name; value = $(element).getValue();
        if (value != null && element.type != 'file' && (element.type != 'submit' || (!submitted &&
            submit !== false && (!submit || key == submit) && (submitted = true)))) {
          result = accumulator(result, key, value);
        }
      }
      return result;
    });
  }
};
Form.Methods = {
  serialize: function(form, options) {
    return Form.serializeElements(Form.getElements(form), options);
  },
  
  getElements: function(form) {
    var elements = $(form).getElementsByTagName('*');
    var element, results = [], serializers = Form.Element.Serializers;
    
    for (var i = 0; element = elements[i]; i++) {
      if (serializers[element.tagName.toLowerCase()])
        results.push(Element.extend(element));
    }
    return results;
  },
  getInputs: function(form, typeName, name) {
    form = $(form);
    var inputs = form.getElementsByTagName('input');
    if (!typeName && !name) return $A(inputs).map(Element.extend);
    for (var i = 0, matchingInputs = [], length = inputs.length; i < length; i++) {
      var input = inputs[i];
      if ((typeName && input.type != typeName) || (name && input.name != name))
        continue;
      matchingInputs.push(Element.extend(input));
    }
    return matchingInputs;
  },
  disable: function(form) {
    form = $(form);
    Form.getElements(form).invoke('disable');
    return form;
  },
  enable: function(form) {
    form = $(form);
    Form.getElements(form).invoke('enable');
    return form;
  },
  findFirstElement: function(form) {
    var elements = $(form).getElements().findAll(function(element) {
      return 'hidden' != element.type && !element.disabled;
    });
    var firstByIndex = elements.findAll(function(element) {
      return element.hasAttribute('tabIndex') && element.tabIndex >= 0;
    }).sortBy(function(element) { return element.tabIndex }).first();
    return firstByIndex ? firstByIndex : elements.find(function(element) {
      return /^(?:input|select|textarea)$/i.test(element.tagName);
    });
  },
  focusFirstElement: function(form) {
    form = $(form);
    var element = form.findFirstElement();
    if (element) element.activate();
    return form;
  },
  request: function(form, options) {
    form = $(form), options = Object.clone(options || { });
    var params = options.parameters, action = form.readAttribute('action') || '';
    if (action.blank()) action = window.location.href;
    options.parameters = form.serialize(true);
    if (params) {
      if (Object.isString(params)) params = params.toQueryParams();
      Object.extend(options.parameters, params);
    }
    if (form.hasAttribute('method') && !options.method)
      options.method = form.method;
    return new Ajax.Request(action, options);
  }
};
/*--------------------------------------------------------------------------*/
Form.Element = {
  focus: function(element) {
    $(element).focus();
    return element;
  },
  select: function(element) {
    $(element).select();
    return element;
  }
};
Form.Element.Methods = {
  serialize: function(element) {
    element = $(element);
    if (!element.disabled && element.name) {
      var value = element.getValue();
      if (value != undefined) {
        var pair = { };
        pair[element.name] = value;
        return Object.toQueryString(pair);
      }
    }
    return '';
  },
  getValue: function(element) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    return Form.Element.Serializers[method](element);
  },
  setValue: function(element, value) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    Form.Element.Serializers[method](element, value);
    return element;
  },
  clear: function(element) {
    $(element).value = '';
    return element;
  },
  present: function(element) {
    return $(element).value != '';
  },
  activate: function(element) {
    element = $(element);
    try {
      element.focus();
      if (element.select && (element.tagName.toLowerCase() != 'input' ||
          !(/^(?:button|reset|submit)$/i.test(element.type))))
        element.select();
    } catch (e) { }
    return element;
  },
  disable: function(element) {
    element = $(element);
    element.disabled = true;
    return element;
  },
  enable: function(element) {
    element = $(element);
    element.disabled = false;
    return element;
  }
};
/*--------------------------------------------------------------------------*/
var Field = Form.Element;
var $F = Form.Element.Methods.getValue;
/*--------------------------------------------------------------------------*/
Form.Element.Serializers = (function() {
  function input(element, value) {
    switch (element.type.toLowerCase()) {
      case 'checkbox':
      case 'radio':
        return inputSelector(element, value);
      default:
        return valueSelector(element, value);
    }
  }
  
  function inputSelector(element, value) {
    if (Object.isUndefined(value))
      return element.checked ? element.value : null;
    else element.checked = !!value;    
  }
  
  function valueSelector(element, value) {
    if (Object.isUndefined(value)) return element.value;
    else element.value = value;
  }
  
  function select(element, value) {
    if (Object.isUndefined(value))
      return (element.type === 'select-one' ? selectOne : selectMany)(element);
       
    var opt, currentValue, single = !Object.isArray(value);
    for (var i = 0, length = element.length; i < length; i++) {
      opt = element.options[i];
      currentValue = this.optionValue(opt);
      if (single) {
        if (currentValue == value) {
          opt.selected = true;
          return;
        }
      }
      else opt.selected = value.include(currentValue);
    }
  }
  
  function selectOne(element) {
    var index = element.selectedIndex;
    return index >= 0 ? optionValue(element.options[index]) : null;
  }
  
  function selectMany(element) {
    var values, length = element.length;
    if (!length) return null;
    for (var i = 0, values = []; i < length; i++) {
      var opt = element.options[i];
      if (opt.selected) values.push(optionValue(opt));
    }
    return values;
  }
  
  function optionValue(opt) {
    return Element.hasAttribute(opt, 'value') ? opt.value : opt.text;
  }
  
  return {
    input:         input,
    inputSelector: inputSelector,
    textarea:      valueSelector,
    select:        select,
    selectOne:     selectOne,
    selectMany:    selectMany,
    optionValue:   optionValue,
    button:        valueSelector
  };
})();
/*--------------------------------------------------------------------------*/
Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
  initialize: function($super, element, frequency, callback) {
    $super(callback, frequency);
    this.element   = $(element);
    this.lastValue = this.getValue();
  },
  execute: function() {
    var value = this.getValue();
    if (Object.isString(this.lastValue) && Object.isString(value) ?
        this.lastValue != value : String(this.lastValue) != String(value)) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  }
});
Form.Element.Observer = Class.create(Abstract.TimedObserver, {
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});
Form.Observer = Class.create(Abstract.TimedObserver, {
  getValue: function() {
    return Form.serialize(this.element);
  }
});
/*--------------------------------------------------------------------------*/
Abstract.EventObserver = Class.create({
  initialize: function(element, callback) {
    this.element  = $(element);
    this.callback = callback;
    this.lastValue = this.getValue();
    if (this.element.tagName.toLowerCase() == 'form')
      this.registerFormCallbacks();
    else
      this.registerCallback(this.element);
  },
  onElementEvent: function() {
    var value = this.getValue();
    if (this.lastValue != value) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  },
  registerFormCallbacks: function() {
    Form.getElements(this.element).each(this.registerCallback, this);
  },
  registerCallback: function(element) {
    if (element.type) {
      switch (element.type.toLowerCase()) {
        case 'checkbox':
        case 'radio':
          Event.observe(element, 'click', this.onElementEvent.bind(this));
          break;
        default:
          Event.observe(element, 'change', this.onElementEvent.bind(this));
          break;
      }
    }
  }
});
Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});
Form.EventObserver = Class.create(Abstract.EventObserver, {
  getValue: function() {
    return Form.serialize(this.element);
  }
});
(function(GLOBAL) {
  var DIV = document.createElement('div');
  var docEl = document.documentElement;
  var MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED = 'onmouseenter' in docEl
   && 'onmouseleave' in docEl;
  
  var Event = {
    KEY_BACKSPACE: 8,
    KEY_TAB:       9,
    KEY_RETURN:   13,
    KEY_ESC:      27,
    KEY_LEFT:     37,
    KEY_UP:       38,
    KEY_RIGHT:    39,
    KEY_DOWN:     40,
    KEY_DELETE:   46,
    KEY_HOME:     36,
    KEY_END:      35,
    KEY_PAGEUP:   33,
    KEY_PAGEDOWN: 34,
    KEY_INSERT:   45
  };
  
  // We need to support three different event "modes":
  //  1. browsers with only DOM L2 Events (WebKit, FireFox);
  //  2. browsers with only IE's legacy events system (IE 6-8);
  //  3. browsers with _both_ systems (IE 9 and arguably Opera).
  //
  // Groups 1 and 2 are easy; group three is trickier.
  var isIELegacyEvent = function(event) { return false; };
  if (window.attachEvent) {
    if (window.addEventListener) {
      // Both systems are supported. We need to decide at runtime.
      // (Though Opera supports both systems, the event object appears to be
      // the same no matter which system is used. That means that this function
      // will always return `true` in Opera, but that's OK; it keeps us from
      // having to do a browser sniff.)
      isIELegacyEvent = function(event) {
        return !(event instanceof window.Event);
      };
    } else {
      // No support for DOM L2 events. All events will be legacy.
      isIELegacyEvent = function(event) { return true; };
    }
  }
  
  // The two systems have different ways of indicating which button was used
  // for a mouse event.
  var _isButton;
  function _isButtonForDOMEvents(event, code) {
    return event.which ? (event.which === code + 1) : (event.button === code);
  }
  var legacyButtonMap = { 0: 1, 1: 4, 2: 2 };
  function _isButtonForLegacyEvents(event, code) {
    return event.button === legacyButtonMap[code];
  }
  // In WebKit we have to account for when the user holds down the "meta" key.
  function _isButtonForWebKit(event, code) {
    switch (code) {
      case 0: return event.which == 1 && !event.metaKey;
      case 1: return event.which == 2 || (event.which == 1 && event.metaKey);
      case 2: return event.which == 3;
      default: return false;
    }
  }
  if (window.attachEvent) {
    if (!window.addEventListener) {
      // Legacy IE events only.
      _isButton = _isButtonForLegacyEvents;      
    } else {
      // Both systems are supported; decide at runtime.
      _isButton = function(event, code) {
        return isIELegacyEvent(event) ? _isButtonForLegacyEvents(event, code) :
         _isButtonForDOMEvents(event, code);
      }
    }
  } else if (Prototype.Browser.WebKit) {
    _isButton = _isButtonForWebKit;
  } else {
    _isButton = _isButtonForDOMEvents;
  }
  
  function isLeftClick(event)   { return _isButton(event, 0) }
  function isMiddleClick(event) { return _isButton(event, 1) }
  function isRightClick(event)  { return _isButton(event, 2) }
  
  function element(event) {
    // The public version of `Event.element` is a thin wrapper around the
    // private `_element` method below. We do this so that we can use it
    // internally as `_element` without having to extend the node.
    return Element.extend(_element(event));
  }
  
  function _element(event) {
    event = Event.extend(event);
    var node = event.target, type = event.type,
     currentTarget = event.currentTarget;
    if (currentTarget && currentTarget.tagName) {
      // Firefox screws up the "click" event when moving between radio buttons
      // via arrow keys. It also screws up the "load" and "error" events on images,
      // reporting the document as the target instead of the original image.
      if (type === 'load' || type === 'error' ||
        (type === 'click' && currentTarget.tagName.toLowerCase() === 'input'
          && currentTarget.type === 'radio'))
            node = currentTarget;
    }
    // Fix a Safari bug where a text node gets passed as the target of an
    // anchor click rather than the anchor itself.
    return node.nodeType == Node.TEXT_NODE ? node.parentNode : node;
  }
  function findElement(event, expression) {
    var element = _element(event), selector = Prototype.Selector;
    if (!expression) return Element.extend(element);
    while (element) {
      if (Object.isElement(element) && selector.match(element, expression))
        return Element.extend(element);
      element = element.parentNode;
    }
  }
  
  function pointer(event) {
    return { x: pointerX(event), y: pointerY(event) };
  }
  function pointerX(event) {
    var docElement = document.documentElement,
     body = document.body || { scrollLeft: 0 };
    return event.pageX || (event.clientX +
      (docElement.scrollLeft || body.scrollLeft) -
      (docElement.clientLeft || 0));
  }
  function pointerY(event) {
    var docElement = document.documentElement,
     body = document.body || { scrollTop: 0 };
    return  event.pageY || (event.clientY +
       (docElement.scrollTop || body.scrollTop) -
       (docElement.clientTop || 0));
  }
  function stop(event) {
    Event.extend(event);
    event.preventDefault();
    event.stopPropagation();
    // Set a "stopped" property so that a custom event can be inspected
    // after the fact to determine whether or not it was stopped.
    event.stopped = true;
  }
  Event.Methods = {
    isLeftClick:   isLeftClick,
    isMiddleClick: isMiddleClick,
    isRightClick:  isRightClick,
    element:     element,
    findElement: findElement,
    pointer:  pointer,
    pointerX: pointerX,
    pointerY: pointerY,
    stop: stop
  };
  // Compile the list of methods that get extended onto Events.
  var methods = Object.keys(Event.Methods).inject({ }, function(m, name) {
    m[name] = Event.Methods[name].methodize();
    return m;
  });
  if (window.attachEvent) {
    // For IE's event system, we need to do some work to make the event
    // object behave like a standard event object.
    function _relatedTarget(event) {
      var element;
      switch (event.type) {
        case 'mouseover':
        case 'mouseenter':
          element = event.fromElement;
          break;
        case 'mouseout':
        case 'mouseleave':
          element = event.toElement;
          break;
        default:
          return null;
      }
      return Element.extend(element);
    }
    // These methods should be added _only_ to legacy IE event objects.
    var additionalMethods = {
      stopPropagation: function() { this.cancelBubble = true },
      preventDefault:  function() { this.returnValue = false },
      inspect: function() { return '[object Event]' }
    };
    // IE's method for extending events.
    Event.extend = function(event, element) {
      if (!event) return false;
      
      // If it's not a legacy event, it doesn't need extending.
      if (!isIELegacyEvent(event)) return event;
      // Mark this event so we know not to extend a second time.
      if (event._extendedByPrototype) return event;
      event._extendedByPrototype = Prototype.emptyFunction;
      
      var pointer = Event.pointer(event);
      // The optional `element` argument gives us a fallback value for the
      // `target` property in case IE doesn't give us through `srcElement`.
      Object.extend(event, {
        target: event.srcElement || element,
        relatedTarget: _relatedTarget(event),
        pageX:  pointer.x,
        pageY:  pointer.y
      });
      
      Object.extend(event, methods);
      Object.extend(event, additionalMethods);
      
      return event;
    };
  } else {
    // Only DOM events, so no manual extending necessary.
    Event.extend = Prototype.K;
  }
  
  if (window.addEventListener) {
    // In all browsers that support DOM L2 Events, we can augment
    // `Event.prototype` directly.
    Event.prototype = window.Event.prototype || document.createEvent('HTMLEvents').__proto__;
    Object.extend(Event.prototype, methods);
  }
  
  //
  // EVENT REGISTRY
  //
  var EVENT_TRANSLATIONS = {
    mouseenter: 'mouseover',
    mouseleave: 'mouseout'
  };
  
  function getDOMEventName(eventName) {
    return EVENT_TRANSLATIONS[eventName] || eventName;
  }
  
  if (MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED)
    getDOMEventName = Prototype.K;
  
  function getUniqueElementID(element) {
    if (element === window) return 0;
    // Need to use actual `typeof` operator to prevent errors in some
    // environments when accessing node expandos.
    if (typeof element._prototypeUID === 'undefined')
      element._prototypeUID = Element.Storage.UID++;
    return element._prototypeUID;
  }
  
  // In Internet Explorer, DOM nodes have a `uniqueID` property. Saves us
  // from inventing our own.
  function getUniqueElementID_IE(element) {
    if (element === window) return 0;
    // The document object's `uniqueID` property changes each time you read it.
    if (element == document) return 1;
    return element.uniqueID;
  }
  
  if ('uniqueID' in DIV)
    getUniqueElementID = getUniqueElementID_IE;
  function isCustomEvent(eventName) {
    return eventName.include(':');
  }
  Event._isCustomEvent = isCustomEvent;
  // These two functions take an optional UID as a second argument so that we
  // can skip lookup if we've already got the element's UID.
  function getRegistryForElement(element, uid) {
    var CACHE = GLOBAL.Event.cache;
    if (Object.isUndefined(uid))
      uid = getUniqueElementID(element);
    if (!CACHE[uid]) CACHE[uid] = { element: element };
    return CACHE[uid];
  }
  
  function destroyRegistryForElement(element, uid) {
    if (Object.isUndefined(uid))
      uid = getUniqueElementID(element);
    delete GLOBAL.Event.cache[uid];
  }
  
  // The `register` and `unregister` functions handle creating the responder
  // and managing an event registry. They _don't_ attach and detach the
  // listeners themselves.
  
  // Add an event to the element's event registry.
  function register(element, eventName, handler) {
    var registry = getRegistryForElement(element);
    if (!registry[eventName]) registry[eventName] = [];
    var entries = registry[eventName];
    // Make sure this handler isn't already attached.
    var i = entries.length;
    while (i--)
      if (entries[i].handler === handler) return null;
      
    var uid = getUniqueElementID(element);
    var responder = GLOBAL.Event._createResponder(uid, eventName, handler);
    var entry = {
      responder: responder,
      handler:   handler
    };
    entries.push(entry);    
    return entry;
  }
  
  // Remove an event from the element's event registry.
  function unregister(element, eventName, handler) {
    var registry = getRegistryForElement(element);
    var entries = registry[eventName];
    if (!entries) return;
    
    var i = entries.length, entry;
    while (i--) {
      if (entries[i].handler === handler) {
        entry = entries[i];
        break;
      }
    }
    
    // This handler wasn't in the collection, so it doesn't need to be
    // unregistered.
    if (!entry) return;
    // Remove the entry from the collection;
    var index = entries.indexOf(entry);
    entries.splice(index, 1);
    if (entries.length == 0) {
      stopObservingEventName(element, eventName);
    }
    return entry;
  }  
  
  
  //
  // EVENT OBSERVING
  //
  function observe(element, eventName, handler) {
    element = $(element);
    var entry = register(element, eventName, handler);
    
    if (entry === null) return element;
    var responder = entry.responder;    
    if (isCustomEvent(eventName))
      observeCustomEvent(element, eventName, responder);
    else
      observeStandardEvent(element, eventName, responder);
      
    return element;
  }
  
  function observeStandardEvent(element, eventName, responder) {
    var actualEventName = getDOMEventName(eventName);
    if (element.addEventListener) {
      element.addEventListener(actualEventName, responder, false);
    } else {
      element.attachEvent('on' + actualEventName, responder);
    }
  }
  
  function observeCustomEvent(element, eventName, responder) {
    if (element.addEventListener) {
      element.addEventListener('dataavailable', responder, false);
    } else {
      // We observe two IE-proprietarty events: one for custom events that
      // bubble and one for custom events that do not bubble.
      element.attachEvent('ondataavailable', responder);
      element.attachEvent('onlosecapture',   responder);
    }
  }
  
  function stopObserving(element, eventName, handler) {
    element = $(element);
    var handlerGiven = !Object.isUndefined(handler),
     eventNameGiven = !Object.isUndefined(eventName);
     
    if (!eventNameGiven && !handlerGiven) {
      stopObservingElement(element);
      return element;
    }
    
    if (!handlerGiven) {
      stopObservingEventName(element, eventName);
      return element;
    }
    
    var entry = unregister(element, eventName, handler);
    
    if (!entry) return element; 
    removeEvent(element, eventName, entry.responder);
    return element;
  }
  
  function stopObservingStandardEvent(element, eventName, responder) {
    var actualEventName = getDOMEventName(eventName);
    if (element.removeEventListener) {
      element.removeEventListener(actualEventName, responder, false);      
    } else {
      element.detachEvent('on' + actualEventName, responder);
    }
  }
  
  function stopObservingCustomEvent(element, eventName, responder) {
    if (element.removeEventListener) {
      element.removeEventListener('dataavailable', responder, false);
    } else {
      element.detachEvent('ondataavailable', responder);
      element.detachEvent('onlosecapture',   responder);
    }
  }
  
  // The `stopObservingElement` and `stopObservingEventName` functions are
  // for bulk removal of event listeners. We use them rather than recurse
  // back into `stopObserving` to avoid touching the registry more often than
  // necessary.
  // Stop observing _all_ listeners on an element.
  function stopObservingElement(element) {
    // Do a manual registry lookup because we don't want to create a registry
    // if one doesn't exist.
    var uid = getUniqueElementID(element), registry = GLOBAL.Event.cache[uid];
    // This way we can return early if there is no registry.
    if (!registry) return;
    destroyRegistryForElement(element, uid);
    var entries, i;
    for (var eventName in registry) {
      // Explicitly skip elements so we don't accidentally find one with a
      // `length` property.
      if (eventName === 'element') continue;
      entries = registry[eventName];
      i = entries.length;
      while (i--)
        removeEvent(element, eventName, entries[i].responder);
    }
  }
  
  // Stop observing all listeners of a certain event name on an element.
  function stopObservingEventName(element, eventName) {
    var registry = getRegistryForElement(element);
    var entries = registry[eventName];
    if (!entries) return;
    delete registry[eventName];
    
    var i = entries.length;
    while (i--)
      removeEvent(element, eventName, entries[i].responder);
    for (var name in registry) {
      if (name === 'element') continue;
      return; // There is another registered event
    }
    // No other events for the element, destroy the registry:
    destroyRegistryForElement(element);
  }
  
  function removeEvent(element, eventName, handler) {
    if (isCustomEvent(eventName))
      stopObservingCustomEvent(element, eventName, handler);
    else
      stopObservingStandardEvent(element, eventName, handler);
  }
  
  
  
  // FIRING CUSTOM EVENTS
  function getFireTarget(element) {
    if (element !== document) return element;
    if (document.createEvent && !element.dispatchEvent)
      return document.documentElement;
    return element;
  }
  
  function fire(element, eventName, memo, bubble) {
    element = getFireTarget($(element));
    if (Object.isUndefined(bubble)) bubble = true;      
    memo = memo || {};
      
    var event = fireEvent(element, eventName, memo, bubble);
    return Event.extend(event);
  }
  
  function fireEvent_DOM(element, eventName, memo, bubble) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent('dataavailable', bubble, true);
    
    event.eventName = eventName;
    event.memo = memo;
    
    element.dispatchEvent(event);
    return event;
  }
  
  function fireEvent_IE(element, eventName, memo, bubble) {
    var event = document.createEventObject();
    event.eventType = bubble ? 'ondataavailable' : 'onlosecapture';
    
    event.eventName = eventName;
    event.memo = memo;
    
    element.fireEvent(event.eventType, event);    
    return event;
  }
  
  var fireEvent = document.createEvent ? fireEvent_DOM : fireEvent_IE;
  
  
  // EVENT DELEGATION
  
  Event.Handler = Class.create({
    initialize: function(element, eventName, selector, callback) {
      this.element   = $(element);
      this.eventName = eventName;
      this.selector  = selector;
      this.callback  = callback;
      this.handler   = this.handleEvent.bind(this);
    },
    
    start: function() {
      Event.observe(this.element, this.eventName, this.handler);
      return this;
    },
    
    stop: function() {
      Event.stopObserving(this.element, this.eventName, this.handler);
      return this;
    },
    
    handleEvent: function(event) {
      var element = Event.findElement(event, this.selector);
      if (element) this.callback.call(this.element, event, element);
    }
  });
  
  function on(element, eventName, selector, callback) {
    element = $(element);
    if (Object.isFunction(selector) && Object.isUndefined(callback)) {
      callback = selector, selector = null;
    }
    
    return new Event.Handler(element, eventName, selector, callback).start();
  }
  
  Object.extend(Event, Event.Methods);
  Object.extend(Event, {
    fire:          fire,
    observe:       observe,
    stopObserving: stopObserving,
    on:            on
  });
  Element.addMethods({
    fire:          fire,
    observe:       observe,
    stopObserving: stopObserving,
    
    on:            on
  });
  Object.extend(document, {
    fire:          fire.methodize(),
    observe:       observe.methodize(),
    stopObserving: stopObserving.methodize(),
    
    on:            on.methodize(),
    loaded:        false
  });
  // Export to the global scope.
  if (GLOBAL.Event) Object.extend(window.Event, Event);
  else GLOBAL.Event = Event;
  
  GLOBAL.Event.cache = {};
    
  function destroyCache_IE() {
    GLOBAL.Event.cache = null;
  }
  
  if (window.attachEvent)
    window.attachEvent('onunload', destroyCache_IE);
    
  DIV = null;
  docEl = null;
})(this);
(function(GLOBAL) {  
  /* Code for creating leak-free event responders is based on work by
   John-David Dalton. */
  
  var docEl = document.documentElement;
  var MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED = 'onmouseenter' in docEl
    && 'onmouseleave' in docEl;
    
  function isSimulatedMouseEnterLeaveEvent(eventName) {
    return !MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED &&
     (eventName === 'mouseenter' || eventName === 'mouseleave');
  }
  
  // The functions for creating responders accept the element's UID rather
  // than the element itself. This way, there are _no_ DOM objects inside the
  // closure we create, meaning there's no need to unregister event listeners
  // on unload.
  function createResponder(uid, eventName, handler) {    
    if (Event._isCustomEvent(eventName))
      return createResponderForCustomEvent(uid, eventName, handler);      
    if (isSimulatedMouseEnterLeaveEvent(eventName))
      return createMouseEnterLeaveResponder(uid, eventName, handler);
    
    return function(event) {
      if (!Event.cache) return;
      
      var element = Event.cache[uid].element;
      Event.extend(event, element);
      handler.call(element, event);
    };
  }
  
  function createResponderForCustomEvent(uid, eventName, handler) {
    return function(event) {
      var element = Event.cache[uid] !== undefined ? Event.cache[uid].element : event.target;
      if (Object.isUndefined(event.eventName))
        return false;
        
      if (event.eventName !== eventName)
        return false;
        
      Event.extend(event, element);
      handler.call(element, event);
    };
  }
  
  function createMouseEnterLeaveResponder(uid, eventName, handler) {
    return function(event) {
      var element = Event.cache[uid].element;
      
      Event.extend(event, element);
      var parent = event.relatedTarget;
      
      // Walk up the DOM tree to see if the related target is a descendant of
      // the original element. If it is, we ignore the event to match the
      // behavior of mouseenter/mouseleave.
      while (parent && parent !== element) {
        try { parent = parent.parentNode; }
        catch(e) { parent = element; }
      }
      
      if (parent === element) return;      
      handler.call(element, event);
    }
  }
  
  GLOBAL.Event._createResponder = createResponder;
  docEl = null;
})(this);
(function(GLOBAL) {
  /* Support for the DOMContentLoaded event is based on work by Dan Webb,
     Matthias Miller, Dean Edwards, John Resig, and Diego Perini. */
  
  var TIMER;
  
  function fireContentLoadedEvent() {
    if (document.loaded) return;
    if (TIMER) window.clearTimeout(TIMER);
    document.loaded = true;
    document.fire('dom:loaded');
  }
  
  function checkReadyState() {
    if (document.readyState === 'complete') {
      document.detachEvent('onreadystatechange', checkReadyState);
      fireContentLoadedEvent();
    }
  }
  
  function pollDoScroll() {
    try {
      document.documentElement.doScroll('left');
    } catch (e) {
      TIMER = pollDoScroll.defer();
      return;
    }
    
    fireContentLoadedEvent();
  }
  if (document.readyState === 'complete') {
    // We must have been loaded asynchronously, because the DOMContentLoaded
    // event has already fired. We can just fire `dom:loaded` and be done
    // with it.
    fireContentLoadedEvent();
    return;
  }
  
  if (document.addEventListener) {
    // All browsers that support DOM L2 Events support DOMContentLoaded,
    // including IE 9.
    document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
  } else {
    document.attachEvent('onreadystatechange', checkReadyState);
    if (window == top) TIMER = pollDoScroll.defer();
  }
  
  // Worst-case fallback.
  Event.observe(window, 'load', fireContentLoadedEvent);
})(this);
Element.addMethods();
/*------------------------------- DEPRECATED -------------------------------*/
Hash.toQueryString = Object.toQueryString;
var Toggle = { display: Element.toggle };
Element.Methods.childOf = Element.Methods.descendantOf;
var Insertion = {
  Before: function(element, content) {
    return Element.insert(element, {before:content});
  },
  Top: function(element, content) {
    return Element.insert(element, {top:content});
  },
  Bottom: function(element, content) {
    return Element.insert(element, {bottom:content});
  },
  After: function(element, content) {
    return Element.insert(element, {after:content});
  }
};
var $continue = new Error('"throw $continue" is deprecated, use "return" instead');
var Position = {
  // set to true if needed, warning: firefox performance problems
  // NOT neeeded for page scrolling, only if draggable contained in
  // scrollable elements
  includeScrollOffsets: false,
  // must be called before calling withinIncludingScrolloffset, every time the
  // page is scrolled
  prepare: function() {
    this.deltaX =  window.pageXOffset
                || document.documentElement.scrollLeft
                || document.body.scrollLeft
                || 0;
    this.deltaY =  window.pageYOffset
                || document.documentElement.scrollTop
                || document.body.scrollTop
                || 0;
  },
  // caches x/y coordinate pair to use with overlap
  within: function(element, x, y) {
    if (this.includeScrollOffsets)
      return this.withinIncludingScrolloffsets(element, x, y);
    this.xcomp = x;
    this.ycomp = y;
    this.offset = Element.cumulativeOffset(element);
    return (y >= this.offset[1] &&
            y <  this.offset[1] + element.offsetHeight &&
            x >= this.offset[0] &&
            x <  this.offset[0] + element.offsetWidth);
  },
  withinIncludingScrolloffsets: function(element, x, y) {
    var offsetcache = Element.cumulativeScrollOffset(element);
    this.xcomp = x + offsetcache[0] - this.deltaX;
    this.ycomp = y + offsetcache[1] - this.deltaY;
    this.offset = Element.cumulativeOffset(element);
    return (this.ycomp >= this.offset[1] &&
            this.ycomp <  this.offset[1] + element.offsetHeight &&
            this.xcomp >= this.offset[0] &&
            this.xcomp <  this.offset[0] + element.offsetWidth);
  },
  // within must be called directly before
  overlap: function(mode, element) {
    if (!mode) return 0;
    if (mode == 'vertical')
      return ((this.offset[1] + element.offsetHeight) - this.ycomp) /
        element.offsetHeight;
    if (mode == 'horizontal')
      return ((this.offset[0] + element.offsetWidth) - this.xcomp) /
        element.offsetWidth;
  },
  // Deprecation layer -- use newer Element methods now (1.5.2).
  cumulativeOffset: Element.Methods.cumulativeOffset,
  positionedOffset: Element.Methods.positionedOffset,
  absolutize: function(element) {
    Position.prepare();
    return Element.absolutize(element);
  },
  relativize: function(element) {
    Position.prepare();
    return Element.relativize(element);
  },
  realOffset: Element.Methods.cumulativeScrollOffset,
  offsetParent: Element.Methods.getOffsetParent,
  page: Element.Methods.viewportOffset,
  clone: function(source, target, options) {
    options = options || { };
    return Element.clonePosition(target, source, options);
  }
};
/*--------------------------------------------------------------------------*/
if (!document.getElementsByClassName) document.getElementsByClassName = function(instanceMethods){
  function iter(name) {
    return name.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + name + " ')]";
  }
  instanceMethods.getElementsByClassName = Prototype.BrowserFeatures.XPath ?
  function(element, className) {
    className = className.toString().strip();
    var cond = /\s/.test(className) ? $w(className).map(iter).join('') : iter(className);
    return cond ? document._getElementsByXPath('.//*' + cond, element) : [];
  } : function(element, className) {
    className = className.toString().strip();
    var elements = [], classNames = (/\s/.test(className) ? $w(className) : null);
    if (!classNames && !className) return elements;
    var nodes = $(element).getElementsByTagName('*');
    className = ' ' + className + ' ';
    for (var i = 0, child, cn; child = nodes[i]; i++) {
      if (child.className && (cn = ' ' + child.className + ' ') && (cn.include(className) ||
          (classNames && classNames.all(function(name) {
            return !name.toString().blank() && cn.include(' ' + name + ' ');
          }))))
        elements.push(Element.extend(child));
    }
    return elements;
  };
  return function(className, parentElement) {
    return $(parentElement || document.body).getElementsByClassName(className);
  };
}(Element.Methods);
/*--------------------------------------------------------------------------*/
Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
  initialize: function(element) {
    this.element = $(element);
  },
  _each: function(iterator, context) {
    this.element.className.split(/\s+/).select(function(name) {
      return name.length > 0;
    })._each(iterator, context);
  },
  set: function(className) {
    this.element.className = className;
  },
  add: function(classNameToAdd) {
    if (this.include(classNameToAdd)) return;
    this.set($A(this).concat(classNameToAdd).join(' '));
  },
  remove: function(classNameToRemove) {
    if (!this.include(classNameToRemove)) return;
    this.set($A(this).without(classNameToRemove).join(' '));
  },
  toString: function() {
    return $A(this).join(' ');
  }
};
Object.extend(Element.ClassNames.prototype, Enumerable);
/*--------------------------------------------------------------------------*/
(function() {
  window.Selector = Class.create({
    initialize: function(expression) {
      this.expression = expression.strip();
    },
  
    findElements: function(rootElement) {
      return Prototype.Selector.select(this.expression, rootElement);
    },
  
    match: function(element) {
      return Prototype.Selector.match(element, this.expression);
    },
  
    toString: function() {
      return this.expression;
    },
  
    inspect: function() {
      return "#<Selector: " + this.expression + ">";
    }
  });
  Object.extend(Selector, {
    matchElements: function(elements, expression) {
      var match = Prototype.Selector.match,
          results = [];
          
      for (var i = 0, length = elements.length; i < length; i++) {
        var element = elements[i];
        if (match(element, expression)) {
          results.push(Element.extend(element));
        }
      }
      return results;
    },
    findElement: function(elements, expression, index) {
      index = index || 0;
      var matchIndex = 0, element;
      // Match each element individually, since Sizzle.matches does not preserve order
      for (var i = 0, length = elements.length; i < length; i++) {
        element = elements[i];
        if (Prototype.Selector.match(element, expression) && index === matchIndex++) {
          return Element.extend(element);
        }
      }
    },
    findChildElements: function(element, expressions) {
      var selector = expressions.toArray().join(', ');
      return Prototype.Selector.select(selector, element || document);
    }
  });
})();
/*

 Prototype JavaScript framework, version 1.7.1
  (c) 2005-2010 Sam Stephenson

  Prototype is freely distributable under the terms of an MIT-style license.
  For details, see the Prototype web site: http://www.prototypejs.org/

--------------------------------------------------------------------------*/
var Prototype={Version:"1.7.1",Browser:function(){var a=navigator.userAgent,b="[object Opera]"==Object.prototype.toString.call(window.opera);return{IE:!!window.attachEvent&&!b,Opera:b,WebKit:-1<a.indexOf("AppleWebKit/"),Gecko:-1<a.indexOf("Gecko")&&-1===a.indexOf("KHTML"),MobileSafari:/Apple.*Mobile/.test(a)}}(),BrowserFeatures:{XPath:!!document.evaluate,SelectorsAPI:!!document.querySelector,ElementExtensions:function(){var a=window.Element||window.HTMLElement;return!(!a||!a.prototype)}(),SpecificElementExtensions:function(){if("undefined"!==
typeof window.HTMLDivElement)return!0;var a=document.createElement("div"),b=document.createElement("form"),d=!1;a.__proto__&&a.__proto__!==b.__proto__&&(d=!0);return d}()},ScriptFragment:"<script[^>]*>([\\S\\s]*?)\x3c/script\\s*>",JSONFilter:/^\/\*-secure-([\s\S]*)\*\/\s*$/,emptyFunction:function(){},K:function(a){return a}};Prototype.Browser.MobileSafari&&(Prototype.BrowserFeatures.SpecificElementExtensions=!1);
var Class=function(){function a(){}var b=function(){for(var a in{toString:1})if("toString"===a)return!1;return!0}();return{create:function(){function d(){this.initialize.apply(this,arguments)}var b=null,h=$A(arguments);Object.isFunction(h[0])&&(b=h.shift());Object.extend(d,Class.Methods);d.superclass=b;d.subclasses=[];b&&(a.prototype=b.prototype,d.prototype=new a,b.subclasses.push(d));for(var b=0,g=h.length;b<g;b++)d.addMethods(h[b]);d.prototype.initialize||(d.prototype.initialize=Prototype.emptyFunction);
return d.prototype.constructor=d},Methods:{addMethods:function(a){var e=this.superclass&&this.superclass.prototype,h=Object.keys(a);b&&(a.toString!=Object.prototype.toString&&h.push("toString"),a.valueOf!=Object.prototype.valueOf&&h.push("valueOf"));for(var g=0,m=h.length;g<m;g++){var n=h[g],p=a[n];if(e&&Object.isFunction(p)&&"$super"==p.argumentNames()[0]){var q=p,p=function(c){return function(){return e[c].apply(this,arguments)}}(n).wrap(q);p.valueOf=function(c){return function(){return c.valueOf.call(c)}}(q);
p.toString=function(c){return function(){return c.toString.call(c)}}(q)}this.prototype[n]=p}return this}}}}();
(function(){function a(a){switch(a){case null:return c;case void 0:return f}switch(typeof a){case "boolean":return k;case "number":return D;case "string":return G}return L}function b(c,a){for(var b in a)c[b]=a[b];return c}function d(c){return e("",{"":c},[])}function e(c,b,d){b=b[c];a(b)===L&&"function"===typeof b.toJSON&&(b=b.toJSON(c));c=p.call(b);switch(c){case M:case N:case T:b=b.valueOf()}switch(b){case null:return"null";case !0:return"true";case !1:return"false"}switch(typeof b){case "string":return b.inspect(!0);
case "number":return isFinite(b)?String(b):"null";case "object":for(var f=0,k=d.length;f<k;f++)if(d[f]===b)throw new TypeError("Cyclic reference to '"+b+"' in object");d.push(b);var q=[];if(c===aa){f=0;for(k=b.length;f<k;f++){var g=e(f,b,d);q.push("undefined"===typeof g?"null":g)}q="["+q.join(",")+"]"}else{for(var n=Object.keys(b),f=0,k=n.length;f<k;f++)c=n[f],g=e(c,b,d),"undefined"!==typeof g&&q.push(c.inspect(!0)+":"+g);q="{"+q.join(",")+"}"}d.pop();return q}}function h(c){return JSON.stringify(c)}
function g(c){if(a(c)!==L)throw new TypeError;var b=[],d;for(d in c)q.call(c,d)&&b.push(d);if(Q)for(var f=0;d=v[f];f++)q.call(c,d)&&b.push(d);return b}function m(c){return p.call(c)===aa}function n(c){return"undefined"===typeof c}var p=Object.prototype.toString,q=Object.prototype.hasOwnProperty,c="Null",f="Undefined",k="Boolean",D="Number",G="String",L="Object",N="[object Boolean]",M="[object Number]",T="[object String]",aa="[object Array]",K=window.JSON&&"function"===typeof JSON.stringify&&"0"===
JSON.stringify(0)&&"undefined"===typeof JSON.stringify(Prototype.K),v="toString toLocaleString valueOf hasOwnProperty isPrototypeOf propertyIsEnumerable constructor".split(" "),Q=function(){for(var c in{toString:1})if("toString"===c)return!1;return!0}();"function"==typeof Array.isArray&&Array.isArray([])&&!Array.isArray({})&&(m=Array.isArray);b(Object,{extend:b,inspect:function(c){try{return n(c)?"undefined":null===c?"null":c.inspect?c.inspect():String(c)}catch(a){if(a instanceof RangeError)return"...";
throw a;}},toJSON:K?h:d,toQueryString:function(c){return $H(c).toQueryString()},toHTML:function(c){return c&&c.toHTML?c.toHTML():String.interpret(c)},keys:Object.keys||g,values:function(c){var a=[],b;for(b in c)a.push(c[b]);return a},clone:function(c){return b({},c)},isElement:function(c){return!(!c||1!=c.nodeType)},isArray:m,isHash:function(c){return c instanceof Hash},isFunction:function(c){return"[object Function]"===p.call(c)},isString:function(c){return p.call(c)===T},isNumber:function(c){return p.call(c)===
M},isDate:function(c){return"[object Date]"===p.call(c)},isUndefined:n})})();
Object.extend(Function.prototype,function(){function a(a,b){for(var d=a.length,e=b.length;e--;)a[d+e]=b[e];return a}function b(b,d){b=e.call(b,0);return a(b,d)}function d(a){if(2>arguments.length&&Object.isUndefined(arguments[0]))return this;if(!Object.isFunction(this))throw new TypeError("The object is not callable.");var d=function(){},n=this,p=e.call(arguments,1),q=function(){var c=b(p,arguments);return n.apply(this instanceof q?this:a,c)};d.prototype=this.prototype;q.prototype=new d;return q}
var e=Array.prototype.slice,h={argumentNames:function(){var a=this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g,"").replace(/\s+/g,"").split(",");return 1!=a.length||a[0]?a:[]},bindAsEventListener:function(b){var d=this,n=e.call(arguments,1);return function(e){e=a([e||window.event],n);return d.apply(b,e)}},curry:function(){if(!arguments.length)return this;var a=this,d=e.call(arguments,0);return function(){var e=b(d,arguments);return a.apply(this,
e)}},delay:function(a){var b=this,d=e.call(arguments,1);return window.setTimeout(function(){return b.apply(b,d)},1E3*a)},defer:function(){var b=a([0.01],arguments);return this.delay.apply(this,b)},wrap:function(b){var d=this;return function(){var e=a([d.bind(this)],arguments);return b.apply(this,e)}},methodize:function(){if(this._methodized)return this._methodized;var b=this;return this._methodized=function(){var d=a([this],arguments);return b.apply(null,d)}}};Function.prototype.bind||(h.bind=d);
return h}());(function(a){function b(){return this.getUTCFullYear()+"-"+(this.getUTCMonth()+1).toPaddedString(2)+"-"+this.getUTCDate().toPaddedString(2)+"T"+this.getUTCHours().toPaddedString(2)+":"+this.getUTCMinutes().toPaddedString(2)+":"+this.getUTCSeconds().toPaddedString(2)+"Z"}function d(){return this.toISOString()}a.toISOString||(a.toISOString=b);a.toJSON||(a.toJSON=d)})(Date.prototype);RegExp.prototype.match=RegExp.prototype.test;
RegExp.escape=function(a){return String(a).replace(/([.*+?^=!:${}()|[\]\/\\])/g,"\\$1")};
var PeriodicalExecuter=Class.create({initialize:function(a,b){this.callback=a;this.frequency=b;this.currentlyExecuting=!1;this.registerCallback()},registerCallback:function(){this.timer=setInterval(this.onTimerEvent.bind(this),1E3*this.frequency)},execute:function(){this.callback(this)},stop:function(){this.timer&&(clearInterval(this.timer),this.timer=null)},onTimerEvent:function(){if(!this.currentlyExecuting)try{this.currentlyExecuting=!0,this.execute(),this.currentlyExecuting=!1}catch(a){throw this.currentlyExecuting=
!1,a;}}});Object.extend(String,{interpret:function(a){return null==a?"":String(a)},specialChar:{"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\\":"\\\\"}});
Object.extend(String.prototype,function(){function a(a){if(Object.isFunction(a))return a;var c=new Template(a);return function(a){return c.evaluate(a)}}function b(){return this.replace(/^\s+/,"").replace(/\s+$/,"")}function d(a){var c=this.strip().match(/([^?#]*)(#.*)?$/);return c?c[1].split(a||"&").inject({},function(c,a){if((a=a.split("="))[0]){var b=decodeURIComponent(a.shift()),d=1<a.length?a.join("="):a[0];void 0!=d&&(d=d.gsub("+"," "),d=decodeURIComponent(d));b in c?(Object.isArray(c[b])||(c[b]=
[c[b]]),c[b].push(d)):c[b]=d}return c}):{}}function e(a){var c=this.unfilterJSON(),b=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;b.test(c)&&(c=c.replace(b,function(c){return"\\u"+("0000"+c.charCodeAt(0).toString(16)).slice(-4)}));try{if(!a||c.isJSON())return eval("("+c+")")}catch(d){}throw new SyntaxError("Badly formed JSON string: "+this.inspect());}function h(){var a=this.unfilterJSON();return JSON.parse(a)}function g(a){return-1!==
this.indexOf(a)}function m(a,c){c=Object.isNumber(c)?c:0;return this.lastIndexOf(a,c)===c}function n(a,c){a=String(a);c=Object.isNumber(c)?c:this.length;0>c&&(c=0);c>this.length&&(c=this.length);var b=c-a.length;return 0<=b&&this.indexOf(a,b)===b}var p=window.JSON&&"function"===typeof JSON.parse&&JSON.parse('{"test": true}').test;return{gsub:function(b,c){var d="",k=this,e;c=a(c);Object.isString(b)&&(b=RegExp.escape(b));if(!b.length&&!b.source)return c=c(""),c+k.split("").join(c)+c;for(;0<k.length;)(e=
k.match(b))&&0<e[0].length?(d+=k.slice(0,e.index),d+=String.interpret(c(e)),k=k.slice(e.index+e[0].length)):(d+=k,k="");return d},sub:function(b,c,d){c=a(c);d=Object.isUndefined(d)?1:d;return this.gsub(b,function(a){return 0>--d?a[0]:c(a)})},scan:function(a,c){this.gsub(a,c);return String(this)},truncate:function(a,c){a=a||30;c=Object.isUndefined(c)?"...":c;return this.length>a?this.slice(0,a-c.length)+c:String(this)},strip:String.prototype.trim||b,stripTags:function(){return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi,
"")},stripScripts:function(){return this.replace(RegExp(Prototype.ScriptFragment,"img"),"")},extractScripts:function(){var a=RegExp(Prototype.ScriptFragment,"im");return(this.match(RegExp(Prototype.ScriptFragment,"img"))||[]).map(function(c){return(c.match(a)||["",""])[1]})},evalScripts:function(){return this.extractScripts().map(function(a){return eval(a)})},escapeHTML:function(){return this.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")},unescapeHTML:function(){return this.stripTags().replace(/&lt;/g,
"<").replace(/&gt;/g,">").replace(/&amp;/g,"&")},toQueryParams:d,parseQuery:d,toArray:function(){return this.split("")},succ:function(){return this.slice(0,this.length-1)+String.fromCharCode(this.charCodeAt(this.length-1)+1)},times:function(a){return 1>a?"":Array(a+1).join(this)},camelize:function(){return this.replace(/-+(.)?/g,function(a,c){return c?c.toUpperCase():""})},capitalize:function(){return this.charAt(0).toUpperCase()+this.substring(1).toLowerCase()},underscore:function(){return this.replace(/::/g,
"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/-/g,"_").toLowerCase()},dasherize:function(){return this.replace(/_/g,"-")},inspect:function(a){var c=this.replace(/[\x00-\x1f\\]/g,function(c){return c in String.specialChar?String.specialChar[c]:"\\u00"+c.charCodeAt().toPaddedString(2,16)});return a?'"'+c.replace(/"/g,'\\"')+'"':"'"+c.replace(/'/g,"\\'")+"'"},unfilterJSON:function(a){return this.replace(a||Prototype.JSONFilter,"$1")},isJSON:function(){var a=
this;if(a.blank())return!1;a=a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@");a=a.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]");a=a.replace(/(?:^|:|,)(?:\s*\[)+/g,"");return/^[\],:{}\s]*$/.test(a)},evalJSON:p?h:e,include:String.prototype.contains||g,startsWith:String.prototype.startsWith||m,endsWith:String.prototype.endsWith||n,empty:function(){return""==this},blank:function(){return/^\s*$/.test(this)},interpolate:function(a,c){return(new Template(this,c)).evaluate(a)}}}());
var Template=Class.create({initialize:function(a,b){this.template=a.toString();this.pattern=b||Template.Pattern},evaluate:function(a){a&&Object.isFunction(a.toTemplateReplacements)&&(a=a.toTemplateReplacements());return this.template.gsub(this.pattern,function(b){if(null==a)return b[1]+"";var d=b[1]||"";if("\\"==d)return b[2];var e=a,h=b[3],g=/^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;b=g.exec(h);if(null==b)return d;for(;null!=b;){var m=b[1].startsWith("[")?b[2].replace(/\\\\]/g,"]"):b[1],e=e[m];if(null==
e||""==b[3])break;h=h.substring("["==b[3]?b[1].length:b[0].length);b=g.exec(h)}return d+String.interpret(e)})}});Template.Pattern=/(^|.|\r|\n)(#\{(.*?)\})/;
var $break={},Enumerable=function(){function a(a,b){a=a||Prototype.K;var d=!0;this.each(function(c,f){if(!a.call(b,c,f,this))throw d=!1,$break;},this);return d}function b(a,b){a=a||Prototype.K;var d=!1;this.each(function(c,f){if(d=!!a.call(b,c,f,this))throw $break;},this);return d}function d(a,b){a=a||Prototype.K;var d=[];this.each(function(c,f){d.push(a.call(b,c,f,this))},this);return d}function e(a,b){var d;this.each(function(c,f){if(a.call(b,c,f,this))throw d=c,$break;},this);return d}function h(a,
b){var d=[];this.each(function(c,f){a.call(b,c,f,this)&&d.push(c)},this);return d}function g(a){if(Object.isFunction(this.indexOf)&&-1!=this.indexOf(a))return!0;var b=!1;this.each(function(d){if(d==a)throw b=!0,$break;});return b}function m(){return this.map()}return{each:function(a,b){try{this._each(a,b)}catch(d){if(d!=$break)throw d;}return this},eachSlice:function(a,b,d){var c=-a,f=[],k=this.toArray();if(1>a)return k;for(;(c+=a)<k.length;)f.push(k.slice(c,c+a));return f.collect(b,d)},all:a,every:a,
any:b,some:b,collect:d,map:d,detect:e,findAll:h,select:h,filter:h,grep:function(a,b,d){b=b||Prototype.K;var c=[];Object.isString(a)&&(a=RegExp(RegExp.escape(a)));this.each(function(f,k){a.match(f)&&c.push(b.call(d,f,k,this))},this);return c},include:g,member:g,inGroupsOf:function(a,b){b=Object.isUndefined(b)?null:b;return this.eachSlice(a,function(d){for(;d.length<a;)d.push(b);return d})},inject:function(a,b,d){this.each(function(c,f){a=b.call(d,a,c,f,this)},this);return a},invoke:function(a){var b=
$A(arguments).slice(1);return this.map(function(d){return d[a].apply(d,b)})},max:function(a,b){a=a||Prototype.K;var d;this.each(function(c,f){c=a.call(b,c,f,this);if(null==d||c>=d)d=c},this);return d},min:function(a,b){a=a||Prototype.K;var d;this.each(function(c,f){c=a.call(b,c,f,this);if(null==d||c<d)d=c},this);return d},partition:function(a,b){a=a||Prototype.K;var d=[],c=[];this.each(function(f,k){(a.call(b,f,k,this)?d:c).push(f)},this);return[d,c]},pluck:function(a){var b=[];this.each(function(d){b.push(d[a])});
return b},reject:function(a,b){var d=[];this.each(function(c,f){a.call(b,c,f,this)||d.push(c)},this);return d},sortBy:function(a,b){return this.map(function(d,c){return{value:d,criteria:a.call(b,d,c,this)}},this).sort(function(a,c){var b=a.criteria,d=c.criteria;return b<d?-1:b>d?1:0}).pluck("value")},toArray:m,entries:m,zip:function(){var a=Prototype.K,b=$A(arguments);Object.isFunction(b.last())&&(a=b.pop());var d=[this].concat(b).map($A);return this.map(function(c,b){return a(d.pluck(b))})},size:function(){return this.toArray().length},
inspect:function(){return"#<Enumerable:"+this.toArray().inspect()+">"},find:e}}();function $A(a){if(!a)return[];if("toArray"in Object(a))return a.toArray();for(var b=a.length||0,d=Array(b);b--;)d[b]=a[b];return d}function $w(a){return Object.isString(a)?(a=a.strip())?a.split(/\s+/):[]:[]}Array.from=$A;
(function(){function a(a,c){for(var b=0,d=this.length>>>0;b<d;b++)b in this&&a.call(c,this[b],b,this)}function b(){return D.call(this,0)}function d(a,c){if(null==this)throw new TypeError;var b=Object(this),d=b.length>>>0;if(0===d)return-1;c=Number(c);isNaN(c)?c=0:0!==c&&isFinite(c)&&(c=(0<c?1:-1)*Math.floor(Math.abs(c)));if(c>d)return-1;for(var f=0<=c?c:Math.max(d-Math.abs(c),0);f<d;f++)if(f in b&&b[f]===a)return f;return-1}function e(a,c){if(null==this)throw new TypeError;var b=Object(this),d=b.length>>>
0;if(0===d)return-1;Object.isUndefined(c)?c=d:(c=Number(c),isNaN(c)?c=0:0!==c&&isFinite(c)&&(c=(0<c?1:-1)*Math.floor(Math.abs(c))));for(d=0<=c?Math.min(c,d-1):d-Math.abs(c);0<=d;d--)if(d in b&&b[d]===a)return d;return-1}function h(c){var a=[],b=D.call(arguments,0),d,f=0;b.unshift(this);for(var k=0,e=b.length;k<e;k++)if(d=b[k],!Object.isArray(d)||"callee"in d)a[f++]=d;else for(var g=0,h=d.length;g<h;g++)g in d&&(a[f]=d[g]),f++;a.length=f;return a}function g(c){return function(){if(0===arguments.length)return c.call(this,
Prototype.K);if(void 0===arguments[0]){var a=D.call(arguments,1);a.unshift(Prototype.K);return c.apply(this,a)}return c.apply(this,arguments)}}function m(c,a){if(null==this)throw new TypeError;c=c||Prototype.K;for(var b=Object(this),d=[],f=0,k=0,e=b.length>>>0;k<e;k++)k in b&&(d[f]=c.call(a,b[k],k,b)),f++;d.length=f;return d}function n(c,a){if(null==this||!Object.isFunction(c))throw new TypeError;for(var b=Object(this),d=[],f,k=0,e=b.length>>>0;k<e;k++)k in b&&(f=b[k],c.call(a,f,k,b)&&d.push(f));
return d}function p(c,a){if(null==this)throw new TypeError;c=c||Prototype.K;for(var b=Object(this),d=0,f=b.length>>>0;d<f;d++)if(d in b&&c.call(a,b[d],d,b))return!0;return!1}function q(c,a){if(null==this)throw new TypeError;c=c||Prototype.K;for(var b=Object(this),d=0,f=b.length>>>0;d<f;d++)if(d in b&&!c.call(a,b[d],d,b))return!1;return!0}function c(){if(null==this)throw new TypeError;return this.map(function(c,a){return[a,c]})}function f(c,a,b){a=a||Prototype.K;return N.call(this,a.bind(b),c)}var k=
Array.prototype,D=k.slice,G=k.forEach,L=k.entries;G||(G=a);k.map&&(m=g(Array.prototype.map));k.filter&&(n=Array.prototype.filter);k.some&&(p=g(Array.prototype.some));k.every&&(q=g(Array.prototype.every));var N=k.reduce;k.reduce||(f=Enumerable.inject);Object.extend(k,Enumerable);k._reverse||(k._reverse=k.reverse);Object.extend(k,{_each:G,map:m,collect:m,select:n,filter:n,findAll:n,some:p,any:p,every:q,all:q,inject:f,clear:function(){this.length=0;return this},first:function(){return this[0]},last:function(){return this[this.length-
1]},compact:function(){return this.select(function(c){return null!=c})},flatten:function(){return this.inject([],function(c,a){if(Object.isArray(a))return c.concat(a.flatten());c.push(a);return c})},without:function(){var c=D.call(arguments,0);return this.select(function(a){return!c.include(a)})},reverse:function(c){return(!1===c?this.toArray():this)._reverse()},uniq:function(c){return this.inject([],function(a,b,d){0!=d&&(c?a.last()==b:a.include(b))||a.push(b);return a})},intersect:function(c){return this.uniq().findAll(function(a){return-1!==
c.indexOf(a)})},clone:b,toArray:b,size:function(){return this.length},inspect:function(){return"["+this.map(Object.inspect).join(", ")+"]"},entries:L||c});(function(){return 1!==[].concat(arguments)[0][0]})(1,2)&&(k.concat=h);k.indexOf||(k.indexOf=d);k.lastIndexOf||(k.lastIndexOf=e)})();function $H(a){return new Hash(a)}
var Hash=Class.create(Enumerable,function(){function a(){return Object.clone(this._object)}function b(a,b){if(Object.isUndefined(b))return a;b=String.interpret(b);b=b.gsub(/(\r)?\n/,"\r\n");b=encodeURIComponent(b);b=b.gsub(/%20/,"+");return a+"="+b}return{initialize:function(a){this._object=Object.isHash(a)?a.toObject():Object.clone(a)},_each:function(a,b){var h=0,g;for(g in this._object){var m=this._object[g],n=[g,m];n.key=g;n.value=m;a.call(b,n,h);h++}},set:function(a,b){return this._object[a]=
b},get:function(a){if(this._object[a]!==Object.prototype[a])return this._object[a]},unset:function(a){var b=this._object[a];delete this._object[a];return b},toObject:a,toTemplateReplacements:a,keys:function(){return this.pluck("key")},values:function(){return this.pluck("value")},index:function(a){var b=this.detect(function(b){return b.value===a});return b&&b.key},merge:function(a){return this.clone().update(a)},update:function(a){return(new Hash(a)).inject(this,function(a,b){a.set(b.key,b.value);
return a})},toQueryString:function(){return this.inject([],function(a,e){var h=encodeURIComponent(e.key),g=e.value;if(g&&"object"==typeof g){if(Object.isArray(g)){for(var m=[],n=0,p=g.length,q;n<p;n++)q=g[n],m.push(b(h,q));return a.concat(m)}}else a.push(b(h,g));return a}).join("&")},inspect:function(){return"#<Hash:{"+this.map(function(a){return a.map(Object.inspect).join(": ")}).join(", ")+"}>"},toJSON:a,clone:function(){return new Hash(this)}}}());Hash.from=$H;
Object.extend(Number.prototype,function(){return{toColorPart:function(){return this.toPaddedString(2,16)},succ:function(){return this+1},times:function(a,b){$R(0,this,!0).each(a,b);return this},toPaddedString:function(a,b){var d=this.toString(b||10);return"0".times(a-d.length)+d},abs:function(){return Math.abs(this)},round:function(){return Math.round(this)},ceil:function(){return Math.ceil(this)},floor:function(){return Math.floor(this)}}}());function $R(a,b,d){return new ObjectRange(a,b,d)}
var ObjectRange=Class.create(Enumerable,function(){return{initialize:function(a,b,d){this.start=a;this.end=b;this.exclusive=d},_each:function(a,b){var d=this.start,e;for(e=0;this.include(d);e++)a.call(b,d,e),d=d.succ()},include:function(a){return a<this.start?!1:this.exclusive?a<this.end:a<=this.end}}}()),Abstract={},Try={these:function(){for(var a,b=0,d=arguments.length;b<d;b++){var e=arguments[b];try{a=e();break}catch(h){}}return a}},Ajax={getTransport:function(){return Try.these(function(){return new XMLHttpRequest},
function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Microsoft.XMLHTTP")})||!1},activeRequestCount:0,Responders:{responders:[],_each:function(a,b){this.responders._each(a,b)},register:function(a){this.include(a)||this.responders.push(a)},unregister:function(a){this.responders=this.responders.without(a)},dispatch:function(a,b,d,e){this.each(function(h){if(Object.isFunction(h[a]))try{h[a].apply(h,[b,d,e])}catch(g){}})}}};Object.extend(Ajax.Responders,Enumerable);
Ajax.Responders.register({onCreate:function(){Ajax.activeRequestCount++},onComplete:function(){Ajax.activeRequestCount--}});Ajax.Base=Class.create({initialize:function(a){this.options={method:"post",asynchronous:!0,contentType:"application/x-www-form-urlencoded",encoding:"UTF-8",parameters:"",evalJSON:!0,evalJS:!0};Object.extend(this.options,a||{});this.options.method=this.options.method.toLowerCase();Object.isHash(this.options.parameters)&&(this.options.parameters=this.options.parameters.toObject())}});
Ajax.Request=Class.create(Ajax.Base,{_complete:!1,initialize:function($super,b,d){$super(d);this.transport=Ajax.getTransport();this.request(b)},request:function(a){this.url=a;this.method=this.options.method;a=Object.isString(this.options.parameters)?this.options.parameters:Object.toQueryString(this.options.parameters);["get","post"].include(this.method)||(a+=(a?"&":"")+"_method="+this.method,this.method="post");a&&"get"===this.method&&(this.url+=(this.url.include("?")?"&":"?")+a);this.parameters=
a.toQueryParams();try{var b=new Ajax.Response(this);if(this.options.onCreate)this.options.onCreate(b);Ajax.Responders.dispatch("onCreate",this,b);this.transport.open(this.method.toUpperCase(),this.url,this.options.asynchronous);this.options.asynchronous&&this.respondToReadyState.bind(this).defer(1);this.transport.onreadystatechange=this.onStateChange.bind(this);this.setRequestHeaders();this.body="post"==this.method?this.options.postBody||a:null;this.transport.send(this.body);if(!this.options.asynchronous&&
this.transport.overrideMimeType)this.onStateChange()}catch(d){this.dispatchException(d)}},onStateChange:function(){var a=this.transport.readyState;1<a&&(4!=a||!this._complete)&&this.respondToReadyState(this.transport.readyState)},setRequestHeaders:function(){var a={"X-Requested-With":"XMLHttpRequest","X-Prototype-Version":Prototype.Version,Accept:"text/javascript, text/html, application/xml, text/xml, */*"};"post"==this.method&&(a["Content-type"]=this.options.contentType+(this.options.encoding?"; charset="+
this.options.encoding:""),this.transport.overrideMimeType&&2005>(navigator.userAgent.match(/Gecko\/(\d{4})/)||[0,2005])[1]&&(a.Connection="close"));if("object"==typeof this.options.requestHeaders){var b=this.options.requestHeaders;if(Object.isFunction(b.push))for(var d=0,e=b.length;d<e;d+=2)a[b[d]]=b[d+1];else $H(b).each(function(b){a[b.key]=b.value})}for(var h in a)null!=a[h]&&this.transport.setRequestHeader(h,a[h])},success:function(){var a=this.getStatus();return!a||200<=a&&300>a||304==a},getStatus:function(){try{return 1223===
this.transport.status?204:this.transport.status||0}catch(a){return 0}},respondToReadyState:function(a){a=Ajax.Request.Events[a];var b=new Ajax.Response(this);if("Complete"==a){try{this._complete=!0,(this.options["on"+b.status]||this.options["on"+(this.success()?"Success":"Failure")]||Prototype.emptyFunction)(b,b.headerJSON)}catch(d){this.dispatchException(d)}var e=b.getHeader("Content-type");("force"==this.options.evalJS||this.options.evalJS&&this.isSameOrigin()&&e&&e.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i))&&
this.evalResponse()}try{(this.options["on"+a]||Prototype.emptyFunction)(b,b.headerJSON),Ajax.Responders.dispatch("on"+a,this,b,b.headerJSON)}catch(h){this.dispatchException(h)}"Complete"==a&&(this.transport.onreadystatechange=Prototype.emptyFunction)},isSameOrigin:function(){var a=this.url.match(/^\s*https?:\/\/[^\/]*/);return!a||a[0]=="#{protocol}//#{domain}#{port}".interpolate({protocol:location.protocol,domain:document.domain,port:location.port?":"+location.port:""})},getHeader:function(a){try{return this.transport.getResponseHeader(a)||
null}catch(b){return null}},evalResponse:function(){try{return eval((this.transport.responseText||"").unfilterJSON())}catch(a){this.dispatchException(a)}},dispatchException:function(a){(this.options.onException||Prototype.emptyFunction)(this,a);Ajax.Responders.dispatch("onException",this,a)}});Ajax.Request.Events=["Uninitialized","Loading","Loaded","Interactive","Complete"];
Ajax.Response=Class.create({initialize:function(a){this.request=a;a=this.transport=a.transport;var b=this.readyState=a.readyState;if(2<b&&!Prototype.Browser.IE||4==b)this.status=this.getStatus(),this.statusText=this.getStatusText(),this.responseText=String.interpret(a.responseText),this.headerJSON=this._getHeaderJSON();4==b&&(a=a.responseXML,this.responseXML=Object.isUndefined(a)?null:a,this.responseJSON=this._getResponseJSON())},status:0,statusText:"",getStatus:Ajax.Request.prototype.getStatus,getStatusText:function(){try{return this.transport.statusText||
""}catch(a){return""}},getHeader:Ajax.Request.prototype.getHeader,getAllHeaders:function(){try{return this.getAllResponseHeaders()}catch(a){return null}},getResponseHeader:function(a){return this.transport.getResponseHeader(a)},getAllResponseHeaders:function(){return this.transport.getAllResponseHeaders()},_getHeaderJSON:function(){var a=this.getHeader("X-JSON");if(!a)return null;try{a=decodeURIComponent(escape(a))}catch(b){}try{return a.evalJSON(this.request.options.sanitizeJSON||!this.request.isSameOrigin())}catch(d){this.request.dispatchException(d)}},
_getResponseJSON:function(){var a=this.request.options;if(!a.evalJSON||"force"!=a.evalJSON&&!(this.getHeader("Content-type")||"").include("application/json")||this.responseText.blank())return null;try{return this.responseText.evalJSON(a.sanitizeJSON||!this.request.isSameOrigin())}catch(b){this.request.dispatchException(b)}}});
Ajax.Updater=Class.create(Ajax.Request,{initialize:function($super,b,d,e){this.container={success:b.success||b,failure:b.failure||(b.success?null:b)};e=Object.clone(e);var h=e.onComplete;e.onComplete=function(b,d){this.updateContent(b.responseText);Object.isFunction(h)&&h(b,d)}.bind(this);$super(d,e)},updateContent:function(a){var b=this.container[this.success()?"success":"failure"],d=this.options;d.evalScripts||(a=a.stripScripts());if(b=$(b))if(d.insertion)if(Object.isString(d.insertion)){var e=
{};e[d.insertion]=a;b.insert(e)}else d.insertion(b,a);else b.update(a)}});
Ajax.PeriodicalUpdater=Class.create(Ajax.Base,{initialize:function($super,b,d,e){$super(e);this.onComplete=this.options.onComplete;this.frequency=this.options.frequency||2;this.decay=this.options.decay||1;this.updater={};this.container=b;this.url=d;this.start()},start:function(){this.options.onComplete=this.updateComplete.bind(this);this.onTimerEvent()},stop:function(){this.updater.options.onComplete=void 0;clearTimeout(this.timer);(this.onComplete||Prototype.emptyFunction).apply(this,arguments)},
updateComplete:function(a){this.options.decay&&(this.decay=a.responseText==this.lastText?this.decay*this.options.decay:1,this.lastText=a.responseText);this.timer=this.onTimerEvent.bind(this).delay(this.decay*this.frequency)},onTimerEvent:function(){this.updater=new Ajax.Updater(this.container,this.url,this.options)}});
(function(a){function b(a){if(1<arguments.length){for(var c=0,f=[],k=arguments.length;c<k;c++)f.push(b(arguments[c]));return f}Object.isString(a)&&(a=document.getElementById(a));return d.extend(a)}function d(a,c){c=c||{};a=a.toLowerCase();if(oa&&c.name)return a="<"+a+' name="'+c.name+'">',delete c.name,d.writeAttribute(document.createElement(a),c);ba[a]||(ba[a]=d.extend(document.createElement(a)));var b="select"===a||"type"in c?document.createElement(a):ba[a].cloneNode(!1);return d.writeAttribute(b,
c)}function e(a,c){a=b(a);if(c&&c.toElement)c=c.toElement();else if(!Object.isElement(c)){c=Object.toHTML(c);var d=a.ownerDocument.createRange();d.selectNode(a);c.evalScripts.bind(c).defer();c=d.createContextualFragment(c.stripScripts())}a.parentNode.replaceChild(c,a);return a}function h(a,c){a=b(a);c&&c.toElement&&(c=c.toElement());if(Object.isElement(c))return a.parentNode.replaceChild(c,a),a;c=Object.toHTML(c);var f=a.parentNode,k=f.tagName.toUpperCase();if(k in ga.tags){var l=d.next(a),k=g(k,
c.stripScripts());f.removeChild(a);k.each(l?function(a){f.insertBefore(a,l)}:function(a){f.appendChild(a)})}else a.outerHTML=c.stripScripts();c.evalScripts.bind(c).defer();return a}function g(a,c,b){var d=ga.tags[a];a=z;var f=!!d;!f&&b&&(f=!0,d=["","",0]);if(f)for(a.innerHTML="&#160;"+d[0]+c+d[1],a.removeChild(a.firstChild),c=d[2];c--;)a=a.firstChild;else a.innerHTML=c;return $A(a.childNodes)}function m(a){var c=H(a);c&&(d.stopObserving(a),ca||(a._prototypeUID=P),delete d.Storage[c])}function n(a,
c,f){a=b(a);f=f||-1;for(var k=[];(a=a[c])&&(a.nodeType===Node.ELEMENT_NODE&&k.push(d.extend(a)),k.length!==f););return k}function p(a){for(a=b(a).firstChild;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.nextSibling;return b(a)}function q(a){var c=[];for(a=b(a).firstChild;a;)a.nodeType===Node.ELEMENT_NODE&&c.push(d.extend(a)),a=a.nextSibling;return c}function c(a){return n(a,"previousSibling")}function f(a){return n(a,"nextSibling")}function k(a,c,f,k){a=b(a);f=f||0;k=k||0;Object.isNumber(f)&&(k=f,f=null);
for(;a=a[c];)if(1===a.nodeType&&!(f&&!Prototype.Selector.match(a,f)||0<=--k))return d.extend(a)}function D(a){a=b(a);var c=pa.call(arguments,1).join(", ");return Prototype.Selector.select(c,a)}function G(a,c){a=b(a);for(c=b(c);a=a.parentNode;)if(a===c)return!0;return!1}function L(a,c){a=b(a);c=b(c);return c.contains?c.contains(a)&&c!==a:G(a,c)}function N(a,c){a=b(a);c=b(c);return 8===(a.compareDocumentPosition(c)&8)}function M(a,c){return b(a).getAttribute(c)}function T(a,c){a=b(a);var d=C.read;if(d.values[c])return d.values[c](a,
c);d.names[c]&&(c=d.names[c]);return c.include(":")?a.attributes&&a.attributes[c]?a.attributes[c].value:null:a.getAttribute(c)}function aa(a,c){return"title"===c?a.title:a.getAttribute(c)}function K(a){if(ha[a])return ha[a];var c=RegExp("(^|\\s+)"+a+"(\\s+|$)");return ha[a]=c}function v(a,c){if(a=b(a)){var d=a.className;return 0===d.length?!1:d===c?!0:K(c).test(d)}}function Q(a,c){return a.getAttribute(c,2)}function s(a,c){return b(a).hasAttribute(c)?c:null}function u(a,c){if("opacity"===c)return O(a);
a=b(a);c="float"===c||"styleFloat"===c?"cssFloat":c.camelize();var d=a.style[c];d&&"auto"!==d||(d=(d=document.defaultView.getComputedStyle(a,null))?d[c]:null);return"auto"===d?null:d}function Z(a,c){switch(c){case "height":case "width":if(!d.visible(a))return null;var b=parseInt(u(a,c),10);return b!==a["offset"+c.capitalize()]?b+"px":d.measure(a,c);default:return u(a,c)}}function U(a,c){if("opacity"===c)return ia(a);a=b(a);c="float"===c||"cssFloat"===c?"styleFloat":c.camelize();var f=a.style[c];!f&&
a.currentStyle&&(f=a.currentStyle[c]);return"auto"===f?"width"!==c&&"height"!==c||!d.visible(a)?null:d.measure(a,c)+"px":f}function X(a,c){a=b(a);1==c||""===c?c="":1E-5>c&&(c=0);a.style.opacity=c;return a}function O(a){a=b(a);var c=a.style.opacity;c&&"auto"!==c||(c=(a=document.defaultView.getComputedStyle(a,null))?a.opacity:null);return c?parseFloat(c):1}function H(a){if(a===window)return 0;"undefined"===typeof a._prototypeUID&&(a._prototypeUID=d.Storage.UID++);return a._prototypeUID}function B(a){return a===
window?0:a==document?1:a.uniqueID}function I(a){if(a=b(a))return a=H(a),d.Storage[a]||(d.Storage[a]=$H()),d.Storage[a]}function E(a,c){for(var b in c){var d=c[b];!Object.isFunction(d)||b in a||(a[b]=d.methodize())}}function l(a){if(!a||H(a)in ja||a.nodeType!==Node.ELEMENT_NODE||a==window)return a;var c=Object.clone(ma),b=a.tagName.toUpperCase();da[b]&&Object.extend(c,da[b]);E(a,c);ja[H(a)]=!0;return a}function r(a){if(!a||H(a)in ja)return a;var c=a.tagName;c&&/^(?:object|applet|embed)$/i.test(c)&&
(E(a,d.Methods),E(a,d.Methods.Simulated),E(a,d.Methods.ByTag[c.toUpperCase()]));return a}function x(a,c){a=a.toUpperCase();da[a]||(da[a]={});Object.extend(da[a],c)}function F(a,c,b){Object.isUndefined(b)&&(b=!1);for(var d in c){var f=c[d];Object.isFunction(f)&&(b&&d in a||(a[d]=f.methodize()))}}function t(a){var c,b={OPTGROUP:"OptGroup",TEXTAREA:"TextArea",P:"Paragraph",FIELDSET:"FieldSet",UL:"UList",OL:"OList",DL:"DList",DIR:"Directory",H1:"Heading",H2:"Heading",H3:"Heading",H4:"Heading",H5:"Heading",
H6:"Heading",Q:"Quote",INS:"Mod",DEL:"Mod",A:"Anchor",IMG:"Image",CAPTION:"TableCaption",COL:"TableCol",COLGROUP:"TableCol",THEAD:"TableSection",TFOOT:"TableSection",TBODY:"TableSection",TR:"TableRow",TH:"TableCell",TD:"TableCell",FRAMESET:"FrameSet",IFRAME:"IFrame"};b[a]&&(c="HTML"+b[a]+"Element");if(window[c])return window[c];c="HTML"+a+"Element";if(window[c])return window[c];c="HTML"+a.capitalize()+"Element";if(window[c])return window[c];a=document.createElement(a);return a.__proto__||a.constructor.prototype}
function S(){ba=z=null}var P,pa=Array.prototype.slice,z=document.createElement("div");a.$=b;a.Node||(a.Node={});a.Node.ELEMENT_NODE||Object.extend(a.Node,{ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,ENTITY_REFERENCE_NODE:5,ENTITY_NODE:6,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11,NOTATION_NODE:12});var ba={},oa=function(){try{var a=document.createElement('<input name="x">');return"input"===a.tagName.toLowerCase()&&
"x"===a.name}catch(c){return!1}}(),y=a.Element;a.Element=d;Object.extend(a.Element,y||{});y&&(a.Element.prototype=y.prototype);d.Methods={ByTag:{},Simulated:{}};var y={},ka={id:"id",className:"class"};y.inspect=function(a){a=b(a);var c="<"+a.tagName.toLowerCase(),d,f,k;for(k in ka)d=ka[k],(f=(a[k]||"").toString())&&(c+=" "+d+"="+f.inspect(!0));return c+">"};Object.extend(y,{visible:function(a){return"none"!==b(a).style.display},toggle:function(a,c){a=b(a);Object.isUndefined(c)&&(c=!d.visible(a));
d[c?"show":"hide"](a);return a},hide:function(a){a=b(a);a.style.display="none";return a},show:function(a){a=b(a);a.style.display="";return a}});var A=function(){var a=document.createElement("select"),c=!0;a.innerHTML='<option value="test">test</option>';a.options&&a.options[0]&&(c="OPTION"!==a.options[0].nodeName.toUpperCase());return c}(),R=function(){try{var a=document.createElement("table");if(a&&a.tBodies)return a.innerHTML="<tbody><tr><td>test</td></tr></tbody>","undefined"==typeof a.tBodies[0]}catch(c){return!0}}(),
qa=function(){try{var a=document.createElement("div");a.innerHTML="<link />";return 0===a.childNodes.length}catch(c){return!0}}(),V=A||R||qa,ta=function(){var a=document.createElement("script"),c=!1;try{a.appendChild(document.createTextNode("")),c=!a.firstChild||a.firstChild&&3!==a.firstChild.nodeType}catch(b){c=!0}return c}(),ga={before:function(a,c){a.parentNode.insertBefore(c,a)},top:function(a,c){a.insertBefore(c,a.firstChild)},bottom:function(a,c){a.appendChild(c)},after:function(a,c){a.parentNode.insertBefore(c,
a.nextSibling)},tags:{TABLE:["<table>","</table>",1],TBODY:["<table><tbody>","</tbody></table>",2],TR:["<table><tbody><tr>","</tr></tbody></table>",3],TD:["<table><tbody><tr><td>","</td></tr></tbody></table>",4],SELECT:["<select>","</select>",1]}},A=ga.tags;Object.extend(A,{THEAD:A.TBODY,TFOOT:A.TBODY,TH:A.TD});"outerHTML"in document.documentElement&&(e=h);Object.extend(y,{remove:function(a){a=b(a);a.parentNode.removeChild(a);return a},update:function(a,c){a=b(a);for(var d=a.getElementsByTagName("*"),
f=d.length;f--;)m(d[f]);c&&c.toElement&&(c=c.toElement());if(Object.isElement(c))return a.update().insert(c);c=Object.toHTML(c);f=a.tagName.toUpperCase();if("SCRIPT"===f&&ta)return a.text=c,a;if(V)if(f in ga.tags){for(;a.firstChild;)a.removeChild(a.firstChild);for(var d=g(f,c.stripScripts()),f=0,k;k=d[f];f++)a.appendChild(k)}else if(qa&&Object.isString(c)&&-1<c.indexOf("<link")){for(;a.firstChild;)a.removeChild(a.firstChild);d=g(f,c.stripScripts(),!0);for(f=0;k=d[f];f++)a.appendChild(k)}else a.innerHTML=
c.stripScripts();else a.innerHTML=c.stripScripts();c.evalScripts.bind(c).defer();return a},replace:e,insert:function(a,c){a=b(a);var d=c;(Object.isUndefined(d)||null===d?0:Object.isString(d)||Object.isNumber(d)||Object.isElement(d)||d.toElement||d.toHTML)&&(c={bottom:c});for(var f in c){var d=a,k=c[f],l=f,l=l.toLowerCase(),e=ga[l];k&&k.toElement&&(k=k.toElement());if(Object.isElement(k))e(d,k);else{var k=Object.toHTML(k),h=("before"===l||"after"===l?d.parentNode:d).tagName.toUpperCase(),h=g(h,k.stripScripts());
"top"!==l&&"after"!==l||h.reverse();for(var l=0,r=void 0;r=h[l];l++)e(d,r);k.evalScripts.bind(k).defer()}}return a},wrap:function(a,c,f){a=b(a);Object.isElement(c)?b(c).writeAttribute(f||{}):c=Object.isString(c)?new d(c,f):new d("div",c);a.parentNode&&a.parentNode.replaceChild(c,a);c.appendChild(a);return c},cleanWhitespace:function(a){a=b(a);for(var c=a.firstChild;c;){var d=c.nextSibling;c.nodeType!==Node.TEXT_NODE||/\S/.test(c.nodeValue)||a.removeChild(c);c=d}return a},empty:function(a){return b(a).innerHTML.blank()},
clone:function(a,c){if(a=b(a)){var f=a.cloneNode(c);if(!ca&&(f._prototypeUID=P,c))for(var k=d.select(f,"*"),l=k.length;l--;)k[l]._prototypeUID=P;return d.extend(f)}},purge:function(a){if(a=b(a)){m(a);a=a.getElementsByTagName("*");for(var c=a.length;c--;)m(a[c]);return null}}});Object.extend(y,{recursivelyCollect:n,ancestors:function(a){return n(a,"parentNode")},descendants:function(a){return d.select(a,"*")},firstDescendant:p,immediateDescendants:q,previousSiblings:c,nextSiblings:f,siblings:function(a){a=
b(a);var d=c(a);a=f(a);return d.reverse().concat(a)},match:function(a,c){a=b(a);return Object.isString(c)?Prototype.Selector.match(a,c):c.match(a)},up:function(a,c,d){a=b(a);return 1===arguments.length?b(a.parentNode):k(a,"parentNode",c,d)},down:function(a,c,f){if(1===arguments.length)return p(a);a=b(a);c=c||0;f=f||0;Object.isNumber(c)&&(f=c,c="*");var k=Prototype.Selector.select(c,a)[f];return d.extend(k)},previous:function(a,c,b){return k(a,"previousSibling",c,b)},next:function(a,c,b){return k(a,
"nextSibling",c,b)},select:D,adjacent:function(a){a=b(a);for(var c=pa.call(arguments,1).join(", "),f=d.siblings(a),k=[],l=0,e;e=f[l];l++)Prototype.Selector.match(e,c)&&k.push(e);return k},descendantOf:z.compareDocumentPosition?N:z.contains?L:G,getElementsBySelector:D,childElements:q});var W=1;(function(){z.setAttribute("onclick",[]);var a=z.getAttribute("onclick"),a=Object.isArray(a);z.removeAttribute("onclick");return a})()?M=T:Prototype.Browser.Opera&&(M=aa);a.Element.Methods.Simulated.hasAttribute=
function(a,c){c=C.has[c]||c;var d=b(a).getAttributeNode(c);return!(!d||!d.specified)};var ha={},C={},A="className",R="for";z.setAttribute(A,"x");"x"!==z.className&&(z.setAttribute("class","x"),"x"===z.className&&(A="class"));var J=document.createElement("label");J.setAttribute(R,"x");"x"!==J.htmlFor&&(J.setAttribute("htmlFor","x"),"x"===J.htmlFor&&(R="htmlFor"));J=null;z.onclick=Prototype.emptyFunction;var J=z.getAttribute("onclick"),w;-1<String(J).indexOf("{")?w=function(a,c){var b=a.getAttribute(c);
if(!b)return null;b=b.toString();b=b.split("{")[1];b=b.split("}")[0];return b.strip()}:""===J&&(w=function(a,c){var b=a.getAttribute(c);return b?b.strip():null});C.read={names:{"class":A,className:A,"for":R,htmlFor:R},values:{style:function(a){return a.style.cssText.toLowerCase()},title:function(a){return a.title}}};C.write={names:{className:"class",htmlFor:"for",cellpadding:"cellPadding",cellspacing:"cellSpacing"},values:{checked:function(a,c){a.checked=!!c},style:function(a,c){a.style.cssText=c?
c:""}}};C.has={names:{}};Object.extend(C.write.names,C.read.names);A=$w("colSpan rowSpan vAlign dateTime accessKey tabIndex encType maxLength readOnly longDesc frameBorder");for(R=0;J=A[R];R++)C.write.names[J.toLowerCase()]=J,C.has.names[J.toLowerCase()]=J;Object.extend(C.read.values,{href:Q,src:Q,type:function(a,c){return a.getAttribute(c)},action:function(a,c){var b=a.getAttributeNode(c);return b?b.value:""},disabled:s,checked:s,readonly:s,multiple:s,onload:w,onunload:w,onclick:w,ondblclick:w,onmousedown:w,
onmouseup:w,onmouseover:w,onmousemove:w,onmouseout:w,onfocus:w,onblur:w,onkeypress:w,onkeydown:w,onkeyup:w,onsubmit:w,onreset:w,onselect:w,onchange:w});Object.extend(y,{identify:function(a){a=b(a);var c=d.readAttribute(a,"id");if(c)return c;do c="anonymous_element_"+W++;while(b(c));d.writeAttribute(a,"id",c);return c},readAttribute:M,writeAttribute:function(a,c,d){a=b(a);var f={},k=C.write;"object"===typeof c?f=c:f[c]=Object.isUndefined(d)?!0:d;for(var l in f)c=k.names[l]||l,d=f[l],k.values[l]&&(c=
k.values[l](a,d)||c),!1===d||null===d?a.removeAttribute(c):!0===d?a.setAttribute(c,c):a.setAttribute(c,d);return a},classNames:function(a){return new d.ClassNames(a)},hasClassName:v,addClassName:function(a,c){if(a=b(a))return v(a,c)||(a.className+=(a.className?" ":"")+c),a},removeClassName:function(a,c){if(a=b(a))return a.className=a.className.replace(K(c)," ").strip(),a},toggleClassName:function(a,c,f){if(a=b(a))return Object.isUndefined(f)&&(f=!v(a,c)),(0,d[f?"addClassName":"removeClassName"])(a,
c)}});z.style.cssText="opacity:.55";var A=(w=/^0.55/.test(z.style.opacity))?X:function(a,c){a=b(a);var f=a.style;a.currentStyle&&a.currentStyle.hasLayout||(f.zoom=1);var k=d.getStyle(a,"filter");if(1==c||""===c)return(k=(k||"").replace(/alpha\([^\)]*\)/gi,""))?f.filter=k:f.removeAttribute("filter"),a;1E-5>c&&(c=0);f.filter=(k||"").replace(/alpha\([^\)]*\)/gi,"")+" alpha(opacity="+100*c+")";return a},ia=w?O:function(a){a=d.getStyle(a,"filter");return 0===a.length?1:(a=(a||"").match(/alpha\(opacity=(.*)\)/i))&&
a[1]?parseFloat(a[1])/100:1};Object.extend(y,{setStyle:function(a,c){a=b(a);var f=a.style;if(Object.isString(c))return f.cssText+=";"+c,c.include("opacity")&&(f=c.match(/opacity:\s*(\d?\.?\d*)/)[1],d.setOpacity(a,f)),a;for(var k in c)if("opacity"===k)d.setOpacity(a,c[k]);else{var l=c[k];if("float"===k||"cssFloat"===k)k=Object.isUndefined(f.styleFloat)?"cssFloat":"styleFloat";f[k]=l}return a},getStyle:u,setOpacity:X,getOpacity:O});Prototype.Browser.Opera?y.getStyle=Z:"styleFloat"in z.style&&(y.getStyle=
U,y.setOpacity=A,y.getOpacity=ia);a.Element.Storage={UID:1};var ca="uniqueID"in z;ca&&(H=B);Object.extend(y,{getStorage:I,store:function(a,c,d){if(a=b(a)){var f=I(a);2===arguments.length?f.update(c):f.set(c,d);return a}},retrieve:function(a,c,d){if(a=b(a)){a=I(a);var f=a.get(c);Object.isUndefined(f)&&(a.set(c,d),f=d);return f}}});var ma={},da=d.Methods.ByTag,Y=Prototype.BrowserFeatures;!Y.ElementExtensions&&"__proto__"in z&&(a.HTMLElement={},a.HTMLElement.prototype=z.__proto__,Y.ElementExtensions=
!0);w=function(a){if("undefined"===typeof window.Element)return!1;var c=window.Element.prototype;if(c){var b="_"+(Math.random()+"").slice(2);a=document.createElement(a);c[b]="x";a="x"!==a[b];delete c[b];return a}return!1}("object");var ja={};Y.SpecificElementExtensions&&(l=w?r:Prototype.K);Object.extend(a.Element,{extend:l,addMethods:function(a){0===arguments.length&&(Object.extend(Form,Form.Methods),Object.extend(Form.Element,Form.Element.Methods),Object.extend(d.Methods.ByTag,{FORM:Object.clone(Form.Methods),
INPUT:Object.clone(Form.Element.Methods),SELECT:Object.clone(Form.Element.Methods),TEXTAREA:Object.clone(Form.Element.Methods),BUTTON:Object.clone(Form.Element.Methods)}));if(2===arguments.length){var c=a;a=arguments[1]}if(c)if(Object.isArray(c))for(var b=0,f;f=c[b];b++)x(f,a);else x(c,a);else Object.extend(d.Methods,a||{});c=window.HTMLElement?HTMLElement.prototype:d.prototype;Y.ElementExtensions&&(F(c,d.Methods),F(c,d.Methods.Simulated,!0));if(Y.SpecificElementExtensions)for(f in d.Methods.ByTag)c=
t(f),Object.isUndefined(c)||F(c.prototype,da[f]);Object.extend(d,d.Methods);Object.extend(d,d.Methods.Simulated);delete d.ByTag;delete d.Simulated;d.extend.refresh();ba={}}});a.Element.extend.refresh=l===Prototype.K?Prototype.emptyFunction:function(){Prototype.BrowserFeatures.ElementExtensions||(Object.extend(ma,d.Methods),Object.extend(ma,d.Methods.Simulated),ja={})};d.addMethods(y);window.attachEvent&&window.attachEvent("onunload",S)})(this);
(function(){function a(a,b){a=$(a);var d=a.style[b];d&&"auto"!==d||(d=(d=document.defaultView.getComputedStyle(a,null))?d[b]:null);return"opacity"===b?d?parseFloat(d):1:"auto"===d?null:d}function b(a,b){var d=a.style[b];!d&&a.currentStyle&&(d=a.currentStyle[b]);return d}function d(a,b){var d=a.offsetWidth,g=e(a,"borderLeftWidth",b)||0,h=e(a,"borderRightWidth",b)||0,p=e(a,"paddingLeft",b)||0,m=e(a,"paddingRight",b)||0;return d-g-h-p-m}function e(c,b,d){var e=null;Object.isElement(c)&&(e=c,c=a(e,b));
if(null===c||Object.isUndefined(c))return null;if(/^(?:-)?\d+(\.\d+)?(px)?$/i.test(c))return window.parseFloat(c);var g=c.include("%"),h=d===document.viewport;return!(/\d/.test(c)&&e&&e.runtimeStyle)||g&&h?e&&g?(d=d||e.parentNode,c=(c=c.match(/^(\d+)%?$/i))?Number(c[1])/100:null,e=null,g=b.include("left")||b.include("right")||b.include("width"),b=b.include("top")||b.include("bottom")||b.include("height"),d===document.viewport?g?e=document.viewport.getWidth():b&&(e=document.viewport.getHeight()):g?
e=$(d).measure("width"):b&&(e=$(d).measure("height")),null===e?0:e*c):0:(d=e.style.left,b=e.runtimeStyle.left,e.runtimeStyle.left=e.currentStyle.left,e.style.left=c||0,c=e.style.pixelLeft,e.style.left=d,e.runtimeStyle.left=b,c)}function h(a){a=$(a);if(a.nodeType===Node.DOCUMENT_NODE||p(a)||"BODY"===a.nodeName.toUpperCase()||n(a))return $(document.body);if("inline"!==Element.getStyle(a,"display")&&a.offsetParent)return n(a.offsetParent)?$(document.body):$(a.offsetParent);for(;(a=a.parentNode)&&a!==
document.body;)if("static"!==Element.getStyle(a,"position"))return n(a)?$(document.body):$(a);return $(document.body)}function g(a){a=$(a);var b=0,d=0;if(a.parentNode){do b+=a.offsetTop||0,d+=a.offsetLeft||0,a=a.offsetParent;while(a)}return new Element.Offset(d,b)}function m(a){a=$(a);var b=a.getLayout(),d=0,e=0;do if(d+=a.offsetTop||0,e+=a.offsetLeft||0,a=a.offsetParent){if("BODY"===a.nodeName.toUpperCase())break;if("static"!==Element.getStyle(a,"position"))break}while(a);d-=b.get("margin-top");
e-=b.get("margin-left");return new Element.Offset(e,d)}function n(a){return"HTML"===a.nodeName.toUpperCase()}function p(a){return a!==document.body&&!Element.descendantOf(a,document.body)}"currentStyle"in document.documentElement&&(a=b);var q=Prototype.K;"currentStyle"in document.documentElement&&(q=function(a){a.currentStyle.hasLayout||(a.style.zoom=1);return a});Element.Layout=Class.create(Hash,{initialize:function($super,a,b){$super();this.element=$(a);Element.Layout.PROPERTIES.each(function(a){this._set(a,
null)},this);b&&(this._preComputing=!0,this._begin(),Element.Layout.PROPERTIES.each(this._compute,this),this._end(),this._preComputing=!1)},_set:function(a,b){return Hash.prototype.set.call(this,a,b)},set:function(a,b){throw"Properties of Element.Layout are read-only.";},get:function($super,a){var b=$super(a);return null===b?this._compute(a):b},_begin:function(){if(!this._isPrepared()){var c=this.element,b;a:{for(b=c;b&&b.parentNode;){if("none"===b.getStyle("display")){b=!1;break a}b=$(b.parentNode)}b=
!0}if(!b){c.store("prototype_original_styles",{position:c.style.position||"",width:c.style.width||"",visibility:c.style.visibility||"",display:c.style.display||""});b=a(c,"position");var k=c.offsetWidth;if(0===k||null===k)c.style.display="block",k=c.offsetWidth;var e="fixed"===b?document.viewport:c.parentNode,g={visibility:"hidden",display:"block"};"fixed"!==b&&(g.position="absolute");c.setStyle(g);g=c.offsetWidth;b=k&&g===k?d(c,e):"absolute"===b||"fixed"===b?d(c,e):$(c.parentNode).getLayout().get("width")-
this.get("margin-left")-this.get("border-left")-this.get("padding-left")-this.get("padding-right")-this.get("border-right")-this.get("margin-right");c.setStyle({width:b+"px"})}this._setPrepared(!0)}},_end:function(){var a=this.element,b=a.retrieve("prototype_original_styles");a.store("prototype_original_styles",null);a.setStyle(b);this._setPrepared(!1)},_compute:function(a){var b=Element.Layout.COMPUTATIONS;if(!(a in b))throw"Property not found.";return this._set(a,b[a].call(this,this.element))},
_isPrepared:function(){return this.element.retrieve("prototype_element_layout_prepared",!1)},_setPrepared:function(a){return this.element.store("prototype_element_layout_prepared",a)},toObject:function(){var a=$A(arguments),b={};(0===a.length?Element.Layout.PROPERTIES:a.join(" ").split(" ")).each(function(a){if(Element.Layout.PROPERTIES.include(a)){var c=this.get(a);null!=c&&(b[a]=c)}},this);return b},toHash:function(){var a=this.toObject.apply(this,arguments);return new Hash(a)},toCSS:function(){var a=
$A(arguments),b={};(0===a.length?Element.Layout.PROPERTIES:a.join(" ").split(" ")).each(function(a){if(Element.Layout.PROPERTIES.include(a)&&!Element.Layout.COMPOSITE_PROPERTIES.include(a)){var c=this.get(a);if(null!=c){var d=b;a.include("border")&&(a+="-width");a=a.camelize();d[a]=c+"px"}}},this);return b},inspect:function(){return"#<Element.Layout>"}});Object.extend(Element.Layout,{PROPERTIES:$w("height width top left right bottom border-left border-right border-top border-bottom padding-left padding-right padding-top padding-bottom margin-top margin-bottom margin-left margin-right padding-box-width padding-box-height border-box-width border-box-height margin-box-width margin-box-height"),
COMPOSITE_PROPERTIES:$w("padding-box-width padding-box-height margin-box-width margin-box-height border-box-width border-box-height"),COMPUTATIONS:{height:function(a){this._preComputing||this._begin();a=this.get("border-box-height");if(0>=a)return this._preComputing||this._end(),0;var b=this.get("border-top"),d=this.get("border-bottom"),e=this.get("padding-top"),g=this.get("padding-bottom");this._preComputing||this._end();return a-b-d-e-g},width:function(a){this._preComputing||this._begin();a=this.get("border-box-width");
if(0>=a)return this._preComputing||this._end(),0;var b=this.get("border-left"),d=this.get("border-right"),e=this.get("padding-left"),g=this.get("padding-right");this._preComputing||this._end();return a-b-d-e-g},"padding-box-height":function(a){a=this.get("height");var b=this.get("padding-top"),d=this.get("padding-bottom");return a+b+d},"padding-box-width":function(a){a=this.get("width");var b=this.get("padding-left"),d=this.get("padding-right");return a+b+d},"border-box-height":function(a){this._preComputing||
this._begin();a=a.offsetHeight;this._preComputing||this._end();return a},"border-box-width":function(a){this._preComputing||this._begin();a=a.offsetWidth;this._preComputing||this._end();return a},"margin-box-height":function(a){a=this.get("border-box-height");var b=this.get("margin-top"),d=this.get("margin-bottom");return 0>=a?0:a+b+d},"margin-box-width":function(a){a=this.get("border-box-width");var b=this.get("margin-left"),d=this.get("margin-right");return 0>=a?0:a+b+d},top:function(a){return a.positionedOffset().top},
bottom:function(a){var b=a.positionedOffset();a=a.getOffsetParent().measure("height");var d=this.get("border-box-height");return a-d-b.top},left:function(a){return a.positionedOffset().left},right:function(a){var b=a.positionedOffset();a=a.getOffsetParent().measure("width");var d=this.get("border-box-width");return a-d-b.left},"padding-top":function(a){return e(a,"paddingTop")},"padding-bottom":function(a){return e(a,"paddingBottom")},"padding-left":function(a){return e(a,"paddingLeft")},"padding-right":function(a){return e(a,
"paddingRight")},"border-top":function(a){return e(a,"borderTopWidth")},"border-bottom":function(a){return e(a,"borderBottomWidth")},"border-left":function(a){return e(a,"borderLeftWidth")},"border-right":function(a){return e(a,"borderRightWidth")},"margin-top":function(a){return e(a,"marginTop")},"margin-bottom":function(a){return e(a,"marginBottom")},"margin-left":function(a){return e(a,"marginLeft")},"margin-right":function(a){return e(a,"marginRight")}}});"getBoundingClientRect"in document.documentElement&&
Object.extend(Element.Layout.COMPUTATIONS,{right:function(a){var b=q(a.getOffsetParent());a=a.getBoundingClientRect();return(b.getBoundingClientRect().right-a.right).round()},bottom:function(a){var b=q(a.getOffsetParent());a=a.getBoundingClientRect();return(b.getBoundingClientRect().bottom-a.bottom).round()}});Element.Offset=Class.create({initialize:function(a,b){this.left=a.round();this.top=b.round();this[0]=this.left;this[1]=this.top},relativeTo:function(a){return new Element.Offset(this.left-a.left,
this.top-a.top)},inspect:function(){return"#<Element.Offset left: #{left} top: #{top}>".interpolate(this)},toString:function(){return"[#{left}, #{top}]".interpolate(this)},toArray:function(){return[this.left,this.top]}});Prototype.Browser.IE?(h=h.wrap(function(a,b){b=$(b);if(b.nodeType===Node.DOCUMENT_NODE||p(b)||"BODY"===b.nodeName.toUpperCase()||n(b))return $(document.body);var d=b.getStyle("position");if("static"!==d)return a(b);b.setStyle({position:"relative"});var e=a(b);b.setStyle({position:d});
return e}),m=m.wrap(function(a,b){b=$(b);if(!b.parentNode)return new Element.Offset(0,0);var d=b.getStyle("position");if("static"!==d)return a(b);var e=b.getOffsetParent();e&&"fixed"===e.getStyle("position")&&q(e);b.setStyle({position:"relative"});e=a(b);b.setStyle({position:d});return e})):Prototype.Browser.Webkit&&(g=function(a){a=$(a);var b=0,d=0;do{b+=a.offsetTop||0;d+=a.offsetLeft||0;if(a.offsetParent==document.body&&"absolute"==Element.getStyle(a,"position"))break;a=a.offsetParent}while(a);
return new Element.Offset(d,b)});Element.addMethods({getLayout:function(a,b){return new Element.Layout(a,b)},measure:function(a,b){return $(a).getLayout().get(b)},getWidth:function(a){return Element.getDimensions(a).width},getHeight:function(a){return Element.getDimensions(a).height},getDimensions:function(a){a=$(a);var b=Element.getStyle(a,"display");if(b&&"none"!==b)return{width:a.offsetWidth,height:a.offsetHeight};var b=a.style,b={visibility:b.visibility,position:b.position,display:b.display},
d={visibility:"hidden",display:"block"};"fixed"!==b.position&&(d.position="absolute");Element.setStyle(a,d);d={width:a.offsetWidth,height:a.offsetHeight};Element.setStyle(a,b);return d},getOffsetParent:h,cumulativeOffset:g,positionedOffset:m,cumulativeScrollOffset:function(a){var b=0,d=0;do if(a==document.body){b+=void 0!==window.pageYOffset?window.pageYOffset:(document.documentElement||document.body.parentNode||document.body).scrollTop||0;d+=void 0!==window.pageXOffset?window.pageXOffset:(document.documentElement||
document.body.parentNode||document.body).scrollLeft||0;break}else b+=a.scrollTop||0,d+=a.scrollLeft||0,a=a.parentNode;while(a);return new Element.Offset(d,b)},viewportOffset:function(a){var b=0,d=0,e=document.body,g=a=$(a);do if(b+=g.offsetTop||0,d+=g.offsetLeft||0,g.offsetParent==e&&"absolute"==Element.getStyle(g,"position"))break;while(g=g.offsetParent);g=a;do g!=e&&(b-=g.scrollTop||0,d-=g.scrollLeft||0);while(g=g.parentNode);return new Element.Offset(d,b)},absolutize:function(a){a=$(a);if("absolute"===
Element.getStyle(a,"position"))return a;var b=h(a),d=a.viewportOffset(),b=b.viewportOffset(),d=d.relativeTo(b),b=a.getLayout();a.store("prototype_absolutize_original_styles",{position:a.getStyle("position"),left:a.getStyle("left"),top:a.getStyle("top"),width:a.getStyle("width"),height:a.getStyle("height")});a.setStyle({position:"absolute",top:d.top+"px",left:d.left+"px",width:b.get("width")+"px",height:b.get("height")+"px"});return a},relativize:function(a){a=$(a);if("relative"===Element.getStyle(a,
"position"))return a;var b=a.retrieve("prototype_absolutize_original_styles");b&&a.setStyle(b);return a},scrollTo:function(a){a=$(a);var b=Element.cumulativeOffset(a);window.scrollTo(b.left,b.top);return a},makePositioned:function(a){a=$(a);var b=Element.getStyle(a,"position"),d={};"static"!==b&&b||(d.position="relative",Prototype.Browser.Opera&&(d.top=0,d.left=0),Element.setStyle(a,d),Element.store(a,"prototype_made_positioned",!0));return a},undoPositioned:function(a){a=$(a);var b=Element.getStorage(a);
b.get("prototype_made_positioned")&&(b.unset("prototype_made_positioned"),Element.setStyle(a,{position:"",top:"",bottom:"",left:"",right:""}));return a},makeClipping:function(a){a=$(a);var b=Element.getStorage(a),d=b.get("prototype_made_clipping");Object.isUndefined(d)&&(d=Element.getStyle(a,"overflow"),b.set("prototype_made_clipping",d),"hidden"!==d&&(a.style.overflow="hidden"));return a},undoClipping:function(a){a=$(a);var b=Element.getStorage(a),d=b.get("prototype_made_clipping");Object.isUndefined(d)||
(b.unset("prototype_made_clipping"),a.style.overflow=d||"");return a},clonePosition:function(a,b,d){d=Object.extend({setLeft:!0,setTop:!0,setWidth:!0,setHeight:!0,offsetTop:0,offsetLeft:0},d||{});b=$(b);a=$(a);var e,g,h,p={};if(d.setLeft||d.setTop)if(e=Element.viewportOffset(b),g=[0,0],"absolute"===Element.getStyle(a,"position")){var m=Element.getOffsetParent(a);m!==document.body&&(g=Element.viewportOffset(m))}if(d.setWidth||d.setHeight)h=Element.getLayout(b);d.setLeft&&(p.left=e[0]-g[0]+d.offsetLeft+
"px");d.setTop&&(p.top=e[1]-g[1]+d.offsetTop+"px");d.setWidth&&(p.width=h.get("border-box-width")+"px");d.setHeight&&(p.height=h.get("border-box-height")+"px");return Element.setStyle(a,p)}});"getBoundingClientRect"in document.documentElement&&Element.addMethods({viewportOffset:function(a){a=$(a);if(p(a))return new Element.Offset(0,0);a=a.getBoundingClientRect();var b=document.documentElement;return new Element.Offset(a.left-b.clientLeft,a.top-b.clientTop)}})})();
(function(){function a(){return d?d:d=b?document.body:document.documentElement}var b=Prototype.Browser.Opera&&9.5>window.parseFloat(window.opera.version()),d=null;document.viewport={getDimensions:function(){return{width:this.getWidth(),height:this.getHeight()}},getWidth:function(){return a().clientWidth},getHeight:function(){return a().clientHeight},getScrollOffsets:function(){return new Element.Offset(window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft,window.pageYOffset||
document.documentElement.scrollTop||document.body.scrollTop)}}})();window.$$=function(){var a=$A(arguments).join(", ");return Prototype.Selector.select(a,document)};
Prototype.Selector=function(){function a(a){for(var b=0,h=a.length;b<h;b++)Element.extend(a[b]);return a}var b=Prototype.K;return{select:function(){throw Error('Method "Prototype.Selector.select" must be defined.');},match:function(){throw Error('Method "Prototype.Selector.match" must be defined.');},find:function(a,b,h){h=h||0;var g=Prototype.Selector.match,m=a.length,n=0,p;for(p=0;p<m;p++)if(g(a[p],b)&&h==n++)return Element.extend(a[p])},extendElements:Element.extend===b?b:a,extendElement:Element.extend}}();
(function(a,b){function d(a,b,c,d){var e,f,g,h,r;(b?b.ownerDocument||b:S)!==B&&H(b);b=b||B;c=c||[];if(!a||"string"!==typeof a)return c;if(1!==(h=b.nodeType)&&9!==h)return[];if(E&&!d){if(e=xa.exec(a))if(g=e[1])if(9===h)if((f=b.getElementById(g))&&f.parentNode){if(f.id===g)return c.push(f),c}else return c;else{if(b.ownerDocument&&(f=b.ownerDocument.getElementById(g))&&F(b,f)&&f.id===g)return c.push(f),c}else{if(e[2])return W.apply(c,b.getElementsByTagName(a)),c;if((g=e[3])&&v.getElementsByClassName&&
b.getElementsByClassName)return W.apply(c,b.getElementsByClassName(g)),c}if(v.qsa&&(!l||!l.test(a))){f=e=t;g=b;r=9===h&&a;if(1===h&&"object"!==b.nodeName.toLowerCase()){h=k(a);(e=b.getAttribute("id"))?f=e.replace(Aa,"\\$&"):b.setAttribute("id",f);f="[id='"+f+"'] ";for(g=h.length;g--;)h[g]=f+D(h[g]);g=Y.test(a)&&b.parentNode||b;r=h.join(",")}if(r)try{return W.apply(c,g.querySelectorAll(r)),c}catch(p){}finally{e||b.removeAttribute("id")}}}var m;a:{a=a.replace(ca,"$1");f=k(a);if(!d&&1===f.length){e=
f[0]=f[0].slice(0);if(2<e.length&&"ID"===(m=e[0]).type&&v.getById&&9===b.nodeType&&E&&s.relative[e[1].type]){b=(s.find.ID(m.matches[0].replace(ea,fa),b)||[])[0];if(!b){m=c;break a}a=a.slice(e.shift().value.length)}for(h=na.needsContext.test(a)?0:e.length;h--;){m=e[h];if(s.relative[g=m.type])break;if(g=s.find[g])if(d=g(m.matches[0].replace(ea,fa),Y.test(e[0].type)&&b.parentNode||b)){e.splice(h,1);a=d.length&&D(e);if(!a){W.apply(c,d);m=c;break a}break}}}U(a,f)(d,b,!E,c,Y.test(a));m=c}return m}function e(){function a(c,
d){b.push(c+=" ")>s.cacheLength&&delete a[b.shift()];return a[c]=d}var b=[];return a}function h(a){a[t]=!0;return a}function g(a){var b=B.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b)}}function m(a,b){for(var c=a.split("|"),d=a.length;d--;)s.attrHandle[c[d]]=b}function n(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||R)-(~a.sourceIndex||R);if(d)return d;if(c)for(;c=c.nextSibling;)if(c===b)return-1;return a?1:-1}function p(a){return function(b){return"input"===
b.nodeName.toLowerCase()&&b.type===a}}function q(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function c(a){return h(function(b){b=+b;return h(function(c,d){for(var e,f=a([],c.length,b),l=f.length;l--;)c[e=f[l]]&&(c[e]=!(d[e]=c[e]))})})}function f(){}function k(a,b){var c,e,f,l,g,k,h;if(g=ba[a+" "])return b?0:g.slice(0);g=a;k=[];for(h=s.preFilter;g;){if(!c||(e=ma.exec(g)))e&&(g=g.slice(e[0].length)||g),k.push(f=[]);c=!1;if(e=da.exec(g))c=e.shift(),
f.push({value:c,type:e[0].replace(ca," ")}),g=g.slice(c.length);for(l in s.filter)!(e=na[l].exec(g))||h[l]&&!(e=h[l](e))||(c=e.shift(),f.push({value:c,type:l,matches:e}),g=g.slice(c.length));if(!c)break}return b?g.length:g?d.error(a):ba(a,k).slice(0)}function D(a){for(var b=0,c=a.length,d="";b<c;b++)d+=a[b].value;return d}function G(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=pa++;return b.first?function(b,c,f){for(;b=b[d];)if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,l){var g,la,ua,k=P+" "+
f;if(l)for(;b=b[d];){if((1===b.nodeType||e)&&a(b,c,l))return!0}else for(;b=b[d];)if(1===b.nodeType||e)if(ua=b[t]||(b[t]={}),(la=ua[d])&&la[0]===k){if(!0===(g=la[1])||g===Q)return!0===g}else if(la=ua[d]=[k],la[1]=a(b,c,l)||Q,!0===la[1])return!0}}function L(a){return 1<a.length?function(b,c,d){for(var e=a.length;e--;)if(!a[e](b,c,d))return!1;return!0}:a[0]}function N(a,b,c,d,e){for(var f,l=[],g=0,k=a.length,h=null!=b;g<k;g++)if(f=a[g])if(!c||c(f,d,e))l.push(f),h&&b.push(g);return l}function M(a,b,c,
e,f,l){e&&!e[t]&&(e=M(e));f&&!f[t]&&(f=M(f,l));return h(function(l,g,k,h){var r,m,p=[],x=[],q=g.length,n;if(!(n=l)){n=b||"*";for(var t=k.nodeType?[k]:k,F=[],s=0,ra=t.length;s<ra;s++)d(n,t[s],F);n=F}n=!a||!l&&b?n:N(n,p,a,k,h);t=c?f||(l?a:q||e)?[]:g:n;c&&c(n,t,k,h);if(e)for(r=N(t,x),e(r,[],k,h),k=r.length;k--;)if(m=r[k])t[x[k]]=!(n[x[k]]=m);if(l){if(f||a){if(f){r=[];for(k=t.length;k--;)(m=t[k])&&r.push(n[k]=m);f(null,t=[],r,h)}for(k=t.length;k--;)(m=t[k])&&-1<(r=f?C.call(l,m):p[k])&&(l[r]=!(g[r]=m))}}else t=
N(t===g?t.splice(q,t.length):t),f?f(null,g,t,h):W.apply(g,t)})}function T(a){var b,c,d,e=a.length,f=s.relative[a[0].type];c=f||s.relative[" "];for(var l=f?1:0,g=G(function(a){return a===b},c,!0),k=G(function(a){return-1<C.call(b,a)},c,!0),h=[function(a,c,d){return!f&&(d||c!==X)||((b=c).nodeType?g(a,c,d):k(a,c,d))}];l<e;l++)if(c=s.relative[a[l].type])h=[G(L(h),c)];else{c=s.filter[a[l].type].apply(null,a[l].matches);if(c[t]){for(d=++l;d<e&&!s.relative[a[d].type];d++);return M(1<l&&L(h),1<l&&D(a.slice(0,
l-1).concat({value:" "===a[l-2].type?"*":""})).replace(ca,"$1"),c,l<d&&T(a.slice(l,d)),d<e&&T(a=a.slice(d)),d<e&&D(a))}h.push(c)}return L(h)}function aa(a,b){var c=0,e=0<b.length,f=0<a.length,l=function(l,g,k,h,r){var m,p,x=[],n=0,q="0",t=l&&[],F=null!=r,ra=X,v=l||f&&s.find.TAG("*",r&&g.parentNode||g),u=P+=null==ra?1:Math.random()||0.1;F&&(X=g!==B&&g,Q=c);for(;null!=(r=v[q]);q++){if(f&&r){for(m=0;p=a[m++];)if(p(r,g,k)){h.push(r);break}F&&(P=u,Q=++c)}e&&((r=!p&&r)&&n--,l&&t.push(r))}n+=q;if(e&&q!==
n){for(m=0;p=b[m++];)p(t,x,g,k);if(l){if(0<n)for(;q--;)t[q]||x[q]||(x[q]=ta.call(h));x=N(x)}W.apply(h,x);F&&!l&&0<x.length&&1<n+b.length&&d.uniqueSort(h)}F&&(P=u,X=ra);return t};return e?h(l):l}var K,v,Q,s,u,Z,U,X,O,H,B,I,E,l,r,x,F,t="sizzle"+-new Date,S=a.document,P=0,pa=0,z=e(),ba=e(),oa=e(),y=!1,ka=function(a,b){a===b&&(y=!0);return 0},A=typeof b,R=-2147483648,qa={}.hasOwnProperty,V=[],ta=V.pop,ga=V.push,W=V.push,ha=V.slice,C=V.indexOf||function(a){for(var b=0,c=this.length;b<c;b++)if(this[b]===
a)return b;return-1},J="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+".replace("w","w#"),w="\\[[\\x20\\t\\r\\n\\f]*((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+)[\\x20\\t\\r\\n\\f]*(?:([*^$|!~]?=)[\\x20\\t\\r\\n\\f]*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+J+")|)|)[\\x20\\t\\r\\n\\f]*\\]",ia=":((?:\\\\.|[\\w-]|[^\\x00-\\xa0])+)(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+w.replace(3,8)+")*)|.*)\\)|)",ca=RegExp("^[\\x20\\t\\r\\n\\f]+|((?:^|[^\\\\])(?:\\\\.)*)[\\x20\\t\\r\\n\\f]+$","g"),ma=/^[\x20\t\r\n\f]*,[\x20\t\r\n\f]*/,
da=/^[\x20\t\r\n\f]*([>+~]|[\x20\t\r\n\f])[\x20\t\r\n\f]*/,Y=/[\x20\t\r\n\f]*[+~]/,ja=RegExp("=[\\x20\\t\\r\\n\\f]*([^\\]'\"]*)[\\x20\\t\\r\\n\\f]*\\]","g"),va=RegExp(ia),wa=RegExp("^"+J+"$"),na={ID:/^#((?:\\.|[\w-]|[^\x00-\xa0])+)/,CLASS:/^\.((?:\\.|[\w-]|[^\x00-\xa0])+)/,TAG:RegExp("^("+"(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+".replace("w","w*")+")"),ATTR:RegExp("^"+w),PSEUDO:RegExp("^"+ia),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\([\\x20\\t\\r\\n\\f]*(even|odd|(([+-]|)(\\d*)n|)[\\x20\\t\\r\\n\\f]*(?:([+-]|)[\\x20\\t\\r\\n\\f]*(\\d+)|))[\\x20\\t\\r\\n\\f]*\\)|)",
"i"),bool:RegExp("^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$","i"),needsContext:RegExp("^[\\x20\\t\\r\\n\\f]*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\([\\x20\\t\\r\\n\\f]*((?:-\\d)?\\d*)[\\x20\\t\\r\\n\\f]*\\)|)(?=[^-]|$)","i")},sa=/^[^{]+\{\s*\[native \w/,xa=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ya=/^(?:input|select|textarea|button)$/i,za=/^h\d$/i,Aa=/'|\\/g,ea=RegExp("\\\\([\\da-f]{1,6}[\\x20\\t\\r\\n\\f]?|([\\x20\\t\\r\\n\\f])|.)",
"ig"),fa=function(a,b,c){a="0x"+b-65536;return a!==a||c?b:0>a?String.fromCharCode(a+65536):String.fromCharCode(a>>10|55296,a&1023|56320)};try{W.apply(V=ha.call(S.childNodes),S.childNodes),V[S.childNodes.length].nodeType}catch(Ba){W={apply:V.length?function(a,b){ga.apply(a,ha.call(b))}:function(a,b){for(var c=a.length,d=0;a[c++]=b[d++];);a.length=c-1}}}Z=d.isXML=function(a){return(a=a&&(a.ownerDocument||a).documentElement)?"HTML"!==a.nodeName:!1};v=d.support={};H=d.setDocument=function(a){var b=a?
a.ownerDocument||a:S;a=b.defaultView;if(b===B||9!==b.nodeType||!b.documentElement)return B;B=b;I=b.documentElement;E=!Z(b);a&&a.attachEvent&&a!==a.top&&a.attachEvent("onbeforeunload",function(){H()});v.attributes=g(function(a){a.className="i";return!a.getAttribute("className")});v.getElementsByTagName=g(function(a){a.appendChild(b.createComment(""));return!a.getElementsByTagName("*").length});v.getElementsByClassName=g(function(a){a.innerHTML="<div class='a'></div><div class='a i'></div>";a.firstChild.className=
"i";return 2===a.getElementsByClassName("i").length});v.getById=g(function(a){I.appendChild(a).id=t;return!b.getElementsByName||!b.getElementsByName(t).length});v.getById?(s.find.ID=function(a,b){if(typeof b.getElementById!==A&&E){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},s.filter.ID=function(a){var b=a.replace(ea,fa);return function(a){return a.getAttribute("id")===b}}):(delete s.find.ID,s.filter.ID=function(a){var b=a.replace(ea,fa);return function(a){return(a=typeof a.getAttributeNode!==
A&&a.getAttributeNode("id"))&&a.value===b}});s.find.TAG=v.getElementsByTagName?function(a,b){if(typeof b.getElementsByTagName!==A)return b.getElementsByTagName(a)}:function(a,b){var c,d=[],e=0,l=b.getElementsByTagName(a);if("*"===a){for(;c=l[e++];)1===c.nodeType&&d.push(c);return d}return l};s.find.CLASS=v.getElementsByClassName&&function(a,b){if(typeof b.getElementsByClassName!==A&&E)return b.getElementsByClassName(a)};r=[];l=[];if(v.qsa=sa.test(b.querySelectorAll))g(function(a){a.innerHTML="<select><option selected=''></option></select>";
a.querySelectorAll("[selected]").length||l.push("\\[[\\x20\\t\\r\\n\\f]*(?:value|checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)");a.querySelectorAll(":checked").length||l.push(":checked")}),g(function(a){var c=b.createElement("input");c.setAttribute("type","hidden");a.appendChild(c).setAttribute("t","");a.querySelectorAll("[t^='']").length&&l.push("[*^$]=[\\x20\\t\\r\\n\\f]*(?:''|\"\")");a.querySelectorAll(":enabled").length||
l.push(":enabled",":disabled");a.querySelectorAll("*,:x");l.push(",.*:")});(v.matchesSelector=sa.test(x=I.webkitMatchesSelector||I.mozMatchesSelector||I.oMatchesSelector||I.msMatchesSelector))&&g(function(a){v.disconnectedMatch=x.call(a,"div");x.call(a,"[s!='']:x");r.push("!=",ia)});l=l.length&&RegExp(l.join("|"));r=r.length&&RegExp(r.join("|"));F=sa.test(I.contains)||I.compareDocumentPosition?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!!(d&&1===d.nodeType&&
(c.contains?c.contains(d):a.compareDocumentPosition&&a.compareDocumentPosition(d)&16))}:function(a,b){if(b)for(;b=b.parentNode;)if(b===a)return!0;return!1};ka=I.compareDocumentPosition?function(a,c){if(a===c)return y=!0,0;var d=c.compareDocumentPosition&&a.compareDocumentPosition&&a.compareDocumentPosition(c);return d?d&1||!v.sortDetached&&c.compareDocumentPosition(a)===d?a===b||F(S,a)?-1:c===b||F(S,c)?1:O?C.call(O,a)-C.call(O,c):0:d&4?-1:1:a.compareDocumentPosition?-1:1}:function(a,c){var d,e=0;
d=a.parentNode;var l=c.parentNode,f=[a],g=[c];if(a===c)return y=!0,0;if(!d||!l)return a===b?-1:c===b?1:d?-1:l?1:O?C.call(O,a)-C.call(O,c):0;if(d===l)return n(a,c);for(d=a;d=d.parentNode;)f.unshift(d);for(d=c;d=d.parentNode;)g.unshift(d);for(;f[e]===g[e];)e++;return e?n(f[e],g[e]):f[e]===S?-1:g[e]===S?1:0};return b};d.matches=function(a,b){return d(a,null,null,b)};d.matchesSelector=function(a,b){(a.ownerDocument||a)!==B&&H(a);b=b.replace(ja,"='$1']");if(v.matchesSelector&&E&&!(r&&r.test(b)||l&&l.test(b)))try{var c=
x.call(a,b);if(c||v.disconnectedMatch||a.document&&11!==a.document.nodeType)return c}catch(e){}return 0<d(b,B,null,[a]).length};d.contains=function(a,b){(a.ownerDocument||a)!==B&&H(a);return F(a,b)};d.attr=function(a,c){(a.ownerDocument||a)!==B&&H(a);var d=s.attrHandle[c.toLowerCase()],d=d&&qa.call(s.attrHandle,c.toLowerCase())?d(a,c,!E):b;return d===b?v.attributes||!E?a.getAttribute(c):(d=a.getAttributeNode(c))&&d.specified?d.value:null:d};d.error=function(a){throw Error("Syntax error, unrecognized expression: "+
a);};d.uniqueSort=function(a){var b,c=[],d=0,e=0;y=!v.detectDuplicates;O=!v.sortStable&&a.slice(0);a.sort(ka);if(y){for(;b=a[e++];)b===a[e]&&(d=c.push(e));for(;d--;)a.splice(c[d],1)}return a};u=d.getText=function(a){var b,c="",d=0;b=a.nodeType;if(!b)for(;b=a[d];d++)c+=u(b);else if(1===b||9===b||11===b){if("string"===typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=u(a)}else if(3===b||4===b)return a.nodeValue;return c};s=d.selectors={cacheLength:50,createPseudo:h,match:na,
attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){a[1]=a[1].replace(ea,fa);a[3]=(a[4]||a[5]||"").replace(ea,fa);"~="===a[2]&&(a[3]=" "+a[3]+" ");return a.slice(0,4)},CHILD:function(a){a[1]=a[1].toLowerCase();"nth"===a[1].slice(0,3)?(a[3]||d.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&d.error(a[0]);return a},
PSEUDO:function(a){var c,d=!a[5]&&a[2];if(na.CHILD.test(a[0]))return null;a[3]&&a[4]!==b?a[2]=a[4]:d&&va.test(d)&&(c=k(d,!0))&&(c=d.indexOf(")",d.length-c)-d.length)&&(a[0]=a[0].slice(0,c),a[2]=d.slice(0,c));return a.slice(0,3)}},filter:{TAG:function(a){var b=a.replace(ea,fa).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=z[a+" "];return b||(b=RegExp("(^|[\\x20\\t\\r\\n\\f])"+a+"([\\x20\\t\\r\\n\\f]|$)"))&&z(a,
function(a){return b.test("string"===typeof a.className&&a.className||typeof a.getAttribute!==A&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(e){e=d.attr(e,a);if(null==e)return"!="===b;if(!b)return!0;e+="";return"="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&-1<e.indexOf(c):"$="===b?c&&e.slice(-c.length)===c:"~="===b?-1<(" "+e+" ").indexOf(c):"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1}},CHILD:function(a,b,c,d,e){var l="nth"!==a.slice(0,3),f="last"!==
a.slice(-4),g="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,k){var h,r,m,p,x;c=l!==f?"nextSibling":"previousSibling";var n=b.parentNode,q=g&&b.nodeName.toLowerCase();k=!k&&!g;if(n){if(l){for(;c;){for(r=b;r=r[c];)if(g?r.nodeName.toLowerCase()===q:1===r.nodeType)return!1;x=c="only"===a&&!x&&"nextSibling"}return!0}x=[f?n.firstChild:n.lastChild];if(f&&k)for(k=n[t]||(n[t]={}),h=k[a]||[],p=h[0]===P&&h[1],m=h[0]===P&&h[2],r=p&&n.childNodes[p];r=++p&&r&&r[c]||(m=p=0)||x.pop();){if(1===
r.nodeType&&++m&&r===b){k[a]=[P,p,m];break}}else if(k&&(h=(b[t]||(b[t]={}))[a])&&h[0]===P)m=h[1];else for(;(r=++p&&r&&r[c]||(m=p=0)||x.pop())&&((g?r.nodeName.toLowerCase()!==q:1!==r.nodeType)||!++m||(k&&((r[t]||(r[t]={}))[a]=[P,m]),r!==b)););m-=e;return m===d||0===m%d&&0<=m/d}}},PSEUDO:function(a,b){var c,e=s.pseudos[a]||s.setFilters[a.toLowerCase()]||d.error("unsupported pseudo: "+a);return e[t]?e(b):1<e.length?(c=[a,a,"",b],s.setFilters.hasOwnProperty(a.toLowerCase())?h(function(a,c){for(var d,
l=e(a,b),f=l.length;f--;)d=C.call(a,l[f]),a[d]=!(c[d]=l[f])}):function(a){return e(a,0,c)}):e}},pseudos:{not:h(function(a){var b=[],c=[],d=U(a.replace(ca,"$1"));return d[t]?h(function(a,b,c,e){e=d(a,null,e,[]);for(var l=a.length;l--;)if(c=e[l])a[l]=!(b[l]=c)}):function(a,e,l){b[0]=a;d(b,null,l,c);return!c.pop()}}),has:h(function(a){return function(b){return 0<d(a,b).length}}),contains:h(function(a){return function(b){return-1<(b.textContent||b.innerText||u(b)).indexOf(a)}}),lang:h(function(a){wa.test(a||
"")||d.error("unsupported lang: "+a);a=a.replace(ea,fa).toLowerCase();return function(b){var c;do if(c=E?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===I},focus:function(a){return a===B.activeElement&&(!B.hasFocus||B.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return!1===
a.disabled},disabled:function(a){return!0===a.disabled},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return!0===a.selected},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if("@"<a.nodeName||3===a.nodeType||4===a.nodeType)return!1;return!0},parent:function(a){return!s.pseudos.empty(a)},header:function(a){return za.test(a.nodeName)},input:function(a){return ya.test(a.nodeName)},
button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||b.toLowerCase()===a.type)},first:c(function(){return[0]}),last:c(function(a,b){return[b-1]}),eq:c(function(a,b,c){return[0>c?c+b:c]}),even:c(function(a,b){for(var c=0;c<b;c+=2)a.push(c);return a}),odd:c(function(a,b){for(var c=1;c<b;c+=2)a.push(c);return a}),lt:c(function(a,b,c){for(b=
0>c?c+b:c;0<=--b;)a.push(b);return a}),gt:c(function(a,b,c){for(c=0>c?c+b:c;++c<b;)a.push(c);return a})}};s.pseudos.nth=s.pseudos.eq;for(K in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})s.pseudos[K]=p(K);for(K in{submit:!0,reset:!0})s.pseudos[K]=q(K);f.prototype=s.filters=s.pseudos;s.setFilters=new f;U=d.compile=function(a,b){var c,d=[],e=[],l=oa[a+" "];if(!l){b||(b=k(a));for(c=b.length;c--;)l=T(b[c]),l[t]?d.push(l):e.push(l);l=oa(a,aa(e,d))}return l};v.sortStable=t.split("").sort(ka).join("")===
t;v.detectDuplicates=y;H();v.sortDetached=g(function(a){return a.compareDocumentPosition(B.createElement("div"))&1});g(function(a){a.innerHTML="<a href='#'></a>";return"#"===a.firstChild.getAttribute("href")})||m("type|href|height|width",function(a,b,c){if(!c)return a.getAttribute(b,"type"===b.toLowerCase()?1:2)});v.attributes&&g(function(a){a.innerHTML="<input/>";a.firstChild.setAttribute("value","");return""===a.firstChild.getAttribute("value")})||m("value",function(a,b,c){if(!c&&"input"===a.nodeName.toLowerCase())return a.defaultValue});
g(function(a){return null==a.getAttribute("disabled")})||m("checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",function(a,b,c){var d;if(!c)return(d=a.getAttributeNode(b))&&d.specified?d.value:!0===a[b]?b.toLowerCase():null});"function"===typeof define&&define.amd?define(function(){return d}):a.Sizzle=d})(window);Prototype._original_property=window.Sizzle;
(function(a){var b=Prototype.Selector.extendElements;Prototype.Selector.engine=a;Prototype.Selector.select=function(d,e){return b(a(d,e||document))};Prototype.Selector.match=function(b,e){return 1==a.matches(e,[b]).length}})(Sizzle);window.Sizzle=Prototype._original_property;delete Prototype._original_property;
var Form={reset:function(a){a=$(a);a.reset();return a},serializeElements:function(a,b){"object"!=typeof b?b={hash:!!b}:Object.isUndefined(b.hash)&&(b.hash=!0);var d,e,h=!1,g=b.submit,m,n;b.hash?(n={},m=function(a,b,c){b in a?(Object.isArray(a[b])||(a[b]=[a[b]]),a[b]=a[b].concat(c)):a[b]=c;return a}):(n="",m=function(a,b,c){Object.isArray(c)||(c=[c]);if(!c.length)return a;var d=encodeURIComponent(b).gsub(/%20/,"+");return a+(a?"&":"")+c.map(function(a){a=a.gsub(/(\r)?\n/,"\r\n");a=encodeURIComponent(a);
a=a.gsub(/%20/,"+");return d+"="+a}).join("&")});return a.inject(n,function(a,b){!b.disabled&&b.name&&(d=b.name,e=$(b).getValue(),null==e||"file"==b.type||"submit"==b.type&&(h||!1===g||g&&d!=g||!(h=!0))||(a=m(a,d,e)));return a})},Methods:{serialize:function(a,b){return Form.serializeElements(Form.getElements(a),b)},getElements:function(a){a=$(a).getElementsByTagName("*");for(var b,d=[],e=Form.Element.Serializers,h=0;b=a[h];h++)e[b.tagName.toLowerCase()]&&d.push(Element.extend(b));return d},getInputs:function(a,
b,d){a=$(a);a=a.getElementsByTagName("input");if(!b&&!d)return $A(a).map(Element.extend);for(var e=0,h=[],g=a.length;e<g;e++){var m=a[e];b&&m.type!=b||d&&m.name!=d||h.push(Element.extend(m))}return h},disable:function(a){a=$(a);Form.getElements(a).invoke("disable");return a},enable:function(a){a=$(a);Form.getElements(a).invoke("enable");return a},findFirstElement:function(a){a=$(a).getElements().findAll(function(a){return"hidden"!=a.type&&!a.disabled});var b=a.findAll(function(a){return a.hasAttribute("tabIndex")&&
0<=a.tabIndex}).sortBy(function(a){return a.tabIndex}).first();return b?b:a.find(function(a){return/^(?:input|select|textarea)$/i.test(a.tagName)})},focusFirstElement:function(a){a=$(a);var b=a.findFirstElement();b&&b.activate();return a},request:function(a,b){a=$(a);b=Object.clone(b||{});var d=b.parameters,e=a.readAttribute("action")||"";e.blank()&&(e=window.location.href);b.parameters=a.serialize(!0);d&&(Object.isString(d)&&(d=d.toQueryParams()),Object.extend(b.parameters,d));a.hasAttribute("method")&&
!b.method&&(b.method=a.method);return new Ajax.Request(e,b)}},Element:{focus:function(a){$(a).focus();return a},select:function(a){$(a).select();return a}}};
Form.Element.Methods={serialize:function(a){a=$(a);if(!a.disabled&&a.name){var b=a.getValue();if(void 0!=b){var d={};d[a.name]=b;return Object.toQueryString(d)}}return""},getValue:function(a){a=$(a);var b=a.tagName.toLowerCase();return Form.Element.Serializers[b](a)},setValue:function(a,b){a=$(a);var d=a.tagName.toLowerCase();Form.Element.Serializers[d](a,b);return a},clear:function(a){$(a).value="";return a},present:function(a){return""!=$(a).value},activate:function(a){a=$(a);try{a.focus(),!a.select||
"input"==a.tagName.toLowerCase()&&/^(?:button|reset|submit)$/i.test(a.type)||a.select()}catch(b){}return a},disable:function(a){a=$(a);a.disabled=!0;return a},enable:function(a){a=$(a);a.disabled=!1;return a}};var Field=Form.Element,$F=Form.Element.Methods.getValue;
Form.Element.Serializers=function(){function a(a,b){if(Object.isUndefined(b))return a.checked?a.value:null;a.checked=!!b}function b(a,b){if(Object.isUndefined(b))return a.value;a.value=b}function d(a){var b=a.selectedIndex;return 0<=b?h(a.options[b]):null}function e(a){var b,d=a.length;if(!d)return null;var e=0;for(b=[];e<d;e++){var q=a.options[e];q.selected&&b.push(h(q))}return b}function h(a){return Element.hasAttribute(a,"value")?a.value:a.text}return{input:function(d,e){switch(d.type.toLowerCase()){case "checkbox":case "radio":return a(d,
e);default:return b(d,e)}},inputSelector:a,textarea:b,select:function(a,b){if(Object.isUndefined(b))return("select-one"===a.type?d:e)(a);for(var h,p,q=!Object.isArray(b),c=0,f=a.length;c<f;c++)if(h=a.options[c],p=this.optionValue(h),q){if(p==b){h.selected=!0;break}}else h.selected=b.include(p)},selectOne:d,selectMany:e,optionValue:h,button:b}}();
Abstract.TimedObserver=Class.create(PeriodicalExecuter,{initialize:function($super,b,d,e){$super(e,d);this.element=$(b);this.lastValue=this.getValue()},execute:function(){var a=this.getValue();if(Object.isString(this.lastValue)&&Object.isString(a)?this.lastValue!=a:String(this.lastValue)!=String(a))this.callback(this.element,a),this.lastValue=a}});Form.Element.Observer=Class.create(Abstract.TimedObserver,{getValue:function(){return Form.Element.getValue(this.element)}});
Form.Observer=Class.create(Abstract.TimedObserver,{getValue:function(){return Form.serialize(this.element)}});
Abstract.EventObserver=Class.create({initialize:function(a,b){this.element=$(a);this.callback=b;this.lastValue=this.getValue();"form"==this.element.tagName.toLowerCase()?this.registerFormCallbacks():this.registerCallback(this.element)},onElementEvent:function(){var a=this.getValue();this.lastValue!=a&&(this.callback(this.element,a),this.lastValue=a)},registerFormCallbacks:function(){Form.getElements(this.element).each(this.registerCallback,this)},registerCallback:function(a){if(a.type)switch(a.type.toLowerCase()){case "checkbox":case "radio":Event.observe(a,
"click",this.onElementEvent.bind(this));break;default:Event.observe(a,"change",this.onElementEvent.bind(this))}}});Form.Element.EventObserver=Class.create(Abstract.EventObserver,{getValue:function(){return Form.Element.getValue(this.element)}});Form.EventObserver=Class.create(Abstract.EventObserver,{getValue:function(){return Form.serialize(this.element)}});
(function(a){function b(a,b){return a.which?a.which===b+1:a.button===b}function d(a,b){return a.button===X[b]}function e(a,b){switch(b){case 0:return 1==a.which&&!a.metaKey;case 1:return 2==a.which||1==a.which&&a.metaKey;case 2:return 3==a.which;default:return!1}}function h(a){a=u.extend(a);var b=a.target,c=a.type;(a=a.currentTarget)&&a.tagName&&("load"===c||"error"===c||"click"===c&&"input"===a.tagName.toLowerCase()&&"radio"===a.type)&&(b=a);return b.nodeType==Node.TEXT_NODE?b.parentNode:b}function g(a){var b=
document.documentElement,c=document.body||{scrollLeft:0};return a.pageX||a.clientX+(b.scrollLeft||c.scrollLeft)-(b.clientLeft||0)}function m(a){var b=document.documentElement,c=document.body||{scrollTop:0};return a.pageY||a.clientY+(b.scrollTop||c.scrollTop)-(b.clientTop||0)}function n(a){return I[a]||a}function p(a){if(a===window)return 0;"undefined"===typeof a._prototypeUID&&(a._prototypeUID=Element.Storage.UID++);return a._prototypeUID}function q(a){return a===window?0:a==document?1:a.uniqueID}
function c(a){return a.include(":")}function f(b,c){var d=a.Event.cache;Object.isUndefined(c)&&(c=p(b));d[c]||(d[c]={element:b});return d[c]}function k(b,c){Object.isUndefined(c)&&(c=p(b));delete a.Event.cache[c]}function D(b,d,e){b=$(b);a:{var g=b,k=f(g);k[d]||(k[d]=[]);for(var k=k[d],h=k.length;h--;)if(k[h].handler===e){e=null;break a}g=p(g);e={responder:a.Event._createResponder(g,d,e),handler:e};k.push(e)}if(null===e)return b;e=e.responder;c(d)?(d=b,d.addEventListener?d.addEventListener("dataavailable",
e,!1):(d.attachEvent("ondataavailable",e),d.attachEvent("onlosecapture",e))):(k=b,d=n(d),k.addEventListener?k.addEventListener(d,e,!1):k.attachEvent("on"+d,e));return b}function G(b,c,d){b=$(b);var e=!Object.isUndefined(d);if(Object.isUndefined(c)&&!e){c=b;d=p(c);var g=a.Event.cache[d];if(g){k(c,d);for(var h in g)if("element"!==h)for(d=g[h],e=d.length;e--;)N(c,h,d[e].responder)}return b}if(!e)return L(b,c),b;h=b;if(e=f(h)[c]){for(var m=e.length;m--;)if(e[m].handler===d){g=e[m];break}g?(d=e.indexOf(g),
e.splice(d,1),0==e.length&&L(h,c),h=g):h=void 0}else h=void 0;if(!h)return b;N(b,c,h.responder);return b}function L(a,b){var c=f(a),d=c[b];if(d){delete c[b];for(var e=d.length;e--;)N(a,b,d[e].responder);for(var g in c)if("element"!==g)return;k(a)}}function N(a,b,d){c(b)?a.removeEventListener?a.removeEventListener("dataavailable",d,!1):(a.detachEvent("ondataavailable",d),a.detachEvent("onlosecapture",d)):(b=n(b),a.removeEventListener?a.removeEventListener(b,d,!1):a.detachEvent("on"+b,d))}function M(a,
b,c,d){a=$(a);a=a!==document?a:document.createEvent&&!a.dispatchEvent?document.documentElement:a;Object.isUndefined(d)&&(d=!0);c=c||{};b=E(a,b,c,d);return u.extend(b)}function T(a,b,c,d){var e=document.createEvent("HTMLEvents");e.initEvent("dataavailable",d,!0);e.eventName=b;e.memo=c;a.dispatchEvent(e);return e}function aa(a,b,c,d){var e=document.createEventObject();e.eventType=d?"ondataavailable":"onlosecapture";e.eventName=b;e.memo=c;a.fireEvent(e.eventType,e);return e}function K(a,b,c,d){a=$(a);
Object.isFunction(c)&&Object.isUndefined(d)&&(d=c,c=null);return(new u.Handler(a,b,c,d)).start()}function v(){a.Event.cache=null}var Q=document.createElement("div"),s=document.documentElement,s="onmouseenter"in s&&"onmouseleave"in s,u={KEY_BACKSPACE:8,KEY_TAB:9,KEY_RETURN:13,KEY_ESC:27,KEY_LEFT:37,KEY_UP:38,KEY_RIGHT:39,KEY_DOWN:40,KEY_DELETE:46,KEY_HOME:36,KEY_END:35,KEY_PAGEUP:33,KEY_PAGEDOWN:34,KEY_INSERT:45},Z=function(a){return!1};window.attachEvent&&(Z=window.addEventListener?function(a){return!(a instanceof
window.Event)}:function(a){return!0});var U,X={0:1,1:4,2:2};U=window.attachEvent?window.addEventListener?function(a,c){return Z(a)?d(a,c):b(a,c)}:d:Prototype.Browser.WebKit?e:b;u.Methods={isLeftClick:function(a){return U(a,0)},isMiddleClick:function(a){return U(a,1)},isRightClick:function(a){return U(a,2)},element:function(a){return Element.extend(h(a))},findElement:function(a,b){var c=h(a),d=Prototype.Selector;if(!b)return Element.extend(c);for(;c;){if(Object.isElement(c)&&d.match(c,b))return Element.extend(c);
c=c.parentNode}},pointer:function(a){return{x:g(a),y:m(a)}},pointerX:g,pointerY:m,stop:function(a){u.extend(a);a.preventDefault();a.stopPropagation();a.stopped=!0}};var O=Object.keys(u.Methods).inject({},function(a,b){a[b]=u.Methods[b].methodize();return a});if(window.attachEvent){var H=function(a){switch(a.type){case "mouseover":case "mouseenter":a=a.fromElement;break;case "mouseout":case "mouseleave":a=a.toElement;break;default:return null}return Element.extend(a)},B={stopPropagation:function(){this.cancelBubble=
!0},preventDefault:function(){this.returnValue=!1},inspect:function(){return"[object Event]"}};u.extend=function(a,b){if(!a)return!1;if(!Z(a)||a._extendedByPrototype)return a;a._extendedByPrototype=Prototype.emptyFunction;var c=u.pointer(a);Object.extend(a,{target:a.srcElement||b,relatedTarget:H(a),pageX:c.x,pageY:c.y});Object.extend(a,O);Object.extend(a,B);return a}}else u.extend=Prototype.K;window.addEventListener&&(u.prototype=window.Event.prototype||document.createEvent("HTMLEvents").__proto__,
Object.extend(u.prototype,O));var I={mouseenter:"mouseover",mouseleave:"mouseout"};s&&(n=Prototype.K);"uniqueID"in Q&&(p=q);u._isCustomEvent=c;var E=document.createEvent?T:aa;u.Handler=Class.create({initialize:function(a,b,c,d){this.element=$(a);this.eventName=b;this.selector=c;this.callback=d;this.handler=this.handleEvent.bind(this)},start:function(){u.observe(this.element,this.eventName,this.handler);return this},stop:function(){u.stopObserving(this.element,this.eventName,this.handler);return this},
handleEvent:function(a){var b=u.findElement(a,this.selector);b&&this.callback.call(this.element,a,b)}});Object.extend(u,u.Methods);Object.extend(u,{fire:M,observe:D,stopObserving:G,on:K});Element.addMethods({fire:M,observe:D,stopObserving:G,on:K});Object.extend(document,{fire:M.methodize(),observe:D.methodize(),stopObserving:G.methodize(),on:K.methodize(),loaded:!1});a.Event?Object.extend(window.Event,u):a.Event=u;a.Event.cache={};window.attachEvent&&window.attachEvent("onunload",v);s=Q=null})(this);
(function(a){function b(a,b,d){return function(e){var h=void 0!==Event.cache[a]?Event.cache[a].element:e.target;if(Object.isUndefined(e.eventName)||e.eventName!==b)return!1;Event.extend(e,h);d.call(h,e)}}function d(a,b,d){return function(b){var e=Event.cache[a].element;Event.extend(b,e);for(var c=b.relatedTarget;c&&c!==e;)try{c=c.parentNode}catch(f){c=e}c!==e&&d.call(e,b)}}var e=document.documentElement,h="onmouseenter"in e&&"onmouseleave"in e;a.Event._createResponder=function(a,e,n){return Event._isCustomEvent(e)?
b(a,e,n):h||"mouseenter"!==e&&"mouseleave"!==e?function(b){if(Event.cache){var d=Event.cache[a].element;Event.extend(b,d);n.call(d,b)}}:d(a,e,n)};e=null})(this);
(function(a){function b(){document.loaded||(h&&window.clearTimeout(h),document.loaded=!0,document.fire("dom:loaded"))}function d(){"complete"===document.readyState&&(document.detachEvent("onreadystatechange",d),b())}function e(){try{document.documentElement.doScroll("left")}catch(a){h=e.defer();return}b()}var h;"complete"===document.readyState?b():(document.addEventListener?document.addEventListener("DOMContentLoaded",b,!1):(document.attachEvent("onreadystatechange",d),window==top&&(h=e.defer())),
Event.observe(window,"load",b))})(this);Element.addMethods();Hash.toQueryString=Object.toQueryString;var Toggle={display:Element.toggle};Element.Methods.childOf=Element.Methods.descendantOf;
var Insertion={Before:function(a,b){return Element.insert(a,{before:b})},Top:function(a,b){return Element.insert(a,{top:b})},Bottom:function(a,b){return Element.insert(a,{bottom:b})},After:function(a,b){return Element.insert(a,{after:b})}},$continue=Error('"throw $continue" is deprecated, use "return" instead'),Position={includeScrollOffsets:!1,prepare:function(){this.deltaX=window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0;this.deltaY=window.pageYOffset||document.documentElement.scrollTop||
document.body.scrollTop||0},within:function(a,b,d){if(this.includeScrollOffsets)return this.withinIncludingScrolloffsets(a,b,d);this.xcomp=b;this.ycomp=d;this.offset=Element.cumulativeOffset(a);return d>=this.offset[1]&&d<this.offset[1]+a.offsetHeight&&b>=this.offset[0]&&b<this.offset[0]+a.offsetWidth},withinIncludingScrolloffsets:function(a,b,d){var e=Element.cumulativeScrollOffset(a);this.xcomp=b+e[0]-this.deltaX;this.ycomp=d+e[1]-this.deltaY;this.offset=Element.cumulativeOffset(a);return this.ycomp>=
this.offset[1]&&this.ycomp<this.offset[1]+a.offsetHeight&&this.xcomp>=this.offset[0]&&this.xcomp<this.offset[0]+a.offsetWidth},overlap:function(a,b){if(!a)return 0;if("vertical"==a)return(this.offset[1]+b.offsetHeight-this.ycomp)/b.offsetHeight;if("horizontal"==a)return(this.offset[0]+b.offsetWidth-this.xcomp)/b.offsetWidth},cumulativeOffset:Element.Methods.cumulativeOffset,positionedOffset:Element.Methods.positionedOffset,absolutize:function(a){Position.prepare();return Element.absolutize(a)},relativize:function(a){Position.prepare();
return Element.relativize(a)},realOffset:Element.Methods.cumulativeScrollOffset,offsetParent:Element.Methods.getOffsetParent,page:Element.Methods.viewportOffset,clone:function(a,b,d){d=d||{};return Element.clonePosition(b,a,d)}};
document.getElementsByClassName||(document.getElementsByClassName=function(a){function b(a){return a.blank()?null:"[contains(concat(' ', @class, ' '), ' "+a+" ')]"}a.getElementsByClassName=Prototype.BrowserFeatures.XPath?function(a,e){e=e.toString().strip();var h=/\s/.test(e)?$w(e).map(b).join(""):b(e);return h?document._getElementsByXPath(".//*"+h,a):[]}:function(a,b){b=b.toString().strip();var h=[],g=/\s/.test(b)?$w(b):null;if(!g&&!b)return h;var m=$(a).getElementsByTagName("*");b=" "+b+" ";for(var n=
0,p,q;p=m[n];n++)p.className&&(q=" "+p.className+" ")&&(q.include(b)||g&&g.all(function(a){return!a.toString().blank()&&q.include(" "+a+" ")}))&&h.push(Element.extend(p));return h};return function(a,b){return $(b||document.body).getElementsByClassName(a)}}(Element.Methods));Element.ClassNames=Class.create();
Element.ClassNames.prototype={initialize:function(a){this.element=$(a)},_each:function(a,b){this.element.className.split(/\s+/).select(function(a){return 0<a.length})._each(a,b)},set:function(a){this.element.className=a},add:function(a){this.include(a)||this.set($A(this).concat(a).join(" "))},remove:function(a){this.include(a)&&this.set($A(this).without(a).join(" "))},toString:function(){return $A(this).join(" ")}};Object.extend(Element.ClassNames.prototype,Enumerable);
(function(){window.Selector=Class.create({initialize:function(a){this.expression=a.strip()},findElements:function(a){return Prototype.Selector.select(this.expression,a)},match:function(a){return Prototype.Selector.match(a,this.expression)},toString:function(){return this.expression},inspect:function(){return"#<Selector: "+this.expression+">"}});Object.extend(Selector,{matchElements:function(a,b){for(var d=Prototype.Selector.match,e=[],h=0,g=a.length;h<g;h++){var m=a[h];d(m,b)&&e.push(Element.extend(m))}return e},
findElement:function(a,b,d){d=d||0;for(var e=0,h,g=0,m=a.length;g<m;g++)if(h=a[g],Prototype.Selector.match(h,b)&&d===e++)return Element.extend(h)},findChildElements:function(a,b){var d=b.toArray().join(", ");return Prototype.Selector.select(d,a||document)}})})();
(function(window) {
    var re = {
        not_string: /[^s]/,
        number: /[dief]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fiosuxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[\+\-]/
    }

    function sprintf() {
        var key = arguments[0], cache = sprintf.cache
        if (!(cache[key] && cache.hasOwnProperty(key))) {
            cache[key] = sprintf.parse(key)
        }
        return sprintf.format.call(null, cache[key], arguments)
    }

    sprintf.format = function(parse_tree, argv) {
        var cursor = 1, tree_length = parse_tree.length, node_type = "", arg, output = [], i, k, match, pad, pad_character, pad_length, is_positive = true, sign = ""
        for (i = 0; i < tree_length; i++) {
            node_type = get_type(parse_tree[i])
            if (node_type === "string") {
                output[output.length] = parse_tree[i]
            }
            else if (node_type === "array") {
                match = parse_tree[i] // convenience purposes only
                if (match[2]) { // keyword argument
                    arg = argv[cursor]
                    for (k = 0; k < match[2].length; k++) {
                        if (!arg.hasOwnProperty(match[2][k])) {
                            throw new Error(sprintf("[sprintf] property '%s' does not exist", match[2][k]))
                        }
                        arg = arg[match[2][k]]
                    }
                }
                else if (match[1]) { // positional argument (explicit)
                    arg = argv[match[1]]
                }
                else { // positional argument (implicit)
                    arg = argv[cursor++]
                }

                if (get_type(arg) == "function") {
                    arg = arg()
                }

                if (re.not_string.test(match[8]) && (get_type(arg) != "number" && isNaN(arg))) {
                    throw new TypeError(sprintf("[sprintf] expecting number but found %s", get_type(arg)))
                }

                if (re.number.test(match[8])) {
                    is_positive = arg >= 0
                }

                switch (match[8]) {
                    case "b":
                        arg = arg.toString(2)
                    break
                    case "c":
                        arg = String.fromCharCode(arg)
                    break
                    case "d":
                    case "i":
                        arg = parseInt(arg, 10)
                    break
                    case "e":
                        arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential()
                    break
                    case "f":
                        arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg)
                    break
                    case "o":
                        arg = arg.toString(8)
                    break
                    case "s":
                        arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg)
                    break
                    case "u":
                        arg = arg >>> 0
                    break
                    case "x":
                        arg = arg.toString(16)
                    break
                    case "X":
                        arg = arg.toString(16).toUpperCase()
                    break
                }
                if (re.number.test(match[8]) && (!is_positive || match[3])) {
                    sign = is_positive ? "+" : "-"
                    arg = arg.toString().replace(re.sign, "")
                }
                else {
                    sign = ""
                }
                pad_character = match[4] ? match[4] === "0" ? "0" : match[4].charAt(1) : " "
                pad_length = match[6] - (sign + arg).length
                pad = match[6] ? (pad_length > 0 ? str_repeat(pad_character, pad_length) : "") : ""
                output[output.length] = match[5] ? sign + arg + pad : (pad_character === "0" ? sign + pad + arg : pad + sign + arg)
            }
        }
        return output.join("")
    }

    sprintf.cache = {}

    sprintf.parse = function(fmt) {
        var _fmt = fmt, match = [], parse_tree = [], arg_names = 0
        while (_fmt) {
            if ((match = re.text.exec(_fmt)) !== null) {
                parse_tree[parse_tree.length] = match[0]
            }
            else if ((match = re.modulo.exec(_fmt)) !== null) {
                parse_tree[parse_tree.length] = "%"
            }
            else if ((match = re.placeholder.exec(_fmt)) !== null) {
                if (match[2]) {
                    arg_names |= 1
                    var field_list = [], replacement_field = match[2], field_match = []
                    if ((field_match = re.key.exec(replacement_field)) !== null) {
                        field_list[field_list.length] = field_match[1]
                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== "") {
                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                                field_list[field_list.length] = field_match[1]
                            }
                            else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                                field_list[field_list.length] = field_match[1]
                            }
                            else {
                                throw new SyntaxError("[sprintf] failed to parse named argument key")
                            }
                        }
                    }
                    else {
                        throw new SyntaxError("[sprintf] failed to parse named argument key")
                    }
                    match[2] = field_list
                }
                else {
                    arg_names |= 2
                }
                if (arg_names === 3) {
                    throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported")
                }
                parse_tree[parse_tree.length] = match
            }
            else {
                throw new SyntaxError("[sprintf] unexpected placeholder")
            }
            _fmt = _fmt.substring(match[0].length)
        }
        return parse_tree
    }

    var vsprintf = function(fmt, argv, _argv) {
        _argv = (argv || []).slice(0)
        _argv.splice(0, 0, fmt)
        return sprintf.apply(null, _argv)
    }

    /**
     * helpers
     */
    function get_type(variable) {
        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase()
    }

    function str_repeat(input, multiplier) {
        return Array(multiplier + 1).join(input)
    }

    /**
     * export to either browser or node.js
     */
    if (typeof exports !== "undefined") {
        exports.sprintf = sprintf
        exports.vsprintf = vsprintf
    }
    else {
        window.sprintf = sprintf
        window.vsprintf = vsprintf

        if (typeof define === "function" && define.amd) {
            define(function() {
                return {
                    sprintf: sprintf,
                    vsprintf: vsprintf
                }
            })
        }
    }
})(typeof window === "undefined" ? this : window);

// Domain Public by Eric Wendelin http://www.eriwen.com/ (2008)
//                  Luke Smith http://lucassmith.name/ (2008)
//                  Loic Dachary <loic@dachary.org> (2008)
//                  Johan Euphrosine <proppy@aminche.com> (2008)
//                  Oyvind Sean Kinsey http://kinsey.no/blog (2010)
//                  Victor Homyakov <victor-homyakov@users.sourceforge.net> (2010)
/*global module, exports, define, ActiveXObject*/
(function(global, factory) {
    if (typeof exports === 'object') {
        // Node
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else {
        // Browser globals
        global.printStackTrace = factory();
    }
}(this, function() {
    /**
     * Main function giving a function stack trace with a forced or passed in Error
     *
     * @cfg {Error} e The error to create a stacktrace from (optional)
     * @cfg {Boolean} guess If we should try to resolve the names of anonymous functions
     * @return {Array} of Strings with functions, lines, files, and arguments where possible
     */
    function printStackTrace(options) {
        options = options || {guess: true};
        var ex = options.e || null, guess = !!options.guess, mode = options.mode || null;
        var p = new printStackTrace.implementation(), result = p.run(ex, mode);
        return (guess) ? p.guessAnonymousFunctions(result) : result;
    }

    printStackTrace.implementation = function() {
    };

    printStackTrace.implementation.prototype = {
        /**
         * @param {Error} [ex] The error to create a stacktrace from (optional)
         * @param {String} [mode] Forced mode (optional, mostly for unit tests)
         */
        run: function(ex, mode) {
            ex = ex || this.createException();
            mode = mode || this.mode(ex);
            if (mode === 'other') {
                return this.other(arguments.callee);
            } else {
                return this[mode](ex);
            }
        },

        createException: function() {
            try {
                this.undef();
            } catch (e) {
                return e;
            }
        },

        /**
         * Mode could differ for different exception, e.g.
         * exceptions in Chrome may or may not have arguments or stack.
         *
         * @return {String} mode of operation for the exception
         */
        mode: function(e) {
            if (typeof window !== 'undefined' && window.navigator.userAgent.indexOf('PhantomJS') > -1) {
                return 'phantomjs';
            }

            if (e['arguments'] && e.stack) {
                return 'chrome';
            }

            if (e.stack && e.sourceURL) {
                return 'safari';
            }

            if (e.stack && e.number) {
                return 'ie';
            }

            if (e.stack && e.fileName) {
                return 'firefox';
            }

            if (e.message && e['opera#sourceloc']) {
                // e.message.indexOf("Backtrace:") > -1 -> opera9
                // 'opera#sourceloc' in e -> opera9, opera10a
                // !e.stacktrace -> opera9
                if (!e.stacktrace) {
                    return 'opera9'; // use e.message
                }
                if (e.message.indexOf('\n') > -1 && e.message.split('\n').length > e.stacktrace.split('\n').length) {
                    // e.message may have more stack entries than e.stacktrace
                    return 'opera9'; // use e.message
                }
                return 'opera10a'; // use e.stacktrace
            }

            if (e.message && e.stack && e.stacktrace) {
                // e.stacktrace && e.stack -> opera10b
                if (e.stacktrace.indexOf("called from line") < 0) {
                    return 'opera10b'; // use e.stacktrace, format differs from 'opera10a'
                }
                // e.stacktrace && e.stack -> opera11
                return 'opera11'; // use e.stacktrace, format differs from 'opera10a', 'opera10b'
            }

            if (e.stack && !e.fileName) {
                // Chrome 27 does not have e.arguments as earlier versions,
                // but still does not have e.fileName as Firefox
                return 'chrome';
            }

            return 'other';
        },

        /**
         * Given a context, function name, and callback function, overwrite it so that it calls
         * printStackTrace() first with a callback and then runs the rest of the body.
         *
         * @param {Object} context of execution (e.g. window)
         * @param {String} functionName to instrument
         * @param {Function} callback function to call with a stack trace on invocation
         */
        instrumentFunction: function(context, functionName, callback) {
            context = context || window;
            var original = context[functionName];
            context[functionName] = function instrumented() {
                callback.call(this, printStackTrace().slice(4));
                return context[functionName]._instrumented.apply(this, arguments);
            };
            context[functionName]._instrumented = original;
        },

        /**
         * Given a context and function name of a function that has been
         * instrumented, revert the function to it's original (non-instrumented)
         * state.
         *
         * @param {Object} context of execution (e.g. window)
         * @param {String} functionName to de-instrument
         */
        deinstrumentFunction: function(context, functionName) {
            if (context[functionName].constructor === Function &&
                context[functionName]._instrumented &&
                context[functionName]._instrumented.constructor === Function) {
                context[functionName] = context[functionName]._instrumented;
            }
        },

        /**
         * Given an Error object, return a formatted Array based on Chrome's stack string.
         *
         * @param e - Error object to inspect
         * @return Array<String> of function calls, files and line numbers
         */
        chrome: function(e) {
            return (e.stack + '\n')
                .replace(/^[\s\S]+?\s+at\s+/, ' at ') // remove message
                .replace(/^\s+(at eval )?at\s+/gm, '') // remove 'at' and indentation
                .replace(/^([^\(]+?)([\n$])/gm, '{anonymous}() ($1)$2')
                .replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}() ($1)')
                .replace(/^(.+) \((.+)\)$/gm, '$1@$2')
                .split('\n')
                .slice(0, -1);
        },

        /**
         * Given an Error object, return a formatted Array based on Safari's stack string.
         *
         * @param e - Error object to inspect
         * @return Array<String> of function calls, files and line numbers
         */
        safari: function(e) {
            return e.stack.replace(/\[native code\]\n/m, '')
                .replace(/^(?=\w+Error\:).*$\n/m, '')
                .replace(/^@/gm, '{anonymous}()@')
                .split('\n');
        },

        /**
         * Given an Error object, return a formatted Array based on IE's stack string.
         *
         * @param e - Error object to inspect
         * @return Array<String> of function calls, files and line numbers
         */
        ie: function(e) {
            return e.stack
                .replace(/^\s*at\s+(.*)$/gm, '$1')
                .replace(/^Anonymous function\s+/gm, '{anonymous}() ')
                .replace(/^(.+)\s+\((.+)\)$/gm, '$1@$2')
                .split('\n')
                .slice(1);
        },

        /**
         * Given an Error object, return a formatted Array based on Firefox's stack string.
         *
         * @param e - Error object to inspect
         * @return Array<String> of function calls, files and line numbers
         */
        firefox: function(e) {
            return e.stack.replace(/(?:\n@:0)?\s+$/m, '')
                .replace(/^(?:\((\S*)\))?@/gm, '{anonymous}($1)@')
                .split('\n');
        },

        opera11: function(e) {
            var ANON = '{anonymous}', lineRE = /^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/;
            var lines = e.stacktrace.split('\n'), result = [];

            for (var i = 0, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    var location = match[4] + ':' + match[1] + ':' + match[2];
                    var fnName = match[3] || "global code";
                    fnName = fnName.replace(/<anonymous function: (\S+)>/, "$1").replace(/<anonymous function>/, ANON);
                    result.push(fnName + '@' + location + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
                }
            }

            return result;
        },

        opera10b: function(e) {
            // "<anonymous function: run>([arguments not available])@file://localhost/G:/js/stacktrace.js:27\n" +
            // "printStackTrace([arguments not available])@file://localhost/G:/js/stacktrace.js:18\n" +
            // "@file://localhost/G:/js/test/functional/testcase1.html:15"
            var lineRE = /^(.*)@(.+):(\d+)$/;
            var lines = e.stacktrace.split('\n'), result = [];

            for (var i = 0, len = lines.length; i < len; i++) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    var fnName = match[1] ? (match[1] + '()') : "global code";
                    result.push(fnName + '@' + match[2] + ':' + match[3]);
                }
            }

            return result;
        },

        /**
         * Given an Error object, return a formatted Array based on Opera 10's stacktrace string.
         *
         * @param e - Error object to inspect
         * @return Array<String> of function calls, files and line numbers
         */
        opera10a: function(e) {
            // "  Line 27 of linked script file://localhost/G:/js/stacktrace.js\n"
            // "  Line 11 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html: In function foo\n"
            var ANON = '{anonymous}', lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
            var lines = e.stacktrace.split('\n'), result = [];

            for (var i = 0, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    var fnName = match[3] || ANON;
                    result.push(fnName + '()@' + match[2] + ':' + match[1] + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
                }
            }

            return result;
        },

        // Opera 7.x-9.2x only!
        opera9: function(e) {
            // "  Line 43 of linked script file://localhost/G:/js/stacktrace.js\n"
            // "  Line 7 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html\n"
            var ANON = '{anonymous}', lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
            var lines = e.message.split('\n'), result = [];

            for (var i = 2, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(ANON + '()@' + match[2] + ':' + match[1] + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
                }
            }

            return result;
        },

        phantomjs: function(e) {
            var ANON = '{anonymous}', lineRE = /(\S+) \((\S+)\)/i;
            var lines = e.stack.split('\n'), result = [];

            for (var i = 1, len = lines.length; i < len; i++) {
                lines[i] = lines[i].replace(/^\s+at\s+/gm, '');
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(match[1] + '()@' + match[2]);
                }
                else {
                    result.push(ANON + '()@' + lines[i]);
                }
            }

            return result;
        },

        // Safari 5-, IE 9-, and others
        other: function(curr) {
            var ANON = '{anonymous}', fnRE = /function(?:\s+([\w$]+))?\s*\(/, stack = [], fn, args, maxStackSize = 10;
            var slice = Array.prototype.slice;
            while (curr && stack.length < maxStackSize) {
                fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
                try {
                    args = slice.call(curr['arguments'] || []);
                } catch (e) {
                    args = ['Cannot access arguments: ' + e];
                }
                stack[stack.length] = fn + '(' + this.stringifyArguments(args) + ')';
                try {
                    curr = curr.caller;
                } catch (e) {
                    stack[stack.length] = 'Cannot access caller: ' + e;
                    break;
                }
            }
            return stack;
        },

        /**
         * Given arguments array as a String, substituting type names for non-string types.
         *
         * @param {Arguments,Array} args
         * @return {String} stringified arguments
         */
        stringifyArguments: function(args) {
            var result = [];
            var slice = Array.prototype.slice;
            for (var i = 0; i < args.length; ++i) {
                var arg = args[i];
                if (arg === undefined) {
                    result[i] = 'undefined';
                } else if (arg === null) {
                    result[i] = 'null';
                } else if (arg.constructor) {
                    // TODO constructor comparison does not work for iframes
                    if (arg.constructor === Array) {
                        if (arg.length < 3) {
                            result[i] = '[' + this.stringifyArguments(arg) + ']';
                        } else {
                            result[i] = '[' + this.stringifyArguments(slice.call(arg, 0, 1)) + '...' + this.stringifyArguments(slice.call(arg, -1)) + ']';
                        }
                    } else if (arg.constructor === Object) {
                        result[i] = '#object';
                    } else if (arg.constructor === Function) {
                        result[i] = '#function';
                    } else if (arg.constructor === String) {
                        result[i] = '"' + arg + '"';
                    } else if (arg.constructor === Number) {
                        result[i] = arg;
                    } else {
                        result[i] = '?';
                    }
                }
            }
            return result.join(',');
        },

        sourceCache: {},

        /**
         * @return {String} the text from a given URL
         */
        ajax: function(url) {
            var req = this.createXMLHTTPObject();
            if (req) {
                try {
                    req.open('GET', url, false);
                    //req.overrideMimeType('text/plain');
                    //req.overrideMimeType('text/javascript');
                    req.send(null);
                    //return req.status == 200 ? req.responseText : '';
                    return req.responseText;
                } catch (e) {
                }
            }
            return '';
        },

        /**
         * Try XHR methods in order and store XHR factory.
         *
         * @return {XMLHttpRequest} XHR function or equivalent
         */
        createXMLHTTPObject: function() {
            var xmlhttp, XMLHttpFactories = [
                function() {
                    return new XMLHttpRequest();
                }, function() {
                    return new ActiveXObject('Msxml2.XMLHTTP');
                }, function() {
                    return new ActiveXObject('Msxml3.XMLHTTP');
                }, function() {
                    return new ActiveXObject('Microsoft.XMLHTTP');
                }
            ];
            for (var i = 0; i < XMLHttpFactories.length; i++) {
                try {
                    xmlhttp = XMLHttpFactories[i]();
                    // Use memoization to cache the factory
                    this.createXMLHTTPObject = XMLHttpFactories[i];
                    return xmlhttp;
                } catch (e) {
                }
            }
        },

        /**
         * Given a URL, check if it is in the same domain (so we can get the source
         * via Ajax).
         *
         * @param url {String} source url
         * @return {Boolean} False if we need a cross-domain request
         */
        isSameDomain: function(url) {
            return typeof location !== "undefined" && url.indexOf(location.hostname) !== -1; // location may not be defined, e.g. when running from nodejs.
        },

        /**
         * Get source code from given URL if in the same domain.
         *
         * @param url {String} JS source URL
         * @return {Array} Array of source code lines
         */
        getSource: function(url) {
            // TODO reuse source from script tags?
            if (!(url in this.sourceCache)) {
                this.sourceCache[url] = this.ajax(url).split('\n');
            }
            return this.sourceCache[url];
        },

        guessAnonymousFunctions: function(stack) {
            for (var i = 0; i < stack.length; ++i) {
                var reStack = /\{anonymous\}\(.*\)@(.*)/,
                    reRef = /^(.*?)(?::(\d+))(?::(\d+))?(?: -- .+)?$/,
                    frame = stack[i], ref = reStack.exec(frame);

                if (ref) {
                    var m = reRef.exec(ref[1]);
                    if (m) { // If falsey, we did not get any file/line information
                        var file = m[1], lineno = m[2], charno = m[3] || 0;
                        if (file && this.isSameDomain(file) && lineno) {
                            var functionName = this.guessAnonymousFunction(file, lineno, charno);
                            stack[i] = frame.replace('{anonymous}', functionName);
                        }
                    }
                }
            }
            return stack;
        },

        guessAnonymousFunction: function(url, lineNo, charNo) {
            var ret;
            try {
                ret = this.findFunctionName(this.getSource(url), lineNo);
            } catch (e) {
                ret = 'getSource failed with url: ' + url + ', exception: ' + e.toString();
            }
            return ret;
        },

        findFunctionName: function(source, lineNo) {
            // FIXME findFunctionName fails for compressed source
            // (more than one function on the same line)
            // function {name}({args}) m[1]=name m[2]=args
            var reFunctionDeclaration = /function\s+([^(]*?)\s*\(([^)]*)\)/;
            // {name} = function ({args}) TODO args capture
            // /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*function(?:[^(]*)/
            var reFunctionExpression = /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*function\b/;
            // {name} = eval()
            var reFunctionEvaluation = /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*(?:eval|new Function)\b/;
            // Walk backwards in the source lines until we find
            // the line which matches one of the patterns above
            var code = "", line, maxLines = Math.min(lineNo, 20), m, commentPos;
            for (var i = 0; i < maxLines; ++i) {
                // lineNo is 1-based, source[] is 0-based
                line = source[lineNo - i - 1];
                commentPos = line.indexOf('//');
                if (commentPos >= 0) {
                    line = line.substr(0, commentPos);
                }
                // TODO check other types of comments? Commented code may lead to false positive
                if (line) {
                    code = line + code;
                    m = reFunctionExpression.exec(code);
                    if (m && m[1]) {
                        return m[1];
                    }
                    m = reFunctionDeclaration.exec(code);
                    if (m && m[1]) {
                        //return m[1] + "(" + (m[2] || "") + ")";
                        return m[1];
                    }
                    m = reFunctionEvaluation.exec(code);
                    if (m && m[1]) {
                        return m[1];
                    }
                }
            }
            return '(?)';
        }
    };

    return printStackTrace;
}));
