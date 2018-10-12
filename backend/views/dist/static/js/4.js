webpackJsonp([4],{

/***/ 109:
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),

/***/ 275:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ 276:
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(109)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ 283:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_catEditor_vue__ = __webpack_require__(291);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0cf996c1_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_catEditor_vue__ = __webpack_require__(307);
function injectStyle (ssrContext) {
  __webpack_require__(305)
}
var normalizeComponent = __webpack_require__(21)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-0cf996c1"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_catEditor_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0cf996c1_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_catEditor_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 291:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
    name: 'myEditor',
    data: function data() {
        return {
            data_list: [{
                ori: '“盗贼，可是一份很有前途的职业！”',
                lan: "“Trust me, thieving is a promising career!”"
            }, {
                ori: '菲尼克相信，任何职业都有其存在的理由和价值，所以哪怕是做盗贼，也要做到足够的专业和敬业。在这份信念的支持下，菲尼克的工作取得举世瞩目的业绩，诸如“圣光城金库大劫案”、“炼金堡秘宝失窃案”，都是他的“伟大杰作”。',
                lan: "Fennik believed that all professions had their values and reasons for existing. Which was why he stood by the belief that, since he was a thief, he should be the best of them all. Go big or go home, right? This was how Fennik became renowned in the field—his “masterpieces” included the Great Heist of the Luxis City Treasury and the Theft of the Secret Treasures of Fort Alchemy."
            }, {
                ori: '贼不走空，是菲尼克一直奉行的工作原则。大到对金库的劫掠，小到在街头扒人口袋，菲尼克从未有过失手的记录。当然，如果遇到非常贫困的作案目标，那么菲尼克不但会在事后偷偷还回失窃的财物，同时还会加上一笔额外的财物，帮助他们度过眼前的难关。',
                lan: 'w Fennik became renowned in the field—his “masterpieces” included the Great Heist of the Luxis City Treasury and the Theft of the Secret Treasures of Fort Alchemy.'
            }, {
                ori: '“盗亦有道？当然不是了。猪，总得养肥了再杀啊！”在菲尼克制定的职业操守中，不把作案目标逼上绝路只是第二条，给予贫困目标一定的帮助、维持盗贼职业的可持续发展，才是首要任务。菲尼克认为，只有人们的物质生活水平不断提高，才能让盗贼们获得更广阔的发展空间。一味掠夺财富，且积财不用，只会加剧同行的竞争压力：“想想看，等到咱们的钱攒得比谁都多的时候，就只能瞅着彼此下手了！”',
                lan: 'It was one of Fennik’s principles to never leave empty-handed. He was not one to fail, whether when robbing a bank or simply picking some pockets on the street. Of course, if it turned out that his unfortunate target was dirt-poor, he would not only return what he had stolen afterwards but also add a little something to go with it, which was quite a pleasant surprise for the victim.'
            }, {
                ori: 1,
                lan: 1
            }, {
                ori: 2,
                lan: 2
            }, {
                ori: 3,
                lan: 3
            }, {
                ori: 4,
                lan: 4
            }, {
                ori: 5,
                lan: 5
            }, {
                ori: 6,
                lan: 6
            }, {
                ori: 7,
                lan: 7
            }, {
                ori: 8,
                lan: 8
            }, {
                ori: 9,
                lan: 9
            }],
            sel_table: [],
            edit_index: ''
        };
    },

    methods: {
        // 选择一个
        sel_one: function sel_one(index, type) {
            this.sel_table = [type + '+' + index];
            if (this.sel_table[0] != this.edit_index) {
                this.edit_index = '';
            }
        },

        //选择多个
        sel_more: function sel_more(index, type) {
            // 首先判断有没有其他已选中的
            var is_other = this.judge_sel(type);
            if (is_other) {
                this.sel_table = [type + '+' + index];
            } else {
                this.sel_table.push(type + '+' + index);
                // 范围选中
                this.sel_range(index, type + '+');
            }
        },

        // 判断是否有选中了其他类型的行
        judge_sel: function judge_sel(flag) {
            var is_sel = false;
            this.sel_table.forEach(function (item) {
                var _flag = item.split('+')[0];
                if (_flag != flag) {
                    is_sel = true;
                    return;
                }
            });
            return is_sel;
        },

        // 范围选择 ctrl + click
        sel_range: function sel_range(ind, type) {
            var first_ind = this.sel_table[0].split('+')[1];
            this.sel_table = [];
            // 0 ~ 4
            if (first_ind - ind > 0) {
                for (var i = ind; i <= first_ind; i++) {
                    this.sel_table.push(type + i);
                };
            } else {
                for (var _i = parseInt(first_ind); _i <= ind; ++_i) {
                    this.sel_table.push(type + _i);
                }
            }
        },


        // 双击
        edit_one: function edit_one(index, type) {
            var _this = this;

            this.edit_index = type + '+' + index;
            if (type == 'l') {
                setTimeout(function () {
                    var data = _this.$refs['ori' + index];
                    _this.makeExpandingArea(data[0]);
                }, 0);
            } else {
                setTimeout(function () {
                    var data = _this.$refs['lan' + index];
                    _this.makeExpandingArea(data[0]);
                }, 0);
            }
        },

        //点击拆分
        split_paragraph: function split_paragraph() {
            var _ref = [this.edit_index.split('+')[0], this.edit_index.split('+')[1]],
                type = _ref[0],
                index = _ref[1];

            if (type == 'l') {
                this.deal_split('ori', index);
            } else if (type == 'r') {
                this.deal_split('lan', index);
            } else {
                this.$message.error('请再编辑状态下拆分单元格!');
            };
        },

        // 处理拆分的逻辑
        deal_split: function deal_split(types, index) {
            var data = this.$refs[types + index];
            var split_data = data[0].value.split('\n').filter(function (item) {
                return item != '';
            });

            if (split_data.length == 1) {
                split_data.push('');
            };

            var temp_arr = [];
            for (var i = 0, len = this.data_list.length + split_data.length - 1; i < len; i++) {
                if (i < index) {
                    temp_arr.push(this.data_list[i]);
                } else if (i >= index && i < parseInt(index) + split_data.length) {
                    var ori = types == 'ori' ? split_data[i - index] : this.data_list[i] ? this.data_list[i].ori : '';
                    var lan = types == 'ori' ? this.data_list[i] ? this.data_list[i].lan : '' : split_data[i - index];
                    temp_arr.push({ ori: ori, lan: lan });
                } else if (i >= parseInt(index) + split_data.length) {
                    var _ori = types == 'ori' ? this.data_list[i - split_data.length + 1] ? this.data_list[i - split_data.length + 1].ori : '' : this.data_list[i] ? this.data_list[i].ori : '';
                    var _lan = types == 'ori' ? this.data_list[i] ? this.data_list[i].lan : '' : this.data_list[i - split_data.length + 1] ? this.data_list[i - split_data.length + 1].lan : '';
                    temp_arr.push({ ori: _ori, lan: _lan });
                }
            }
            this.data_list = temp_arr.filter(function (item) {
                return item.ori != '' || item.lan != '';
            });
            this.edit_index = '';
        },


        // 点击合并
        concat_paragraph: function concat_paragraph() {
            var _this2 = this;

            if (this.sel_table.length < 2) {
                this.$message.error('请选择需要合并的单元格或行！');
            } else {
                var concat_type = this.sel_table[0].split('+')[0];
                if (concat_type == 'l') {
                    // 选中原文
                    this.deal_concat('ori');
                } else if (concat_type == 'r') {
                    // 选中译文
                    this.deal_concat('lan');
                } else {
                    // 选中整个一条
                    var concat_obj = { ori: '', lan: '' };
                    this.sel_table.forEach(function (item) {
                        var index = item.split('+')[1];
                        concat_obj.ori += _this2.data_list[index].ori;
                        concat_obj.lan += _this2.data_list[index].lan;
                    });
                    this.data_list.splice(this.sel_table[0].split('+')[1], this.sel_table.length, concat_obj);
                };
                this.sel_table = [this.sel_table[0]];
            }
        },

        // 处理合并
        deal_concat: function deal_concat(type) {
            var _this3 = this;

            var _ref2 = [this.sel_table[0].split('+')[1], ''],
                min = _ref2[0],
                concat_str = _ref2[1];

            this.sel_table.forEach(function (item) {
                var index = item.split('+')[1];
                concat_str += _this3.data_list[index][type];
            });
            this.data_list = this.data_list.map(function (item, index) {
                if (index < min) {
                    return item;
                } else if (index == min) {
                    var temp_obj = { ori: '', lan: '' };
                    temp_obj.ori = type == 'ori' ? concat_str : item.ori;
                    temp_obj.lan = type == 'ori' ? item.lan : concat_str;
                    return temp_obj;
                } else {
                    var _temp_obj = { ori: '', lan: '' };
                    _temp_obj.ori = type == 'ori' ? _this3.data_list[index + _this3.sel_table.length - 1] ? _this3.data_list[index + _this3.sel_table.length - 1].ori : '' : item.ori;
                    _temp_obj.lan = type == 'ori' ? item.lan : _this3.data_list[index + _this3.sel_table.length - 1] ? _this3.data_list[index + _this3.sel_table.length - 1].lan : '';
                    return _temp_obj;
                }
            }).filter(function (item) {
                return item.ori != '' || item.lan != '';
            });
        },

        //高度自适应
        makeExpandingArea: function makeExpandingArea(el) {
            var setStyle = function setStyle(el) {
                el.style.height = 'auto';
                el.style.height = el.scrollHeight + 'px';
            };
            var delayedResize = function delayedResize(el) {
                window.setTimeout(function () {
                    setStyle(el);
                }, 0);
            };
            if (el.addEventListener) {
                el.addEventListener('input', function () {
                    setStyle(el);
                }, false);
                setStyle(el);
            } else if (el.attachEvent) {
                el.attachEvent('onpropertychange', function () {
                    setStyle(el);
                });
                setStyle(el);
            }
            if (window.VBArray && window.addEventListener) {
                //IE9  
                el.attachEvent("onkeydown", function () {
                    var key = window.event.keyCode;
                    if (key == 8 || key == 46) delayedResize(el);
                });
                el.attachEvent("oncut", function () {
                    delayedResize(el);
                }); //处理粘贴  
            }
        },


        //上移
        move_up: function move_up() {
            var _this4 = this;

            if (this.sel_table.length) {
                var first_ind = parseInt(this.sel_table[0].split('+')[1]);
                var that = this;
                var init_data = function init_data() {
                    that.sel_table = that.sel_table.map(function (item) {
                        return item.split('+')[0] + '+' + (parseInt(item.split('+')[1]) - 1);
                    });
                };
                if (first_ind == 0) {
                    this.$message.error('当前行已经是第一行!');
                } else {
                    var move_type = this.sel_table[0].split('+')[0];
                    if (move_type == 'l') {
                        // 原文
                        var replace_data = {
                            ori: this.data_list[first_ind - 1].ori,
                            lan: this.data_list[first_ind - 1 + this.sel_table.length].lan
                        };
                        this.sel_table.forEach(function (item, index) {
                            _this4.data_list.splice(first_ind - 1 + index, 1, {
                                ori: _this4.data_list[item.split('+')[1]].ori,
                                lan: _this4.data_list[first_ind - 1 + index].lan
                            });
                        });
                        this.data_list.splice(first_ind + this.sel_table.length - 1, 1, replace_data);
                        init_data();
                    } else if (move_type == 'r') {
                        // 译文
                        var _replace_data = {
                            ori: this.data_list[first_ind - 1 + this.sel_table.length].ori,
                            lan: this.data_list[first_ind - 1].lan
                        };
                        this.sel_table.forEach(function (item, index) {
                            _this4.data_list.splice(first_ind - 1 + index, 1, {
                                ori: _this4.data_list[first_ind - 1 + index].ori,
                                lan: _this4.data_list[item.split('+')[1]].lan
                            });
                        });
                        this.data_list.splice(first_ind + this.sel_table.length - 1, 1, _replace_data);
                        init_data();
                    } else {
                        // 整行 
                        var _replace_data2 = this.data_list[first_ind - 1];
                        this.sel_table.forEach(function (item, index) {
                            _this4.data_list.splice(first_ind - 1 + index, 1, _this4.data_list[item.split('+')[1]]);
                        });
                        this.data_list.splice(first_ind + this.sel_table.length - 1, 1, _replace_data2);
                        init_data();
                    }
                }
            } else {
                this.$message.error('请选择需要下移的单元格或行！');
            }
        },

        //下移
        move_down: function move_down() {
            if (this.sel_table.length) {
                var last_ind = parseInt(this.sel_table[this.sel_table.length - 1].split('+')[1]);
                var that = this;
                var init_data = function init_data() {
                    that.sel_table = that.sel_table.map(function (item) {
                        return item.split('+')[0] + '+' + (parseInt(item.split('+')[1]) + 1);
                    });
                };
                // 最后一行 无法上移
                if (last_ind == this.data_list.length - 1) {
                    this.$message.error('当前行已经是第一行!');
                } else {
                    var move_type = this.sel_table[0].split('+')[0];
                    // 判断类型
                    if (move_type == 'l') {
                        // 原文
                        var replace_data = {
                            ori: this.data_list[last_ind + 1].ori,
                            lan: this.data_list[this.sel_table[0].split('+')[1]].lan
                        };
                        // 替换
                        for (var ind = this.sel_table.length - 1; ind >= 0; ind--) {
                            this.data_list.splice(last_ind + ind - this.sel_table.length + 2, 1, {
                                ori: this.data_list[last_ind + ind - this.sel_table.length + 1].ori,
                                lan: this.data_list[last_ind + ind - this.sel_table.length + 2].lan
                            });
                        };
                        this.data_list.splice(last_ind - this.sel_table.length + 1, 1, replace_data);
                        init_data();
                    } else if (move_type == 'r') {
                        // 译文
                        var _replace_data3 = {
                            ori: this.data_list[this.sel_table[0].split('+')[1]].ori,
                            lan: this.data_list[last_ind + 1].lan
                        };
                        // 替换
                        for (var _ind = this.sel_table.length - 1; _ind >= 0; _ind--) {
                            this.data_list.splice(last_ind + _ind - this.sel_table.length + 2, 1, {
                                ori: this.data_list[last_ind + _ind - this.sel_table.length + 2].ori,
                                lan: this.data_list[last_ind + _ind - this.sel_table.length + 1].lan
                            });
                        };
                        this.data_list.splice(last_ind - this.sel_table.length + 1, 1, _replace_data3);
                        init_data();
                    } else {
                        // 整行 : 首先记录要换的那一行
                        var _replace_data4 = this.data_list[last_ind + 1];
                        for (var _ind2 = this.sel_table.length - 1; _ind2 >= 0; _ind2--) {
                            this.data_list.splice(last_ind + _ind2 - this.sel_table.length + 2, 1, this.data_list[this.sel_table[_ind2].split('+')[1]]);
                        }
                        this.data_list.splice(last_ind - this.sel_table.length + 1, 1, _replace_data4);
                        init_data();
                    }
                }
            } else {
                this.$message.error('请选择需要下移的单元格或行！');
            }
        }
    }
});

