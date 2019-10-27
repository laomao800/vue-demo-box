/**
 * @preserve
 * @laomao800/vue-demo-box v1.1.7
 */
'use strict';

var CSS_UNITS = [
  'em', 'ex', '%', 'px', 'cm', 'mm', 'in', 'pt', 'pc',
  'ch','rem','vh','vw','vmin','vmax'
];

var parseSizeWithUnit = function(value, defaultUnit) {
  var validReg = new RegExp('^-?\\d+(.\\d+)?(' + CSS_UNITS.join('|') + ')$', 'i');
  var unit = 'px';
  if (defaultUnit) {
    unit = CSS_UNITS.indexOf(defaultUnit) > -1
    ? defaultUnit
    : 'px';
  }
  if (validReg.test(value)) {
    return value
  } else if (typeof value === 'number') {
    return value + unit
  }
  var num = parseInt(value, 10);
  return !isNaN(num) ? num + unit : null
};

function getCodeSlice(text) {
  var codeSlice = {
    html: '',
    script: '',
    style: ''
  };
  if (text) {
    codeSlice.html = stripTemplate(text);
    codeSlice.script = stripScript(text);
    codeSlice.style = stripStyle(text);
  }
  return codeSlice
}

// fork from https://github.com/ElemeFE/element/blob/dev/examples/util.js
function stripTemplate(content) {
  content = content.trim();
  if (!content) {
    return content
  }
  return content.replace(/<(script|style)[\s\S]+<\/\1>/g, '').trim()
}

function stripScript(content) {
  var result = content.match(/<(script)>([\s\S]+)<\/\1>/);
  return result && result[2] ? result[2].trim() : ''
}

function stripStyle(content) {
  var result = content.match(/<(style)[\s\S]*?>([\s\S]+)<\/\1>/);
  return result && result[2] ? result[2].trim() : ''
}

/**
 * https://docs.jsfiddle.net/api/display-a-fiddle-from-post
 */
function goJsfiddle(ref) {
  var html = ref.html;
  var script = ref.script;
  var style = ref.style;
  var jsRes = ref.jsRes;
  var cssRes = ref.cssRes;

  var htmlTpl = "<div id=\"app\">\n" + html + "\n</div>";
  var jsTpl = _getBrowserRunableJS(script);
  // prettier-ignore
  var resources = _normalizeRes(cssRes).concat( _normalizeRes(jsRes)
  ).join(',');
  _submitForm({
    url: 'https://jsfiddle.net/api/post/library/pure/',
    data: {
      wrap: 'b',
      html: htmlTpl,
      js: jsTpl,
      css: style,
      resources: resources
    }
  });
}

/**
 * https://blog.codepen.io/documentation/api/prefill/
 */
function goCodepen(ref) {
  var html = ref.html;
  var script = ref.script;
  var style = ref.style;
  var jsRes = ref.jsRes;
  var cssRes = ref.cssRes;

  var htmlTpl = "<div id=\"app\">\n" + html + "\n</div>";
  var jsTpl = _getBrowserRunableJS(script);
  var data = {
    html: htmlTpl,
    js: jsTpl,
    css: style,
    js_external: _normalizeRes(jsRes).join(';'),
    css_external: _normalizeRes(cssRes).join(';')
  };
  _submitForm({
    url: 'https://codepen.io/pen/define/',
    data: {
      data: JSON.stringify(data)
    }
  });
}

function _submitForm(ref) {
  var url = ref.url;
  var data = ref.data; if ( data === void 0 ) data = {};

  var $form = document.createElement('form');
  $form.action = url;
  $form.method = 'POST';
  $form.target = '_blank';
  $form.style.display = 'none';

  Object.entries(data).forEach(function (ref) {
    var key = ref[0];
    var value = ref[1];

    var $input = document.createElement('input');
    $input.setAttribute('name', key);
    $input.setAttribute('value', value);
    $input.setAttribute('type', 'hidden');
    $form.appendChild($input);
  });

  document.body.appendChild($form);
  $form.onsubmit = function () { return document.body.removeChild($form); };
  $form.submit();
  return $form
}

function _normalizeRes(res) {
  return Array.isArray(res) ? res.filter(function (res) { return typeof res === 'string'; }) : []
}

function _getBrowserRunableJS(script) {
  var code = script || '';
  var moduleReg = /export\s+default\s*/;
  if (moduleReg.test(code)) {
    return (
      code.replace(moduleReg, 'var Main = ').trim() +
      "\nvar Ctor = Vue.extend(Main)\nnew Ctor().$mount('#app')"
    )
  }
  return ((code.trim()) + "\nnew Vue().$mount('#app')")
}

