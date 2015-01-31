/* build: `node build.js modules=ALL exclude=gestures,cufon,json minifier=uglifyjs` *//*! Fabric.js Copyright 2008-2014, Printio (Juriy Zaytsev, Maxim Chernyak) */var fabric=fabric||{version:"1.4.13"};typeof exports!="undefined"&&(exports.fabric=fabric),typeof document!="undefined"&&typeof window!="undefined"?(fabric.document=document,fabric.window=window):(fabric.document=require("jsdom").jsdom("<!DOCTYPE html><html><head></head><body></body></html>"),fabric.document.createWindow?fabric.window=fabric.document.createWindow():fabric.window=fabric.document.parentWindow),fabric.isTouchSupported="ontouchstart"in fabric.document.documentElement,fabric.isLikelyNode=typeof Buffer!="undefined"&&typeof window=="undefined",fabric.SHARED_ATTRIBUTES=["display","transform","fill","fill-opacity","fill-rule","opacity","stroke","stroke-dasharray","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width"],fabric.DPI=96,fabric.reNum="(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)",function(){function e(e,t){if(!this.__eventListeners[e])return;t?fabric.util.removeFromArray(this.__eventListeners[e],t):this.__eventListeners[e].length=0}function t(e,t){this.__eventListeners||(this.__eventListeners={});if(arguments.length===1)for(var n in e)this.on(n,e[n]);else this.__eventListeners[e]||(this.__eventListeners[e]=[]),this.__eventListeners[e].push(t);return this}function n(t,n){if(!this.__eventListeners)return;if(arguments.length===0)this.__eventListeners={};else if(arguments.length===1&&typeof arguments[0]=="object")for(var r in t)e.call(this,r,t[r]);else e.call(this,t,n);return this}function r(e,t){if(!this.__eventListeners)return;var n=this.__eventListeners[e];if(!n)return;for(var r=0,i=n.length;r<i;r++)n[r].call(this,t||{});return this}fabric.Observable={observe:t,stopObserving:n,fire:r,on:t,off:n,trigger:r}}(),fabric.Collection={add:function(){this._objects.push.apply(this._objects,arguments);for(var e=0,t=arguments.length;e<t;e++)this._onObjectAdded(arguments[e]);return this.renderOnAddRemove&&this.renderAll(),this},insertAt:function(e,t,n){var r=this.getObjects();return n?r[t]=e:r.splice(t,0,e),this._onObjectAdded(e),this.renderOnAddRemove&&this.renderAll(),this},remove:function(){var e=this.getObjects(),t;for(var n=0,r=arguments.length;n<r;n++)t=e.indexOf(arguments[n]),t!==-1&&(e.splice(t,1),this._onObjectRemoved(arguments[n]));return this.renderOnAddRemove&&this.renderAll(),this},forEachObject:function(e,t){var n=this.getObjects(),r=n.length;while(r--)e.call(t,n[r],r,n);return this},getObjects:function(e){return typeof e=="undefined"?this._objects:this._objects.filter(function(t){return t.type===e})},item:function(e){return this.getObjects()[e]},isEmpty:function(){return this.getObjects().length===0},size:function(){return this.getObjects().length},contains:function(e){return this.getObjects().indexOf(e)>-1},complexity:function(){return this.getObjects().reduce(function(e,t){return e+=t.complexity?t.complexity():0,e},0)}},function(e){var t=Math.sqrt,n=Math.atan2,r=Math.PI/180;fabric.util={removeFromArray:function(e,t){var n=e.indexOf(t);return n!==-1&&e.splice(n,1),e},getRandomInt:function(e,t){return Math.floor(Math.random()*(t-e+1))+e},degreesToRadians:function(e){return e*r},radiansToDegrees:function(e){return e/r},rotatePoint:function(e,t,n){var r=Math.sin(n),i=Math.cos(n);e.subtractEquals(t);var s=e.x*i-e.y*r,o=e.x*r+e.y*i;return(new fabric.Point(s,o)).addEquals(t)},transformPoint:function(e,t,n){return n?new fabric.Point(t[0]*e.x+t[1]*e.y,t[2]*e.x+t[3]*e.y):new fabric.Point(t[0]*e.x+t[1]*e.y+t[4],t[2]*e.x+t[3]*e.y+t[5])},invertTransform:function(e){var t=e.slice(),n=1/(e[0]*e[3]-e[1]*e[2]);t=[n*e[3],-n*e[1],-n*e[2],n*e[0],0,0];var r=fabric.util.transformPoint({x:e[4],y:e[5]},t);return t[4]=-r.x,t[5]=-r.y,t},toFixed:function(e,t){return parseFloat(Number(e).toFixed(t))},parseUnit:function(e,t){var n=/\D{0,2}$/.exec(e),r=parseFloat(e);t||(t=fabric.Text.DEFAULT_SVG_FONT_SIZE);switch(n[0]){case"mm":return r*fabric.DPI/25.4;case"cm":return r*fabric.DPI/2.54;case"in":return r*fabric.DPI;case"pt":return r*fabric.DPI/72;case"pc":return r*fabric.DPI/72*12;case"em":return r*t;default:return r}},falseFunction:function(){return!1},getKlass:function(e,t){return e=fabric.util.string.camelize(e.charAt(0).toUpperCase()+e.slice(1)),fabric.util.resolveNamespace(t)[e]},resolveNamespace:function(t){if(!t)return fabric;var n=t.split("."),r=n.length,i=e||fabric.window;for(var s=0;s<r;++s)i=i[n[s]];return i},loadImage:function(e,t,n,r){if(!e){t&&t.call(n,e);return}var i=fabric.util.createImage();i.onload=function(){t&&t.call(n,i),i=i.onload=i.onerror=null},i.onerror=function(){fabric.log("Error loading "+i.src),t&&t.call(n,null,!0),i=i.onload=i.onerror=null},e.indexOf("data")!==0&&typeof r!="undefined"&&(i.crossOrigin=r),i.src=e},enlivenObjects:function(e,t,n,r){function i(){++o===u&&t&&t(s)}e=e||[];var s=[],o=0,u=e.length;if(!u){t&&t(s);return}e.forEach(function(e,t){if(!e||!e.type){i();return}var o=fabric.util.getKlass(e.type,n);o.async?o.fromObject(e,function(n,o){o||(s[t]=n,r&&r(e,s[t])),i()}):(s[t]=o.fromObject(e),r&&r(e,s[t]),i())})},groupSVGElements:function(e,t,n){var r;return r=new fabric.PathGroup(e,t),typeof n!="undefined"&&r.setSourcePath(n),r},populateWithProperties:function(e,t,n){if(n&&Object.prototype.toString.call(n)==="[object Array]")for(var r=0,i=n.length;r<i;r++)n[r]in e&&(t[n[r]]=e[n[r]])},drawDashedLine:function(e,r,i,s,o,u){var a=s-r,f=o-i,l=t(a*a+f*f),c=n(f,a),h=u.length,p=0,d=!0;e.save(),e.translate(r,i),e.moveTo(0,0),e.rotate(c),r=0;while(l>r)r+=u[p++%h],r>l&&(r=l),e[d?"lineTo":"moveTo"](r,0),d=!d;e.restore()},createCanvasElement:function(e){return e||(e=fabric.document.createElement("canvas")),!e.getContext&&typeof G_vmlCanvasManager!="undefined"&&G_vmlCanvasManager.initElement(e),e},createImage:function(){return fabric.isLikelyNode?new(require("canvas").Image):fabric.document.createElement("img")},createAccessors:function(e){var t=e.prototype;for(var n=t.stateProperties.length;n--;){var r=t.stateProperties[n],i=r.charAt(0).toUpperCase()+r.slice(1),s="set"+i,o="get"+i;t[o]||(t[o]=function(e){return new Function('return this.get("'+e+'")')}(r)),t[s]||(t[s]=function(e){return new Function("value",'return this.set("'+e+'", value)')}(r))}},clipContext:function(e,t){t.save(),t.beginPath(),e.clipTo(t),t.clip()},multiplyTransformMatrices:function(e,t){var n=[[e[0],e[2],e[4]],[e[1],e[3],e[5]],[0,0,1]],r=[[t[0],t[2],t[4]],[t[1],t[3],t[5]],[0,0,1]],i=[];for(var s=0;s<3;s++){i[s]=[];for(var o=0;o<3;o++){var u=0;for(var a=0;a<3;a++)u+=n[s][a]*r[a][o];i[s][o]=u}}return[i[0][0],i[1][0],i[0][1],i[1][1],i[0][2],i[1][2]]},getFunctionBody:function(e){return(String(e).match(/function[^{]*\{([\s\S]*)\}/)||{})[1]},isTransparent:function(e,t,n,r){r>0&&(t>r?t-=r:t=0,n>r?n-=r:n=0);var i=!0,s=e.getImageData(t,n,r*2||1,r*2||1);for(var o=3,u=s.data.length;o<u;o+=4){var a=s.data[o];i=a<=0;if(i===!1)break}return s=null,i}}}(typeof exports!="undefined"?exports:this),function(){function i(t,n,i,u,a,f,l){var c=r.call(arguments);if(e[c])return e[c];var h=Math.PI,p=l*h/180,d=Math.sin(p),v=Math.cos(p),m=0,g=0;i=Math.abs(i),u=Math.abs(u);var y=-v*t*.5-d*n*.5,b=-v*n*.5+d*t*.5,w=i*i,E=u*u,S=b*b,x=y*y,T=w*E-w*S-E*x,N=0;if(T<0){var C=Math.sqrt(1-T/(w*E));i*=C,u*=C}else N=(a===f?-1:1)*Math.sqrt(T/(w*S+E*x));var k=N*i*b/u,L=-N*u*y/i,A=v*k-d*L+t*.5,O=d*k+v*L+n*.5,M=o(1,0,(y-k)/i,(b-L)/u),_=o((y-k)/i,(b-L)/u,(-y-k)/i,(-b-L)/u);f===0&&_>0?_-=2*h:f===1&&_<0&&(_+=2*h);var D=Math.ceil(Math.abs(_/h*2)),P=[],H=_/D,B=8/3*Math.sin(H/4)*Math.sin(H/4)/Math.sin(H/2),j=M+H;for(var F=0;F<D;F++)P[F]=s(M,j,v,d,i,u,A,O,B,m,g),m=P[F][4],g=P[F][5],M=j,j+=H;return e[c]=P,P}function s(e,n,i,s,o,u,a,f,l,c,h){var p=r.call(arguments);if(t[p])return t[p];var d=Math.cos(e),v=Math.sin(e),m=Math.cos(n),g=Math.sin(n),y=i*o*m-s*u*g+a,b=s*o*m+i*u*g+f,w=c+l*(-i*o*v-s*u*d),E=h+l*(-s*o*v+i*u*d),S=y+l*(i*o*g+s*u*m),x=b+l*(s*o*g-i*u*m);return t[p]=[w,E,S,x,y,b],t[p]}function o(e,t,n,r){var i=Math.atan2(t,e),s=Math.atan2(r,n);return s>=i?s-i:2*Math.PI-(i-s)}function u(e,t,i,s,o,u,a,f){var l=r.call(arguments);if(n[l])return n[l];var c=Math.sqrt,h=Math.min,p=Math.max,d=Math.abs,v=[],m=[[],[]],g,y,b,w,E,S,x,T;y=6*e-12*i+6*o,g=-3*e+9*i-9*o+3*a,b=3*i-3*e;for(var N=0;N<2;++N){N>0&&(y=6*t-12*s+6*u,g=-3*t+9*s-9*u+3*f,b=3*s-3*t);if(d(g)<1e-12){if(d(y)<1e-12)continue;w=-b/y,0<w&&w<1&&v.push(w);continue}x=y*y-4*b*g;if(x<0)continue;T=c(x),E=(-y+T)/(2*g),0<E&&E<1&&v.push(E),S=(-y-T)/(2*g),0<S&&S<1&&v.push(S)}var C,k,L=v.length,A=L,O;while(L--)w=v[L],O=1-w,C=O*O*O*e+3*O*O*w*i+3*O*w*w*o+w*w*w*a,m[0][L]=C,k=O*O*O*t+3*O*O*w*s+3*O*w*w*u+w*w*w*f,m[1][L]=k;m[0][A]=e,m[1][A]=t,m[0][A+1]=a,m[1][A+1]=f;var M=[{x:h.apply(null,m[0]),y:h.apply(null,m[1])},{x:p.apply(null,m[0]),y:p.apply(null,m[1])}];return n[l]=M,M}var e={},t={},n={},r=Array.prototype.join;fabric.util.drawArc=function(e,t,n,r){var s=r[0],o=r[1],u=r[2],a=r[3],f=r[4],l=r[5],c=r[6],h=[[],[],[],[]],p=i(l-t,c-n,s,o,a,f,u);for(var d=0,v=p.length;d<v;d++)h[d][0]=p[d][0]+t,h[d][1]=p[d][1]+n,h[d][2]=p[d][2]+t,h[d][3]=p[d][3]+n,h[d][4]=p[d][4]+t,h[d][5]=p[d][5]+n,e.bezierCurveTo.apply(e,h[d])},fabric.util.getBoundsOfArc=function(e,t,n,r,s,o,a,f,l){var c=0,h=0,p=[],d=[],v=i(f-e,l-t,n,r,o,a,s);for(var m=0,g=v.length;m<g;m++)p=u(c,h,v[m][0],v[m][1],v[m][2],v[m][3],v[m][4],v[m][5]),p[0].x+=e,p[0].y+=t,p[1].x+=e,p[1].y+=t,d.push(p[0]),d.push(p[1]),c=v[m][4],h=v[m][5];return d},fabric.util.getBoundsOfCurve=u}(),function(){function t(t,n){var r=e.call(arguments,2),i=[];for(var s=0,o=t.length;s<o;s++)i[s]=r.length?t[s][n].apply(t[s],r):t[s][n].call(t[s]);return i}function n(e,t){return i(e,t,function(e,t){return e>=t})}function r(e,t){return i(e,t,function(e,t){return e<t})}function i(e,t,n){if(!e||e.length===0)return;var r=e.length-1,i=t?e[r][t]:e[r];if(t)while(r--)n(e[r][t],i)&&(i=e[r][t]);else while(r--)n(e[r],i)&&(i=e[r]);return i}var e=Array.prototype.slice;Array.prototype.indexOf||(Array.prototype.indexOf=function(e){if(this===void 0||this===null)throw new TypeError;var t=Object(this),n=t.length>>>0;if(n===0)return-1;var r=0;arguments.length>0&&(r=Number(arguments[1]),r!==r?r=0:r!==0&&r!==Number.POSITIVE_INFINITY&&r!==Number.NEGATIVE_INFINITY&&(r=(r>0||-1)*Math.floor(Math.abs(r))));if(r>=n)return-1;var i=r>=0?r:Math.max(n-Math.abs(r),0);for(;i<n;i++)if(i in t&&t[i]===e)return i;return-1}),Array.prototype.forEach||(Array.prototype.forEach=function(e,t){for(var n=0,r=this.length>>>0;n<r;n++)n in this&&e.call(t,this[n],n,this)}),Array.prototype.map||(Array.prototype.map=function(e,t){var n=[];for(var r=0,i=this.length>>>0;r<i;r++)r in this&&(n[r]=e.call(t,this[r],r,this));return n}),Array.prototype.every||(Array.prototype.every=function(e,t){for(var n=0,r=this.length>>>0;n<r;n++)if(n in this&&!e.call(t,this[n],n,this))return!1;return!0}),Array.prototype.some||(Array.prototype.some=function(e,t){for(var n=0,r=this.length>>>0;n<r;n++)if(n in this&&e.call(t,this[n],n,this))return!0;return!1}),Array.prototype.filter||(Array.prototype.filter=function(e,t){var n=[],r;for(var i=0,s=this.length>>>0;i<s;i++)i in this&&(r=this[i],e.call(t,r,i,this)&&n.push(r));return n}),Array.prototype.reduce||(Array.prototype.reduce=function(e){var t=this.length>>>0,n=0,r;if(arguments.length>1)r=arguments[1];else do{if(n in this){r=this[n++];break}if(++n>=t)throw new TypeError}while(!0);for(;n<t;n++)n in this&&(r=e.call(null,r,this[n],n,this));return r}),fabric.util.array={invoke:t,min:r,max:n}}(),function(){function e(e,t){for(var n in t)e[n]=t[n];return e}function t(t){return e({},t)}fabric.util.object={extend:e,clone:t}}(),function(){function e(e){return e.replace(/-+(.)?/g,function(e,t){return t?t.toUpperCase():""})}function t(e,t){return e.charAt(0).toUpperCase()+(t?e.slice(1):e.slice(1).toLowerCase())}function n(e){return e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&apos;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^[\s\xA0]+/,"").replace(/[\s\xA0]+$/,"")}),fabric.util.string={camelize:e,capitalize:t,escapeXml:n}}(),function(){var e=Array.prototype.slice,t=Function.prototype.apply,n=function(){};Function.prototype.bind||(Function.prototype.bind=function(r){var i=this,s=e.call(arguments,1),o;return s.length?o=function(){return t.call(i,this instanceof n?this:r,s.concat(e.call(arguments)))}:o=function(){return t.call(i,this instanceof n?this:r,arguments)},n.prototype=this.prototype,o.prototype=new n,o})}(),function(){function i(){}function s(t){var n=this.constructor.superclass.prototype[t];return arguments.length>1?n.apply(this,e.call(arguments,1)):n.call(this)}function o(){function u(){this.initialize.apply(this,arguments)}var n=null,o=e.call(arguments,0);typeof o[0]=="function"&&(n=o.shift()),u.superclass=n,u.subclasses=[],n&&(i.prototype=n.prototype,u.prototype=new i,n.subclasses.push(u));for(var a=0,f=o.length;a<f;a++)r(u,o[a],n);return u.prototype.initialize||(u.prototype.initialize=t),u.prototype.constructor=u,u.prototype.callSuper=s,u}var e=Array.prototype.slice,t=function(){},n=function(){for(var e in{toString:1})if(e==="toString")return!1;return!0}(),r=function(e,t,r){for(var i in t)i in e.prototype&&typeof e.prototype[i]=="function"&&(t[i]+"").indexOf("callSuper")>-1?e.prototype[i]=function(e){return function(){var n=this.constructor.superclass;this.constructor.superclass=r;var i=t[e].apply(this,arguments);this.constructor.superclass=n;if(e!=="initialize")return i}}(i):e.prototype[i]=t[i],n&&(t.toString!==Object.prototype.toString&&(e.prototype.toString=t.toString),t.valueOf!==Object.prototype.valueOf&&(e.prototype.valueOf=t.valueOf))};fabric.util.createClass=o}(),function(){function t(e){var t=Array.prototype.slice.call(arguments,1),n,r,i=t.length;for(r=0;r<i;r++){n=typeof e[t[r]];if(!/^(?:function|object|unknown)$/.test(n))return!1}return!0}function s(e,t){return{handler:t,wrappedHandler:o(e,t)}}function o(e,t){return function(r){t.call(n(e),r||fabric.window.event)}}function u(e,t){return function(n){if(c[e]&&c[e][t]){var r=c[e][t];for(var i=0,s=r.length;i<s;i++)r[i].call(this,n||fabric.window.event)}}}function d(t,n){t||(t=fabric.window.event);var r=t.target||(typeof t.srcElement!==e?t.srcElement:null),i=fabric.util.getScrollLeftTop(r,n);return{x:v(t)+i.left,y:m(t)+i.top}}function g(e,t,n){var r=e.type==="touchend"?"changedTouches":"touches";return e[r]&&e[r][0]?e[r][0][t]-(e[r][0][t]-e[r][0][n])||e[n]:e[n]}var e="unknown",n,r,i=function(){var e=0;return function(t){return t.__uniqueID||(t.__uniqueID="uniqueID__"+e++)}}();(function(){var e={};n=function(t){return e[t]},r=function(t,n){e[t]=n}})();var a=t(fabric.document.documentElement,"addEventListener","removeEventListener")&&t(fabric.window,"addEventListener","removeEventListener"),f=t(fabric.document.documentElement,"attachEvent","detachEvent")&&t(fabric.window,"attachEvent","detachEvent"),l={},c={},h,p;a?(h=function(e,t,n){e.addEventListener(t,n,!1)},p=function(e,t,n){e.removeEventListener(t,n,!1)}):f?(h=function(e,t,n){var o=i(e);r(o,e),l[o]||(l[o]={}),l[o][t]||(l[o][t]=[]);var u=s(o,n);l[o][t].push(u),e.attachEvent("on"+t,u.wrappedHandler)},p=function(e,t,n){var r=i(e),s;if(l[r]&&l[r][t])for(var o=0,u=l[r][t].length;o<u;o++)s=l[r][t][o],s&&s.handler===n&&(e.detachEvent("on"+t,s.wrappedHandler),l[r][t][o]=null)}):(h=function(e,t,n){var r=i(e);c[r]||(c[r]={});if(!c[r][t]){c[r][t]=[];var s=e["on"+t];s&&c[r][t].push(s),e["on"+t]=u(r,t)}c[r][t].push(n)},p=function(e,t,n){var r=i(e);if(c[r]&&c[r][t]){var s=c[r][t];for(var o=0,u=s.length;o<u;o++)s[o]===n&&s.splice(o,1)}}),fabric.util.addListener=h,fabric.util.removeListener=p;var v=function(t){return typeof t.clientX!==e?t.clientX:0},m=function(t){return typeof t.clientY!==e?t.clientY:0};fabric.isTouchSupported&&(v=function(e){return g(e,"pageX","clientX")},m=function(e){return g(e,"pageY","clientY")}),fabric.util.getPointer=d,fabric.util.object.extend(fabric.util,fabric.Observable)}(),function(){function e(e,t){var n=e.style;if(!n)return e;if(typeof t=="string")return e.style.cssText+=";"+t,t.indexOf("opacity")>-1?s(e,t.match(/opacity:\s*(\d?\.?\d*)/)[1]):e;for(var r in t)if(r==="opacity")s(e,t[r]);else{var i=r==="float"||r==="cssFloat"?typeof n.styleFloat=="undefined"?"cssFloat":"styleFloat":r;n[i]=t[r]}return e}var t=fabric.document.createElement("div"),n=typeof t.style.opacity=="string",r=typeof t.style.filter=="string",i=/alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/,s=function(e){return e};n?s=function(e,t){return e.style.opacity=t,e}:r&&(s=function(e,t){var n=e.style;return e.currentStyle&&!e.currentStyle.hasLayout&&(n.zoom=1),i.test(n.filter)?(t=t>=.9999?"":"alpha(opacity="+t*100+")",n.filter=n.filter.replace(i,t)):n.filter+=" alpha(opacity="+t*100+")",e}),fabric.util.setStyle=e}(),function(){function t(e){return typeof e=="string"?fabric.document.getElementById(e):e}function s(e,t){var n=fabric.document.createElement(e);for(var r in t)r==="class"?n.className=t[r]:r==="for"?n.htmlFor=t[r]:n.setAttribute(r,t[r]);return n}function o(e,t){e&&(" "+e.className+" ").indexOf(" "+t+" ")===-1&&(e.className+=(e.className?" ":"")+t)}function u(e,t,n){return typeof t=="string"&&(t=s(t,n)),e.parentNode&&e.parentNode.replaceChild(t,e),t.appendChild(e),t}function a(e,t){var n,r,i=0,s=0,o=fabric.document.documentElement,u=fabric.document.body||{scrollLeft:0,scrollTop:0};r=e;while(e&&e.parentNode&&!n)e=e.parentNode,e.nodeType===1&&fabric.util.getElementStyle(e,"position")==="fixed"&&(n=e),e.nodeType===1&&r!==t&&fabric.util.getElementStyle(e,"position")==="absolute"?(i=0,s=0):e===fabric.document?(i=u.scrollLeft||o.scrollLeft||0,s=u.scrollTop||o.scrollTop||0):(i+=e.scrollLeft||0,s+=e.scrollTop||0);return{left:i,top:s}}function f(e){var t,n=e&&e.ownerDocument,r={left:0,top:0},i={left:0,top:0},s,o={borderLeftWidth:"left",borderTopWidth:"top",paddingLeft:"left",paddingTop:"top"};if(!n)return{left:0,top:0};for(var u in o)i[o[u]]+=parseInt(l(e,u),10)||0;return t=n.documentElement,typeof e.getBoundingClientRect!="undefined"&&(r=e.getBoundingClientRect()),s=fabric.util.getScrollLeftTop(e,null),{left:r.left+s.left-(t.clientLeft||0)+i.left,top:r.top+s.top-(t.clientTop||0)+i.top}}var e=Array.prototype.slice,n,r=function(t){return e.call(t,0)};try{n=r(fabric.document.childNodes)instanceof Array}catch(i){}n||(r=function(e){var t=new Array(e.length),n=e.length;while(n--)t[n]=e[n];return t});var l;fabric.document.defaultView&&fabric.document.defaultView.getComputedStyle?l=function(e,t){var n=fabric.document.defaultView.getComputedStyle(e,null);return n?n[t]:undefined}:l=function(e,t){var n=e.style[t];return!n&&e.currentStyle&&(n=e.currentStyle[t]),n},function(){function n(e){return typeof e.onselectstart!="undefined"&&(e.onselectstart=fabric.util.falseFunction),t?e.style[t]="none":typeof e.unselectable=="string"&&(e.unselectable="on"),e}function r(e){return typeof e.onselectstart!="undefined"&&(e.onselectstart=null),t?e.style[t]="":typeof e.unselectable=="string"&&(e.unselectable=""),e}var e=fabric.document.documentElement.style,t="userSelect"in e?"userSelect":"MozUserSelect"in e?"MozUserSelect":"WebkitUserSelect"in e?"WebkitUserSelect":"KhtmlUserSelect"in e?"KhtmlUserSelect":"";fabric.util.makeElementUnselectable=n,fabric.util.makeElementSelectable=r}(),function(){function e(e,t){var n=fabric.document.getElementsByTagName("head")[0],r=fabric.document.createElement("script"),i=!0;r.onload=r.onreadystatechange=function(e){if(i){if(typeof this.readyState=="string"&&this.readyState!=="loaded"&&this.readyState!=="complete")return;i=!1,t(e||fabric.window.event),r=r.onload=r.onreadystatechange=null}},r.src=e,n.appendChild(r)}fabric.util.getScript=e}(),fabric.util.getById=t,fabric.util.toArray=r,fabric.util.makeElement=s,fabric.util.addClass=o,fabric.util.wrapElement=u,fabric.util.getScrollLeftTop=a,fabric.util.getElementOffset=f,fabric.util.getElementStyle=l}(),function(){function e(e,t){return e+(/\?/.test(e)?"&":"?")+t}function n(){}function r(r,i){i||(i={});var s=i.method?i.method.toUpperCase():"GET",o=i.onComplete||function(){},u=t(),a;return u.onreadystatechange=function(){u.readyState===4&&(o(u),u.onreadystatechange=n)},s==="GET"&&(a=null,typeof i.parameters=="string"&&(r=e(r,i.parameters))),u.open(s,r,!0),(s==="POST"||s==="PUT")&&u.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),u.send(a),u}var t=function(){var e=[function(){return new ActiveXObject("Microsoft.XMLHTTP")},function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Msxml2.XMLHTTP.3.0")},function(){return new XMLHttpRequest}];for(var t=e.length;t--;)try{var n=e[t]();if(n)return e[t]}catch(r){}}();fabric.util.request=r}(),fabric.log=function(){},fabric.warn=function(){},typeof console!="undefined"&&["log","warn"].forEach(function(e){typeof console[e]!="undefined"&&console[e].apply&&(fabric[e]=function(){return console[e].apply(console,arguments)})}),function(){function e(e){n(function(t){e||(e={});var r=t||+(new Date),i=e.duration||500,s=r+i,o,u=e.onChange||function(){},a=e.abort||function(){return!1},f=e.easing||function(e,t,n,r){return-n*Math.cos(e/r*(Math.PI/2))+n+t},l="startValue"in e?e.startValue:0,c="endValue"in e?e.endValue:100,h=e.byValue||c-l;e.onStart&&e.onStart(),function p(t){o=t||+(new Date);var c=o>s?i:o-r;if(a()){e.onComplete&&e.onComplete();return}u(f(c,l,h,i));if(o>s){e.onComplete&&e.onComplete();return}n(p)}(r)})}function n(){return t.apply(fabric.window,arguments)}var t=fabric.window.requestAnimationFrame||fabric.window.webkitRequestAnimationFrame||fabric.window.mozRequestAnimationFrame||fabric.window.oRequestAnimationFrame||fabric.window.msRequestAnimationFrame||function(e){fabric.window.setTimeout(e,1e3/60)};fabric.util.animate=e,fabric.util.requestAnimFrame=n}(),function(){function e(e,t,n,r){return e<Math.abs(t)?(e=t,r=n/4):r=n/(2*Math.PI)*Math.asin(t/e),{a:e,c:t,p:n,s:r}}function t(e,t,n){return e.a*Math.pow(2,10*(t-=1))*Math.sin((t*n-e.s)*2*Math.PI/e.p)}function n(e,t,n,r){return n*((e=e/r-1)*e*e+1)+t}function r(e,t,n,r){return e/=r/2,e<1?n/2*e*e*e+t:n/2*((e-=2)*e*e+2)+t}function i(e,t,n,r){return n*(e/=r)*e*e*e+t}function s(e,t,n,r){return-n*((e=e/r-1)*e*e*e-1)+t}function o(e,t,n,r){return e/=r/2,e<1?n/2*e*e*e*e+t:-n/2*((e-=2)*e*e*e-2)+t}function u(e,t,n,r){return n*(e/=r)*e*e*e*e+t}function a(e,t,n,r){return n*((e=e/r-1)*e*e*e*e+1)+t}function f(e,t,n,r){return e/=r/2,e<1?n/2*e*e*e*e*e+t:n/2*((e-=2)*e*e*e*e+2)+t}function l(e,t,n,r){return-n*Math.cos(e/r*(Math.PI/2))+n+t}function c(e,t,n,r){return n*Math.sin(e/r*(Math.PI/2))+t}function h(e,t,n,r){return-n/2*(Math.cos(Math.PI*e/r)-1)+t}function p(e,t,n,r){return e===0?t:n*Math.pow(2,10*(e/r-1))+t}function d(e,t,n,r){return e===r?t+n:n*(-Math.pow(2,-10*e/r)+1)+t}function v(e,t,n,r){return e===0?t:e===r?t+n:(e/=r/2,e<1?n/2*Math.pow(2,10*(e-1))+t:n/2*(-Math.pow(2,-10*--e)+2)+t)}function m(e,t,n,r){return-n*(Math.sqrt(1-(e/=r)*e)-1)+t}function g(e,t,n,r){return n*Math.sqrt(1-(e=e/r-1)*e)+t}function y(e,t,n,r){return e/=r/2,e<1?-n/2*(Math.sqrt(1-e*e)-1)+t:n/2*(Math.sqrt(1-(e-=2)*e)+1)+t}function b(n,r,i,s){var o=1.70158,u=0,a=i;if(n===0)return r;n/=s;if(n===1)return r+i;u||(u=s*.3);var f=e(a,i,u,o);return-t(f,n,s)+r}function w(t,n,r,i){var s=1.70158,o=0,u=r;if(t===0)return n;t/=i;if(t===1)return n+r;o||(o=i*.3);var a=e(u,r,o,s);return a.a*Math.pow(2,-10*t)*Math.sin((t*i-a.s)*2*Math.PI/a.p)+a.c+n}function E(n,r,i,s){var o=1.70158,u=0,a=i;if(n===0)return r;n/=s/2;if(n===2)return r+i;u||(u=s*.3*1.5);var f=e(a,i,u,o);return n<1?-0.5*t(f,n,s)+r:f.a*Math.pow(2,-10*(n-=1))*Math.sin((n*s-f.s)*2*Math.PI/f.p)*.5+f.c+r}function S(e,t,n,r,i){return i===undefined&&(i=1.70158),n*(e/=r)*e*((i+1)*e-i)+t}function x(e,t,n,r,i){return i===undefined&&(i=1.70158),n*((e=e/r-1)*e*((i+1)*e+i)+1)+t}function T(e,t,n,r,i){return i===undefined&&(i=1.70158),e/=r/2,e<1?n/2*e*e*(((i*=1.525)+1)*e-i)+t:n/2*((e-=2)*e*(((i*=1.525)+1)*e+i)+2)+t}function N(e,t,n,r){return n-C(r-e,0,n,r)+t}function C(e,t,n,r){return(e/=r)<1/2.75?n*7.5625*e*e+t:e<2/2.75?n*(7.5625*(e-=1.5/2.75)*e+.75)+t:e<2.5/2.75?n*(7.5625*(e-=2.25/2.75)*e+.9375)+t:n*(7.5625*(e-=2.625/2.75)*e+.984375)+t}function k(e,t,n,r){return e<r/2?N(e*2,0,n,r)*.5+t:C(e*2-r,0,n,r)*.5+n*.5+t}fabric.util.ease={easeInQuad:function(e,t,n,r){return n*(e/=r)*e+t},easeOutQuad:function(e,t,n,r){return-n*(e/=r)*(e-2)+t},easeInOutQuad:function(e,t,n,r){return e/=r/2,e<1?n/2*e*e+t:-n/2*(--e*(e-2)-1)+t},easeInCubic:function(e,t,n,r){return n*(e/=r)*e*e+t},easeOutCubic:n,easeInOutCubic:r,easeInQuart:i,easeOutQuart:s,easeInOutQuart:o,easeInQuint:u,easeOutQuint:a,easeInOutQuint:f,easeInSine:l,easeOutSine:c,easeInOutSine:h,easeInExpo:p,easeOutExpo:d,easeInOutExpo:v,easeInCirc:m,easeOutCirc:g,easeInOutCirc:y,easeInElastic:b,easeOutElastic:w,easeInOutElastic:E,easeInBack:S,easeOutBack:x,easeInOutBack:T,easeInBounce:N,easeOutBounce:C,easeInOutBounce:k}}(),function(e){"use strict";function l(e){return e in a?a[e]:e}function c(e,n,r,i){var s=Object.prototype.toString.call(n)==="[object Array]",a;return e!=="fill"&&e!=="stroke"||n!=="none"?e==="strokeDashArray"?n=n.replace(/,/g," ").split(/\s+/).map(function(e){return parseFloat(e)}):e==="transformMatrix"?r&&r.transformMatrix?n=u(r.transformMatrix,t.parseTransformAttribute(n)):n=t.parseTransformAttribute(n):e==="visible"?(n=n==="none"||n==="hidden"?!1:!0,r&&r.visible===!1&&(n=!1)):e==="originX"?n=n==="start"?"left":n==="end"?"right":"center":a=s?n.map(o):o(n,i):n="",!s&&isNaN(a)?n:a}function h(e){for(var n in f){if(!e[n]||typeof e[f[n]]=="undefined")continue;if(e[n].indexOf("url(")===0)continue;var r=new t.Color(e[n]);e[n]=r.setAlpha(s(r.getAlpha()*e[f[n]],2)).toRgba()}return e}function p(e,t){var n,r;e.replace(/;$/,"").split(";").forEach(function(e){var i=e.split(":");n=l(i[0].trim().toLowerCase()),r=c(n,i[1].trim()),t[n]=r})}function d(e,t){var n,r;for(var i in e){if(typeof e[i]=="undefined")continue;n=l(i.toLowerCase()),r=c(n,e[i]),t[n]=r}}function v(e,n){var r={};for(var i in t.cssRules[n])if(m(e,i.split(" ")))for(var s in t.cssRules[n][i])r[s]=t.cssRules[n][i][s];return r}function m(e,t){var n,r=!0;return n=y(e,t.pop()),n&&t.length&&(r=g(e,t)),n&&r&&t.length===0}function g(e,t){var n,r=!0;while(e.parentNode&&e.parentNode.nodeType===1&&t.length)r&&(n=t.pop()),e=e.parentNode,r=y(e,n);return t.length===0}function y(e,t){var n=e.nodeName,r=e.getAttribute("class"),i=e.getAttribute("id"),s;s=new RegExp("^"+n,"i"),t=t.replace(s,""),i&&t.length&&(s=new RegExp("#"+i+"(?![a-zA-Z\\-]+)","i"),t=t.replace(s,""));if(r&&t.length){r=r.split(" ");for(var o=r.length;o--;)s=new RegExp("\\."+r[o]+"(?![a-zA-Z\\-]+)","i"),t=t.replace(s,"")}return t.length===0}function b(e){var t=e.getElementsByTagName("use");while(t.length){var n=t[0],r=n.getAttribute("xlink:href").substr(1),i=n.getAttribute("x")||0,s=n.getAttribute("y")||0,o=e.getElementById(r).cloneNode(!0),u=(o.getAttribute("transform")||"")+" translate("+i+", "+s+")",a;for(var f=0,l=n.attributes,c=l.length;f<c;f++){var h=l.item(f);if(h.nodeName==="x"||h.nodeName==="y"||h.nodeName==="xlink:href")continue;h.nodeName==="transform"?u=h.nodeValue+" "+u:o.setAttribute(h.nodeName,h.nodeValue)}o.setAttribute("transform",u),o.setAttribute("instantiated_by_use","1"),o.removeAttribute("id"),a=n.parentNode,a.replaceChild(o,n)}}function w(e,n,r){var i=new RegExp("^\\s*("+t.reNum+"+)\\s*,?"+"\\s*("+t.reNum+"+)\\s*,?"+"\\s*("+t.reNum+"+)\\s*,?"+"\\s*("+t.reNum+"+)\\s*"+"$"),s=e.getAttribute("viewBox"),o=1,u=1,a=0,f=0,l,c,h,p;if(!s||!(s=s.match(i)))return;a=-parseFloat(s[1]),f=-parseFloat(s[2]),l=parseFloat(s[3]),c=parseFloat(s[4]),n&&n!==l&&(o=n/l),r&&r!==c&&(u=r/c),u=o=o>u?u:o;if(o===1&&u===1&&a===0&&f===0)return;h="matrix("+o+" 0"+" 0 "+u+" "+a*o+" "+f*u+")";if(e.tagName==="svg"){p=e.ownerDocument.createElement("g");while(e.firstChild!=null)p.appendChild(e.firstChild);e.appendChild(p)}else p=e,h+=p.getAttribute("transform");p.setAttribute("transform",h)}function S(e){var n=e.objects,i=e.options;return n=n.map(function(e){return t[r(e.type)].fromObject(e)}),{objects:n,options:i}}function x(e,t,n){t[n]&&t[n].toSVG&&e.push('<pattern x="0" y="0" id="',n,'Pattern" ','width="',t[n].source.width,'" height="',t[n].source.height,'" patternUnits="userSpaceOnUse">','<image x="0" y="0" ','width="',t[n].source.width,'" height="',t[n].source.height,'" xlink:href="',t[n].source.src,'"></image></pattern>')}var t=e.fabric||(e.fabric={}),n=t.util.object.extend,r=t.util.string.capitalize,i=t.util.object.clone,s=t.util.toFixed,o=t.util.parseUnit,u=t.util.multiplyTransformMatrices,a={cx:"left",x:"left",r:"radius",cy:"top",y:"top",display:"visible",visibility:"visible",transform:"transformMatrix","fill-opacity":"fillOpacity","fill-rule":"fillRule","font-family":"fontFamily","font-size":"fontSize","font-style":"fontStyle","font-weight":"fontWeight","stroke-dasharray":"strokeDashArray","stroke-linecap":"strokeLineCap","stroke-linejoin":"strokeLineJoin","stroke-miterlimit":"strokeMiterLimit","stroke-opacity":"strokeOpacity","stroke-width":"strokeWidth","text-decoration":"textDecoration","text-anchor":"originX"},f={stroke:"strokeOpacity",fill:"fillOpacity"};t.cssRules={},t.gradientDefs={},t.parseTransformAttribute=function(){function e(e,t){var n=t[0];e[0]=Math.cos(n),e[1]=Math.sin(n),e[2]=-Math.sin(n),e[3]=Math.cos(n)}function n(e,t){var n=t[0],r=t.length===2?t[1]:t[0];e[0]=n,e[3]=r}function r(e,n){e[2]=Math.tan(t.util.degreesToRadians(n[0]))}function i(e,n){e[1]=Math.tan(t.util.degreesToRadians(n[0]))}function s(e,t){e[4]=t[0],t.length===2&&(e[5]=t[1])}var o=[1,0,0,1,0,0],u=t.reNum,a="(?:\\s+,?\\s*|,\\s*)",f="(?:(skewX)\\s*\\(\\s*("+u+")\\s*\\))",l="(?:(skewY)\\s*\\(\\s*("+u+")\\s*\\))",c="(?:(rotate)\\s*\\(\\s*("+u+")(?:"+a+"("+u+")"+a+"("+u+"))?\\s*\\))",h="(?:(scale)\\s*\\(\\s*("+u+")(?:"+a+"("+u+"))?\\s*\\))",p="(?:(translate)\\s*\\(\\s*("+u+")(?:"+a+"("+u+"))?\\s*\\))",d="(?:(matrix)\\s*\\(\\s*("+u+")"+a+"("+u+")"+a+"("+u+")"+a+"("+u+")"+a+"("+u+")"+a+"("+u+")"+"\\s*\\))",v="(?:"+d+"|"+p+"|"+h+"|"+c+"|"+f+"|"+l+")",m="(?:"+v+"(?:"+a+v+")*"+")",g="^\\s*(?:"+m+"?)\\s*$",y=new RegExp(g),b=new RegExp(v,"g");return function(u){var a=o.concat(),f=[];if(!u||u&&!y.test(u))return a;u.replace(b,function(u){var l=(new RegExp(v)).exec(u).filter(function(e){return e!==""&&e!=null}),c=l[1],h=l.slice(2).map(parseFloat);switch(c){case"translate":s(a,h);break;case"rotate":h[0]=t.util.degreesToRadians(h[0]),e(a,h);break;case"scale":n(a,h);break;case"skewX":r(a,h);break;case"skewY":i(a,h);break;case"matrix":a=h}f.push(a.concat()),a=o.concat()});var l=f[0];while(f.length>1)f.shift(),l=t.util.multiplyTransformMatrices(l,f[0]);return l}}(),t.parseSVGDocument=function(){function r(e,t){while(e&&(e=e.parentNode))if(t.test(e.nodeName)&&!e.getAttribute("instantiated_by_use"))return!0;return!1}var e=/^(path|circle|polygon|polyline|ellipse|rect|line|image|text)$/,n=/^(symbol|image|marker|pattern|view)$/;return function(s,u,a){if(!s)return;b(s);var f=new Date,l=t.Object.__uid++,c=o(s.getAttribute("width")||"100%"),h=o(s.getAttribute("height")||"100%");w(s,c,h);var p=t.util.toArray(s.getElementsByTagName("*"));if(p.length===0&&t.isLikelyNode){p=s.selectNodes('//*[name(.)!="svg"]');var d=[];for(var v=0,m=p.length;v<m;v++)d[v]=p[v];p=d}var g=p.filter(function(t){return n.test(t.tagName)&&w(t,0,0),e.test(t.tagName)&&!r(t,/^(?:pattern|defs|symbol)$/)});if(!g||g&&!g.length){u&&u([],{});return}var y={width:c,height:h,widthAttr:c,heightAttr:h,svgUid:l};t.gradientDefs[l]=t.getGradientDefs(s),t.cssRules[l]=t.getCSSRules(s),t.parseElements(g,function(e){t.documentParsingTime=new Date-f,u&&u(e,y)},i(y),a)}}();var E={has:function(e,t){t(!1)},get:function(){},set:function(){}};n(t,{parseFontDeclaration:function(e,n){var r="(normal|italic)?\\s*(normal|small-caps)?\\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\\s*("+t.reNum+"(?:px|cm|mm|em|pt|pc|in)*)(?:\\/(normal|"+t.reNum+"))?\\s+(.*)",i=e.match(r);if(!i)return;var s=i[1],u=i[3],a=i[4],f=i[5],l=i[6];s&&(n.fontStyle=s),u&&(n.fontWeight=isNaN(parseFloat(u))?u:parseFloat(u)),a&&(n.fontSize=o(a)),l&&(n.fontFamily=l),f&&(n.lineHeight=f==="normal"?1:f)},getGradientDefs:function(e){var t=e.getElementsByTagName("linearGradient"),n=e.getElementsByTagName("radialGradient"),r,i,s=0,o,u,a=[],f={},l={};a.length=t.length+n.length,i=t.length;while(i--)a[s++]=t[i];i=n.length;while(i--)a[s++]=n[i];while(s--)r=a[s],u=r.getAttribute("xlink:href"),o=r.getAttribute("id"),u&&(l[o]=u.substr(1)),f[o]=r;for(o in l){var c=f[l[o]].cloneNode(!0);r=f[o];while(c.firstChild)r.appendChild(c.firstChild)}return f},parseAttributes:function(e,r,i){if(!e)return;var s,o={},u;typeof i=="undefined"&&(i=e.getAttribute("svgUid")),e.parentNode&&/^symbol|[g|a]$/i.test(e.parentNode.nodeName)&&(o=t.parseAttributes(e.parentNode,r,i)),u=o&&o.fontSize||e.getAttribute("font-size")||t.Text.DEFAULT_SVG_FONT_SIZE
;var a=r.reduce(function(t,n){return s=e.getAttribute(n),s&&(n=l(n),s=c(n,s,o,u),t[n]=s),t},{});return a=n(a,n(v(e,i),t.parseStyleAttribute(e))),a.font&&t.parseFontDeclaration(a.font,a),h(n(o,a))},parseElements:function(e,n,r,i){(new t.ElementsParser(e,n,r,i)).parse()},parseStyleAttribute:function(e){var t={},n=e.getAttribute("style");return n?(typeof n=="string"?p(n,t):d(n,t),t):t},parsePointsAttribute:function(e){if(!e)return null;e=e.replace(/,/g," ").trim(),e=e.split(/\s+/);var t=[],n,r;n=0,r=e.length;for(;n<r;n+=2)t.push({x:parseFloat(e[n]),y:parseFloat(e[n+1])});return t},getCSSRules:function(e){var n=e.getElementsByTagName("style"),r={},i;for(var s=0,o=n.length;s<o;s++){var u=n[s].textContent;u=u.replace(/\/\*[\s\S]*?\*\//g,"");if(u.trim()==="")continue;i=u.match(/[^{]*\{[\s\S]*?\}/g),i=i.map(function(e){return e.trim()}),i.forEach(function(e){var n=e.match(/([\s\S]*?)\s*\{([^}]*)\}/),i={},s=n[2].trim(),o=s.replace(/;$/,"").split(/\s*;\s*/);for(var u=0,a=o.length;u<a;u++){var f=o[u].split(/\s*:\s*/),h=l(f[0]),p=c(h,f[1],f[0]);i[h]=p}e=n[1],e.split(",").forEach(function(e){e=e.replace(/^svg/i,"").trim();if(e==="")return;r[e]=t.util.object.clone(i)})})}return r},loadSVGFromURL:function(e,n,r){function i(i){var s=i.responseXML;s&&!s.documentElement&&t.window.ActiveXObject&&i.responseText&&(s=new ActiveXObject("Microsoft.XMLDOM"),s.async="false",s.loadXML(i.responseText.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i,"")));if(!s||!s.documentElement)return;t.parseSVGDocument(s.documentElement,function(r,i){E.set(e,{objects:t.util.array.invoke(r,"toObject"),options:i}),n(r,i)},r)}e=e.replace(/^\n\s*/,"").trim(),E.has(e,function(r){r?E.get(e,function(e){var t=S(e);n(t.objects,t.options)}):new t.util.request(e,{method:"get",onComplete:i})})},loadSVGFromString:function(e,n,r){e=e.trim();var i;if(typeof DOMParser!="undefined"){var s=new DOMParser;s&&s.parseFromString&&(i=s.parseFromString(e,"text/xml"))}else t.window.ActiveXObject&&(i=new ActiveXObject("Microsoft.XMLDOM"),i.async="false",i.loadXML(e.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i,"")));t.parseSVGDocument(i.documentElement,function(e,t){n(e,t)},r)},createSVGFontFacesMarkup:function(e){var t="";for(var n=0,r=e.length;n<r;n++){if(e[n].type!=="text"||!e[n].path)continue;t+=["@font-face {","font-family: ",e[n].fontFamily,"; ","src: url('",e[n].path,"')","}"].join("")}return t&&(t=['<style type="text/css">',"<![CDATA[",t,"]]>","</style>"].join("")),t},createSVGRefElementsMarkup:function(e){var t=[];return x(t,e,"backgroundColor"),x(t,e,"overlayColor"),t.join("")}})}(typeof exports!="undefined"?exports:this),fabric.ElementsParser=function(e,t,n,r){this.elements=e,this.callback=t,this.options=n,this.reviver=r,this.svgUid=n&&n.svgUid||0},fabric.ElementsParser.prototype.parse=function(){this.instances=new Array(this.elements.length),this.numElements=this.elements.length,this.createObjects()},fabric.ElementsParser.prototype.createObjects=function(){for(var e=0,t=this.elements.length;e<t;e++)this.elements[e].setAttribute("svgUid",this.svgUid),function(e,t){setTimeout(function(){e.createObject(e.elements[t],t)},0)}(this,e)},fabric.ElementsParser.prototype.createObject=function(e,t){var n=fabric[fabric.util.string.capitalize(e.tagName)];if(n&&n.fromElement)try{this._createObject(n,e,t)}catch(r){fabric.log(r)}else this.checkIfDone()},fabric.ElementsParser.prototype._createObject=function(e,t,n){if(e.async)e.fromElement(t,this.createCallback(n,t),this.options);else{var r=e.fromElement(t,this.options);this.resolveGradient(r,"fill"),this.resolveGradient(r,"stroke"),this.reviver&&this.reviver(t,r),this.instances[n]=r,this.checkIfDone()}},fabric.ElementsParser.prototype.createCallback=function(e,t){var n=this;return function(r){n.resolveGradient(r,"fill"),n.resolveGradient(r,"stroke"),n.reviver&&n.reviver(t,r),n.instances[e]=r,n.checkIfDone()}},fabric.ElementsParser.prototype.resolveGradient=function(e,t){var n=e.get(t);if(!/^url\(/.test(n))return;var r=n.slice(5,n.length-1);fabric.gradientDefs[this.svgUid][r]&&e.set(t,fabric.Gradient.fromElement(fabric.gradientDefs[this.svgUid][r],e))},fabric.ElementsParser.prototype.checkIfDone=function(){--this.numElements===0&&(this.instances=this.instances.filter(function(e){return e!=null}),this.callback(this.instances))},function(e){"use strict";function n(e,t){this.x=e,this.y=t}var t=e.fabric||(e.fabric={});if(t.Point){t.warn("fabric.Point is already defined");return}t.Point=n,n.prototype={constructor:n,add:function(e){return new n(this.x+e.x,this.y+e.y)},addEquals:function(e){return this.x+=e.x,this.y+=e.y,this},scalarAdd:function(e){return new n(this.x+e,this.y+e)},scalarAddEquals:function(e){return this.x+=e,this.y+=e,this},subtract:function(e){return new n(this.x-e.x,this.y-e.y)},subtractEquals:function(e){return this.x-=e.x,this.y-=e.y,this},scalarSubtract:function(e){return new n(this.x-e,this.y-e)},scalarSubtractEquals:function(e){return this.x-=e,this.y-=e,this},multiply:function(e){return new n(this.x*e,this.y*e)},multiplyEquals:function(e){return this.x*=e,this.y*=e,this},divide:function(e){return new n(this.x/e,this.y/e)},divideEquals:function(e){return this.x/=e,this.y/=e,this},eq:function(e){return this.x===e.x&&this.y===e.y},lt:function(e){return this.x<e.x&&this.y<e.y},lte:function(e){return this.x<=e.x&&this.y<=e.y},gt:function(e){return this.x>e.x&&this.y>e.y},gte:function(e){return this.x>=e.x&&this.y>=e.y},lerp:function(e,t){return new n(this.x+(e.x-this.x)*t,this.y+(e.y-this.y)*t)},distanceFrom:function(e){var t=this.x-e.x,n=this.y-e.y;return Math.sqrt(t*t+n*n)},midPointFrom:function(e){return new n(this.x+(e.x-this.x)/2,this.y+(e.y-this.y)/2)},min:function(e){return new n(Math.min(this.x,e.x),Math.min(this.y,e.y))},max:function(e){return new n(Math.max(this.x,e.x),Math.max(this.y,e.y))},toString:function(){return this.x+","+this.y},setXY:function(e,t){this.x=e,this.y=t},setFromPoint:function(e){this.x=e.x,this.y=e.y},swap:function(e){var t=this.x,n=this.y;this.x=e.x,this.y=e.y,e.x=t,e.y=n}}}(typeof exports!="undefined"?exports:this),function(e){"use strict";function n(e){this.status=e,this.points=[]}var t=e.fabric||(e.fabric={});if(t.Intersection){t.warn("fabric.Intersection is already defined");return}t.Intersection=n,t.Intersection.prototype={appendPoint:function(e){this.points.push(e)},appendPoints:function(e){this.points=this.points.concat(e)}},t.Intersection.intersectLineLine=function(e,r,i,s){var o,u=(s.x-i.x)*(e.y-i.y)-(s.y-i.y)*(e.x-i.x),a=(r.x-e.x)*(e.y-i.y)-(r.y-e.y)*(e.x-i.x),f=(s.y-i.y)*(r.x-e.x)-(s.x-i.x)*(r.y-e.y);if(f!==0){var l=u/f,c=a/f;0<=l&&l<=1&&0<=c&&c<=1?(o=new n("Intersection"),o.points.push(new t.Point(e.x+l*(r.x-e.x),e.y+l*(r.y-e.y)))):o=new n}else u===0||a===0?o=new n("Coincident"):o=new n("Parallel");return o},t.Intersection.intersectLinePolygon=function(e,t,r){var i=new n,s=r.length;for(var o=0;o<s;o++){var u=r[o],a=r[(o+1)%s],f=n.intersectLineLine(e,t,u,a);i.appendPoints(f.points)}return i.points.length>0&&(i.status="Intersection"),i},t.Intersection.intersectPolygonPolygon=function(e,t){var r=new n,i=e.length;for(var s=0;s<i;s++){var o=e[s],u=e[(s+1)%i],a=n.intersectLinePolygon(o,u,t);r.appendPoints(a.points)}return r.points.length>0&&(r.status="Intersection"),r},t.Intersection.intersectPolygonRectangle=function(e,r,i){var s=r.min(i),o=r.max(i),u=new t.Point(o.x,s.y),a=new t.Point(s.x,o.y),f=n.intersectLinePolygon(s,u,e),l=n.intersectLinePolygon(u,o,e),c=n.intersectLinePolygon(o,a,e),h=n.intersectLinePolygon(a,s,e),p=new n;return p.appendPoints(f.points),p.appendPoints(l.points),p.appendPoints(c.points),p.appendPoints(h.points),p.points.length>0&&(p.status="Intersection"),p}}(typeof exports!="undefined"?exports:this),function(e){"use strict";function n(e){e?this._tryParsingColor(e):this.setSource([0,0,0,1])}function r(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<.5?t:n<2/3?e+(t-e)*(2/3-n)*6:e}var t=e.fabric||(e.fabric={});if(t.Color){t.warn("fabric.Color is already defined.");return}t.Color=n,t.Color.prototype={_tryParsingColor:function(e){var t;e in n.colorNameMap&&(e=n.colorNameMap[e]);if(e==="transparent"){this.setSource([255,255,255,0]);return}t=n.sourceFromHex(e),t||(t=n.sourceFromRgb(e)),t||(t=n.sourceFromHsl(e)),t&&this.setSource(t)},_rgbToHsl:function(e,n,r){e/=255,n/=255,r/=255;var i,s,o,u=t.util.array.max([e,n,r]),a=t.util.array.min([e,n,r]);o=(u+a)/2;if(u===a)i=s=0;else{var f=u-a;s=o>.5?f/(2-u-a):f/(u+a);switch(u){case e:i=(n-r)/f+(n<r?6:0);break;case n:i=(r-e)/f+2;break;case r:i=(e-n)/f+4}i/=6}return[Math.round(i*360),Math.round(s*100),Math.round(o*100)]},getSource:function(){return this._source},setSource:function(e){this._source=e},toRgb:function(){var e=this.getSource();return"rgb("+e[0]+","+e[1]+","+e[2]+")"},toRgba:function(){var e=this.getSource();return"rgba("+e[0]+","+e[1]+","+e[2]+","+e[3]+")"},toHsl:function(){var e=this.getSource(),t=this._rgbToHsl(e[0],e[1],e[2]);return"hsl("+t[0]+","+t[1]+"%,"+t[2]+"%)"},toHsla:function(){var e=this.getSource(),t=this._rgbToHsl(e[0],e[1],e[2]);return"hsla("+t[0]+","+t[1]+"%,"+t[2]+"%,"+e[3]+")"},toHex:function(){var e=this.getSource(),t,n,r;return t=e[0].toString(16),t=t.length===1?"0"+t:t,n=e[1].toString(16),n=n.length===1?"0"+n:n,r=e[2].toString(16),r=r.length===1?"0"+r:r,t.toUpperCase()+n.toUpperCase()+r.toUpperCase()},getAlpha:function(){return this.getSource()[3]},setAlpha:function(e){var t=this.getSource();return t[3]=e,this.setSource(t),this},toGrayscale:function(){var e=this.getSource(),t=parseInt((e[0]*.3+e[1]*.59+e[2]*.11).toFixed(0),10),n=e[3];return this.setSource([t,t,t,n]),this},toBlackWhite:function(e){var t=this.getSource(),n=(t[0]*.3+t[1]*.59+t[2]*.11).toFixed(0),r=t[3];return e=e||127,n=Number(n)<Number(e)?0:255,this.setSource([n,n,n,r]),this},overlayWith:function(e){e instanceof n||(e=new n(e));var t=[],r=this.getAlpha(),i=.5,s=this.getSource(),o=e.getSource();for(var u=0;u<3;u++)t.push(Math.round(s[u]*(1-i)+o[u]*i));return t[3]=r,this.setSource(t),this}},t.Color.reRGBa=/^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/,t.Color.reHSLa=/^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/,t.Color.reHex=/^#?([0-9a-f]{6}|[0-9a-f]{3})$/i,t.Color.colorNameMap={aqua:"#00FFFF",black:"#000000",blue:"#0000FF",fuchsia:"#FF00FF",gray:"#808080",green:"#008000",lime:"#00FF00",maroon:"#800000",navy:"#000080",olive:"#808000",orange:"#FFA500",purple:"#800080",red:"#FF0000",silver:"#C0C0C0",teal:"#008080",white:"#FFFFFF",yellow:"#FFFF00"},t.Color.fromRgb=function(e){return n.fromSource(n.sourceFromRgb(e))},t.Color.sourceFromRgb=function(e){var t=e.match(n.reRGBa);if(t){var r=parseInt(t[1],10)/(/%$/.test(t[1])?100:1)*(/%$/.test(t[1])?255:1),i=parseInt(t[2],10)/(/%$/.test(t[2])?100:1)*(/%$/.test(t[2])?255:1),s=parseInt(t[3],10)/(/%$/.test(t[3])?100:1)*(/%$/.test(t[3])?255:1);return[parseInt(r,10),parseInt(i,10),parseInt(s,10),t[4]?parseFloat(t[4]):1]}},t.Color.fromRgba=n.fromRgb,t.Color.fromHsl=function(e){return n.fromSource(n.sourceFromHsl(e))},t.Color.sourceFromHsl=function(e){var t=e.match(n.reHSLa);if(!t)return;var i=(parseFloat(t[1])%360+360)%360/360,s=parseFloat(t[2])/(/%$/.test(t[2])?100:1),o=parseFloat(t[3])/(/%$/.test(t[3])?100:1),u,a,f;if(s===0)u=a=f=o;else{var l=o<=.5?o*(s+1):o+s-o*s,c=o*2-l;u=r(c,l,i+1/3),a=r(c,l,i),f=r(c,l,i-1/3)}return[Math.round(u*255),Math.round(a*255),Math.round(f*255),t[4]?parseFloat(t[4]):1]},t.Color.fromHsla=n.fromHsl,t.Color.fromHex=function(e){return n.fromSource(n.sourceFromHex(e))},t.Color.sourceFromHex=function(e){if(e.match(n.reHex)){var t=e.slice(e.indexOf("#")+1),r=t.length===3,i=r?t.charAt(0)+t.charAt(0):t.substring(0,2),s=r?t.charAt(1)+t.charAt(1):t.substring(2,4),o=r?t.charAt(2)+t.charAt(2):t.substring(4,6);return[parseInt(i,16),parseInt(s,16),parseInt(o,16),1]}},t.Color.fromSource=function(e){var t=new n;return t.setSource(e),t}}(typeof exports!="undefined"?exports:this),function(){function e(e){var t=e.getAttribute("style"),n=e.getAttribute("offset"),r,i,s;n=parseFloat(n)/(/%$/.test(n)?100:1),n=n<0?0:n>1?1:n;if(t){var o=t.split(/\s*;\s*/);o[o.length-1]===""&&o.pop();for(var u=o.length;u--;){var a=o[u].split(/\s*:\s*/),f=a[0].trim(),l=a[1].trim();f==="stop-color"?r=l:f==="stop-opacity"&&(s=l)}}return r||(r=e.getAttribute("stop-color")||"rgb(0,0,0)"),s||(s=e.getAttribute("stop-opacity")),r=new fabric.Color(r),i=r.getAlpha(),s=isNaN(parseFloat(s))?1:parseFloat(s),s*=i,{offset:n,color:r.toRgb(),opacity:s}}function t(e){return{x1:e.getAttribute("x1")||0,y1:e.getAttribute("y1")||0,x2:e.getAttribute("x2")||"100%",y2:e.getAttribute("y2")||0}}function n(e){return{x1:e.getAttribute("fx")||e.getAttribute("cx")||"50%",y1:e.getAttribute("fy")||e.getAttribute("cy")||"50%",r1:0,x2:e.getAttribute("cx")||"50%",y2:e.getAttribute("cy")||"50%",r2:e.getAttribute("r")||"50%"}}function r(e,t,n){var r,i=0,s=1,o="";for(var u in t){r=parseFloat(t[u],10),typeof t[u]=="string"&&/^\d+%$/.test(t[u])?s=.01:s=1;if(u==="x1"||u==="x2"||u==="r2")s*=n==="objectBoundingBox"?e.width:1,i=n==="objectBoundingBox"?e.left||0:0;else if(u==="y1"||u==="y2")s*=n==="objectBoundingBox"?e.height:1,i=n==="objectBoundingBox"?e.top||0:0;t[u]=r*s+i}if(e.type==="ellipse"&&t.r2!==null&&n==="objectBoundingBox"&&e.rx!==e.ry){var a=e.ry/e.rx;o=" scale(1, "+a+")",t.y1&&(t.y1/=a),t.y2&&(t.y2/=a)}return o}fabric.Gradient=fabric.util.createClass({offsetX:0,offsetY:0,initialize:function(e){e||(e={});var t={};this.id=fabric.Object.__uid++,this.type=e.type||"linear",t={x1:e.coords.x1||0,y1:e.coords.y1||0,x2:e.coords.x2||0,y2:e.coords.y2||0},this.type==="radial"&&(t.r1=e.coords.r1||0,t.r2=e.coords.r2||0),this.coords=t,this.colorStops=e.colorStops.slice(),e.gradientTransform&&(this.gradientTransform=e.gradientTransform),this.offsetX=e.offsetX||this.offsetX,this.offsetY=e.offsetY||this.offsetY},addColorStop:function(e){for(var t in e){var n=new fabric.Color(e[t]);this.colorStops.push({offset:t,color:n.toRgb(),opacity:n.getAlpha()})}return this},toObject:function(){return{type:this.type,coords:this.coords,colorStops:this.colorStops,offsetX:this.offsetX,offsetY:this.offsetY}},toSVG:function(e){var t=fabric.util.object.clone(this.coords),n,r;this.colorStops.sort(function(e,t){return e.offset-t.offset});if(!e.group||e.group.type!=="path-group")for(var i in t)if(i==="x1"||i==="x2"||i==="r2")t[i]+=this.offsetX-e.width/2;else if(i==="y1"||i==="y2")t[i]+=this.offsetY-e.height/2;r='id="SVGID_'+this.id+'" gradientUnits="userSpaceOnUse"',this.gradientTransform&&(r+=' gradientTransform="matrix('+this.gradientTransform.join(" ")+')" '),this.type==="linear"?n=["<linearGradient ",r,' x1="',t.x1,'" y1="',t.y1,'" x2="',t.x2,'" y2="',t.y2,'">\n']:this.type==="radial"&&(n=["<radialGradient ",r,' cx="',t.x2,'" cy="',t.y2,'" r="',t.r2,'" fx="',t.x1,'" fy="',t.y1,'">\n']);for(var s=0;s<this.colorStops.length;s++)n.push("<stop ",'offset="',this.colorStops[s].offset*100+"%",'" style="stop-color:',this.colorStops[s].color,this.colorStops[s].opacity!=null?";stop-opacity: "+this.colorStops[s].opacity:";",'"/>\n');return n.push(this.type==="linear"?"</linearGradient>\n":"</radialGradient>\n"),n.join("")},toLive:function(e,t){var n,r=fabric.util.object.clone(this.coords);if(!this.type)return;if(t.group&&t.group.type==="path-group")for(var i in r)if(i==="x1"||i==="x2")r[i]+=-this.offsetX+t.width/2;else if(i==="y1"||i==="y2")r[i]+=-this.offsetY+t.height/2;this.type==="linear"?n=e.createLinearGradient(r.x1,r.y1,r.x2,r.y2):this.type==="radial"&&(n=e.createRadialGradient(r.x1,r.y1,r.r1,r.x2,r.y2,r.r2));for(var s=0,o=this.colorStops.length;s<o;s++){var u=this.colorStops[s].color,a=this.colorStops[s].opacity,f=this.colorStops[s].offset;typeof a!="undefined"&&(u=(new fabric.Color(u)).setAlpha(a).toRgba()),n.addColorStop(parseFloat(f),u)}return n}}),fabric.util.object.extend(fabric.Gradient,{fromElement:function(i,s){var o=i.getElementsByTagName("stop"),u=i.nodeName==="linearGradient"?"linear":"radial",a=i.getAttribute("gradientUnits")||"objectBoundingBox",f=i.getAttribute("gradientTransform"),l=[],c={},h;u==="linear"?c=t(i):u==="radial"&&(c=n(i));for(var p=o.length;p--;)l.push(e(o[p]));h=r(s,c,a);var d=new fabric.Gradient({type:u,coords:c,colorStops:l,offsetX:-s.left,offsetY:-s.top});if(f||h!=="")d.gradientTransform=fabric.parseTransformAttribute((f||"")+h);return d},forObject:function(e,t){return t||(t={}),r(e,t.coords,"userSpaceOnUse"),new fabric.Gradient(t)}})}(),fabric.Pattern=fabric.util.createClass({repeat:"repeat",offsetX:0,offsetY:0,initialize:function(e){e||(e={}),this.id=fabric.Object.__uid++;if(e.source)if(typeof e.source=="string")if(typeof fabric.util.getFunctionBody(e.source)!="undefined")this.source=new Function(fabric.util.getFunctionBody(e.source));else{var t=this;this.source=fabric.util.createImage(),fabric.util.loadImage(e.source,function(e){t.source=e})}else this.source=e.source;e.repeat&&(this.repeat=e.repeat),e.offsetX&&(this.offsetX=e.offsetX),e.offsetY&&(this.offsetY=e.offsetY)},toObject:function(){var e;return typeof this.source=="function"?e=String(this.source):typeof this.source.src=="string"&&(e=this.source.src),{source:e,repeat:this.repeat,offsetX:this.offsetX,offsetY:this.offsetY}},toSVG:function(e){var t=typeof this.source=="function"?this.source():this.source,n=t.width/e.getWidth(),r=t.height/e.getHeight(),i=this.offsetX/e.getWidth(),s=this.offsetY/e.getHeight(),o="";if(this.repeat==="repeat-x"||this.repeat==="no-repeat")r=1;if(this.repeat==="repeat-y"||this.repeat==="no-repeat")n=1;return t.src?o=t.src:t.toDataURL&&(o=t.toDataURL()),'<pattern id="SVGID_'+this.id+'" x="'+i+'" y="'+s+'" width="'+n+'" height="'+r+'">\n'+'<image x="0" y="0"'+' width="'+t.width+'" height="'+t.height+'" xlink:href="'+o+'"></image>\n'+"</pattern>\n"},toLive:function(e){var t=typeof this.source=="function"?this.source():this.source;if(!t)return"";if(typeof t.src!="undefined"){if(!t.complete)return"";if(t.naturalWidth===0||t.naturalHeight===0)return""}return e.createPattern(t,this.repeat)}}),function(e){"use strict";var t=e.fabric||(e.fabric={});if(t.Shadow){t.warn("fabric.Shadow is already defined.");return}t.Shadow=t.util.createClass({color:"rgb(0,0,0)",blur:0,offsetX:0,offsetY:0,affectStroke:!1,includeDefaultValues:!0,initialize:function(e){typeof e=="string"&&(e=this._parseShadow(e));for(var n in e)this[n]=e[n];this.id=t.Object.__uid++},_parseShadow:function(e){var n=e.trim(),r=t.Shadow.reOffsetsAndBlur.exec(n)||[],i=n.replace(t.Shadow.reOffsetsAndBlur,"")||"rgb(0,0,0)";return{color:i.trim(),offsetX:parseInt(r[1],10)||0,offsetY:parseInt(r[2],10)||0,blur:parseInt(r[3],10)||0}},toString:function(){return[this.offsetX,this.offsetY,this.blur,this.color].join("px ")},toSVG:function(e){var t="SourceAlpha",n=40,r=40;return e&&(e.fill===this.color||e.stroke===this.color)&&(t="SourceGraphic"),e.width&&e.height&&(n=Math.abs(this.offsetX/e.getWidth())*100+20,r=Math.abs(this.offsetY/e.getHeight())*100+20),'<filter id="SVGID_'+this.id+'" y="-'+r+'%" height="'+(100+2*r)+'%" '+'x="-'+n+'%" width="'+(100+2*n)+'%" '+">\n"+'	<feGaussianBlur in="'+t+'" stdDeviation="'+(this.blur?this.blur/3:0)+'"></feGaussianBlur>\n'+'	<feOffset dx="'+this.offsetX+'" dy="'+this.offsetY+'"></feOffset>\n'+"	<feMerge>\n"+"		<feMergeNode></feMergeNode>\n"+'		<feMergeNode in="SourceGraphic"></feMergeNode>\n'+"	</feMerge>\n"+"</filter>\n"},toObject:function(){if(this.includeDefaultValues)return{color:this.color,blur:this.blur,offsetX:this.offsetX,offsetY:this.offsetY};var e={},n=t.Shadow.prototype;return this.color!==n.color&&(e.color=this.color),this.blur!==n.blur&&(e.blur=this.blur),this.offsetX!==n.offsetX&&(e.offsetX=this.offsetX),this.offsetY!==n.offsetY&&(e.offsetY=this.offsetY),e}}),t.Shadow.reOffsetsAndBlur=/(?:\s|^)(-?\d+(?:px)?(?:\s?|$))?(-?\d+(?:px)?(?:\s?|$))?(\d+(?:px)?)?(?:\s?|$)(?:$|\s)/}(typeof exports!="undefined"?exports:this),function(){"use strict";if(fabric.StaticCanvas){fabric.warn("fabric.StaticCanvas is already defined.");return}var e=fabric.util.object.extend,t=fabric.util.getElementOffset,n=fabric.util.removeFromArray,r=new Error("Could not initialize `canvas` element");fabric.StaticCanvas=fabric.util.createClass({initialize:function(e,t){t||(t={}),this._initStatic(e,t),fabric.StaticCanvas.activeInstance=this},backgroundColor:"",backgroundImage:null,overlayColor:"",overlayImage:null,includeDefaultValues:!0,stateful:!0,renderOnAddRemove:!0,clipTo:null,controlsAboveOverlay:!1,allowTouchScrolling:!1,imageSmoothingEnabled:!0,preserveObjectStacking:!1,viewportTransform:[1,0,0,1,0,0],onBeforeScaleRotate:function(){},_initStatic:function(e,t){this._objects=[],this._createLowerCanvas(e),this._initOptions(t),this._setImageSmoothing(),t.overlayImage&&this.setOverlayImage(t.overlayImage,this.renderAll.bind(this)),t.backgroundImage&&this.setBackgroundImage(t.backgroundImage,this.renderAll.bind(this)),t.backgroundColor&&this.setBackgroundColor(t.backgroundColor,this.renderAll.bind(this)),t.overlayColor&&this.setOverlayColor(t.overlayColor,this.renderAll.bind(this)),this.calcOffset()},calcOffset:function(){return this._offset=t(this.lowerCanvasEl),this},setOverlayImage:function(e,t,n){return this.__setBgOverlayImage("overlayImage",e,t,n)},setBackgroundImage:function(e,t,n){return this.__setBgOverlayImage("backgroundImage",e,t,n)},setOverlayColor:function(e,t){return this.__setBgOverlayColor("overlayColor",e,t)},setBackgroundColor:function(e,t){return this.__setBgOverlayColor("backgroundColor",e,t)},_setImageSmoothing:function(){var e=this.getContext();e.imageSmoothingEnabled=this.imageSmoothingEnabled,e.webkitImageSmoothingEnabled=this.imageSmoothingEnabled,e.mozImageSmoothingEnabled=this.imageSmoothingEnabled,e.msImageSmoothingEnabled=this.imageSmoothingEnabled,e.oImageSmoothingEnabled=this.imageSmoothingEnabled},__setBgOverlayImage:function(e,t,n,r){return typeof t=="string"?fabric.util.loadImage(t,function(t){this[e]=new fabric.Image(t,r),n&&n()},this,r&&r.crossOrigin):(this[e]=t,n&&n()),this},__setBgOverlayColor:function(e,t,n){if(t&&t.source){var r=this;fabric.util.loadImage(t.source,function(i){r[e]=new fabric.Pattern({source:i,repeat:t.repeat,offsetX:t.offsetX,offsetY:t.offsetY}),n&&n()})}else this[e]=t,n&&n();return this},_createCanvasElement:function(){var e=fabric.document.createElement("canvas");e.style||(e.style={});if(!e)throw r;return this._initCanvasElement(e),e},_initCanvasElement:function(e){fabric.util.createCanvasElement(e);if(typeof e.getContext=="undefined")throw r},_initOptions:function(e){for(var t in e)this[t]=e[t];this.width=this.width||parseInt(this.lowerCanvasEl.width,10)||0,this.height=this.height||parseInt(this.lowerCanvasEl.height,10)||0;if(!this.lowerCanvasEl.style)return;this.lowerCanvasEl.width=this.width,this.lowerCanvasEl.height=this.height,this.lowerCanvasEl.style.width=this.width+"px",this.lowerCanvasEl.style.height=this.height+"px",this.viewportTransform=this.viewportTransform.slice()},_createLowerCanvas:function(e){this.lowerCanvasEl=fabric.util.getById(e)||this._createCanvasElement(),this._initCanvasElement(this.lowerCanvasEl),fabric.util.addClass(this.lowerCanvasEl,"lower-canvas"),this.interactive&&this._applyCanvasStyle(this.lowerCanvasEl),this.contextContainer=this.lowerCanvasEl.getContext("2d")},getWidth:function(){return this.width},getHeight:function(){return this.height},setWidth:function(e,t){return this.setDimensions({width:e},t)},setHeight:function(e,t){return this.setDimensions({height:e},t)},setDimensions:function(e,t){var n;t=t||{};for(var r in e)n=e[r],t.cssOnly||(this._setBackstoreDimension(r,e[r]),n+="px"),t.backstoreOnly||this._setCssDimension(r,n);return t.cssOnly||this.renderAll(),this.calcOffset(),this},_setBackstoreDimension:function(e,t){return this.lowerCanvasEl[e]=t,this.upperCanvasEl&&(this.upperCanvasEl[e]=t),this.cacheCanvasEl&&(this.cacheCanvasEl[e]=t),this[e]=t,this},_setCssDimension:function(e,t){return this.lowerCanvasEl.style[e]=t,this.upperCanvasEl&&(this.upperCanvasEl.style[e]=t),this.wrapperEl&&(this.wrapperEl.style[e]=t),this},getZoom:function(){return Math.sqrt(this.viewportTransform[0]*this.viewportTransform[3])},setViewportTransform:function(e){this.viewportTransform=e,this.renderAll();for(var t=0,n=this._objects.length;t<n;t++)this._objects[t].setCoords();return this},zoomToPoint:function(e,t){var n=e;e=fabric.util.transformPoint(e,fabric.util.invertTransform(this.viewportTransform)),this.viewportTransform[0]=t,this.viewportTransform[3]=t;var r=fabric.util.transformPoint(e,this.viewportTransform);this.viewportTransform[4]+=n.x-r.x,this.viewportTransform[5]+=n.y-r.y,this.renderAll();for(var i=0,s=this._objects.length;i<s;i++)this._objects[i].setCoords();return this},setZoom:function(e){return this.zoomToPoint(new fabric.Point(0,0),e),this},absolutePan:function(e){this.viewportTransform[4]=-e.x,this.viewportTransform[5]=-e.y,this.renderAll();for(var t=0,n=this._objects.length;t<n;t++)this._objects[t].setCoords();return this},relativePan:function(e){return this.absolutePan(new fabric.Point(-e.x-this.viewportTransform[4],-e.y-this.viewportTransform[5]))},getElement:function(){return this.lowerCanvasEl},getActiveObject:function(){return null},getActiveGroup:function(){return null},_draw:function(e,t){if(!t)return;e.save();var n=this.viewportTransform;e.transform(n[0],n[1],n[2],n[3],n[4],n[5]),this._shouldRenderObject(t)&&t.render(e),e.restore(),this.controlsAboveOverlay||t._renderControls(e)},_shouldRenderObject:function(e){return e?e!==this.getActiveGroup()||!this.preserveObjectStacking:!1},_onObjectAdded:function(e){this.stateful&&e.setupState(),e.canvas=this,e.setCoords(),this.fire("object:added",{target:e}),e.fire("added")},_onObjectRemoved:function(e){this.getActiveObject()===e&&(this.fire("before:selection:cleared",{target:e}),this._discardActiveObject(),this.fire("selection:cleared")),this.fire("object:removed",{target:e}),e.fire("removed")},clearContext:function(e){return e.clearRect(0,0,this.width,this.height),this},getContext:function(){return this.contextContainer},clear:function(){return this._objects.length=0,this.discardActiveGroup&&this.discardActiveGroup(),this.discardActiveObject&&this.discardActiveObject(),this.clearContext(this.contextContainer),this.contextTop&&this.clearContext(this.contextTop),this.fire("canvas:cleared"),this.renderAll(),this},renderAll:function(e){var t=this[e===!0&&this.interactive?"contextTop":"contextContainer"],n=this.getActiveGroup();return this.contextTop&&this.selection&&!this._groupSelector&&this.clearContext(this.contextTop),e||this.clearContext(t),this.fire("before:render"),this.clipTo&&fabric.util.clipContext(this,t),this._renderBackground(t),this._renderObjects(t,n),this._renderActiveGroup(t,n),this.clipTo&&t.restore(),this._renderOverlay(t),this.controlsAboveOverlay&&this.interactive&&this.drawControls(t),this.fire("after:render"),this},_renderObjects:function(e,t){var n,r;if(!t||this.preserveObjectStacking)for(n=0,r=this._objects.length;n<r;++n)this._draw(e,this._objects[n]);else for(n=0,r=this._objects.length;n<r;++n)this._objects[n]&&!t.contains(this._objects[n])&&this._draw(e,this._objects[n])},_renderActiveGroup:function(e,t){if(t){var n=[];this.forEachObject(function(e){t.contains(e)&&n.push(e)}),t._set("objects",n),this._draw(e,t)}},_renderBackground:function(e){this.backgroundColor&&(e.fillStyle=this.backgroundColor.toLive?this.backgroundColor.toLive(e):this.backgroundColor,e.fillRect(this.backgroundColor.offsetX||0,this.backgroundColor.offsetY||0,this.width,this.height)),this.backgroundImage&&this._draw(e,this.backgroundImage)},_renderOverlay:function(e){this.overlayColor&&(e.fillStyle=this.overlayColor.toLive?this.overlayColor.toLive(e):this.overlayColor,e.fillRect(this.overlayColor.offsetX||0,this.overlayColor.offsetY||0,this.width,this.height)),this.overlayImage&&this._draw(e,this.overlayImage)},renderTop:function(){var e=this.contextTop||this.contextContainer;this.clearContext(e),this.selection&&this._groupSelector&&this._drawSelection();var t=this.getActiveGroup();return t&&t.render(e),this._renderOverlay(e),this.fire("after:render"),this},getCenter:function(){return{top:this.getHeight()/2,left:this.getWidth()/2}},centerObjectH:function(e){return this._centerObject(e,new fabric.Point(this.getCenter().left,e.getCenterPoint().y)),this.renderAll(),this},centerObjectV:function(e){return this._centerObject(e,new fabric.Point(e.getCenterPoint().x,this.getCenter().top)),this.renderAll(),this},centerObject:function(e){var t=this.getCenter();return this._centerObject(e,new fabric.Point(t.left,t.top)),this.renderAll(),this},_centerObject:function(e,t){return e.setPositionByOrigin(t,"center","center"),this},toDatalessJSON:function(e){return this.toDatalessObject(e)},toObject:function(e){return this._toObjectMethod("toObject",e)},toDatalessObject:function(e){return this._toObjectMethod("toDatalessObject",e)},_toObjectMethod:function(t,n){var r=this.getActiveGroup();r&&this.discardActiveGroup();var i={objects:this._toObjects(t,n)};return e(i,this.__serializeBgOverlay()),fabric.util.populateWithProperties(this,i,n),r&&(this.setActiveGroup(new fabric.Group(r.getObjects(),{originX:"center",originY:"center"})),r.forEachObject(function(e){e.set("active",!0)}),this._currentTransform&&(this._currentTransform.target=this.getActiveGroup())),i},_toObjects:function(e,t){return this.getObjects().map(function(n){return this._toObject(n,e,t)},this)},_toObject:function(e,t,n){var r;this.includeDefaultValues||(r=e.includeDefaultValues,e.includeDefaultValues=!1);var i=e[t](n);return this.includeDefaultValues||(e.includeDefaultValues=r),i},__serializeBgOverlay:function(){var e={background:this.backgroundColor&&this.backgroundColor.toObject?this.backgroundColor.toObject():this.backgroundColor};return this.overlayColor&&(e.overlay=this.overlayColor.toObject?this.overlayColor.toObject():this.overlayColor),this.backgroundImage&&(e.backgroundImage=this.backgroundImage.toObject()),this.overlayImage&&(e.overlayImage=this.overlayImage.toObject()),e},svgViewportTransformation:!0,toSVG:function(e,t){e||(e={});var n=[];return this._setSVGPreamble(n,e),this._setSVGHeader(n,e),this._setSVGBgOverlayColor(n,"backgroundColor"),this._setSVGBgOverlayImage(n,"backgroundImage"),this._setSVGObjects(n,t),this._setSVGBgOverlayColor(n,"overlayColor"),this._setSVGBgOverlayImage(n,"overlayImage"),n.push("</svg>"),n.join("")},_setSVGPreamble:function(e,t){t.suppressPreamble||e.push('<?xml version="1.0" encoding="',t.encoding||"UTF-8",'" standalone="no" ?>','<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ','"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n')},_setSVGHeader:function(e,t){var n,r,i;t.viewBox?(n=t.viewBox.width,r=t.viewBox.height):(n=this.width,r=this.height,this.svgViewportTransformation||(i=this.viewportTransform,n/=i[0],r/=i[3])),e.push("<svg ",'xmlns="http://www.w3.org/2000/svg" ','xmlns:xlink="http://www.w3.org/1999/xlink" ','version="1.1" ','width="',n,'" ','height="',r,'" ',this.backgroundColor&&!this.backgroundColor.toLive?'style="background-color: '+this.backgroundColor+'" ':null,t.viewBox?'viewBox="'+t.viewBox.x+" "+t.viewBox.y+" "+t.viewBox.width+" "+t.viewBox.height+'" ':null,'xml:space="preserve">',"<desc>Created with Fabric.js ",fabric.version,"</desc>","<defs>",fabric.createSVGFontFacesMarkup(this.getObjects()),fabric.createSVGRefElementsMarkup(this),"</defs>")},_setSVGObjects:function(e,t){var n=this.getActiveGroup();n&&this.discardActiveGroup();for(var r=0,i=this.getObjects(),s=i.length;r<s;r++)e.push(i[r].toSVG(t));n&&(this.setActiveGroup(new fabric.Group(n.getObjects())),n.forEachObject(function(e){e.set("active",!0)}))},_setSVGBgOverlayImage:function(e,t){this[t]&&this[t].toSVG&&e.push(this[t].toSVG())},_setSVGBgOverlayColor:function(e,t){this[t]&&this[t].source?e.push('<rect x="',this[t].offsetX,'" y="',this[t].offsetY,'" ','width="',this[t].repeat==="repeat-y"||this[t].repeat==="no-repeat"?this[t].source.width:this.width,'" height="',this[t].repeat==="repeat-x"||this[t].repeat==="no-repeat"?this[t].source.height:this.height,'" fill="url(#'+t+'Pattern)"',"></rect>"):this[t]&&t==="overlayColor"&&e.push('<rect x="0" y="0" ','width="',this.width,'" height="',this.height,'" fill="',this[t],'"',"></rect>")},sendToBack:function(e){return n(this._objects,e),this._objects.unshift(e),this.renderAll&&this.renderAll()},bringToFront:function(e){return n(this._objects,e),this._objects.push(e),this.renderAll&&this.renderAll()},sendBackwards:function(e,t){var r=this._objects.indexOf(e);if(r!==0){var i=this._findNewLowerIndex(e,r,t);n(this._objects,e),this._objects.splice(i,0,e),this.renderAll&&this.renderAll()}return this},_findNewLowerIndex:function(e,t,n){var r;if(n){r=t;for(var i=t-1;i>=0;--i){var s=e.intersectsWithObject(this._objects[i])||e.isContainedWithinObject(this._objects
[i])||this._objects[i].isContainedWithinObject(e);if(s){r=i;break}}}else r=t-1;return r},bringForward:function(e,t){var r=this._objects.indexOf(e);if(r!==this._objects.length-1){var i=this._findNewUpperIndex(e,r,t);n(this._objects,e),this._objects.splice(i,0,e),this.renderAll&&this.renderAll()}return this},_findNewUpperIndex:function(e,t,n){var r;if(n){r=t;for(var i=t+1;i<this._objects.length;++i){var s=e.intersectsWithObject(this._objects[i])||e.isContainedWithinObject(this._objects[i])||this._objects[i].isContainedWithinObject(e);if(s){r=i;break}}}else r=t+1;return r},moveTo:function(e,t){return n(this._objects,e),this._objects.splice(t,0,e),this.renderAll&&this.renderAll()},dispose:function(){return this.clear(),this.interactive&&this.removeListeners(),this},toString:function(){return"#<fabric.Canvas ("+this.complexity()+"): "+"{ objects: "+this.getObjects().length+" }>"}}),e(fabric.StaticCanvas.prototype,fabric.Observable),e(fabric.StaticCanvas.prototype,fabric.Collection),e(fabric.StaticCanvas.prototype,fabric.DataURLExporter),e(fabric.StaticCanvas,{EMPTY_JSON:'{"objects": [], "background": "white"}',supports:function(e){var t=fabric.util.createCanvasElement();if(!t||!t.getContext)return null;var n=t.getContext("2d");if(!n)return null;switch(e){case"getImageData":return typeof n.getImageData!="undefined";case"setLineDash":return typeof n.setLineDash!="undefined";case"toDataURL":return typeof t.toDataURL!="undefined";case"toDataURLWithQuality":try{return t.toDataURL("image/jpeg",0),!0}catch(r){}return!1;default:return null}}}),fabric.StaticCanvas.prototype.toJSON=fabric.StaticCanvas.prototype.toObject}(),fabric.BaseBrush=fabric.util.createClass({color:"rgb(0, 0, 0)",width:1,shadow:null,strokeLineCap:"round",strokeLineJoin:"round",setShadow:function(e){return this.shadow=new fabric.Shadow(e),this},_setBrushStyles:function(){var e=this.canvas.contextTop;e.strokeStyle=this.color,e.lineWidth=this.width,e.lineCap=this.strokeLineCap,e.lineJoin=this.strokeLineJoin},_setShadow:function(){if(!this.shadow)return;var e=this.canvas.contextTop;e.shadowColor=this.shadow.color,e.shadowBlur=this.shadow.blur,e.shadowOffsetX=this.shadow.offsetX,e.shadowOffsetY=this.shadow.offsetY},_resetShadow:function(){var e=this.canvas.contextTop;e.shadowColor="",e.shadowBlur=e.shadowOffsetX=e.shadowOffsetY=0}}),function(){fabric.PencilBrush=fabric.util.createClass(fabric.BaseBrush,{initialize:function(e){this.canvas=e,this._points=[]},onMouseDown:function(e){this._prepareForDrawing(e),this._captureDrawingPath(e),this._render()},onMouseMove:function(e){this._captureDrawingPath(e),this.canvas.clearContext(this.canvas.contextTop),this._render()},onMouseUp:function(){this._finalizeAndAddPath()},_prepareForDrawing:function(e){var t=new fabric.Point(e.x,e.y);this._reset(),this._addPoint(t),this.canvas.contextTop.moveTo(t.x,t.y)},_addPoint:function(e){this._points.push(e)},_reset:function(){this._points.length=0,this._setBrushStyles(),this._setShadow()},_captureDrawingPath:function(e){var t=new fabric.Point(e.x,e.y);this._addPoint(t)},_render:function(){var e=this.canvas.contextTop,t=this.canvas.viewportTransform,n=this._points[0],r=this._points[1];e.save(),e.transform(t[0],t[1],t[2],t[3],t[4],t[5]),e.beginPath(),this._points.length===2&&n.x===r.x&&n.y===r.y&&(n.x-=.5,r.x+=.5),e.moveTo(n.x,n.y);for(var i=1,s=this._points.length;i<s;i++){var o=n.midPointFrom(r);e.quadraticCurveTo(n.x,n.y,o.x,o.y),n=this._points[i],r=this._points[i+1]}e.lineTo(n.x,n.y),e.stroke(),e.restore()},convertPointsToSVGPath:function(e){var t=[],n=new fabric.Point(e[0].x,e[0].y),r=new fabric.Point(e[1].x,e[1].y);t.push("M ",e[0].x," ",e[0].y," ");for(var i=1,s=e.length;i<s;i++){var o=n.midPointFrom(r);t.push("Q ",n.x," ",n.y," ",o.x," ",o.y," "),n=new fabric.Point(e[i].x,e[i].y),i+1<e.length&&(r=new fabric.Point(e[i+1].x,e[i+1].y))}return t.push("L ",n.x," ",n.y," "),t},createPath:function(e){var t=new fabric.Path(e,{fill:null,stroke:this.color,strokeWidth:this.width,strokeLineCap:this.strokeLineCap,strokeLineJoin:this.strokeLineJoin,originX:"center",originY:"center"});return this.shadow&&(this.shadow.affectStroke=!0,t.setShadow(this.shadow)),t},_finalizeAndAddPath:function(){var e=this.canvas.contextTop;e.closePath();var t=this.convertPointsToSVGPath(this._points).join("");if(t==="M 0 0 Q 0 0 0 0 L 0 0"){this.canvas.renderAll();return}var n=this.createPath(t);this.canvas.add(n),n.setCoords(),this.canvas.clearContext(this.canvas.contextTop),this._resetShadow(),this.canvas.renderAll(),this.canvas.fire("path:created",{path:n})}})}(),fabric.CircleBrush=fabric.util.createClass(fabric.BaseBrush,{width:10,initialize:function(e){this.canvas=e,this.points=[]},drawDot:function(e){var t=this.addPoint(e),n=this.canvas.contextTop,r=this.canvas.viewportTransform;n.save(),n.transform(r[0],r[1],r[2],r[3],r[4],r[5]),n.fillStyle=t.fill,n.beginPath(),n.arc(t.x,t.y,t.radius,0,Math.PI*2,!1),n.closePath(),n.fill(),n.restore()},onMouseDown:function(e){this.points.length=0,this.canvas.clearContext(this.canvas.contextTop),this._setShadow(),this.drawDot(e)},onMouseMove:function(e){this.drawDot(e)},onMouseUp:function(){var e=this.canvas.renderOnAddRemove;this.canvas.renderOnAddRemove=!1;var t=[];for(var n=0,r=this.points.length;n<r;n++){var i=this.points[n],s=new fabric.Circle({radius:i.radius,left:i.x,top:i.y,originX:"center",originY:"center",fill:i.fill});this.shadow&&s.setShadow(this.shadow),t.push(s)}var o=new fabric.Group(t,{originX:"center",originY:"center"});o.canvas=this.canvas,this.canvas.add(o),this.canvas.fire("path:created",{path:o}),this.canvas.clearContext(this.canvas.contextTop),this._resetShadow(),this.canvas.renderOnAddRemove=e,this.canvas.renderAll()},addPoint:function(e){var t=new fabric.Point(e.x,e.y),n=fabric.util.getRandomInt(Math.max(0,this.width-20),this.width+20)/2,r=(new fabric.Color(this.color)).setAlpha(fabric.util.getRandomInt(0,100)/100).toRgba();return t.radius=n,t.fill=r,this.points.push(t),t}}),fabric.SprayBrush=fabric.util.createClass(fabric.BaseBrush,{width:10,density:20,dotWidth:1,dotWidthVariance:1,randomOpacity:!1,optimizeOverlapping:!0,initialize:function(e){this.canvas=e,this.sprayChunks=[]},onMouseDown:function(e){this.sprayChunks.length=0,this.canvas.clearContext(this.canvas.contextTop),this._setShadow(),this.addSprayChunk(e),this.render()},onMouseMove:function(e){this.addSprayChunk(e),this.render()},onMouseUp:function(){var e=this.canvas.renderOnAddRemove;this.canvas.renderOnAddRemove=!1;var t=[];for(var n=0,r=this.sprayChunks.length;n<r;n++){var i=this.sprayChunks[n];for(var s=0,o=i.length;s<o;s++){var u=new fabric.Rect({width:i[s].width,height:i[s].width,left:i[s].x+1,top:i[s].y+1,originX:"center",originY:"center",fill:this.color});this.shadow&&u.setShadow(this.shadow),t.push(u)}}this.optimizeOverlapping&&(t=this._getOptimizedRects(t));var a=new fabric.Group(t,{originX:"center",originY:"center"});a.canvas=this.canvas,this.canvas.add(a),this.canvas.fire("path:created",{path:a}),this.canvas.clearContext(this.canvas.contextTop),this._resetShadow(),this.canvas.renderOnAddRemove=e,this.canvas.renderAll()},_getOptimizedRects:function(e){var t={},n;for(var r=0,i=e.length;r<i;r++)n=e[r].left+""+e[r].top,t[n]||(t[n]=e[r]);var s=[];for(n in t)s.push(t[n]);return s},render:function(){var e=this.canvas.contextTop;e.fillStyle=this.color;var t=this.canvas.viewportTransform;e.save(),e.transform(t[0],t[1],t[2],t[3],t[4],t[5]);for(var n=0,r=this.sprayChunkPoints.length;n<r;n++){var i=this.sprayChunkPoints[n];typeof i.opacity!="undefined"&&(e.globalAlpha=i.opacity),e.fillRect(i.x,i.y,i.width,i.width)}e.restore()},addSprayChunk:function(e){this.sprayChunkPoints=[];var t,n,r,i=this.width/2;for(var s=0;s<this.density;s++){t=fabric.util.getRandomInt(e.x-i,e.x+i),n=fabric.util.getRandomInt(e.y-i,e.y+i),this.dotWidthVariance?r=fabric.util.getRandomInt(Math.max(1,this.dotWidth-this.dotWidthVariance),this.dotWidth+this.dotWidthVariance):r=this.dotWidth;var o=new fabric.Point(t,n);o.width=r,this.randomOpacity&&(o.opacity=fabric.util.getRandomInt(0,100)/100),this.sprayChunkPoints.push(o)}this.sprayChunks.push(this.sprayChunkPoints)}}),fabric.PatternBrush=fabric.util.createClass(fabric.PencilBrush,{getPatternSrc:function(){var e=20,t=5,n=fabric.document.createElement("canvas"),r=n.getContext("2d");return n.width=n.height=e+t,r.fillStyle=this.color,r.beginPath(),r.arc(e/2,e/2,e/2,0,Math.PI*2,!1),r.closePath(),r.fill(),n},getPatternSrcFunction:function(){return String(this.getPatternSrc).replace("this.color",'"'+this.color+'"')},getPattern:function(){return this.canvas.contextTop.createPattern(this.source||this.getPatternSrc(),"repeat")},_setBrushStyles:function(){this.callSuper("_setBrushStyles"),this.canvas.contextTop.strokeStyle=this.getPattern()},createPath:function(e){var t=this.callSuper("createPath",e);return t.stroke=new fabric.Pattern({source:this.source||this.getPatternSrcFunction()}),t}}),function(){var e=fabric.util.getPointer,t=fabric.util.degreesToRadians,n=fabric.util.radiansToDegrees,r=Math.atan2,i=Math.abs,s=.5;fabric.Canvas=fabric.util.createClass(fabric.StaticCanvas,{initialize:function(e,t){t||(t={}),this._initStatic(e,t),this._initInteractive(),this._createCacheCanvas(),fabric.Canvas.activeInstance=this},uniScaleTransform:!1,centeredScaling:!1,centeredRotation:!1,interactive:!0,selection:!0,selectionColor:"rgba(100, 100, 255, 0.3)",selectionDashArray:[],selectionBorderColor:"rgba(255, 255, 255, 0.3)",selectionLineWidth:1,hoverCursor:"move",moveCursor:"move",defaultCursor:"default",freeDrawingCursor:"crosshair",rotationCursor:"crosshair",containerClass:"canvas-container",perPixelTargetFind:!1,targetFindTolerance:0,skipTargetFind:!1,_initInteractive:function(){this._currentTransform=null,this._groupSelector=null,this._initWrapperElement(),this._createUpperCanvas(),this._initEventListeners(),this.freeDrawingBrush=fabric.PencilBrush&&new fabric.PencilBrush(this),this.calcOffset()},_resetCurrentTransform:function(e){var t=this._currentTransform;t.target.set({scaleX:t.original.scaleX,scaleY:t.original.scaleY,left:t.original.left,top:t.original.top}),this._shouldCenterTransform(e,t.target)?t.action==="rotate"?this._setOriginToCenter(t.target):(t.originX!=="center"&&(t.originX==="right"?t.mouseXSign=-1:t.mouseXSign=1),t.originY!=="center"&&(t.originY==="bottom"?t.mouseYSign=-1:t.mouseYSign=1),t.originX="center",t.originY="center"):(t.originX=t.original.originX,t.originY=t.original.originY)},containsPoint:function(e,t){var n=this.getPointer(e,!0),r=this._normalizePointer(t,n);return t.containsPoint(r)||t._findTargetCorner(n)},_normalizePointer:function(e,t){var n=this.getActiveGroup(),r=t.x,i=t.y,s=n&&e.type!=="group"&&n.contains(e),o;return s&&(o=new fabric.Point(n.left,n.top),o=fabric.util.transformPoint(o,this.viewportTransform,!0),r-=o.x,i-=o.y),{x:r,y:i}},isTargetTransparent:function(e,t,n){var r=e.hasBorders,i=e.transparentCorners;e.hasBorders=e.transparentCorners=!1,this._draw(this.contextCache,e),e.hasBorders=r,e.transparentCorners=i;var s=fabric.util.isTransparent(this.contextCache,t,n,this.targetFindTolerance);return this.clearContext(this.contextCache),s},_shouldClearSelection:function(e,t){var n=this.getActiveGroup(),r=this.getActiveObject();return!t||t&&n&&!n.contains(t)&&n!==t&&!e.shiftKey||t&&!t.evented||t&&!t.selectable&&r&&r!==t},_shouldCenterTransform:function(e,t){if(!t)return;var n=this._currentTransform,r;return n.action==="scale"||n.action==="scaleX"||n.action==="scaleY"?r=this.centeredScaling||t.centeredScaling:n.action==="rotate"&&(r=this.centeredRotation||t.centeredRotation),r?!e.altKey:e.altKey},_getOriginFromCorner:function(e,t){var n={x:e.originX,y:e.originY};if(t==="ml"||t==="tl"||t==="bl")n.x="right";else if(t==="mr"||t==="tr"||t==="br")n.x="left";if(t==="tl"||t==="mt"||t==="tr")n.y="bottom";else if(t==="bl"||t==="mb"||t==="br")n.y="top";return n},_getActionFromCorner:function(e,t){var n="drag";return t&&(n=t==="ml"||t==="mr"?"scaleX":t==="mt"||t==="mb"?"scaleY":t==="mtr"?"rotate":"scale"),n},_setupCurrentTransform:function(e,n){if(!n)return;var r=this.getPointer(e),i=n._findTargetCorner(this.getPointer(e,!0)),s=this._getActionFromCorner(n,i),o=this._getOriginFromCorner(n,i);this._currentTransform={target:n,action:s,scaleX:n.scaleX,scaleY:n.scaleY,offsetX:r.x-n.left,offsetY:r.y-n.top,originX:o.x,originY:o.y,ex:r.x,ey:r.y,left:n.left,top:n.top,theta:t(n.angle),width:n.width*n.scaleX,mouseXSign:1,mouseYSign:1},this._currentTransform.original={left:n.left,top:n.top,scaleX:n.scaleX,scaleY:n.scaleY,originX:o.x,originY:o.y},this._resetCurrentTransform(e)},_translateObject:function(e,t){var n=this._currentTransform.target;n.get("lockMovementX")||n.set("left",e-this._currentTransform.offsetX),n.get("lockMovementY")||n.set("top",t-this._currentTransform.offsetY)},_scaleObject:function(e,t,n){var r=this._currentTransform,i=r.target,s=i.get("lockScalingX"),o=i.get("lockScalingY"),u=i.get("lockScalingFlip");if(s&&o)return;var a=i.translateToOriginPoint(i.getCenterPoint(),r.originX,r.originY),f=i.toLocalPoint(new fabric.Point(e,t),r.originX,r.originY);this._setLocalMouse(f,r),this._setObjectScale(f,r,s,o,n,u),i.setPositionByOrigin(a,r.originX,r.originY)},_setObjectScale:function(e,t,n,r,i,s){var o=t.target,u=!1,a=!1,f=o.stroke?o.strokeWidth:0;t.newScaleX=e.x/(o.width+f/2),t.newScaleY=e.y/(o.height+f/2),s&&t.newScaleX<=0&&t.newScaleX<o.scaleX&&(u=!0),s&&t.newScaleY<=0&&t.newScaleY<o.scaleY&&(a=!0),i==="equally"&&!n&&!r?u||a||this._scaleObjectEqually(e,o,t):i?i==="x"&&!o.get("lockUniScaling")?u||n||o.set("scaleX",t.newScaleX):i==="y"&&!o.get("lockUniScaling")&&(a||r||o.set("scaleY",t.newScaleY)):(u||n||o.set("scaleX",t.newScaleX),a||r||o.set("scaleY",t.newScaleY)),u||a||this._flipObject(t,i)},_scaleObjectEqually:function(e,t,n){var r=e.y+e.x,i=t.stroke?t.strokeWidth:0,s=(t.height+i/2)*n.original.scaleY+(t.width+i/2)*n.original.scaleX;n.newScaleX=n.original.scaleX*r/s,n.newScaleY=n.original.scaleY*r/s,t.set("scaleX",n.newScaleX),t.set("scaleY",n.newScaleY)},_flipObject:function(e,t){e.newScaleX<0&&t!=="y"&&(e.originX==="left"?e.originX="right":e.originX==="right"&&(e.originX="left")),e.newScaleY<0&&t!=="x"&&(e.originY==="top"?e.originY="bottom":e.originY==="bottom"&&(e.originY="top"))},_setLocalMouse:function(e,t){var n=t.target;t.originX==="right"?e.x*=-1:t.originX==="center"&&(e.x*=t.mouseXSign*2,e.x<0&&(t.mouseXSign=-t.mouseXSign)),t.originY==="bottom"?e.y*=-1:t.originY==="center"&&(e.y*=t.mouseYSign*2,e.y<0&&(t.mouseYSign=-t.mouseYSign)),i(e.x)>n.padding?e.x<0?e.x+=n.padding:e.x-=n.padding:e.x=0,i(e.y)>n.padding?e.y<0?e.y+=n.padding:e.y-=n.padding:e.y=0},_rotateObject:function(e,t){var i=this._currentTransform;if(i.target.get("lockRotation"))return;var s=r(i.ey-i.top,i.ex-i.left),o=r(t-i.top,e-i.left),u=n(o-s+i.theta);u<0&&(u=360+u),i.target.angle=u%360},setCursor:function(e){this.upperCanvasEl.style.cursor=e},_resetObjectTransform:function(e){e.scaleX=1,e.scaleY=1,e.setAngle(0)},_drawSelection:function(){var e=this.contextTop,t=this._groupSelector,n=t.left,r=t.top,o=i(n),u=i(r);e.fillStyle=this.selectionColor,e.fillRect(t.ex-(n>0?0:-n),t.ey-(r>0?0:-r),o,u),e.lineWidth=this.selectionLineWidth,e.strokeStyle=this.selectionBorderColor;if(this.selectionDashArray.length>1){var a=t.ex+s-(n>0?0:o),f=t.ey+s-(r>0?0:u);e.beginPath(),fabric.util.drawDashedLine(e,a,f,a+o,f,this.selectionDashArray),fabric.util.drawDashedLine(e,a,f+u-1,a+o,f+u-1,this.selectionDashArray),fabric.util.drawDashedLine(e,a,f,a,f+u,this.selectionDashArray),fabric.util.drawDashedLine(e,a+o-1,f,a+o-1,f+u,this.selectionDashArray),e.closePath(),e.stroke()}else e.strokeRect(t.ex+s-(n>0?0:o),t.ey+s-(r>0?0:u),o,u)},_isLastRenderedObject:function(e){return this.controlsAboveOverlay&&this.lastRenderedObjectWithControlsAboveOverlay&&this.lastRenderedObjectWithControlsAboveOverlay.visible&&this.containsPoint(e,this.lastRenderedObjectWithControlsAboveOverlay)&&this.lastRenderedObjectWithControlsAboveOverlay._findTargetCorner(this.getPointer(e,!0))},findTarget:function(e,t){if(this.skipTargetFind)return;if(this._isLastRenderedObject(e))return this.lastRenderedObjectWithControlsAboveOverlay;var n=this.getActiveGroup();if(n&&!t&&this.containsPoint(e,n))return n;var r=this._searchPossibleTargets(e);return this._fireOverOutEvents(r),r},_fireOverOutEvents:function(e){e?this._hoveredTarget!==e&&(this.fire("mouse:over",{target:e}),e.fire("mouseover"),this._hoveredTarget&&(this.fire("mouse:out",{target:this._hoveredTarget}),this._hoveredTarget.fire("mouseout")),this._hoveredTarget=e):this._hoveredTarget&&(this.fire("mouse:out",{target:this._hoveredTarget}),this._hoveredTarget.fire("mouseout"),this._hoveredTarget=null)},_checkTarget:function(e,t,n){if(t&&t.visible&&t.evented&&this.containsPoint(e,t)){if(!this.perPixelTargetFind&&!t.perPixelTargetFind||!!t.isEditing)return!0;var r=this.isTargetTransparent(t,n.x,n.y);if(!r)return!0}},_searchPossibleTargets:function(e){var t,n=this.getPointer(e,!0),r=this._objects.length;while(r--)if(this._checkTarget(e,this._objects[r],n)){this.relatedTarget=this._objects[r],t=this._objects[r];break}return t},getPointer:function(t,n,r){r||(r=this.upperCanvasEl);var i=e(t,r),s=r.getBoundingClientRect(),o=s.width||0,u=s.height||0,a;if(!o||!u)"top"in s&&"bottom"in s&&(u=Math.abs(s.top-s.bottom)),"right"in s&&"left"in s&&(o=Math.abs(s.right-s.left));return this.calcOffset(),i.x=i.x-this._offset.left,i.y=i.y-this._offset.top,n||(i=fabric.util.transformPoint(i,fabric.util.invertTransform(this.viewportTransform))),o===0||u===0?a={width:1,height:1}:a={width:r.width/o,height:r.height/u},{x:i.x*a.width,y:i.y*a.height}},_createUpperCanvas:function(){var e=this.lowerCanvasEl.className.replace(/\s*lower-canvas\s*/,"");this.upperCanvasEl=this._createCanvasElement(),fabric.util.addClass(this.upperCanvasEl,"upper-canvas "+e),this.wrapperEl.appendChild(this.upperCanvasEl),this._copyCanvasStyle(this.lowerCanvasEl,this.upperCanvasEl),this._applyCanvasStyle(this.upperCanvasEl),this.contextTop=this.upperCanvasEl.getContext("2d")},_createCacheCanvas:function(){this.cacheCanvasEl=this._createCanvasElement(),this.cacheCanvasEl.setAttribute("width",this.width),this.cacheCanvasEl.setAttribute("height",this.height),this.contextCache=this.cacheCanvasEl.getContext("2d")},_initWrapperElement:function(){this.wrapperEl=fabric.util.wrapElement(this.lowerCanvasEl,"div",{"class":this.containerClass}),fabric.util.setStyle(this.wrapperEl,{width:this.getWidth()+"px",height:this.getHeight()+"px",position:"relative"}),fabric.util.makeElementUnselectable(this.wrapperEl)},_applyCanvasStyle:function(e){var t=this.getWidth()||e.width,n=this.getHeight()||e.height;fabric.util.setStyle(e,{position:"absolute",width:t+"px",height:n+"px",left:0,top:0}),e.width=t,e.height=n,fabric.util.makeElementUnselectable(e)},_copyCanvasStyle:function(e,t){t.style.cssText=e.style.cssText},getSelectionContext:function(){return this.contextTop},getSelectionElement:function(){return this.upperCanvasEl},_setActiveObject:function(e){this._activeObject&&this._activeObject.set("active",!1),this._activeObject=e,e.set("active",!0)},setActiveObject:function(e,t){return this._setActiveObject(e),this.renderAll(),this.fire("object:selected",{target:e,e:t}),e.fire("selected",{e:t}),this},getActiveObject:function(){return this._activeObject},_discardActiveObject:function(){this._activeObject&&this._activeObject.set("active",!1),this._activeObject=null},discardActiveObject:function(e){return this._discardActiveObject(),this.renderAll(),this.fire("selection:cleared",{e:e}),this},_setActiveGroup:function(e){this._activeGroup=e,e&&e.set("active",!0)},setActiveGroup:function(e,t){return this._setActiveGroup(e),e&&(this.fire("object:selected",{target:e,e:t}),e.fire("selected",{e:t})),this},getActiveGroup:function(){return this._activeGroup},_discardActiveGroup:function(){var e=this.getActiveGroup();e&&e.destroy(),this.setActiveGroup(null)},discardActiveGroup:function(e){return this._discardActiveGroup(),this.fire("selection:cleared",{e:e}),this},deactivateAll:function(){var e=this.getObjects(),t=0,n=e.length;for(;t<n;t++)e[t].set("active",!1);return this._discardActiveGroup(),this._discardActiveObject(),this},deactivateAllWithDispatch:function(e){var t=this.getActiveGroup()||this.getActiveObject();return t&&this.fire("before:selection:cleared",{target:t,e:e}),this.deactivateAll(),t&&this.fire("selection:cleared",{e:e}),this},drawControls:function(e){var t=this.getActiveGroup();t?this._drawGroupControls(e,t):this._drawObjectsControls(e)},_drawGroupControls:function(e,t){t._renderControls(e)},_drawObjectsControls:function(e){for(var t=0,n=this._objects.length;t<n;++t){if(!this._objects[t]||!this._objects[t].active)continue;this._objects[t]._renderControls(e),this.lastRenderedObjectWithControlsAboveOverlay=this._objects[t]}}});for(var o in fabric.StaticCanvas)o!=="prototype"&&(fabric.Canvas[o]=fabric.StaticCanvas[o]);fabric.isTouchSupported&&(fabric.Canvas.prototype._setCursorFromEvent=function(){}),fabric.Element=fabric.Canvas}(),function(){var e={mt:0,tr:1,mr:2,br:3,mb:4,bl:5,ml:6,tl:7},t=fabric.util.addListener,n=fabric.util.removeListener;fabric.util.object.extend(fabric.Canvas.prototype,{cursorMap:["n-resize","ne-resize","e-resize","se-resize","s-resize","sw-resize","w-resize","nw-resize"],_initEventListeners:function(){this._bindEvents(),t(fabric.window,"resize",this._onResize),t(this.upperCanvasEl,"mousedown",this._onMouseDown),t(this.upperCanvasEl,"mousemove",this._onMouseMove),t(this.upperCanvasEl,"mousewheel",this._onMouseWheel),t(this.upperCanvasEl,"touchstart",this._onMouseDown),t(this.upperCanvasEl,"touchmove",this._onMouseMove),typeof Event!="undefined"&&"add"in Event&&(Event.add(this.upperCanvasEl,"gesture",this._onGesture),Event.add(this.upperCanvasEl,"drag",this._onDrag),Event.add(this.upperCanvasEl,"orientation",this._onOrientationChange),Event.add(this.upperCanvasEl,"shake",this._onShake),Event.add(this.upperCanvasEl,"longpress",this._onLongPress))},_bindEvents:function(){this._onMouseDown=this._onMouseDown.bind(this),this._onMouseMove=this._onMouseMove.bind(this),this._onMouseUp=this._onMouseUp.bind(this),this._onResize=this._onResize.bind(this),this._onGesture=this._onGesture.bind(this),this._onDrag=this._onDrag.bind(this),this._onShake=this._onShake.bind(this),this._onLongPress=this._onLongPress.bind(this),this._onOrientationChange=this._onOrientationChange.bind(this),this._onMouseWheel=this._onMouseWheel.bind(this)},removeListeners:function(){n(fabric.window,"resize",this._onResize),n(this.upperCanvasEl,"mousedown",this._onMouseDown),n(this.upperCanvasEl,"mousemove",this._onMouseMove),n(this.upperCanvasEl,"mousewheel",this._onMouseWheel),n(this.upperCanvasEl,"touchstart",this._onMouseDown),n(this.upperCanvasEl,"touchmove",this._onMouseMove),typeof Event!="undefined"&&"remove"in Event&&(Event.remove(this.upperCanvasEl,"gesture",this._onGesture),Event.remove(this.upperCanvasEl,"drag",this._onDrag),Event.remove(this.upperCanvasEl,"orientation",this._onOrientationChange),Event.remove(this.upperCanvasEl,"shake",this._onShake),Event.remove(this.upperCanvasEl,"longpress",this._onLongPress))},_onGesture:function(e,t){this.__onTransformGesture&&this.__onTransformGesture(e,t)},_onDrag:function(e,t){this.__onDrag&&this.__onDrag(e,t)},_onMouseWheel:function(e,t){this.__onMouseWheel&&this.__onMouseWheel(e,t)},_onOrientationChange:function(e,t){this.__onOrientationChange&&this.__onOrientationChange(e,t)},_onShake:function(e,t){this.__onShake&&this.__onShake(e,t)},_onLongPress:function(e,t){this.__onLongPress&&this.__onLongPress(e,t)},_onMouseDown:function(e){this.__onMouseDown(e),t(fabric.document,"touchend",this._onMouseUp),t(fabric.document,"touchmove",this._onMouseMove),n(this.upperCanvasEl,"mousemove",this._onMouseMove),n(this.upperCanvasEl,"touchmove",this._onMouseMove),e.type==="touchstart"?n(this.upperCanvasEl,"mousedown",this._onMouseDown):(t(fabric.document,"mouseup",this._onMouseUp),t(fabric.document,"mousemove",this._onMouseMove))},_onMouseUp:function(e){this.__onMouseUp(e),n(fabric.document,"mouseup",this._onMouseUp),n(fabric.document,"touchend",this._onMouseUp),n(fabric.document,"mousemove",this._onMouseMove),n(fabric.document,"touchmove",this._onMouseMove),t(this.upperCanvasEl,"mousemove",this._onMouseMove),t(this.upperCanvasEl,"touchmove",this._onMouseMove);if(e.type==="touchend"){var r=this;setTimeout(function(){t(r.upperCanvasEl,"mousedown",r._onMouseDown)},400)}},_onMouseMove:function(e){!this.allowTouchScrolling&&e.preventDefault&&e.preventDefault(),this.__onMouseMove(e)},_onResize:function(){this.calcOffset()},_shouldRender:function(e,t){var n=this.getActiveGroup()||this.getActiveObject();return!!(e&&(e.isMoving||e!==n)||!e&&!!n||!e&&!n&&!this._groupSelector||t&&this._previousPointer&&this.selection&&(t.x!==this._previousPointer.x||t.y!==this._previousPointer.y))},__onMouseUp:function(e){var t;if(this.isDrawingMode&&this._isCurrentlyDrawing){this._onMouseUpInDrawingMode(e);return}this._currentTransform?(this._finalizeCurrentTransform(),t=this._currentTransform.target):t=this.findTarget(e,!0);var n=this._shouldRender(t,this.getPointer(e));this._maybeGroupObjects(e),t&&(t.isMoving=!1),n&&this.renderAll(),this._handleCursorAndEvent(e,t)},_handleCursorAndEvent:function(e,t){this._setCursorFromEvent(e,t);var n=this;setTimeout(function(){n._setCursorFromEvent(e,t)},50),this.fire("mouse:up",{target:t,e:e}),t&&t.fire("mouseup",{e:e})},_finalizeCurrentTransform:function(){var e=this._currentTransform,t=e.target;t._scaling&&(t._scaling=!1),t.setCoords(),this.stateful&&t.hasStateChanged()&&(this.fire("object:modified",{target:t}),t.fire("modified")),this._restoreOriginXY(t)},_restoreOriginXY:function(e){if(this._previousOriginX&&this._previousOriginY){var t=e.translateToOriginPoint(e.getCenterPoint(),this._previousOriginX,this._previousOriginY);e.originX=this._previousOriginX,e.originY=this._previousOriginY,e.left=t.x,e.top=t.y,this._previousOriginX=null,this._previousOriginY=null}},_onMouseDownInDrawingMode:function(e){this._isCurrentlyDrawing=!0,this.discardActiveObject(e).renderAll(),this.clipTo&&fabric.util.clipContext(this,this.contextTop);var t=fabric.util.invertTransform(this.viewportTransform),n=fabric.util.transformPoint(this.getPointer(e,!0),t);this.freeDrawingBrush.onMouseDown(n),this.fire("mouse:down",{e:e});var r=this.findTarget(e);typeof r!="undefined"&&r.fire("mousedown",{e:e,target:r})},_onMouseMoveInDrawingMode:function(e){if(this._isCurrentlyDrawing){var t=fabric.util.invertTransform(this.viewportTransform),n=fabric.util.transformPoint(this.getPointer(e,!0),t);this.freeDrawingBrush.onMouseMove(n)}this.setCursor(this.freeDrawingCursor),this.fire("mouse:move",{e:e});var r=this.findTarget(e);typeof r!="undefined"&&r.fire("mousemove",{e:e,target:r})},_onMouseUpInDrawingMode:function(e){this._isCurrentlyDrawing=!1,this.clipTo&&this.contextTop.restore(),this.freeDrawingBrush.onMouseUp(),this.fire("mouse:up",{e:e});var t=this.findTarget(e);typeof t!="undefined"&&t.fire("mouseup",{e:e,target:t})},__onMouseDown:function(e){var t="which"in e?e.which===1:e.button===1;if(!t&&!fabric.isTouchSupported)return;if(this.isDrawingMode){this._onMouseDownInDrawingMode(e);return}if(this._currentTransform)return;var n=this.findTarget(e),r=this.getPointer(e,!0);this._previousPointer=r;var i=this._shouldRender(n,r),s=this._shouldGroup(e,n);this._shouldClearSelection(e,n)?this._clearSelection(e,n,r):s&&(this._handleGrouping(e,n),n=this.getActiveGroup()),n&&n.selectable&&!s&&(this._beforeTransform(e,n),this._setupCurrentTransform(e,n)),i&&this.renderAll(),this.fire("mouse:down",{target:n,e:e}),n&&n.fire("mousedown",{e:e})},_beforeTransform:function(e,t){var n;this.stateful&&t.saveState(),(n=t._findTargetCorner(this.getPointer(e)))&&this.onBeforeScaleRotate(t),t!==this.getActiveGroup()&&t!==this.getActiveObject()&&(this.deactivateAll(),this.setActiveObject(t,e))},_clearSelection:function(e,t,n){this.deactivateAllWithDispatch(e),t&&t.selectable?this.setActiveObject(t,e):this.selection&&(this._groupSelector={ex:n.x,ey:n.y,top:0,left:0})},_setOriginToCenter:function(e){this._previousOriginX=this._currentTransform.target.originX,this._previousOriginY=this._currentTransform.target.originY;var t=e.getCenterPoint();e.originX="center",e.originY="center",e.left=t.x,e.top=t.y,this._currentTransform.left=e.left,this._currentTransform.top=e.top},_setCenterToOrigin:function(e){var t=e.translateToOriginPoint(e.getCenterPoint(),this._previousOriginX,this._previousOriginY);e.originX=this._previousOriginX,e.originY=this._previousOriginY,e.left=t.x,e.top=t.y,this._previousOriginX=null,this._previousOriginY=null},__onMouseMove:function(e){var t,n;if(this.isDrawingMode){this._onMouseMoveInDrawingMode(e);return}if(typeof e.touches!="undefined"&&e.touches.length>1)return;var r=this._groupSelector;r?(n=this.getPointer(e,!0),r.left=n.x-r.ex,r.top=n.y-r.ey,this.renderTop()):this._currentTransform?this._transformObject(e):(t=this.findTarget(e),!t||t&&!t.selectable?this.setCursor(this.defaultCursor):this._setCursorFromEvent(e,t)),this.fire("mouse:move",{target:t,e:e}),t&&t.fire("mousemove",{e:e})},_transformObject:function(e){var t=this.getPointer(e),n=this._currentTransform;n.reset=!1,n.target.isMoving=!0,this._beforeScaleTransform(e,n),this._performTransformAction(e,n,t),this.renderAll()},_performTransformAction:function(e,t,n){var r=n.x,i=n.y,s=t.target,o=t.action;o==="rotate"?(this._rotateObject(r,i),this._fire("rotating",s,e)):o==="scale"?(this._onScale(e,t,r,i),this._fire("scaling",s,e)):o==="scaleX"?(this._scaleObject(r,i,"x"),this._fire("scaling",s,e)):o==="scaleY"?(this._scaleObject(r,i,"y"),this._fire("scaling",s,e)):(this._translateObject(r,i),this._fire("moving",s,e),this.setCursor(this.moveCursor))},_fire:function(e,t,n){this.fire("object:"+e,{target:t,e:n}),t.fire(e,{e:n})},_beforeScaleTransform:function(e,t){if(t.action==="scale"||t.action==="scaleX"||t.action==="scaleY"){var n=this._shouldCenterTransform(e,t.target);if(n&&(t.originX!=="center"||t.originY!=="center")||!n&&t.originX==="center"&&t.originY==="center")this._resetCurrentTransform(e),t.reset=!0}},_onScale:function(e,t,n,r){(e.shiftKey||this.uniScaleTransform)&&!t.target.get("lockUniScaling")?(t.currentAction="scale",this._scaleObject(n,r)):(!t.reset&&t.currentAction==="scale"&&this._resetCurrentTransform(e,t.target),t.currentAction="scaleEqually",this._scaleObject(n,r,"equally"))},_setCursorFromEvent:function(e,t){if(!t||!t.selectable)return this.setCursor(this.defaultCursor),!1;var n=this.getActiveGroup(),r=t._findTargetCorner&&(!n||!n.contains(t))&&t._findTargetCorner(this.getPointer(e,!0));return r?this._setCornerCursor(r,t):this.setCursor(t.hoverCursor||this.hoverCursor),!0},_setCornerCursor:function(t,n){if(t in e)this.setCursor(this._getRotatedCornerCursor(t,n));else{if(t!=="mtr"||!n.hasRotatingPoint)return this.setCursor(this.defaultCursor),!1;this.setCursor(this.rotationCursor)}},_getRotatedCornerCursor:function(t,n){var r=Math.round(n.getAngle()%360/45);return r<0&&(r+=8),r+=e[t],r%=8,this.cursorMap[r]}})}(),function(){var e=Math.min,t=Math.max;fabric.util.object.extend(fabric.Canvas.prototype,{_shouldGroup:function(e,t){var n=this.getActiveObject();return e.shiftKey&&(this.getActiveGroup()||n&&n!==t)&&this.selection},_handleGrouping:function(e,t){if(t===this.getActiveGroup()){t=this.findTarget(e,!0);if(!t||t.isType("group"))return}this.getActiveGroup()?this._updateActiveGroup(t,e):this._createActiveGroup(t,e),this._activeGroup&&this._activeGroup.saveCoords()},_updateActiveGroup:function(e,t){var n=this.getActiveGroup();if(n.contains(e)){n.removeWithUpdate(e),this._resetObjectTransform(n),e.set("active",!1);if(n.size()===1){this.discardActiveGroup(t),this.setActiveObject(n.item(0));return}}else n.addWithUpdate(e),this._resetObjectTransform(n);this.fire("selection:created",{target:n,e:t}),n.set("active",!0)},_createActiveGroup:function(e,t){if(this._activeObject&&e!==this._activeObject){var n=this._createGroup(e);n.addWithUpdate(),this.setActiveGroup(n),this._activeObject=null,this.fire("selection:created",{target:n,e:t})}e.set("active",!0)},_createGroup:function(e){var t=this.getObjects(),n=t.indexOf(this._activeObject)<t.indexOf(e),r=n?[this._activeObject,e]:[e,this._activeObject];return new fabric.Group(r,{canvas:this})},_groupSelectedObjects:function(e){var t=this._collectObjects();t.length===1?this.setActiveObject(t[0],e):t.length>1&&(t=new fabric.Group(t.reverse(),{canvas:this}),t.addWithUpdate(),this.setActiveGroup(t,e),t.saveCoords(),this.fire("selection:created",{target:t}),this.renderAll())},_collectObjects:function(){var n=[],r,i=this._groupSelector.ex,s=this._groupSelector.ey,o=i+this._groupSelector.left,u=s+this._groupSelector.top,a=new fabric.Point(e(i,o),e(s,u)),f=new fabric.Point(t(i,o),t(s,u)),l=i===o&&s===u
;for(var c=this._objects.length;c--;){r=this._objects[c];if(!r||!r.selectable||!r.visible)continue;if(r.intersectsWithRect(a,f)||r.isContainedWithinRect(a,f)||r.containsPoint(a)||r.containsPoint(f)){r.set("active",!0),n.push(r);if(l)break}}return n},_maybeGroupObjects:function(e){this.selection&&this._groupSelector&&this._groupSelectedObjects(e);var t=this.getActiveGroup();t&&(t.setObjectsCoords().setCoords(),t.isMoving=!1,this.setCursor(this.defaultCursor)),this._groupSelector=null,this._currentTransform=null}})}(),fabric.util.object.extend(fabric.StaticCanvas.prototype,{toDataURL:function(e){e||(e={});var t=e.format||"png",n=e.quality||1,r=e.multiplier||1,i={left:e.left,top:e.top,width:e.width,height:e.height};return r!==1?this.__toDataURLWithMultiplier(t,n,i,r):this.__toDataURL(t,n,i)},__toDataURL:function(e,t,n){this.renderAll(!0);var r=this.upperCanvasEl||this.lowerCanvasEl,i=this.__getCroppedCanvas(r,n);e==="jpg"&&(e="jpeg");var s=fabric.StaticCanvas.supports("toDataURLWithQuality")?(i||r).toDataURL("image/"+e,t):(i||r).toDataURL("image/"+e);return this.contextTop&&this.clearContext(this.contextTop),this.renderAll(),i&&(i=null),s},__getCroppedCanvas:function(e,t){var n,r,i="left"in t||"top"in t||"width"in t||"height"in t;return i&&(n=fabric.util.createCanvasElement(),r=n.getContext("2d"),n.width=t.width||this.width,n.height=t.height||this.height,r.drawImage(e,-t.left||0,-t.top||0)),n},__toDataURLWithMultiplier:function(e,t,n,r){var i=this.getWidth(),s=this.getHeight(),o=i*r,u=s*r,a=this.getActiveObject(),f=this.getActiveGroup(),l=this.contextTop||this.contextContainer;r>1&&this.setWidth(o).setHeight(u),l.scale(r,r),n.left&&(n.left*=r),n.top&&(n.top*=r),n.width?n.width*=r:r<1&&(n.width=o),n.height?n.height*=r:r<1&&(n.height=u),f?this._tempRemoveBordersControlsFromGroup(f):a&&this.deactivateAll&&this.deactivateAll(),this.renderAll(!0);var c=this.__toDataURL(e,t,n);return this.width=i,this.height=s,l.scale(1/r,1/r),this.setWidth(i).setHeight(s),f?this._restoreBordersControlsOnGroup(f):a&&this.setActiveObject&&this.setActiveObject(a),this.contextTop&&this.clearContext(this.contextTop),this.renderAll(),c},toDataURLWithMultiplier:function(e,t,n){return this.toDataURL({format:e,multiplier:t,quality:n})},_tempRemoveBordersControlsFromGroup:function(e){e.origHasControls=e.hasControls,e.origBorderColor=e.borderColor,e.hasControls=!0,e.borderColor="rgba(0,0,0,0)",e.forEachObject(function(e){e.origBorderColor=e.borderColor,e.borderColor="rgba(0,0,0,0)"})},_restoreBordersControlsOnGroup:function(e){e.hideControls=e.origHideControls,e.borderColor=e.origBorderColor,e.forEachObject(function(e){e.borderColor=e.origBorderColor,delete e.origBorderColor})}}),fabric.util.object.extend(fabric.StaticCanvas.prototype,{loadFromDatalessJSON:function(e,t,n){return this.loadFromJSON(e,t,n)},loadFromJSON:function(e,t,n){if(!e)return;var r=typeof e=="string"?JSON.parse(e):e;this.clear();var i=this;return this._enlivenObjects(r.objects,function(){i._setBgOverlay(r,t)},n),this},_setBgOverlay:function(e,t){var n=this,r={backgroundColor:!1,overlayColor:!1,backgroundImage:!1,overlayImage:!1};if(!e.backgroundImage&&!e.overlayImage&&!e.background&&!e.overlay){t&&t();return}var i=function(){r.backgroundImage&&r.overlayImage&&r.backgroundColor&&r.overlayColor&&(n.renderAll(),t&&t())};this.__setBgOverlay("backgroundImage",e.backgroundImage,r,i),this.__setBgOverlay("overlayImage",e.overlayImage,r,i),this.__setBgOverlay("backgroundColor",e.background,r,i),this.__setBgOverlay("overlayColor",e.overlay,r,i),i()},__setBgOverlay:function(e,t,n,r){var i=this;if(!t){n[e]=!0;return}e==="backgroundImage"||e==="overlayImage"?fabric.Image.fromObject(t,function(t){i[e]=t,n[e]=!0,r&&r()}):this["set"+fabric.util.string.capitalize(e,!0)](t,function(){n[e]=!0,r&&r()})},_enlivenObjects:function(e,t,n){var r=this;if(!e||e.length===0){t&&t();return}var i=this.renderOnAddRemove;this.renderOnAddRemove=!1,fabric.util.enlivenObjects(e,function(e){e.forEach(function(e,t){r.insertAt(e,t,!0)}),r.renderOnAddRemove=i,t&&t()},null,n)},_toDataURL:function(e,t){this.clone(function(n){t(n.toDataURL(e))})},_toDataURLWithMultiplier:function(e,t,n){this.clone(function(r){n(r.toDataURLWithMultiplier(e,t))})},clone:function(e,t){var n=JSON.stringify(this.toJSON(t));this.cloneWithoutData(function(t){t.loadFromJSON(n,function(){e&&e(t)})})},cloneWithoutData:function(e){var t=fabric.document.createElement("canvas");t.width=this.getWidth(),t.height=this.getHeight();var n=new fabric.Canvas(t);n.clipTo=this.clipTo,this.backgroundImage?(n.setBackgroundImage(this.backgroundImage.src,function(){n.renderAll(),e&&e(n)}),n.backgroundImageOpacity=this.backgroundImageOpacity,n.backgroundImageStretch=this.backgroundImageStretch):e&&e(n)}}),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend,r=t.util.toFixed,i=t.util.string.capitalize,s=t.util.degreesToRadians,o=t.StaticCanvas.supports("setLineDash");if(t.Object)return;t.Object=t.util.createClass({type:"object",originX:"left",originY:"top",top:0,left:0,width:0,height:0,scaleX:1,scaleY:1,flipX:!1,flipY:!1,opacity:1,angle:0,cornerSize:12,transparentCorners:!0,hoverCursor:null,padding:0,borderColor:"rgba(102,153,255,0.75)",cornerColor:"rgba(102,153,255,0.5)",centeredScaling:!1,centeredRotation:!0,fill:"rgb(0,0,0)",fillRule:"nonzero",globalCompositeOperation:"source-over",backgroundColor:"",stroke:null,strokeWidth:1,strokeDashArray:null,strokeLineCap:"butt",strokeLineJoin:"miter",strokeMiterLimit:10,shadow:null,borderOpacityWhenMoving:.4,borderScaleFactor:1,transformMatrix:null,minScaleLimit:.01,selectable:!0,evented:!0,visible:!0,hasControls:!0,hasBorders:!0,hasRotatingPoint:!0,rotatingPointOffset:40,perPixelTargetFind:!1,includeDefaultValues:!0,clipTo:null,lockMovementX:!1,lockMovementY:!1,lockRotation:!1,lockScalingX:!1,lockScalingY:!1,lockUniScaling:!1,lockScalingFlip:!1,stateProperties:"top left width height scaleX scaleY flipX flipY originX originY transformMatrix stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin strokeMiterLimit angle opacity fill fillRule globalCompositeOperation shadow clipTo visible backgroundColor".split(" "),initialize:function(e){e&&this.setOptions(e)},_initGradient:function(e){e.fill&&e.fill.colorStops&&!(e.fill instanceof t.Gradient)&&this.set("fill",new t.Gradient(e.fill))},_initPattern:function(e){e.fill&&e.fill.source&&!(e.fill instanceof t.Pattern)&&this.set("fill",new t.Pattern(e.fill)),e.stroke&&e.stroke.source&&!(e.stroke instanceof t.Pattern)&&this.set("stroke",new t.Pattern(e.stroke))},_initClipping:function(e){if(!e.clipTo||typeof e.clipTo!="string")return;var n=t.util.getFunctionBody(e.clipTo);typeof n!="undefined"&&(this.clipTo=new Function("ctx",n))},setOptions:function(e){for(var t in e)this.set(t,e[t]);this._initGradient(e),this._initPattern(e),this._initClipping(e)},transform:function(e,t){this.group&&this.group.transform(e,t);var n=t?this._getLeftTopCoords():this.getCenterPoint();e.translate(n.x,n.y),e.rotate(s(this.angle)),e.scale(this.scaleX*(this.flipX?-1:1),this.scaleY*(this.flipY?-1:1))},toObject:function(e){var n=t.Object.NUM_FRACTION_DIGITS,i={type:this.type,originX:this.originX,originY:this.originY,left:r(this.left,n),top:r(this.top,n),width:r(this.width,n),height:r(this.height,n),fill:this.fill&&this.fill.toObject?this.fill.toObject():this.fill,stroke:this.stroke&&this.stroke.toObject?this.stroke.toObject():this.stroke,strokeWidth:r(this.strokeWidth,n),strokeDashArray:this.strokeDashArray,strokeLineCap:this.strokeLineCap,strokeLineJoin:this.strokeLineJoin,strokeMiterLimit:r(this.strokeMiterLimit,n),scaleX:r(this.scaleX,n),scaleY:r(this.scaleY,n),angle:r(this.getAngle(),n),flipX:this.flipX,flipY:this.flipY,opacity:r(this.opacity,n),shadow:this.shadow&&this.shadow.toObject?this.shadow.toObject():this.shadow,visible:this.visible,clipTo:this.clipTo&&String(this.clipTo),backgroundColor:this.backgroundColor,fillRule:this.fillRule,globalCompositeOperation:this.globalCompositeOperation};return this.includeDefaultValues||(i=this._removeDefaultValues(i)),t.util.populateWithProperties(this,i,e),i},toDatalessObject:function(e){return this.toObject(e)},_removeDefaultValues:function(e){var n=t.util.getKlass(e.type).prototype,r=n.stateProperties;return r.forEach(function(t){e[t]===n[t]&&delete e[t]}),e},toString:function(){return"#<fabric."+i(this.type)+">"},get:function(e){return this[e]},_setObject:function(e){for(var t in e)this._set(t,e[t])},set:function(e,t){return typeof e=="object"?this._setObject(e):typeof t=="function"&&e!=="clipTo"?this._set(e,t(this.get(e))):this._set(e,t),this},_set:function(e,n){var i=e==="scaleX"||e==="scaleY";return i&&(n=this._constrainScale(n)),e==="scaleX"&&n<0?(this.flipX=!this.flipX,n*=-1):e==="scaleY"&&n<0?(this.flipY=!this.flipY,n*=-1):e==="width"||e==="height"?this.minScaleLimit=r(Math.min(.1,1/Math.max(this.width,this.height)),2):e==="shadow"&&n&&!(n instanceof t.Shadow)&&(n=new t.Shadow(n)),this[e]=n,this},toggle:function(e){var t=this.get(e);return typeof t=="boolean"&&this.set(e,!t),this},setSourcePath:function(e){return this.sourcePath=e,this},getViewportTransform:function(){return this.canvas&&this.canvas.viewportTransform?this.canvas.viewportTransform:[1,0,0,1,0,0]},render:function(e,n){if(this.width===0&&this.height===0||!this.visible)return;e.save(),this._setupCompositeOperation(e),n||this.transform(e),this._setStrokeStyles(e),this._setFillStyles(e),this.group&&this.group.type==="path-group"&&e.translate(-this.group.width/2,-this.group.height/2),this.transformMatrix&&e.transform.apply(e,this.transformMatrix),this._setOpacity(e),this._setShadow(e),this.clipTo&&t.util.clipContext(this,e),this._render(e,n),this.clipTo&&e.restore(),this._removeShadow(e),this._restoreCompositeOperation(e),e.restore()},_setOpacity:function(e){this.group&&this.group._setOpacity(e),e.globalAlpha*=this.opacity},_setStrokeStyles:function(e){this.stroke&&(e.lineWidth=this.strokeWidth,e.lineCap=this.strokeLineCap,e.lineJoin=this.strokeLineJoin,e.miterLimit=this.strokeMiterLimit,e.strokeStyle=this.stroke.toLive?this.stroke.toLive(e,this):this.stroke)},_setFillStyles:function(e){this.fill&&(e.fillStyle=this.fill.toLive?this.fill.toLive(e,this):this.fill)},_renderControls:function(e,n){var r=this.getViewportTransform();e.save();if(this.active&&!n){var i;this.group&&(i=t.util.transformPoint(this.group.getCenterPoint(),r),e.translate(i.x,i.y),e.rotate(s(this.group.angle))),i=t.util.transformPoint(this.getCenterPoint(),r,null!=this.group),this.group&&(i.x*=this.group.scaleX,i.y*=this.group.scaleY),e.translate(i.x,i.y),e.rotate(s(this.angle)),this.drawBorders(e),this.drawControls(e)}e.restore()},_setShadow:function(e){if(!this.shadow)return;var t=this.canvas&&this.canvas._currentMultiplier||1;e.shadowColor=this.shadow.color,e.shadowBlur=this.shadow.blur*t*(this.scaleX+this.scaleY)/2,e.shadowOffsetX=this.shadow.offsetX*t*this.scaleX,e.shadowOffsetY=this.shadow.offsetY*t*this.scaleY},_removeShadow:function(e){if(!this.shadow)return;e.shadowColor="",e.shadowBlur=e.shadowOffsetX=e.shadowOffsetY=0},_renderFill:function(e){if(!this.fill)return;e.save();if(this.fill.gradientTransform){var t=this.fill.gradientTransform;e.transform.apply(e,t)}this.fill.toLive&&e.translate(-this.width/2+this.fill.offsetX||0,-this.height/2+this.fill.offsetY||0),this.fillRule==="evenodd"?e.fill("evenodd"):e.fill(),e.restore(),this.shadow&&!this.shadow.affectStroke&&this._removeShadow(e)},_renderStroke:function(e){if(!this.stroke||this.strokeWidth===0)return;e.save();if(this.strokeDashArray)1&this.strokeDashArray.length&&this.strokeDashArray.push.apply(this.strokeDashArray,this.strokeDashArray),o?(e.setLineDash(this.strokeDashArray),this._stroke&&this._stroke(e)):this._renderDashedStroke&&this._renderDashedStroke(e),e.stroke();else{if(this.stroke.gradientTransform){var t=this.stroke.gradientTransform;e.transform.apply(e,t)}this._stroke?this._stroke(e):e.stroke()}this._removeShadow(e),e.restore()},clone:function(e,n){return this.constructor.fromObject?this.constructor.fromObject(this.toObject(n),e):new t.Object(this.toObject(n))},cloneAsImage:function(e){var n=this.toDataURL();return t.util.loadImage(n,function(n){e&&e(new t.Image(n))}),this},toDataURL:function(e){e||(e={});var n=t.util.createCanvasElement(),r=this.getBoundingRect();n.width=r.width,n.height=r.height,t.util.wrapElement(n,"div");var i=new t.Canvas(n);e.format==="jpg"&&(e.format="jpeg"),e.format==="jpeg"&&(i.backgroundColor="#fff");var s={active:this.get("active"),left:this.getLeft(),top:this.getTop()};this.set("active",!1),this.setPositionByOrigin(new t.Point(n.width/2,n.height/2),"center","center");var o=this.canvas;i.add(this);var u=i.toDataURL(e);return this.set(s).setCoords(),this.canvas=o,i.dispose(),i=null,u},isType:function(e){return this.type===e},complexity:function(){return 0},toJSON:function(e){return this.toObject(e)},setGradient:function(e,n){n||(n={});var r={colorStops:[]};r.type=n.type||(n.r1||n.r2?"radial":"linear"),r.coords={x1:n.x1,y1:n.y1,x2:n.x2,y2:n.y2};if(n.r1||n.r2)r.coords.r1=n.r1,r.coords.r2=n.r2;for(var i in n.colorStops){var s=new t.Color(n.colorStops[i]);r.colorStops.push({offset:i,color:s.toRgb(),opacity:s.getAlpha()})}return this.set(e,t.Gradient.forObject(this,r))},setPatternFill:function(e){return this.set("fill",new t.Pattern(e))},setShadow:function(e){return this.set("shadow",e?new t.Shadow(e):null)},setColor:function(e){return this.set("fill",e),this},setAngle:function(e){var t=(this.originX!=="center"||this.originY!=="center")&&this.centeredRotation;return t&&this._setOriginToCenter(),this.set("angle",e),t&&this._resetOrigin(),this},centerH:function(){return this.canvas.centerObjectH(this),this},centerV:function(){return this.canvas.centerObjectV(this),this},center:function(){return this.canvas.centerObject(this),this},remove:function(){return this.canvas.remove(this),this},getLocalPointer:function(e,t){t=t||this.canvas.getPointer(e);var n=this.translateToOriginPoint(this.getCenterPoint(),"left","top");return{x:t.x-n.x,y:t.y-n.y}},_setupCompositeOperation:function(e){this.globalCompositeOperation&&(this._prevGlobalCompositeOperation=e.globalCompositeOperation,e.globalCompositeOperation=this.globalCompositeOperation)},_restoreCompositeOperation:function(e){this.globalCompositeOperation&&this._prevGlobalCompositeOperation&&(e.globalCompositeOperation=this._prevGlobalCompositeOperation)}}),t.util.createAccessors(t.Object),t.Object.prototype.rotate=t.Object.prototype.setAngle,n(t.Object.prototype,t.Observable),t.Object.NUM_FRACTION_DIGITS=2,t.Object.__uid=0}(typeof exports!="undefined"?exports:this),function(){var e=fabric.util.degreesToRadians;fabric.util.object.extend(fabric.Object.prototype,{translateToCenterPoint:function(t,n,r){var i=t.x,s=t.y,o=this.stroke?this.strokeWidth:0;return n==="left"?i=t.x+(this.getWidth()+o*this.scaleX)/2:n==="right"&&(i=t.x-(this.getWidth()+o*this.scaleX)/2),r==="top"?s=t.y+(this.getHeight()+o*this.scaleY)/2:r==="bottom"&&(s=t.y-(this.getHeight()+o*this.scaleY)/2),fabric.util.rotatePoint(new fabric.Point(i,s),t,e(this.angle))},translateToOriginPoint:function(t,n,r){var i=t.x,s=t.y,o=this.stroke?this.strokeWidth:0;return n==="left"?i=t.x-(this.getWidth()+o*this.scaleX)/2:n==="right"&&(i=t.x+(this.getWidth()+o*this.scaleX)/2),r==="top"?s=t.y-(this.getHeight()+o*this.scaleY)/2:r==="bottom"&&(s=t.y+(this.getHeight()+o*this.scaleY)/2),fabric.util.rotatePoint(new fabric.Point(i,s),t,e(this.angle))},getCenterPoint:function(){var e=new fabric.Point(this.left,this.top);return this.translateToCenterPoint(e,this.originX,this.originY)},getPointByOrigin:function(e,t){var n=this.getCenterPoint();return this.translateToOriginPoint(n,e,t)},toLocalPoint:function(t,n,r){var i=this.getCenterPoint(),s=this.stroke?this.strokeWidth:0,o,u;return n&&r?(n==="left"?o=i.x-(this.getWidth()+s*this.scaleX)/2:n==="right"?o=i.x+(this.getWidth()+s*this.scaleX)/2:o=i.x,r==="top"?u=i.y-(this.getHeight()+s*this.scaleY)/2:r==="bottom"?u=i.y+(this.getHeight()+s*this.scaleY)/2:u=i.y):(o=this.left,u=this.top),fabric.util.rotatePoint(new fabric.Point(t.x,t.y),i,-e(this.angle)).subtractEquals(new fabric.Point(o,u))},setPositionByOrigin:function(e,t,n){var r=this.translateToCenterPoint(e,t,n),i=this.translateToOriginPoint(r,this.originX,this.originY);this.set("left",i.x),this.set("top",i.y)},adjustPosition:function(t){var n=e(this.angle),r=this.getWidth()/2,i=Math.cos(n)*r,s=Math.sin(n)*r,o=this.getWidth(),u=Math.cos(n)*o,a=Math.sin(n)*o;this.originX==="center"&&t==="left"||this.originX==="right"&&t==="center"?(this.left-=i,this.top-=s):this.originX==="left"&&t==="center"||this.originX==="center"&&t==="right"?(this.left+=i,this.top+=s):this.originX==="left"&&t==="right"?(this.left+=u,this.top+=a):this.originX==="right"&&t==="left"&&(this.left-=u,this.top-=a),this.setCoords(),this.originX=t},_setOriginToCenter:function(){this._originalOriginX=this.originX,this._originalOriginY=this.originY;var e=this.getCenterPoint();this.originX="center",this.originY="center",this.left=e.x,this.top=e.y},_resetOrigin:function(){var e=this.translateToOriginPoint(this.getCenterPoint(),this._originalOriginX,this._originalOriginY);this.originX=this._originalOriginX,this.originY=this._originalOriginY,this.left=e.x,this.top=e.y,this._originalOriginX=null,this._originalOriginY=null},_getLeftTopCoords:function(){return this.translateToOriginPoint(this.getCenterPoint(),"left","center")}})}(),function(){var e=fabric.util.degreesToRadians;fabric.util.object.extend(fabric.Object.prototype,{oCoords:null,intersectsWithRect:function(e,t){var n=this.oCoords,r=new fabric.Point(n.tl.x,n.tl.y),i=new fabric.Point(n.tr.x,n.tr.y),s=new fabric.Point(n.bl.x,n.bl.y),o=new fabric.Point(n.br.x,n.br.y),u=fabric.Intersection.intersectPolygonRectangle([r,i,o,s],e,t);return u.status==="Intersection"},intersectsWithObject:function(e){function t(e){return{tl:new fabric.Point(e.tl.x,e.tl.y),tr:new fabric.Point(e.tr.x,e.tr.y),bl:new fabric.Point(e.bl.x,e.bl.y),br:new fabric.Point(e.br.x,e.br.y)}}var n=t(this.oCoords),r=t(e.oCoords),i=fabric.Intersection.intersectPolygonPolygon([n.tl,n.tr,n.br,n.bl],[r.tl,r.tr,r.br,r.bl]);return i.status==="Intersection"},isContainedWithinObject:function(e){var t=e.getBoundingRect(),n=new fabric.Point(t.left,t.top),r=new fabric.Point(t.left+t.width,t.top+t.height);return this.isContainedWithinRect(n,r)},isContainedWithinRect:function(e,t){var n=this.getBoundingRect();return n.left>=e.x&&n.left+n.width<=t.x&&n.top>=e.y&&n.top+n.height<=t.y},containsPoint:function(e){var t=this._getImageLines(this.oCoords),n=this._findCrossPoints(e,t);return n!==0&&n%2===1},_getImageLines:function(e){return{topline:{o:e.tl,d:e.tr},rightline:{o:e.tr,d:e.br},bottomline:{o:e.br,d:e.bl},leftline:{o:e.bl,d:e.tl}}},_findCrossPoints:function(e,t){var n,r,i,s,o,u,a=0,f;for(var l in t){f=t[l];if(f.o.y<e.y&&f.d.y<e.y)continue;if(f.o.y>=e.y&&f.d.y>=e.y)continue;f.o.x===f.d.x&&f.o.x>=e.x?(o=f.o.x,u=e.y):(n=0,r=(f.d.y-f.o.y)/(f.d.x-f.o.x),i=e.y-n*e.x,s=f.o.y-r*f.o.x,o=-(i-s)/(n-r),u=i+n*o),o>=e.x&&(a+=1);if(a===2)break}return a},getBoundingRectWidth:function(){return this.getBoundingRect().width},getBoundingRectHeight:function(){return this.getBoundingRect().height},getBoundingRect:function(){this.oCoords||this.setCoords();var e=[this.oCoords.tl.x,this.oCoords.tr.x,this.oCoords.br.x,this.oCoords.bl.x],t=fabric.util.array.min(e),n=fabric.util.array.max(e),r=Math.abs(t-n),i=[this.oCoords.tl.y,this.oCoords.tr.y,this.oCoords.br.y,this.oCoords.bl.y],s=fabric.util.array.min(i),o=fabric.util.array.max(i),u=Math.abs(s-o);return{left:t,top:s,width:r,height:u}},getWidth:function(){return this.width*this.scaleX},getHeight:function(){return this.height*this.scaleY},_constrainScale:function(e){return Math.abs(e)<this.minScaleLimit?e<0?-this.minScaleLimit:this.minScaleLimit:e},scale:function(e){return e=this._constrainScale(e),e<0&&(this.flipX=!this.flipX,this.flipY=!this.flipY,e*=-1),this.scaleX=e,this.scaleY=e,this.setCoords(),this},scaleToWidth:function(e){var t=this.getBoundingRectWidth()/this.getWidth();return this.scale(e/this.width/t)},scaleToHeight:function(e){var t=this.getBoundingRectHeight()/this.getHeight();return this.scale(e/this.height/t)},setCoords:function(){var t=this.strokeWidth,n=e(this.angle),r=this.getViewportTransform(),i=function(e){return fabric.util.transformPoint(e,r)},s=this.width,o=this.height,u=this.strokeLineCap==="round"||this.strokeLineCap==="square",a=this.type==="line"&&this.width===0,f=this.type==="line"&&this.height===0,l=a||f,c=u&&f||!l,h=u&&a||!l;a?s=t:f&&(o=t),c&&(s+=s>0?t:-t),h&&(o+=o>0?t:-t),this.currentWidth=s*this.scaleX,this.currentHeight=o*this.scaleY,this.currentWidth<0&&(this.currentWidth=Math.abs(this.currentWidth));var p=Math.sqrt(Math.pow(this.currentWidth/2,2)+Math.pow(this.currentHeight/2,2)),d=Math.atan(isFinite(this.currentHeight/this.currentWidth)?this.currentHeight/this.currentWidth:0),v=Math.cos(d+n)*p,m=Math.sin(d+n)*p,g=Math.sin(n),y=Math.cos(n),b=this.getCenterPoint(),w=new fabric.Point(this.currentWidth,this.currentHeight),E=new fabric.Point(b.x-v,b.y-m),S=new fabric.Point(E.x+w.x*y,E.y+w.x*g),x=new fabric.Point(E.x-w.y*g,E.y+w.y*y),T=new fabric.Point(E.x+w.x/2*y,E.y+w.x/2*g),N=i(E),C=i(S),k=i(new fabric.Point(S.x-w.y*g,S.y+w.y*y)),L=i(x),A=i(new fabric.Point(E.x-w.y/2*g,E.y+w.y/2*y)),O=i(T),M=i(new fabric.Point(S.x-w.y/2*g,S.y+w.y/2*y)),_=i(new fabric.Point(x.x+w.x/2*y,x.y+w.x/2*g)),D=i(new fabric.Point(T.x,T.y)),P=Math.cos(d+n)*this.padding*Math.sqrt(2),H=Math.sin(d+n)*this.padding*Math.sqrt(2);return N=N.add(new fabric.Point(-P,-H)),C=C.add(new fabric.Point(H,-P)),k=k.add(new fabric.Point(P,H)),L=L.add(new fabric.Point(-H,P)),A=A.add(new fabric.Point((-P-H)/2,(-H+P)/2)),O=O.add(new fabric.Point((H-P)/2,-(H+P)/2)),M=M.add(new fabric.Point((H+P)/2,(H-P)/2)),_=_.add(new fabric.Point((P-H)/2,(P+H)/2)),D=D.add(new fabric.Point((H-P)/2,-(H+P)/2)),this.oCoords={tl:N,tr:C,br:k,bl:L,ml:A,mt:O,mr:M,mb:_,mtr:D},this._setCornerCoords&&this._setCornerCoords(),this}})}(),fabric.util.object.extend(fabric.Object.prototype,{sendToBack:function(){return this.group?fabric.StaticCanvas.prototype.sendToBack.call(this.group,this):this.canvas.sendToBack(this),this},bringToFront:function(){return this.group?fabric.StaticCanvas.prototype.bringToFront.call(this.group,this):this.canvas.bringToFront(this),this},sendBackwards:function(e){return this.group?fabric.StaticCanvas.prototype.sendBackwards.call(this.group,this,e):this.canvas.sendBackwards(this,e),this},bringForward:function(e){return this.group?fabric.StaticCanvas.prototype.bringForward.call(this.group,this,e):this.canvas.bringForward(this,e),this},moveTo:function(e){return this.group?fabric.StaticCanvas.prototype.moveTo.call(this.group,this,e):this.canvas.moveTo(this,e),this}}),fabric.util.object.extend(fabric.Object.prototype,{getSvgStyles:function(){var e=this.fill?this.fill.toLive?"url(#SVGID_"+this.fill.id+")":this.fill:"none",t=this.fillRule,n=this.stroke?this.stroke.toLive?"url(#SVGID_"+this.stroke.id+")":this.stroke:"none",r=this.strokeWidth?this.strokeWidth:"0",i=this.strokeDashArray?this.strokeDashArray.join(" "):"",s=this.strokeLineCap?this.strokeLineCap:"butt",o=this.strokeLineJoin?this.strokeLineJoin:"miter",u=this.strokeMiterLimit?this.strokeMiterLimit:"4",a=typeof this.opacity!="undefined"?this.opacity:"1",f=this.visible?"":" visibility: hidden;",l=this.shadow&&this.type!=="text"?"filter: url(#SVGID_"+this.shadow.id+");":"";return["stroke: ",n,"; ","stroke-width: ",r,"; ","stroke-dasharray: ",i,"; ","stroke-linecap: ",s,"; ","stroke-linejoin: ",o,"; ","stroke-miterlimit: ",u,"; ","fill: ",e,"; ","fill-rule: ",t,"; ","opacity: ",a,";",l,f].join("")},getSvgTransform:function(){if(this.group&&this.group.type==="path-group")return"";var e=fabric.util.toFixed,t=this.getAngle(),n=!this.canvas||this.canvas.svgViewportTransformation?this.getViewportTransform():[1,0,0,1,0,0],r=fabric.util.transformPoint(this.getCenterPoint(),n),i=fabric.Object.NUM_FRACTION_DIGITS,s=this.type==="path-group"?"":"translate("+e(r.x,i)+" "+e(r.y,i)+")",o=t!==0?" rotate("+e(t,i)+")":"",u=this.scaleX===1&&this.scaleY===1&&n[0]===1&&n[3]===1?"":" scale("+e(this.scaleX*n[0],i)+" "+e(this.scaleY*n[3],i)+")",a=this.type==="path-group"?this.width*n[0]:0,f=this.flipX?" matrix(-1 0 0 1 "+a+" 0) ":"",l=this.type==="path-group"?this.height*n[3]:0,c=this.flipY?" matrix(1 0 0 -1 0 "+l+")":"";return[s,o,u,f,c].join("")},getSvgTransformMatrix:function(){return this.transformMatrix?" matrix("+this.transformMatrix.join(" ")+")":""},_createBaseSVGMarkup:function(){var e=[];return this.fill&&this.fill.toLive&&e.push(this.fill.toSVG(this,!1)),this.stroke&&this.stroke.toLive&&e.push(this.stroke.toSVG(this,!1)),this.shadow&&e.push(this.shadow.toSVG(this)),e}}),fabric.util.object.extend(fabric.Object.prototype,{hasStateChanged:function(){return this.stateProperties.some(function(e){return this.get(e)!==this.originalState[e]},this)},saveState:function(e){return this.stateProperties.forEach(function(e){this.originalState[e]=this.get(e)},this),e&&e.stateProperties&&e.stateProperties.forEach(function(e){this.originalState[e]=this.get(e)},this),this},setupState:function(){return this.originalState={},this.saveState(),this}}),function(){var e=fabric.util.degreesToRadians,t=function(){return typeof G_vmlCanvasManager!="undefined"};fabric.util.object.extend(fabric.Object.prototype,{_controlsVisibility:null,_findTargetCorner:function(e){if(!this.hasControls||!this.active)return!1;var t=e.x,n=e.y,r,i;for(var s in this.oCoords){if(!this.isControlVisible(s))continue;if(s==="mtr"&&!this.hasRotatingPoint)continue;if(!(!this.get("lockUniScaling")||s!=="mt"&&s!=="mr"&&s!=="mb"&&s!=="ml"))continue;i=this._getImageLines(this.oCoords[s].corner),r=this._findCrossPoints({x:t,y:n},i);if(r!==0&&r%2===1)return this.__corner=s,s}return!1},_setCornerCoords:function(){var t=this.oCoords,n=e(this.angle),r=e(45-this.angle),i=Math.sqrt(2*Math.pow(this.cornerSize,2))/2,s=i*Math.cos(r),o=i*Math.sin(r),u=Math.sin(n),a=Math.cos(n);t.tl.corner={tl:{x:t.tl.x-o,y:t.tl.y-s},tr:{x:t.tl.x+s,y:t.tl.y-o},bl:{x:t.tl.x-s,y:t.tl.y+o},br:{x:t.tl.x+o,y:t.tl.y+s}},t.tr.corner={tl:{x:t.tr.x-o,y:t.tr.y-s},tr:{x:t.tr.x+s,y:t.tr.y-o},br:{x:t.tr.x+o,y:t.tr.y+s},bl:{x:t.tr.x-s,y:t.tr.y+o}},t.bl.corner={tl:{x:t.bl.x-o,y:t.bl.y-s},bl:{x:t.bl.x-s,y:t.bl.y+o},br:{x:t.bl.x+o,y:t.bl.y+s},tr:{x:t.bl.x+s,y:t.bl.y-o}},t.br.corner={tr:{x:t.br.x+s,y:t.br.y-o},bl:{x:t.br.x-s,y:t.br.y+o},br:{x:t.br.x+o,y:t.br.y+s},tl:{x:t.br.x-o,y:t.br.y-s}},t.ml.corner={tl:{x:t.ml.x-o,y:t.ml.y-s},tr:{x:t.ml.x+s,y:t.ml.y-o},bl:{x:t.ml.x-s,y:t.ml.y+o},br:{x:t.ml.x+o,y:t.ml.y+s}},t.mt.corner={tl:{x:t.mt.x-o,y:t.mt.y-s},tr:{x:t.mt.x+s,y:t.mt.y-o},bl:{x:t.mt.x-s,y:t.mt.y+o},br:{x:t.mt.x+o,y:t.mt.y+s}},t.mr.corner={tl:{x:t.mr.x-o,y:t.mr.y-s},tr:{x:t.mr.x+s,y:t.mr.y-o},bl:{x:t.mr.x-s,y:t.mr.y+o},br:{x:t.mr.x+o,y:t.mr.y+s}},t.mb.corner={tl:{x:t.mb.x-o,y:t.mb.y-s},tr:{x:t.mb.x+s,y:t.mb.y-o},bl:{x:t.mb.x-s,y:t.mb.y+o},br:{x:t.mb.x+o,y:t.mb.y+s}},t.mtr.corner={tl:{x:t.mtr.x-o+u*this.rotatingPointOffset,y:t.mtr.y-s-a*this.rotatingPointOffset},tr:{x:t.mtr.x+s+u*this.rotatingPointOffset,y:t.mtr.y-o-a*this.rotatingPointOffset},bl:{x:t.mtr.x-s+u*this.rotatingPointOffset,y:t.mtr.y+o-a*this.rotatingPointOffset},br:{x:t.mtr.x+o+u*this.rotatingPointOffset,y:t.mtr.y+s-a*this.rotatingPointOffset}}},drawBorders:function(e){if(!this.hasBorders)return this;var t=this.padding,n=t*2,r=this.getViewportTransform();e.save(),e.globalAlpha=this.isMoving?this.borderOpacityWhenMoving:1,e.strokeStyle=this.borderColor;var i=1/this._constrainScale(this.scaleX),s=1/this._constrainScale(this.scaleY);e.lineWidth=1/this.borderScaleFactor;var o=this.getWidth(),u=this.getHeight(),a=this.strokeWidth,f=this.strokeLineCap==="round"||this.strokeLineCap==="square",l=this.type==="line"&&this.width===0,c=this.type==="line"&&this.height===0,h=l||c,p=f&&c||!h,d=f&&l||!h;l?o=a/i:c&&(u=a/s),p&&(o+=a/i),d&&(u+=a/s);var v=fabric.util.transformPoint(new fabric.Point(o,u),r,!0),m=v.x,g=v.y;this.group&&(m*=this.group.scaleX,g*=this.group.scaleY),e.strokeRect(~~(-(m/2)-t)-.5,~~(-(g/2)-t)-.5,~~(m+n)+1,~~(g+n)+1);if(this.hasRotatingPoint&&this.isControlVisible("mtr")&&!this.get("lockRotation")&&this.hasControls){var y=(-g-t*2)/2;e.beginPath(),e.moveTo(0,y),e.lineTo(0,y-this.rotatingPointOffset),e.closePath(),e.stroke()}return e.restore(),this},drawControls:function(e){if(!this.hasControls)return this;var t=this.cornerSize,n=t/2,r=this.getViewportTransform(),i=this.strokeWidth,s=this.width,o=this.height,u=this.strokeLineCap==="round"||this.strokeLineCap==="square",a=this.type==="line"&&this.width===0,f=this.type==="line"&&this.height===0,l=a||f,c=u&&f||!l,h=u&&a||!l;a?s=i:f&&(o=i),c&&(s+=i),h&&(o+=i),s*=this.scaleX,o*=this.scaleY;var p=fabric.util.transformPoint(new fabric.Point(s,o),r,!0),d=p.x,v=p.y,m=-(d/2),g=-(v/2),y=this.padding,b=n,w=n-t,E=this.transparentCorners?"strokeRect":"fillRect";return e.save(),e.lineWidth=1,e.globalAlpha=this.isMoving?this.borderOpacityWhenMoving:1,e.strokeStyle=e.fillStyle=this.cornerColor,this._drawControl("tl",e,E,m-b-y,g-b-y),this._drawControl("tr",e,E,m+d-b+y,g-b-y),this._drawControl("bl",e,E,m-b-y,g+v+w+y),this._drawControl("br",e,E,m+d+w+y,g+v+w+y),this.get("lockUniScaling")||(this._drawControl("mt",e,E,m+d/2-b,g-b-y),this._drawControl("mb",e,E,m+d/2-b,g+v+w+y),this._drawControl("mr",e,E,m+d+w+y,g+v/2-b),this._drawControl("ml",e,E,m-b-y,g+v/2-b)),this.hasRotatingPoint&&this._drawControl("mtr",e,E,m+d/2-b,g-this.rotatingPointOffset-this.cornerSize/2-y),e.restore(),this},_drawControl:function(e,n,r,i,s){var o=this.cornerSize;this.isControlVisible(e)&&(t()||this.transparentCorners||n.clearRect(i,s,o,o),n[r](i,s,o,o))},isControlVisible:function(e){return this._getControlsVisibility()[e]},setControlVisible:function(e,t){return this._getControlsVisibility()[e]=t,this},setControlsVisibility:function(e){e||(e={});for(var t in e)this.setControlVisible(t,e[t]);return this},_getControlsVisibility:function(){return this._controlsVisibility||(this._controlsVisibility={tl:!0,tr:!0,br:!0,bl:!0,ml:!0,mt:!0,mr:!0,mb:!0,mtr:!0}),this._controlsVisibility}})}(),fabric.util.object.extend(fabric.StaticCanvas.prototype,{FX_DURATION:500,fxCenterObjectH:function(e,t){t=t||{};var n=function(){},r=t.onComplete||n,i=t.onChange||n,s=this;return fabric.util.animate({startValue:e.get("left"),endValue:this.getCenter().left,duration:this.FX_DURATION,onChange:function(t){e.set("left",t),s.renderAll(),i()},onComplete:function(){e.setCoords(),r()}}),this},fxCenterObjectV:function(e,t){t=t||{};var n=function(){},r=t.onComplete||n,i=t.onChange||n,s=this;return fabric.util.animate({startValue:e.get("top"),endValue:this.getCenter().top,duration:this.FX_DURATION,onChange:function(t){e.set("top",t),s.renderAll(),i()},onComplete:function(){e.setCoords(),r()}}),this},fxRemove:function(e,t){t=t||{};var n=function(){},r=t.onComplete||n,i=t.onChange||n,s=this;return fabric.util.animate({startValue:e.get("opacity"),endValue:0,duration:this.FX_DURATION,onStart:function(){e.set("active",!1)},onChange:function(t){e.set("opacity",t),s.renderAll(),i()},onComplete:function(){s.remove(e),r()}}),this}}),fabric.util.object.extend(fabric.Object.prototype,{animate:function(){if(arguments[0]&&typeof arguments[0]=="object"){var e=[],t,n;for(t in arguments[0])e.push(t);for(var r=0,i=e.length;r<i;r++)t=e[r],n=r!==i-1,this._animate(t,arguments[0][t],arguments[1],n)}else this._animate.apply(this,arguments);return this},_animate:function(e,t,n,r){var i=this,s;t=t.toString(),n?n=fabric.util.object.clone(n):n={},~e.indexOf(".")&&(s=e.split("."));var o=s?this.get(s[0])[s[1]]:this.get(e);"from"in n||(n.from=o),~t.indexOf("=")?t=o+parseFloat(t.replace("=","")):t=parseFloat(t),fabric.util.animate({startValue:n.from,endValue:t,byValue:n.by,easing:n.easing,duration:n.duration,abort:n.abort&&function(){return n.abort.call(i)},onChange:function(t){s?i[s[0]][s[1]]=t:i.set(e,t);if(r)return;n.onChange&&n.onChange()},onComplete:function(){if(r)return;i.setCoords(),n.onComplete&&n.onComplete()}})}}),function(e){"use strict";function s(e,t){var n=e.origin,r=e.axis1,i=e.axis2,s=e.dimension,o=t.nearest,u=t.center,a=t.farthest;return function(){switch(this.get(n)){case o:return Math.min(this.get(r),this.get(i));case u:return Math.min(this.get(r),this.get(i))+.5*this.get(s);case a:return Math.max(this.get(r),this.get(i))}}}var t=e.fabric||(e.fabric={}),n=t.util.object.extend,r={x1:1,x2:1,y1:1,y2:1},i=t.StaticCanvas.supports("setLineDash");if(t.Line){t.warn("fabric.Line is already defined");return}t.Line=t.util.createClass(t.Object,{type:"line",x1:0,y1:0,x2:0,y2:0,initialize:function(e,t){t=t||{},e||(e=[0,0,0,0]),this.callSuper("initialize",t),this.set("x1",e[0]),this.set("y1",e[1]),this.set("x2",e[2]),this.set("y2",e[3]
),this._setWidthHeight(t)},_setWidthHeight:function(e){e||(e={}),this.width=Math.abs(this.x2-this.x1),this.height=Math.abs(this.y2-this.y1),this.left="left"in e?e.left:this._getLeftToOriginX(),this.top="top"in e?e.top:this._getTopToOriginY()},_set:function(e,t){return this.callSuper("_set",e,t),typeof r[e]!="undefined"&&this._setWidthHeight(),this},_getLeftToOriginX:s({origin:"originX",axis1:"x1",axis2:"x2",dimension:"width"},{nearest:"left",center:"center",farthest:"right"}),_getTopToOriginY:s({origin:"originY",axis1:"y1",axis2:"y2",dimension:"height"},{nearest:"top",center:"center",farthest:"bottom"}),_render:function(e,t){e.beginPath();if(t){var n=this.getCenterPoint();e.translate(n.x-this.strokeWidth/2,n.y-this.strokeWidth/2)}if(!this.strokeDashArray||this.strokeDashArray&&i){var r=this.calcLinePoints();e.moveTo(r.x1,r.y1),e.lineTo(r.x2,r.y2)}e.lineWidth=this.strokeWidth;var s=e.strokeStyle;e.strokeStyle=this.stroke||e.fillStyle,this.stroke&&this._renderStroke(e),e.strokeStyle=s},_renderDashedStroke:function(e){var n=this.calcLinePoints();e.beginPath(),t.util.drawDashedLine(e,n.x1,n.y1,n.x2,n.y2,this.strokeDashArray),e.closePath()},toObject:function(e){return n(this.callSuper("toObject",e),this.calcLinePoints())},calcLinePoints:function(){var e=this.x1<=this.x2?-1:1,t=this.y1<=this.y2?-1:1,n=e*this.width*.5,r=t*this.height*.5,i=e*this.width*-0.5,s=t*this.height*-0.5;return{x1:n,x2:i,y1:r,y2:s}},toSVG:function(e){var t=this._createBaseSVGMarkup(),n={x1:this.x1,x2:this.x2,y1:this.y1,y2:this.y2};if(!this.group||this.group.type!=="path-group")n=this.calcLinePoints();return t.push("<line ",'x1="',n.x1,'" y1="',n.y1,'" x2="',n.x2,'" y2="',n.y2,'" style="',this.getSvgStyles(),'" transform="',this.getSvgTransform(),this.getSvgTransformMatrix(),'"/>\n'),e?e(t.join("")):t.join("")},complexity:function(){return 1}}),t.Line.ATTRIBUTE_NAMES=t.SHARED_ATTRIBUTES.concat("x1 y1 x2 y2".split(" ")),t.Line.fromElement=function(e,r){var i=t.parseAttributes(e,t.Line.ATTRIBUTE_NAMES),s=[i.x1||0,i.y1||0,i.x2||0,i.y2||0];return new t.Line(s,n(i,r))},t.Line.fromObject=function(e){var n=[e.x1,e.y1,e.x2,e.y2];return new t.Line(n,e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";function i(e){return"radius"in e&&e.radius>0}var t=e.fabric||(e.fabric={}),n=Math.PI,r=t.util.object.extend;if(t.Circle){t.warn("fabric.Circle is already defined.");return}t.Circle=t.util.createClass(t.Object,{type:"circle",radius:0,startAngle:0,endAngle:n*2,initialize:function(e){e=e||{},this.callSuper("initialize",e),this.set("radius",e.radius||0),this.startAngle=e.startAngle||this.startAngle,this.endAngle=e.endAngle||this.endAngle},_set:function(e,t){return this.callSuper("_set",e,t),e==="radius"&&this.setRadius(t),this},toObject:function(e){return r(this.callSuper("toObject",e),{radius:this.get("radius"),startAngle:this.startAngle,endAngle:this.endAngle})},toSVG:function(e){var t=this._createBaseSVGMarkup(),r=0,i=0,s=(this.endAngle-this.startAngle)%(2*n);if(s===0)this.group&&this.group.type==="path-group"&&(r=this.left+this.radius,i=this.top+this.radius),t.push("<circle ",'cx="'+r+'" cy="'+i+'" ','r="',this.radius,'" style="',this.getSvgStyles(),'" transform="',this.getSvgTransform()," ",this.getSvgTransformMatrix(),'"/>\n');else{var o=Math.cos(this.startAngle)*this.radius,u=Math.sin(this.startAngle)*this.radius,a=Math.cos(this.endAngle)*this.radius,f=Math.sin(this.endAngle)*this.radius,l=s>n?"1":"0";t.push('<path d="M '+o+" "+u," A "+this.radius+" "+this.radius," 0 ",+l+" 1"," "+a+" "+f,'" style="',this.getSvgStyles(),'" transform="',this.getSvgTransform()," ",this.getSvgTransformMatrix(),'"/>\n')}return e?e(t.join("")):t.join("")},_render:function(e,t){e.beginPath(),e.arc(t?this.left+this.radius:0,t?this.top+this.radius:0,this.radius,this.startAngle,this.endAngle,!1),this._renderFill(e),this._renderStroke(e)},getRadiusX:function(){return this.get("radius")*this.get("scaleX")},getRadiusY:function(){return this.get("radius")*this.get("scaleY")},setRadius:function(e){this.radius=e,this.set("width",e*2).set("height",e*2)},complexity:function(){return 1}}),t.Circle.ATTRIBUTE_NAMES=t.SHARED_ATTRIBUTES.concat("cx cy r".split(" ")),t.Circle.fromElement=function(e,n){n||(n={});var s=t.parseAttributes(e,t.Circle.ATTRIBUTE_NAMES);if(!i(s))throw new Error("value of `r` attribute is required and can not be negative");s.left=s.left||0,s.top=s.top||0;var o=new t.Circle(r(s,n));return o.left-=o.radius,o.top-=o.radius,o},t.Circle.fromObject=function(e){return new t.Circle(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={});if(t.Triangle){t.warn("fabric.Triangle is already defined");return}t.Triangle=t.util.createClass(t.Object,{type:"triangle",initialize:function(e){e=e||{},this.callSuper("initialize",e),this.set("width",e.width||100).set("height",e.height||100)},_render:function(e){var t=this.width/2,n=this.height/2;e.beginPath(),e.moveTo(-t,n),e.lineTo(0,-n),e.lineTo(t,n),e.closePath(),this._renderFill(e),this._renderStroke(e)},_renderDashedStroke:function(e){var n=this.width/2,r=this.height/2;e.beginPath(),t.util.drawDashedLine(e,-n,r,0,-r,this.strokeDashArray),t.util.drawDashedLine(e,0,-r,n,r,this.strokeDashArray),t.util.drawDashedLine(e,n,r,-n,r,this.strokeDashArray),e.closePath()},toSVG:function(e){var t=this._createBaseSVGMarkup(),n=this.width/2,r=this.height/2,i=[-n+" "+r,"0 "+ -r,n+" "+r].join(",");return t.push("<polygon ",'points="',i,'" style="',this.getSvgStyles(),'" transform="',this.getSvgTransform(),'"/>'),e?e(t.join("")):t.join("")},complexity:function(){return 1}}),t.Triangle.fromObject=function(e){return new t.Triangle(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=Math.PI*2,r=t.util.object.extend;if(t.Ellipse){t.warn("fabric.Ellipse is already defined.");return}t.Ellipse=t.util.createClass(t.Object,{type:"ellipse",rx:0,ry:0,initialize:function(e){e=e||{},this.callSuper("initialize",e),this.set("rx",e.rx||0),this.set("ry",e.ry||0)},_set:function(e,t){this.callSuper("_set",e,t);switch(e){case"rx":this.rx=t,this.set("width",t*2);break;case"ry":this.ry=t,this.set("height",t*2)}return this},getRx:function(){return this.get("rx")*this.get("scaleX")},getRy:function(){return this.get("ry")*this.get("scaleY")},toObject:function(e){return r(this.callSuper("toObject",e),{rx:this.get("rx"),ry:this.get("ry")})},toSVG:function(e){var t=this._createBaseSVGMarkup(),n=0,r=0;return this.group&&this.group.type==="path-group"&&(n=this.left+this.rx,r=this.top+this.ry),t.push("<ellipse ",'cx="',n,'" cy="',r,'" ','rx="',this.rx,'" ry="',this.ry,'" style="',this.getSvgStyles(),'" transform="',this.getSvgTransform(),this.getSvgTransformMatrix(),'"/>\n'),e?e(t.join("")):t.join("")},_render:function(e,t){e.beginPath(),e.save(),e.transform(1,0,0,this.ry/this.rx,0,0),e.arc(t?this.left+this.rx:0,t?(this.top+this.ry)*this.rx/this.ry:0,this.rx,0,n,!1),e.restore(),this._renderFill(e),this._renderStroke(e)},complexity:function(){return 1}}),t.Ellipse.ATTRIBUTE_NAMES=t.SHARED_ATTRIBUTES.concat("cx cy rx ry".split(" ")),t.Ellipse.fromElement=function(e,n){n||(n={});var i=t.parseAttributes(e,t.Ellipse.ATTRIBUTE_NAMES);i.left=i.left||0,i.top=i.top||0;var s=new t.Ellipse(r(i,n));return s.top-=s.ry,s.left-=s.rx,s},t.Ellipse.fromObject=function(e){return new t.Ellipse(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend;if(t.Rect){console.warn("fabric.Rect is already defined");return}var r=t.Object.prototype.stateProperties.concat();r.push("rx","ry","x","y"),t.Rect=t.util.createClass(t.Object,{stateProperties:r,type:"rect",rx:0,ry:0,strokeDashArray:null,initialize:function(e){e=e||{},this.callSuper("initialize",e),this._initRxRy()},_initRxRy:function(){this.rx&&!this.ry?this.ry=this.rx:this.ry&&!this.rx&&(this.rx=this.ry)},_render:function(e,t){if(this.width===1&&this.height===1){e.fillRect(0,0,1,1);return}var n=this.rx?Math.min(this.rx,this.width/2):0,r=this.ry?Math.min(this.ry,this.height/2):0,i=this.width,s=this.height,o=t?this.left:-this.width/2,u=t?this.top:-this.height/2,a=n!==0||r!==0,f=.4477152502;e.beginPath(),e.moveTo(o+n,u),e.lineTo(o+i-n,u),a&&e.bezierCurveTo(o+i-f*n,u,o+i,u+f*r,o+i,u+r),e.lineTo(o+i,u+s-r),a&&e.bezierCurveTo(o+i,u+s-f*r,o+i-f*n,u+s,o+i-n,u+s),e.lineTo(o+n,u+s),a&&e.bezierCurveTo(o+f*n,u+s,o,u+s-f*r,o,u+s-r),e.lineTo(o,u+r),a&&e.bezierCurveTo(o,u+f*r,o+f*n,u,o+n,u),e.closePath(),this._renderFill(e),this._renderStroke(e)},_renderDashedStroke:function(e){var n=-this.width/2,r=-this.height/2,i=this.width,s=this.height;e.beginPath(),t.util.drawDashedLine(e,n,r,n+i,r,this.strokeDashArray),t.util.drawDashedLine(e,n+i,r,n+i,r+s,this.strokeDashArray),t.util.drawDashedLine(e,n+i,r+s,n,r+s,this.strokeDashArray),t.util.drawDashedLine(e,n,r+s,n,r,this.strokeDashArray),e.closePath()},toObject:function(e){var t=n(this.callSuper("toObject",e),{rx:this.get("rx")||0,ry:this.get("ry")||0});return this.includeDefaultValues||this._removeDefaultValues(t),t},toSVG:function(e){var t=this._createBaseSVGMarkup(),n=this.left,r=this.top;if(!this.group||this.group.type!=="path-group")n=-this.width/2,r=-this.height/2;return t.push("<rect ",'x="',n,'" y="',r,'" rx="',this.get("rx"),'" ry="',this.get("ry"),'" width="',this.width,'" height="',this.height,'" style="',this.getSvgStyles(),'" transform="',this.getSvgTransform(),this.getSvgTransformMatrix(),'"/>\n'),e?e(t.join("")):t.join("")},complexity:function(){return 1}}),t.Rect.ATTRIBUTE_NAMES=t.SHARED_ATTRIBUTES.concat("x y rx ry width height".split(" ")),t.Rect.fromElement=function(e,r){if(!e)return null;r=r||{};var i=t.parseAttributes(e,t.Rect.ATTRIBUTE_NAMES);return i.left=i.left||0,i.top=i.top||0,new t.Rect(n(r?t.util.object.clone(r):{},i))},t.Rect.fromObject=function(e){return new t.Rect(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={});if(t.Polyline){t.warn("fabric.Polyline is already defined");return}t.Polyline=t.util.createClass(t.Object,{type:"polyline",points:null,minX:0,minY:0,initialize:function(e,n){return t.Polygon.prototype.initialize.call(this,e,n)},_calcDimensions:function(){return t.Polygon.prototype._calcDimensions.call(this)},_applyPointOffset:function(){return t.Polygon.prototype._applyPointOffset.call(this)},toObject:function(e){return t.Polygon.prototype.toObject.call(this,e)},toSVG:function(e){return t.Polygon.prototype.toSVG.call(this,e)},_render:function(e){t.Polygon.prototype.commonRender.call(this,e),this._renderFill(e),this._renderStroke(e)},_renderDashedStroke:function(e){var n,r;e.beginPath();for(var i=0,s=this.points.length;i<s;i++)n=this.points[i],r=this.points[i+1]||n,t.util.drawDashedLine(e,n.x,n.y,r.x,r.y,this.strokeDashArray)},complexity:function(){return this.get("points").length}}),t.Polyline.ATTRIBUTE_NAMES=t.SHARED_ATTRIBUTES.concat(),t.Polyline.fromElement=function(e,n){if(!e)return null;n||(n={});var r=t.parsePointsAttribute(e.getAttribute("points")),i=t.parseAttributes(e,t.Polyline.ATTRIBUTE_NAMES);return r===null?null:new t.Polyline(r,t.util.object.extend(i,n))},t.Polyline.fromObject=function(e){var n=e.points;return new t.Polyline(n,e,!0)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend,r=t.util.array.min,i=t.util.array.max,s=t.util.toFixed;if(t.Polygon){t.warn("fabric.Polygon is already defined");return}t.Polygon=t.util.createClass(t.Object,{type:"polygon",points:null,minX:0,minY:0,initialize:function(e,t){t=t||{},this.points=e,this.callSuper("initialize",t),this._calcDimensions(),"top"in t||(this.top=this.minY),"left"in t||(this.left=this.minX)},_calcDimensions:function(){var e=this.points,t=r(e,"x"),n=r(e,"y"),s=i(e,"x"),o=i(e,"y");this.width=s-t||1,this.height=o-n||1,this.minX=t,this.minY=n},_applyPointOffset:function(){this.points.forEach(function(e){e.x-=this.minX+this.width/2,e.y-=this.minY+this.height/2},this)},toObject:function(e){return n(this.callSuper("toObject",e),{points:this.points.concat()})},toSVG:function(e){var t=[],n=this._createBaseSVGMarkup();for(var r=0,i=this.points.length;r<i;r++)t.push(s(this.points[r].x,2),",",s(this.points[r].y,2)," ");return n.push("<",this.type," ",'points="',t.join(""),'" style="',this.getSvgStyles(),'" transform="',this.getSvgTransform()," ",this.getSvgTransformMatrix(),'"/>\n'),e?e(n.join("")):n.join("")},_render:function(e){this.commonRender(e),this._renderFill(e);if(this.stroke||this.strokeDashArray)e.closePath(),this._renderStroke(e)},commonRender:function(e){var t;e.beginPath(),this._applyPointOffset&&((!this.group||this.group.type!=="path-group")&&this._applyPointOffset(),this._applyPointOffset=null),e.moveTo(this.points[0].x,this.points[0].y);for(var n=0,r=this.points.length;n<r;n++)t=this.points[n],e.lineTo(t.x,t.y)},_renderDashedStroke:function(e){t.Polyline.prototype._renderDashedStroke.call(this,e),e.closePath()},complexity:function(){return this.points.length}}),t.Polygon.ATTRIBUTE_NAMES=t.SHARED_ATTRIBUTES.concat(),t.Polygon.fromElement=function(e,r){if(!e)return null;r||(r={});var i=t.parsePointsAttribute(e.getAttribute("points")),s=t.parseAttributes(e,t.Polygon.ATTRIBUTE_NAMES);return i===null?null:new t.Polygon(i,n(s,r))},t.Polygon.fromObject=function(e){return new t.Polygon(e.points,e,!0)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.array.min,r=t.util.array.max,i=t.util.object.extend,s=Object.prototype.toString,o=t.util.drawArc,u={m:2,l:2,h:1,v:1,c:6,s:4,q:4,t:2,a:7},a={m:"l",M:"L"};if(t.Path){t.warn("fabric.Path is already defined");return}t.Path=t.util.createClass(t.Object,{type:"path",path:null,minX:0,minY:0,initialize:function(e,t){t=t||{},this.setOptions(t);if(!e)throw new Error("`path` argument is required");var n=s.call(e)==="[object Array]";this.path=n?e:e.match&&e.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi);if(!this.path)return;n||(this.path=this._parsePath());var r=this._parseDimensions();this.minX=r.left,this.minY=r.top,this.width=r.width,this.height=r.height,r.left+=this.originX==="center"?this.width/2:this.originX==="right"?this.width:0,r.top+=this.originY==="center"?this.height/2:this.originY==="bottom"?this.height:0,this.top=this.top||r.top,this.left=this.left||r.left,this.pathOffset=this.pathOffset||{x:this.minX+this.width/2,y:this.minY+this.height/2},t.sourcePath&&this.setSourcePath(t.sourcePath)},_render:function(e){var t,n=null,r=0,i=0,s=0,u=0,a=0,f=0,l,c,h,p,d=-this.pathOffset.x,v=-this.pathOffset.y;this.group&&this.group.type==="path-group"&&(d=0,v=0),e.beginPath();for(var m=0,g=this.path.length;m<g;++m){t=this.path[m];switch(t[0]){case"l":s+=t[1],u+=t[2],e.lineTo(s+d,u+v);break;case"L":s=t[1],u=t[2],e.lineTo(s+d,u+v);break;case"h":s+=t[1],e.lineTo(s+d,u+v);break;case"H":s=t[1],e.lineTo(s+d,u+v);break;case"v":u+=t[1],e.lineTo(s+d,u+v);break;case"V":u=t[1],e.lineTo(s+d,u+v);break;case"m":s+=t[1],u+=t[2],r=s,i=u,e.moveTo(s+d,u+v);break;case"M":s=t[1],u=t[2],r=s,i=u,e.moveTo(s+d,u+v);break;case"c":l=s+t[5],c=u+t[6],a=s+t[3],f=u+t[4],e.bezierCurveTo(s+t[1]+d,u+t[2]+v,a+d,f+v,l+d,c+v),s=l,u=c;break;case"C":s=t[5],u=t[6],a=t[3],f=t[4],e.bezierCurveTo(t[1]+d,t[2]+v,a+d,f+v,s+d,u+v);break;case"s":l=s+t[3],c=u+t[4],a=a?2*s-a:s,f=f?2*u-f:u,e.bezierCurveTo(a+d,f+v,s+t[1]+d,u+t[2]+v,l+d,c+v),a=s+t[1],f=u+t[2],s=l,u=c;break;case"S":l=t[3],c=t[4],a=2*s-a,f=2*u-f,e.bezierCurveTo(a+d,f+v,t[1]+d,t[2]+v,l+d,c+v),s=l,u=c,a=t[1],f=t[2];break;case"q":l=s+t[3],c=u+t[4],a=s+t[1],f=u+t[2],e.quadraticCurveTo(a+d,f+v,l+d,c+v),s=l,u=c;break;case"Q":l=t[3],c=t[4],e.quadraticCurveTo(t[1]+d,t[2]+v,l+d,c+v),s=l,u=c,a=t[1],f=t[2];break;case"t":l=s+t[1],c=u+t[2],n[0].match(/[QqTt]/)===null?(a=s,f=u):n[0]==="t"?(a=2*s-h,f=2*u-p):n[0]==="q"&&(a=2*s-a,f=2*u-f),h=a,p=f,e.quadraticCurveTo(a+d,f+v,l+d,c+v),s=l,u=c,a=s+t[1],f=u+t[2];break;case"T":l=t[1],c=t[2],a=2*s-a,f=2*u-f,e.quadraticCurveTo(a+d,f+v,l+d,c+v),s=l,u=c;break;case"a":o(e,s+d,u+v,[t[1],t[2],t[3],t[4],t[5],t[6]+s+d,t[7]+u+v]),s+=t[6],u+=t[7];break;case"A":o(e,s+d,u+v,[t[1],t[2],t[3],t[4],t[5],t[6]+d,t[7]+v]),s=t[6],u=t[7];break;case"z":case"Z":s=r,u=i,e.closePath()}n=t}this._renderFill(e),this._renderStroke(e)},render:function(e,n){if(!this.visible)return;e.save(),this._setupCompositeOperation(e),n||this.transform(e),this._setStrokeStyles(e),this._setFillStyles(e),this.group&&this.group.type==="path-group"&&e.translate(-this.group.width/2,-this.group.height/2),this.transformMatrix&&e.transform.apply(e,this.transformMatrix),this._setOpacity(e),this._setShadow(e),this.clipTo&&t.util.clipContext(this,e),this._render(e,n),this.clipTo&&e.restore(),this._removeShadow(e),this._restoreCompositeOperation(e),e.restore()},toString:function(){return"#<fabric.Path ("+this.complexity()+'): { "top": '+this.top+', "left": '+this.left+" }>"},toObject:function(e){var t=i(this.callSuper("toObject",e),{path:this.path.map(function(e){return e.slice()}),pathOffset:this.pathOffset});return this.sourcePath&&(t.sourcePath=this.sourcePath),this.transformMatrix&&(t.transformMatrix=this.transformMatrix),t},toDatalessObject:function(e){var t=this.toObject(e);return this.sourcePath&&(t.path=this.sourcePath),delete t.sourcePath,t},toSVG:function(e){var t=[],n=this._createBaseSVGMarkup(),r="";for(var i=0,s=this.path.length;i<s;i++)t.push(this.path[i].join(" "));var o=t.join(" ");if(!this.group||this.group.type!=="path-group")r="translate("+ -this.pathOffset.x+", "+ -this.pathOffset.y+")";return n.push("<path ",'d="',o,'" style="',this.getSvgStyles(),'" transform="',this.getSvgTransform(),r,this.getSvgTransformMatrix(),'" stroke-linecap="round" ',"/>\n"),e?e(n.join("")):n.join("")},complexity:function(){return this.path.length},_parsePath:function(){var e=[],t=[],n,r,i=/([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/ig,s,o;for(var f=0,l,c=this.path.length;f<c;f++){n=this.path[f],o=n.slice(1).trim(),t.length=0;while(s=i.exec(o))t.push(s[0]);l=[n.charAt(0)];for(var h=0,p=t.length;h<p;h++)r=parseFloat(t[h]),isNaN(r)||l.push(r);var d=l[0],v=u[d.toLowerCase()],m=a[d]||d;if(l.length-1>v)for(var g=1,y=l.length;g<y;g+=v)e.push([d].concat(l.slice(g,g+v))),d=m;else e.push(l)}return e},_parseDimensions:function(){var e=[],i=[],s,o=null,u=0,a=0,f=0,l=0,c=0,h=0,p,d,v,m,g;for(var y=0,b=this.path.length;y<b;++y){s=this.path[y];switch(s[0]){case"l":f+=s[1],l+=s[2],g=[];break;case"L":f=s[1],l=s[2],g=[];break;case"h":f+=s[1],g=[];break;case"H":f=s[1],g=[];break;case"v":l+=s[1],g=[];break;case"V":l=s[1],g=[];break;case"m":f+=s[1],l+=s[2],u=f,a=l,g=[];break;case"M":f=s[1],l=s[2],u=f,a=l,g=[];break;case"c":p=f+s[5],d=l+s[6],c=f+s[3],h=l+s[4],g=t.util.getBoundsOfCurve(f,l,f+s[1],l+s[2],c,h,p,d),f=p,l=d;break;case"C":f=s[5],l=s[6],c=s[3],h=s[4],g=t.util.getBoundsOfCurve(f,l,s[1],s[2],c,h,f,l);break;case"s":p=f+s[3],d=l+s[4],c=c?2*f-c:f,h=h?2*l-h:l,g=t.util.getBoundsOfCurve(f,l,c,h,f+s[1],l+s[2],p,d),c=f+s[1],h=l+s[2],f=p,l=d;break;case"S":p=s[3],d=s[4],c=2*f-c,h=2*l-h,g=t.util.getBoundsOfCurve(f,l,c,h,s[1],s[2],p,d),f=p,l=d,c=s[1],h=s[2];break;case"q":p=f+s[3],d=l+s[4],c=f+s[1],h=l+s[2],g=t.util.getBoundsOfCurve(f,l,c,h,c,h,p,d),f=p,l=d;break;case"Q":c=s[1],h=s[2],g=t.util.getBoundsOfCurve(f,l,c,h,c,h,s[3],s[4]),f=s[3],l=s[4];break;case"t":p=f+s[1],d=l+s[2],o[0].match(/[QqTt]/)===null?(c=f,h=l):o[0]==="t"?(c=2*f-v,h=2*l-m):o[0]==="q"&&(c=2*f-c,h=2*l-h),v=c,m=h,g=t.util.getBoundsOfCurve(f,l,c,h,c,h,p,d),f=p,l=d,c=f+s[1],h=l+s[2];break;case"T":p=s[1],d=s[2],c=2*f-c,h=2*l-h,g=t.util.getBoundsOfCurve(f,l,c,h,c,h,p,d),f=p,l=d;break;case"a":g=t.util.getBoundsOfArc(f,l,s[1],s[2],s[3],s[4],s[5],s[6]+f,s[7]+l),f+=s[6],l+=s[7];break;case"A":g=t.util.getBoundsOfArc(f,l,s[1],s[2],s[3],s[4],s[5],s[6],s[7]),f=s[6],l=s[7];break;case"z":case"Z":f=u,l=a}o=s,g.forEach(function(t){e.push(t.x),i.push(t.y)}),e.push(f),i.push(l)}var w=n(e),E=n(i),S=r(e),x=r(i),T=S-w,N=x-E,C={left:w,top:E,width:T,height:N};return C}}),t.Path.fromObject=function(e,n){typeof e.path=="string"?t.loadSVGFromURL(e.path,function(r){var i=r[0],s=e.path;delete e.path,t.util.object.extend(i,e),i.setSourcePath(s),n(i)}):n(new t.Path(e.path,e))},t.Path.ATTRIBUTE_NAMES=t.SHARED_ATTRIBUTES.concat(["d"]),t.Path.fromElement=function(e,n,r){var s=t.parseAttributes(e,t.Path.ATTRIBUTE_NAMES);n&&n(new t.Path(s.d,i(s,r)))},t.Path.async=!0}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend,r=t.util.array.invoke,i=t.Object.prototype.toObject;if(t.PathGroup){t.warn("fabric.PathGroup is already defined");return}t.PathGroup=t.util.createClass(t.Path,{type:"path-group",fill:"",initialize:function(e,t){t=t||{},this.paths=e||[];for(var n=this.paths.length;n--;)this.paths[n].group=this;this.setOptions(t),t.widthAttr&&(this.scaleX=t.widthAttr/t.width),t.heightAttr&&(this.scaleY=t.heightAttr/t.height),this.setCoords(),t.sourcePath&&this.setSourcePath(t.sourcePath)},render:function(e){if(!this.visible)return;e.save();var n=this.transformMatrix;n&&e.transform(n[0],n[1],n[2],n[3],n[4],n[5]),this.transform(e),this._setShadow(e),this.clipTo&&t.util.clipContext(this,e);for(var r=0,i=this.paths.length;r<i;++r)this.paths[r].render(e,!0);this.clipTo&&e.restore(),this._removeShadow(e),e.restore()},_set:function(e,t){if(e==="fill"&&t&&this.isSameColor()){var n=this.paths.length;while(n--)this.paths[n]._set(e,t)}return this.callSuper("_set",e,t)},toObject:function(e){var t=n(i.call(this,e),{paths:r(this.getObjects(),"toObject",e)});return this.sourcePath&&(t.sourcePath=this.sourcePath),t},toDatalessObject:function(e){var t=this.toObject(e);return this.sourcePath&&(t.paths=this.sourcePath),t},toSVG:function(e){var t=this.getObjects(),n="translate("+this.left+" "+this.top+")",r=["<g ",'style="',this.getSvgStyles(),'" ','transform="',n,this.getSvgTransform(),'" ',">\n"];for(var i=0,s=t.length;i<s;i++)r.push(t[i].toSVG(e));return r.push("</g>\n"),e?e(r.join("")):r.join("")},toString:function(){return"#<fabric.PathGroup ("+this.complexity()+"): { top: "+this.top+", left: "+this.left+" }>"},isSameColor:function(){var e=(this.getObjects()[0].get("fill")||"").toLowerCase();return this.getObjects().every(function(t){return(t.get("fill")||"").toLowerCase()===e})},complexity:function(){return this.paths.reduce(function(e,t){return e+(t&&t.complexity?t.complexity():0)},0)},getObjects:function(){return this.paths}}),t.PathGroup.fromObject=function(e,n){typeof e.paths=="string"?t.loadSVGFromURL(e.paths,function(r){var i=e.paths;delete e.paths;var s=t.util.groupSVGElements(r,e,i);n(s)}):t.util.enlivenObjects(e.paths,function(r){delete e.paths,n(new t.PathGroup(r,e))})},t.PathGroup.async=!0}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend,r=t.util.array.min,i=t.util.array.max,s=t.util.array.invoke;if(t.Group)return;var o={lockMovementX:!0,lockMovementY:!0,lockRotation:!0,lockScalingX:!0,lockScalingY:!0,lockUniScaling:!0};t.Group=t.util.createClass(t.Object,t.Collection,{type:"group",initialize:function(e,t){t=t||{},this._objects=e||[];for(var r=this._objects.length;r--;)this._objects[r].group=this;this.originalState={},this.callSuper("initialize"),t.originX&&(this.originX=t.originX),t.originY&&(this.originY=t.originY),this._calcBounds(),this._updateObjectsCoords(),t&&n(this,t),this.setCoords(),this.saveCoords()},_updateObjectsCoords:function(){this.forEachObject(this._updateObjectCoords,this)},_updateObjectCoords:function(e){var t=e.getLeft(),n=e.getTop(),r=this.getCenterPoint();e.set({originalLeft:t,originalTop:n,left:t-r.x,top:n-r.y}),e.setCoords(),e.__origHasControls=e.hasControls,e.hasControls=!1},toString:function(){return"#<fabric.Group: ("+this.complexity()+")>"},addWithUpdate:function(e){return this._restoreObjectsState(),e&&(this._objects.push(e),e.group=this),this.forEachObject(this._setObjectActive,this),this._calcBounds(),this._updateObjectsCoords(),this},_setObjectActive:function(e){e.set("active",!0),e.group=this},removeWithUpdate:function(e){return this._moveFlippedObject(e),this._restoreObjectsState(),this.forEachObject(this._setObjectActive,this),this.remove(e),this._calcBounds(),this._updateObjectsCoords(),this},_onObjectAdded:function(e){e.group=this},_onObjectRemoved:function(e){delete e.group,e.set("active",!1)},delegatedProperties:{fill:!0,opacity:!0,fontFamily:!0,fontWeight:!0,fontSize:!0,fontStyle:!0,lineHeight:!0,textDecoration:!0,textAlign:!0,backgroundColor:!0},_set:function(e,t){if(e in this.delegatedProperties){var n=this._objects.length;this[e]=t;while(n--)this._objects[n].set(e,t)}else this[e]=t},toObject:function(e){return n(this.callSuper("toObject",e),{objects:s(this._objects,"toObject",e)})},render:function(e){if(!this.visible)return;e.save(),this.clipTo&&t.util.clipContext(this,e);for(var n=0,r=this._objects.length;n<r;n++)this._renderObject(this._objects[n],e);this.clipTo&&e.restore(),e.restore()},_renderControls:function(e,t){this.callSuper("_renderControls",e,t);for(var n=0,r=this._objects.length;n<r;n++)this._objects[n]._renderControls(e)},_renderObject:function(e,t){var n=e.hasRotatingPoint;if(!e.visible)return;e.hasRotatingPoint=!1,e.render(t),e.hasRotatingPoint=n},_restoreObjectsState:function(){return this._objects.forEach(this._restoreObjectState,this),this},_moveFlippedObject:function(e){var t=e.get("originX"),n=e.get("originY"),r=e.getCenterPoint();e.set({originX:"center",originY:"center",left:r.x,top:r.y}),this._toggleFlipping(e);var i=e.getPointByOrigin(t,n);return e.set({originX:t,originY:n,left:i.x,top:i.y}),this},_toggleFlipping:function(e){this.flipX&&(e.toggle("flipX"),e.set("left",-e.get("left")),e.setAngle(-e.getAngle())),this.flipY&&(e.toggle("flipY"),e.set("top",-e.get("top")),e.setAngle(-e.getAngle()))},_restoreObjectState:function(e){return this._setObjectPosition(e),e.setCoords(),e.hasControls=e.__origHasControls,delete e.__origHasControls,e.set("active",!1),e.setCoords(),delete e.group,this},_setObjectPosition:function(e){var t=this.getCenterPoint(),n=this._getRotatedLeftTop(e);e.set({angle:e.getAngle()+this.getAngle(),left:t.x+n.left,top:t.y+n.top,scaleX:e.get("scaleX")*this.get("scaleX"),scaleY:e.get("scaleY")*this.get("scaleY")})},_getRotatedLeftTop:function(e){var t=this.getAngle()*(Math.PI/180);return{left:-Math.sin(t)*e.getTop()*this.get("scaleY")+Math.cos(t)*e.getLeft()*this.get("scaleX"),top:Math.cos(t)*e.getTop()*this.get("scaleY")+Math.sin(t)*e.getLeft()*this.get("scaleX")}},destroy:function(){return this._objects.forEach(this._moveFlippedObject,this),this._restoreObjectsState()},saveCoords:function(){return this._originalLeft=this.get("left"),this._originalTop=this.get("top"),this},hasMoved:function(){return this._originalLeft!==this.get("left")||this._originalTop!==this.get("top")},setObjectsCoords:function(){return this.forEachObject(function(e){e.setCoords()}),this},_calcBounds:function(e){var t=[],n=[],r;for(var i=0,s=this._objects.length;i<s;++i){r=this._objects[i],r.setCoords();for(var o in r.oCoords)t.push(r.oCoords[o].x),n.push(r.oCoords[o].y)}this.set(this._getBounds(t,n,e))},_getBounds:function(e,n,s){var o=t.util.invertTransform(this.getViewportTransform()),u=t.util.transformPoint(new t.Point(r(e),r(n)),o),a=t.util.transformPoint(new t.Point(i(e),i(n)),o),f={width:a.x-u.x||0,height:a.y-u.y||0};return s||(f.left=u.x||0,f.top=u.y||0,this.originX==="center"&&(f.left+=f.width/2),this.originX==="right"&&(f.left+=f.width),this.originY==="center"&&(f.top+=f.height/2),this.originY==="bottom"&&(f.top+=f.height)),f},toSVG:function(e){var t=["<g ",'transform="',this.getSvgTransform(),'">\n'];for(var n=0,r=this._objects.length;n<r;n++)t.push(this._objects[n].toSVG(e));return t.push("</g>\n"),e?e(t.join("")):t.join("")},get:function(e){if(e in o){if(this[e])return this[e];for(var t=0,n=this._objects.length;t<n;t++)if(this._objects[t][e])return!0;return!1}return e in this.delegatedProperties?this._objects[0]&&this._objects[0].get(e):this[e]}}),t.Group.fromObject=function(e,n){t.util.enlivenObjects(e.objects,function(r){delete e.objects,n&&n(new t.Group(r,e))})},t.Group.async=!0}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=fabric.util.object.extend;e.fabric||(e.fabric={});if(e.fabric.Image){fabric.warn("fabric.Image is already defined.");return}fabric.Image=fabric.util.createClass(fabric.Object,{type:"image",crossOrigin:"",alignX:"none",alignY:"none",meetOrSlice:"meet",_lastScaleX:1,_lastScaleY:1,initialize:function(e,t){t||(t={}),this.filters=[],this.resizeFilters=[],this.callSuper("initialize",t),this._initElement(e,t),this._initConfig(t),t.filters&&(this.filters=t.filters,this.applyFilters())},getElement:function(){return this._element},setElement:function(e,t,n){return this._element=e,this._originalElement=e,this._initConfig(n),this.filters.length!==0?this.applyFilters(t):t&&t(),this},setCrossOrigin:function(e){return this.crossOrigin=e,this._element.crossOrigin=e,this},getOriginalSize:function(){var e=this.getElement();return{width:e.width,height:e.height}},_stroke:function(e){e.save(),this._setStrokeStyles(e),e.beginPath(),e.strokeRect(-this.width/2,-this.height/2,this.width,this.height),e.closePath(),e.restore()},_renderDashedStroke:function(e){var t=-this.width/2,n=-this.height/2,r=this.width,i=this.height;e.save(),this._setStrokeStyles(e),e.beginPath(),fabric.util.drawDashedLine(e,t,n,t+r,n,this.strokeDashArray),fabric.util.drawDashedLine(e,t+r,n,t+r,n+i,this.strokeDashArray),fabric.util.drawDashedLine(e,t+r,n+i,t,n+i,this.strokeDashArray),fabric.util.drawDashedLine(e,t,n+i,t,n,this.strokeDashArray),e.closePath(),e.restore()},toObject:function(e){return t(this.callSuper("toObject",e),{src:this._originalElement.src||this._originalElement._src,filters:this.filters.map(function(e){return e&&e.toObject()}),crossOrigin:this.crossOrigin,alignX:this.alignX,alignY:this.alignY,meetOrSlice:this.meetOrSlice})},toSVG:function(e){var t=[],n=-this.width/2,r=-this.height/2,i="none";this.group&&this.group.type==="path-group"&&(n=this.left,r=this.top),this.alignX!=="none"&&this.alignY!=="none"&&(i="x"+this.alignX+"Y"+this.alignY+" "+this.meetOrSlice),t.push('<g transform="',this.getSvgTransform(),this.getSvgTransformMatrix(),'">\n','<image xlink:href="',this.getSvgSrc(),'" x="',n,'" y="',r,'" style="',this.getSvgStyles(),'" width="',this.width,'" height="',this.height,'" preserveAspectRatio="',i,'"',"></image>\n");if(this.stroke||this.strokeDashArray){var s=this.fill;this.fill=null,t.push("<rect ",'x="',n,'" y="',r,'" width="',this.width,'" height="',this.height,'" style="',this.getSvgStyles(),'"/>\n'),this.fill=s}return t.push("</g>\n"),e?e(t.join("")):t.join("")},getSrc:function(){if(this.getElement())return this.getElement().src||this.getElement()._src},setSrc:function(e,t,n){fabric.util.loadImage(e,function(e){return this.setElement(e,t,n)},this,n&&n.crossOrigin)},toString:function(){return'#<fabric.Image: { src: "'+this.getSrc()+'" }>'},clone:function(e,t){this.constructor.fromObject(this.toObject(t),e)},applyFilters:function(e,t,n,r){t=t||this.filters,n=n||this._originalElement;if(!n)return;var i=n,s=fabric.util.createCanvasElement(),o=fabric.util.createImage(),u=this;return s.width=i.width,s.height=i.height,s.getContext("2d").drawImage(i,0,0,i.width,i.height),t.length===0?(this._element=n,e&&e(),s):(t.forEach(function(e){e&&e.applyTo(s,e.scaleX||u.scaleX,e.scaleY||u.scaleY),!r&&e.type==="Resize"&&(u.width*=e.scaleX,u.height*=e.scaleY)}),o.width=s.width,o.height=s.height,fabric.isLikelyNode?(o.src=s.toBuffer(undefined,fabric.Image.pngCompression),u._element=o,!r&&(u._filteredEl=o),e&&e()):(o.onload=function(){u._element=o,!r&&(u._filteredEl=o),e&&e(),o.onload=s=i=null},o.src=s.toDataURL("image/png")),s)},_render:function(e,t){var n,r,i=this._findMargins(),s;n=t?this.left:-this.width/2,r=t?this.top:-this.height/2,this.meetOrSlice==="slice"&&(e.beginPath(),e.rect(n,r,this.width,this.height),e.clip()),this.isMoving===!1&&this.resizeFilters.length&&this._needsResize()?(this._lastScaleX=this.scaleX,this._lastScaleY=this.scaleY,s=this.applyFilters(null,this.resizeFilters,this._filteredEl||this._originalElement,!1)):s=this._element,s&&e.drawImage(s,n+i.marginX,r+i.marginY,i.width,i.height),this._renderStroke(e)},_needsResize:function(){return this.scaleX!==this._lastScaleX||this.scaleY!==this._lastScaleY},_findMargins:function(){var e=this.width,t=this.height,n,r,i=0,s=0;if(this.alignX!=="none"||this.alignY!=="none")n=[this.width/this._element.width,this.height/this._element.height],r=this.meetOrSlice==="meet"?Math.min.apply(null,n):Math.max.apply(null,n),e=this._element.width*r,t=this._element.height*r,this.alignX==="Mid"&&(i=(this.width-e)/2),this.alignX==="Max"&&(i=this.width-e),this.alignY==="Mid"&&(s=(this.height-t)/2),this.alignY==="Max"&&(s=this.height-
t);return{width:e,height:t,marginX:i,marginY:s}},_resetWidthHeight:function(){var e=this.getElement();this.set("width",e.width),this.set("height",e.height)},_initElement:function(e){this.setElement(fabric.util.getById(e)),fabric.util.addClass(this.getElement(),fabric.Image.CSS_CANVAS)},_initConfig:function(e){e||(e={}),this.setOptions(e),this._setWidthHeight(e),this._element&&this.crossOrigin&&(this._element.crossOrigin=this.crossOrigin)},_initFilters:function(e,t){e.filters&&e.filters.length?fabric.util.enlivenObjects(e.filters,function(e){t&&t(e)},"fabric.Image.filters"):t&&t()},_setWidthHeight:function(e){this.width="width"in e?e.width:this.getElement()?this.getElement().width||0:0,this.height="height"in e?e.height:this.getElement()?this.getElement().height||0:0},complexity:function(){return 1}}),fabric.Image.CSS_CANVAS="canvas-img",fabric.Image.prototype.getSvgSrc=fabric.Image.prototype.getSrc,fabric.Image.fromObject=function(e,t){fabric.util.loadImage(e.src,function(n){fabric.Image.prototype._initFilters.call(e,e,function(r){e.filters=r||[];var i=new fabric.Image(n,e);t&&t(i)})},null,e.crossOrigin)},fabric.Image.fromURL=function(e,t,n){fabric.util.loadImage(e,function(e){t(new fabric.Image(e,n))},null,n&&n.crossOrigin)},fabric.Image.ATTRIBUTE_NAMES=fabric.SHARED_ATTRIBUTES.concat("x y width height preserveAspectRatio xlink:href".split(" ")),fabric.Image.fromElement=function(e,n,r){var i=fabric.parseAttributes(e,fabric.Image.ATTRIBUTE_NAMES),s="xMidYMid",o="meet",u,a,f;i.preserveAspectRatio&&(f=i.preserveAspectRatio.split(" ")),f&&f.length&&(o=f.pop(),o!=="meet"&&o!=="slice"?(s=o,o="meet"):f.length&&(s=f.pop())),u=s!=="none"?s.slice(1,4):"none",a=s!=="none"?s.slice(5,8):"none",i.alignX=u,i.alignY=a,i.meetOrSlice=o,fabric.Image.fromURL(i["xlink:href"],n,t(r?fabric.util.object.clone(r):{},i))},fabric.Image.async=!0,fabric.Image.pngCompression=1}(typeof exports!="undefined"?exports:this),fabric.util.object.extend(fabric.Object.prototype,{_getAngleValueForStraighten:function(){var e=this.getAngle()%360;return e>0?Math.round((e-1)/90)*90:Math.round(e/90)*90},straighten:function(){return this.setAngle(this._getAngleValueForStraighten()),this},fxStraighten:function(e){e=e||{};var t=function(){},n=e.onComplete||t,r=e.onChange||t,i=this;return fabric.util.animate({startValue:this.get("angle"),endValue:this._getAngleValueForStraighten(),duration:this.FX_DURATION,onChange:function(e){i.setAngle(e),r()},onComplete:function(){i.setCoords(),n()},onStart:function(){i.set("active",!1)}}),this}}),fabric.util.object.extend(fabric.StaticCanvas.prototype,{straightenObject:function(e){return e.straighten(),this.renderAll(),this},fxStraightenObject:function(e){return e.fxStraighten({onChange:this.renderAll.bind(this)}),this}}),fabric.Image.filters=fabric.Image.filters||{},fabric.Image.filters.BaseFilter=fabric.util.createClass({type:"BaseFilter",initialize:function(e){e&&this.setOptions(e)},setOptions:function(e){for(var t in e)this[t]=e[t]},toObject:function(){return{type:this.type}},toJSON:function(){return this.toObject()}}),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend;t.Image.filters.Brightness=t.util.createClass(t.Image.filters.BaseFilter,{type:"Brightness",initialize:function(e){e=e||{},this.brightness=e.brightness||0},applyTo:function(e){var t=e.getContext("2d"),n=t.getImageData(0,0,e.width,e.height),r=n.data,i=this.brightness;for(var s=0,o=r.length;s<o;s+=4)r[s]+=i,r[s+1]+=i,r[s+2]+=i;t.putImageData(n,0,0)},toObject:function(){return n(this.callSuper("toObject"),{brightness:this.brightness})}}),t.Image.filters.Brightness.fromObject=function(e){return new t.Image.filters.Brightness(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend;t.Image.filters.Convolute=t.util.createClass(t.Image.filters.BaseFilter,{type:"Convolute",initialize:function(e){e=e||{},this.opaque=e.opaque,this.matrix=e.matrix||[0,0,0,0,1,0,0,0,0];var n=t.util.createCanvasElement();this.tmpCtx=n.getContext("2d")},_createImageData:function(e,t){return this.tmpCtx.createImageData(e,t)},applyTo:function(e){var t=this.matrix,n=e.getContext("2d"),r=n.getImageData(0,0,e.width,e.height),i=Math.round(Math.sqrt(t.length)),s=Math.floor(i/2),o=r.data,u=r.width,a=r.height,f=u,l=a,c=this._createImageData(f,l),h=c.data,p=this.opaque?1:0;for(var d=0;d<l;d++)for(var v=0;v<f;v++){var m=d,g=v,y=(d*f+v)*4,b=0,w=0,E=0,S=0;for(var x=0;x<i;x++)for(var T=0;T<i;T++){var N=m+x-s,C=g+T-s;if(N<0||N>a||C<0||C>u)continue;var k=(N*u+C)*4,L=t[x*i+T];b+=o[k]*L,w+=o[k+1]*L,E+=o[k+2]*L,S+=o[k+3]*L}h[y]=b,h[y+1]=w,h[y+2]=E,h[y+3]=S+p*(255-S)}n.putImageData(c,0,0)},toObject:function(){return n(this.callSuper("toObject"),{opaque:this.opaque,matrix:this.matrix})}}),t.Image.filters.Convolute.fromObject=function(e){return new t.Image.filters.Convolute(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend;t.Image.filters.GradientTransparency=t.util.createClass(t.Image.filters.BaseFilter,{type:"GradientTransparency",initialize:function(e){e=e||{},this.threshold=e.threshold||100},applyTo:function(e){var t=e.getContext("2d"),n=t.getImageData(0,0,e.width,e.height),r=n.data,i=this.threshold,s=r.length;for(var o=0,u=r.length;o<u;o+=4)r[o+3]=i+255*(s-o)/s;t.putImageData(n,0,0)},toObject:function(){return n(this.callSuper("toObject"),{threshold:this.threshold})}}),t.Image.filters.GradientTransparency.fromObject=function(e){return new t.Image.filters.GradientTransparency(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={});t.Image.filters.Grayscale=t.util.createClass(t.Image.filters.BaseFilter,{type:"Grayscale",applyTo:function(e){var t=e.getContext("2d"),n=t.getImageData(0,0,e.width,e.height),r=n.data,i=n.width*n.height*4,s=0,o;while(s<i)o=(r[s]+r[s+1]+r[s+2])/3,r[s]=o,r[s+1]=o,r[s+2]=o,s+=4;t.putImageData(n,0,0)}}),t.Image.filters.Grayscale.fromObject=function(){return new t.Image.filters.Grayscale}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={});t.Image.filters.Invert=t.util.createClass(t.Image.filters.BaseFilter,{type:"Invert",applyTo:function(e){var t=e.getContext("2d"),n=t.getImageData(0,0,e.width,e.height),r=n.data,i=r.length,s;for(s=0;s<i;s+=4)r[s]=255-r[s],r[s+1]=255-r[s+1],r[s+2]=255-r[s+2];t.putImageData(n,0,0)}}),t.Image.filters.Invert.fromObject=function(){return new t.Image.filters.Invert}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend;t.Image.filters.Mask=t.util.createClass(t.Image.filters.BaseFilter,{type:"Mask",initialize:function(e){e=e||{},this.mask=e.mask,this.channel=[0,1,2,3].indexOf(e.channel)>-1?e.channel:0},applyTo:function(e){if(!this.mask)return;var n=e.getContext("2d"),r=n.getImageData(0,0,e.width,e.height),i=r.data,s=this.mask.getElement(),o=t.util.createCanvasElement(),u=this.channel,a,f=r.width*r.height*4;o.width=s.width,o.height=s.height,o.getContext("2d").drawImage(s,0,0,s.width,s.height);var l=o.getContext("2d").getImageData(0,0,s.width,s.height),c=l.data;for(a=0;a<f;a+=4)i[a+3]=c[a+u];n.putImageData(r,0,0)},toObject:function(){return n(this.callSuper("toObject"),{mask:this.mask.toObject(),channel:this.channel})}}),t.Image.filters.Mask.fromObject=function(e,n){t.util.loadImage(e.mask.src,function(r){e.mask=new t.Image(r,e.mask),n&&n(new t.Image.filters.Mask(e))})},t.Image.filters.Mask.async=!0}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend;t.Image.filters.Noise=t.util.createClass(t.Image.filters.BaseFilter,{type:"Noise",initialize:function(e){e=e||{},this.noise=e.noise||0},applyTo:function(e){var t=e.getContext("2d"),n=t.getImageData(0,0,e.width,e.height),r=n.data,i=this.noise,s;for(var o=0,u=r.length;o<u;o+=4)s=(.5-Math.random())*i,r[o]+=s,r[o+1]+=s,r[o+2]+=s;t.putImageData(n,0,0)},toObject:function(){return n(this.callSuper("toObject"),{noise:this.noise})}}),t.Image.filters.Noise.fromObject=function(e){return new t.Image.filters.Noise(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend;t.Image.filters.Pixelate=t.util.createClass(t.Image.filters.BaseFilter,{type:"Pixelate",initialize:function(e){e=e||{},this.blocksize=e.blocksize||4},applyTo:function(e){var t=e.getContext("2d"),n=t.getImageData(0,0,e.width,e.height),r=n.data,i=n.height,s=n.width,o,u,a,f,l,c,h;for(u=0;u<i;u+=this.blocksize)for(a=0;a<s;a+=this.blocksize){o=u*4*s+a*4,f=r[o],l=r[o+1],c=r[o+2],h=r[o+3];for(var p=u,d=u+this.blocksize;p<d;p++)for(var v=a,m=a+this.blocksize;v<m;v++)o=p*4*s+v*4,r[o]=f,r[o+1]=l,r[o+2]=c,r[o+3]=h}t.putImageData(n,0,0)},toObject:function(){return n(this.callSuper("toObject"),{blocksize:this.blocksize})}}),t.Image.filters.Pixelate.fromObject=function(e){return new t.Image.filters.Pixelate(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend;t.Image.filters.RemoveWhite=t.util.createClass(t.Image.filters.BaseFilter,{type:"RemoveWhite",initialize:function(e){e=e||{},this.threshold=e.threshold||30,this.distance=e.distance||20},applyTo:function(e){var t=e.getContext("2d"),n=t.getImageData(0,0,e.width,e.height),r=n.data,i=this.threshold,s=this.distance,o=255-i,u=Math.abs,a,f,l;for(var c=0,h=r.length;c<h;c+=4)a=r[c],f=r[c+1],l=r[c+2],a>o&&f>o&&l>o&&u(a-f)<s&&u(a-l)<s&&u(f-l)<s&&(r[c+3]=1);t.putImageData(n,0,0)},toObject:function(){return n(this.callSuper("toObject"),{threshold:this.threshold,distance:this.distance})}}),t.Image.filters.RemoveWhite.fromObject=function(e){return new t.Image.filters.RemoveWhite(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={});t.Image.filters.Sepia=t.util.createClass(t.Image.filters.BaseFilter,{type:"Sepia",applyTo:function(e){var t=e.getContext("2d"),n=t.getImageData(0,0,e.width,e.height),r=n.data,i=r.length,s,o;for(s=0;s<i;s+=4)o=.3*r[s]+.59*r[s+1]+.11*r[s+2],r[s]=o+100,r[s+1]=o+50,r[s+2]=o+255;t.putImageData(n,0,0)}}),t.Image.filters.Sepia.fromObject=function(){return new t.Image.filters.Sepia}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={});t.Image.filters.Sepia2=t.util.createClass(t.Image.filters.BaseFilter,{type:"Sepia2",applyTo:function(e){var t=e.getContext("2d"),n=t.getImageData(0,0,e.width,e.height),r=n.data,i=r.length,s,o,u,a;for(s=0;s<i;s+=4)o=r[s],u=r[s+1],a=r[s+2],r[s]=(o*.393+u*.769+a*.189)/1.351,r[s+1]=(o*.349+u*.686+a*.168)/1.203,r[s+2]=(o*.272+u*.534+a*.131)/2.14;t.putImageData(n,0,0)}}),t.Image.filters.Sepia2.fromObject=function(){return new t.Image.filters.Sepia2}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend;t.Image.filters.Tint=t.util.createClass(t.Image.filters.BaseFilter,{type:"Tint",initialize:function(e){e=e||{},this.color=e.color||"#000000",this.opacity=typeof e.opacity!="undefined"?e.opacity:(new t.Color(this.color)).getAlpha()},applyTo:function(e){var n=e.getContext("2d"),r=n.getImageData(0,0,e.width,e.height),i=r.data,s=i.length,o,u,a,f,l,c,h,p,d;d=(new t.Color(this.color)).getSource(),u=d[0]*this.opacity,a=d[1]*this.opacity,f=d[2]*this.opacity,p=1-this.opacity;for(o=0;o<s;o+=4)l=i[o],c=i[o+1],h=i[o+2],i[o]=u+l*p,i[o+1]=a+c*p,i[o+2]=f+h*p;n.putImageData(r,0,0)},toObject:function(){return n(this.callSuper("toObject"),{color:this.color,opacity:this.opacity})}}),t.Image.filters.Tint.fromObject=function(e){return new t.Image.filters.Tint(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend;t.Image.filters.Multiply=t.util.createClass(t.Image.filters.BaseFilter,{type:"Multiply",initialize:function(e){e=e||{},this.color=e.color||"#000000"},applyTo:function(e){var n=e.getContext("2d"),r=n.getImageData(0,0,e.width,e.height),i=r.data,s=i.length,o,u;u=(new t.Color(this.color)).getSource();for(o=0;o<s;o+=4)i[o]*=u[0]/255,i[o+1]*=u[1]/255,i[o+2]*=u[2]/255;n.putImageData(r,0,0)},toObject:function(){return n(this.callSuper("toObject"),{color:this.color})}}),t.Image.filters.Multiply.fromObject=function(e){return new t.Image.filters.Multiply(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric;t.Image.filters.Blend=t.util.createClass({type:"Blend",initialize:function(e){e=e||{},this.color=e.color||"#000",this.image=e.image||!1,this.mode=e.mode||"multiply",this.alpha=e.alpha||1},applyTo:function(e){var n=e.getContext("2d"),r=n.getImageData(0,0,e.width,e.height),i=r.data,s,o,u,a,f,l,c,h=!1;if(this.image){h=!0;var p=t.util.createCanvasElement();p.width=this.image.width,p.height=this.image.height;var d=new t.StaticCanvas(p);d.add(this.image);var v=d.getContext("2d");c=v.getImageData(0,0,d.width,d.height).data}else c=(new t.Color(this.color)).getSource(),s=c[0]*this.alpha,o=c[1]*this.alpha,u=c[2]*this.alpha;for(var m=0,g=i.length;m<g;m+=4){a=i[m],f=i[m+1],l=i[m+2],h&&(s=c[m]*this.alpha,o=c[m+1]*this.alpha,u=c[m+2]*this.alpha);switch(this.mode){case"multiply":i[m]=a*s/255,i[m+1]=f*o/255,i[m+2]=l*u/255;break;case"screen":i[m]=1-(1-a)*(1-s),i[m+1]=1-(1-f)*(1-o),i[m+2]=1-(1-l)*(1-u);break;case"add":i[m]=Math.min(255,a+s),i[m+1]=Math.min(255,f+o),i[m+2]=Math.min(255,l+u);break;case"diff":case"difference":i[m]=Math.abs(a-s),i[m+1]=Math.abs(f-o),i[m+2]=Math.abs(l-u);break;case"subtract":var y=a-s,b=f-o,w=l-u;i[m]=y<0?0:y,i[m+1]=b<0?0:b,i[m+2]=w<0?0:w;break;case"darken":i[m]=Math.min(a,s),i[m+1]=Math.min(f,o),i[m+2]=Math.min(l,u);break;case"lighten":i[m]=Math.max(a,s),i[m+1]=Math.max(f,o),i[m+2]=Math.max(l,u)}}n.putImageData(r,0,0)},toObject:function(){return{color:this.color,image:this.image,mode:this.mode,alpha:this.alpha}}}),t.Image.filters.Blend.fromObject=function(e){return new t.Image.filters.Blend(e)}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=Math.pow,r=Math.floor,i=Math.sqrt,s=Math.abs,o=Math.max,u=Math.round,a=Math.sin,f=Math.ceil;t.Image.filters.Resize=t.util.createClass(t.Image.filters.BaseFilter,{type:"Resize",resizeType:"hermite",scaleX:0,scaleY:0,lanczosLobes:3,applyTo:function(e,t,n){this.rcpScaleX=1/t,this.rcpScaleY=1/n;var r=e.width,i=e.height,s=u(r*t),o=u(i*n),a;this.resizeType==="sliceHack"&&(a=this.sliceByTwo(e,r,i,s,o)),this.resizeType==="hermite"&&(a=this.hermiteFastResize(e,r,i,s,o)),this.resizeType==="bilinear"&&(a=this.bilinearFiltering(e,r,i,s,o)),this.resizeType==="lanczos"&&(a=this.lanczosResize(e,r,i,s,o)),e.width=s,e.height=o,e.getContext("2d").putImageData(a,0,0)},sliceByTwo:function(e,n,i,s,u){var a=e.getContext("2d"),f,l=.5,c=.5,h=1,p=1,d=!1,v=!1,m=n,g=i,y=t.util.createCanvasElement(),b=y.getContext("2d");s=r(s),u=r(u),y.width=o(s,n),y.height=o(u,i),s>n&&(l=2,h=-1),u>i&&(c=2,p=-1),f=a.getImageData(0,0,n,i),e.width=o(s,n),e.height=o(u,i),a.putImageData(f,0,0);while(!d||!v)n=m,i=g,s*h<r(m*l*h)?m=r(m*l):(m=s,d=!0),u*p<r(g*c*p)?g=r(g*c):(g=u,v=!0),f=a.getImageData(0,0,n,i),b.putImageData(f,0,0),a.clearRect(0,0,m,g),a.drawImage(y,0,0,n,i,0,0,m,g);return a.getImageData(0,0,s,u)},lanczosResize:function(e,t,o,u,l){function c(e){return function(t){if(t>e)return 0;t*=Math.PI;if(s(t)<1e-16)return 1;var n=t/e;return a(t)*a(n)/t/n}}function h(e){var a,f,c,p,d,L,A,O,M,_,D;C.x=(e+.5)*b,k.x=r(C.x);for(a=0;a<l;a++){C.y=(a+.5)*w,k.y=r(C.y),d=0,L=0,A=0,O=0,M=0;for(f=k.x-x;f<=k.x+x;f++){if(f<0||f>=t)continue;_=r(1e3*s(f-C.x)),N[_]||(N[_]={});for(var P=k.y-T;P<=k.y+T;P++){if(P<0||P>=o)continue;D=r(1e3*s(P-C.y)),N[_][D]||(N[_][D]=y(i(n(_*E,2)+n(D*S,2))/1e3)),c=N[_][D],c>0&&(p=(P*t+f)*4,d+=c,L+=c*m[p],A+=c*m[p+1],O+=c*m[p+2],M+=c*m[p+3])}}p=(a*u+e)*4,g[p]=L/d,g[p+1]=A/d,g[p+2]=O/d,g[p+3]=M/d}return++e<u?h(e):v}var p=e.getContext("2d"),d=p.getImageData(0,0,t,o),v=p.getImageData(0,0,u,l),m=d.data,g=v.data,y=c(this.lanczosLobes),b=this.rcpScaleX,w=this.rcpScaleY,E=2/this.rcpScaleX,S=2/this.rcpScaleY,x=f(b*this.lanczosLobes/2),T=f(w*this.lanczosLobes/2),N={},C={},k={};return h(0)},bilinearFiltering:function(e,t,n,i,s){var o,u,a,f,l,c,h,p,d,v,m,g,y=0,b,w=this.rcpScaleX,E=this.rcpScaleY,S=e.getContext("2d"),x=4*(t-1),T=S.getImageData(0,0,t,n),N=T.data,C=S.getImageData(0,0,i,s),k=C.data;for(h=0;h<s;h++)for(p=0;p<i;p++){l=r(w*p),c=r(E*h),d=w*p-l,v=E*h-c,b=4*(c*t+l);for(m=0;m<4;m++)o=N[b+m],u=N[b+4+m],a=N[b+x+m],f=N[b+x+4+m],g=o*(1-d)*(1-v)+u*d*(1-v)+a*v*(1-d)+f*d*v,k[y++]=g}return C},hermiteFastResize:function(e,t,n,o,u){var a=this.rcpScaleX,l=this.rcpScaleY,c=f(a/2),h=f(l/2),p=e.getContext("2d"),d=p.getImageData(0,0,t,n),v=d.data,m=p.getImageData(0,0,o,u),g=m.data;for(var y=0;y<u;y++)for(var b=0;b<o;b++){var w=(b+y*o)*4,E=0,S=0,x=0,T=0,N=0,C=0,k=0,L=(y+.5)*l;for(var A=r(y*l);A<(y+1)*l;A++){var O=s(L-(A+.5))/h,M=(b+.5)*a,_=O*O;for(var D=r(b*a);D<(b+1)*a;D++){var P=s(M-(D+.5))/c,H=i(_+P*P);if(H>1&&H<-1)continue;E=2*H*H*H-3*H*H+1,E>0&&(P=4*(D+A*t),k+=E*v[P+3],x+=E,v[P+3]<255&&(E=E*v[P+3]/250),T+=E*v[P],N+=E*v[P+1],C+=E*v[P+2],S+=E)}}g[w]=T/S,g[w+1]=N/S,g[w+2]=C/S,g[w+3]=k/x}return m}}),t.Image.filters.Resize.fromObject=function(){return new t.Image.filters.Resize}}(typeof exports!="undefined"?exports:this),function(e){"use strict";var t=e.fabric||(e.fabric={}),n=t.util.object.extend,r=t.util.object.clone,i=t.util.toFixed,s=t.StaticCanvas.supports("setLineDash");if(t.Text){t.warn("fabric.Text is already defined");return}var o=t.Object.prototype.stateProperties.concat();o.push("fontFamily","fontWeight","fontSize","text","textDecoration","textAlign","fontStyle","lineHeight","textBackgroundColor","useNative","path"),t.Text=t.util.createClass(t.Object,{_dimensionAffectingProps:{fontSize:!0,fontWeight:!0,fontFamily:!0,textDecoration:!0,fontStyle:!0,lineHeight:!0,stroke:!0,strokeWidth:!0,text:!0},_reNewline:/\r?\n/,type:"text",fontSize:40,fontWeight:"normal",fontFamily:"Times New Roman",textDecoration:"",textAlign:"left",fontStyle:"",lineHeight:1.3,textBackgroundColor:"",path:null,useNative:!0,stateProperties:o,stroke:null,shadow:null,initialize:function(e,t){t=t||{},this.text=e,this.__skipDimension=!0,this.setOptions(t),this.__skipDimension=!1,this._initDimensions()},_initDimensions:function(){if(this.__skipDimension)return;var e=t.util.createCanvasElement();this._render(e.getContext("2d"))},toString:function(){return"#<fabric.Text ("+this.complexity()+'): { "text": "'+this.text+'", "fontFamily": "'+this.fontFamily+'" }>'},_render:function(e){typeof Cufon=="undefined"||this.useNative===!0?this._renderViaNative(e):this._renderViaCufon(e)},_renderViaNative:function(e){var n=this.text.split(this._reNewline);this._setTextStyles(e),this.width=this._getTextWidth(e,n),this.height=this._getTextHeight(e,n),this.clipTo&&t.util.clipContext(this,e),this._renderTextBackground(e,n),this._translateForTextAlign(e),this._renderText(e,n),this.textAlign!=="left"&&this.textAlign!=="justify"&&e.restore(),this._renderTextDecoration(e,n),this.clipTo&&e.restore(),this._setBoundaries(e,n),this._totalLineHeight=0},_renderText:function(e,t){e.save(),this._setOpacity(e),this._setShadow(e),this._setupCompositeOperation(e),this._renderTextFill(e,t),this._renderTextStroke(e,t),this._restoreCompositeOperation(e),this._removeShadow(e),e.restore()},_translateForTextAlign:function(e){this.textAlign!=="left"&&this.textAlign!=="justify"&&(e.save(),e.translate(this.textAlign==="center"?this.width/2:this.width,0))},_setBoundaries:function(e,t){this._boundaries=[];for(var n=0,r=t.length;n<r;n++){var i=this._getLineWidth(e,t[n]),s=this._getLineLeftOffset(i);this._boundaries.push({height:this.fontSize*this.lineHeight,width:i,left:s})}},_setTextStyles:function(e){this._setFillStyles(e),this._setStrokeStyles(e),e.textBaseline="alphabetic",this.skipTextAlign||(e.textAlign=this.textAlign),e.font=this._getFontDeclaration()},_getTextHeight:function(e,t){return this.fontSize*t.length*this.lineHeight},_getTextWidth:function(e,t){var n=e.measureText(t[0]||"|").width;for(var r=1,i=t.length;r<i;r++){var s=e.measureText(t[r]).width;s>n&&(n=s)}return n},_renderChars:function(e,t,n,r,i){t[e](n,r,i)},_renderTextLine:function(e,t,n,r,i,s){i-=this.fontSize/4;if(this.textAlign!=="justify"){this._renderChars(e,t,n,r,i,s);return}var o=t.measureText(n).width,u=this.width;if(u>o){var a=n.split(/\s+/),f=t.measureText(n.replace(/\s+/g,"")).width,l=u-f,c=a.length-1,h=l/c,p=0;for(var d=0,v=a.length;d<v;d++)this._renderChars(e,t,a[d],r+p,i,s),p+=t.measureText(a[d]).width+h}else this._renderChars(e,t,n,r,i,s)},_getLeftOffset:function(){return-this.width/2},_getTopOffset:function(){return-this.height/2},_renderTextFill:function(e,t){if(!this.fill&&!this._skipFillStrokeCheck)return;this._boundaries=[];var n=0;for(var r=0,i=t.length;r<i;r++){var s=this._getHeightOfLine(e,r,t);n+=s,this._renderTextLine("fillText",e,t[r],this._getLeftOffset(),this._getTopOffset()+n,r)}this.shadow&&!this.shadow.affectStroke&&this._removeShadow(e)},_renderTextStroke:function(e,t){if((!this.stroke||this.strokeWidth===0)&&!this._skipFillStrokeCheck)return;var n=0;e.save(),this.strokeDashArray&&(1&this.strokeDashArray.length&&this.strokeDashArray.push.apply(this.strokeDashArray,this.strokeDashArray),s&&e.setLineDash(this.strokeDashArray)),e.beginPath();for(var r=0,i=t.length;r<i;r++){var o=this._getHeightOfLine(e,r,t);n+=o,this._renderTextLine("strokeText",e,t[r],this._getLeftOffset(),this._getTopOffset()+n,r)}e.closePath(),e.restore()},_getHeightOfLine:function(){return this.fontSize*this.lineHeight},_renderTextBackground:function(e,t){this._renderTextBoxBackground(e),this._renderTextLinesBackground(e,t)},_renderTextBoxBackground:function(e){if(!this.backgroundColor)return;e.save(),e.fillStyle=this.backgroundColor,e.fillRect(this._getLeftOffset(),this._getTopOffset(),this.width,this.height),e.restore()},_renderTextLinesBackground:function(e,t){if(!this.textBackgroundColor)return;e.save(),e.fillStyle=this.textBackgroundColor;for(var n=0,r=t.length;n<r;n++)if(t[n]!==""){var i=this._getLineWidth(e,t[n]),s=this._getLineLeftOffset(i);e.fillRect(this._getLeftOffset()+s,this._getTopOffset()+n*this.fontSize*this.lineHeight,i,this.fontSize*this.lineHeight)}e.restore()},_getLineLeftOffset:function(e){return this.textAlign==="center"?(this.width-e)/2:this.textAlign==="right"?this.width-e:0},_getLineWidth:function(e,t){return this.textAlign==="justify"?this.width:e.measureText(t).width},_renderTextDecoration:function(e,t){function i(i){for(var s=0,o=t.length;s<o;s++){var u=r._getLineWidth(e,t[s]),a=r._getLineLeftOffset(u);e.fillRect(r._getLeftOffset()+a,~~(i+s*r._getHeightOfLine(e,s,t)-n),u,1)}}if(!this.textDecoration)return;var n=this._getTextHeight(e,t)/2,r=this;this.textDecoration.indexOf("underline")>-1&&i(this.fontSize*this.lineHeight),this.textDecoration.indexOf("line-through")>-1&&i(this.fontSize*this.lineHeight-this.fontSize/2),this.textDecoration.indexOf("overline")>-1&&i(this.fontSize*this.lineHeight-this.fontSize)},_getFontDeclaration:function(){return[t.isLikelyNode?this.fontWeight:this.fontStyle,t.isLikelyNode?this.fontStyle:this.fontWeight,this.fontSize+"px",t.isLikelyNode?'"'+this.fontFamily+'"':this.fontFamily].join(" ")},render:function(e,t){if(!this.visible)return;e.save(),t||this.transform(e);var n=this.group&&this.group.type==="path-group";n&&e.translate(-this.group.width/2,-this.group.height/2),this.transformMatrix&&e.transform.apply(e,this.transformMatrix),n&&e.translate(this.left,this.top),this._render(e),e.restore()},toObject:function(e){var t=n(this.callSuper("toObject",e),{text:this.text,fontSize:this.fontSize,fontWeight:this.fontWeight,fontFamily:this.fontFamily,fontStyle:this.fontStyle,lineHeight:this.lineHeight,textDecoration:this.textDecoration,textAlign:this.textAlign,path:this.path,textBackgroundColor:this.textBackgroundColor,useNative:this.useNative});return this.includeDefaultValues||this._removeDefaultValues(t),t},toSVG:function(e){var t=[],n=this.text.split(this._reNewline),r=this._getSVGLeftTopOffsets(n),i=this._getSVGTextAndBg(r.lineTop,r.textLeft,n),s=this._getSVGShadows(r.lineTop,n);return r.textTop+=this._fontAscent?this._fontAscent/5*this.lineHeight:0,this._wrapSVGTextAndBg(t,i,s,r),e?e(t.join("")):t.join("")},_getSVGLeftTopOffsets:function(e){var t=this.useNative?this.fontSize*this.lineHeight:-this._fontAscent-this._fontAscent/5*this.lineHeight,n=-(this.width/2),r=this.useNative?this.fontSize*this.lineHeight-.25*this.fontSize:this.height/2-e.length*this.fontSize-this._totalLineHeight;return{textLeft:n+(this.group&&this.group.type==="path-group"?this.left:0),textTop:r+(this.group&&this.group.type==="path-group"?this.top:0),lineTop:t}},_wrapSVGTextAndBg:function(e,t,n,r){e.push('<g transform="',this.getSvgTransform(),this.getSvgTransformMatrix(),'">\n',t.textBgRects.join(""),"<text ",this.fontFamily?'font-family="'+this.fontFamily.replace(/"/g,"'")+'" ':"",this.fontSize?'font-size="'+this.fontSize+'" ':"",this.fontStyle?'font-style="'+this.fontStyle+'" ':"",this.fontWeight?'font-weight="'+this.fontWeight+'" ':"",this.textDecoration?'text-decoration="'+this.textDecoration+'" ':"",'style="',this.getSvgStyles(),'" ','transform="translate(',i(r.textLeft,2)," ",i(r.textTop,2),')">',n.join(""),t.textSpans.join(""),"</text>\n","</g>\n")},_getSVGShadows:function(e,n){var r=[],s,o,u=1;if(!this.shadow||!this._boundaries)return r;for(s=0,o=n.length;s<o;s++)if(n[s]!==""){var a=this._boundaries&&this._boundaries[s]?this._boundaries[s].left:0;r.push('<tspan x="',i(a+u+this.shadow.offsetX,2),s===0||this.useNative?'" y':'" dy','="',i(this.useNative?e*s-this.height/2+this.shadow.offsetY:e+(s===0?this.shadow.offsetY:0),2),'" ',this._getFillAttributes(this.shadow.color),">",t.util.string.escapeXml(n[s]),"</tspan>"),u=1}else u++;return r},_getSVGTextAndBg:function(e,t,n){var r=[],i=[],s=1;this._setSVGBg(i);for(var o=0,u=n.length;o<u;o++){n[o]!==""?(this._setSVGTextLineText(n[o],o,r,e,s,i),s=1):s++;if(!this.textBackgroundColor||!this._boundaries)continue;this._setSVGTextLineBg(i,o,t,e)}return{textSpans:r,textBgRects:i}},_setSVGTextLineText:function(e,n,r,s,o){var u=this._boundaries&&this._boundaries[n]?i(this._boundaries[n].left,2):0;r.push('<tspan x="',u,'" ',n===0||this.useNative?"y":"dy",'="',i(this.useNative?s*n-this.height/2:s*o,2),'" ',this._getFillAttributes(this.fill),">",t.util.string.escapeXml(e),"</tspan>")},_setSVGTextLineBg:function(e,t,n,r){e.push("<rect ",this._getFillAttributes(this.textBackgroundColor),' x="',i(n+this._boundaries[t].left,2),'" y="',i(r*t-this.height/2,2),'" width="',i(this._boundaries[t].width,2),'" height="',i(this._boundaries[t].height,2),'"></rect>\n')},_setSVGBg:function(e){this.backgroundColor&&this._boundaries&&e.push("<rect ",this._getFillAttributes(this.backgroundColor),' x="',i(-this.width/2,2),'" y="',i(-this.height/2,2),'" width="',i(this.width,2),'" height="',i(this.height,2),'"></rect>')},_getFillAttributes:function(e){var n=e&&typeof e=="string"?new t.Color(e):"";return!n||!n.getSource()||n.getAlpha()===1?'fill="'+e+'"':'opacity="'+n.getAlpha()+'" fill="'+n.setAlpha(1).toRgb()+'"'},_set:function(e,t){e==="fontFamily"&&this.path&&(this.path=this.path.replace(/(.*?)([^\/]*)(\.font\.js)/,"$1"+t+"$3")),this.callSuper("_set",e,t),e in this._dimensionAffectingProps&&(this._initDimensions(),this.setCoords())},complexity:function(){return 1}}),t.Text.ATTRIBUTE_NAMES=t.SHARED_ATTRIBUTES.concat("x y dx dy font-family font-style font-weight font-size text-decoration text-anchor".split(" ")),t.Text.DEFAULT_SVG_FONT_SIZE=16,t.Text.fromElement=function(e,n){if(!e)return null;var r=t.parseAttributes(e,t.Text.ATTRIBUTE_NAMES);n=t.util.object.extend(n?t.util.object.clone(n):{},r),n.top=n.top||0,n.left=n.left||0,"dx"in r&&(n.left+=r.dx),"dy"in r&&(n.top+=r.dy),"fontSize"in n||(n.fontSize=t.Text.DEFAULT_SVG_FONT_SIZE),n.originX||(n.originX="left"),n.top+=n.fontSize/4;var i=new t.Text(e.textContent,n),s=0;return i.originX==="left"&&(s=i.getWidth()/2),i.originX==="right"&&(s=-i.getWidth()/2),i.set({left:i.getLeft()+s,top:i.getTop()-i.getHeight()/2}),i},t.Text.fromObject=function(e){return new t.Text(e.text,r(e))},t.util.createAccessors(t.Text)}(typeof exports!="undefined"?exports:this),function(){var e=fabric.util.object.clone;fabric.IText=fabric.util.createClass(fabric.Text,fabric.Observable,{type:"i-text",selectionStart:0,selectionEnd:0,selectionColor:"rgba(17,119,255,0.3)",isEditing:!1,editable:!0,editingBorderColor:"rgba(102,153,255,0.25)",cursorWidth:2,cursorColor:"#333",cursorDelay:1e3,cursorDuration:600,styles:null,caching:!0,_skipFillStrokeCheck:!0,_reSpace:/\s|\n/,_fontSizeFraction:4,_currentCursorOpacity:0,_selectionDirection:null,_abortCursorAnimation:!1,_charWidthsCache:{},initialize:function(e,t){this.styles=t?t.styles||{}:{},this.callSuper("initialize",e,t),this.initBehavior(),fabric.IText.instances.push(this),this.__lineWidths={},this.__lineHeights={},this.__lineOffsets={}},isEmptyStyles:function(){if(!this.styles)return!0;var e=this.styles;for(var t in e)for(var n in e[t])for(var r in e[t][n])return!1;return!0},setSelectionStart:function(e){this.selectionStart!==e&&(this.fire("selection:changed"),this.canvas&&this.canvas.fire("text:selection:changed",{target:this})),this.selectionStart=e,this.hiddenTextarea&&(this.hiddenTextarea.selectionStart=e)},setSelectionEnd:function(e){this.selectionEnd!==e&&(this.fire("selection:changed"),this.canvas&&this.canvas.fire("text:selection:changed",{target:this})),this.selectionEnd=e,this.hiddenTextarea&&(this.hiddenTextarea.selectionEnd=e)},getSelectionStyles:function(e,t){if(arguments.length===2){var n=[];for(var r=e;r<t;r++)n.push(this.getSelectionStyles(r));return n}var i=this.get2DCursorLocation(e);return this.styles[i.lineIndex]?this.styles[i.lineIndex][i.charIndex]||{}:{}},setSelectionStyles:function(e){if(this.selectionStart===this.selectionEnd)this._extendStyles(this.selectionStart,e);else for(var t=this.selectionStart;t<this.selectionEnd;t++)this._extendStyles(t,e);return this},_extendStyles:function(e,t){var n=this.get2DCursorLocation(e);this.styles[n.lineIndex]||(this.styles[n.lineIndex]={}),this.styles[n.lineIndex][n.charIndex]||(this.styles[n.lineIndex][n.charIndex]={}),fabric.util.object.extend(this.styles[n.lineIndex][n.charIndex],t)},_render:function(e){this.callSuper("_render",e),this.ctx=e,this.isEditing&&this.renderCursorOrSelection()},renderCursorOrSelection:function(){if(!this.active)return;var e=this.text.split(""),t;this.selectionStart===this.selectionEnd?(t=this._getCursorBoundaries(e,"cursor"),this.renderCursor(t)):(t=this._getCursorBoundaries(e,"selection"),this.renderSelection(e,t))},get2DCursorLocation:function(e){typeof e=="undefined"&&(e=this.selectionStart);var t=this.text.slice(0,e),n=t.split(this._reNewline);return{lineIndex:n.length-1,charIndex:n[n.length-1].length}},getCurrentCharStyle:function(e,t){var n=this.styles[e]&&this.styles[e][t===0?0:t-1];return{fontSize:n&&n.fontSize||this.fontSize,fill:n&&n.fill||this.fill,textBackgroundColor:n&&n.textBackgroundColor||this.textBackgroundColor,textDecoration:n&&n.textDecoration||this.textDecoration,fontFamily:n&&n.fontFamily||this.fontFamily,fontWeight:n&&n.fontWeight||this.fontWeight,fontStyle:n&&n.fontStyle||this.fontStyle,stroke:n&&n.stroke||this.stroke,strokeWidth:n&&n.strokeWidth||this.strokeWidth}},getCurrentCharFontSize:function(e,t){return this.styles[e]&&this.styles[e][t===0?0:t-1]&&this.styles[e][t===0?0:t-1].fontSize||this.fontSize},getCurrentCharColor:function(e,t){return this.styles[e]&&this.styles[e][t===0?0:t-1]&&this.styles[e][t===0?0:t-1].fill||this.cursorColor},_getCursorBoundaries:function(e,t){var n=this.get2DCursorLocation(),r=this.text.split(this._reNewline),i=Math.round(this._getLeftOffset()),s=this._getTopOffset(),o=this._getCursorBoundariesOffsets(e,t,n,r);return{left:i,top:s,leftOffset:o.left+o.lineLeft,topOffset:o.top}},_getCursorBoundariesOffsets:function(e,t,n,r){var i=0,s=0,o=0,u=0,a=t==="cursor"?this._getHeightOfLine(this.ctx,0)-this.getCurrentCharFontSize(n.lineIndex,n.charIndex):0;for(var f=0;f<this.selectionStart;f++){if(e[f]==="\n"){u=0;var l=s+(t==="cursor"?1:0);a+=this._getCachedLineHeight(l),s++,o=0}else u+=this._getWidthOfChar(this.ctx,e[f],s,o),o++;i=this._getCachedLineOffset(s,r)}return this._clearCache(),{top:a,left:u,lineLeft:i}},_clearCache:function(){this.__lineWidths={},this.__lineHeights={},this.__lineOffsets={}},_getCachedLineHeight:function(e){return this.__lineHeights[e]||(this.__lineHeights[e]=this._getHeightOfLine(this.ctx,e))},_getCachedLineWidth:function(e,t){return this.__lineWidths[e]||(this.__lineWidths[e]=this._getWidthOfLine(this.ctx,e,t))},_getCachedLineOffset:function(e,t){var n=this._getCachedLineWidth(e,t);return this.__lineOffsets[e]||(this.__lineOffsets[e]=this.
_getLineLeftOffset(n))},renderCursor:function(e){var t=this.ctx;t.save();var n=this.get2DCursorLocation(),r=n.lineIndex,i=n.charIndex,s=this.getCurrentCharFontSize(r,i),o=r===0&&i===0?this._getCachedLineOffset(r,this.text.split(this._reNewline)):e.leftOffset;t.fillStyle=this.getCurrentCharColor(r,i),t.globalAlpha=this.__isMousedown?1:this._currentCursorOpacity,t.fillRect(e.left+o,e.top+e.topOffset,this.cursorWidth/this.scaleX,s),t.restore()},renderSelection:function(e,t){var n=this.ctx;n.save(),n.fillStyle=this.selectionColor;var r=this.get2DCursorLocation(this.selectionStart),i=this.get2DCursorLocation(this.selectionEnd),s=r.lineIndex,o=i.lineIndex,u=this.text.split(this._reNewline);for(var a=s;a<=o;a++){var f=this._getCachedLineOffset(a,u)||0,l=this._getCachedLineHeight(a),c=0;if(a===s)for(var h=0,p=u[a].length;h<p;h++)h>=r.charIndex&&(a!==o||h<i.charIndex)&&(c+=this._getWidthOfChar(n,u[a][h],a,h)),h<r.charIndex&&(f+=this._getWidthOfChar(n,u[a][h],a,h));else if(a>s&&a<o)c+=this._getCachedLineWidth(a,u)||5;else if(a===o)for(var d=0,v=i.charIndex;d<v;d++)c+=this._getWidthOfChar(n,u[a][d],a,d);n.fillRect(t.left+f,t.top+t.topOffset,c,l),t.topOffset+=l}n.restore()},_renderChars:function(e,t,n,r,i,s){if(this.isEmptyStyles())return this._renderCharsFast(e,t,n,r,i);this.skipTextAlign=!0,r-=this.textAlign==="center"?this.width/2:this.textAlign==="right"?this.width:0;var o=this.text.split(this._reNewline),u=this._getWidthOfLine(t,s,o),a=this._getHeightOfLine(t,s,o),f=this._getLineLeftOffset(u),l=n.split(""),c,h="";r+=f||0,t.save();for(var p=0,d=l.length;p<=d;p++){c=c||this.getCurrentCharStyle(s,p);var v=this.getCurrentCharStyle(s,p+1);if(this._hasStyleChanged(c,v)||p===d)this._renderChar(e,t,s,p-1,h,r,i,a),h="",c=v;h+=l[p]}t.restore()},_renderCharsFast:function(e,t,n,r,i){this.skipTextAlign=!1,e==="fillText"&&this.fill&&this.callSuper("_renderChars",e,t,n,r,i),e==="strokeText"&&this.stroke&&this.callSuper("_renderChars",e,t,n,r,i)},_renderChar:function(e,t,n,r,i,s,o,u){var a,f,l;if(this.styles&&this.styles[n]&&(a=this.styles[n][r])){var c=a.stroke||this.stroke,h=a.fill||this.fill;t.save(),f=this._applyCharStylesGetWidth(t,i,n,r,a),l=this._getHeightOfChar(t,i,n,r),h&&t.fillText(i,s,o),c&&t.strokeText(i,s,o),this._renderCharDecoration(t,a,s,o,f,u,l),t.restore(),t.translate(f,0)}else e==="strokeText"&&this.stroke&&t[e](i,s,o),e==="fillText"&&this.fill&&t[e](i,s,o),f=this._applyCharStylesGetWidth(t,i,n,r),this._renderCharDecoration(t,null,s,o,f,u),t.translate(t.measureText(i).width,0)},_hasStyleChanged:function(e,t){return e.fill!==t.fill||e.fontSize!==t.fontSize||e.textBackgroundColor!==t.textBackgroundColor||e.textDecoration!==t.textDecoration||e.fontFamily!==t.fontFamily||e.fontWeight!==t.fontWeight||e.fontStyle!==t.fontStyle||e.stroke!==t.stroke||e.strokeWidth!==t.strokeWidth},_renderCharDecoration:function(e,t,n,r,i,s,o){var u=t?t.textDecoration||this.textDecoration:this.textDecoration,a=(t?t.fontSize:null)||this.fontSize;if(!u)return;u.indexOf("underline")>-1&&this._renderCharDecorationAtOffset(e,n,r+this.fontSize/this._fontSizeFraction,i,0,this.fontSize/20),u.indexOf("line-through")>-1&&this._renderCharDecorationAtOffset(e,n,r+this.fontSize/this._fontSizeFraction,i,o/2,a/20),u.indexOf("overline")>-1&&this._renderCharDecorationAtOffset(e,n,r,i,s-this.fontSize/this._fontSizeFraction,this.fontSize/20)},_renderCharDecorationAtOffset:function(e,t,n,r,i,s){e.fillRect(t,n-i,r,s)},_renderTextLine:function(e,t,n,r,i,s){i+=this.fontSize/4,this.callSuper("_renderTextLine",e,t,n,r,i,s)},_renderTextDecoration:function(e,t){if(this.isEmptyStyles())return this.callSuper("_renderTextDecoration",e,t)},_renderTextLinesBackground:function(e,t){if(!this.textBackgroundColor&&!this.styles)return;e.save(),this.textBackgroundColor&&(e.fillStyle=this.textBackgroundColor);var n=0,r=this.fontSize/this._fontSizeFraction;for(var i=0,s=t.length;i<s;i++){var o=this._getHeightOfLine(e,i,t);if(t[i]===""){n+=o;continue}var u=this._getWidthOfLine(e,i,t),a=this._getLineLeftOffset(u);this.textBackgroundColor&&(e.fillStyle=this.textBackgroundColor,e.fillRect(this._getLeftOffset()+a,this._getTopOffset()+n+r,u,o));if(this.styles[i])for(var f=0,l=t[i].length;f<l;f++)if(this.styles[i]&&this.styles[i][f]&&this.styles[i][f].textBackgroundColor){var c=t[i][f];e.fillStyle=this.styles[i][f].textBackgroundColor,e.fillRect(this._getLeftOffset()+a+this._getWidthOfCharsAt(e,i,f,t),this._getTopOffset()+n+r,this._getWidthOfChar(e,c,i,f,t)+1,o)}n+=o}e.restore()},_getCacheProp:function(e,t){return e+t.fontFamily+t.fontSize+t.fontWeight+t.fontStyle+t.shadow},_applyCharStylesGetWidth:function(t,n,r,i,s){var o=s||this.styles[r]&&this.styles[r][i];o?o=e(o):o={},this._applyFontStyles(o);var u=this._getCacheProp(n,o);if(this.isEmptyStyles()&&this._charWidthsCache[u]&&this.caching)return this._charWidthsCache[u];typeof o.shadow=="string"&&(o.shadow=new fabric.Shadow(o.shadow));var a=o.fill||this.fill;return t.fillStyle=a.toLive?a.toLive(t):a,o.stroke&&(t.strokeStyle=o.stroke&&o.stroke.toLive?o.stroke.toLive(t):o.stroke),t.lineWidth=o.strokeWidth||this.strokeWidth,t.font=this._getFontDeclaration.call(o),this._setShadow.call(o,t),this.caching?(this._charWidthsCache[u]||(this._charWidthsCache[u]=t.measureText(n).width),this._charWidthsCache[u]):t.measureText(n).width},_applyFontStyles:function(e){e.fontFamily||(e.fontFamily=this.fontFamily),e.fontSize||(e.fontSize=this.fontSize),e.fontWeight||(e.fontWeight=this.fontWeight),e.fontStyle||(e.fontStyle=this.fontStyle)},_getStyleDeclaration:function(t,n){return this.styles[t]&&this.styles[t][n]?e(this.styles[t][n]):{}},_getWidthOfChar:function(e,t,n,r){if(this.textAlign==="justify"&&/\s/.test(t))return this._getWidthOfSpace(e,n);var i=this._getStyleDeclaration(n,r);this._applyFontStyles(i);var s=this._getCacheProp(t,i);if(this._charWidthsCache[s]&&this.caching)return this._charWidthsCache[s];if(e){e.save();var o=this._applyCharStylesGetWidth(e,t,n,r);return e.restore(),o}},_getHeightOfChar:function(e,t,n,r){return this.styles[n]&&this.styles[n][r]?this.styles[n][r].fontSize||this.fontSize:this.fontSize},_getWidthOfCharAt:function(e,t,n,r){r=r||this.text.split(this._reNewline);var i=r[t].split("")[n];return this._getWidthOfChar(e,i,t,n)},_getHeightOfCharAt:function(e,t,n,r){r=r||this.text.split(this._reNewline);var i=r[t].split("")[n];return this._getHeightOfChar(e,i,t,n)},_getWidthOfCharsAt:function(e,t,n,r){var i=0;for(var s=0;s<n;s++)i+=this._getWidthOfCharAt(e,t,s,r);return i},_getWidthOfLine:function(e,t,n){return this._getWidthOfCharsAt(e,t,n[t].length,n)},_getWidthOfSpace:function(e,t){var n=this.text.split(this._reNewline),r=n[t],i=r.split(/\s+/),s=this._getWidthOfWords(e,r,t),o=this.width-s,u=i.length-1,a=o/u;return a},_getWidthOfWords:function(e,t,n){var r=0;for(var i=0;i<t.length;i++){var s=t[i];s.match(/\s/)||(r+=this._getWidthOfChar(e,s,n,i))}return r},_getTextWidth:function(e,t){if(this.isEmptyStyles())return this.callSuper("_getTextWidth",e,t);var n=this._getWidthOfLine(e,0,t);for(var r=1,i=t.length;r<i;r++){var s=this._getWidthOfLine(e,r,t);s>n&&(n=s)}return n},_getHeightOfLine:function(e,t,n){n=n||this.text.split(this._reNewline);var r=this._getHeightOfChar(e,n[t][0],t,0),i=n[t],s=i.split("");for(var o=1,u=s.length;o<u;o++){var a=this._getHeightOfChar(e,s[o],t,o);a>r&&(r=a)}return r*this.lineHeight},_getTextHeight:function(e,t){var n=0;for(var r=0,i=t.length;r<i;r++)n+=this._getHeightOfLine(e,r,t);return n},_getTopOffset:function(){var e=fabric.Text.prototype._getTopOffset.call(this);return e-this.fontSize/this._fontSizeFraction},_renderTextBoxBackground:function(e){if(!this.backgroundColor)return;e.save(),e.fillStyle=this.backgroundColor,e.fillRect(this._getLeftOffset(),this._getTopOffset()+this.fontSize/this._fontSizeFraction,this.width,this.height),e.restore()},toObject:function(t){return fabric.util.object.extend(this.callSuper("toObject",t),{styles:e(this.styles)})}}),fabric.IText.fromObject=function(t){return new fabric.IText(t.text,e(t))},fabric.IText.instances=[]}(),function(){var e=fabric.util.object.clone;fabric.util.object.extend(fabric.IText.prototype,{initBehavior:function(){this.initAddedHandler(),this.initCursorSelectionHandlers(),this.initDoubleClickSimulation()},initSelectedHandler:function(){this.on("selected",function(){var e=this;setTimeout(function(){e.selected=!0},100)})},initAddedHandler:function(){this.on("added",function(){this.canvas&&!this.canvas._hasITextHandlers&&(this.canvas._hasITextHandlers=!0,this._initCanvasHandlers())})},_initCanvasHandlers:function(){this.canvas.on("selection:cleared",function(){fabric.IText.prototype.exitEditingOnOthers.call()}),this.canvas.on("mouse:up",function(){fabric.IText.instances.forEach(function(e){e.__isMousedown=!1})}),this.canvas.on("object:selected",function(e){fabric.IText.prototype.exitEditingOnOthers.call(e.target)})},_tick:function(){if(this._abortCursorAnimation)return;var e=this;this.animate("_currentCursorOpacity",1,{duration:this.cursorDuration,onComplete:function(){e._onTickComplete()},onChange:function(){e.canvas&&e.canvas.renderAll()},abort:function(){return e._abortCursorAnimation}})},_onTickComplete:function(){if(this._abortCursorAnimation)return;var e=this;this._cursorTimeout1&&clearTimeout(this._cursorTimeout1),this._cursorTimeout1=setTimeout(function(){e.animate("_currentCursorOpacity",0,{duration:this.cursorDuration/2,onComplete:function(){e._tick()},onChange:function(){e.canvas&&e.canvas.renderAll()},abort:function(){return e._abortCursorAnimation}})},100)},initDelayedCursor:function(e){var t=this,n=e?0:this.cursorDelay;e&&(this._abortCursorAnimation=!0,clearTimeout(this._cursorTimeout1),this._currentCursorOpacity=1,this.canvas&&this.canvas.renderAll()),this._cursorTimeout2&&clearTimeout(this._cursorTimeout2),this._cursorTimeout2=setTimeout(function(){t._abortCursorAnimation=!1,t._tick()},n)},abortCursorAnimation:function(){this._abortCursorAnimation=!0,clearTimeout(this._cursorTimeout1),clearTimeout(this._cursorTimeout2),this._currentCursorOpacity=0,this.canvas&&this.canvas.renderAll();var e=this;setTimeout(function(){e._abortCursorAnimation=!1},10)},selectAll:function(){this.selectionStart=0,this.selectionEnd=this.text.length,this.fire("selection:changed"),this.canvas&&this.canvas.fire("text:selection:changed",{target:this})},getSelectedText:function(){return this.text.slice(this.selectionStart,this.selectionEnd)},findWordBoundaryLeft:function(e){var t=0,n=e-1;if(this._reSpace.test(this.text.charAt(n)))while(this._reSpace.test(this.text.charAt(n)))t++,n--;while(/\S/.test(this.text.charAt(n))&&n>-1)t++,n--;return e-t},findWordBoundaryRight:function(e){var t=0,n=e;if(this._reSpace.test(this.text.charAt(n)))while(this._reSpace.test(this.text.charAt(n)))t++,n++;while(/\S/.test(this.text.charAt(n))&&n<this.text.length)t++,n++;return e+t},findLineBoundaryLeft:function(e){var t=0,n=e-1;while(!/\n/.test(this.text.charAt(n))&&n>-1)t++,n--;return e-t},findLineBoundaryRight:function(e){var t=0,n=e;while(!/\n/.test(this.text.charAt(n))&&n<this.text.length)t++,n++;return e+t},getNumNewLinesInSelectedText:function(){var e=this.getSelectedText(),t=0;for(var n=0,r=e.split(""),i=r.length;n<i;n++)r[n]==="\n"&&t++;return t},searchWordBoundary:function(e,t){var n=this._reSpace.test(this.text.charAt(e))?e-1:e,r=this.text.charAt(n),i=/[ \n\.,;!\?\-]/;while(!i.test(r)&&n>0&&n<this.text.length)n+=t,r=this.text.charAt(n);return i.test(r)&&r!=="\n"&&(n+=t===1?0:1),n},selectWord:function(e){var t=this.searchWordBoundary(e,-1),n=this.searchWordBoundary(e,1);this.setSelectionStart(t),this.setSelectionEnd(n),this.initDelayedCursor(!0)},selectLine:function(e){var t=this.findLineBoundaryLeft(e),n=this.findLineBoundaryRight(e);this.setSelectionStart(t),this.setSelectionEnd(n),this.initDelayedCursor(!0)},enterEditing:function(){if(this.isEditing||!this.editable)return;return this.exitEditingOnOthers(),this.isEditing=!0,this.initHiddenTextarea(),this._updateTextarea(),this._saveEditingProps(),this._setEditingProps(),this._tick(),this.canvas&&this.canvas.renderAll(),this.fire("editing:entered"),this.canvas&&this.canvas.fire("text:editing:entered",{target:this}),this},exitEditingOnOthers:function(){fabric.IText.instances.forEach(function(e){e.selected=!1,e.isEditing&&e.exitEditing()},this)},_setEditingProps:function(){this.hoverCursor="text",this.canvas&&(this.canvas.defaultCursor=this.canvas.moveCursor="text"),this.borderColor=this.editingBorderColor,this.hasControls=this.selectable=!1,this.lockMovementX=this.lockMovementY=!0},_updateTextarea:function(){if(!this.hiddenTextarea)return;this.hiddenTextarea.value=this.text,this.hiddenTextarea.selectionStart=this.selectionStart},_saveEditingProps:function(){this._savedProps={hasControls:this.hasControls,borderColor:this.borderColor,lockMovementX:this.lockMovementX,lockMovementY:this.lockMovementY,hoverCursor:this.hoverCursor,defaultCursor:this.canvas&&this.canvas.defaultCursor,moveCursor:this.canvas&&this.canvas.moveCursor}},_restoreEditingProps:function(){if(!this._savedProps)return;this.hoverCursor=this._savedProps.overCursor,this.hasControls=this._savedProps.hasControls,this.borderColor=this._savedProps.borderColor,this.lockMovementX=this._savedProps.lockMovementX,this.lockMovementY=this._savedProps.lockMovementY,this.canvas&&(this.canvas.defaultCursor=this._savedProps.defaultCursor,this.canvas.moveCursor=this._savedProps.moveCursor)},exitEditing:function(){return this.selected=!1,this.isEditing=!1,this.selectable=!0,this.selectionEnd=this.selectionStart,this.hiddenTextarea&&this.canvas&&this.hiddenTextarea.parentNode.removeChild(this.hiddenTextarea),this.hiddenTextarea=null,this.abortCursorAnimation(),this._restoreEditingProps(),this._currentCursorOpacity=0,this.fire("editing:exited"),this.canvas&&this.canvas.fire("text:editing:exited",{target:this}),this},_removeExtraneousStyles:function(){var e=this.text.split(this._reNewline);for(var t in this.styles)e[t]||delete this.styles[t]},_removeCharsFromTo:function(e,t){var n=t;while(n!==e){var r=this.get2DCursorLocation(n).charIndex;n--;var i=this.get2DCursorLocation(n).charIndex,s=i>r;s?this.removeStyleObject(s,n+1):this.removeStyleObject(this.get2DCursorLocation(n).charIndex===0,n)}this.text=this.text.slice(0,e)+this.text.slice(t)},insertChars:function(e){var t=this.text.slice(this.selectionStart,this.selectionStart+1)==="\n";this.text=this.text.slice(0,this.selectionStart)+e+this.text.slice(this.selectionEnd),this.selectionStart===this.selectionEnd&&this.insertStyleObjects(e,t,this.copiedStyles),this.selectionStart+=e.length,this.selectionEnd=this.selectionStart,this.canvas&&this.canvas.renderAll().renderAll(),this.setCoords(),this.fire("changed"),this.canvas&&this.canvas.fire("text:changed",{target:this})},insertNewlineStyleObject:function(t,n,r){this.shiftLineStyles(t,1),this.styles[t+1]||(this.styles[t+1]={});var i=this.styles[t][n-1],s={};if(r)s[0]=e(i),this.styles[t+1]=s;else{for(var o in this.styles[t])parseInt(o,10)>=n&&(s[parseInt(o,10)-n]=this.styles[t][o],delete this.styles[t][o]);this.styles[t+1]=s}},insertCharStyleObject:function(t,n,r){var i=this.styles[t],s=e(i);n===0&&!r&&(n=1);for(var o in s){var u=parseInt(o,10);u>=n&&(i[u+1]=s[u])}this.styles[t][n]=r||e(i[n-1])},insertStyleObjects:function(e,t,n){var r=this.get2DCursorLocation(),i=r.lineIndex,s=r.charIndex;this.styles[i]||(this.styles[i]={}),e==="\n"?this.insertNewlineStyleObject(i,s,t):n?this._insertStyles(n):this.insertCharStyleObject(i,s)},_insertStyles:function(e){for(var t=0,n=e.length;t<n;t++){var r=this.get2DCursorLocation(this.selectionStart+t),i=r.lineIndex,s=r.charIndex;this.insertCharStyleObject(i,s,e[t])}},shiftLineStyles:function(t,n){var r=e(this.styles);for(var i in this.styles){var s=parseInt(i,10);s>t&&(this.styles[s+n]=r[s])}},removeStyleObject:function(t,n){var r=this.get2DCursorLocation(n),i=r.lineIndex,s=r.charIndex;if(t){var o=this.text.split(this._reNewline),u=o[i-1],a=u?u.length:0;this.styles[i-1]||(this.styles[i-1]={});for(s in this.styles[i])this.styles[i-1][parseInt(s,10)+a]=this.styles[i][s];this.shiftLineStyles(i,-1)}else{var f=this.styles[i];if(f){var l=this.selectionStart===this.selectionEnd?-1:0;delete f[s+l]}var c=e(f);for(var h in c){var p=parseInt(h,10);p>=s&&p!==0&&(f[p-1]=c[p],delete f[p])}}},insertNewline:function(){this.insertChars("\n")}})}(),fabric.util.object.extend(fabric.IText.prototype,{initDoubleClickSimulation:function(){this.__lastClickTime=+(new Date),this.__lastLastClickTime=+(new Date),this.__lastPointer={},this.on("mousedown",this.onMouseDown.bind(this))},onMouseDown:function(e){this.__newClickTime=+(new Date);var t=this.canvas.getPointer(e.e);this.isTripleClick(t)?(this.fire("tripleclick",e),this._stopEvent(e.e)):this.isDoubleClick(t)&&(this.fire("dblclick",e),this._stopEvent(e.e)),this.__lastLastClickTime=this.__lastClickTime,this.__lastClickTime=this.__newClickTime,this.__lastPointer=t,this.__lastIsEditing=this.isEditing,this.__lastSelected=this.selected},isDoubleClick:function(e){return this.__newClickTime-this.__lastClickTime<500&&this.__lastPointer.x===e.x&&this.__lastPointer.y===e.y&&this.__lastIsEditing},isTripleClick:function(e){return this.__newClickTime-this.__lastClickTime<500&&this.__lastClickTime-this.__lastLastClickTime<500&&this.__lastPointer.x===e.x&&this.__lastPointer.y===e.y},_stopEvent:function(e){e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation()},initCursorSelectionHandlers:function(){this.initSelectedHandler(),this.initMousedownHandler(),this.initMousemoveHandler(),this.initMouseupHandler(),this.initClicks()},initClicks:function(){this.on("dblclick",function(e){this.selectWord(this.getSelectionStartFromPointer(e.e))}),this.on("tripleclick",function(e){this.selectLine(this.getSelectionStartFromPointer(e.e))})},initMousedownHandler:function(){this.on("mousedown",function(e){var t=this.canvas.getPointer(e.e);this.__mousedownX=t.x,this.__mousedownY=t.y,this.__isMousedown=!0,this.hiddenTextarea&&this.canvas&&this.canvas.wrapperEl.appendChild(this.hiddenTextarea),this.selected&&this.setCursorByClick(e.e),this.isEditing&&(this.__selectionStartOnMouseDown=this.selectionStart,this.initDelayedCursor(!0))})},initMousemoveHandler:function(){this.on("mousemove",function(e){if(!this.__isMousedown||!this.isEditing)return;var t=this.getSelectionStartFromPointer(e.e);t>=this.__selectionStartOnMouseDown?(this.setSelectionStart(this.__selectionStartOnMouseDown),this.setSelectionEnd(t)):(this.setSelectionStart(t),this.setSelectionEnd(this.__selectionStartOnMouseDown))})},_isObjectMoved:function(e){var t=this.canvas.getPointer(e);return this.__mousedownX!==t.x||this.__mousedownY!==t.y},initMouseupHandler:function(){this.on("mouseup",function(e){this.__isMousedown=!1;if(this._isObjectMoved(e.e))return;this.__lastSelected&&(this.enterEditing(),this.initDelayedCursor(!0)),this.selected=!0})},setCursorByClick:function(e){var t=this.getSelectionStartFromPointer(e);e.shiftKey?t<this.selectionStart?(this.setSelectionEnd(this.selectionStart),this.setSelectionStart(t)):this.setSelectionEnd(t):(this.setSelectionStart(t),this.setSelectionEnd(t))},_getLocalRotatedPointer:function(e){var t=this.canvas.getPointer(e),n=new fabric.Point(t.x,t.y),r=new fabric.Point(this.left,this.top),i=fabric.util.rotatePoint(n,r,fabric.util.degreesToRadians(-this.angle));return this.getLocalPointer(e,i)},getSelectionStartFromPointer:function(e){var t=this._getLocalRotatedPointer(e),n=this.text.split(this._reNewline),r=0,i=0,s=0,o=0,u;for(var a=0,f=n.length;a<f;a++){s+=this._getHeightOfLine(this.ctx,a)*this.scaleY;var l=this._getWidthOfLine(this.ctx,a,n),c=this._getLineLeftOffset(l);i=c*this.scaleX,this.flipX&&(n[a]=n[a].split("").reverse().join(""));for(var h=0,p=n[a].length;h<p;h++){var d=n[a][h];r=i,i+=this._getWidthOfChar(this.ctx,d,a,this.flipX?p-h:h)*this.scaleX;if(s<=t.y||i<=t.x){o++;continue}return this._getNewSelectionStartFromOffset(t,r,i,o+a,p)}if(t.y<s)return this._getNewSelectionStartFromOffset(t,r,i,o+a,p)}if(typeof u=="undefined")return this.text.length},_getNewSelectionStartFromOffset:function(e,t,n,r,i){var s=e.x-t,o=n-e.x,u=o>s?0:1,a=r+u;return this.flipX&&(a=i-a),a>this.text.length&&(a=this.text.length),a}}),fabric.util.object.extend(fabric.IText.prototype,{initHiddenTextarea:function(){this.hiddenTextarea=fabric.document.createElement("textarea"),this.hiddenTextarea.setAttribute("autocapitalize","off"),this.hiddenTextarea.style.cssText="position: fixed; bottom: 20px; left: 0px; opacity: 0; width: 0px; height: 0px; z-index: -999;",fabric.document.body.appendChild(this.hiddenTextarea),fabric.util.addListener(this.hiddenTextarea,"keydown",this.onKeyDown.bind(this)),fabric.util.addListener(this.hiddenTextarea,"keypress",this.onKeyPress.bind(this)),fabric.util.addListener(this.hiddenTextarea,"copy",this.copy.bind(this)),fabric.util.addListener(this.hiddenTextarea,"paste",this.paste.bind(this)),!this._clickHandlerInitialized&&this.canvas&&(fabric.util.addListener(this.canvas.upperCanvasEl,"click",this.onClick.bind(this)),this._clickHandlerInitialized=!0)},_keysMap:{8:"removeChars",9:"exitEditing",27:"exitEditing",13:"insertNewline",33:"moveCursorUp",34:"moveCursorDown",35:"moveCursorRight",36:"moveCursorLeft",37:"moveCursorLeft",38:"moveCursorUp",39:"moveCursorRight",40:"moveCursorDown",46:"forwardDelete"},_ctrlKeysMap:{65:"selectAll",88:"cut"},onClick:function(){this.hiddenTextarea&&this.hiddenTextarea.focus()},onKeyDown:function(e){if(!this.isEditing)return;if(e.keyCode in this._keysMap)this[this._keysMap[e.keyCode]](e);else{if(!(e.keyCode in this._ctrlKeysMap&&(e.ctrlKey||e.metaKey)))return;this[this._ctrlKeysMap[e.keyCode]](e)}e.stopImmediatePropagation(),e.preventDefault(),this.canvas&&this.canvas.renderAll()},forwardDelete:function(e){this.selectionStart===this.selectionEnd&&this.moveCursorRight(e),this.removeChars(e)},copy:function(e){var t=this.getSelectedText(),n=this._getClipboardData(e);n&&n.setData("text",t),this.copiedText=t,this.copiedStyles=this.getSelectionStyles(this.selectionStart,this.selectionEnd)},paste:function(e){var t=null,n=this._getClipboardData(e);n?t=n.getData("text"):t=this.copiedText,t&&this.insertChars(t)},cut:function(e){if(this.selectionStart===this.selectionEnd)return;this.copy(),this.removeChars(e)},_getClipboardData:function(e){return e&&(e.clipboardData||fabric.window.clipboardData)},onKeyPress:function(e){if(!this.isEditing||e.metaKey||e.ctrlKey)return;e.which!==0&&this.insertChars(String.fromCharCode(e.which)),e.stopPropagation()},getDownCursorOffset:function(e,t){var n=t?this.selectionEnd:this.selectionStart,r=this.text.split(this._reNewline),i,s,o=this.text.slice(0,n),u=this.text.slice(n),a=o.slice(o.lastIndexOf("\n")+1),f=u.match(/(.*)\n?/)[1],l=(u.match(/.*\n(.*)\n?/)||{})[1]||"",c=this.get2DCursorLocation(n);if(c.lineIndex===r.length-1||e.metaKey||e.keyCode===34)return this.text.length-n;var h=this._getWidthOfLine(this.ctx,c.lineIndex,r);s=this._getLineLeftOffset(h);var p=s,d=c.lineIndex;for(var v=0,m=a.length;v<m;v++)i=a[v],p+=this._getWidthOfChar(this.ctx,i,d,v);var g=this._getIndexOnNextLine(c,l,p,r);return f.length+1+g},_getIndexOnNextLine:function(e,t,n,r){var i=e.lineIndex+1,s=this._getWidthOfLine(this.ctx,i,r),o=this._getLineLeftOffset(s),u=o,a=0,f;for(var l=0,c=t.length;l<c;l++){var h=t[l],p=this._getWidthOfChar(this.ctx,h,i,l);u+=p;if(u>n){f=!0;var d=u-p,v=u,m=Math.abs(d-n),g=Math.abs(v-n);a=g<m?l+1:l;break}}return f||(a=t.length),a},moveCursorDown:function(e){this.abortCursorAnimation(),this._currentCursorOpacity=1;var t=this.getDownCursorOffset(e,this._selectionDirection==="right");e.shiftKey?this.moveCursorDownWithShift(t):this.moveCursorDownWithoutShift(t),this.initDelayedCursor()},moveCursorDownWithoutShift:function(e){this._selectionDirection="right",this.selectionStart+=e,this.selectionStart>this.text.length&&(this.selectionStart=this.text.length),this.selectionEnd=this.selectionStart,this.fire("selection:changed"),this.canvas&&this.canvas.fire("text:selection:changed",{target:this})},swapSelectionPoints:function(){var e=this.selectionEnd;this.selectionEnd=this.selectionStart,this.selectionStart=e},moveCursorDownWithShift:function(e){this.selectionEnd===this.selectionStart&&(this._selectionDirection="right");var t=this._selectionDirection==="right"?"selectionEnd":"selectionStart";this[t]+=e,this.selectionEnd<this.selectionStart&&this._selectionDirection==="left"&&(this.swapSelectionPoints(),this._selectionDirection="right"),this.selectionEnd>this.text.length&&(this.selectionEnd=this.text.length),this.fire("selection:changed"),this.canvas&&this.canvas.fire("text:selection:changed",{target:this})},getUpCursorOffset:function(e,t){var n=t?this.selectionEnd:this.selectionStart,r=this.get2DCursorLocation(n);if(r.lineIndex===0||e.metaKey||e.keyCode===33)return n;var i=this.text.slice(0,n),s=i.slice(i.lastIndexOf("\n")+1),o=(i.match(/\n?(.*)\n.*$/)||{})[1]||"",u=this.text.split(this._reNewline),a,f=this._getWidthOfLine(this.ctx,r.lineIndex,u),l=this._getLineLeftOffset(f),c=l,h=r.lineIndex;for(var p=0,d=s.length;p<d;p++)a=s[p],c+=this._getWidthOfChar(this.ctx,a,h,p);var v=this._getIndexOnPrevLine(r,o,c,u);return o.length-v+s.length},_getIndexOnPrevLine:function(e,t,n,r){var i=e.lineIndex-1,s=this._getWidthOfLine(this.ctx,i,r),o=this._getLineLeftOffset(s),u=o,a=0,f;for(var l=0,c=t.length;l<c;l++){var h=t[l],p=this._getWidthOfChar(this.ctx,h,i,l);u+=p;if(u>n){f=!0;var d=u-p,v=u,m=Math.abs(d-n),g=Math.abs(v-n);a=g<m?l:l-1;break}}return f||(a=t.length-1),a},moveCursorUp:function(e){this.abortCursorAnimation(),this._currentCursorOpacity=1;var t=this.getUpCursorOffset(e,this._selectionDirection==="right");e.shiftKey?this.moveCursorUpWithShift(t):this.moveCursorUpWithoutShift(t),this.initDelayedCursor()},moveCursorUpWithShift:function(e){this.selectionEnd===this.selectionStart&&(this._selectionDirection="left");var t=this._selectionDirection==="right"?"selectionEnd":"selectionStart";this[t]-=e,this.selectionEnd<this.selectionStart&&this._selectionDirection==="right"&&(this.swapSelectionPoints(),this._selectionDirection="left"),this.selectionStart<0&&(this.selectionStart=0),this.fire("selection:changed"),this.canvas&&this.canvas.fire("text:selection:changed",{target:this})},moveCursorUpWithoutShift:function(e){this.selectionStart===this.selectionEnd&&(this.selectionStart-=e),this.selectionStart<0&&(this.selectionStart=0),this.selectionEnd=this.selectionStart,this._selectionDirection="left",this.fire("selection:changed"),this.canvas&&this.canvas.fire("text:selection:changed",{target:this})},moveCursorLeft:function(e){if(this.selectionStart===0&&this.selectionEnd===0)return;this.abortCursorAnimation(),this._currentCursorOpacity=1,e.shiftKey?this.moveCursorLeftWithShift(e):this.moveCursorLeftWithoutShift(e),this.initDelayedCursor()},_move:function(e,t,n){e.altKey?this[t]=this["findWordBoundary"+n](this[t]):e.metaKey||e.keyCode===35||e.keyCode===36?this[t]=this["findLineBoundary"+n](this[t]):this[t]+=n==="Left"?-1:1},_moveLeft:function(e,t){this._move(e,t,"Left")},_moveRight:function(e,t){this._move(e,t,"Right")},moveCursorLeftWithoutShift:function(e){this._selectionDirection="left",this.selectionEnd===this.selectionStart&&this._moveLeft(e,"selectionStart"),this.selectionEnd=this.selectionStart,this.fire("selection:changed"),this.canvas&&this.canvas.fire("text:selection:changed",{target:this})},moveCursorLeftWithShift:function(e){this._selectionDirection==="right"&&this.selectionStart!==this.selectionEnd?this._moveLeft(e,"selectionEnd"):(this._selectionDirection="left",this._moveLeft(e,"selectionStart"),this.text.charAt(this.selectionStart)==="\n"&&this.selectionStart--,this.selectionStart<0&&(this.selectionStart=0)),this.fire("selection:changed"),this.canvas&&this.canvas.fire("text:selection:changed",{target:this})},moveCursorRight:function(e){if(this.selectionStart>=this.text.length&&this.selectionEnd>=this.text.length)return;this.abortCursorAnimation(),this._currentCursorOpacity=1,e.shiftKey?this.moveCursorRightWithShift(e):this.moveCursorRightWithoutShift(e),this.initDelayedCursor()},moveCursorRightWithShift:function(e){this._selectionDirection==="left"&&this.selectionStart!==this.selectionEnd?this._moveRight(e,"selectionStart"):(this._selectionDirection="right",this._moveRight(e,"selectionEnd"),this.text.charAt(this.selectionEnd-1)==="\n"&&this.selectionEnd++,this.selectionEnd>this.text.length&&(this.selectionEnd=this.text.length)),this.fire("selection:changed"),this.canvas&&this.canvas.fire("text:selection:changed",{target:this})},moveCursorRightWithoutShift:function(e){this._selectionDirection="right",this.selectionStart===this.selectionEnd?(this._moveRight(e,"selectionStart"),this.selectionEnd=this.selectionStart):(this.selectionEnd+=this.getNumNewLinesInSelectedText(),this.selectionEnd>this.text.length&&(this.selectionEnd=this.text.length),this.selectionStart=this.selectionEnd),this.fire("selection:changed"),this.canvas&&this.canvas.fire("text:selection:changed",{target:this})},removeChars:function(e){this.selectionStart===this.selectionEnd?this._removeCharsNearCursor(e):this._removeCharsFromTo(this.selectionStart,this.selectionEnd),this.selectionEnd=this.selectionStart,this._removeExtraneousStyles(),this.canvas&&this.canvas.renderAll().renderAll(),this.setCoords(),this.fire("changed"),this.canvas&&this.canvas.fire("text:changed",{target:this})},_removeCharsNearCursor:function(e){if(this.selectionStart!==0)if(e.metaKey){var t=this.findLineBoundaryLeft(this.selectionStart);this._removeCharsFromTo(t,this.selectionStart),this.selectionStart=t}else if(e.altKey){var n=this.findWordBoundaryLeft(this.selectionStart);this._removeCharsFromTo(n,this.selectionStart),this.selectionStart=n}else{var r=this.text.slice(this.selectionStart-1,this.selectionStart)==="\n";this.removeStyleObject(r),this.selectionStart--,this.text=this.text.slice(0,this.selectionStart)+this.text.slice(this.selectionStart+1)}}}),fabric.util.object.extend(fabric.IText.prototype,{_setSVGTextLineText:function(e,t,n,r,i,s){this.styles[t]?this._setSVGTextLineChars(e,t,n,r,i,s):this.callSuper("_setSVGTextLineText",e,t,n,r,i)},_setSVGTextLineChars:function(e,t,n,r,i,s){var o=t===0||this.useNative?"y":"dy",u=e.split(""),a=0,f=this._getSVGLineLeftOffset(t),l=this._getSVGLineTopOffset(t),c=this._getHeightOfLine(this.ctx,t);for(var h=0,p=u.length;h<p;h++){var d=this.styles[t][h]||{};n.push(this._createTextCharSpan(u[h],d,f,l,o,a));var v=this._getWidthOfChar(this.ctx,u[h],t,h);d.textBackgroundColor&&s.push(this._createTextCharBg(d,f,l,c,v,a)),a+=v}},_getSVGLineLeftOffset:function(e){return this._boundaries&&this._boundaries[e]?fabric.util.toFixed(this._boundaries[e].left,2):0},_getSVGLineTopOffset:function(e){var t=0;for(var n=0;n<=e;n++)t+=this._getHeightOfLine(this.ctx,n);return t-this.height/2},_createTextCharBg:function(e,t,n,r,i,s){return['<rect fill="',e.textBackgroundColor,'" transform="translate(',-this.width/2," ",-this.height+r,")",'" x="',t+s,'" y="',n+r,'" width="',i,'" height="',r,'"></rect>'].join("")},_createTextCharSpan:function(e,t,n,r,i,s){var o=this.getSvgStyles.call(fabric.util.object.extend({visible:!0,fill:this.fill,stroke:this.stroke,type:"text"},t));return['<tspan x="',n+s,'" ',i,'="',r,'" ',t.fontFamily?'font-family="'+t.fontFamily.replace(/"/g,"'")+'" ':"",t.fontSize?'font-size="'+t.fontSize+'" ':"",t.fontStyle?'font-style="'+t.fontStyle+'" ':"",t.fontWeight?'font-weight="'+t.fontWeight+'" ':"",t.textDecoration?'text-decoration="'+t.textDecoration+'" ':"",'style="',o,'">',fabric.util.string.escapeXml(e),"</tspan>"].join("")}}),function(){function request(e,t,n){var r=URL.parse(e);r.port||(r.port=r.protocol.indexOf("https:")===0?443:80);var i=r.port===443?HTTPS:HTTP,s=i.request({hostname:r.hostname,port:r.port,path:r.path,method:"GET"},function(e){var r="";t&&e.setEncoding(t),e.on("end",function(){n(r)}),e.on("data",function(t){e.statusCode===200&&(r+=t)})});s.on("error",function(e){e.errno===process.ECONNREFUSED?fabric.log("ECONNREFUSED: connection refused to "+r.hostname+":"+r.port):fabric.log(e.message)}),s.end()}function requestFs(e,t){var n=require("fs");n.readFile(e,function(e,n){if(e)throw fabric.log(e),e;t(n)})}if(typeof document!="undefined"&&typeof window!="undefined")return;var DOMParser=require("xmldom").DOMParser,URL=require("url"),HTTP=require("http"),HTTPS=require("https"),Canvas=require("canvas"),Image=require("canvas").Image;fabric.util.loadImage=function(e,t,n){function r(r){i.src=new Buffer(r,"binary"),i._src=e,t&&t.call(n,i)}var i=new Image;e&&(e instanceof Buffer||e.indexOf("data")===0)?(i.src=i._src=e,t&&t.call(n,i)):e&&e.indexOf("http")!==0?requestFs(e,r):e?request(e,"binary",r):t&&t.call(n,e)},fabric.loadSVGFromURL=function(e,t,n){e=e.replace(/^\n\s*/,"").replace(/\?.*$/,"").trim(),e.indexOf("http")!==0?requestFs(e,function(
e){fabric.loadSVGFromString(e.toString(),t,n)}):request(e,"",function(e){fabric.loadSVGFromString(e,t,n)})},fabric.loadSVGFromString=function(e,t,n){var r=(new DOMParser).parseFromString(e);fabric.parseSVGDocument(r.documentElement,function(e,n){t&&t(e,n)},n)},fabric.util.getScript=function(url,callback){request(url,"",function(body){eval(body),callback&&callback()})},fabric.Image.fromObject=function(e,t){fabric.util.loadImage(e.src,function(n){var r=new fabric.Image(n);r._initConfig(e),r._initFilters(e,function(e){r.filters=e||[],t&&t(r)})})},fabric.createCanvasForNode=function(e,t,n,r){r=r||n;var i=fabric.document.createElement("canvas"),s=new Canvas(e||600,t||600,r);i.style={},i.width=s.width,i.height=s.height;var o=fabric.Canvas||fabric.StaticCanvas,u=new o(i,n);return u.contextContainer=s.getContext("2d"),u.nodeCanvas=s,u.Font=Canvas.Font,u},fabric.StaticCanvas.prototype.createPNGStream=function(){return this.nodeCanvas.createPNGStream()},fabric.StaticCanvas.prototype.createJPEGStream=function(e){return this.nodeCanvas.createJPEGStream(e)};var origSetWidth=fabric.StaticCanvas.prototype.setWidth;fabric.StaticCanvas.prototype.setWidth=function(e,t){return origSetWidth.call(this,e,t),this.nodeCanvas.width=e,this},fabric.Canvas&&(fabric.Canvas.prototype.setWidth=fabric.StaticCanvas.prototype.setWidth);var origSetHeight=fabric.StaticCanvas.prototype.setHeight;fabric.StaticCanvas.prototype.setHeight=function(e,t){return origSetHeight.call(this,e,t),this.nodeCanvas.height=e,this},fabric.Canvas&&(fabric.Canvas.prototype.setHeight=fabric.StaticCanvas.prototype.setHeight)}();
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