/***/ }),

/***/ 305:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(306);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(276)("7159dfe4", content, true, {});

/***/ }),

/***/ 306:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(275)(false);
// imports


// module
exports.push([module.i, ".myEditor[data-v-0cf996c1]{padding:15px;-webkit-box-sizing:border-box;box-sizing:border-box}.myEditor .btn_group[data-v-0cf996c1]{margin-bottom:15px}.myEditor .edit_table[data-v-0cf996c1]{width:100%;border:1px solid #dcdcdc}.myEditor .edit_table .column_one[data-v-0cf996c1],.myEditor .edit_table .column_three[data-v-0cf996c1],.myEditor .edit_table .column_two[data-v-0cf996c1]{border:1px solid #dcdcdc;padding:3px;line-height:20px;min-height:20px}.myEditor .edit_table .column_one textarea[data-v-0cf996c1],.myEditor .edit_table .column_three textarea[data-v-0cf996c1],.myEditor .edit_table .column_two textarea[data-v-0cf996c1]{background:#a6d9ee;display:block;width:100%;min-height:30px;resize:none;padding:0;outline:0;line-height:20px;border:none;font-family:inherit;word-wrap:break-word;white-space:pre-wrap}.myEditor .edit_table .column_one[data-v-0cf996c1]{width:50px;text-align:center}.myEditor .edit_table .column_three[data-v-0cf996c1],.myEditor .edit_table .column_two[data-v-0cf996c1]{width:calc((100% - 50px) / 2);overflow:hidden}.myEditor .edit_table #active_td_border[data-v-0cf996c1]{border:1px solid #4169e1}.myEditor .edit_table .active_tr[data-v-0cf996c1]{background:#a6d9ee}.myEditor .edit_table .active_one_td[data-v-0cf996c1]{background:#eee}.myEditor .edit_table .active_td[data-v-0cf996c1]{background:#a6d9ee}", ""]);