//

var script = {
  name: 'DemoBox',

  props: {
    title: {
      type: String
    },
    jsfiddle: {
      type: Boolean,
      default: true
    },
    codepen: {
      type: Boolean,
      default: true
    },
    jsRes: {
      type: Array,
      default: function () { return []; }
    },
    cssRes: {
      type: Array,
      default: function () { return []; }
    },
    horizon: {
      type: Boolean,
      default: false
    },
    codeHeight: {
      type: [String, Number]
    }
  },

  data: function data() {
    return {
      expand: false,
      codeSlice: {
        html: '',
        script: '',
        style: ''
      }
    }
  },

  computed: {
    globalConfig: function globalConfig() {
      return this.$DEMO_BOX || {}
    },
    finalRes: function finalRes() {
      var globalJsRes = this.globalConfig.jsRes || [];
      var globalCssRes = this.globalConfig.cssRes || [];
      return {
        jsRes: Array.from(new Set(globalJsRes.concat( this.jsRes))),
        cssRes: Array.from(new Set(globalCssRes.concat( this.cssRes)))
      }
    },
    finalPlatform: function finalPlatform() {
      var ref = this.globalConfig;
      var jsfiddle = ref.jsfiddle;
      var codepen = ref.codepen;
      return {
        jsfiddle: jsfiddle === false ? false : this.jsfiddle,
        codepen: codepen === false ? false : this.codepen
      }
    },
    _codeHeight: function _codeHeight() {
      return parseSizeWithUnit(this.codeHeight)
    }
  },

  mounted: function mounted() {
    var sourceCode = this.getSourceCode();
    this.codeSlice = getCodeSlice(sourceCode);
  },

  methods: {
    getSourceCode: function getSourceCode() {
      if (this.$slots.code && this.$slots.code[0]) {
        return this.$slots.code[0].elm.textContent
      }
      return ''
    },
    jumpTo: function jumpTo(platform) {
      switch (platform) {
        case 'jsfiddle':
          goJsfiddle(Object.assign({}, this.codeSlice,
            this.finalRes));
          break
        case 'codepen':
          goCodepen(Object.assign({}, this.codeSlice,
            this.finalRes));
          break
      }
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD;
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) { style.element.setAttribute('media', css.media); }

      if (HEAD === undefined) {
        HEAD = document.head || document.getElementsByTagName('head')[0];
      }

      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) { style.element.removeChild(nodes[index]); }
      if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }else { style.element.appendChild(textNode); }
    }
  }
}

