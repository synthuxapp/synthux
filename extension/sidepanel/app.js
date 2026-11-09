import"./chunks/chunk-Y6SLVHK3.js";var I=globalThis,L=I.ShadowRoot&&(I.ShadyCSS===void 0||I.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,F=Symbol(),le=new WeakMap,P=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==F)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(L&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=le.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&le.set(t,e))}return e}toString(){return this.cssText}},ce=r=>new P(typeof r=="string"?r:r+"",void 0,F),f=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,i,o)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new P(t,r,F)},de=(r,e)=>{if(L)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=I.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},B=L?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return ce(t)})(r):r;var{is:Le,defineProperty:Ne,getOwnPropertyDescriptor:je,getOwnPropertyNames:He,getOwnPropertySymbols:Ue,getPrototypeOf:Fe}=Object,N=globalThis,pe=N.trustedTypes,Be=pe?pe.emptyScript:"",Ge=N.reactiveElementPolyfillSupport,E=(r,e)=>r,G={toAttribute(r,e){switch(e){case Boolean:r=r?Be:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},he=(r,e)=>!Le(r,e),ue={attribute:!0,type:String,converter:G,reflect:!1,useDefault:!1,hasChanged:he};Symbol.metadata??=Symbol("metadata"),N.litPropertyMetadata??=new WeakMap;var x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ue){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Ne(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:o}=je(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get:i,set(a){let l=i?.call(this);o?.call(this,a),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ue}static _$Ei(){if(this.hasOwnProperty(E("elementProperties")))return;let e=Fe(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(E("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(E("properties"))){let t=this.properties,s=[...He(t),...Ue(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(B(i))}else e!==void 0&&t.push(B(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return de(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:G).toAttribute(t,s.type);this._$Em=e,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let o=s.getPropertyOptions(i),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:G;this._$Em=i;let l=a.fromAttribute(t,o.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(e,t,s,i=!1,o){if(e!==void 0){let a=this.constructor;if(i===!1&&(o=this[e]),s??=a.getPropertyOptions(e),!((s.hasChanged??he)(o,t)||s.useDefault&&s.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:o},a){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),o!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,o]of s){let{wrapped:a}=o,l=this[i];a!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,o,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[E("elementProperties")]=new Map,x[E("finalized")]=new Map,Ge?.({ReactiveElement:x}),(N.reactiveElementVersions??=[]).push("2.1.2");var Y=globalThis,me=r=>r,j=Y.trustedTypes,ge=j?j.createPolicy("lit-html",{createHTML:r=>r}):void 0,we="$lit$",v=`lit$${Math.random().toFixed(9).slice(2)}$`,ke="?"+v,De=`<${ke}>`,_=document,R=()=>_.createComment(""),M=r=>r===null||typeof r!="object"&&typeof r!="function",X=Array.isArray,Ve=r=>X(r)||typeof r?.[Symbol.iterator]=="function",D=`[ 	
\f\r]`,T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,fe=/-->/g,be=/>/g,w=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),xe=/'/g,ve=/"/g,_e=/^(?:script|style|textarea|title)$/i,Q=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),n=Q(1),it=Q(2),rt=Q(3),$=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),ye=new WeakMap,k=_.createTreeWalker(_,129);function $e(r,e){if(!X(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ge!==void 0?ge.createHTML(e):e}var We=(r,e)=>{let t=r.length-1,s=[],i,o=e===2?"<svg>":e===3?"<math>":"",a=T;for(let l=0;l<t;l++){let c=r[l],p,u,d=-1,g=0;for(;g<c.length&&(a.lastIndex=g,u=a.exec(c),u!==null);)g=a.lastIndex,a===T?u[1]==="!--"?a=fe:u[1]!==void 0?a=be:u[2]!==void 0?(_e.test(u[2])&&(i=RegExp("</"+u[2],"g")),a=w):u[3]!==void 0&&(a=w):a===w?u[0]===">"?(a=i??T,d=-1):u[1]===void 0?d=-2:(d=a.lastIndex-u[2].length,p=u[1],a=u[3]===void 0?w:u[3]==='"'?ve:xe):a===ve||a===xe?a=w:a===fe||a===be?a=T:(a=w,i=void 0);let b=a===w&&r[l+1].startsWith("/>")?" ":"";o+=a===T?c+De:d>=0?(s.push(p),c.slice(0,d)+we+c.slice(d)+v+b):c+v+(d===-2?l:b)}return[$e(r,o+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},z=class r{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let o=0,a=0,l=e.length-1,c=this.parts,[p,u]=We(e,t);if(this.el=r.createElement(p,s),k.currentNode=this.el.content,t===2||t===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=k.nextNode())!==null&&c.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith(we)){let g=u[a++],b=i.getAttribute(d).split(v),S=/([.?@])?(.*)/.exec(g);c.push({type:1,index:o,name:S[2],strings:b,ctor:S[1]==="."?W:S[1]==="?"?K:S[1]==="@"?q:A}),i.removeAttribute(d)}else d.startsWith(v)&&(c.push({type:6,index:o}),i.removeAttribute(d));if(_e.test(i.tagName)){let d=i.textContent.split(v),g=d.length-1;if(g>0){i.textContent=j?j.emptyScript:"";for(let b=0;b<g;b++)i.append(d[b],R()),k.nextNode(),c.push({type:2,index:++o});i.append(d[g],R())}}}else if(i.nodeType===8)if(i.data===ke)c.push({type:2,index:o});else{let d=-1;for(;(d=i.data.indexOf(v,d+1))!==-1;)c.push({type:7,index:o}),d+=v.length-1}o++}}static createElement(e,t){let s=_.createElement("template");return s.innerHTML=e,s}};function C(r,e,t=r,s){if(e===$)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,o=M(e)?void 0:e._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(r),i._$AT(r,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=C(r,i._$AS(r,e.values),i,s)),e}var V=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??_).importNode(t,!0);k.currentNode=i;let o=k.nextNode(),a=0,l=0,c=s[0];for(;c!==void 0;){if(a===c.index){let p;c.type===2?p=new O(o,o.nextSibling,this,e):c.type===1?p=new c.ctor(o,c.name,c.strings,this,e):c.type===6&&(p=new J(o,this,e)),this._$AV.push(p),c=s[++l]}a!==c?.index&&(o=k.nextNode(),a++)}return k.currentNode=_,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},O=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=C(this,e,t),M(e)?e===h||e==null||e===""?(this._$AH!==h&&this._$AR(),this._$AH=h):e!==this._$AH&&e!==$&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ve(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==h&&M(this._$AH)?this._$AA.nextSibling.data=e:this.T(_.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=z.createElement($e(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let o=new V(i,this),a=o.u(this.options);o.p(t),this.T(a),this._$AH=o}}_$AC(e){let t=ye.get(e.strings);return t===void 0&&ye.set(e.strings,t=new z(e)),t}k(e){X(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let o of e)i===t.length?t.push(s=new r(this.O(R()),this.O(R()),this,this.options)):s=t[i],s._$AI(o),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=me(e).nextSibling;me(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},A=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,o){this.type=1,this._$AH=h,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=h}_$AI(e,t=this,s,i){let o=this.strings,a=!1;if(o===void 0)e=C(this,e,t,0),a=!M(e)||e!==this._$AH&&e!==$,a&&(this._$AH=e);else{let l=e,c,p;for(e=o[0],c=0;c<o.length-1;c++)p=C(this,l[s+c],t,c),p===$&&(p=this._$AH[c]),a||=!M(p)||p!==this._$AH[c],p===h?e=h:e!==h&&(e+=(p??"")+o[c+1]),this._$AH[c]=p}a&&!i&&this.j(e)}j(e){e===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},W=class extends A{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===h?void 0:e}},K=class extends A{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==h)}},q=class extends A{constructor(e,t,s,i,o){super(e,t,s,i,o),this.type=5}_$AI(e,t=this){if((e=C(this,e,t,0)??h)===$)return;let s=this._$AH,i=e===h&&s!==h||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==h&&(s===h||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},J=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){C(this,e)}};var Ke=Y.litHtmlPolyfillSupport;Ke?.(z,O),(Y.litHtmlVersions??=[]).push("3.3.2");var Se=(r,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let o=t?.renderBefore??null;s._$litPart$=i=new O(e.insertBefore(R(),o),o,void 0,t??{})}return i._$AI(r),i};var Z=globalThis,m=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Se(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return $}};m._$litElement$=!0,m.finalized=!0,Z.litElementHydrateSupport?.({LitElement:m});var qe=Z.litElementPolyfillSupport;qe?.({LitElement:m});(Z.litElementVersions??=[]).push("4.2.2");var Ce=5;async function H(){try{return(await chrome.storage.local.get({customProfiles:[]})).customProfiles||[]}catch{return[]}}async function Ae(r){let e=await H();if(e.length>=Ce)throw new Error(`Maximum ${Ce} custom profiles allowed`);let t={id:`custom-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,icon:"\u{1F464}",custom:!0,name:{en:r.name,tr:r.name},description:{en:r.description||"",tr:r.description||""},ageRange:r.ageRange||"25-35",techLevel:r.techLevel||"medium",disabilities:r.disabilities||[],goal:r.goal||"",priorityHeuristics:r.priorityHeuristics||[],weight:1,systemPrompt:Je(r)};return e.push(t),await chrome.storage.local.set({customProfiles:e}),t}async function ee(r){let t=(await H()).filter(s=>s.id!==r);return await chrome.storage.local.set({customProfiles:t}),t}function Je(r){let e={low:"not very comfortable with technology, prefers simple interfaces",medium:"moderately comfortable with technology, uses common apps regularly",high:"very tech-savvy, comfortable with complex interfaces and shortcuts"},t={"18-25":"a young adult (18-25) who is digitally native","25-35":"an adult (25-35) with regular internet experience","35-50":"a middle-aged adult (35-50) with moderate tech familiarity","50-65":"an older adult (50-65) who may prefer larger text and simpler layouts","65+":"a senior user (65+) who needs high contrast, large click targets, and simple navigation"},s={vision:"low vision \u2014 needs high contrast, large text, and screen reader support",hearing:"hearing impairment \u2014 relies on captions and visual cues instead of audio",motor:"motor disability \u2014 uses keyboard or switch device, needs large click targets",cognitive:"cognitive disability \u2014 needs simple language, clear structure, and minimal distractions",none:"no disabilities"},i=t[r.ageRange]||t["25-35"],o=e[r.techLevel]||e.medium,a=(r.disabilities||[]).length>0?r.disabilities.map(c=>s[c]||c).join("; "):s.none,l=r.goal||"browsing the page to accomplish a task";return`You are ${i}. You are ${o}.
Your accessibility needs: ${a}.
Your goal on this page: ${l}.

When evaluating this web page, adopt this persona fully. Consider:
- How would someone with your age, tech level, and abilities experience this page?
- Are there barriers that would prevent you from accomplishing your goal?
- Is the language, layout, and interaction design appropriate for your profile?
- Would you feel confident, confused, or frustrated using this page?

Evaluate from YOUR perspective \u2014 not as a generic user.`}var Pe=10,y=[{id:"nielsen-10",name:"Nielsen's 10 Usability Heuristics",shortName:"Nielsen 10",category:"General UX",description:"Industry-standard general usability framework by Jakob Nielsen.",file:"rules/nielsen-10.json",ruleCount:10,isBuiltIn:!0},{id:"ecommerce",name:"E-Commerce & Conversion UX",shortName:"E-Commerce",category:"E-Commerce & Retail",description:"Specialized UX rules for online stores, product pages, carts, and checkout flows.",file:"rules/ecommerce.json",ruleCount:8,isBuiltIn:!0},{id:"saas",name:"SaaS & Web Application UX",shortName:"SaaS",category:"SaaS & Dashboards",description:"Specialized UX rules for SaaS apps, dashboards, onboarding, and self-service workflows.",file:"rules/saas.json",ruleCount:8,isBuiltIn:!0},{id:"fintech",name:"Fintech, Banking & Web3 UX",shortName:"Fintech",category:"Finance & Banking",description:"High-trust financial UX rules covering transaction safety, fee transparency, and numerical legibility.",file:"rules/fintech.json",ruleCount:8,isBuiltIn:!0}],Ye={"0-20":"Critical violations \u2014 severe usability barriers","21-40":"Major issues \u2014 frequent user friction and confusion","41-60":"Moderate \u2014 functional but with notable UX gaps","61-80":"Good \u2014 solid implementation with minor issues","81-100":"Excellent \u2014 best-in-class user experience"};function Xe(r){let e=r;if(typeof r=="string")try{e=JSON.parse(r)}catch{throw new Error("Invalid JSON syntax in rule pack.")}if(!e||typeof e!="object")throw new Error("Rule pack must be a JSON object.");let t=String(e.name||e.shortName||"").trim();if(!t)throw new Error('Rule pack must include a "name" field.');if(!Array.isArray(e.rules)||e.rules.length===0)throw new Error('Rule pack must contain a non-empty "rules" array.');if(e.rules.length>25)throw new Error("Rule pack can contain at most 25 rules.");let s=String(e.id||t).toLowerCase().replace(/[^a-z0-9-_]+/g,"-").replace(/^-+|-+$/g,"")||`custom-pack-${Date.now()}`,o=new Set(y.map(l=>l.id)).has(s)?`custom-${s}`:s,a=e.rules.map((l,c)=>{let p=typeof l.name=="object"&&l.name!==null?String(l.name.en||l.name.tr||`Rule ${c+1}`).trim():String(l.name||`Rule ${c+1}`).trim(),u=typeof l.name=="object"&&l.name!==null?String(l.name.tr||p).trim():p,d=typeof l.description=="object"&&l.description!==null?String(l.description.en||l.description.tr||p).trim():String(l.description||p).trim(),g=typeof l.description=="object"&&l.description!==null?String(l.description.tr||d).trim():d,b=String(l.id||`${o}-rule-${c+1}`).toLowerCase().replace(/[^a-z0-9-_]+/g,"-"),S=Number.isFinite(Number(l.weight))?Math.max(.1,Math.min(3,Number(l.weight))):1;return{id:b,name:{en:p,tr:u},description:{en:d,tr:g},weight:S,automated_checks:Array.isArray(l.automated_checks)?l.automated_checks:[],evaluation_guide:String(l.evaluation_guide||l.criteria?.join(", ")||d).trim(),prompt_template:String(l.prompt_template||`Evaluate this web page for '${p}'.`).trim(),scoring_rubric:l.scoring_rubric&&typeof l.scoring_rubric=="object"?l.scoring_rubric:Ye}});return{id:o,name:t,shortName:String(e.shortName||t.slice(0,22)).trim(),category:String(e.category||"Custom Pack").trim(),description:String(e.description||`Custom UX rule pack (${a.length} rules)`).trim(),version:String(e.version||"1.0.0").trim(),source:String(e.source||"custom").trim(),ruleCount:a.length,isCustom:!0,rules:a}}async function U(){try{let r=await chrome.storage.local.get("customRulePacks");return Array.isArray(r.customRulePacks)?r.customRulePacks:[]}catch{return[]}}async function Ee(){let r=await U();return[...y,...r]}async function Te(r){let e=Xe(r),t=await U(),s=t.findIndex(i=>i.id===e.id);if(s>=0)t[s]=e;else{if(t.length>=Pe)throw new Error(`Maximum of ${Pe} custom rule packs reached.`);t.push(e)}return await chrome.storage.local.set({customRulePacks:t}),e}async function Re(r){let t=(await U()).filter(s=>s.id!==r);return await chrome.storage.local.set({customRulePacks:t}),t}async function Me(r="nielsen-10"){try{let e=y.find(o=>o.id===r);if(e){let a=await(await fetch(chrome.runtime.getURL(e.file))).json();return{...a,id:a.id||e.id,shortName:a.shortName||e.shortName,category:a.category||e.category}}let s=(await U()).find(o=>o.id===r);return s&&Array.isArray(s.rules)&&s.rules.length>0?s:await(await fetch(chrome.runtime.getURL("rules/nielsen-10.json"))).json()}catch(e){return console.error("[synthux] Failed to load heuristics:",e),Qe()}}function Qe(){return{name:"Nielsen's 10 Usability Heuristics",version:"1.0.0",source:"https://www.nngroup.com/articles/ten-usability-heuristics/",rules:[{id:"visibility-of-system-status",name:{en:"Visibility of System Status",tr:"Sistem Durumu G\xF6r\xFCn\xFCrl\xFC\u011F\xFC"},weight:1,scoring_rubric:{"0-20":"Critical violations","21-40":"Major issues","41-60":"Some feedback present","61-80":"Good feedback","81-100":"Excellent"}},{id:"match-real-world",name:{en:"Match Between System and Real World",tr:"Sistem-Ger\xE7ek D\xFCnya E\u015Fle\u015Fmesi"},weight:1,scoring_rubric:{"0-20":"Critical","21-40":"Major","41-60":"Moderate","61-80":"Good","81-100":"Excellent"}},{id:"user-control-freedom",name:{en:"User Control and Freedom",tr:"Kullan\u0131c\u0131 Kontrol\xFC ve \xD6zg\xFCrl\xFCk"},weight:1,scoring_rubric:{"0-20":"Critical","21-40":"Major","41-60":"Moderate","61-80":"Good","81-100":"Excellent"}},{id:"consistency-standards",name:{en:"Consistency and Standards",tr:"Tutarl\u0131l\u0131k ve Standartlar"},weight:1,scoring_rubric:{"0-20":"Critical","21-40":"Major","41-60":"Moderate","61-80":"Good","81-100":"Excellent"}},{id:"error-prevention",name:{en:"Error Prevention",tr:"Hata \xD6nleme"},weight:1,scoring_rubric:{"0-20":"Critical","21-40":"Major","41-60":"Moderate","61-80":"Good","81-100":"Excellent"}},{id:"recognition-over-recall",name:{en:"Recognition Rather Than Recall",tr:"Tan\u0131ma > Hat\u0131rlama"},weight:1,scoring_rubric:{"0-20":"Critical","21-40":"Major","41-60":"Moderate","61-80":"Good","81-100":"Excellent"}},{id:"flexibility-efficiency",name:{en:"Flexibility and Efficiency of Use",tr:"Esneklik ve Verimlilik"},weight:1,scoring_rubric:{"0-20":"Critical","21-40":"Major","41-60":"Moderate","61-80":"Good","81-100":"Excellent"}},{id:"aesthetic-minimalist",name:{en:"Aesthetic and Minimalist Design",tr:"Estetik ve Minimalist Tasar\u0131m"},weight:1,scoring_rubric:{"0-20":"Critical","21-40":"Major","41-60":"Moderate","61-80":"Good","81-100":"Excellent"}},{id:"error-recovery",name:{en:"Help Users Recognize, Diagnose, and Recover from Errors",tr:"Hata Tan\u0131ma ve Kurtarma"},weight:1,scoring_rubric:{"0-20":"Critical","21-40":"Major","41-60":"Moderate","61-80":"Good","81-100":"Excellent"}},{id:"help-documentation",name:{en:"Help and Documentation",tr:"Yard\u0131m ve Dok\xFCmantasyon"},weight:.8,scoring_rubric:{"0-20":"Critical","21-40":"Major","41-60":"Moderate","61-80":"Good","81-100":"Excellent"}}]}}var te=class extends m{static properties={value:{type:Number},label:{type:String},size:{type:String},animated:{type:Boolean},_displayValue:{type:Number,state:!0}};static styles=f`
    :host {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .score-ring {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    svg { transform: rotate(-90deg); }

    .ring-bg {
      fill: none;
      stroke: var(--sx-bg-tertiary, #202024);
      stroke-width: 4;
    }

    .ring-fill {
      fill: none;
      stroke-width: 4;
      stroke-linecap: round;
      transition: stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .ring-fill.high { stroke: var(--sx-score-high, #22c55e); }
    .ring-fill.mid { stroke: var(--sx-score-mid, #eab308); }
    .ring-fill.low { stroke: var(--sx-score-low, #ef4444); }

    .score-value {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .score-number {
      font-weight: 700;
      line-height: 1;
      color: var(--sx-text-primary, #ededf0);
    }

    .score-max {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      font-weight: 500;
    }

    .score-label {
      font-size: 11px;
      font-weight: 500;
      color: var(--sx-text-secondary, #b4b4bc);
      text-align: center;
    }
  `;constructor(){super(),this.value=0,this.label="",this.size="md",this.animated=!0,this._displayValue=0}updated(e){e.has("value")&&(this.animated?this._animateValue():this._displayValue=this.value)}_animateValue(){let e=this._displayValue||0,t=this.value||0,s=700,i=performance.now(),o=a=>{let l=Math.min((a-i)/s,1);this._displayValue=Math.round(e+(t-e)*(1-Math.pow(1-l,3))),l<1&&requestAnimationFrame(o)};requestAnimationFrame(o)}_getColorClass(){return this.value>=71?"high":this.value>=41?"mid":"low"}_getDims(){switch(this.size){case"sm":return{s:56,r:22,f:14};case"lg":return{s:110,r:46,f:28};default:return{s:80,r:34,f:20}}}render(){let e=this._getDims(),t=2*Math.PI*e.r,s=t-t*(this.value||0)/100;return n`
      <div class="score-ring" style="width:${e.s}px;height:${e.s}px;">
        <svg width="${e.s}" height="${e.s}" viewBox="0 0 ${e.s} ${e.s}">
          <circle class="ring-bg" cx="${e.s/2}" cy="${e.s/2}" r="${e.r}"/>
          <circle class="ring-fill ${this._getColorClass()}" cx="${e.s/2}" cy="${e.s/2}" r="${e.r}" stroke-dasharray="${t}" stroke-dashoffset="${s}"/>
        </svg>
        <div class="score-value">
          <span class="score-number" style="font-size:${e.f}px">${this._displayValue}</span>
          <span class="score-max">/100</span>
        </div>
      </div>
      ${this.label?n`<span class="score-label">${this.label}</span>`:""}
    `}};customElements.define("synthux-score",te);var se=class extends m{static properties={ollamaStatus:{type:Object},isAnalyzing:{type:Boolean},progress:{type:Object},pageInfo:{type:Object},selectedProfiles:{type:Array},selectedRulePack:{type:String},rulePacks:{type:Array},mode:{type:String},logEntries:{type:Array},customProfiles:{type:Array},_packRules:{type:Array,state:!0},_showRulePackImporter:{type:Boolean,state:!0},_rulePackError:{type:String,state:!0},_showProfileForm:{type:Boolean,state:!0},_editingProfile:{type:Object,state:!0},_openMenuId:{type:String,state:!0},_selectedHeuristics:{type:Array,state:!0},_copiedCmd:{type:String,state:!0},_versionDismissed:{type:Boolean,state:!0},_showCorsWizard:{type:Boolean,state:!0},_checkingConnection:{type:Boolean,state:!0}};static styles=f`
    :host {
      display: block;
      padding: 16px;
    }

    /* ─── Page Info ──────────────────────────── */
    .page-info {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 20px;
    }

    .page-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--sx-text-primary, #ededf0);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 3px;
    }

    .page-url {
      font-size: 11px;
      color: var(--sx-text-tertiary, #8a8a96);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ─── Section Headers ────────────────────── */
    .section-header {
      font-size: 11px;
      font-weight: 600;
      color: var(--sx-text-tertiary, #8a8a96);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 10px;
    }

    /* ─── Profile Cards ──────────────────────── */
    .profiles {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 20px;
    }

    .profile-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 8px;
      cursor: pointer;
      transition: all 150ms ease;
      user-select: none;
    }

    .profile-card:hover {
      border-color: var(--sx-border-hover, rgba(255,255,255,0.10));
    }

    .profile-card.selected {
      border-color: var(--sx-accent, #3b82f6);
      background: var(--sx-accent-dim, rgba(59,130,246,0.08));
    }

    .profile-details {
      flex: 1;
      min-width: 0;
    }

    .profile-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--sx-text-primary, #ededf0);
    }

    .profile-desc {
      font-size: 11px;
      color: var(--sx-text-secondary, #b4b4bc);
      margin-top: 1px;
    }

    .profile-check {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      border: 1.5px solid var(--sx-border-hover, rgba(255,255,255,0.10));
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 150ms ease;
      font-size: 10px;
    }

    .profile-card.selected .profile-check {
      background: var(--sx-accent, #3b82f6);
      border-color: var(--sx-accent, #3b82f6);
      color: white;
    }

    .profile-card.selected .profile-check::after {
      content: '✓';
      font-weight: 700;
    }

    .profile-actions {
      position: relative;
      margin-left: 4px;
    }

    .kebab-btn {
      background: none;
      border: none;
      color: var(--sx-text-tertiary, #8a8a96);
      cursor: pointer;
      font-size: 16px;
      padding: 2px 6px;
      border-radius: 4px;
      transition: all 0.15s;
      line-height: 1;
      letter-spacing: 1px;
    }

    .kebab-btn:hover {
      background: var(--sx-bg-card-hover, rgba(255,255,255,0.05));
      color: var(--sx-text-primary, #ededf0);
    }

    .profile-dropdown {
      position: absolute;
      right: 0;
      top: 100%;
      margin-top: 4px;
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border-hover, rgba(255,255,255,0.10));
      border-radius: 8px;
      padding: 4px;
      min-width: 110px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      z-index: 10;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 6px;
      width: 100%;
      padding: 7px 10px;
      background: none;
      border: none;
      border-radius: 5px;
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 12px;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.1s;
      text-align: left;
    }

    .dropdown-item:hover {
      background: var(--sx-bg-card-hover, rgba(255,255,255,0.05));
      color: var(--sx-text-primary, #ededf0);
    }

    .dropdown-item.danger:hover {
      background: rgba(239,68,68,0.1);
      color: #ef4444;
    }

    .add-profile-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 12px;
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px dashed var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 8px;
      cursor: pointer;
      transition: all 150ms ease;
      color: var(--sx-text-tertiary, #8a8a96);
      font-size: 12px;
      font-family: inherit;
    }

    .add-profile-btn:hover {
      border-color: var(--sx-border-hover, rgba(255,255,255,0.10));
      color: var(--sx-text-secondary, #b4b4bc);
    }

    .profile-form {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-accent, #3b82f6);
      border-radius: 8px;
      padding: 12px;
    }

    .pf-field { margin-bottom: 8px; }
    .pf-field:last-child { margin-bottom: 0; }

    .pf-label {
      display: block;
      font-size: 11px;
      font-weight: 500;
      color: var(--sx-text-secondary, #b4b4bc);
      margin-bottom: 3px;
    }

    .pf-hint {
      display: block;
      font-size: 10px;
      font-weight: 400;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-bottom: 4px;
    }

    .pf-input {
      width: 100%;
      padding: 6px 8px;
      background: var(--sx-bg-main, #121214);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 6px;
      color: var(--sx-text-primary, #ededf0);
      font-size: 12px;
      font-family: inherit;
      box-sizing: border-box;
    }

    .pf-input:focus {
      outline: none;
      border-color: var(--sx-accent, #3b82f6);
    }

    .pf-row {
      display: flex;
      gap: 8px;
    }

    .pf-row > * { flex: 1; }

    .pf-checks {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 3px;
    }

    .pf-check-label {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 11px;
      color: var(--sx-text-secondary, #b4b4bc);
      cursor: pointer;
    }

    .pf-actions {
      display: flex;
      gap: 6px;
      margin-top: 10px;
    }

    .pf-save {
      flex: 1;
      padding: 7px;
      background: var(--sx-accent, #3b82f6);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
    }

    .pf-cancel {
      padding: 7px 12px;
      background: none;
      color: var(--sx-text-tertiary, #8a8a96);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      font-family: inherit;
    }

    /* ─── Mode Selector ──────────────────────── */
    .mode-selector {
      display: flex;
      gap: 6px;
      margin-bottom: 20px;
    }

    .mode-btn {
      flex: 1;
      padding: 9px;
      border-radius: 8px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      background: var(--sx-bg-card, #1c1c1f);
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 150ms ease;
      text-align: center;
      font-family: inherit;
    }

    .mode-btn:hover {
      border-color: var(--sx-border-hover, rgba(255,255,255,0.10));
    }

    .mode-btn.active {
      border-color: var(--sx-accent, #3b82f6);
      color: var(--sx-text-primary, #ededf0);
      background: var(--sx-accent-dim, rgba(59,130,246,0.08));
    }

    .mode-label {
      font-size: 13px;
      font-weight: 600;
      display: block;
      margin-bottom: 2px;
    }

    .mode-desc {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      font-weight: 400;
    }

    /* ─── Analyze Button ─────────────────────── */
    .analyze-btn {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 8px;
      background: var(--sx-accent, #3b82f6);
      color: white;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
    }

    .analyze-btn:hover:not(:disabled) {
      background: var(--sx-accent-hover, #60a5fa);
    }

    .analyze-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .analyze-btn.analyzing {
      background: var(--sx-bg-tertiary, #202024);
      color: var(--sx-text-secondary, #b4b4bc);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
    }

    /* ─── Flow Analysis Button ──────────────── */
    .flow-btn {
      width: 100%;
      margin-top: 10px;
      padding: 10px 14px;
      background: var(--sx-bg-tertiary, #202024);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 8px;
      color: var(--sx-text-secondary, #b4b4bc);
      font-family: inherit;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 150ms ease;
    }

    .flow-btn:hover {
      border-color: var(--sx-accent, #3b82f6);
      background: rgba(59, 130, 246, 0.06);
      color: var(--sx-text-primary, #ededf0);
    }

    .flow-desc {
      font-size: 10px;
      font-weight: 400;
      color: var(--sx-text-tertiary, #8a8a96);
    }

    /* ─── Progress Display ───────────────────── */
    .progress-container {
      margin-top: 16px;
    }

    .progress-bar-wrapper {
      width: 100%;
      height: 3px;
      background: var(--sx-bg-tertiary, #202024);
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 10px;
    }

    .progress-bar-fill {
      height: 100%;
      background: var(--sx-accent, #3b82f6);
      border-radius: 2px;
      transition: width 400ms ease;
    }

    .cancel-btn {
      width: 100%;
      margin-top: 10px;
      padding: 7px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 6px;
      background: transparent;
      color: var(--sx-text-tertiary, #8a8a96);
      font-size: 11px;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
    }

    .cancel-btn:hover {
      color: var(--sx-error, #ef4444);
      border-color: rgba(239, 68, 68, 0.3);
    }

    /* ─── Offline Notice ─────────────────────── */
    .offline-notice {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 10px 12px;
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 12px;
      color: var(--sx-text-secondary, #b4b4bc);
      line-height: 1.5;
    }

    .offline-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--sx-warning, #eab308);
      flex-shrink: 0;
      margin-top: 6px;
    }

    /* ─── CORS Fix Wizard ──────────────────── */
    .cors-wizard {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid rgba(234, 179, 8, 0.25);
      border-radius: 10px;
      padding: 14px;
      margin-bottom: 16px;
    }

    .cors-wizard-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 600;
      color: var(--sx-warning, #eab308);
      margin-bottom: 10px;
    }

    .cors-wizard-desc {
      font-size: 12px;
      color: var(--sx-text-secondary, #b4b4bc);
      line-height: 1.5;
      margin-bottom: 12px;
    }

    .cors-steps {
      background: #0a0a0c;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 12px;
    }

    .cors-step-header {
      font-size: 11px;
      font-weight: 600;
      color: var(--sx-text-primary, #ededf0);
      margin-bottom: 10px;
    }

    .cors-platform {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }

    .cors-platform:last-of-type {
      border-bottom: none;
    }

    .cors-platform-label {
      font-size: 11px;
      color: var(--sx-text-tertiary, #8a8a96);
      flex-shrink: 0;
      width: 55px;
    }

    .cors-cmd-block {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      background: rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 6px;
      margin-top: 8px;
    }

    .cors-cmd-code {
      font-family: 'SF Mono', Monaco, 'Fira Code', monospace;
      font-size: 11px;
      color: var(--sx-text-primary, #ededf0);
      flex: 1;
      word-break: break-all;
      line-height: 1.4;
    }

    .cors-note {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-top: 6px;
      line-height: 1.4;
    }

    .cors-other-platforms {
      margin-top: 10px;
      font-size: 11px;
    }

    .cors-other-platforms summary {
      color: var(--sx-text-tertiary, #8a8a96);
      cursor: pointer;
      font-size: 10px;
      padding: 4px 0;
    }

    .cors-other-platforms summary:hover {
      color: var(--sx-text-secondary, #b4b4bc);
    }

    .cors-platform-alt {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }

    .cors-platform-alt:last-child {
      border-bottom: none;
    }

    .cors-copy-btn {
      background: var(--sx-bg-tertiary, #202024);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 4px;
      color: var(--sx-text-tertiary, #8a8a96);
      font-size: 10px;
      padding: 2px 8px;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s;
      flex-shrink: 0;
      margin-left: 6px;
    }

    .cors-copy-btn:hover {
      color: var(--sx-text-primary, #ededf0);
      border-color: rgba(255,255,255,0.15);
    }

    .cors-copy-btn.copied {
      color: var(--sx-success, #22c55e);
      border-color: rgba(34, 197, 94, 0.3);
    }

    .cors-check-btn {
      width: 100%;
      padding: 8px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 6px;
      background: transparent;
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
    }

    .cors-check-btn:hover {
      border-color: var(--sx-accent, #3b82f6);
      color: var(--sx-accent, #3b82f6);
    }

    /* ─── Version Banner ───────────────────── */
    .version-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: rgba(249,115,22,0.06);
      border: 1px solid rgba(249,115,22,0.20);
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 12px;
      color: var(--sx-text-secondary, #b4b4bc);
      line-height: 1.4;
    }

    .version-banner-icon {
      font-size: 14px;
      flex-shrink: 0;
    }

    .version-banner-text {
      flex: 1;
    }

    .version-banner-actions {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
    }

    .version-btn {
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.08);
      background: transparent;
      color: var(--sx-text-tertiary, #8a8a96);
      font-size: 10px;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s;
    }

    .version-btn:hover {
      color: var(--sx-text-primary, #ededf0);
    }

    .version-btn.fix {
      color: #f97316;
      border-color: rgba(249,115,22,0.3);
    }

    .version-btn.fix:hover {
      background: rgba(249,115,22,0.08);
    }

    .page-warning {
      font-size: 12px;
      color: var(--sx-text-tertiary, #8a8a96);
      text-align: center;
      padding: 8px;
      font-style: italic;
    }

    /* ─── Terminal Log ─────────────────────── */
    .terminal {
      margin-top: 12px;
      background: #0a0a0c;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px;
      overflow: hidden;
    }

    .terminal-header {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      background: rgba(255,255,255,0.03);
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }

    .terminal-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .terminal-dot.red { background: #ff5f57; }
    .terminal-dot.yellow { background: #febc2e; }
    .terminal-dot.green { background: #28c840; }

    .terminal-title {
      flex: 1;
      text-align: center;
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      font-family: 'SF Mono', Monaco, monospace;
    }

    .terminal-body {
      padding: 8px 10px;
      max-height: 140px;
      overflow-y: auto;
      font-family: 'SF Mono', Monaco, 'Fira Code', monospace;
      font-size: 10px;
      line-height: 1.7;
    }

    .terminal-body::-webkit-scrollbar { width: 3px; }
    .terminal-body::-webkit-scrollbar-track { background: transparent; }
    .terminal-body::-webkit-scrollbar-thumb { background: #1a1a1e; border-radius: 3px; }

    .log-line {
      display: flex;
      gap: 6px;
      white-space: nowrap;
    }

    .log-time {
      color: #555;
      flex-shrink: 0;
    }

    .log-prefix {
      color: var(--sx-accent, #3b82f6);
      flex-shrink: 0;
    }

    .log-msg {
      color: #8b8b8b;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .log-msg.success { color: var(--sx-success, #22c55e); }
    .log-msg.active { color: var(--sx-text-primary, #ededf0); }

    /* ─── Rule Pack Selector ────────────────── */
    .section-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .section-header-row .section-header {
      margin-bottom: 0;
    }

    .pack-import-link {
      background: transparent;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 10px;
      font-weight: 500;
      padding: 3px 8px;
      border-radius: 6px;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s ease;
    }

    .pack-import-link:hover {
      border-color: var(--sx-accent, #3b82f6);
      color: var(--sx-accent, #3b82f6);
    }

    .rule-pack-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
      margin-bottom: 8px;
    }

    .rule-pack-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 9px 10px;
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 8px;
      cursor: pointer;
      text-align: left;
      font-family: inherit;
      transition: all 0.15s ease;
    }

    .rule-pack-card:hover {
      border-color: rgba(255,255,255,0.14);
    }

    .rule-pack-card.active {
      background: var(--sx-accent-dim, rgba(59,130,246,0.08));
      border-color: var(--sx-accent, #3b82f6);
    }

    .rule-pack-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 4px;
      margin-bottom: 2px;
    }

    .rule-pack-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--sx-text-primary, #ededf0);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .rule-pack-card.active .rule-pack-name {
      color: var(--sx-accent, #3b82f6);
    }

    .rule-pack-count {
      font-size: 9px;
      font-weight: 600;
      padding: 1px 5px;
      border-radius: 8px;
      background: rgba(255,255,255,0.06);
      color: var(--sx-text-tertiary, #8a8a96);
      flex-shrink: 0;
    }

    .rule-pack-cat {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }

    .rule-pack-del {
      background: transparent;
      border: none;
      color: var(--sx-text-tertiary, #8a8a96);
      font-size: 11px;
      padding: 0 3px;
      cursor: pointer;
      line-height: 1;
    }

    .rule-pack-del:hover {
      color: var(--sx-error, #ef4444);
    }

    .rule-pack-desc-bar {
      font-size: 11px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-bottom: 18px;
      line-height: 1.4;
    }

    .pack-importer {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.1));
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 16px;
    }

    .pack-importer-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--sx-text-primary, #ededf0);
      margin-bottom: 4px;
    }

    .pack-importer-sub {
      font-size: 11px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-bottom: 10px;
      line-height: 1.4;
    }

    .pack-textarea {
      width: 100%;
      min-height: 90px;
      background: #121215;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      border-radius: 6px;
      color: var(--sx-text-primary, #ededf0);
      font-family: 'SF Mono', Monaco, monospace;
      font-size: 10px;
      padding: 8px;
      box-sizing: border-box;
      resize: vertical;
      margin-bottom: 8px;
    }

    .pack-file-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 8px;
    }

    .pack-file-label {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      border-radius: 6px;
      border: 1px dashed rgba(255,255,255,0.16);
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 11px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .pack-file-label:hover {
      border-color: var(--sx-accent, #3b82f6);
      color: var(--sx-accent, #3b82f6);
    }

    .pack-error {
      font-size: 11px;
      color: var(--sx-error, #ef4444);
      margin-bottom: 8px;
    }
  `;constructor(){super(),this.ollamaStatus={connected:!1,models:[]},this.isAnalyzing=!1,this.progress=null,this.pageInfo=null,this.selectedProfiles=["first-time","power-user","accessibility"],this.selectedRulePack="nielsen-10",this.rulePacks=[...y],this.mode="deep",this.logEntries=[],this.customProfiles=[],this._packRules=[],this._showRulePackImporter=!1,this._rulePackError="",this._showProfileForm=!1,this._editingProfile=null,this._openMenuId=null,this._selectedHeuristics=[],this._copiedCmd=null,this._versionDismissed=!1,this._showCorsWizard=!1,this._checkingConnection=!1,this._fetchPageInfo(),this._loadCustomProfiles(),this._loadSettings(),this._loadRulePacks(),chrome.tabs?.onActivated?.addListener(()=>this._fetchPageInfo()),chrome.tabs?.onUpdated?.addListener((e,t)=>{t.status==="complete"&&this._fetchPageInfo()}),window.addEventListener("profiles-changed",()=>this._loadCustomProfiles()),this._onDocClick=()=>{this._openMenuId=null},document.addEventListener("click",this._onDocClick)}async _loadSettings(){try{let e=await chrome.storage.local.get({synthux_selected_profiles:["first-time","power-user","accessibility"],synthux_selected_mode:"deep",rulePackId:"nielsen-10"});this.selectedProfiles=e.synthux_selected_profiles,this.mode=e.synthux_selected_mode,this.selectedRulePack=e.rulePackId||"nielsen-10",await this._loadActivePackRules(this.selectedRulePack),this.requestUpdate()}catch{}}async _loadRulePacks(){try{this.rulePacks=await Ee(),await this._loadActivePackRules(this.selectedRulePack)}catch{this.rulePacks=[...y]}}async _loadActivePackRules(e){try{let t=await Me(e);this._packRules=Array.isArray(t?.rules)?t.rules:[]}catch{this._packRules=[]}}async _selectRulePack(e){this.isAnalyzing||(this.selectedRulePack=e,this._selectedHeuristics=[],await chrome.storage.local.set({rulePackId:e}),await this._loadActivePackRules(e))}async _handleRulePackFileUpload(e){let t=e.target.files?.[0];if(t)try{let s=await t.text(),i=this.shadowRoot?.getElementById("pack-json-input");i&&(i.value=s),this._rulePackError=""}catch(s){this._rulePackError="Failed to read file: "+s.message}}async _handleSaveCustomRulePack(){let e=this.shadowRoot?.getElementById("pack-json-input")?.value?.trim();if(!e){this._rulePackError="Please upload a .json file or paste JSON content.";return}try{let t=await Te(e);this._rulePackError="",this._showRulePackImporter=!1,await this._loadRulePacks(),await this._selectRulePack(t.id)}catch(t){this._rulePackError=t.message||"Invalid rule pack JSON."}}async _handleDeleteCustomRulePack(e,t){if(e.stopPropagation(),!this.isAnalyzing)try{await Re(t),this.selectedRulePack===t&&await this._selectRulePack("nielsen-10"),await this._loadRulePacks()}catch(s){console.error("[synthux] Failed to delete rule pack:",s)}}_downloadSamplePackTemplate(){let e={id:"my-custom-ux-pack",name:"Custom Healthcare UX Pack",shortName:"Healthcare",category:"Healthcare & Patient Portals",description:"Custom UX evaluation rules for patient portals and telemedicine apps.",version:"1.0.0",rules:[{id:"patient-clarity",name:{en:"Plain Medical Language & Clarity",tr:"Anla\u015F\u0131l\u0131r T\u0131bbi Dil ve Netlik"},description:{en:"Medical terms, appointment instructions, and test results should be explained in plain, empathetic language.",tr:"T\u0131bbi terimler, randevu talimatlar\u0131 ve sonu\xE7lar sade ve anla\u015F\u0131l\u0131r bir dille a\xE7\u0131klanmal\u0131d\u0131r."},weight:1.2,evaluation_guide:"Look for plain-language explanations, clear next steps for patients, and readable typography."},{id:"booking-simplicity",name:{en:"Frictionless Appointment Booking",tr:"Kolay Randevu Alma Deneyimi"},description:{en:"Patients should be able to find providers, check availability, and book or reschedule appointments with minimal steps.",tr:"Hastalar doktorlar\u0131, uygun saatleri ve randevu ad\u0131mlar\u0131n\u0131 en az t\u0131klamayla tamamlayabilmelidir."},weight:1,evaluation_guide:"Look for clear CTAs, visible calendar/schedule availability, and accessible form controls."}]},t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),s=URL.createObjectURL(t),i=document.createElement("a");i.href=s,i.download="synthux-rulepack-template.json",i.click(),URL.revokeObjectURL(s)}updated(e){if(e.has("progress")&&this.progress&&this._addLogEntry(this.progress),e.has("isAnalyzing")){if(this.isAnalyzing)this.logEntries=[{time:this._logTime(),msg:"Starting analysis...",done:!1}];else if(this.logEntries.length>0){let s={...this.logEntries[this.logEntries.length-1],done:!0};this.logEntries=[...this.logEntries.slice(0,-1),s,{time:this._logTime(),msg:"Done.",done:!0}]}}let t=this.shadowRoot?.getElementById("terminal-log");t&&(t.scrollTop=t.scrollHeight)}_addLogEntry(e){let t=e.message||"";if(!t)return;let s=this.logEntries[this.logEntries.length-1];s&&s.msg===t||(this.logEntries=[...this.logEntries,{time:this._logTime(),msg:t,done:!1}])}_logTime(){let e=new Date;return`${String(e.getHours()).padStart(2,"0")}:${String(e.getMinutes()).padStart(2,"0")}:${String(e.getSeconds()).padStart(2,"0")}`}get _isAnalyzablePage(){let e=this.pageInfo?.url||"";return!e.startsWith("http://")&&!e.startsWith("https://")?!1:!["chromewebstore.google.com","chrome.google.com/webstore","microsoftedge.microsoft.com/addons","addons.mozilla.org"].some(s=>e.includes(s))}get _isCloudProvider(){return(this.ollamaStatus?.provider||"ollama")!=="ollama"}get _allHeuristics(){return this._packRules&&this._packRules.length>0?this._packRules:[{id:"visibility-of-system-status",name:{en:"Visibility of System Status"}},{id:"match-real-world",name:{en:"Match Real World"}},{id:"user-control-freedom",name:{en:"User Control & Freedom"}},{id:"consistency-standards",name:{en:"Consistency & Standards"}},{id:"error-prevention",name:{en:"Error Prevention"}},{id:"recognition-over-recall",name:{en:"Recognition > Recall"}},{id:"flexibility-efficiency",name:{en:"Flexibility & Efficiency"}},{id:"aesthetic-minimalist",name:{en:"Aesthetic & Minimalist"}},{id:"error-recovery",name:{en:"Error Recovery"}},{id:"help-documentation",name:{en:"Help & Documentation"}}]}_toggleHeuristic(e){if(this.isAnalyzing)return;let t=[...this._selectedHeuristics],s=t.indexOf(e);s>-1?t.splice(s,1):t.push(e),this._selectedHeuristics=t}_estimateTime(e){let t=this.selectedProfiles?.length||1,s=this._isCloudProvider?.5:4,i=Math.round(e*t*s);return i<1?"<1 min":i>=60?`${Math.round(i/60)}h ${i%60}min`:`${i} min`}async _fetchPageInfo(){if(!this.isAnalyzing)try{let[e]=await chrome.tabs.query({active:!0,currentWindow:!0});e&&(this.pageInfo={title:e.title||"Untitled",url:e.url||""})}catch{this.pageInfo={title:"Unable to detect page",url:""}}}async _loadCustomProfiles(){try{this.customProfiles=await H()}catch{this.customProfiles=[]}}_toggleProfile(e){if(this.isAnalyzing)return;let t=[...this.selectedProfiles],s=t.indexOf(e);s>-1?t.length>1&&t.splice(s,1):t.push(e),this.selectedProfiles=t,chrome.storage.local.set({synthux_selected_profiles:t})}_setMode(e){this.isAnalyzing||(this.mode=e,chrome.storage.local.set({synthux_selected_mode:e}))}async _startAnalysis(){if(!(this.isAnalyzing||!this.ollamaStatus?.connected)){this.dispatchEvent(new CustomEvent("analysis-start"));try{await chrome.runtime.sendMessage({type:"START_ANALYSIS",payload:{mode:this.mode,rulePackId:this.selectedRulePack||"nielsen-10",profiles:this.selectedProfiles,...this.mode==="custom"&&this._selectedHeuristics.length>0?{heuristics:this._selectedHeuristics}:{}}})}catch(e){console.error("[synthux] Failed to start analysis:",e),this.dispatchEvent(new CustomEvent("analysis-end"))}}}async _cancelAnalysis(){try{await chrome.runtime.sendMessage({type:"CANCEL_ANALYSIS"})}catch{}this.dispatchEvent(new CustomEvent("analysis-end"))}_renderProfileCard(e,t,s,i=!1){let o=this.selectedProfiles.includes(e);return n`
      <div 
        class="profile-card ${o?"selected":""}"
        @click="${()=>this._toggleProfile(e)}"
        role="checkbox"
        aria-checked="${o}"
        tabindex="0"
        @keydown="${a=>a.key==="Enter"&&this._toggleProfile(e)}"
      >
        <div class="profile-details">
          <div class="profile-name">${t}${i?n`<span style="font-size: 9px; background: var(--sx-blue-dim, rgba(0,126,255,0.1)); color: var(--sx-blue, #007eff); padding: 1px 6px; border-radius: 8px; margin-left: 6px; font-weight: 600; vertical-align: middle;">Custom</span>`:""}</div>
          <div class="profile-desc">${s}</div>
        </div>
        ${i?n`
          <div class="profile-actions">
            <button class="kebab-btn" @click="${a=>{a.stopPropagation(),this._openMenuId=this._openMenuId===e?null:e}}" title="Options">⋮</button>
            ${this._openMenuId===e?n`
              <div class="profile-dropdown">
                <button class="dropdown-item" @click="${a=>{a.stopPropagation(),this._openMenuId=null,this._editProfile(e)}}">✎ Edit</button>
                <button class="dropdown-item danger" @click="${a=>{a.stopPropagation(),this._openMenuId=null,this._removeProfile(e)}}">✕ Delete</button>
              </div>
            `:""}
          </div>
        `:""}
        <div class="profile-check"></div>
      </div>
    `}_renderProfileForm(){let e=this._editingProfile;return n`
      <div class="profile-form">
        <div class="pf-field">
          <label class="pf-label">Persona Name *</label>
          <span class="pf-hint">Give this synthetic user a name</span>
          <input type="text" class="pf-input" id="pf-name" placeholder="e.g. Senior Executive" maxlength="40" .value="${e?.name?.en||""}" />
        </div>
        <div class="pf-row">
          <div class="pf-field">
            <label class="pf-label">Age Range</label>
            <select class="pf-input" id="pf-age">
              ${["18-25","25-35","35-50","50-65","65+"].map(t=>n`<option value="${t}" ?selected="${(e?.ageRange||"25-35")===t}">${t}</option>`)}
            </select>
          </div>
          <div class="pf-field">
            <label class="pf-label">Tech Savviness</label>
            <select class="pf-input" id="pf-tech">
              ${["low","medium","high"].map(t=>n`<option value="${t}" ?selected="${(e?.techLevel||"medium")===t}">${t==="low"?"Low \u2014 basic user":t==="medium"?"Medium \u2014 regular":"High \u2014 power user"}</option>`)}
            </select>
          </div>
        </div>
        <div class="pf-field">
          <label class="pf-label">Accessibility Needs</label>
          <span class="pf-hint">Does this persona have any disabilities?</span>
          <div class="pf-checks">
            ${[["vision","Low Vision"],["hearing","Hearing"],["motor","Motor"],["cognitive","Cognitive"]].map(([t,s])=>n`
              <label class="pf-check-label">
                <input type="checkbox" class="pf-disability" value="${t}" ?checked="${(e?.disabilities||[]).includes(t)}" />
                ${s}
              </label>
            `)}
          </div>
        </div>
        <div class="pf-field">
          <label class="pf-label">Goal</label>
          <span class="pf-hint">What is this person trying to do on the page?</span>
          <input type="text" class="pf-input" id="pf-goal" placeholder="e.g. Find pricing and compare plans" maxlength="100" .value="${e?.goal||""}" />
        </div>
        <div class="pf-actions">
          <button class="pf-save" @click="${this._handleSaveProfile}">${e?"Update":"Create"}</button>
          <button class="pf-cancel" @click="${()=>{this._showProfileForm=!1,this._editingProfile=null}}">Cancel</button>
        </div>
      </div>
    `}_editProfile(e){let t=this.customProfiles.find(s=>s.id===e);t&&(this._editingProfile=t,this._showProfileForm=!0)}async _removeProfile(e){try{await ee(e),this.selectedProfiles=this.selectedProfiles.filter(t=>t!==e),await this._loadCustomProfiles()}catch(t){console.error("[synthux] Failed to delete profile:",t)}}async _handleSaveProfile(){let e=this.shadowRoot.getElementById("pf-name")?.value?.trim();if(!e)return;let t=this.shadowRoot.getElementById("pf-age")?.value||"25-35",s=this.shadowRoot.getElementById("pf-tech")?.value||"medium",i=this.shadowRoot.getElementById("pf-goal")?.value?.trim()||"",o=Array.from(this.shadowRoot.querySelectorAll(".pf-disability:checked")).map(a=>a.value);try{this._editingProfile&&await ee(this._editingProfile.id);let a=await Ae({name:e,description:`${t}, ${s} tech${i?` \u2014 ${i}`:""}`,ageRange:t,techLevel:s,disabilities:o,goal:i,priorityHeuristics:[]});if(this._editingProfile){let l=this.selectedProfiles.indexOf(this._editingProfile.id);if(l>-1){let c=[...this.selectedProfiles];c[l]=a.id,this.selectedProfiles=c}}this._showProfileForm=!1,this._editingProfile=null,await this._loadCustomProfiles()}catch(a){console.error("[synthux] Failed to save profile:",a)}}render(){let e=this.ollamaStatus?.connected,t=this.mode!=="custom"||this._selectedHeuristics.length>0,s=e&&this._isAnalyzablePage&&this.selectedProfiles.length>0&&t;return n`
      ${this.pageInfo?n`
        <div class="page-info">
          <div class="page-title">${this.pageInfo.title}</div>
          <div class="page-url">${this.pageInfo.url}</div>
          ${!this._isAnalyzablePage&&this.pageInfo.url?n`
            <div class="page-warning">Navigate to a website to analyze.</div>
          `:""}
        </div>
      `:""}

      ${this.ollamaStatus?.corsBlocked||this._showCorsWizard?this._renderCorsWizard():""}

      ${!e&&!this.ollamaStatus?.corsBlocked?n`
        <div class="offline-notice">
          <span class="offline-dot"></span>
          <div>
            <strong>AI not connected.</strong> Check Settings to configure your AI provider.
          </div>
        </div>
      `:""}

      ${this.ollamaStatus?.versionChanged&&!this._versionDismissed&&!this.ollamaStatus?.corsBlocked?n`
        <div class="version-banner">
          <span class="version-banner-icon" style="font-size: 14px;">i</span>
          <div class="version-banner-text">
            Ollama updated <strong>${this.ollamaStatus.oldVersion} → ${this.ollamaStatus.newVersion}</strong>.<br>
            If analysis fails, CORS may need reconfiguration.
          </div>
          <div class="version-banner-actions">
            <button class="version-btn fix" @click="${()=>{this._showCorsWizard=!0}}">Fix Now</button>
            <button class="version-btn" @click="${()=>{this._versionDismissed=!0}}">Dismiss</button>
          </div>
        </div>
      `:""}

      <div class="section-header">Profiles</div>
      <div class="profiles">
        ${this._renderProfileCard("first-time","First-Time Visitor","New to the site, exploring for the first time")}
        ${this._renderProfileCard("power-user","Power User","Experienced, focused on speed and efficiency")}
        ${this._renderProfileCard("accessibility","Accessibility User","Relies on screen reader and keyboard")}
        ${this.customProfiles.map(i=>this._renderProfileCard(i.id,`${i.name.en}`,i.description?.en||"Custom profile",!0))}
        ${this._showProfileForm?this._renderProfileForm():n`
          ${this.customProfiles.length<5?n`
            <button class="add-profile-btn" @click="${()=>{this._editingProfile=null,this._showProfileForm=!0}}">+ Add Custom Profile</button>
          `:""}
        `}
      </div>

      <div class="section-header-row">
        <div class="section-header">Rule Pack</div>
        <button
          class="pack-import-link"
          @click="${()=>{this._showRulePackImporter=!this._showRulePackImporter,this._rulePackError=""}}"
        >${this._showRulePackImporter?"Close":"+ Import JSON"}</button>
      </div>

      ${this._showRulePackImporter?n`
        <div class="pack-importer">
          <div class="pack-importer-title">Import Custom Rule Pack (Plugin)</div>
          <div class="pack-importer-sub">Upload a custom sectoral UX rule pack (.json) or paste JSON below.</div>
          <div class="pack-file-row">
            <label class="pack-file-label">
              <input type="file" accept=".json,application/json" style="display:none" @change="${this._handleRulePackFileUpload}" />
              <span>Upload .json File</span>
            </label>
            <button class="pack-import-link" @click="${this._downloadSamplePackTemplate}">Download Template</button>
          </div>
          <textarea
            id="pack-json-input"
            class="pack-textarea"
            placeholder='{"name": "My UX Pack", "category": "Custom", "rules": [{"id": "rule-1", "name": "Clarity", "description": "..."}]}'
          ></textarea>
          ${this._rulePackError?n`<div class="pack-error">${this._rulePackError}</div>`:""}
          <div class="pf-actions">
            <button class="pf-save" @click="${this._handleSaveCustomRulePack}">Import Pack</button>
            <button class="pf-cancel" @click="${()=>{this._showRulePackImporter=!1,this._rulePackError=""}}">Cancel</button>
          </div>
        </div>
      `:""}

      <div class="rule-pack-grid">
        ${(this.rulePacks||y).map(i=>{let o=(this.selectedRulePack||"nielsen-10")===i.id,a=i.ruleCount||i.rules?.length||10;return n`
            <button
              class="rule-pack-card ${o?"active":""}"
              @click="${()=>this._selectRulePack(i.id)}"
              title="${i.description||i.name}"
            >
              <div class="rule-pack-top">
                <span class="rule-pack-name">${i.shortName||i.name}</span>
                <div style="display:flex;align-items:center;gap:3px;">
                  <span class="rule-pack-count">${a}</span>
                  ${i.isCustom?n`
                    <span
                      class="rule-pack-del"
                      title="Delete custom rule pack"
                      @click="${l=>this._handleDeleteCustomRulePack(l,i.id)}"
                    >✕</span>
                  `:""}
                </div>
              </div>
              <span class="rule-pack-cat">${i.category||"UX Rules"}</span>
            </button>
          `})}
      </div>
      ${(()=>{let i=(this.rulePacks||y).find(o=>o.id===(this.selectedRulePack||"nielsen-10"));return i?.description?n`<div class="rule-pack-desc-bar">${i.description}</div>`:""})()}

      <div class="section-header">Mode</div>
      <div class="mode-selector">
        <button class="mode-btn ${this.mode==="quick"?"active":""}" @click="${()=>this._setMode("quick")}">
          <span class="mode-label">Quick</span>
          <span class="mode-desc">${Math.min(3,this._allHeuristics.length)} rules · ~${this._estimateTime(Math.min(3,this._allHeuristics.length))}</span>
        </button>
        <button class="mode-btn ${this.mode==="deep"?"active":""}" @click="${()=>this._setMode("deep")}">
          <span class="mode-label">Deep</span>
          <span class="mode-desc">${this._allHeuristics.length} rules · ~${this._estimateTime(this._allHeuristics.length)}</span>
        </button>
        <button class="mode-btn ${this.mode==="custom"?"active":""}" @click="${()=>this._setMode("custom")}">
          <span class="mode-label">Custom</span>
          <span class="mode-desc">${this._selectedHeuristics.length||0} selected${this._selectedHeuristics.length>0?` \xB7 ~${this._estimateTime(this._selectedHeuristics.length)}`:""}</span>
        </button>
      </div>

      ${this.mode==="custom"?n`
        <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 16px;">
          ${this._allHeuristics.map(i=>{let o=this._selectedHeuristics.includes(i.id);return n`
              <button
                style="
                  padding: 4px 10px; font-size: 11px; border-radius: 12px; cursor: pointer;
                  font-family: inherit; transition: all 0.15s; border: 1px solid;
                  background: ${o?"var(--sx-accent-dim, rgba(59,130,246,0.1))":"var(--sx-bg-card, #1c1c1f)"};
                  border-color: ${o?"var(--sx-accent, #3b82f6)":"var(--sx-border, rgba(255,255,255,0.06))"};
                  color: ${o?"var(--sx-accent, #3b82f6)":"var(--sx-text-tertiary, #8a8a96)"};
                "
                @click="${()=>this._toggleHeuristic(i.id)}"
              >${i.name?.en||i.id}</button>
            `})}
        </div>
      `:""}

      ${this.isAnalyzing?n`
        <button class="analyze-btn analyzing" disabled>Analyzing...</button>
      `:n`
        <button 
          class="analyze-btn"
          ?disabled="${!s}"
          @click="${this._startAnalysis}"
        >Analyze Page</button>
      `}

      ${this.isAnalyzing&&this.progress?n`
        <div class="progress-container">
          <div class="progress-bar-wrapper">
            <div class="progress-bar-fill" style="width: ${this.progress.percent||0}%"></div>
          </div>

          <div class="terminal">
            <div class="terminal-header">
              <span class="terminal-title">synthux — analysis</span>
            </div>
            <div class="terminal-body" id="terminal-log">
              ${this.logEntries.map((i,o)=>n`
                <div class="log-line">
                  <span class="log-time">${i.time}</span>
                  <span class="log-prefix">▶</span>
                  <span class="log-msg ${o===this.logEntries.length-1?"active":""} ${i.done?"success":""}">${i.msg}</span>
                </div>
              `)}
            </div>
          </div>

          <button class="cancel-btn" @click="${this._cancelAnalysis}">Cancel</button>
        </div>
      `:""}

      <div class="section-header" style="margin-top: 20px;">Beta Features</div>
      <button
        class="flow-btn"
        @click="${this._openFlowBuilder}"
      >
        <span style="display:flex;align-items:center;gap:6px;">
          <span>Flow Analysis</span>
        </span>
        <span class="flow-desc">Multi-page canvas builder</span>
      </button>
    `}_openFlowBuilder(){let e=this.pageInfo?.url||"",t=this.pageInfo?.title||"",s=chrome.runtime.getURL("flow/index.html");e&&(e.startsWith("http://")||e.startsWith("https://"))&&(s+=`?url=${encodeURIComponent(e)}&title=${encodeURIComponent(t)}`),chrome.tabs.create({url:s})}async _copyCmd(e,t){try{await navigator.clipboard.writeText(e),this._copiedCmd=t,setTimeout(()=>{this._copiedCmd=null},2e3)}catch{this._copiedCmd=t,setTimeout(()=>{this._copiedCmd=null},2e3)}}async _checkConnection(){this._checkingConnection=!0;try{(await chrome.runtime.sendMessage({type:"CHECK_CONNECTION"}))?.connected&&(this._showCorsWizard=!1,this.dispatchEvent(new CustomEvent("connection-fixed",{bubbles:!0,composed:!0})))}catch{}this._checkingConnection=!1}_renderCorsWizard(){let e=this._detectPlatform(),t=e.cmd,s=this._checkingConnection;return n`
      <div class="cors-wizard">
        <div class="cors-wizard-title">
          Ollama CORS Configuration Required
        </div>
        <div class="cors-wizard-desc">
          Ollama is running but blocking requests from this extension.
          Run the command below, then restart Ollama.
        </div>
        <div class="cors-steps">
          <div class="cors-step-header">Step 1 — Run in Terminal</div>
          <div class="cors-cmd-block">
            <code class="cors-cmd-code">${t}</code>
            <button
              class="cors-copy-btn ${this._copiedCmd?"copied":""}"
              @click="${()=>this._copyCmd(t,"main")}"
            >${this._copiedCmd?"Copied":"Copy"}</button>
          </div>
          ${e.note?n`<div class="cors-note">${e.note}</div>`:""}
          <div class="cors-step-header" style="margin-top: 14px;">Step 2 — Quit and restart Ollama</div>
          <div class="cors-note">Close Ollama completely (menu bar → Quit Ollama), then open it again. The setting won't take effect until Ollama is restarted.</div>
        </div>
        <button
          class="cors-check-btn"
          ?disabled="${s}"
          @click="${this._checkConnection}"
        >${s?"Checking...":"Check Connection"}</button>
        ${e.others.length>0?n`
          <details class="cors-other-platforms">
            <summary>Other platforms</summary>
            ${e.others.map(i=>n`
              <div class="cors-platform-alt">
                <span class="cors-platform-label">${i.name}</span>
                <code class="cors-platform-cmd">${i.cmd}</code>
                <button
                  class="cors-copy-btn ${this._copiedCmd===i.id?"copied":""}"
                  @click="${()=>this._copyCmd(i.cmd,i.id)}"
                >${this._copiedCmd===i.id?"Copied":"Copy"}</button>
              </div>
            `)}
          </details>
        `:""}
      </div>
    `}_detectPlatform(){let e=navigator.userAgent.toLowerCase(),t=e.includes("mac"),s=e.includes("win"),i={mac:{name:"macOS",id:"macos",cmd:'launchctl setenv OLLAMA_ORIGINS "*"',note:null},linux:{name:"Linux",id:"linux",cmd:"sudo systemctl edit ollama",note:'Add this line under [Service]: Environment="OLLAMA_ORIGINS=*"'},win:{name:"Windows",id:"win",cmd:'[Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", "User")',note:"Run in PowerShell as Administrator"}},o,a;return t?(o=i.mac,a=[i.linux,i.win]):s?(o=i.win,a=[i.mac,i.linux]):(o=i.linux,a=[i.mac,i.win]),{...o,others:a}}};customElements.define("synthux-scanner",se);var ie=class extends m{static properties={report:{type:Object},history:{type:Array},showHistory:{type:Boolean},activeProfile:{type:String},expandedHeuristic:{type:String},copied:{type:Boolean},activeFilter:{type:String},copiedFix:{type:String},heatmapActive:{type:Boolean}};static styles=f`
    :host {
      display: block;
      padding: 16px;
    }

    /* ─── Empty State ────────────────────────── */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
    }

    .empty-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--sx-text-secondary, #b4b4bc);
      margin-bottom: 4px;
    }

    .empty-desc {
      font-size: 12px;
      color: var(--sx-text-tertiary, #8a8a96);
    }

    /* ─── Overall Score ──────────────────────── */
    .overall-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px 0;
      margin-bottom: 16px;
    }

    .report-meta {
      font-size: 11px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-top: 10px;
      text-align: center;
      line-height: 1.6;
    }

    /* ─── Profile Tabs ───────────────────────── */
    .profile-tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 16px;
      overflow-x: auto;
    }

    .profile-tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 12px;
      border-radius: 6px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      background: var(--sx-bg-card, #1c1c1f);
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 150ms ease;
      white-space: nowrap;
      font-family: inherit;
    }

    .profile-tab:hover {
      border-color: var(--sx-border-hover, rgba(255,255,255,0.10));
    }

    .profile-tab.active {
      border-color: var(--sx-accent, #3b82f6);
      color: var(--sx-text-primary, #ededf0);
      background: var(--sx-accent-dim, rgba(59,130,246,0.08));
    }

    .profile-tab-score {
      font-weight: 700;
      font-size: 11px;
    }

    /* ─── Section Header ─────────────────────── */
    .section-header {
      font-size: 11px;
      font-weight: 600;
      color: var(--sx-text-tertiary, #8a8a96);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 10px;
      margin-top: 8px;
    }

    /* ─── Heuristic Cards ────────────────────── */
    .heuristic-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 20px;
    }

    .heuristic-card {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 8px;
      overflow: hidden;
      transition: border-color 150ms ease;
    }

    .heuristic-card:hover {
      border-color: var(--sx-border-hover, rgba(255,255,255,0.10));
    }

    .heuristic-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      cursor: pointer;
      user-select: none;
    }

    .heuristic-score-badge {
      min-width: 36px;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      text-align: center;
    }

    .heuristic-score-badge.high {
      background: var(--sx-success-dim, rgba(34,197,94,0.10));
      color: var(--sx-success, #22c55e);
    }

    .heuristic-score-badge.mid {
      background: var(--sx-warning-dim, rgba(234,179,8,0.10));
      color: var(--sx-warning, #eab308);
    }

    .heuristic-score-badge.low {
      background: var(--sx-error-dim, rgba(239,68,68,0.10));
      color: var(--sx-error, #ef4444);
    }

    .heuristic-name {
      flex: 1;
      font-size: 12px;
      font-weight: 500;
      color: var(--sx-text-primary, #ededf0);
    }

    .heuristic-chevron {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      transition: transform 150ms ease;
    }

    .heuristic-chevron.open {
      transform: rotate(90deg);
    }

    .heuristic-detail {
      padding: 0 12px 12px;
      border-top: 1px solid var(--sx-border, rgba(255,255,255,0.04));
    }

    .heuristic-summary {
      font-size: 12px;
      color: var(--sx-text-secondary, #b4b4bc);
      line-height: 1.5;
      padding-top: 10px;
      margin-bottom: 10px;
    }

    /* ─── Issues ──────────────────────────────── */
    .issue-item {
      display: flex;
      gap: 8px;
      padding: 8px 4px;
      border-bottom: 1px solid var(--sx-border, rgba(255,255,255,0.04));
      border-radius: 4px;
      cursor: pointer;
      transition: background 150ms ease;
    }

    .issue-item:hover {
      background: rgba(59, 130, 246, 0.06);
    }

    .issue-item:last-child { border-bottom: none; }

    /* ─── Heatmap Toggle ────────────────────────── */
    .heatmap-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin: 0 0 14px;
    }

    .heatmap-label {
      font-size: 11px;
      color: var(--sx-text-tertiary, #8a8a96);
      font-weight: 500;
    }

    .heatmap-switch {
      position: relative;
      width: 36px;
      height: 20px;
      background: var(--sx-border, rgba(255,255,255,0.08));
      border-radius: 10px;
      cursor: pointer;
      transition: background 200ms ease;
      border: none;
      padding: 0;
    }

    .heatmap-switch::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--sx-text-tertiary, #8a8a96);
      transition: transform 200ms ease, background 200ms ease;
    }

    .heatmap-switch.active {
      background: rgba(239, 68, 68, 0.25);
    }

    .heatmap-switch.active::after {
      transform: translateX(16px);
      background: #ef4444;
    }

    .severity-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 6px;
    }

    .severity-dot.critical { background: var(--sx-error, #ef4444); }
    .severity-dot.moderate { background: var(--sx-warning, #eab308); }
    .severity-dot.minor { background: var(--sx-success, #22c55e); }

    .issue-content { flex: 1; }

    .issue-desc {
      font-size: 12px;
      color: var(--sx-text-primary, #ededf0);
      line-height: 1.4;
    }

    .issue-recommendation {
      font-size: 11px;
      color: var(--sx-accent, #3b82f6);
      margin-top: 3px;
      line-height: 1.4;
    }

    .issue-element {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-top: 2px;
      font-family: 'SF Mono', Monaco, monospace;
    }

    /* ─── Code Fix Block ──────────────────────── */
    .code-fix-block {
      margin-top: 6px;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
    }

    .code-fix-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 8px;
      background: rgba(59,130,246,0.08);
      font-size: 10px;
      color: var(--sx-accent, #3b82f6);
    }

    .code-fix-copy {
      padding: 2px 6px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      border-radius: 3px;
      background: transparent;
      color: var(--sx-text-tertiary, #8a8a96);
      font-size: 9px;
      cursor: pointer;
      font-family: inherit;
      transition: all 150ms ease;
    }

    .code-fix-copy:hover {
      color: var(--sx-accent, #3b82f6);
      border-color: var(--sx-accent, #3b82f6);
    }

    .code-fix-copy.copied {
      color: var(--sx-success, #22c55e);
      border-color: rgba(34,197,94,0.3);
    }

    .code-fix-pre {
      padding: 8px;
      background: rgba(0,0,0,0.3);
      font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
      font-size: 11px;
      line-height: 1.5;
      color: var(--sx-text-secondary, #b4b4bc);
      white-space: pre-wrap;
      word-break: break-all;
      margin: 0;
    }

    .code-fix-label {
      font-size: 9px;
      color: var(--sx-text-tertiary, #8a8a96);
      padding: 2px 8px 0;
      background: rgba(0,0,0,0.3);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .code-fix-label:first-of-type { padding-top: 4px; }

    /* ─── Priority Badge ──────────────────────── */
    .priority-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 9px;
      font-weight: 600;
      margin-left: 4px;
      letter-spacing: 0.3px;
    }

    .priority-badge.quick-win {
      background: rgba(234,179,8,0.12);
      color: #eab308;
    }

    .priority-badge.high {
      background: var(--sx-error-dim, rgba(239,68,68,0.10));
      color: var(--sx-error, #ef4444);
    }

    .effort-tag {
      display: inline-flex;
      align-items: center;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 9px;
      margin-left: 3px;
    }

    .effort-tag.easy {
      background: var(--sx-success-dim, rgba(34,197,94,0.10));
      color: var(--sx-success, #22c55e);
    }

    .effort-tag.hard {
      background: var(--sx-error-dim, rgba(239,68,68,0.10));
      color: var(--sx-text-tertiary, #8a8a96);
    }

    /* ─── Filter Bar ─────────────────────────── */
    .filter-bar {
      display: flex;
      gap: 4px;
      margin-bottom: 12px;
      overflow-x: auto;
    }

    .filter-btn {
      padding: 4px 10px;
      border-radius: 12px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      background: transparent;
      color: var(--sx-text-tertiary, #8a8a96);
      font-size: 10px;
      font-weight: 500;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
      white-space: nowrap;
    }

    .filter-btn:hover {
      border-color: var(--sx-border-hover, rgba(255,255,255,0.10));
      color: var(--sx-text-secondary, #b4b4bc);
    }

    .filter-btn.active {
      background: var(--sx-accent-dim, rgba(59,130,246,0.08));
      border-color: var(--sx-accent, #3b82f6);
      color: var(--sx-accent, #3b82f6);
    }

    .filter-count {
      font-weight: 700;
    }

    /* ─── Positives ──────────────────────────── */
    .positive-item {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      padding: 3px 0;
      font-size: 12px;
      color: var(--sx-success, #22c55e);
    }

    .positive-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--sx-success, #22c55e);
      flex-shrink: 0;
      margin-top: 6px;
    }

    /* ─── Accessibility Audit ────────────────── */
    .a11y-section { margin-bottom: 20px; }

    .a11y-card {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 8px;
      overflow: hidden;
    }

    .a11y-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
    }

    .a11y-title {
      font-size: 12px;
      font-weight: 500;
      color: var(--sx-text-secondary, #b4b4bc);
    }

    .a11y-score-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .a11y-check {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 12px;
      border-top: 1px solid var(--sx-border, rgba(255,255,255,0.04));
      font-size: 12px;
    }

    .check-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .check-dot.pass { background: var(--sx-success, #22c55e); }
    .check-dot.warning { background: var(--sx-warning, #eab308); }
    .check-dot.fail { background: var(--sx-error, #ef4444); }

    .a11y-name {
      flex: 1;
      color: var(--sx-text-secondary, #b4b4bc);
    }

    .a11y-message {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      max-width: 45%;
      text-align: right;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ─── Export Button ───────────────────────── */
    .export-bar {
      position: sticky;
      bottom: 0;
      padding: 12px 0;
      background: linear-gradient(transparent, var(--sx-bg-primary, #111113) 25%);
    }

    .export-btn {
      width: 100%;
      padding: 9px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 6px;
      background: var(--sx-bg-card, #1c1c1f);
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
    }

    .export-btn:hover {
      border-color: var(--sx-border-hover, rgba(255,255,255,0.10));
      color: var(--sx-text-primary, #ededf0);
    }

    .export-btn.copied {
      color: var(--sx-success, #22c55e);
      border-color: rgba(34, 197, 94, 0.2);
    }

    .export-actions {
      display: flex;
      gap: 6px;
    }

    .export-actions .export-btn {
      flex: 1;
    }

    .export-btn.pdf {
      border-color: rgba(59,130,246,0.2);
      color: var(--sx-accent, #3b82f6);
    }

    .export-btn.pdf:hover {
      background: rgba(59,130,246,0.06);
    }

    /* ─── History List ────────────────────────── */
    .history-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .history-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 8px;
      cursor: pointer;
      transition: all 150ms ease;
    }

    .history-item:hover {
      border-color: var(--sx-border-hover, rgba(255,255,255,0.10));
    }

    .history-score {
      min-width: 36px;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
      text-align: center;
    }

    .history-score.high {
      background: var(--sx-success-dim);
      color: var(--sx-success);
    }
    .history-score.mid {
      background: var(--sx-warning-dim);
      color: var(--sx-warning);
    }
    .history-score.low {
      background: var(--sx-error-dim);
      color: var(--sx-error);
    }

    .history-details {
      flex: 1;
      min-width: 0;
    }

    .history-title {
      font-size: 12px;
      font-weight: 500;
      color: var(--sx-text-primary, #ededf0);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .history-meta {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-top: 1px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .history-delete {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      border: none;
      background: transparent;
      color: var(--sx-text-tertiary, #8a8a96);
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 150ms ease;
      flex-shrink: 0;
    }

    .history-delete:hover {
      color: var(--sx-error, #ef4444);
      background: var(--sx-error-dim, rgba(239,68,68,0.10));
    }

    .history-empty {
      text-align: center;
      padding: 32px 16px;
      color: var(--sx-text-tertiary, #8a8a96);
      font-size: 12px;
    }
  `;constructor(){super(),this.report=null,this.history=[],this.showHistory=!1,this.activeProfile="",this.expandedHeuristic="",this.copied=!1,this.activeFilter="all",this.copiedFix="",this.heatmapActive=!1}updated(e){if(e.has("report")&&this.report){let t=Object.keys(this.report.profileResults||{});t.length>0&&!this.activeProfile&&(this.activeProfile=t[0])}}_toggleHeuristic(e){this.expandedHeuristic=this.expandedHeuristic===e?"":e}_highlightIssue(e){e.element&&chrome.runtime.sendMessage({type:"HIGHLIGHT_ELEMENT",payload:{selector:e.element,description:e.description,severity:e.severity}}).catch(()=>{})}_clearHighlight(){chrome.runtime.sendMessage({type:"CLEAR_HIGHLIGHT",payload:{}}).catch(()=>{})}_toggleHeatmap(){if(this.heatmapActive=!this.heatmapActive,this.heatmapActive){let e=[];Object.values(this.report?.profileResults||{}).forEach(t=>{(t.evaluations||[]).forEach(s=>{(s.issues||[]).forEach(i=>{i.element&&e.push({element:i.element,severity:i.severity,description:i.description})})})}),chrome.runtime.sendMessage({type:"SHOW_HEATMAP",payload:{issues:e}}).catch(()=>{})}else chrome.runtime.sendMessage({type:"CLEAR_HEATMAP",payload:{}}).catch(()=>{})}disconnectedCallback(){super.disconnectedCallback(),chrome.runtime.sendMessage({type:"CLEAR_OVERLAYS",payload:{}}).catch(()=>{})}_getScoreClass(e){return e>=71?"high":e>=41?"mid":"low"}_downloadMarkdown(){if(!this.report?.markdown)return;let t=`design-change-${this._shortenUrl(this.report.url).replace(/[\/:.]/g,"-").replace(/-+/g,"-")}.md`,s=new Blob([this.report.markdown],{type:"text/markdown;charset=utf-8"}),i=URL.createObjectURL(s),o=document.createElement("a");o.href=i,o.download=t,o.click(),URL.revokeObjectURL(i),this.copied=!0,setTimeout(()=>{this.copied=!1},2e3)}async _downloadPDF(){if(this.report)try{let{generatePDF:e}=await import("./chunks/pdf-export-DREACNUD.js"),t=e(this.report),i=`synthux-report-${this._shortenUrl(this.report.url).replace(/[\/:.]/g,"-").replace(/-+/g,"-")}.pdf`,o=URL.createObjectURL(t),a=document.createElement("a");a.href=o,a.download=i,a.click(),URL.revokeObjectURL(o)}catch(e){console.error("[synthux] PDF generation failed:",e)}}render(){if(this.showHistory)return this._renderHistory();if(!this.report)return n`
        <div class="empty-state">
          <div class="empty-title">No report yet</div>
          <div class="empty-desc">Go to Scan tab to analyze a page.</div>
        </div>
      `;let e=this.report,t=e.profileResults?.[this.activeProfile];return n`
      <div class="overall-section">
        <synthux-score value="${e.overallScore||0}" label="Overall UX Score" size="lg"></synthux-score>
        <div class="report-meta">
          ${this._shortenUrl(e.url)}${e.model?n`<br>${e.model} · `:""}${e.mode==="deep"?"Deep":e.mode==="custom"?"Custom":"Quick"}${e.rulePackShortName||e.rulePackName?n` · <span style="color: var(--sx-accent, #3b82f6); font-weight: 500;">${e.rulePackShortName||e.rulePackName}</span>`:""}
          ${e.timestamp?n` · ${new Date(e.timestamp).toLocaleString()}`:""}
          ${e.costSummary?n`<br><span style="color: ${e.costSummary.isLocal?"var(--sx-success, #22c55e)":"var(--sx-warning, #eab308)"}">${e.costSummary.formatted}</span>`:""}
        </div>
      </div>

      <div class="heatmap-toggle">
        <span class="heatmap-label">Heatmap</span>
        <button class="heatmap-switch ${this.heatmapActive?"active":""}" 
          @click="${this._toggleHeatmap}" 
          title="${this.heatmapActive?"Heatmap is ON \u2014 click to hide":"Show issue heatmap on page"}">
        </button>
      </div>

      <div class="profile-tabs">
        ${Object.entries(e.profileResults||{}).map(([s,i])=>n`
          <button class="profile-tab ${this.activeProfile===s?"active":""}" @click="${()=>this.activeProfile=s}" title="${i.profile.custom?`${i.profile.ageRange||""} \xB7 ${i.profile.techLevel||""} tech${i.profile.goal?` \xB7 ${i.profile.goal}`:""}`:i.profile.description?.en||""}">
            <span>${i.profile.name?.en||s}${i.profile.custom?n`<span style="font-size: 8px; background: rgba(0,126,255,0.1); color: #007eff; padding: 0 4px; border-radius: 4px; margin-left: 4px; vertical-align: middle;">C</span>`:""}</span>
            <span class="profile-tab-score">${i.score}</span>
          </button>
        `)}
      </div>

      ${t?n`
        ${this._renderFilterBar(t)}
        <div class="section-header">Evaluations</div>
        <div class="heuristic-list">
          ${(t.evaluations||[]).map(s=>{let i=this._filterIssues(s.issues||[]);if(this.activeFilter!=="all"&&i.length===0)return"";let o=this.activeFilter!=="all"||this.expandedHeuristic===s.heuristicId;return n`
            <div class="heuristic-card">
              <div class="heuristic-header" @click="${()=>this._toggleHeuristic(s.heuristicId)}">
                <span class="heuristic-score-badge ${this._getScoreClass(s.score)}">${s.score}</span>
                <span class="heuristic-name">${s.heuristicName?.en||s.heuristicId}</span>
                <span class="heuristic-chevron ${o?"open":""}">▶</span>
              </div>
              ${o?n`
                <div class="heuristic-detail">
                  <div class="heuristic-summary">${s.summary}</div>
                  ${i.map(a=>n`
                    <div class="issue-item"
                      @mouseenter="${()=>this._highlightIssue(a)}"
                      @mouseleave="${()=>this._clearHighlight()}">
                      <span class="severity-dot ${a.severity}"></span>
                      <div class="issue-content">
                        <div class="issue-desc">
                          ${a.description}
                          ${a.isQuickWin?n`<span class="priority-badge quick-win">⚡ Quick Win</span>`:a.priority==="high"?n`<span class="priority-badge high">HIGH</span>`:""}
                          ${a.fixEffort==="easy"?n`<span class="effort-tag easy">Easy fix</span>`:a.fixEffort==="hard"?n`<span class="effort-tag hard">Hard</span>`:""}
                        </div>
                        ${a.element?n`<div class="issue-element">${a.element}</div>`:""}
                        ${a.recommendation?n`<div class="issue-recommendation">${a.recommendation}</div>`:""}
                        ${a.codeFix?n`
                          <div class="code-fix-block">
                            <div class="code-fix-header">
                              <span>${a.codeFix.language.toUpperCase()} fix</span>
                              <button class="code-fix-copy ${this.copiedFix===a.element?"copied":""}" 
                                @click="${l=>{l.stopPropagation(),this._copyFix(a)}}">
                                ${this.copiedFix===a.element?"Copied \u2713":"Copy"}
                              </button>
                            </div>
                            ${a.codeFix.before?n`
                              <div class="code-fix-label">Before</div>
                              <pre class="code-fix-pre">${a.codeFix.before}</pre>
                            `:""}
                            <div class="code-fix-label">After</div>
                            <pre class="code-fix-pre">${a.codeFix.after}</pre>
                          </div>
                        `:""}
                      </div>
                    </div>
                  `)}
                  ${(s.positives||[]).map(a=>n`
                    <div class="positive-item">
                      <span class="positive-dot"></span>
                      <span>${a}</span>
                    </div>
                  `)}
                </div>
              `:""}
            </div>
          `})}
        </div>
      `:""}

      ${e.accessibilityResults?n`
        <div class="section-header">Accessibility Audit</div>
        <div class="a11y-section">
          <div class="a11y-card">
            <div class="a11y-header">
              <span class="a11y-title">${e.accessibilityResults.passCount} pass · ${e.accessibilityResults.warnCount} warn · ${e.accessibilityResults.failCount} fail</span>
              <span class="a11y-score-badge ${this._getScoreClass(e.accessibilityResults.score)}">${e.accessibilityResults.score}</span>
            </div>
            ${(e.accessibilityResults.checks||[]).map(s=>n`
              <div class="a11y-check">
                <span class="check-dot ${s.status}"></span>
                <span class="a11y-name">${s.name}</span>
                <span class="a11y-message" title="${s.message}">${s.message}</span>
              </div>
            `)}
          </div>
        </div>

        ${e.accessibilityResults.wcagViolations?.length>0?n`
          <div class="section-header">WCAG Violations <span style="font-weight: 400; font-size: 10px; text-transform: none; letter-spacing: 0; color: var(--sx-text-tertiary, #8a8a96);">(axe-core)</span></div>
          <div class="a11y-section">
            ${e.accessibilityResults.wcagViolations.map(s=>n`
              <div class="a11y-card" style="margin-bottom: 6px;">
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                  <span style="
                    font-size: 9px; font-weight: 600; padding: 1px 6px; border-radius: 4px;
                    background: ${s.impact==="critical"?"rgba(239,68,68,0.15)":s.impact==="serious"?"rgba(234,179,8,0.15)":s.impact==="moderate"?"rgba(59,130,246,0.15)":"rgba(138,138,150,0.15)"};
                    color: ${s.impact==="critical"?"#ef4444":s.impact==="serious"?"#eab308":s.impact==="moderate"?"#3b82f6":"#8a8a96"};
                  ">${s.impact}</span>
                  ${s.tags?.length?n`<span style="font-size: 9px; color: var(--sx-text-tertiary, #8a8a96);">${s.tags.join(", ")}</span>`:""}
                </div>
                <div style="font-size: 12px; font-weight: 500; color: var(--sx-text-primary, #ededf0); margin-bottom: 3px;">${s.help}</div>
                <div style="font-size: 11px; color: var(--sx-text-tertiary, #8a8a96); margin-bottom: 4px;">${s.description}</div>
                ${s.nodes?.length?n`
                  <div style="font-size: 10px; color: var(--sx-text-tertiary, #8a8a96); margin-bottom: 3px;">Affected elements (${s.nodes.length}):</div>
                  ${s.nodes.slice(0,3).map(i=>n`
                    <div style="font-size: 10px; font-family: monospace; background: var(--sx-bg-main, #121214); padding: 4px 6px; border-radius: 4px; margin-bottom: 2px; color: var(--sx-text-secondary, #b4b4bc); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${i.target||i.html}</div>
                  `)}
                `:""}
                ${s.helpUrl?n`<a href="${s.helpUrl}" target="_blank" rel="noopener" style="font-size: 10px; color: var(--sx-accent, #3b82f6); text-decoration: none;">Learn more →</a>`:""}
              </div>
            `)}
          </div>
        `:""}

        ${e.accessibilityResults.wcagPasses?n`
          <div style="font-size: 11px; color: var(--sx-text-tertiary, #8a8a96); padding: 4px 0; margin-bottom: 12px;">
            ✓ ${e.accessibilityResults.wcagPasses} WCAG rules passed
          </div>
        `:""}
      `:""}

      <div class="export-bar">
        <div class="export-actions">
          <button class="export-btn ${this.copied?"copied":""}" @click="${this._downloadMarkdown}">
            ${this.copied?"Downloaded \u2713":"\u2193 Markdown"}
          </button>
          <button class="export-btn pdf" @click="${this._downloadPDF}">
            ↓ PDF
          </button>
        </div>
      </div>
    `}_renderHistory(){return!this.history||this.history.length===0?n`
        <div class="history-empty">
          No past reports yet. Analyze a page to start building history.
        </div>
      `:n`
      <div class="section-header" style="padding: 0 0 2px;">Past reports (${this.history.length})</div>
      <div class="history-list">
        ${this.history.map(e=>n`
          <div class="history-item" @click="${()=>this._loadFromHistory(e.id)}">
            <span class="history-score ${this._getScoreClass(e.score)}">${e.score}</span>
            <div class="history-details">
              <div class="history-title">${e.title||e.url||"Untitled"}</div>
              <div class="history-meta">${this._formatDate(e.timestamp)} · ${e.mode} · ${e.model}</div>
            </div>
            <button class="history-delete" @click="${t=>{t.stopPropagation(),this._deleteFromHistory(e.id)}}" title="Delete">×</button>
          </div>
        `)}
      </div>
    `}_loadFromHistory(e){this.dispatchEvent(new CustomEvent("load-report",{detail:{id:e},bubbles:!0,composed:!0}))}_deleteFromHistory(e){this.dispatchEvent(new CustomEvent("delete-report",{detail:{id:e},bubbles:!0,composed:!0}))}_shortenUrl(e){if(!e)return"";try{let t=new URL(e);return t.hostname+(t.pathname!=="/"?t.pathname.substring(0,30)+(t.pathname.length>30?"...":""):"")}catch{return e.substring(0,40)+(e.length>40?"...":"")}}_formatDate(e){if(!e)return"";try{let t=new Date(e),i=new Date-t;return i<6e4?"Just now":i<36e5?`${Math.floor(i/6e4)}m ago`:i<864e5?`${Math.floor(i/36e5)}h ago`:t.toLocaleDateString()}catch{return""}}_copyFix(e){if(!e.codeFix)return;let t=e.codeFix.after;navigator.clipboard.writeText(t).then(()=>{this.copiedFix=e.element,setTimeout(()=>{this.copiedFix=""},2e3)})}_filterIssues(e){return this.activeFilter==="all"?e:e.filter(t=>{switch(this.activeFilter){case"quick-wins":return t.isQuickWin||t.priority==="high"&&t.fixEffort==="easy";case"critical":return t.severity==="critical";case"easy-fixes":return t.fixEffort==="easy";default:return!0}})}_getFilterCounts(e){let t=(e.evaluations||[]).flatMap(s=>s.issues||[]);return{all:t.length,quickWins:t.filter(s=>s.isQuickWin||s.priority==="high"&&s.fixEffort==="easy").length,critical:t.filter(s=>s.severity==="critical").length,easyFixes:t.filter(s=>s.fixEffort==="easy").length}}_renderFilterBar(e){let t=this._getFilterCounts(e);if(t.all===0)return"";let s=[{id:"all",label:"All",count:t.all},{id:"quick-wins",label:"\u26A1 Quick Wins",count:t.quickWins},{id:"critical",label:"\u{1F534} Critical",count:t.critical},{id:"easy-fixes",label:"Easy Fixes",count:t.easyFixes}];return n`
      <div class="filter-bar">
        ${s.map(i=>n`
          <button class="filter-btn ${this.activeFilter===i.id?"active":""}"
            @click="${()=>this.activeFilter=i.id}">
            ${i.label} <span class="filter-count">${i.count}</span>
          </button>
        `)}
      </div>
    `}};customElements.define("synthux-report",ie);function ze(r){let e=String(r||"").trim();return e.startsWith("```json")?e=e.slice(7):e.startsWith("```")&&(e=e.slice(3)),e.endsWith("```")&&(e=e.slice(0,-3)),e.trim()}function Oe(){if(typeof globalThis<"u"){if(globalThis.LanguageModel)return{api:globalThis.LanguageModel,type:"standard"};if(globalThis.ai?.languageModel)return{api:globalThis.ai.languageModel,type:"legacy"}}return null}var re={ollama:{id:"ollama",name:"Ollama (Local)",icon:"\u{1F5A5}\uFE0F",authType:"none",defaultEndpoint:"http://localhost:11434",models:[],modelsFetchable:!0,buildRequest(r,e,t={}){let s={model:e,prompt:r,system:t.systemPrompt||"",stream:!1,format:t.format||"json",options:{temperature:t.temperature??.3,num_predict:t.maxTokens||2048}};return t.images?.length&&(s.images=t.images.map(i=>i.replace(/^data:image\/\w+;base64,/,""))),{url:`${t.endpoint||this.defaultEndpoint}/api/generate`,method:"POST",headers:{"Content-Type":"application/json"},body:s}},parseResponse(r){try{return{success:!0,result:JSON.parse(r.response),meta:{model:r.model,totalDuration:r.total_duration,inputTokens:r.prompt_eval_count||0,outputTokens:r.eval_count||0}}}catch{return{success:!0,result:{raw:r.response},meta:{model:r.model,inputTokens:r.prompt_eval_count||0,outputTokens:r.eval_count||0}}}},async fetchModels(r){try{let e=await fetch(`${r||this.defaultEndpoint}/api/tags`);return e.ok?((await e.json()).models||[]).map(s=>({id:s.name,name:s.name,size:s.size})):[]}catch{return[]}},async ping(r){let e=r||this.defaultEndpoint;try{let t=await fetch(`${e}/api/tags`,{signal:AbortSignal.timeout(5e3)});if(t.ok){try{if((await fetch(`${e}/api/generate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:""}),signal:AbortSignal.timeout(3e3)})).status===403)return{status:"cors-blocked"}}catch{return{status:"cors-blocked"}}let s=null;try{let i=await fetch(`${e}/api/version`,{signal:AbortSignal.timeout(3e3)});i.ok&&(s=(await i.json()).version||null)}catch{}return{status:"connected",version:s}}return{status:"error",code:t.status}}catch{try{return await fetch(e,{mode:"no-cors",signal:AbortSignal.timeout(3e3)}),{status:"cors-blocked"}}catch{return{status:"offline"}}}}},openai:{id:"openai",name:"OpenAI",icon:"\u{1F7E2}",authType:"bearer",defaultEndpoint:"https://api.openai.com",models:[{id:"gpt-5.4",name:"GPT-5.4"},{id:"gpt-5.4-mini",name:"GPT-5.4 Mini"},{id:"gpt-5.4-nano",name:"GPT-5.4 Nano"},{id:"gpt-5.1",name:"GPT-5.1"}],modelsFetchable:!0,buildRequest(r,e,t={}){let s=[];return t.images?.length&&t.images.forEach(i=>{s.push({type:"image_url",image_url:{url:i,detail:"low"}})}),s.push({type:"text",text:r}),{url:`${t.endpoint||this.defaultEndpoint}/v1/chat/completions`,method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.apiKey}`},body:{model:e,messages:[...t.systemPrompt?[{role:"system",content:t.systemPrompt}]:[],{role:"user",content:t.images?.length?s:r}],temperature:t.temperature??.3,max_tokens:t.maxTokens||2048,response_format:t.format==="json"?{type:"json_object"}:void 0}}},parseResponse(r){let e=r.choices?.[0]?.message?.content||"";try{return{success:!0,result:JSON.parse(e),meta:{model:r.model,inputTokens:r.usage?.prompt_tokens||0,outputTokens:r.usage?.completion_tokens||0}}}catch{return{success:!0,result:{raw:e},meta:{model:r.model,inputTokens:r.usage?.prompt_tokens||0,outputTokens:r.usage?.completion_tokens||0}}}},async fetchModels(r,e){try{let t=await fetch(`${r||this.defaultEndpoint}/v1/models`,{headers:{Authorization:`Bearer ${e}`}});return t.ok?((await t.json()).data||[]).filter(i=>i.id.startsWith("gpt-5")||i.id.startsWith("gpt-4")||i.id.startsWith("o")).map(i=>({id:i.id,name:i.id})).sort((i,o)=>i.name.localeCompare(o.name)):this.models}catch{return this.models}},async ping(r,e){try{return(await fetch(`${r||this.defaultEndpoint}/v1/models`,{headers:{Authorization:`Bearer ${e}`},signal:AbortSignal.timeout(8e3)})).ok}catch{return!1}}},gemini:{id:"gemini",name:"Google Gemini",icon:"\u{1F535}",authType:"query_param",defaultEndpoint:"https://generativelanguage.googleapis.com",models:[{id:"gemini-2.5-flash",name:"Gemini 2.5 Flash"},{id:"gemini-2.5-pro",name:"Gemini 2.5 Pro"},{id:"gemini-2.5-flash-lite",name:"Gemini 2.5 Flash-Lite"},{id:"gemini-3-flash-preview",name:"Gemini 3 Flash (Preview)"},{id:"gemini-3.1-pro-preview",name:"Gemini 3.1 Pro (Preview)"},{id:"gemini-3.1-flash-lite-preview",name:"Gemini 3.1 Flash-Lite (Preview)"}],modelsFetchable:!0,buildRequest(r,e,t={}){let s=t.endpoint||this.defaultEndpoint,i=t.apiKey||"",o=[];return t.images?.length&&t.images.forEach(a=>{o.push({inlineData:{mimeType:"image/jpeg",data:a.replace(/^data:image\/\w+;base64,/,"")}})}),o.push({text:r}),{url:`${s}/v1beta/models/${e}:generateContent?key=${i}`,method:"POST",headers:{"Content-Type":"application/json"},body:{contents:[...t.systemPrompt?[{role:"model",parts:[{text:`System: ${t.systemPrompt}`}]}]:[],{role:"user",parts:o}],generationConfig:{temperature:t.temperature??.3,maxOutputTokens:t.maxTokens||4096,responseMimeType:t.format==="json"?"application/json":"text/plain",thinkingConfig:{thinkingBudget:0}}}}},parseResponse(r){let e=r.candidates?.[0]?.content?.parts?.[0]?.text||"",t=r.usageMetadata||{},s=(t.candidatesTokenCount||0)+(t.thoughtsTokenCount||0);try{return{success:!0,result:JSON.parse(e),meta:{model:r.modelVersion||"",inputTokens:t.promptTokenCount||0,outputTokens:s,thinkingTokens:t.thoughtsTokenCount||0}}}catch{return{success:!0,result:{raw:e},meta:{model:r.modelVersion||"",inputTokens:t.promptTokenCount||0,outputTokens:s,thinkingTokens:t.thoughtsTokenCount||0}}}},async fetchModels(r,e){try{let t=await fetch(`${r||this.defaultEndpoint}/v1beta/models?key=${e}`);return t.ok?((await t.json()).models||[]).filter(i=>i.name.includes("gemini")&&i.supportedGenerationMethods?.includes("generateContent")).map(i=>({id:i.name.replace("models/",""),name:i.displayName||i.name.replace("models/","")})):this.models}catch{return this.models}},async ping(r,e){try{return(await fetch(`${r||this.defaultEndpoint}/v1beta/models?key=${e}`,{signal:AbortSignal.timeout(8e3)})).ok}catch{return!1}}},claude:{id:"claude",name:"Anthropic Claude",icon:"\u{1F7E0}",authType:"x-api-key",defaultEndpoint:"https://api.anthropic.com",models:[{id:"claude-opus-4-7",name:"Claude Opus 4.7"},{id:"claude-sonnet-4-6",name:"Claude Sonnet 4.6"},{id:"claude-haiku-4-5",name:"Claude Haiku 4.5"},{id:"claude-opus-4-6",name:"Claude Opus 4.6"}],modelsFetchable:!0,buildRequest(r,e,t={}){let s=[];return t.images?.length&&t.images.forEach(i=>{s.push({type:"image",source:{type:"base64",media_type:"image/jpeg",data:i.replace(/^data:image\/\w+;base64,/,"")}})}),s.push({type:"text",text:r}),{url:`${t.endpoint||this.defaultEndpoint}/v1/messages`,method:"POST",headers:{"Content-Type":"application/json","x-api-key":t.apiKey||"","anthropic-version":"2024-01-01","anthropic-dangerous-direct-browser-access":"true"},body:{model:e,max_tokens:t.maxTokens||2048,...t.systemPrompt?{system:t.systemPrompt}:{},messages:[{role:"user",content:t.images?.length?s:r}]}}},parseResponse(r){let e=r.content?.[0]?.text||"";try{return{success:!0,result:JSON.parse(e),meta:{model:r.model||"",inputTokens:r.usage?.input_tokens||0,outputTokens:r.usage?.output_tokens||0}}}catch{return{success:!0,result:{raw:e},meta:{model:r.model||"",inputTokens:r.usage?.input_tokens||0,outputTokens:r.usage?.output_tokens||0}}}},async fetchModels(r,e){try{let t=await fetch(`${r||this.defaultEndpoint}/v1/models`,{headers:{"x-api-key":e||"","anthropic-version":"2024-01-01"},signal:AbortSignal.timeout(8e3)});return t.ok?((await t.json()).data||[]).filter(i=>i.id.startsWith("claude")).map(i=>({id:i.id,name:i.display_name||i.id})).sort((i,o)=>i.name.localeCompare(o.name)):this.models}catch{return this.models}},async ping(r,e){try{return(await fetch(`${r||this.defaultEndpoint}/v1/messages`,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":e||"","anthropic-version":"2024-01-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-haiku-4-5",max_tokens:1,messages:[{role:"user",content:"Hi"}]}),signal:AbortSignal.timeout(1e4)})).ok}catch{return!1}}},apple:{id:"apple",name:"Apple Intelligence (macOS)",icon:"\uF8FF",authType:"none",defaultEndpoint:"http://127.0.0.1:17483",models:[{id:"apple-on-device",name:"Apple Foundation Model (On-Device ANE)"},{id:"apple-pcc",name:"Apple Private Cloud Compute (macOS 27)"},{id:"apple-content-tagging",name:"Apple Foundation Model (Fast Tagging)"}],modelsFetchable:!0,buildRequest(r,e,t={}){let s=(t.endpoint||this.defaultEndpoint).replace(/\/$/,""),i=e||"apple-on-device",o=i==="apple-pcc"?28e3:12e3,a=r.length>o?`${r.slice(0,o)}

[DOM truncated for on-device context window. Respond ONLY with valid JSON.]`:r;return{url:`${s}/apple-fm/generate`,method:"POST",headers:{"Content-Type":"application/json"},body:{model:i,prompt:a,system:t.systemPrompt||"You are a UX evaluation expert. Respond only with valid JSON.",temperature:t.temperature??.3,maxTokens:t.maxTokens||2048,format:t.format||"json"}}},parseResponse(r){if(r&&r.success===!1)throw new Error(r.error||"Apple Foundation Model failed to generate a response.");let e=ze(r?.response??r?.choices?.[0]?.message?.content??"");try{return{success:!0,result:JSON.parse(e),meta:{model:r?.model||"apple-on-device",totalDuration:r?.totalDuration||0,inputTokens:r?.inputTokens??r?.usage?.prompt_tokens??0,outputTokens:r?.outputTokens??r?.usage?.completion_tokens??0}}}catch{return{success:!0,result:{raw:e},meta:{model:r?.model||"apple-on-device",inputTokens:r?.inputTokens??0,outputTokens:r?.outputTokens??0}}}},async fetchModels(r){let e=(r||this.defaultEndpoint).replace(/\/$/,"");try{let t=await fetch(`${e}/apple-fm/status`,{signal:AbortSignal.timeout(5e3)});if(t.ok){let s=await t.json();if(Array.isArray(s.models)&&s.models.length>0)return s.models.map(i=>({id:i.id||i.name,name:i.name||i.id}))}}catch{}return this.models},async ping(r){let e=(r||this.defaultEndpoint).replace(/\/$/,"");try{let t=await fetch(`${e}/apple-fm/status`,{signal:AbortSignal.timeout(5e3)});if(t.ok){let s=await t.json();return s.available?{status:"connected",version:s.variant||s.osVersion||"Apple Intelligence"}:{status:s.status==="unsupported_os"?"unsupported-os":"connected",version:s.variant||s.osVersion||"macOS Bridge Ready",warning:s.reason||null}}return{status:"error",code:t.status}}catch{return{status:"offline"}}}},chromeai:{id:"chromeai",name:"Chrome Built-in AI",icon:"\u{1F310}",authType:"none",defaultEndpoint:"chrome://on-device-internals",models:[{id:"gemini-nano",name:"Gemini Nano (Chrome Prompt API)"}],modelsFetchable:!1,async evaluateDirect(r,e="gemini-nano",t={}){let s=Oe();if(!s)return{success:!1,error:"Chrome Built-in AI (Prompt API) is not enabled in this browser. Enable chrome://flags/#prompt-api-for-gemini-nano and restart Chrome."};let i=14e3,o=r.length>i?`${r.slice(0,i)}

[DOM truncated for Gemini Nano context window. Respond ONLY with valid JSON.]`:r,a=t.systemPrompt||"You are a UX evaluation expert. Respond ONLY with a valid JSON object without markdown code fences.",l=null;try{s.type==="standard"?l=await s.api.create({initialPrompts:[{role:"system",content:a}],temperature:t.temperature??.3,topK:3,signal:t.signal}):l=await s.api.create({systemPrompt:a,temperature:t.temperature??.3,topK:3,signal:t.signal});let c=await l.prompt(o,{signal:t.signal}),p=ze(c),u=Math.max(1,Math.round(o.length/4)),d=Math.max(1,Math.round(p.length/4));try{return{success:!0,result:JSON.parse(p),meta:{model:e||"gemini-nano",inputTokens:u,outputTokens:d}}}catch{return{success:!0,result:{raw:p},meta:{model:e||"gemini-nano",inputTokens:u,outputTokens:d}}}}catch(c){return{success:!1,error:`Chrome Built-in AI error: ${c.message||String(c)}`}}finally{try{l?.destroy?.()}catch{}}},async fetchModels(){return this.models},async ping(){let r=Oe();if(!r)return{status:"chromeai-disabled"};try{if(r.type==="standard"&&typeof r.api.availability=="function"){let e=await r.api.availability();return e==="unavailable"||e==="no"?{status:"chromeai-disabled"}:{status:"connected",version:`Gemini Nano (${e})`}}if(r.type==="legacy"&&typeof r.api.capabilities=="function"){let e=await r.api.capabilities();return e?.available==="no"?{status:"chromeai-disabled"}:{status:"connected",version:`Gemini Nano (${e?.available||"ready"})`}}return{status:"connected",version:"Gemini Nano"}}catch{return{status:"chromeai-disabled"}}}}};function ae(r){return re[r]||re.ollama}function Ie(){return Object.values(re).map(r=>({id:r.id,name:r.name,icon:r.icon,authType:r.authType,models:r.models}))}var oe=class extends m{static properties={ollamaStatus:{type:Object},endpoint:{type:String},model:{type:String},models:{type:Array},language:{type:String},connectionState:{type:String},showSetupGuide:{type:Boolean},errorType:{type:String},providerId:{type:String},apiKey:{type:String},enableVision:{type:Boolean},mcpStatus:{type:Object},showMcpGuide:{type:Boolean},mcpToken:{type:String},_saved:{type:Boolean,state:!0}};static styles=f`
    :host {
      display: block;
      padding: 16px;
    }

    .section { margin-bottom: 24px; }

    .section-header {
      font-size: 11px;
      font-weight: 600;
      color: var(--sx-text-tertiary, #8a8a96);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 10px;
    }

    .settings-card {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 10px;
      padding: 14px;
    }

    /* ─── Fields ─────────────────────────────── */
    .field { margin-bottom: 12px; }
    .field:last-child { margin-bottom: 0; }

    .field-label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: var(--sx-text-secondary, #b4b4bc);
      margin-bottom: 5px;
    }

    .field-input {
      width: 100%;
      padding: 8px 10px;
      background: var(--sx-bg-input, #141416);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 6px;
      color: var(--sx-text-primary, #ededf0);
      font-size: 13px;
      font-family: inherit;
      outline: none;
      transition: border-color 150ms ease;
      box-sizing: border-box;
    }

    .field-input:focus {
      border-color: var(--sx-accent, #3b82f6);
    }

    .field-select {
      width: 100%;
      padding: 8px 10px;
      background: var(--sx-bg-input, #141416);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 6px;
      color: var(--sx-text-primary, #ededf0);
      font-size: 13px;
      font-family: inherit;
      outline: none;
      cursor: pointer;
      box-sizing: border-box;
      -webkit-appearance: none;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2363636e' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
      padding-right: 28px;
    }

    .field-select:focus { border-color: var(--sx-accent, #3b82f6); }

    /* ─── Buttons ─────────────────────────────── */
    .test-btn {
      width: 100%;
      padding: 8px;
      border-radius: 6px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      background: var(--sx-bg-tertiary, #202024);
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
      margin-top: 10px;
    }

    .test-btn:hover { border-color: var(--sx-border-hover, rgba(255,255,255,0.10)); }
    .test-btn.testing { color: var(--sx-accent, #3b82f6); }
    .test-btn.connected {
      color: var(--sx-success, #22c55e);
      border-color: rgba(34, 197, 94, 0.2);
    }
    .test-btn.failed {
      color: var(--sx-error, #ef4444);
      border-color: rgba(239, 68, 68, 0.2);
    }

    .save-btn {
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 8px;
      background: var(--sx-accent, #3b82f6);
      color: white;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
      margin-top: 14px;
    }

    .save-btn:hover { background: var(--sx-accent-hover, #60a5fa); }
    .save-btn.saved { background: var(--sx-success, #22c55e); }

    /* ─── Language ────────────────────────────── */
    .lang-options { display: flex; gap: 6px; }

    .lang-btn {
      flex: 1;
      padding: 8px;
      border-radius: 6px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      background: var(--sx-bg-card, #1c1c1f);
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 150ms ease;
      text-align: center;
      font-family: inherit;
    }

    .lang-btn:hover { border-color: var(--sx-border-hover, rgba(255,255,255,0.10)); }
    .lang-btn.active {
      border-color: var(--sx-accent, #3b82f6);
      color: var(--sx-text-primary, #ededf0);
      background: var(--sx-accent-dim, rgba(59,130,246,0.08));
    }

    /* ─── Setup Guide ────────────────────────── */
    .setup-guide {
      margin-bottom: 20px;
    }

    .setup-toggle {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 8px;
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
    }

    .setup-toggle:hover {
      border-color: var(--sx-border-hover, rgba(255,255,255,0.10));
    }

    .setup-chevron {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      transition: transform 150ms ease;
    }

    .setup-chevron.open { transform: rotate(90deg); }

    .setup-content {
      margin-top: 8px;
      padding: 14px;
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 8px;
    }

    .setup-step {
      margin-bottom: 14px;
    }

    .setup-step:last-child { margin-bottom: 0; }

    .step-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--sx-accent-dim, rgba(59,130,246,0.12));
      color: var(--sx-accent, #3b82f6);
      font-size: 10px;
      font-weight: 700;
      margin-right: 6px;
    }

    .step-title {
      font-size: 12px;
      font-weight: 500;
      color: var(--sx-text-primary, #ededf0);
      margin-bottom: 5px;
    }

    .step-desc {
      font-size: 11px;
      color: var(--sx-text-secondary, #b4b4bc);
      line-height: 1.5;
      margin-bottom: 6px;
    }

    .code-block {
      position: relative;
      background: var(--sx-bg-input, #141416);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 6px;
      padding: 8px 10px;
      padding-top: 28px;
    }

    .code-block code {
      display: block;
      font-family: 'SF Mono', Monaco, 'Fira Code', monospace;
      font-size: 11px;
      color: var(--sx-text-primary, #ededf0);
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-all;
      text-align: left;
    }

    .copy-btn {
      position: absolute;
      top: 4px;
      right: 4px;
      padding: 3px 8px;
      border: none;
      border-radius: 4px;
      background: var(--sx-bg-tertiary, #202024);
      color: var(--sx-text-tertiary, #8a8a96);
      font-size: 10px;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
    }

    .copy-btn:hover {
      color: var(--sx-text-primary, #ededf0);
    }

    .copy-btn.copied {
      color: var(--sx-success, #22c55e);
    }

    .error-hint {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 10px 12px;
      background: var(--sx-warning-dim, rgba(234,179,8,0.10));
      border: 1px solid rgba(234, 179, 8, 0.15);
      border-radius: 8px;
      font-size: 11px;
      color: var(--sx-text-secondary, #b4b4bc);
      line-height: 1.5;
      margin-top: 10px;
    }

    .error-hint-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--sx-warning, #eab308);
      flex-shrink: 0;
      margin-top: 5px;
    }

    .error-hint strong {
      color: var(--sx-warning, #eab308);
    }

    /* ─── API Key ─────────────────────────── */
    .field-input.api-key {
      font-family: 'SF Mono', Monaco, monospace;
      font-size: 11px;
      letter-spacing: 0.5px;
    }

    .api-key-hint {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-top: 4px;
      line-height: 1.4;
    }

    .api-key-hint a {
      color: var(--sx-accent, #3b82f6);
      text-decoration: none;
    }

    .provider-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 3px;
      background: var(--sx-accent-dim, rgba(59,130,246,0.08));
      color: var(--sx-accent, #3b82f6);
      margin-left: 6px;
    }

    /* ─── About ──────────────────────────────── */
    .about-card {
      text-align: center;
      padding: 20px 14px;
    }

    .about-name {
      font-size: 15px;
      font-weight: 700;
      color: var(--sx-text-primary, #ededf0);
      margin-bottom: 2px;
    }

    .about-version {
      font-size: 11px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-bottom: 10px;
    }

    .about-desc {
      font-size: 12px;
      color: var(--sx-text-secondary, #b4b4bc);
      line-height: 1.5;
      margin-bottom: 12px;
    }

    .about-links { display: flex; gap: 16px; justify-content: center; }

    .about-link {
      font-size: 12px;
      color: var(--sx-accent, #3b82f6);
      text-decoration: none;
      font-weight: 500;
    }

    .about-link:hover { text-decoration: underline; }

    .about-license {
      font-size: 10px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-top: 10px;
    }

    /* ─── Toggle Switch ──────────────────────── */
    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 22px;
      flex-shrink: 0;
    }
    .toggle-switch input { opacity: 0; width: 0; height: 0; }
    .toggle-slider {
      position: absolute;
      cursor: pointer;
      inset: 0;
      background: var(--sx-bg-tertiary, #202024);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 22px;
      transition: all 200ms ease;
    }
    .toggle-slider::before {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      left: 2px;
      bottom: 2px;
      background: var(--sx-text-tertiary, #8a8a96);
      border-radius: 50%;
      transition: all 200ms ease;
    }
    .toggle-switch input:checked + .toggle-slider {
      background: var(--sx-accent-dim, rgba(59,130,246,0.15));
      border-color: var(--sx-accent, #3b82f6);
    }
    .toggle-switch input:checked + .toggle-slider::before {
      transform: translateX(18px);
      background: var(--sx-accent, #3b82f6);
    }
  `;constructor(){super(),this.ollamaStatus={connected:!1,models:[]},this.endpoint="http://localhost:11434",this.model="gemma4",this.models=[],this.language="en",this.connectionState="idle",this.showSetupGuide=!1,this.errorType="",this.providerId="ollama",this.apiKey="",this.enableVision=!0,this.mcpStatus={enabled:!0,connected:!1,wsUrl:"ws://127.0.0.1:17483/ws"},this.showMcpGuide=!1,this.mcpToken="",this._saved=!1,this._copiedCmd="",this._loadSettings(),this._loadMcpStatus()}async _loadMcpStatus(){try{let e=await chrome.runtime.sendMessage({type:"GET_MCP_STATUS"});e&&(this.mcpStatus=e);let t=await chrome.storage.local.get({mcpToken:""});this.mcpToken=t.mcpToken||""}catch{}}async _toggleMcpBridge(e){let t=e.target.checked;try{let s=await chrome.runtime.sendMessage({type:"CONFIGURE_MCP",payload:{enabled:t,mcpToken:this.mcpToken}});s?.status&&(this.mcpStatus=s.status)}catch{}}async _onMcpTokenBlur(){try{let e=await chrome.runtime.sendMessage({type:"CONFIGURE_MCP",payload:{mcpToken:this.mcpToken}});e?.status&&(this.mcpStatus=e.status),this._saved=!0,clearTimeout(this._savedTimer),this._savedTimer=setTimeout(()=>{this._saved=!1},2e3)}catch{}}updated(e){if(e.has("ollamaStatus")&&this.ollamaStatus?.connected&&this.providerId==="ollama"){let t=(this.ollamaStatus.models||[]).map(s=>s.name||s.id||s);t.length>0&&JSON.stringify(t)!==JSON.stringify(this.models)&&(this.models=t,this.model&&!this.models.includes(this.model)&&this.models.length>0)}}get _isCloudProvider(){return this.providerId==="openai"||this.providerId==="gemini"||this.providerId==="claude"}get _isBrowserBuiltInProvider(){return this.providerId==="chromeai"}async _loadSettings(){try{let e=await chrome.storage.local.get({ollamaEndpoint:"http://localhost:11434",ollamaModel:"gemma4",language:"en",providerId:"ollama",apiKey:"",apiKey_openai:"",apiKey_gemini:"",apiKey_claude:"",enableVision:!0});this.endpoint=e.ollamaEndpoint,this.model=e.ollamaModel,this.language=e.language,this.providerId=e.providerId,this.apiKey=e[`apiKey_${this.providerId}`]||e.apiKey||"",this.enableVision=e.enableVision!==!1,this._updateModelsForProvider()}catch{}}async _testConnection(){this.connectionState="testing",this.errorType="";let e=ae(this.providerId);try{let t=await e.ping(this.endpoint,this.apiKey),s=typeof t=="object"?t.status==="connected":!!t,i=typeof t=="object"&&t.status==="cors-blocked",o=typeof t=="object"&&t.status==="chromeai-disabled";if(s){let a=await e.fetchModels(this.endpoint,this.apiKey);this.models=a.map(l=>l.id||l.name),this.connectionState="connected",this.errorType="",this.models.length>0&&!this.models.includes(this.model)&&(this.model=this.models[0]),this.dispatchEvent(new CustomEvent("status-changed",{detail:{connected:!0,models:a,provider:this.providerId}}))}else i?(this.connectionState="failed",this.errorType="cors",this.showSetupGuide=!0,this.dispatchEvent(new CustomEvent("status-changed",{detail:{connected:!1,corsBlocked:!0,models:[]}}))):o?(this.connectionState="failed",this.errorType="chromeai-disabled",this.showSetupGuide=!0,this.dispatchEvent(new CustomEvent("status-changed",{detail:{connected:!1,models:[]}}))):(this.connectionState="failed",this.errorType=this._isCloudProvider?"auth":"offline",this._isCloudProvider||(this.showSetupGuide=!0),this.dispatchEvent(new CustomEvent("status-changed",{detail:{connected:!1,models:[]}})))}catch(t){this.connectionState="failed",this.errorType=t.name==="TimeoutError"?"timeout":this._isCloudProvider?"auth":"offline",this._isCloudProvider||(this.showSetupGuide=!0),this.dispatchEvent(new CustomEvent("status-changed",{detail:{connected:!1,models:[]}}))}setTimeout(()=>{this.connectionState==="connected"&&(this.connectionState="idle")},3e3)}_updateModelsForProvider(){let e=ae(this.providerId);this.providerId==="ollama"?(this.endpoint="http://localhost:11434",this.ollamaStatus?.connected&&this.ollamaStatus?.provider==="ollama"?this.models=(this.ollamaStatus.models||[]).map(t=>t.name||t.id||t):this.models=[],this.models.length>0&&!this.models.includes(this.model)||this.model||(this.model=this.models[0]||"gemma4")):(this.endpoint=e.defaultEndpoint,this.models=(e.models||[]).map(t=>t.id),this.models.length>0&&!this.models.includes(this.model)&&(this.model=this.models[0])),this.connectionState="idle"}async _onProviderChange(e){this.providerId=e.target.value;try{let t=await chrome.storage.local.get(`apiKey_${this.providerId}`);this.apiKey=t[`apiKey_${this.providerId}`]||""}catch{this.apiKey=""}this._updateModelsForProvider(),this._autoSave(),(this.apiKey&&this._isCloudProvider||this.providerId==="apple"||this.providerId==="chromeai")&&this._testConnection()}_onApiKeyBlur(){this.apiKey&&this.apiKey.length>5&&(this._autoSave(),this._testConnection())}_onModelChange(e){this.model=e.target.value,this._autoSave()}_onLanguageChange(e){this.language=e,this._autoSave()}_onEndpointBlur(){this._autoSave()}async _autoSave(){try{let e={ollamaEndpoint:this.endpoint,ollamaModel:this.model,language:this.language,providerId:this.providerId,apiKey:this.apiKey,enableVision:this.enableVision};this.providerId!=="ollama"&&this.apiKey&&(e[`apiKey_${this.providerId}`]=this.apiKey),await chrome.runtime.sendMessage({type:"SAVE_SETTINGS",payload:e}),this._saved=!0,clearTimeout(this._savedTimer),this._savedTimer=setTimeout(()=>{this._saved=!1},2e3)}catch(e){console.error("[synthux] Auto-save failed:",e)}}async _saveSettings(){await this._autoSave()}async _copyCommand(e,t){try{await navigator.clipboard.writeText(e)}catch{let s=document.createElement("textarea");s.value=e,document.body.appendChild(s),s.select(),document.execCommand("copy"),document.body.removeChild(s)}this._copiedCmd=t,this.requestUpdate(),setTimeout(()=>{this._copiedCmd="",this.requestUpdate()},2e3)}_getTestLabel(){switch(this.connectionState){case"testing":return"Testing...";case"connected":return"Connected";case"failed":return this.errorType==="cors"?"Blocked (CORS)":this.errorType==="chromeai-disabled"?"Flags Not Enabled":this.errorType==="timeout"?"Timed out":this.errorType==="offline"?"Not reachable":this.errorType==="auth"?"Invalid API key":"Connection failed";default:return"Test Connection"}}_getApiKeyHint(){switch(this.providerId){case"openai":return n`Get your key at <a href="https://platform.openai.com/api-keys" target="_blank">platform.openai.com</a>`;case"gemini":return n`Get your key at <a href="https://aistudio.google.com/apikey" target="_blank">AI Studio</a>`;case"claude":return n`Get your key at <a href="https://console.anthropic.com/" target="_blank">console.anthropic.com</a>`;default:return""}}_detectOS(){let e=navigator.userAgent.toLowerCase();return e.includes("mac")?"mac":e.includes("win")?"win":"linux"}_getCorsCommand(){let e=this._detectOS();return e==="mac"?'launchctl setenv OLLAMA_ORIGINS "*"':e==="win"?'[Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", "User")':"sudo systemctl edit ollama"}_getCorsNote(){let e=this._detectOS();return e==="win"?"Run in PowerShell as Administrator":e==="linux"?'Add under [Service]: Environment="OLLAMA_ORIGINS=*"':null}_getOtherPlatformCommands(){let e=this._detectOS(),s=Object.entries({mac:{name:"macOS",cmd:'launchctl setenv OLLAMA_ORIGINS "*"'},linux:{name:"Linux",cmd:'sudo systemctl edit ollama \u2192 Environment="OLLAMA_ORIGINS=*"'},win:{name:"Windows",cmd:'[Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", "User")'}}).filter(([i])=>i!==e);return n`${s.map(([,i])=>n`<div style="margin-bottom: 4px;"><strong>${i.name}:</strong> <code style="font-size: 10px;">${i.cmd}</code></div>`)}`}render(){let e=Ie();return n`
      <div class="section">
        <div class="section-header">AI Provider</div>
        <div class="settings-card">
          <div class="field">
            <label class="field-label">Provider</label>
            <select class="field-select" .value="${this.providerId}" @change="${this._onProviderChange}">
              ${e.map(t=>n`<option value="${t.id}" ?selected="${t.id===this.providerId}">${t.icon} ${t.name}</option>`)}
            </select>
          </div>

          ${this._isCloudProvider?n`
            <div class="field">
              <label class="field-label">API Key</label>
              <input class="field-input api-key" type="password" .value="${this.apiKey}" @input="${t=>this.apiKey=t.target.value}" @blur="${this._onApiKeyBlur}" placeholder="Enter API key..." />
              <div class="api-key-hint">${this._getApiKeyHint()}</div>
            </div>
          `:this._isBrowserBuiltInProvider?n`
            <div class="field">
              <div class="api-key-hint" style="margin-top: 0;">
                Runs 100% inside Chrome via the built-in <code>window.LanguageModel</code> Prompt API — no API key or external server required.
              </div>
            </div>
          `:n`
            <div class="field">
              <label class="field-label">${this.providerId==="apple"?"Local Bridge Endpoint":"Endpoint"}</label>
              <input class="field-input" type="url" .value="${this.endpoint}" @input="${t=>this.endpoint=t.target.value}" @blur="${this._onEndpointBlur}" placeholder="${this.providerId==="apple"?"http://127.0.0.1:17483":"http://localhost:11434"}" />
              ${this.providerId==="apple"?n`<div class="api-key-hint">Powered by macOS 26/27 <code>FoundationModels</code> (<code>SystemLanguageModel.default</code>) via <code>synthux-mcp</code>.</div>`:""}
            </div>
          `}

          <div class="field">
            <label class="field-label">Model</label>
            ${this.models.length>0?n`
              <select class="field-select" .value="${this.model}" @change="${this._onModelChange}">
                ${this.models.map(t=>n`<option value="${t}" ?selected="${t===this.model}">${t}</option>`)}
              </select>
            `:n`
              <input class="field-input" type="text" .value="${this.model}" @input="${t=>this.model=t.target.value}" @blur="${()=>this._autoSave()}" placeholder="gemma4" />
            `}
          </div>
          <button class="test-btn ${this.connectionState}" @click="${this._testConnection}" ?disabled="${this.connectionState==="testing"}">${this._getTestLabel()}</button>
        </div>

        ${this.errorType==="cors"?n`
          <div class="error-hint">
            <span class="error-hint-dot"></span>
            <div>
              <strong>CORS blocked.</strong> Ollama needs permission to accept requests from Chrome extensions. See the setup guide below.
            </div>
          </div>
        `:""}

        ${this.errorType==="auth"?n`
          <div class="error-hint">
            <span class="error-hint-dot"></span>
            <div>
              <strong>Invalid API key.</strong> Check your API key and try again.
            </div>
          </div>
        `:""}

        ${this.errorType==="chromeai-disabled"?n`
          <div class="error-hint">
            <span class="error-hint-dot"></span>
            <div>
              <strong>Chrome Built-in AI not enabled.</strong> Enable the Prompt API flags in <code>chrome://flags</code> below and relaunch Chrome.
            </div>
          </div>
        `:""}

        ${(this.errorType==="offline"||this.errorType==="timeout")&&this.providerId==="apple"?n`
          <div class="error-hint">
            <span class="error-hint-dot"></span>
            <div>
              <strong>Apple Foundation Model bridge not running.</strong> Run <code>npx -y synthux-mcp</code> in Terminal on macOS 26/27 to start the local Apple Intelligence bridge.
            </div>
          </div>
        `:""}

        ${(this.errorType==="offline"||this.errorType==="timeout")&&this.providerId==="ollama"?n`
          <div class="error-hint">
            <span class="error-hint-dot"></span>
            <div>
              <strong>Ollama not running.</strong> Make sure Ollama is installed and running on your machine.
            </div>
          </div>
        `:""}
      </div>

      ${this.providerId==="apple"?n`
      <div class="setup-guide">
        <button class="setup-toggle" @click="${()=>this.showSetupGuide=!this.showSetupGuide}">
          Apple Intelligence (macOS 26/27) Setup Guide
          <span class="setup-chevron ${this.showSetupGuide?"open":""}">▶</span>
        </button>

        ${this.showSetupGuide?n`
          <div class="setup-content">
            <div class="setup-step">
              <div class="step-title"><span class="step-number">1</span> Enable Apple Intelligence on macOS</div>
              <div class="step-desc">Open <strong>System Settings → Apple Intelligence & Siri</strong> on macOS 26 Tahoe or macOS 27+ (Apple Silicon M1–M5). Zero model download or API key needed.</div>
            </div>

            <div class="setup-step">
              <div class="step-title"><span class="step-number">2</span> Start the Local Apple Foundation Model Bridge</div>
              <div class="step-desc">Run <code>synthux-mcp</code> in Terminal (or keep your MCP IDE agent open) to expose <code>SystemLanguageModel.default</code> on <code>127.0.0.1:17483</code>:</div>
              <div class="code-block">
                <button class="copy-btn ${this._copiedCmd==="apple-bridge"?"copied":""}" @click="${()=>this._copyCommand("npx -y synthux-mcp","apple-bridge")}">${this._copiedCmd==="apple-bridge"?"Copied":"Copy"}</button>
                <code>npx -y synthux-mcp</code>
              </div>
            </div>

            <div class="setup-step">
              <div class="step-title"><span class="step-number">3</span> Select Model & Test Connection</div>
              <div class="step-desc">Choose <code>apple-on-device</code> (Apple Neural Engine) or <code>apple-pcc</code> (Private Cloud Compute on macOS 27) and click <strong>Test Connection</strong>.</div>
            </div>
          </div>
        `:""}
      </div>
      `:""}

      ${this.providerId==="chromeai"?n`
      <div class="setup-guide">
        <button class="setup-toggle" @click="${()=>this.showSetupGuide=!this.showSetupGuide}">
          Chrome Built-in AI (Gemini Nano) Setup Guide
          <span class="setup-chevron ${this.showSetupGuide?"open":""}">▶</span>
        </button>

        ${this.showSetupGuide?n`
          <div class="setup-content">
            <div class="setup-step">
              <div class="step-title"><span class="step-number">1</span> Enable Optimization Guide On-Device Model</div>
              <div class="step-desc">Copy and open in Chrome address bar, then set to <strong>Enabled BypassPerfRequirement</strong>:</div>
              <div class="code-block">
                <button class="copy-btn ${this._copiedCmd==="cflag1"?"copied":""}" @click="${()=>this._copyCommand("chrome://flags/#optimization-guide-on-device-model","cflag1")}">${this._copiedCmd==="cflag1"?"Copied":"Copy"}</button>
                <code>chrome://flags/#optimization-guide-on-device-model</code>
              </div>
            </div>

            <div class="setup-step">
              <div class="step-title"><span class="step-number">2</span> Enable Prompt API for Gemini Nano</div>
              <div class="step-desc">Copy and open in Chrome address bar, set to <strong>Enabled</strong>, and relaunch Chrome:</div>
              <div class="code-block">
                <button class="copy-btn ${this._copiedCmd==="cflag2"?"copied":""}" @click="${()=>this._copyCommand("chrome://flags/#prompt-api-for-gemini-nano","cflag2")}">${this._copiedCmd==="cflag2"?"Copied":"Copy"}</button>
                <code>chrome://flags/#prompt-api-for-gemini-nano</code>
              </div>
            </div>
          </div>
        `:""}
      </div>
      `:""}

      ${this.providerId==="ollama"?n`
      <div class="setup-guide">
        <button class="setup-toggle" @click="${()=>this.showSetupGuide=!this.showSetupGuide}">
          Ollama Setup Guide
          <span class="setup-chevron ${this.showSetupGuide?"open":""}">▶</span>
        </button>

        ${this.showSetupGuide?n`
          <div class="setup-content">
            <div class="setup-step">
              <div class="step-title"><span class="step-number">1</span> Install Ollama</div>
              <div class="step-desc">Download from ollama.com and install.</div>
              <div class="code-block">
                <button class="copy-btn ${this._copiedCmd==="url"?"copied":""}" @click="${()=>this._copyCommand("https://ollama.com/download","url")}">${this._copiedCmd==="url"?"Copied":"Copy"}</button>
                <code>https://ollama.com/download</code>
              </div>
            </div>

            <div class="setup-step">
              <div class="step-title"><span class="step-number">2</span> Download a 2026 Local Model</div>
              <div class="step-desc">Pull a vision-capable or reasoning model (click any to copy):</div>
              <div class="code-block">
                <button class="copy-btn ${this._copiedCmd==="pull"?"copied":""}" @click="${()=>this._copyCommand("ollama pull gemma4","pull")}">${this._copiedCmd==="pull"?"Copied":"Copy"}</button>
                <code>ollama pull gemma4</code>
              </div>
              <div class="step-desc" style="margin-top: 6px; font-size: 10px; color: var(--sx-text-tertiary); line-height: 1.6;">
                Recommended 2026 models:<br>
                • <code style="font-size: 10px; cursor: pointer;" @click="${()=>this._copyCommand("ollama pull gemma4:e4b","p1")}">ollama pull gemma4:e4b</code> (Fast Vision · Low RAM)<br>
                • <code style="font-size: 10px; cursor: pointer;" @click="${()=>this._copyCommand("ollama pull qwen3.8","p2")}">ollama pull qwen3.8</code> (Top JSON & Code Fixes)<br>
                • <code style="font-size: 10px; cursor: pointer;" @click="${()=>this._copyCommand("ollama pull qwen3.5","p3")}">ollama pull qwen3.5</code> (Multimodal Vision)<br>
                • <code style="font-size: 10px; cursor: pointer;" @click="${()=>this._copyCommand("ollama pull llama4:scout","p4")}">ollama pull llama4:scout</code> (Meta Multimodal MoE)<br>
                • <code style="font-size: 10px; cursor: pointer;" @click="${()=>this._copyCommand("ollama pull deepseek-r1","p5")}">ollama pull deepseek-r1</code> (Deep Reasoning)
              </div>
            </div>

            <div class="setup-step">
              <div class="step-title"><span class="step-number">3</span> Allow extension access</div>
              <div class="step-desc">Ollama blocks browser extensions by default. Run this in Terminal:</div>
              <div class="code-block">
                <button class="copy-btn ${this._copiedCmd==="cors"?"copied":""}" @click="${()=>this._copyCommand(this._getCorsCommand(),"cors")}">${this._copiedCmd==="cors"?"Copied":"Copy"}</button>
                <code>${this._getCorsCommand()}</code>
              </div>
              ${this._getCorsNote()?n`<div class="step-desc" style="margin-top: 4px; font-size: 10px; color: var(--sx-text-tertiary);">${this._getCorsNote()}</div>`:""}
              <details style="margin-top: 6px; font-size: 10px; color: var(--sx-text-tertiary);">
                <summary style="cursor: pointer;">Other platforms</summary>
                <div style="padding: 6px 0;">${this._getOtherPlatformCommands()}</div>
              </details>
            </div>

            <div class="setup-step">
              <div class="step-title"><span class="step-number">4</span> Quit and restart Ollama</div>
              <div class="step-desc">Close Ollama completely, then reopen it. The CORS setting won't take effect until restarted.</div>
              <div class="step-desc" style="font-size: 10px; color: var(--sx-text-tertiary);">Ollama updates may reset this setting. If you get a CORS error after updating, repeat step 3 and restart.</div>
            </div>
          </div>
        `:""}
      </div>
      `:""}

      <div class="section">
        <div class="section-header">Analysis</div>
        <div class="settings-card" style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-size: 13px; font-weight: 500; color: var(--sx-text-primary, #ededf0);">Screenshot Analysis</div>
            <div style="font-size: 11px; color: var(--sx-text-tertiary, #8a8a96); margin-top: 2px;">Send page screenshot to AI for visual analysis</div>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" .checked="${this.enableVision}" @change="${t=>{this.enableVision=t.target.checked,this._autoSave()}}" />
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div class="section">
        <div class="section-header">MCP Agent Bridge (Antigravity · Claude · Cursor · Codex)</div>
        <div class="settings-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
            <div>
              <div style="font-size: 13px; font-weight: 500; color: var(--sx-text-primary, #ededf0); display: flex; align-items: center; gap: 6px;">
                Local MCP Bridge
                <span class="provider-badge" style="background: ${this.mcpStatus?.connected?"rgba(34,197,94,0.12)":"rgba(255,255,255,0.06)"}; color: ${this.mcpStatus?.connected?"#22c55e":"#8a8a96"};">
                  ${this.mcpStatus?.connected?"Connected":this.mcpStatus?.enabled!==!1?"Standby (127.0.0.1)":"Disabled"}
                </span>
              </div>
              <div style="font-size: 11px; color: var(--sx-text-tertiary, #8a8a96); margin-top: 2px;">
                Allow desktop AI agents to control synthux over local loopback (127.0.0.1:17483)
              </div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" .checked="${this.mcpStatus?.enabled!==!1}" @change="${this._toggleMcpBridge}" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="field" style="margin-top: 10px;">
            <label class="field-label">Optional Pairing Token (High-Security Mode)</label>
            <input class="field-input api-key" type="password" .value="${this.mcpToken}" @input="${t=>this.mcpToken=t.target.value}" @blur="${this._onMcpTokenBlur}" placeholder="Leave empty or match SYNTHUX_MCP_TOKEN..." />
            <div class="api-key-hint">Loopback-only (127.0.0.1) · Origin-verified · API keys are never exposed over MCP.</div>
          </div>

          <button class="setup-toggle" style="margin-top: 10px;" @click="${()=>this.showMcpGuide=!this.showMcpGuide}">
            MCP Agent Setup Guide (mcp_config.json)
            <span class="setup-chevron ${this.showMcpGuide?"open":""}">▶</span>
          </button>

          ${this.showMcpGuide?n`
            <div class="setup-content" style="margin-top: 8px;">
              <div class="setup-step">
                <div class="step-title"><span class="step-number">1</span> Add to Antigravity / Claude / Cursor MCP Config</div>
                <div class="step-desc">Paste into <code>~/.gemini/config/mcp_config.json</code> or your IDE's MCP configuration:</div>
                <div class="code-block">
                  <button class="copy-btn ${this._copiedCmd==="mcp-json"?"copied":""}" @click="${()=>this._copyCommand(`{
  "mcpServers": {
    "synthux": {
      "command": "npx",
      "args": ["-y", "synthux-mcp"]
    }
  }
}`,"mcp-json")}">${this._copiedCmd==="mcp-json"?"Copied":"Copy"}</button>
                  <code>{\n  "mcpServers": {\n    "synthux": {\n      "command": "npx",\n      "args": ["-y", "synthux-mcp"]\n    }\n  }\n}</code>
                </div>
              </div>
              <div class="setup-step">
                <div class="step-title"><span class="step-number">2</span> Streamable HTTP Endpoint (Optional)</div>
                <div class="step-desc">When <code>synthux-mcp</code> is running, agents can also connect via Streamable HTTP:</div>
                <div class="code-block">
                  <button class="copy-btn ${this._copiedCmd==="mcp-http"?"copied":""}" @click="${()=>this._copyCommand("http://127.0.0.1:17483/mcp","mcp-http")}">${this._copiedCmd==="mcp-http"?"Copied":"Copy"}</button>
                  <code>http://127.0.0.1:17483/mcp</code>
                </div>
              </div>
            </div>
          `:""}
        </div>
      </div>

      <div class="save-indicator ${this._saved?"visible":""}" style="text-align: center; padding: 8px; font-size: 11px; color: var(--sx-success, #22c55e); opacity: ${this._saved?"1":"0"}; transition: opacity 300ms ease;">✓ Auto-saved</div>


      <div class="section" style="margin-top: 32px;">
        <div class="section-header">About</div>
        <div class="settings-card about-card">
          <div class="about-name">synthux</div>
          <div class="about-version">v${chrome.runtime?.getManifest?.()?.version||"2.1.1"}</div>
          <div class="about-desc">AI-powered UX audit. Open source. Privacy first.</div>
          <div class="about-links">
            <a class="about-link" href="https://synthux.app" target="_blank">Website</a>
            <a class="about-link" href="https://github.com/synthuxapp/synthux" target="_blank">GitHub</a>
          </div>
          <div class="about-license">MIT License</div>
        </div>
      </div>
    `}};customElements.define("synthux-settings",oe);var ne=class extends m{static properties={activeTab:{type:String},ollamaStatus:{type:Object},mcpStatus:{type:Object},report:{type:Object},reportHistory:{type:Array},analysisProgress:{type:Object},isAnalyzing:{type:Boolean}};static styles=f`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: var(--sx-bg-primary, #111113);
      color: var(--sx-text-primary, #ededf0);
      font-family: var(--sx-font-family, 'Inter', sans-serif);
    }

    /* ─── Header ─────────────────────────────── */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      background: var(--sx-bg-secondary, #18181b);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo-img {
      height: 20px;
      width: auto;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 20px;
      font-weight: 500;
    }

    .status-badge.connected {
      color: var(--sx-success, #22c55e);
      background: var(--sx-success-dim, rgba(34,197,94,0.10));
    }

    .status-badge.cors-error {
      color: var(--sx-warning, #eab308);
      background: var(--sx-warning-dim, rgba(234,179,8,0.10));
    }

    .status-badge.version-warn {
      color: #f97316;
      background: rgba(249,115,22,0.10);
    }

    .status-badge.disconnected {
      color: var(--sx-text-tertiary, #8a8a96);
      background: var(--sx-bg-tertiary, #202024);
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .status-dot.connected {
      background: var(--sx-success, #22c55e);
    }

    .status-dot.cors-error {
      background: var(--sx-warning, #eab308);
    }

    .status-dot.version-warn {
      background: #f97316;
    }

    .status-dot.disconnected {
      background: var(--sx-text-tertiary, #8a8a96);
    }

    /* ─── Tabs ────────────────────────────────── */
    .tab-bar {
      display: flex;
      border-bottom: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      background: var(--sx-bg-secondary, #18181b);
    }

    .tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 0;
      font-size: 12px;
      font-weight: 600;
      color: var(--sx-text-tertiary, #8a8a96);
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
      letter-spacing: 0.2px;
    }

    .tab:hover {
      color: var(--sx-text-secondary, #b4b4bc);
    }

    .tab.active {
      color: var(--sx-text-primary, #ededf0);
      border-bottom-color: var(--sx-accent, #3b82f6);
    }

    /* ─── Content ─────────────────────────────── */
    .content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .tab-panel {
      display: none;
      animation: fadeIn 200ms ease;
    }

    .tab-panel.active {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* ─── Rating Toast ───────────────────────── */
    #rating-toast {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 12px;
      animation: slideUp 0.3s ease;
    }

    #rating-toast.rating-toast-exit {
      animation: slideDown 0.3s ease forwards;
    }

    .rating-toast {
      background: var(--sx-bg-secondary, #18181b);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 10px;
      padding: 14px 16px;
      box-shadow: 0 -4px 24px rgba(0,0,0,0.3);
    }

    .rating-toast__header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 6px;
    }

    .rating-toast__icon {
      color: #eab308;
      font-size: 14px;
    }

    .rating-toast__title {
      font-size: 13px;
      font-weight: 600;
      color: var(--sx-text-primary, #ededf0);
    }

    .rating-toast__desc {
      font-size: 11px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin: 0 0 12px;
      line-height: 1.4;
    }

    .rating-toast__actions {
      display: flex;
      gap: 8px;
    }

    .rating-toast__btn {
      flex: 1;
      padding: 7px 0;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      border: none;
      transition: all 150ms ease;
    }

    .rating-toast__btn--primary {
      background: var(--sx-accent, #3b82f6);
      color: #fff;
    }

    .rating-toast__btn--primary:hover {
      background: #2563eb;
    }

    .rating-toast__btn--secondary {
      background: var(--sx-bg-tertiary, #202024);
      color: var(--sx-text-tertiary, #8a8a96);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
    }

    .rating-toast__btn--secondary:hover {
      color: var(--sx-text-secondary, #b4b4bc);
    }

    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @keyframes slideDown {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(100%); opacity: 0; }
    }
  `;constructor(){super(),this.activeTab="scan",this.ollamaStatus={connected:!1,models:[]},this.mcpStatus={connected:!1,enabled:!0},this.report=null,this.reportHistory=[],this.analysisProgress=null,this.isAnalyzing=!1;try{this._port=chrome.runtime.connect({name:"sidepanel"})}catch{}this._setupMessageListeners(),this._checkOllamaStatus(),this._startHealthCheck(),this._loadLastReport(),this._loadHistory()}_setupMessageListeners(){chrome.runtime.onMessage.addListener(e=>{switch(e.type){case"ANALYSIS_PROGRESS":this.analysisProgress=e.payload,this.isAnalyzing=!0;break;case"ANALYSIS_COMPLETE":this.report=e.payload,this.isAnalyzing=!1,this.analysisProgress=null,this.activeTab="report",this._loadHistory(),this._maybeShowRatingPrompt();break;case"ANALYSIS_ERROR":this.isAnalyzing=!1,this.analysisProgress=null,e.payload?.errorType==="cors"&&(this.ollamaStatus={...this.ollamaStatus,connected:!1,corsBlocked:!0},this.activeTab="scan");break;case"ANALYSIS_CANCELLED":this.isAnalyzing=!1,this.analysisProgress=null;break;case"MCP_STATUS_CHANGED":this.mcpStatus=e.payload||{connected:!1};break}})}async _checkOllamaStatus(){try{let[e,t]=await Promise.all([chrome.runtime.sendMessage({type:"GET_OLLAMA_STATUS"}),chrome.runtime.sendMessage({type:"GET_MCP_STATUS"}).catch(()=>null)]);this.ollamaStatus=e||{connected:!1,models:[]},t&&(this.mcpStatus=t)}catch{this.ollamaStatus={connected:!1,models:[]}}}_startHealthCheck(){this._healthInterval=setInterval(()=>this._checkOllamaStatus(),15e3)}disconnectedCallback(){super.disconnectedCallback(),this._healthInterval&&clearInterval(this._healthInterval)}async _loadLastReport(){try{let e=await chrome.storage.local.get("lastReport");e.lastReport&&(this.report=e.lastReport)}catch{}}async _loadHistory(){try{let e=await chrome.runtime.sendMessage({type:"GET_REPORT_HISTORY"});this.reportHistory=e||[]}catch{this.reportHistory=[]}}async _loadHistoryReport(e){let{id:t}=e.detail;try{let s=await chrome.runtime.sendMessage({type:"LOAD_REPORT",payload:{id:t}});s?.report&&(this.report=s.report,this.activeTab="report")}catch(s){console.error("[synthux] Failed to load report:",s)}}async _deleteHistoryReport(e){let{id:t}=e.detail;try{let s=await chrome.runtime.sendMessage({type:"DELETE_REPORT",payload:{id:t}});s?.success&&(this.reportHistory=s.history)}catch(s){console.error("[synthux] Failed to delete report:",s)}}_setTab(e){this.activeTab=e,e==="scan"&&this._checkOllamaStatus()}_handleAnalysisStart(){this.isAnalyzing=!0}_handleAnalysisEnd(){this.isAnalyzing=!1,this.analysisProgress=null}_getStatusInfo(){let e=this.ollamaStatus,t=this.mcpStatus;return e?.connected&&e?.versionChanged?{cls:"version-warn",label:`Updated (${e.newVersion})`}:e?.connected&&t?.connected?{cls:"connected",label:"Connected \xB7 MCP"}:e?.connected?{cls:"connected",label:"Connected"}:t?.connected?{cls:"connected",label:"MCP Agent Ready"}:e?.corsBlocked?{cls:"cors-error",label:"CORS Error"}:{cls:"disconnected",label:"Offline"}}render(){let e=this._getStatusInfo();return n`
      <!-- Header -->
      <div class="header">
        <div class="logo">
          <img class="logo-img" src="../assets/logo.svg" alt="synthux" />
        </div>
        <div class="status-badge ${e.cls}">
          <span class="status-dot ${e.cls}"></span>
          ${e.label}
        </div>
      </div>

      <!-- Tab Bar -->
      <div class="tab-bar" role="tablist">
        <button 
          class="tab ${this.activeTab==="scan"?"active":""}"
          role="tab"
          aria-selected="${this.activeTab==="scan"}"
          @click="${()=>this._setTab("scan")}"
        >Scan</button>
        <button 
          class="tab ${this.activeTab==="report"?"active":""}"
          role="tab"
          aria-selected="${this.activeTab==="report"}"
          @click="${()=>this._setTab("report")}"
        >Report</button>
        <button 
          class="tab ${this.activeTab==="history"?"active":""}"
          role="tab"
          aria-selected="${this.activeTab==="history"}"
          @click="${()=>{this._setTab("history"),this._loadHistory()}}"
        >History</button>
        <button 
          class="tab ${this.activeTab==="settings"?"active":""}"
          role="tab"
          aria-selected="${this.activeTab==="settings"}"
          @click="${()=>this._setTab("settings")}"
        >Settings</button>
      </div>

      <!-- Content -->
      <div class="content">
        <div class="tab-panel ${this.activeTab==="scan"?"active":""}" role="tabpanel">
          <synthux-scanner
            .ollamaStatus="${this.ollamaStatus}"
            .isAnalyzing="${this.isAnalyzing}"
            .progress="${this.analysisProgress}"
            @analysis-start="${this._handleAnalysisStart}"
            @analysis-end="${this._handleAnalysisEnd}"
          ></synthux-scanner>
        </div>

        <div class="tab-panel ${this.activeTab==="report"?"active":""}" role="tabpanel">
          <synthux-report
            .report="${this.report}"
          ></synthux-report>
        </div>

        <div class="tab-panel ${this.activeTab==="history"?"active":""}" role="tabpanel">
          <synthux-report
            .report="${null}"
            .history="${this.reportHistory}"
            showHistory
            @load-report="${this._loadHistoryReport}"
            @delete-report="${this._deleteHistoryReport}"
          ></synthux-report>
        </div>

        <div class="tab-panel ${this.activeTab==="settings"?"active":""}" role="tabpanel">
          <synthux-settings
            .ollamaStatus="${this.ollamaStatus}"
            @status-changed="${t=>this.ollamaStatus=t.detail}"
          ></synthux-settings>
        </div>
      </div>
    `}async _maybeShowRatingPrompt(){try{let e=await chrome.storage.local.get(["synthux_rating_dismissed","synthux_analysis_count"]);if(e.synthux_rating_dismissed)return;let t=(e.synthux_analysis_count||0)+1;if(await chrome.storage.local.set({synthux_analysis_count:t}),t<1)return;setTimeout(()=>this._showRatingToast(),2e3)}catch{}}_showRatingToast(){if(this.shadowRoot.getElementById("rating-toast"))return;let e=document.createElement("div");e.id="rating-toast",e.innerHTML=`
      <div class="rating-toast">
        <div class="rating-toast__header">
          <span class="rating-toast__icon">\u2605</span>
          <span class="rating-toast__title">Enjoying synthux?</span>
        </div>
        <p class="rating-toast__desc">A quick rating on the Chrome Web Store helps others discover synthux.</p>
        <div class="rating-toast__actions">
          <button class="rating-toast__btn rating-toast__btn--primary" id="rating-rate">Rate synthux</button>
          <button class="rating-toast__btn rating-toast__btn--secondary" id="rating-dismiss">Maybe later</button>
        </div>
      </div>
    `,this.shadowRoot.appendChild(e),e.querySelector("#rating-rate").addEventListener("click",()=>{window.open("https://chromewebstore.google.com/detail/synthux/cgldigellmojaejmnhjhpbfccncbmnhm/reviews","_blank"),chrome.storage.local.set({synthux_rating_dismissed:!0}),e.remove()}),e.querySelector("#rating-dismiss").addEventListener("click",()=>{chrome.storage.local.set({synthux_rating_dismissed:!0}),e.classList.add("rating-toast-exit"),setTimeout(()=>e.remove(),300)})}};customElements.define("synthux-app",ne);export{ne as SynthuxApp};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