// exports


/***/ }),

/***/ 307:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"myEditor"},[_c('p',{staticClass:"btn_group"},[_c('el-button',{attrs:{"type":"primary","plain":"","size":"small"},on:{"click":_vm.concat_paragraph}},[_vm._v("合并")]),_vm._v(" "),_c('el-button',{attrs:{"type":"primary","plain":"","size":"small"},on:{"click":_vm.split_paragraph}},[_vm._v("拆分")]),_vm._v(" "),_c('el-button',{attrs:{"type":"primary","plain":"","size":"small"},on:{"click":_vm.move_up}},[_vm._v("上移")]),_vm._v(" "),_c('el-button',{attrs:{"type":"primary","plain":"","size":"small"},on:{"click":_vm.move_down}},[_vm._v("下移")])],1),_vm._v(" "),_c('table',{staticClass:"edit_table",attrs:{"cellspacing":"0","cellpadding":"0"}},[_c('tbody',{staticClass:"edit_body"},[_vm._l((_vm.data_list),function(val,index){return _c('tr',{key:index,class:_vm.sel_table.indexOf('a+'+index) != -1 ? 'active_tr' : ''},[_c('td',{class:_vm.sel_table.indexOf('l+'+index) != -1 || _vm.sel_table.indexOf('r+'+index) != -1 ? 'active_one_td column_one' : 'column_one',on:{"click":[function($event){!$event.ctrlKey && _vm.sel_one(index,'a')},function($event){if(!$event.ctrlKey){ return null; }_vm.sel_more(index,'a')}]}},[_vm._v(" \n                    "+_vm._s(index + 1)+"\n                ")]),_vm._v(" "),_c('td',{class:_vm.sel_table.indexOf('l+'+index) != -1 ? 'active_td column_two' : 'column_two',attrs:{"id":_vm.edit_index == 'l+'+index ? 'active_td_border' : ''},on:{"click":[function($event){!$event.ctrlKey && $event.type == 'click' && _vm.sel_one(index,'l')},function($event){if(!$event.ctrlKey){ return null; }_vm.sel_more(index,'l')}],"dblclick":function($event){_vm.edit_one(index,'l')}}},[(_vm.edit_index != 'l+'+index)?_c('div',[_vm._v("\n                        "+_vm._s(val.ori)+"\n                    ")]):_vm._e(),_vm._v(" "),(_vm.edit_index == 'l+'+index)?_c('textarea',{ref:'ori'+index,refInFor:true,attrs:{"autoHeight":"true"}},[_vm._v(_vm._s(val.ori))]):_vm._e()]),_vm._v(" "),_c('td',{class:_vm.sel_table.indexOf('r+'+index) != -1 ? 'active_td column_three' : 'column_three',attrs:{"id":_vm.edit_index == 'r+'+index ? 'active_td_border' : ''},on:{"click":[function($event){!$event.ctrlKey && _vm.sel_one(index,'r')},function($event){if(!$event.ctrlKey){ return null; }_vm.sel_more(index,'r')}],"dblclick":function($event){_vm.edit_one(index,'r')}}},[(_vm.edit_index != 'r+'+index)?_c('div',[_vm._v("\n                        "+_vm._s(val.lan)+"\n                    ")]):_vm._e(),_vm._v(" "),(_vm.edit_index == 'r+'+index)?_c('textarea',{ref:'lan'+index,refInFor:true,attrs:{"autoHeight":"true"}},[_vm._v(_vm._s(val.lan))]):_vm._e()])])}),_vm._v(" "),_c('tbody')],2)])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ })

});
//# sourceMappingURL=4.js.map