var browser = createInjector;

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      staticClass: "db__wrapper",
      class: {
        "db__wrapper--expand": _vm.expand,
        "db__wrapper--horizon": this.horizon
      }
    },
    [
      _c("div", { staticClass: "db__demo-content" }, [
        _c("div", { staticClass: "db__demo" }, [_vm._t("demo")], 2),
        _vm._v(" "),
        _vm.title || _vm.$slots.default
          ? _c("div", { staticClass: "db__meta" }, [
              _vm.title
                ? _c("div", { staticClass: "db__title" }, [
                    _vm._v(_vm._s(_vm.title))
                  ])
                : _vm._e(),
              _vm._v(" "),
              _vm.$slots.default
                ? _c(
                    "div",
                    { staticClass: "db__description" },
                    [_vm._t("default")],
                    2
                  )
                : _vm._e()
            ])
          : _vm._e()
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "db__code-content" }, [
        _c("div", { staticClass: "db__actions" }, [
          _vm.finalPlatform.jsfiddle
            ? _c("div", {
                staticClass: "db__icon db__icon-jsfiddle",
                attrs: { title: "jsfiddle" },
                on: {
                  click: function($event) {
                    return _vm.jumpTo("jsfiddle")
                  }
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.finalPlatform.codepen
            ? _c("div", {
                staticClass: "db__icon db__icon-codepen",
                attrs: { title: "codepen" },
                on: {
                  click: function($event) {
                    return _vm.jumpTo("codepen")
                  }
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.$slots.code
            ? _c("div", {
                staticClass: "db__icon db__icon-code",
                attrs: { title: "code" },
                on: {
                  click: function($event) {
                    _vm.expand = !_vm.expand;
                  }
                }
              })
            : _vm._e()
        ]),
        _vm._v(" "),
        _vm.$slots.code
          ? _c(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: _vm.expand || _vm.horizon,
                    expression: "expand || horizon"
                  }
                ],
                staticClass: "db__code",
                style: {
                  height: _vm._codeHeight
                }
              },
              [_vm._t("code")],
              2
            )
          : _vm._e()
      ])
    ]
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-ca7886d4_0", { source: ".db__wrapper {\n  position: relative;\n  display: inline-block;\n  width: 100%;\n  margin: 16px 0;\n  border: 1px solid #ebedf0;\n  border-radius: 4px;\n  overflow: hidden;\n}\n.db__demo {\n  padding: 42px 24px;\n  color: rgba(0, 0, 0, 0.65);\n  border-bottom: 1px solid #ebedf0;\n}\n.db__meta {\n  position: relative;\n  width: 100%;\n  font-size: 14px;\n  line-height: 1.8;\n  color: #314659;\n}\n.db__title {\n  position: absolute;\n  top: -14px;\n  margin-left: 16px;\n  padding: 0 8px;\n  color: #777;\n  background: #fff;\n}\n.db__description {\n  padding: 18px 24px 12px;\n  border-bottom: 1px dashed #ebedf0;\n}\n.db__icon {\n  display: inline-block;\n  width: 30px;\n  height: 30px;\n  overflow: hidden;\n  text-indent: -9999px;\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: 18px;\n  cursor: pointer;\n}\n.db__icon-jsfiddle {\n  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADkklEQVRYR+2XTYgcVRDH//VuIrkYAho8CPGSGKKQGGWTQyRxxYMHD4qK36CgON3v7cKCH+AH4sGPedUbGPQQDGiMJAgegh5MSFCDroKJ0U0ExXhIUFBycDXI7k7/pYbupbczvWGyhiDsgzn0e1WvfvXRVT2CS7zkEtvHEsD/OwIhhDvzPB92zq0juQ7ALwAOi8hREZlot9tHzldjFxSBEMI9AFokh5oMkPxHRN5Q1ecWghgYIE3Tp0Rk+/k8q5yfUNU1TfIDAXjvHwfw1gDGe6IkD2RZtq2fXiOA9/4GAFsAHFXVQ6bsvf8JwKpBAQr5B1X1nbpuX4AQQptkqAj/DqAD4PkLNG5qUyQ3Z1l2rHrHOQDe+9MAVi7CUKMqyTTLsvFGAO+9efjCxTBe1MK7WZY9sBDAwSLvF4VBRH6IMa5eCOAvAJfXrP8N4DjJYyLSBbC++DVB/mnNCIAV7LLCoWsK4TOqurwvQAjhCpIfAbipFCD5poi8pKq/VpWSJNnqnHsFwMbK/oRz7uV2u72vTua9twJ+otjfCWCPqn5sz70i9N5b3usVvl9Vb21yc2xsbNn09PQuAHcAeFFVF6ydNE13i4h1UFtnAWxT1S9kdHR0TbfbnawZOpPn+c3j4+M/tlqtVc6510TE2u4pAPuqxrz3nwPYBGC7qiYhhECybSkg+d3MzMyTnU7ntxDCBpJfV+x80+12hySE8DrJ0RrALlW9v4iO5dRyWV2HROSxGKPl2SJYFq8BXl2TPayqmwu59wDcW56LyNPivf+ymvfisBfShuiU+pOqurZ8qEDUs/aHqq7ol2qSRwzA8nFZTWsup9777wFcVzu3zrhCRA7EGHs9vqiJTwFYC6+uOVDvvc0RmyflOmsA3wKwWT4vxKp6i22kaXqXiOwpD0l2nHPvk3wWwG0AdqvqfYWH9rpZMT9cuazqzEkA5StpIpMGsAPAo/W4VSvbvJudnb0qz/OVlcFkF+0FsAHATlV9pLwjSZIh59xaEfk5xri/gDtnkpLcISMjI1vzPO8J1RfJ4SzLPqnvp2l6o4i8Wu2aNnKdc8/EGL+qyze85sjzfFPZB2xAtPpBAPiQ5HEAEyJyJcmNInJ3nzfD1KcAfGCdkOSUiFxfdM3hpgjPTcM+BdLAs/htEdkbYzQn5v8vSJJkvXPuIQC3A7h28abm3WAfrJ+JyMEY49vlyUCfZP8xUO+6JYClCPwLFEV3Oh6KTXQAAAAASUVORK5CYII=');\n}\n.db__icon-codepen {\n  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEnUlEQVRYR51XTWhdRRT+zo2VZCE8f6hIXRRF0IVgF9aCKFYRRaRUlKIWcWOCC83MvPqTxpre/JhETd/MpF1I6kY0VURRiogiaqgIWhcVXCiI0oUiikrARYI198h5zLvMu7n3Jq+zuvfOOWe+c84355xLOM9ljLmPmZ8WdSJ62Vr73vmYol6VjDGXABhn5idiXSI6BuCwtfbvXmz2BMAY8yAzjwG4ruKQ74lowlr71mZBbApA8HqWmQcjw/8BuCC8x8+SkuMARjYTjQ0BaK33S8gBXB0d/jGAWQCfh2+75UAAd0UyP0lKnHOLddGoBBC8bjHzo5GBv+Rg59yc1vq2GIBzbklr/VQAcmlHh4heA9CsikYpgOC1eHhldPjbAGacc9/KtzIA4fsNAA4C2Bfp/iLAyqLRBUC8ZuZ5ABL2zvqZmWe995LXfFUB6AgopQaJSNJyVaS2SETDcTRyAOI1EUnIt3YUmPl4kiTj1tpfi3ncCIDIG2O2ZVl2mIhy8hLRH8zc7ESDyrwmojPMPOGce7+KQJsB0NHVWu8lojFm3lGMBmmthclCqPZi5umVlZV0YWHhXB17lVJHiahdjJj5mPf+yTr5oaGhLQMDAykRjUZySwKAC4pCtFioa1sptYeIPIDtBb2zzKy89ydrojYdCJqLlAGQze+YedR7/0GBeELEx+o8BfCqcy4uWFBK3UtEcvj1Rd0YwFKciiDYNjY8PHxHkiRSUC6PDHzS19f3sLyvra2dAHBntPd7lmX75+fnP9Val4HOz+oCwMyWiJ4DsDMy9ieAy2LkSZIMtVqtrmvZbDYHsyxbKHhY1D3NzC8Qkek42wXAObc7TdMLl5eX02KuAtk+ApB6778uS4NS6ibZJ6K7S/ZnGo1GmqbpvzHxqwAcAvB8iZFT0hecc5+VAdBa3y71H8CtJfuTjUZjqhYAgDlmPkREuyIDUoS2bXRTtNbrGA6gS5eZvyKiKQDSM9pXv5aEwgdr7bQx5hZmfrMA5Jssyx4QI0mSvAPgxhg0ET1krf3CGDMqeS84UErCXIaZT8jhzrmzsaJSao6IDtRdQ2Y+4r0XD/Oltd4eyNe+NfEq1gG5/+Pe+3erDgl5fgXANQWZHwE8XsUPkVVK3U9EwpG8HgiANwrd72SSJGmr1TpT56kxxjPzcDuPRPPWWlUn32w2d2RZJrdrTyS3SCMjIxevrq5KaX0k2vgnROJITSTWDSRVskqpA8HziyKZ1/v7+1Xejo0x+5jZAbiiI8TMH4Z2fLpofDPd0BizM7TjeyL934hIW2tlwEHXQKK1bhDRS4XhcyVE48UCsWojoJR6Nng90NGTYZWZn3HOLeffysIm/RuALXQ8GUQnnXNfik7NSHZzKGLxgCq3yZTNF5VDqUQDwASAuM+fk0HFez9VBkApJUVM/hu2RI4dBTAWe911DeuYGzzdy8wzRHRtJCuleLIwlkvpllLcXsz8AxEdrJuq1nGghvESDbm/OpKRQaYTwfhZRITM0jPyXFfZ3vDHpEA84YYAkdG7bMnILgdXzpJFpZ4AhJSURaMnr3viQE1aJBrStmVN9eJ1bPN/VPYyNsmLYnoAAAAASUVORK5CYII=');\n}\n.db__icon-code {\n  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAgCAYAAAB3j6rJAAADgElEQVRYR+2WS4hcRRSG/6oaDWM2GhPEgCYxLnxEIgo+8IGKZBHcKDhRUWN8ZKFzb5/qaVAX0QGDg+LcOtUKiuIrvkeD2UgIKEmIisGFIOhGEImLgEScpYuee6Sa6jDp6fuYzoCDWKtL3b/O+eq87lVYJkstEw78D9Kfif9mRIhoEsB2AO8yc3iuvZY0IkR0GMDNAO5n5g9qUwBLV6zW2otF5JfgfHR0dPXU1NSfSw5irZ0REc/M3xQZbzQajymlXgfwPTNfE3TW2lUistcY88T09PTPZWCVqYkQdwcjxpjLiwwS0YcA7gXwHDM/E/RE9B2AawH8ZIwZK4MpBZkPoZT61Dk3NuhW1tpREfkdwLla6xuyLPs2goSCfTaeKYUpBKkLEZw0m82teZ5/AeAEM6+ZD0tEAaTXQYUwA0EWAxGcNhqNl5RSEwBmmHlbf9TqwCwAWSxETMGPAK5QSj3snHt7UPqqYE4BGRLiSgA/ROdrmfl4UXeUwZwEGQYitqgVkQzAUWa+rmp2FMF0QYaFiGk5AGCLUuoF59xTVSBF3aRERFlrOwB0ECmltjnnZuoYTJJkjTHmj6i9lZkP1TmXpukmrXXwcWnQa61v60ZkcnLyzNnZ2b8AnBUNPcjM71UZtdaOicgnAI4z89oqfXifpunVWutwZmPUb2Xm/SdrpNVqrex0OscArAoCEXnUe/9mmXEiCh3yEICPmPm+KhAiuh5AgLggau9k5n3dTPQNn7PDOAbQu93jzPxqSReciNN0Z5Zlb1RA3wLgYwDnxYve470PUN21YI5MTEysnpubOwrgolgz5Jzz/U7SNL1Ra30k7Od5vq7dbodoDlzW2i0iEiDOiRDbvfd75osHTlYiOl8p9aWIXBbFTzLzi33Rex7A0wC+ZuabiiCazeYdeZ4HiJURYqf3fkH0Cr81aZpeqLX+HMBVMTK7nHO7ew6JqDdNdzvndg0CIaK7YjrOiO8fYea3BmlLv75Jkmw0xuwFsDke7rZoq9Xa0Ol0fo1pub3dbn9VACK9fa31A1mWvV8Uucr/kfHx8UtGRkY+E5HXvPevBEPW2nEReRnAMWZeV1LMoUAPisgphbnoiJQ46E5TAHuYOfwsn/aqjEi/hyRJVhhj/o77O5j5ndOmGObnmYi64Y7ONzDzb/8KSHBKROsBrK/7bakDuujU1DE6jGbZgPwDl2+TShZ1VDEAAAAASUVORK5CYII=');\n}\n.db__actions {\n  padding: 4px 0;\n  text-align: center;\n  line-height: 30px;\n  -webkit-transition: opacity 0.3s;\n  transition: opacity 0.3s;\n}\n.db__actions .db__icon {\n  margin: 0 10px;\n  vertical-align: top;\n  opacity: 0.7;\n  -webkit-transition: opacity 0.2s, -webkit-transform 0.2s;\n  transition: opacity 0.2s, -webkit-transform 0.2s;\n  transition: transform 0.2s, opacity 0.2s;\n  transition: transform 0.2s, opacity 0.2s, -webkit-transform 0.2s;\n}\n.db__actions .db__icon:hover {\n  -webkit-transform: scale(1.1);\n          transform: scale(1.1);\n  opacity: 1;\n}\n.db__code {\n  display: none;\n  overflow: auto;\n}\n.db__code div[class*='language-'] {\n  border-radius: 0;\n}\n.db__code div[class*='language-'] pre[class*='language-'] {\n  margin: 0;\n}\n.db__code div[class*='language-'] .highlight-lines {\n  overflow: hidden;\n  bottom: 0px;\n}\n\n.db__wrapper--expand .db__actions {\n  border-bottom: 1px dashed #ebedf0;\n}\n.db__wrapper--expand .db__code {\n  display: block;\n}\n\n.db__wrapper--horizon {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n.db__wrapper--horizon > * {\n  width: 50%;\n}\n.db__wrapper--horizon > * + * {\n  border-left: 1px solid #ebedf0;\n}\n.db__wrapper--horizon .db__description {\n  border-bottom: none;\n}\n.db__wrapper--horizon .db__actions {\n  text-align: right;\n  padding-left: 10px;\n  padding-right: 10px;\n  background-color: #f8f8f8;\n  border-bottom: 1px solid #ebedf0;\n  color: #333;\n}\n.db__wrapper--horizon .db__actions::before {\n  content: 'Code';\n  float: left;\n  font-size: 14px;\n  font-weight: 700;\n}\n.db__wrapper--horizon .db__icon-code {\n  display: none;\n}\n.db__wrapper--horizon .db__code {\n  display: block;\n}\n", map: undefined, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var DemoBox = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

DemoBox.install = function(Vue, options) {
  Vue.component(DemoBox.name, DemoBox);
  Vue.prototype.$DEMO_BOX = options;
};

if (typeof window !== 'undefined' && window.Vue) {
  DemoBox.install(window.Vue);
}

module.exports = DemoBox;
