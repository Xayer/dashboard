(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{511:function(t,e,n){var content=n(515);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(16).default)("e8b5b29e",content,!0,{sourceMap:!1})},514:function(t,e,n){"use strict";n(511)},515:function(t,e,n){var o=n(15)(!1);o.push([t.i,"form[data-v-615c5a91],label[data-v-615c5a91]{display:flex;flex-direction:column;justify-content:flex-start}",""]),t.exports=o},524:function(t,e,n){"use strict";n.r(e);n(34),n(37),n(32),n(41),n(36),n(50);var o=n(18),r=n(54),c=n(10),l=n(26),f=n(12),O=n(13),v=n(6),h=n(7),d=(n(20),n(44),n(71),n(144),n(33),n(19)),y=n(47),j=n(11);function m(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}function w(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?m(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):m(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}function P(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,o=Object(v.a)(t);if(e){var r=Object(v.a)(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return Object(O.a)(this,n)}}var k=function(t,e,n,desc){var o,r=arguments.length,c=r<3?e:null===desc?desc=Object.getOwnPropertyDescriptor(e,n):desc;if("object"===("undefined"==typeof Reflect?"undefined":Object(h.a)(Reflect))&&"function"==typeof Reflect.decorate)c=Reflect.decorate(t,e,n,desc);else for(var i=t.length-1;i>=0;i--)(o=t[i])&&(c=(r<3?o(c):r>3?o(e,n,c):o(e,n))||c);return r>3&&c&&Object.defineProperty(e,n,c),c},x=function(t){Object(f.a)(n,t);var e=P(n);function n(){var t;return Object(c.a)(this,n),(t=e.apply(this,arguments)).group="",t}return Object(l.a)(n,[{key:"groupFromSettings",get:function(){return this.settings.group?this.settings.group:null}},{key:"options",get:function(){return this.devices.groups?[{text:"Select Group",value:"",disabled:!0}].concat(Object(r.a)(Object.values(this.devices.groups).map((function(t){return{text:t.name,value:t.name}})))):[]}},{key:"mounted",value:function(){this.groupFromSettings&&(this.group=this.settings.group?this.settings.group:"")}},{key:"setDefaultValueBasedOnOptions",value:function(){""===this.group&&this.options[0]&&(this.group=this.options[0].value)}},{key:"updateValue",value:function(t,e){this.$emit("input",w(w({},this.settings),{},Object(o.a)({},t,e)))}}]),n}(d.Vue);k([Object(d.VModel)()],x.prototype,"settings",void 0),k([Object(d.Prop)()],x.prototype,"title",void 0),k([Object(d.Watch)("options")],x.prototype,"setDefaultValueBasedOnOptions",null);var R=x=k([Object(d.Component)({components:{Select:j.Select},computed:w({},Object(y.c)({devices:"hue/devices",token:"hue/token",hueAvailable:"hue/available"}))})],x),D=(n(514),n(2)),component=Object(D.a)(R,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("form",{on:{submit:function(t){t.stopPropagation(),t.preventDefault()}}},[n("label",{attrs:{for:"hueGroup"}},[t._v("Hue Group\n    "),t.options?n("Select",{staticClass:"m-t",attrs:{value:t.group,options:t.options,name:"hueGroup"},on:{input:function(e){return t.updateValue("group",e)}}}):n("p",[t._v("no groups available")])],1)])}),[],!1,null,"615c5a91",null);e.default=component.exports}}]);