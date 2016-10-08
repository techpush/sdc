/**
 * bellajs
 * v5.4.24
 * built: Wed, 05 Oct 2016 03:14:10 GMT
 * git: https://github.com/ndaidong/bellajs
 * author: @ndaidong
 * License: MIT
**/
;var $jscomp={scope:{},checkStringArgs:function(f,m,l){if(null==f)throw new TypeError("The 'this' value for String.prototype."+l+" must not be null or undefined");if(m instanceof RegExp)throw new TypeError("First argument to String.prototype."+l+" must not be a regular expression");return f+""}};
$jscomp.defineProperty="function"==typeof Object.defineProperties?Object.defineProperty:function(f,m,l){if(l.get||l.set)throw new TypeError("ES3 does not support getters and setters.");f!=Array.prototype&&f!=Object.prototype&&(f[m]=l.value)};$jscomp.getGlobal=function(f){return"undefined"!=typeof window&&window===f?f:"undefined"!=typeof global?global:f};$jscomp.global=$jscomp.getGlobal(this);
$jscomp.polyfill=function(f,m,l,q){if(m){l=$jscomp.global;f=f.split(".");for(q=0;q<f.length-1;q++){var h=f[q];h in l||(l[h]={});l=l[h]}f=f[f.length-1];q=l[f];m=m(q);m!=q&&null!=m&&$jscomp.defineProperty(l,f,{configurable:!0,writable:!0,value:m})}};$jscomp.polyfill("String.prototype.includes",function(f){return f?f:function(f,l){return-1!==$jscomp.checkStringArgs(this,f,"includes").indexOf(f,l||0)}},"es6-impl","es3");
(function(f,m){if("undefined"!==typeof module&&module.exports)module.exports=m();else{var l=window||{};l.define&&l.define.amd?l.define([],m):l.exports?l.exports=m():l[f]=m()}})("Bella",function(){var f="undefined"!==typeof module&&module.exports?"node":"browser",m=function(a){var b=Object.prototype.toString,c=typeof a;if("object"===c){if(a){if(-1!==b.call(a).indexOf("HTML")&&-1!==b.call(a).indexOf("Element"))return"element";if(a instanceof Array||!(a instanceof Object)&&"[object Array]"===b.call(a)||
"number"===typeof a.length&&"undefined"!==typeof a.splice&&"undefined"!==typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if(!(a instanceof Object||"[object Function]"!==b.call(a)&&("undefined"===typeof a.call||"undefined"===typeof a.propertyIsEnumerable||a.propertyIsEnumerable("call"))))return"function"}return"object"}return"function"===c&&"undefined"===typeof a.call?"object":c},l=function(a){return"undefined"!==m(a)},q=function(a){return null===m(a)||null===a},h=function(a){return!q(a)&&
"string"===m(a)},u=function(a){return""!==a&&!q(a)&&l(a)&&!isNaN(a)&&"number"===m(a)},E=function(a){return u(a)&&isFinite(a)&&Math.floor(a)===a},p=function(a){return!q(a)&&"array"===m(a)},r=function(a){return!q(a)&&"object"===m(a)},A=function(a){return a instanceof Date&&!isNaN(a.valueOf())},F=function(a){return a&&"node"===f&&a._root?!0:!q(a)&&"element"===m(a)},B=function(a){return!l(a)||q(a)||h(a)&&""===a||p(a)&&"[]"===JSON.stringify(a)||r(a)&&"{}"===JSON.stringify(a)},t=function(a,b){if(!a||!b)return!1;
var c=!0;l(a[b])||(c=b in a);return c},C=function(a,b){var c=!0;if(B(a)&&B(b))return!0;if(A(a)&&A(b))return a.getTime()===b.getTime();if(u(a)&&u(b)||h(a)&&h(b))return a===b;if(p(a)&&p(b)){if(a.length!==b.length)return!1;if(0<a.length)for(var e=0,d=a.length;e<d;e++)if(!C(a[e],b[e])){c=!1;break}}else if(r(a)&&r(b)){var e=[],d=[],n;for(n in a)t(a,n)&&e.push(n);for(var k in b)t(b,k)&&d.push(k);if(e.length!==d.length)return!1;for(var v in a)if(!t(b,v)||!C(a[v],b[v])){c=!1;break}}return c},w=function(a,
b){return h(a)?(a=a?a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,""):a||"")&&b?a.replace(/\r?\n|\r/g," ").replace(/\s\s+|\r/g," "):a:""},G=function(a){return h(a)?a.toLowerCase():""},H=function(a){if(!h(a))return"";if(1===a.length)return a.toUpperCase();a=a.toLowerCase();return a.charAt(0).toUpperCase()+a.slice(1)},I=function(a,b,c){a=String(a);b=b||2;return a.length>=b?a:Array(b-a.length+1).join(c||"0")+a},J=function(a,b){for(var c=[];10>c.length;)c.push(Math.random().toString(36).slice(2));var c=c.join(""),
e=c.length;b=b||"";for(a=Math.max(a||32,b.length);b.length<a;)b+=c.charAt(Math.floor(Math.random()*e))||"";return b},D=function(a,b){if(!a||0>a)a=0;b||(b=9007199254740991);if(a===b)return b;a>b&&(a=Math.min(a,b),b=Math.max(a,b));return Math.floor(Math.random()*(b-a+1))+a},K=function(a,b,c){if(p(a))for(var e=0;e<a.length;e++){var d=a[e];if(c&&d[c]===b[c]||d===b)return!0}else{if(r(a)&&h(b))return t(a,b);if(h(a)&&h(b))return a.includes(b)}return!1},x=function(a){if(!(a instanceof Object))return a;var b;
b=a.constructor;switch(b){case RegExp:b=new b(a);break;case Date:b=new b(a.getTime());break;default:b=new b}for(var c in a)b[c]=x(a[c]);return b},L=function(a,b,c,e){c=c||!1;e=e||[];for(var d in a)if(!(0<e.length&&K(e,d))&&(!c||c&&b.hasOwnProperty(d))){var n=a[d],k=b[d];r(k)&&r(n)||p(k)&&p(n)?b[d]=L(n,b[d],c,e):b[d]=x(n)}return b},M=function(a){a=x(a);a.sort(function(){return Math.random()-.5});return a},P=function(){for(var a=[],b=0;64>b;)a[b]=0|4294967296*Math.abs(Math.sin(++b));return function(b){var c,
d,n,k,v=[];b=unescape(encodeURI(b));for(var g=b.length,h=[c=1732584193,d=-271733879,~c,~d],f=0;f<=g;)v[f>>2]|=(b.charCodeAt(f)||128)<<8*(f++%4);v[b=16*(g+8>>6)+14]=8*g;for(f=0;f<b;f+=16){g=h;for(k=0;64>k;)g=[n=g[3],(c=g[1]|0)+((n=g[0]+[c&(d=g[2])|~c&n,n&c|~n&d,c^d^n,d^(c|~n)][g=k>>4]+(a[k]+(v[[k,5*k+1,3*k+5,7*k][g]%16+f]|0)))<<(g=[7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21][4*g+k++%4])|n>>>32-g),c,d];for(k=4;k;)h[--k]=h[k]+g[k]}for(b="";32>k;)b+=(h[k>>3]>>4*(1^k++&7)&15).toString(16);return b}}(),
y=function(a,b,c){u(a)&&(a=String(a));if(!a||!h(a))return"";u(b)&&(b=String(b));u(c)&&(c=String(c));if(h(b)&&h(c))a=a.split(b).join(c);else if(p(b)&&h(c))b.forEach(function(b){a=y(a,b,c)});else if(p(b)&&p(c)&&b.length===c.length){var e=b.length;if(0<e)for(var d=0;d<e;d++)a=y(a,b[d],c[d])}return a},N=function(a){if(u(a))return String(a);if(!h(a))return"";var b={a:"\u00e1|\u00e0|\u1ea3|\u00e3|\u1ea1|\u0103|\u1eaf|\u1eb7|\u1eb1|\u1eb3|\u1eb5|\u00e2|\u1ea5|\u1ea7|\u1ea9|\u1eab|\u1ead|\u00e4",A:"\u00c1|\u00c0|\u1ea2|\u00c3|\u1ea0|\u0102|\u1eae|\u1eb6|\u1eb0|\u1eb2|\u1eb4|\u00c2|\u1ea4|\u1ea6|\u1ea8|\u1eaa|\u1eac|\u00c4",
c:"\u00e7",C:"\u00c7",d:"\u0111",D:"\u0110",e:"\u00e9|\u00e8|\u1ebb|\u1ebd|\u1eb9|\u00ea|\u1ebf|\u1ec1|\u1ec3|\u1ec5|\u1ec7|\u00eb",E:"\u00c9|\u00c8|\u1eba|\u1ebc|\u1eb8|\u00ca|\u1ebe|\u1ec0|\u1ec2|\u1ec4|\u1ec6|\u00cb",i:"\u00ed|\u00ec|\u1ec9|\u0129|\u1ecb|\u00ef|\u00ee",I:"\u00cd|\u00cc|\u1ec8|\u0128|\u1eca|\u00cf|\u00ce",o:"\u00f3|\u00f2|\u1ecf|\u00f5|\u1ecd|\u00f4|\u1ed1|\u1ed3|\u1ed5|\u1ed7|\u1ed9|\u01a1|\u1edb|\u1edd|\u1edf|\u1ee1|\u1ee3|\u00f6",O:"\u00d3|\u00d2|\u1ece|\u00d5|\u1ecc|\u00d4|\u1ed0|\u1ed2|\u1ed4|\u00d4|\u1ed8|\u01a0|\u1eda|\u1edc|\u1ede|\u1ee0|\u1ee2|\u00d6",
u:"\u00fa|\u00f9|\u1ee7|\u0169|\u1ee5|\u01b0|\u1ee9|\u1eeb|\u1eed|\u1eef|\u1ef1|\u00fb",U:"\u00da|\u00d9|\u1ee6|\u0168|\u1ee4|\u01af|\u1ee8|\u1eea|\u1eec|\u1eee|\u1ef0|\u00db",y:"\u00fd|\u1ef3|\u1ef7|\u1ef9|\u1ef5",Y:"\u00dd|\u1ef2|\u1ef6|\u1ef8|\u1ef4"},c;for(c in b)if(t(b,c))for(var e=b[c].split("|"),d=0;d<e.length;d++)a=y(a,e[d],c);return a},z=function(){return new Date},O=function(){return Date.now()},Q=function(){var a="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),b="January February March April May June July August September October November December".split(" "),
c=function(){var a=z().getTimezoneOffset();return["GMT",0>a?"+":"-",I(Math.abs(a/60),4)].join("")}(),e=function(d,e){var k=!1,f,g;e=e?(new Date(e)).getTime():O();d&&h(d)||(d="D, M d, Y  h:i:s A");d.match(/(\.*)a{1}(\.*)*/i)&&(k=!0);var n=function(a){return String(10>a?"0"+a:a)};f=e instanceof Date?e:new Date(e);if(isNaN(f.getTime()))if(/^(\d+-\d+-\d+)\s(\d+:\d+:\d+)$/i.test(e))f=new Date(e.replace(" ","T"));else return e+" !";g={Y:function(){return f.getFullYear()},y:function(){return(g.Y()+"").slice(-2)},
F:function(){return b[g.n()-1]},M:function(){return(g.F()+"").slice(0,3)},m:function(){return n(g.n())},n:function(){return f.getMonth()+1},S:function(){var a=g.j()+" ",a=a.charAt(a.length-2);return"1"===a?"st":"2"===a?"nd":"3"===a?"rd":"th"},j:function(){return f.getDate()},d:function(){return n(g.j())},t:function(){return(new Date(g.Y(),g.n(),0)).getDate()},w:function(){return f.getDay()},l:function(){return a[g.w()]},D:function(){return(g.l()+"").slice(0,3)},G:function(){return f.getHours()},g:function(){return g.G()%
12||12},h:function(){return n(k?g.g():g.G())},i:function(){return n(f.getMinutes())},s:function(){return n(f.getSeconds())},a:function(){return 11<g.G()?"pm":"am"},A:function(){return g.a().toUpperCase()},O:function(){return c}};return d.replace(/\.*\\?([a-z])/gi,function(a,b){return g[a]?g[a]():b})};return{utc:function(a){return(new Date(a||z())).toUTCString()},local:function(a){return e("D, j M Y h:i:s O",a)},strtotime:function(a){return(new Date(a)).getTime()},format:e,relativize:function(a){var b=
a instanceof Date?a:new Date(a);a=z()-b;b=parseInt(b,10);isNaN(b)&&(b=0);if(a<=b)return"Just now";var b=null,c={millisecond:1,second:1E3,minute:60,hour:60,day:24,month:30,year:12},d;for(d in c)if(a<c[d])break;else b=d,a/=c[d];a=Math.floor(a);1!==a&&(b+="s");return[a,b].join(" ")+" ago"}}}();return{ENV:f,id:J(),isDef:l,isNull:q,isString:h,isNumber:u,isInteger:E,isBoolean:function(a){return!0===a||!1===a},isArray:p,isObject:r,isDate:A,isFunction:function(a){return!q(a)&&"function"===m(a)},isElement:F,
isEmpty:B,isLetter:function(a){var b=/^[a-z]+$/i;return h(a)&&b.test(a)},isEmail:function(a){var b=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;return h(a)&&b.test(a)},isGeneratedKey:function(a){var b=/^[A-Z0-9]+$/i;return h(a)&&b.test(a)},hasProperty:t,equals:C,encode:function(a){return h(a)?encodeURIComponent(a):""},decode:function(a){return h(a)?decodeURIComponent(a.replace(/\+/g," ")):""},trim:w,truncate:function(a,b){a=w(a);if(!a)return a;b=b||140;if(a.length<=
b)return a;var c=a.substring(0,b),e=c.split(" "),d="";1<e.length?(e.pop(),d+=e.join(" "),d.length<a.length&&(d+="...")):(c=c.substring(0,b-3),d=c+"...");return d},stripTags:function(a){if(!h(a))return"";(a=a.replace(/<.*?>/gi," "))&&(a=w(a.replace(/\s\s+/g," ")));return a},escapeHTML:function(a){return h(a)?a.replace(/&/g,"\x26amp;").replace(/</g,"\x26lt;").replace(/>/g,"\x26gt;").replace(/"/g,"\x26quot;"):""},unescapeHTML:function(a){return h(a)?a.replace(/&quot;/g,'"').replace(/&lt;/g,"\x3c").replace(/&gt;/g,
"\x3e").replace(/&amp;/g,"\x26"):""},strtolower:G,strtoupper:function(a){return h(a)?a.toUpperCase():""},ucfirst:H,ucwords:function(a){if(!h(a))return"";var b=[];a.split(" ").forEach(function(a){b.push(H(a))});return b.join(" ")},leftPad:I,rightPad:function(a,b,c){a=String(a);b=b||2;return a.length>=b?a:a+Array(b-a.length+1).join(c||"0")},repeat:function(a,b){if(!a||!h(a))return"";if(!E(b)||1>b)return a;for(var c=[];c.length<b;)c.push(a);return c.join("")},replaceAll:y,stripAccent:N,createAlias:function(a,
b){a=String(a);if(a=N(a))b=b||"-",a=G(a),a=w(a),a=a.replace(/\W+/g," "),a=a.replace(/\s+/g," "),a=a.replace(/\s/g,b);return a},compile:function(a,b){var c=[],e=function(a,b,f){f&&c.push(f);f=[];for(var d in b)if(t(b,d)){var g=b[d];if(r(g)||p(g))f.push({key:d,data:g});else if(h(g)){var g=y(g,["{","}"],["\x26#123;","\x26#125;"]),k=c.concat([d]),k=new RegExp("{"+k.join(".")+"}","gi");a=a.replace(k,g)}}0<f.length&&f.forEach(function(b){a=e(a,b.data,b.key)});return w(a,!0)};return b&&(h(b)||r(b)||p(b))?
e(a,b):a},md5:P,createId:J,random:D,min:function(a){return p(a)?Math.min.apply({},a):a},max:function(a){return p(a)?Math.max.apply({},a):a},unique:function(a){if(p(a)){for(var b=[],c=0;c<a.length;c++)-1===b.indexOf(a[c])&&b.push(a[c]);return b}return a||[]},contains:K,first:function(a){return a[0]},last:function(a){return a[a.length-1]},getIndex:function(a,b){for(var c=-1,e=0;e<a.length;e++)if(a[e]===b){c=e;break}return c},getLastIndex:function(a,b){for(var c=-1,e=a.length-1;0<=e;e--)if(a[e]===b){c=
e;break}return c},sort:function(a,b){var c=[],e={},d=b||1;if(p(a)&&0<a.length)if(c=x(a),e=c[0],1===d||-1===d)c.sort(function(a,b){return a>b?d:a<b?-1*d:0});else if(h(d)&&t(e,d))c.sort(function(a,b){return a[d]>b[d]?1:a[d]<b[d]?-1:0});else if(r(d)){a={};for(var f in d)a.key=f,t(e,a.key)&&(a.order=-1===d[a.key]?-1:1,c.sort(function(a){return function(b,c){return b[a.key]>c[a.key]?a.order:b[a.key]<c[a.key]?-1*a.order:0}}(a))),a={key:a.key,order:a.order}}return c},shuffle:M,pick:function(a,b){var c=b?
Math.min(b,a.length):1;1>c&&(c=1);b=M(a);if(c>=a.length)return b;if(1===c)return c=D(0,a.length-1),b[c];for(a=[];a.length<c;){var e=D(0,b.length-1);a.push(b[e]);b.splice(e,1)}return a},empty:function(a){if(p(a)){for(var b=a.length-1;0<=b;b--)a[b]=null,delete a[b];a.length=0}else if(r(a))for(b in a)t(a,b)&&(a[b]=null,delete a[b]);else h(a)?a="":F(a)&&(a.innerHTML="");return a},copies:L,clone:x,now:z,time:O,date:Q}});