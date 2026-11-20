import"./chunks/chunk-Y6SLVHK3.js";var W=globalThis,V=W.ShadowRoot&&(W.ShadyCSS===void 0||W.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Q=Symbol(),$e=new WeakMap,B=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==Q)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(V&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=$e.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&$e.set(t,e))}return e}toString(){return this.cssText}},_e=r=>new B(typeof r=="string"?r:r+"",void 0,Q),v=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((i,s,a)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[a+1],r[0]);return new B(t,r,Q)},Se=(r,e)=>{if(V)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),s=W.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,r.appendChild(i)}},Z=V?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return _e(t)})(r):r;var{is:nt,defineProperty:lt,getOwnPropertyDescriptor:ct,getOwnPropertyNames:dt,getOwnPropertySymbols:pt,getPrototypeOf:ut}=Object,q=globalThis,Ce=q.trustedTypes,ht=Ce?Ce.emptyScript:"",mt=q.reactiveElementPolyfillSupport,N=(r,e)=>r,ee={toAttribute(r,e){switch(e){case Boolean:r=r?ht:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},Pe=(r,e)=>!nt(r,e),Ae={attribute:!0,type:String,converter:ee,reflect:!1,useDefault:!1,hasChanged:Pe};Symbol.metadata??=Symbol("metadata"),q.litPropertyMetadata??=new WeakMap;var w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Ae){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&lt(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){let{get:s,set:a}=ct(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:s,set(o){let l=s?.call(this);a?.call(this,o),this.requestUpdate(e,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ae}static _$Ei(){if(this.hasOwnProperty(N("elementProperties")))return;let e=ut(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(N("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(N("properties"))){let t=this.properties,i=[...dt(t),...pt(t)];for(let s of i)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let s of i)t.unshift(Z(s))}else e!==void 0&&t.push(Z(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Se(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){let a=(i.converter?.toAttribute!==void 0?i.converter:ee).toAttribute(t,i.type);this._$Em=e,a==null?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(e,t){let i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let a=i.getPropertyOptions(s),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:ee;this._$Em=s;let l=o.fromAttribute(t,a.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(e,t,i,s=!1,a){if(e!==void 0){let o=this.constructor;if(s===!1&&(a=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??Pe)(a,t)||i.useDefault&&i.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:a},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),a!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,a]of this._$Ep)this[s]=a;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,a]of i){let{wrapped:o}=a,l=this[s];o!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,a,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[N("elementProperties")]=new Map,w[N("finalized")]=new Map,mt?.({ReactiveElement:w}),(q.reactiveElementVersions??=[]).push("2.1.2");var ne=globalThis,Ee=r=>r,K=ne.trustedTypes,ze=K?K.createPolicy("lit-html",{createHTML:r=>r}):void 0,Be="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,Ne="?"+$,gt=`<${Ne}>`,E=document,H=()=>E.createComment(""),D=r=>r===null||typeof r!="object"&&typeof r!="function",le=Array.isArray,ft=r=>le(r)||typeof r?.[Symbol.iterator]=="function",te=`[ 	
\f\r]`,j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Te=/-->/g,Me=/>/g,A=RegExp(`>|${te}(?:([^\\s"'>=/]+)(${te}*=${te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ie=/'/g,Re=/"/g,je=/^(?:script|style|textarea|title)$/i,ce=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),n=ce(1),Mt=ce(2),It=ce(3),z=Symbol.for("lit-noChange"),g=Symbol.for("lit-nothing"),Oe=new WeakMap,P=E.createTreeWalker(E,129);function He(r,e){if(!le(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ze!==void 0?ze.createHTML(e):e}var bt=(r,e)=>{let t=r.length-1,i=[],s,a=e===2?"<svg>":e===3?"<math>":"",o=j;for(let l=0;l<t;l++){let c=r[l],d,h,p=-1,m=0;for(;m<c.length&&(o.lastIndex=m,h=o.exec(c),h!==null);)m=o.lastIndex,o===j?h[1]==="!--"?o=Te:h[1]!==void 0?o=Me:h[2]!==void 0?(je.test(h[2])&&(s=RegExp("</"+h[2],"g")),o=A):h[3]!==void 0&&(o=A):o===A?h[0]===">"?(o=s??j,p=-1):h[1]===void 0?p=-2:(p=o.lastIndex-h[2].length,d=h[1],o=h[3]===void 0?A:h[3]==='"'?Re:Ie):o===Re||o===Ie?o=A:o===Te||o===Me?o=j:(o=A,s=void 0);let x=o===A&&r[l+1].startsWith("/>")?" ":"";a+=o===j?c+gt:p>=0?(i.push(d),c.slice(0,p)+Be+c.slice(p)+$+x):c+$+(p===-2?l:x)}return[He(r,a+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},L=class r{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let a=0,o=0,l=e.length-1,c=this.parts,[d,h]=bt(e,t);if(this.el=r.createElement(d,i),P.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(s=P.nextNode())!==null&&c.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let p of s.getAttributeNames())if(p.endsWith(Be)){let m=h[o++],x=s.getAttribute(p).split($),y=/([.?@])?(.*)/.exec(m);c.push({type:1,index:a,name:y[2],strings:x,ctor:y[1]==="."?se:y[1]==="?"?re:y[1]==="@"?ae:R}),s.removeAttribute(p)}else p.startsWith($)&&(c.push({type:6,index:a}),s.removeAttribute(p));if(je.test(s.tagName)){let p=s.textContent.split($),m=p.length-1;if(m>0){s.textContent=K?K.emptyScript:"";for(let x=0;x<m;x++)s.append(p[x],H()),P.nextNode(),c.push({type:2,index:++a});s.append(p[m],H())}}}else if(s.nodeType===8)if(s.data===Ne)c.push({type:2,index:a});else{let p=-1;for(;(p=s.data.indexOf($,p+1))!==-1;)c.push({type:7,index:a}),p+=$.length-1}a++}}static createElement(e,t){let i=E.createElement("template");return i.innerHTML=e,i}};function I(r,e,t=r,i){if(e===z)return e;let s=i!==void 0?t._$Co?.[i]:t._$Cl,a=D(e)?void 0:e._$litDirective$;return s?.constructor!==a&&(s?._$AO?.(!1),a===void 0?s=void 0:(s=new a(r),s._$AT(r,t,i)),i!==void 0?(t._$Co??=[])[i]=s:t._$Cl=s),s!==void 0&&(e=I(r,s._$AS(r,e.values),s,i)),e}var ie=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??E).importNode(t,!0);P.currentNode=s;let a=P.nextNode(),o=0,l=0,c=i[0];for(;c!==void 0;){if(o===c.index){let d;c.type===2?d=new F(a,a.nextSibling,this,e):c.type===1?d=new c.ctor(a,c.name,c.strings,this,e):c.type===6&&(d=new oe(a,this,e)),this._$AV.push(d),c=i[++l]}o!==c?.index&&(a=P.nextNode(),o++)}return P.currentNode=E,s}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},F=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=g,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=I(this,e,t),D(e)?e===g||e==null||e===""?(this._$AH!==g&&this._$AR(),this._$AH=g):e!==this._$AH&&e!==z&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):ft(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==g&&D(this._$AH)?this._$AA.nextSibling.data=e:this.T(E.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=L.createElement(He(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{let a=new ie(s,this),o=a.u(this.options);a.p(t),this.T(o),this._$AH=a}}_$AC(e){let t=Oe.get(e.strings);return t===void 0&&Oe.set(e.strings,t=new L(e)),t}k(e){le(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,s=0;for(let a of e)s===t.length?t.push(i=new r(this.O(H()),this.O(H()),this,this.options)):i=t[s],i._$AI(a),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=Ee(e).nextSibling;Ee(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},R=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,a){this.type=1,this._$AH=g,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=a,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=g}_$AI(e,t=this,i,s){let a=this.strings,o=!1;if(a===void 0)e=I(this,e,t,0),o=!D(e)||e!==this._$AH&&e!==z,o&&(this._$AH=e);else{let l=e,c,d;for(e=a[0],c=0;c<a.length-1;c++)d=I(this,l[i+c],t,c),d===z&&(d=this._$AH[c]),o||=!D(d)||d!==this._$AH[c],d===g?e=g:e!==g&&(e+=(d??"")+a[c+1]),this._$AH[c]=d}o&&!s&&this.j(e)}j(e){e===g?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},se=class extends R{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===g?void 0:e}},re=class extends R{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==g)}},ae=class extends R{constructor(e,t,i,s,a){super(e,t,i,s,a),this.type=5}_$AI(e,t=this){if((e=I(this,e,t,0)??g)===z)return;let i=this._$AH,s=e===g&&i!==g||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,a=e!==g&&(i===g||s);s&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},oe=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){I(this,e)}};var xt=ne.litHtmlPolyfillSupport;xt?.(L,F),(ne.litHtmlVersions??=[]).push("3.3.2");var De=(r,e,t)=>{let i=t?.renderBefore??e,s=i._$litPart$;if(s===void 0){let a=t?.renderBefore??null;i._$litPart$=s=new F(e.insertBefore(H(),a),a,void 0,t??{})}return s._$AI(r),s};var de=globalThis,f=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=De(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return z}};f._$litElement$=!0,f.finalized=!0,de.litElementHydrateSupport?.({LitElement:f});var vt=de.litElementPolyfillSupport;vt?.({LitElement:f});(de.litElementVersions??=[]).push("4.2.2");var Le=5;async function J(){try{return(await chrome.storage.local.get({customProfiles:[]})).customProfiles||[]}catch{return[]}}async function Fe(r){let e=await J();if(e.length>=Le)throw new Error(`Maximum ${Le} custom profiles allowed`);let t={id:`custom-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,icon:"\u{1F464}",custom:!0,name:{en:r.name,tr:r.name},description:{en:r.description||"",tr:r.description||""},ageRange:r.ageRange||"25-35",techLevel:r.techLevel||"medium",disabilities:r.disabilities||[],goal:r.goal||"",priorityHeuristics:r.priorityHeuristics||[],weight:1,systemPrompt:yt(r)};return e.push(t),await chrome.storage.local.set({customProfiles:e}),t}async function pe(r){let t=(await J()).filter(i=>i.id!==r);return await chrome.storage.local.set({customProfiles:t}),t}function yt(r){let e={low:"not very comfortable with technology, prefers simple interfaces",medium:"moderately comfortable with technology, uses common apps regularly",high:"very tech-savvy, comfortable with complex interfaces and shortcuts"},t={"18-25":"a young adult (18-25) who is digitally native","25-35":"an adult (25-35) with regular internet experience","35-50":"a middle-aged adult (35-50) with moderate tech familiarity","50-65":"an older adult (50-65) who may prefer larger text and simpler layouts","65+":"a senior user (65+) who needs high contrast, large click targets, and simple navigation"},i={vision:"low vision \u2014 needs high contrast, large text, and screen reader support",hearing:"hearing impairment \u2014 relies on captions and visual cues instead of audio",motor:"motor disability \u2014 uses keyboard or switch device, needs large click targets",cognitive:"cognitive disability \u2014 needs simple language, clear structure, and minimal distractions",none:"no disabilities"},s=t[r.ageRange]||t["25-35"],a=e[r.techLevel]||e.medium,o=(r.disabilities||[]).length>0?r.disabilities.map(c=>i[c]||c).join("; "):i.none,l=r.goal||"browsing the page to accomplish a task";return`You are ${s}. You are ${a}.
Your accessibility needs: ${o}.
Your goal on this page: ${l}.

When evaluating this web page, adopt this persona fully. Consider:
- How would someone with your age, tech level, and abilities experience this page?
- Are there barriers that would prevent you from accomplishing your goal?
- Is the language, layout, and interaction design appropriate for your profile?
- Would you feel confident, confused, or frustrated using this page?

Evaluate from YOUR perspective \u2014 not as a generic user.`}var me=[{id:"product-ux",name:{en:"Product & UX Design",tr:"\xDCr\xFCn & UX Tasar\u0131m"},icon:"",focus:"Task completion speed, cognitive load, information hierarchy, interaction feedback, and design system consistency.",defaultCriteria:"Minimize friction on primary user flows, keep visual hierarchy clear, and provide immediate state feedback."},{id:"marketing-cro",name:{en:"Marketing & Growth (CRO)",tr:"Pazarlama & B\xFCy\xFCme (CRO)"},icon:"",focus:"Value proposition clarity within 5 seconds, CTA prominence, social proof, trust signals, and bounce/drop-off prevention.",defaultCriteria:"Ensure above-the-fold headline communicates clear value, primary CTA stands out, and conversion barriers are eliminated."},{id:"sales-revenue",name:{en:"Sales & Revenue",tr:"Sat\u0131\u015F & Gelir"},icon:"",focus:"Lead capture / checkout friction, pricing & package transparency, enterprise trust indicators, and objection handling.",defaultCriteria:"Reduce form fields to essential inputs, clarify pricing/tier differences, and surface risk-reversal guarantees."},{id:"legal-compliance",name:{en:"Legal, Privacy & Compliance",tr:"Hukuk, Gizlilik & Uyumluluk"},icon:"",focus:"GDPR/KVKK/CCPA consent clarity, transparent terms/fees disclosure, accessibility compliance (WCAG 2.2 AA / EAA), and zero dark patterns.",defaultCriteria:"Ensure mandatory disclosures, privacy links, consent checkboxes, and accessible controls are clearly visible and unambiguous."},{id:"engineering-qa",name:{en:"Engineering & Frontend QA",tr:"Yaz\u0131l\u0131m & Frontend QA"},icon:"",focus:"Semantic HTML landmarks, form validation states, responsive layout resilience, DOM complexity, and ARIA correctness.",defaultCriteria:"Verify all interactive controls have accessible names, forms have explicit validation states, and DOM selectors are clean."}],U="synthux_business_context_state",kt=15,wt=20,X={enabled:!1,activeContextId:"default-context",customDepartments:[],contexts:[{id:"default-context",name:"Default Product Context",companyName:"",productName:"",industry:"SaaS / Web Application",primaryGoal:"",valueProposition:"",targetAudience:"",mustHaves:[],metrics:[],departments:["product-ux","marketing-cro"],departmentNotes:{},updatedAt:new Date().toISOString()}]};function $t(r={},e=0){let t=typeof r.name=="object"&&r.name!==null?String(r.name.en||r.name.tr||`Department ${e+1}`).trim():String(r.name||`Department ${e+1}`).trim(),i=typeof r.name=="object"&&r.name!==null?String(r.name.tr||t).trim():t;return{id:String(r.id||t).toLowerCase().replace(/[^a-z0-9-_]+/g,"-").replace(/^-+|-+$/g,"")||`custom-dept-${Date.now()}`,name:{en:t,tr:i},icon:"",focus:String(r.focus||r.criteria||r.description||t).trim(),defaultCriteria:String(r.defaultCriteria||r.criteria||r.focus||"").trim(),isCustom:!0}}function ge(r={}){let e=String(r.companyName||"").trim(),t=String(r.productName||"").trim(),i=String(r.name||[e,t].filter(Boolean).join(" \u2014 ")||"Product Context").trim(),s=String(r.id||i).toLowerCase().replace(/[^a-z0-9-_]+/g,"-").replace(/^-+|-+$/g,"")||`ctx-${Date.now()}`,a=Array.isArray(r.mustHaves)?r.mustHaves.map(d=>String(d||"").trim()).filter(Boolean):typeof r.mustHaves=="string"?r.mustHaves.split(/\n|;/).map(d=>d.trim()).filter(Boolean):[],o=Array.isArray(r.metrics)?r.metrics.map(d=>{if(typeof d=="string")return d.trim();if(d&&typeof d=="object"){let h=String(d.name||d.label||d.metric||"").trim(),p=String(d.value||"").trim(),m=d.target?` (Target: ${d.target})`:"";return[h,p].filter(Boolean).join(": ")+m}return""}).filter(Boolean):typeof r.metrics=="string"?r.metrics.split(/\n|;/).map(d=>d.trim()).filter(Boolean):[],l=Array.isArray(r.departments)&&r.departments.length>0?r.departments.map(d=>String(d).trim()).filter(Boolean):["product-ux","marketing-cro"],c=r.departmentNotes&&typeof r.departmentNotes=="object"?r.departmentNotes:{};return{id:s,name:i,companyName:e,productName:t,industry:String(r.industry||"General Web / Digital Product").trim(),primaryGoal:String(r.primaryGoal||"").trim(),valueProposition:String(r.valueProposition||"").trim(),targetAudience:String(r.targetAudience||"").trim(),mustHaves:a,metrics:o,departments:l,departmentNotes:c,updatedAt:new Date().toISOString()}}var Ue=structuredClone(X);async function O(){try{if(typeof chrome<"u"&&chrome.storage?.local){let r=await chrome.storage.local.get(U);if(r?.[U]&&typeof r[U]=="object"){let e=r[U];return{enabled:!!e.enabled,activeContextId:e.activeContextId||e.contexts?.[0]?.id||"default-context",customDepartments:Array.isArray(e.customDepartments)?e.customDepartments:[],contexts:Array.isArray(e.contexts)&&e.contexts.length>0?e.contexts.map(ge):structuredClone(X.contexts)}}}}catch{}return structuredClone(Ue)}async function T(r){let e={enabled:!!r.enabled,activeContextId:r.activeContextId||r.contexts?.[0]?.id||"default-context",customDepartments:Array.isArray(r.customDepartments)?r.customDepartments.slice(0,wt):[],contexts:Array.isArray(r.contexts)&&r.contexts.length>0?r.contexts.slice(0,kt).map(ge):structuredClone(X.contexts)};Ue=structuredClone(e);try{typeof chrome<"u"&&chrome.storage?.local&&await chrome.storage.local.set({[U]:e})}catch{}return e}async function Ge(r,e={}){let t=await O(),i=ge(r),s=t.contexts.findIndex(a=>a.id===i.id);return s>=0?t.contexts[s]=i:t.contexts.unshift(i),e.setActive!==!1&&(t.activeContextId=i.id),typeof e.enabled=="boolean"&&(t.enabled=e.enabled),await T(t),{state:t,profile:i}}async function We(r){let e=await O();return e.contexts=e.contexts.filter(t=>t.id!==r),e.contexts.length===0&&(e.contexts=structuredClone(X.contexts)),e.contexts.some(t=>t.id===e.activeContextId)||(e.activeContextId=e.contexts[0].id),await T(e)}async function Ve(r){let e=await O(),t=$t(r,e.customDepartments.length);new Set(me.map(a=>a.id)).has(t.id)&&(t.id=`custom-${t.id}`);let s=e.customDepartments.findIndex(a=>a.id===t.id);return s>=0?e.customDepartments[s]=t:e.customDepartments.push(t),await T(e),{state:e,department:t}}async function qe(r){let e=await O();return e.customDepartments=e.customDepartments.filter(t=>t.id!==r),e.contexts=e.contexts.map(t=>({...t,departments:(t.departments||[]).filter(i=>i!==r)})),await T(e)}function ue(r){let e=String(r.element||"").trim().toLowerCase(),t=String(r.description||r.title||"").toLowerCase().replace(/[^a-z0-9ğüşıöç\s]/gi,"").split(/\s+/).slice(0,7).join(" ");return`${e}::${t}`}function he(r){if(!r)return[];if(r.type==="flow"&&Array.isArray(r.pages)){let t=[];return r.pages.forEach(i=>{let s=i.page?.label||i.page?.url||"Step";(i.report?.issues||[]).forEach(a=>{t.push({severity:a.severity||"moderate",element:s,description:typeof a=="string"?a:a.description||a.title||"",recommendation:a.recommendation||""})})}),(r.crossPage?.findings||[]).forEach(i=>{t.push({severity:i.severity||"moderate",element:"Cross-Page",description:`${i.title}: ${i.description}`,recommendation:""})}),t}if(Array.isArray(r.issues)&&r.issues.length>0)return r.issues;let e=new Map;return Object.values(r.profileResults||{}).forEach(t=>{(t.evaluations||[]).forEach(i=>{(i.issues||[]).forEach(s=>{let a=ue(s);e.has(a)||e.set(a,s)})})}),Array.from(e.values())}function Ke(r,e){if(!r||!e)throw new Error("Both baseReport (older) and targetReport (newer) are required for comparison.");let t=r.overallScore??r.flowScore??r.score??0,i=e.overallScore??e.flowScore??e.score??0,s=i-t,a=r.accessibilityResults?.score??null,o=e.accessibilityResults?.score??null,l=a!==null&&o!==null?o-a:null,c=r.businessAlignment?.goalAlignmentScore??null,d=e.businessAlignment?.goalAlignmentScore??null,h=c!==null&&d!==null?d-c:null,p=he(r),m=he(e),x=new Map(p.map(u=>[ue(u),u])),y=new Map(m.map(u=>[ue(u),u])),S=[],M=[],C=[];for(let[u,k]of x.entries())y.has(u)?M.push(k):S.push(k);for(let[u,k]of y.entries())x.has(u)||C.push(k);let rt=r.businessAlignment?.mustHavesAudit||[],at=(e.businessAlignment?.mustHavesAudit||[]).map(u=>{let k=rt.find(ot=>ot.item===u.item);return{item:u.item,beforeStatus:k?k.status:"untracked",afterStatus:u.status,improved:k?k.status!=="pass"&&u.status==="pass":u.status==="pass"}}),G=u=>u>0?`+${u}`:`${u}`,b=["# synthux Before vs After Audit Comparison","","| Metric | Before (Base) | After (Target) | Change (Delta) |","|:---|:---:|:---:|:---:|",`| **URL / Flow** | ${r.url||r.name||"Base"} | ${e.url||e.name||"Target"} | \u2014 |`,`| **Overall UX Score** | **${t}/100** | **${i}/100** | **${G(s)}** |`];return l!==null&&b.push(`| **Accessibility (WCAG)** | ${a}/100 | ${o}/100 | **${G(l)}** |`),h!==null&&b.push(`| **Business Goal Alignment** | ${c}/100 | ${d}/100 | **${G(h)}** |`),b.push(`| **Total Issues** | ${p.length} | ${m.length} | **${G(m.length-p.length)}** (${S.length} resolved, ${C.length} new) |`),b.push(""),S.length>0&&(b.push(`## Resolved Issues (${S.length})`),S.forEach(u=>{b.push(`- ~~**[${(u.severity||"moderate").toUpperCase()}]** ${u.description}~~ ${u.element?`(\`${u.element}\`)`:""}`)}),b.push("")),C.length>0&&(b.push(`## New / Regression Issues (${C.length})`),C.forEach(u=>{b.push(`- **[${(u.severity||"moderate").toUpperCase()}]** ${u.description} ${u.element?`(\`${u.element}\`)`:""}`)}),b.push("")),M.length>0&&(b.push(`## Persistent Issues (${M.length})`),M.forEach(u=>{b.push(`- **[${(u.severity||"moderate").toUpperCase()}]** ${u.description} ${u.element?`(\`${u.element}\`)`:""}`)}),b.push("")),{baseId:r.id||null,targetId:e.id||null,url:e.url||r.url||null,baseTimestamp:r.timestamp||null,targetTimestamp:e.timestamp||null,scores:{baseScore:t,targetScore:i,overallScoreDelta:s,baseA11y:a,targetA11y:o,accessibilityScoreDelta:l,baseGoal:c,targetGoal:d,goalAlignmentDelta:h},counts:{baseTotalIssues:p.length,targetTotalIssues:m.length,resolvedCount:S.length,newCount:C.length,persistentCount:M.length},resolvedIssues:S,newIssues:C,persistentIssues:M,mustHavesProgress:at,markdown:b.join(`
`)}}function Je(r){if(!r)return"";let e=he(r),t=e.filter(a=>a.severity==="critical"||a.priority==="high"||a.isQuickWin),i=t.length>0?t:e.slice(0,10),s=[`Please fix the following UX, Accessibility (WCAG 2.2 AA), and Business Goal issues identified by synthux on ${r.url||r.title||"this page"} (Current UX Score: ${r.overallScore??r.flowScore??0}/100):`,""];if(r.businessAlignment){let a=r.businessAlignment;s.push(`### Business & Product Goal Context (${a.goalAlignmentScore}/100)`),a.primaryGoal&&s.push(`- **Primary Goal:** ${a.primaryGoal}`);let o=(a.mustHavesAudit||[]).filter(l=>l.status!=="pass");o.length>0&&(s.push("- **Missing / Partial Non-Negotiable Must-Haves to Implement:**"),o.forEach(l=>{s.push(`  - [${l.status.toUpperCase()}] **${l.item}** -> ${l.recommendation||l.evidence}`)})),s.push("")}return s.push(`### Priority UX & Accessibility Fixes (${i.length})`),i.forEach((a,o)=>{s.push(`${o+1}. **[${(a.severity||"moderate").toUpperCase()}${a.isQuickWin?" \xB7 QUICK WIN":""}]** ${a.description}`),a.element&&s.push(`   - **Selector:** \`${a.element}\``),a.recommendation&&s.push(`   - **Required Change:** ${a.recommendation}`),a.codeFix?.after&&s.push(`   - **Suggested Code (\`${a.codeFix.language||"html"}\`):**
\`\`\`${a.codeFix.language||"html"}
${a.codeFix.after}
\`\`\``)}),r.accessibilityResults?.wcagViolations?.length>0&&(s.push(""),s.push(`### axe-core WCAG 2.2 AA Violations (${r.accessibilityResults.wcagViolations.length})`),r.accessibilityResults.wcagViolations.slice(0,6).forEach(a=>{let o=(a.nodes||[]).slice(0,2).map(l=>l.target).join(", ");s.push(`- **[${(a.impact||"serious").toUpperCase()}] ${a.help}**: ${a.description}${o?` (Targets: \`${o}\`)`:""}`)})),s.join(`
`)}var Xe=10,_=[{id:"nielsen-10",name:"Nielsen's 10 Usability Heuristics",shortName:"Nielsen 10",category:"General UX",description:"Industry-standard general usability framework by Jakob Nielsen.",file:"rules/nielsen-10.json",ruleCount:10,isBuiltIn:!0},{id:"ecommerce",name:"E-Commerce & Conversion UX",shortName:"E-Commerce",category:"E-Commerce & Retail",description:"Specialized UX rules for online stores, product pages, carts, and checkout flows.",file:"rules/ecommerce.json",ruleCount:8,isBuiltIn:!0},{id:"saas",name:"SaaS & Web Application UX",shortName:"SaaS",category:"SaaS & Dashboards",description:"Specialized UX rules for SaaS apps, dashboards, onboarding, and self-service workflows.",file:"rules/saas.json",ruleCount:8,isBuiltIn:!0},{id:"fintech",name:"Fintech, Banking & Web3 UX",shortName:"Fintech",category:"Finance & Banking",description:"High-trust financial UX rules covering transaction safety, fee transparency, and numerical legibility.",file:"rules/fintech.json",ruleCount:8,isBuiltIn:!0}],_t={"0-20":"Critical violations \u2014 severe usability barriers","21-40":"Major issues \u2014 frequent user friction and confusion","41-60":"Moderate \u2014 functional but with notable UX gaps","61-80":"Good \u2014 solid implementation with minor issues","81-100":"Excellent \u2014 best-in-class user experience"};function St(r){let e=r;if(typeof r=="string")try{e=JSON.parse(r)}catch{throw new Error("Invalid JSON syntax in rule pack.")}if(!e||typeof e!="object")throw new Error("Rule pack must be a JSON object.");let t=String(e.name||e.shortName||"").trim();if(!t)throw new Error('Rule pack must include a "name" field.');if(!Array.isArray(e.rules)||e.rules.length===0)throw new Error('Rule pack must contain a non-empty "rules" array.');if(e.rules.length>25)throw new Error("Rule pack can contain at most 25 rules.");let i=String(e.id||t).toLowerCase().replace(/[^a-z0-9-_]+/g,"-").replace(/^-+|-+$/g,"")||`custom-pack-${Date.now()}`,a=new Set(_.map(l=>l.id)).has(i)?`custom-${i}`:i,o=e.rules.map((l,c)=>{let d=typeof l.name=="object"&&l.name!==null?String(l.name.en||l.name.tr||`Rule ${c+1}`).trim():String(l.name||`Rule ${c+1}`).trim(),h=typeof l.name=="object"&&l.name!==null?String(l.name.tr||d).trim():d,p=typeof l.description=="object"&&l.description!==null?String(l.description.en||l.description.tr||d).trim():String(l.description||d).trim(),m=typeof l.description=="object"&&l.description!==null?String(l.description.tr||p).trim():p,x=String(l.id||`${a}-rule-${c+1}`).toLowerCase().replace(/[^a-z0-9-_]+/g,"-"),y=Number.isFinite(Number(l.weight))?Math.max(.1,Math.min(3,Number(l.weight))):1;return{id:x,name:{en:d,tr:h},description:{en:p,tr:m},weight:y,automated_checks:Array.isArray(l.automated_checks)?l.automated_checks:[],evaluation_guide:String(l.evaluation_guide||l.criteria?.join(", ")||p).trim(),prompt_template:String(l.prompt_template||`Evaluate this web page for '${d}'.`).trim(),scoring_rubric:l.scoring_rubric&&typeof l.scoring_rubric=="object"?l.scoring_rubric:_t}});return{id:a,name:t,shortName:String(e.shortName||t.slice(0,22)).trim(),category:String(e.category||"Custom Pack").trim(),description:String(e.description||`Custom UX rule pack (${o.length} rules)`).trim(),version:String(e.version||"1.0.0").trim(),source:String(e.source||"custom").trim(),ruleCount:o.length,isCustom:!0,rules:o}}async function Y(){try{let r=await chrome.storage.local.get("customRulePacks");return Array.isArray(r.customRulePacks)?r.customRulePacks:[]}catch{return[]}}async function Ye(){let r=await Y();return[..._,...r]}async function Qe(r){let e=St(r),t=await Y(),i=t.findIndex(s=>s.id===e.id);if(i>=0)t[i]=e;else{if(t.length>=Xe)throw new Error(`Maximum of ${Xe} custom rule packs reached.`);t.push(e)}return await chrome.storage.local.set({customRulePacks:t}),e}async function Ze(r){let t=(await Y()).filter(i=>i.id!==r);return await chrome.storage.local.set({customRulePacks:t}),t}async function et(r="nielsen-10"){try{let e=_.find(a=>a.id===r);if(e){let o=await(await fetch(chrome.runtime.getURL(e.file))).json();return{...o,id:o.id||e.id,shortName:o.shortName||e.shortName,category:o.category||e.category}}let i=(await Y()).find(a=>a.id===r);return i&&Array.isArray(i.rules)&&i.rules.length>0?i:await(await fetch(chrome.runtime.getURL("rules/nielsen-10.json"))).json()}catch(e){return console.error("[synthux] Failed to load heuristics:",e),Ct()}}function Ct(){return{name:"Nielsen's 10 Usability Heuristics",version:"1.0.0",source:"https://www.nngroup.com/articles/ten-usability-heuristics/",rules:[{id:"visibility-of-system-status",name:{en:"Visibility of System Status",tr:"Sistem Durumu G\xF6r\xFCn\xFCrl\xFC\u011F\xFC"},weight:1,scoring_rubric:{"0-20":"Critical violations","21-40":"Major issues","41-60":"Some feedback present","61-80":"Good feedback","81-100":"Excellent"}},{id:"match-real-world",name:{en:"Match Between System and Real World",tr:"Sistem-Ger\xE7ek D\xFCnya E\u015Fle\u015Fmesi"},weight:1,scoring_rubric:{"0-20":"Critical","21-40":"Major","41-60":"Moderate","61-80":"Good","81-100":"Excellent"}},{id:"user-control-freedom",name:{en:"User Control and Freedom",tr:"Kullan\u0131c\u0131 Kontrol\xFC ve \xD6zg\xFCrl\xFCk"},weight:1,scoring_rubric:{"0-20":"Critical","21-40":"Major","41-60":"Moderate","61-80":"Good","81-100":"Excellent"}},{id:"consistency-standards",name:{en:"Consistency and Standards",tr:"Tutarl\u0131l\u0131k ve Standartlar"},weight:1,scoring_rubric:{"0-20":"Critical","21-40":"Major","41-60":"Moderate","61-80":"Good","81-100":"Excellent"}},{id:"error-prevention",name:{en:"Error Prevention",tr:"Hata \xD6nleme"},weight:1,scoring_rubric:{"0-20":"Critical","21-40":"Major","41-60":"Moderate","61-80":"Good","81-100":"Excellent"}},{id:"recognition-over-recall",name:{en:"Recognition Rather Than Recall",tr:"Tan\u0131ma > Hat\u0131rlama"},weight:1,scoring_rubric:{"0-20":"Critical","21-40":"Major","41-60":"Moderate","61-80":"Good","81-100":"Excellent"}},{id:"flexibility-efficiency",name:{en:"Flexibility and Efficiency of Use",tr:"Esneklik ve Verimlilik"},weight:1,scoring_rubric:{"0-20":"Critical","21-40":"Major","41-60":"Moderate","61-80":"Good","81-100":"Excellent"}},{id:"aesthetic-minimalist",name:{en:"Aesthetic and Minimalist Design",tr:"Estetik ve Minimalist Tasar\u0131m"},weight:1,scoring_rubric:{"0-20":"Critical","21-40":"Major","41-60":"Moderate","61-80":"Good","81-100":"Excellent"}},{id:"error-recovery",name:{en:"Help Users Recognize, Diagnose, and Recover from Errors",tr:"Hata Tan\u0131ma ve Kurtarma"},weight:1,scoring_rubric:{"0-20":"Critical","21-40":"Major","41-60":"Moderate","61-80":"Good","81-100":"Excellent"}},{id:"help-documentation",name:{en:"Help and Documentation",tr:"Yard\u0131m ve Dok\xFCmantasyon"},weight:.8,scoring_rubric:{"0-20":"Critical","21-40":"Major","41-60":"Moderate","61-80":"Good","81-100":"Excellent"}}]}}var fe=class extends f{static properties={value:{type:Number},label:{type:String},size:{type:String},animated:{type:Boolean},_displayValue:{type:Number,state:!0}};static styles=v`
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
  `;constructor(){super(),this.value=0,this.label="",this.size="md",this.animated=!0,this._displayValue=0}updated(e){e.has("value")&&(this.animated?this._animateValue():this._displayValue=this.value)}_animateValue(){let e=this._displayValue||0,t=this.value||0,i=700,s=performance.now(),a=o=>{let l=Math.min((o-s)/i,1);this._displayValue=Math.round(e+(t-e)*(1-Math.pow(1-l,3))),l<1&&requestAnimationFrame(a)};requestAnimationFrame(a)}_getColorClass(){return this.value>=71?"high":this.value>=41?"mid":"low"}_getDims(){switch(this.size){case"sm":return{s:56,r:22,f:14};case"lg":return{s:110,r:46,f:28};default:return{s:80,r:34,f:20}}}render(){let e=this._getDims(),t=2*Math.PI*e.r,i=t-t*(this.value||0)/100;return n`
      <div class="score-ring" style="width:${e.s}px;height:${e.s}px;">
        <svg width="${e.s}" height="${e.s}" viewBox="0 0 ${e.s} ${e.s}">
          <circle class="ring-bg" cx="${e.s/2}" cy="${e.s/2}" r="${e.r}"/>
          <circle class="ring-fill ${this._getColorClass()}" cx="${e.s/2}" cy="${e.s/2}" r="${e.r}" stroke-dasharray="${t}" stroke-dashoffset="${i}"/>
        </svg>
        <div class="score-value">
          <span class="score-number" style="font-size:${e.f}px">${this._displayValue}</span>
          <span class="score-max">/100</span>
        </div>
      </div>
      ${this.label?n`<span class="score-label">${this.label}</span>`:""}
    `}};customElements.define("synthux-score",fe);var be=class extends f{static properties={ollamaStatus:{type:Object},isAnalyzing:{type:Boolean},progress:{type:Object},pageInfo:{type:Object},selectedProfiles:{type:Array},selectedRulePack:{type:String},rulePacks:{type:Array},mode:{type:String},logEntries:{type:Array},customProfiles:{type:Array},_packRules:{type:Array,state:!0},_showRulePackImporter:{type:Boolean,state:!0},_rulePackError:{type:String,state:!0},_showProfileForm:{type:Boolean,state:!0},_editingProfile:{type:Object,state:!0},_openMenuId:{type:String,state:!0},_selectedHeuristics:{type:Array,state:!0},_copiedCmd:{type:String,state:!0},_versionDismissed:{type:Boolean,state:!0},_showCorsWizard:{type:Boolean,state:!0},_checkingConnection:{type:Boolean,state:!0},_bizState:{type:Object,state:!0},_showBizEditor:{type:Boolean,state:!0},_editingBizNew:{type:Boolean,state:!0},_showCustomDeptForm:{type:Boolean,state:!0},_selectedDeptsDraft:{type:Array,state:!0}};static styles=v`
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
      margin-top: 8px;
      padding: 11px 12px;
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      border-radius: 10px;
      color: var(--sx-text-primary, #ededf0);
      font-family: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      text-align: left;
      transition: all 150ms ease;
    }

    .flow-btn:hover {
      border-color: var(--sx-accent, #3b82f6);
      background: rgba(59, 130, 246, 0.06);
    }

    .flow-btn-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(59, 130, 246, 0.12);
      border: 1px solid rgba(59, 130, 246, 0.24);
      color: var(--sx-accent, #3b82f6);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .flow-btn-content {
      flex: 1;
      min-width: 0;
    }

    .flow-btn-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--sx-text-primary, #ededf0);
      line-height: 1.3;
    }

    .flow-desc {
      font-size: 11px;
      font-weight: 400;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-top: 2px;
      line-height: 1.35;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .flow-btn-arrow {
      color: var(--sx-text-tertiary, #8a8a96);
      flex-shrink: 0;
      transition: transform 150ms ease, color 150ms ease;
    }

    .flow-btn:hover .flow-btn-arrow {
      color: var(--sx-accent, #3b82f6);
      transform: translateX(2px);
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

    /* ─── Instant WCAG Button in Page Card ────── */
    .page-info-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .page-info-meta {
      min-width: 0;
      flex: 1;
    }

    .instant-wcag-btn {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      height: 28px;
      padding: 0 10px;
      border-radius: 6px;
      border: 1px solid rgba(34, 197, 94, 0.28);
      background: rgba(34, 197, 94, 0.10);
      color: #22c55e;
      font-size: 11px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 150ms ease;
      white-space: nowrap;
    }

    .instant-wcag-btn:hover:not(:disabled) {
      background: rgba(34, 197, 94, 0.18);
      border-color: #22c55e;
    }

    .instant-wcag-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    /* ─── Business, Goal & Department Context Card ─── */
    .biz-card {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 18px;
      transition: border-color 150ms ease;
    }

    .biz-card.enabled {
      border-color: rgba(59, 130, 246, 0.38);
      background: linear-gradient(180deg, rgba(59,130,246,0.06), rgba(28,28,31,0.95));
    }

    .biz-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .biz-title-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .biz-icon-box {
      width: 28px;
      height: 28px;
      border-radius: 7px;
      background: rgba(59, 130, 246, 0.10);
      border: 1px solid rgba(59, 130, 246, 0.22);
      color: var(--sx-accent, #3b82f6);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .biz-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--sx-text-primary, #ededf0);
      line-height: 1.3;
    }

    .biz-sub {
      font-size: 11px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-top: 2px;
      line-height: 1.35;
    }

    .biz-switch {
      position: relative;
      width: 36px;
      height: 20px;
      background: rgba(255,255,255,0.1);
      border-radius: 10px;
      border: none;
      cursor: pointer;
      flex-shrink: 0;
      padding: 0;
      transition: background 180ms ease;
    }

    .biz-switch::after {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #8a8a96;
      transition: transform 180ms ease, background 180ms ease;
    }

    .biz-switch.on {
      background: rgba(59, 130, 246, 0.3);
    }

    .biz-switch.on::after {
      transform: translateX(16px);
      background: #3b82f6;
    }

    .biz-controls-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 10px;
    }

    .biz-select {
      flex: 1;
      min-width: 0;
      height: 30px;
      padding: 0 26px 0 9px;
      border-radius: 6px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      background-color: var(--sx-bg-primary, #111113);
      color: var(--sx-text-primary, #ededf0);
      font-size: 11px;
      font-family: inherit;
      outline: none;
      cursor: pointer;
      -webkit-appearance: none;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a8a96' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 8px center;
    }

    .biz-select:focus {
      border-color: var(--sx-accent, #3b82f6);
    }

    .biz-mini-btn {
      height: 30px;
      padding: 0 10px;
      border-radius: 6px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      background: var(--sx-bg-tertiary, #202024);
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 11px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      white-space: nowrap;
      transition: all 150ms ease;
    }

    .biz-mini-btn:hover {
      border-color: var(--sx-accent, #3b82f6);
      color: var(--sx-text-primary, #ededf0);
    }

    .biz-summary-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 9px;
    }

    .biz-pill {
      font-size: 10px;
      font-weight: 500;
      padding: 3px 8px;
      border-radius: 6px;
      background: rgba(255,255,255,0.04);
      color: var(--sx-text-secondary, #b4b4bc);
      border: 1px solid rgba(255,255,255,0.06);
    }

    .biz-editor {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .dept-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 4px;
    }

    .dept-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      background: var(--sx-bg-primary, #111113);
      color: var(--sx-text-tertiary, #8a8a96);
      transition: all 150ms ease;
    }

    .dept-chip.active {
      border-color: var(--sx-accent, #3b82f6);
      background: rgba(59,130,246,0.12);
      color: var(--sx-text-primary, #ededf0);
    }

    .dept-del {
      font-size: 9px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-left: 2px;
      padding: 0 2px;
    }

    .dept-del:hover {
      color: var(--sx-error, #ef4444);
    }
  `;constructor(){super(),this.ollamaStatus={connected:!1,models:[]},this.isAnalyzing=!1,this.progress=null,this.pageInfo=null,this.selectedProfiles=["first-time","power-user","accessibility"],this.selectedRulePack="nielsen-10",this.rulePacks=[..._],this.mode="deep",this.logEntries=[],this.customProfiles=[],this._packRules=[],this._showRulePackImporter=!1,this._rulePackError="",this._showProfileForm=!1,this._editingProfile=null,this._openMenuId=null,this._selectedHeuristics=[],this._copiedCmd=null,this._versionDismissed=!1,this._showCorsWizard=!1,this._checkingConnection=!1,this._bizState={enabled:!1,activeContextId:"default-context",customDepartments:[],contexts:[]},this._showBizEditor=!1,this._editingBizNew=!1,this._showCustomDeptForm=!1,this._selectedDeptsDraft=["product-ux","marketing-cro"],this._fetchPageInfo(),this._loadCustomProfiles(),this._loadSettings(),this._loadRulePacks(),this._loadBusinessContext(),chrome.tabs?.onActivated?.addListener(()=>this._fetchPageInfo()),chrome.tabs?.onUpdated?.addListener((e,t)=>{t.status==="complete"&&this._fetchPageInfo()}),window.addEventListener("profiles-changed",()=>this._loadCustomProfiles()),window.addEventListener("business-context-changed",()=>this._loadBusinessContext()),chrome.storage?.onChanged?.addListener(e=>{e.synthux_business_context_state&&this._loadBusinessContext()}),this._onDocClick=()=>{this._openMenuId=null},document.addEventListener("click",this._onDocClick)}async _loadBusinessContext(){try{this._bizState=await O();let e=this._activeBizProfile;e&&(this._selectedDeptsDraft=[...e.departments||["product-ux","marketing-cro"]])}catch{}}get _activeBizProfile(){let e=this._bizState?.contexts||[];return e.find(t=>t.id===this._bizState?.activeContextId)||e[0]||null}get _allDepartmentsList(){return[...me,...this._bizState?.customDepartments||[]]}async _toggleBusinessContextEnabled(){if(this.isAnalyzing)return;let e=!this._bizState?.enabled;this._bizState=await T({...this._bizState,enabled:e})}async _selectBusinessContext(e){let t=e.target.value;this._bizState=await T({...this._bizState,activeContextId:t});let i=this._activeBizProfile;i&&(this._selectedDeptsDraft=[...i.departments||["product-ux","marketing-cro"]])}_openBizEditor(e=!1){this._editingBizNew=e,this._showBizEditor=!0;let t=e?null:this._activeBizProfile;this._selectedDeptsDraft=t?.departments?.length?[...t.departments]:["product-ux","marketing-cro"]}_toggleDraftDept(e){let t=[...this._selectedDeptsDraft||[]],i=t.indexOf(e);i>=0?t.length>1&&t.splice(i,1):t.push(e),this._selectedDeptsDraft=t}async _handleSaveBizContext(){let e=this.shadowRoot;if(!e)return;let t=this._editingBizNew?null:this._activeBizProfile,i=e.getElementById("biz-company")?.value?.trim()||"",s=e.getElementById("biz-product")?.value?.trim()||"",a=e.getElementById("biz-industry")?.value?.trim()||"SaaS / Web Application",o=e.getElementById("biz-goal")?.value?.trim()||"",l=e.getElementById("biz-valprop")?.value?.trim()||"",c=(e.getElementById("biz-musts")?.value||"").split(`
`).map(p=>p.trim()).filter(Boolean),d=(e.getElementById("biz-metrics")?.value||"").split(`
`).map(p=>p.trim()).filter(Boolean),{state:h}=await Ge({id:t?.id||void 0,name:[i,s].filter(Boolean).join(" \u2014 ")||o.slice(0,32)||"Company Context",companyName:i,productName:s,industry:a,primaryGoal:o,valueProposition:l,mustHaves:c,metrics:d,departments:this._selectedDeptsDraft},{setActive:!0,enabled:!0});this._bizState=h,this._showBizEditor=!1,this._editingBizNew=!1}async _handleDeleteBizContext(){let e=this._activeBizProfile;e&&(this._bizState=await We(e.id),this._showBizEditor=!1)}async _handleAddCustomDepartment(){let e=this.shadowRoot,t=e?.getElementById("cdept-name")?.value?.trim(),i=e?.getElementById("cdept-focus")?.value?.trim()||"";if(!t)return;let{state:s,department:a}=await Ve({name:t,icon:"",focus:i||t,defaultCriteria:i||t});this._bizState=s,this._selectedDeptsDraft.includes(a.id)||(this._selectedDeptsDraft=[...this._selectedDeptsDraft,a.id]),this._showCustomDeptForm=!1}async _handleDeleteCustomDept(e,t){e.stopPropagation(),this._bizState=await qe(t),this._selectedDeptsDraft=this._selectedDeptsDraft.filter(i=>i!==t)}async _startInstantWcagAudit(){if(!(this.isAnalyzing||!this._isAnalyzablePage)){this.dispatchEvent(new CustomEvent("analysis-start"));try{await chrome.runtime.sendMessage({type:"START_ANALYSIS",payload:{mode:"wcag-only",rulePackId:this.selectedRulePack||"nielsen-10",profiles:["accessibility"]}})}catch{this.dispatchEvent(new CustomEvent("analysis-end"))}}}async _loadSettings(){try{let e=await chrome.storage.local.get({synthux_selected_profiles:["first-time","power-user","accessibility"],synthux_selected_mode:"deep",rulePackId:"nielsen-10"});this.selectedProfiles=e.synthux_selected_profiles,this.mode=e.synthux_selected_mode,this.selectedRulePack=e.rulePackId||"nielsen-10",await this._loadActivePackRules(this.selectedRulePack),this.requestUpdate()}catch{}}async _loadRulePacks(){try{this.rulePacks=await Ye(),await this._loadActivePackRules(this.selectedRulePack)}catch{this.rulePacks=[..._]}}async _loadActivePackRules(e){try{let t=await et(e);this._packRules=Array.isArray(t?.rules)?t.rules:[]}catch{this._packRules=[]}}async _selectRulePack(e){this.isAnalyzing||(this.selectedRulePack=e,this._selectedHeuristics=[],await chrome.storage.local.set({rulePackId:e}),await this._loadActivePackRules(e))}async _handleRulePackFileUpload(e){let t=e.target.files?.[0];if(t)try{let i=await t.text(),s=this.shadowRoot?.getElementById("pack-json-input");s&&(s.value=i),this._rulePackError=""}catch(i){this._rulePackError="Failed to read file: "+i.message}}async _handleSaveCustomRulePack(){let e=this.shadowRoot?.getElementById("pack-json-input")?.value?.trim();if(!e){this._rulePackError="Please upload a .json file or paste JSON content.";return}try{let t=await Qe(e);this._rulePackError="",this._showRulePackImporter=!1,await this._loadRulePacks(),await this._selectRulePack(t.id)}catch(t){this._rulePackError=t.message||"Invalid rule pack JSON."}}async _handleDeleteCustomRulePack(e,t){if(e.stopPropagation(),!this.isAnalyzing)try{await Ze(t),this.selectedRulePack===t&&await this._selectRulePack("nielsen-10"),await this._loadRulePacks()}catch(i){console.error("[synthux] Failed to delete rule pack:",i)}}_downloadSamplePackTemplate(){let e={id:"my-custom-ux-pack",name:"Custom Healthcare UX Pack",shortName:"Healthcare",category:"Healthcare & Patient Portals",description:"Custom UX evaluation rules for patient portals and telemedicine apps.",version:"1.0.0",rules:[{id:"patient-clarity",name:{en:"Plain Medical Language & Clarity",tr:"Anla\u015F\u0131l\u0131r T\u0131bbi Dil ve Netlik"},description:{en:"Medical terms, appointment instructions, and test results should be explained in plain, empathetic language.",tr:"T\u0131bbi terimler, randevu talimatlar\u0131 ve sonu\xE7lar sade ve anla\u015F\u0131l\u0131r bir dille a\xE7\u0131klanmal\u0131d\u0131r."},weight:1.2,evaluation_guide:"Look for plain-language explanations, clear next steps for patients, and readable typography."},{id:"booking-simplicity",name:{en:"Frictionless Appointment Booking",tr:"Kolay Randevu Alma Deneyimi"},description:{en:"Patients should be able to find providers, check availability, and book or reschedule appointments with minimal steps.",tr:"Hastalar doktorlar\u0131, uygun saatleri ve randevu ad\u0131mlar\u0131n\u0131 en az t\u0131klamayla tamamlayabilmelidir."},weight:1,evaluation_guide:"Look for clear CTAs, visible calendar/schedule availability, and accessible form controls."}]},t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),i=URL.createObjectURL(t),s=document.createElement("a");s.href=i,s.download="synthux-rulepack-template.json",s.click(),URL.revokeObjectURL(i)}updated(e){if(e.has("progress")&&this.progress&&this._addLogEntry(this.progress),e.has("isAnalyzing")){if(this.isAnalyzing)this.logEntries=[{time:this._logTime(),msg:"Starting analysis...",done:!1}];else if(this.logEntries.length>0){let i={...this.logEntries[this.logEntries.length-1],done:!0};this.logEntries=[...this.logEntries.slice(0,-1),i,{time:this._logTime(),msg:"Done.",done:!0}]}}let t=this.shadowRoot?.getElementById("terminal-log");t&&(t.scrollTop=t.scrollHeight)}_addLogEntry(e){let t=e.message||"";if(!t)return;let i=this.logEntries[this.logEntries.length-1];i&&i.msg===t||(this.logEntries=[...this.logEntries,{time:this._logTime(),msg:t,done:!1}])}_logTime(){let e=new Date;return`${String(e.getHours()).padStart(2,"0")}:${String(e.getMinutes()).padStart(2,"0")}:${String(e.getSeconds()).padStart(2,"0")}`}get _isAnalyzablePage(){let e=this.pageInfo?.url||"";return!e.startsWith("http://")&&!e.startsWith("https://")?!1:!["chromewebstore.google.com","chrome.google.com/webstore","microsoftedge.microsoft.com/addons","addons.mozilla.org"].some(i=>e.includes(i))}get _isCloudProvider(){return(this.ollamaStatus?.provider||"ollama")!=="ollama"}get _allHeuristics(){return this._packRules&&this._packRules.length>0?this._packRules:[{id:"visibility-of-system-status",name:{en:"Visibility of System Status"}},{id:"match-real-world",name:{en:"Match Real World"}},{id:"user-control-freedom",name:{en:"User Control & Freedom"}},{id:"consistency-standards",name:{en:"Consistency & Standards"}},{id:"error-prevention",name:{en:"Error Prevention"}},{id:"recognition-over-recall",name:{en:"Recognition > Recall"}},{id:"flexibility-efficiency",name:{en:"Flexibility & Efficiency"}},{id:"aesthetic-minimalist",name:{en:"Aesthetic & Minimalist"}},{id:"error-recovery",name:{en:"Error Recovery"}},{id:"help-documentation",name:{en:"Help & Documentation"}}]}_toggleHeuristic(e){if(this.isAnalyzing)return;let t=[...this._selectedHeuristics],i=t.indexOf(e);i>-1?t.splice(i,1):t.push(e),this._selectedHeuristics=t}_estimateTime(e){let t=this.selectedProfiles?.length||1,i=this._isCloudProvider?.5:4,s=Math.round(e*t*i);return s<1?"<1 min":s>=60?`${Math.round(s/60)}h ${s%60}min`:`${s} min`}async _fetchPageInfo(){if(!this.isAnalyzing)try{let[e]=await chrome.tabs.query({active:!0,currentWindow:!0});e&&(this.pageInfo={title:e.title||"Untitled",url:e.url||""})}catch{this.pageInfo={title:"Unable to detect page",url:""}}}async _loadCustomProfiles(){try{this.customProfiles=await J()}catch{this.customProfiles=[]}}_toggleProfile(e){if(this.isAnalyzing)return;let t=[...this.selectedProfiles],i=t.indexOf(e);i>-1?t.length>1&&t.splice(i,1):t.push(e),this.selectedProfiles=t,chrome.storage.local.set({synthux_selected_profiles:t})}_setMode(e){this.isAnalyzing||(this.mode=e,chrome.storage.local.set({synthux_selected_mode:e}))}async _startAnalysis(){if(!(this.isAnalyzing||!this.ollamaStatus?.connected)){this.dispatchEvent(new CustomEvent("analysis-start"));try{await chrome.runtime.sendMessage({type:"START_ANALYSIS",payload:{mode:this.mode,rulePackId:this.selectedRulePack||"nielsen-10",profiles:this.selectedProfiles,...this.mode==="custom"&&this._selectedHeuristics.length>0?{heuristics:this._selectedHeuristics}:{}}})}catch(e){console.error("[synthux] Failed to start analysis:",e),this.dispatchEvent(new CustomEvent("analysis-end"))}}}async _cancelAnalysis(){try{await chrome.runtime.sendMessage({type:"CANCEL_ANALYSIS"})}catch{}this.dispatchEvent(new CustomEvent("analysis-end"))}_renderProfileCard(e,t,i,s=!1){let a=this.selectedProfiles.includes(e);return n`
      <div 
        class="profile-card ${a?"selected":""}"
        @click="${()=>this._toggleProfile(e)}"
        role="checkbox"
        aria-checked="${a}"
        tabindex="0"
        @keydown="${o=>o.key==="Enter"&&this._toggleProfile(e)}"
      >
        <div class="profile-details">
          <div class="profile-name">${t}${s?n`<span style="font-size: 9px; background: var(--sx-blue-dim, rgba(0,126,255,0.1)); color: var(--sx-blue, #007eff); padding: 1px 6px; border-radius: 8px; margin-left: 6px; font-weight: 600; vertical-align: middle;">Custom</span>`:""}</div>
          <div class="profile-desc">${i}</div>
        </div>
        ${s?n`
          <div class="profile-actions">
            <button class="kebab-btn" @click="${o=>{o.stopPropagation(),this._openMenuId=this._openMenuId===e?null:e}}" title="Options">⋮</button>
            ${this._openMenuId===e?n`
              <div class="profile-dropdown">
                <button class="dropdown-item" @click="${o=>{o.stopPropagation(),this._openMenuId=null,this._editProfile(e)}}">Edit</button>
                <button class="dropdown-item danger" @click="${o=>{o.stopPropagation(),this._openMenuId=null,this._removeProfile(e)}}">Delete</button>
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
            ${[["vision","Low Vision"],["hearing","Hearing"],["motor","Motor"],["cognitive","Cognitive"]].map(([t,i])=>n`
              <label class="pf-check-label">
                <input type="checkbox" class="pf-disability" value="${t}" ?checked="${(e?.disabilities||[]).includes(t)}" />
                ${i}
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
    `}_editProfile(e){let t=this.customProfiles.find(i=>i.id===e);t&&(this._editingProfile=t,this._showProfileForm=!0)}async _removeProfile(e){try{await pe(e),this.selectedProfiles=this.selectedProfiles.filter(t=>t!==e),await this._loadCustomProfiles()}catch(t){console.error("[synthux] Failed to delete profile:",t)}}async _handleSaveProfile(){let e=this.shadowRoot.getElementById("pf-name")?.value?.trim();if(!e)return;let t=this.shadowRoot.getElementById("pf-age")?.value||"25-35",i=this.shadowRoot.getElementById("pf-tech")?.value||"medium",s=this.shadowRoot.getElementById("pf-goal")?.value?.trim()||"",a=Array.from(this.shadowRoot.querySelectorAll(".pf-disability:checked")).map(o=>o.value);try{this._editingProfile&&await pe(this._editingProfile.id);let o=await Fe({name:e,description:`${t}, ${i} tech${s?` \u2014 ${s}`:""}`,ageRange:t,techLevel:i,disabilities:a,goal:s,priorityHeuristics:[]});if(this._editingProfile){let l=this.selectedProfiles.indexOf(this._editingProfile.id);if(l>-1){let c=[...this.selectedProfiles];c[l]=o.id,this.selectedProfiles=c}}this._showProfileForm=!1,this._editingProfile=null,await this._loadCustomProfiles()}catch(o){console.error("[synthux] Failed to save profile:",o)}}_renderBusinessContextCard(){let e=!!this._bizState?.enabled,t=this._bizState?.contexts||[],i=this._activeBizProfile,s=this._allDepartmentsList,a=this._editingBizNew?{}:i||{};return n`
      <div class="section-header-row" style="margin-top: 4px;">
        <div class="section-header" style="margin-bottom:0;">Business &amp; Goal Context</div>
        <span style="font-size:10px;color:${e?"var(--sx-accent,#3b82f6)":"var(--sx-text-tertiary,#8a8a96)"};font-weight:600;">
          ${e?"Active":"Optional (Off)"}
        </span>
      </div>
      <div class="biz-card ${e?"enabled":""}" style="margin-top:8px;">
        <div class="biz-top">
          <div class="biz-title-wrap">
            <div class="biz-icon-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
            </div>
            <div>
              <div class="biz-title">Company, Must-Haves &amp; Departments</div>
              <div class="biz-sub">Evaluate against product goals, metrics &amp; non-negotiables</div>
            </div>
          </div>
          <button
            class="biz-switch ${e?"on":""}"
            @click="${this._toggleBusinessContextEnabled}"
            title="${e?"Business Context is ON \u2014 click to disable":"Enable Business & Goal Context in analysis"}"
          ></button>
        </div>

        <div class="biz-controls-row">
          <select class="biz-select" @change="${this._selectBusinessContext}" .value="${i?.id||""}">
            ${t.map(o=>n`<option value="${o.id}" ?selected="${o.id===i?.id}">${o.name}</option>`)}
          </select>
          <button class="biz-mini-btn" @click="${()=>{this._showBizEditor=!this._showBizEditor,this._editingBizNew=!1}}" title="Edit selected context">
            ${this._showBizEditor&&!this._editingBizNew?"Close":"Edit"}
          </button>
          <button class="biz-mini-btn" @click="${()=>this._openBizEditor(!0)}" title="Create new company/product context">+ New</button>
        </div>

        ${i&&!this._showBizEditor?n`
          <div class="biz-summary-pills">
            ${i.primaryGoal?n`<span class="biz-pill">Goal: ${i.primaryGoal.slice(0,32)}${i.primaryGoal.length>32?"\u2026":""}</span>`:""}
            <span class="biz-pill">${(i.mustHaves||[]).length} Must-Haves</span>
            <span class="biz-pill">${(i.departments||[]).length} Departments</span>
            ${(i.metrics||[]).length>0?n`<span class="biz-pill">${i.metrics.length} Metrics</span>`:""}
          </div>
        `:""}

        ${this._showBizEditor?n`
          <div class="biz-editor">
            <div class="pf-row">
              <div class="pf-field">
                <label class="pf-label">Company / Brand</label>
                <input type="text" class="pf-input" id="biz-company" placeholder="e.g. Acme Corp" .value="${a.companyName||""}" />
              </div>
              <div class="pf-field">
                <label class="pf-label">Product / Project</label>
                <input type="text" class="pf-input" id="biz-product" placeholder="e.g. Checkout Flow" .value="${a.productName||""}" />
              </div>
            </div>
            <div class="pf-row">
              <div class="pf-field">
                <label class="pf-label">Industry / Sector</label>
                <input type="text" class="pf-input" id="biz-industry" placeholder="e.g. B2B SaaS / Fintech / E-Commerce" .value="${a.industry||"SaaS / Web Application"}" />
              </div>
              <div class="pf-field">
                <label class="pf-label">Value Proposition</label>
                <input type="text" class="pf-input" id="biz-valprop" placeholder="e.g. 5-min no-code setup" .value="${a.valueProposition||""}" />
              </div>
            </div>
            <div class="pf-field">
              <label class="pf-label">Primary Page / Flow Goal *</label>
              <input type="text" class="pf-input" id="biz-goal" placeholder="e.g. Convert free trial signups without credit card friction" .value="${a.primaryGoal||""}" />
            </div>
            <div class="pf-field">
              <label class="pf-label">Non-Negotiable Must-Haves (1 per line)</label>
              <textarea class="pack-textarea" id="biz-musts" style="min-height:56px;" placeholder="Free trial CTA visible above the fold&#10;No credit card required badge next to CTA&#10;GDPR / KVKK consent &amp; trust logos visible">${(a.mustHaves||[]).join(`
`)}</textarea>
            </div>
            <div class="pf-field">
              <label class="pf-label">Marketing &amp; Usage Metrics / Bottlenecks (1 per line)</label>
              <textarea class="pack-textarea" id="biz-metrics" style="min-height:46px;" placeholder="Bounce Rate: 68%&#10;Cart Abandonment: 74%&#10;Mobile Signup Conversion: 1.2%">${(a.metrics||[]).join(`
`)}</textarea>
            </div>
            <div class="pf-field">
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <label class="pf-label">Department Lenses (Select or Add Custom)</label>
                <button class="pack-import-link" @click="${()=>{this._showCustomDeptForm=!this._showCustomDeptForm}}">
                  ${this._showCustomDeptForm?"Close":"+ Add Department"}
                </button>
              </div>
              <div class="dept-chips">
                ${s.map(o=>{let l=(this._selectedDeptsDraft||[]).includes(o.id);return n`
                    <button class="dept-chip ${l?"active":""}" @click="${()=>this._toggleDraftDept(o.id)}" title="${o.focus||""}">
                      <span>${o.name?.en||o.name}</span>
                      ${o.isCustom?n`
                        <span class="dept-del" title="Remove custom department" @click="${c=>this._handleDeleteCustomDept(c,o.id)}">×</span>
                      `:""}
                    </button>
                  `})}
              </div>
            </div>

            ${this._showCustomDeptForm?n`
              <div style="background:rgba(0,0,0,0.25);padding:8px;border-radius:6px;border:1px solid var(--sx-border,rgba(255,255,255,0.06));display:flex;flex-direction:column;gap:6px;">
                <div style="font-size:10px;font-weight:600;color:var(--sx-accent,#3b82f6);">New Custom Department</div>
                <input type="text" class="pf-input" id="cdept-name" placeholder="Department Name (e.g. Brand &amp; SEO)" />
                <input type="text" class="pf-input" id="cdept-focus" placeholder="Department criteria &amp; focus (e.g. Tone consistency, heading SEO, trust)" />
                <div class="pf-actions">
                  <button class="pf-save" @click="${this._handleAddCustomDepartment}">Add Department</button>
                  <button class="pf-cancel" @click="${()=>{this._showCustomDeptForm=!1}}">Cancel</button>
                </div>
              </div>
            `:""}

            <div class="pf-actions" style="margin-top:4px;">
              <button class="pf-save" @click="${this._handleSaveBizContext}">Save &amp; Enable Context</button>
              ${!this._editingBizNew&&t.length>1?n`
                <button class="pf-cancel" style="color:var(--sx-error,#ef4444);" @click="${this._handleDeleteBizContext}">Delete</button>
              `:""}
              <button class="pf-cancel" @click="${()=>{this._showBizEditor=!1,this._editingBizNew=!1}}">Cancel</button>
            </div>
          </div>
        `:""}
      </div>
    `}render(){let e=this.ollamaStatus?.connected,t=this.mode!=="custom"||this._selectedHeuristics.length>0,i=e&&this._isAnalyzablePage&&this.selectedProfiles.length>0&&t;return n`
      ${this.pageInfo?n`
        <div class="page-info">
          <div class="page-info-top">
            <div class="page-info-meta">
              <div class="page-title">${this.pageInfo.title}</div>
              <div class="page-url">${this.pageInfo.url}</div>
            </div>
            <button
              class="instant-wcag-btn"
              ?disabled="${this.isAnalyzing||!this._isAnalyzablePage}"
              @click="${this._startInstantWcagAudit}"
              title="Run 1-second deterministic WCAG 2.2 AA &amp; DOM health audit (No AI wait)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <span>Instant WCAG</span>
            </button>
          </div>
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
        ${this.customProfiles.map(s=>this._renderProfileCard(s.id,`${s.name.en}`,s.description?.en||"Custom profile",!0))}
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
        ${(this.rulePacks||_).map(s=>{let a=(this.selectedRulePack||"nielsen-10")===s.id,o=s.ruleCount||s.rules?.length||10;return n`
            <button
              class="rule-pack-card ${a?"active":""}"
              @click="${()=>this._selectRulePack(s.id)}"
              title="${s.description||s.name}"
            >
              <div class="rule-pack-top">
                <span class="rule-pack-name">${s.shortName||s.name}</span>
                <div style="display:flex;align-items:center;gap:3px;">
                  <span class="rule-pack-count">${o}</span>
                  ${s.isCustom?n`
                    <span
                      class="rule-pack-del"
                      title="Delete custom rule pack"
                      @click="${l=>this._handleDeleteCustomRulePack(l,s.id)}"
                    >✕</span>
                  `:""}
                </div>
              </div>
              <span class="rule-pack-cat">${s.category||"UX Rules"}</span>
            </button>
          `})}
      </div>
      ${(()=>{let s=(this.rulePacks||_).find(a=>a.id===(this.selectedRulePack||"nielsen-10"));return s?.description?n`<div class="rule-pack-desc-bar">${s.description}</div>`:""})()}

      ${this._renderBusinessContextCard()}

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
          ${this._allHeuristics.map(s=>{let a=this._selectedHeuristics.includes(s.id);return n`
              <button
                style="
                  padding: 4px 10px; font-size: 11px; border-radius: 12px; cursor: pointer;
                  font-family: inherit; transition: all 0.15s; border: 1px solid;
                  background: ${a?"var(--sx-accent-dim, rgba(59,130,246,0.1))":"var(--sx-bg-card, #1c1c1f)"};
                  border-color: ${a?"var(--sx-accent, #3b82f6)":"var(--sx-border, rgba(255,255,255,0.06))"};
                  color: ${a?"var(--sx-accent, #3b82f6)":"var(--sx-text-tertiary, #8a8a96)"};
                "
                @click="${()=>this._toggleHeuristic(s.id)}"
              >${s.name?.en||s.id}</button>
            `})}
        </div>
      `:""}

      ${this.isAnalyzing?n`
        <button class="analyze-btn analyzing" disabled>Analyzing...</button>
      `:n`
        <button 
          class="analyze-btn"
          ?disabled="${!i}"
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
              ${this.logEntries.map((s,a)=>n`
                <div class="log-line">
                  <span class="log-time">${s.time}</span>
                  <span class="log-prefix">▶</span>
                  <span class="log-msg ${a===this.logEntries.length-1?"active":""} ${s.done?"success":""}">${s.msg}</span>
                </div>
              `)}
            </div>
          </div>

          <button class="cancel-btn" @click="${this._cancelAnalysis}">Cancel</button>
        </div>
      `:""}

      <div class="section-header" style="margin-top: 20px;">Multi-Page Journey Studio</div>
      <button
        class="flow-btn"
        @click="${this._openFlowBuilder}"
      >
        <div class="flow-btn-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="7" height="6" rx="1.5"></rect>
            <rect x="15" y="14" width="7" height="6" rx="1.5"></rect>
            <path d="M9 7h3a2 2 0 0 1 2 2v6a2 2 0 0 0 2 2h-1"></path>
          </svg>
        </div>
        <div class="flow-btn-content">
          <div class="flow-btn-title">Flow Builder</div>
          <div class="flow-desc">Visual canvas, open tabs &amp; business goal flows</div>
        </div>
        <svg class="flow-btn-arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    `}_openFlowBuilder(){let e=this.pageInfo?.url||"",t=this.pageInfo?.title||"",i=chrome.runtime.getURL("flow/index.html");e&&(e.startsWith("http://")||e.startsWith("https://"))&&(i+=`?url=${encodeURIComponent(e)}&title=${encodeURIComponent(t)}`),chrome.tabs.create({url:i})}async _copyCmd(e,t){try{await navigator.clipboard.writeText(e),this._copiedCmd=t,setTimeout(()=>{this._copiedCmd=null},2e3)}catch{this._copiedCmd=t,setTimeout(()=>{this._copiedCmd=null},2e3)}}async _checkConnection(){this._checkingConnection=!0;try{(await chrome.runtime.sendMessage({type:"CHECK_CONNECTION"}))?.connected&&(this._showCorsWizard=!1,this.dispatchEvent(new CustomEvent("connection-fixed",{bubbles:!0,composed:!0})))}catch{}this._checkingConnection=!1}_renderCorsWizard(){let e=this._detectPlatform(),t=e.cmd,i=this._checkingConnection;return n`
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
          ?disabled="${i}"
          @click="${this._checkConnection}"
        >${i?"Checking...":"Check Connection"}</button>
        ${e.others.length>0?n`
          <details class="cors-other-platforms">
            <summary>Other platforms</summary>
            ${e.others.map(s=>n`
              <div class="cors-platform-alt">
                <span class="cors-platform-label">${s.name}</span>
                <code class="cors-platform-cmd">${s.cmd}</code>
                <button
                  class="cors-copy-btn ${this._copiedCmd===s.id?"copied":""}"
                  @click="${()=>this._copyCmd(s.cmd,s.id)}"
                >${this._copiedCmd===s.id?"Copied":"Copy"}</button>
              </div>
            `)}
          </details>
        `:""}
      </div>
    `}_detectPlatform(){let e=navigator.userAgent.toLowerCase(),t=e.includes("mac"),i=e.includes("win"),s={mac:{name:"macOS",id:"macos",cmd:'launchctl setenv OLLAMA_ORIGINS "*"',note:null},linux:{name:"Linux",id:"linux",cmd:"sudo systemctl edit ollama",note:'Add this line under [Service]: Environment="OLLAMA_ORIGINS=*"'},win:{name:"Windows",id:"win",cmd:'[Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", "User")',note:"Run in PowerShell as Administrator"}},a,o;return t?(a=s.mac,o=[s.linux,s.win]):i?(a=s.win,o=[s.mac,s.linux]):(a=s.linux,o=[s.mac,s.win]),{...a,others:o}}};customElements.define("synthux-scanner",be);var xe=class extends f{static properties={report:{type:Object},history:{type:Array},showHistory:{type:Boolean},activeProfile:{type:String},expandedHeuristic:{type:String},expandAllHeuristics:{type:Boolean},issueSearch:{type:String},copied:{type:Boolean},copiedMdClip:{type:Boolean},copiedFixPrompt:{type:Boolean},activeFilter:{type:String},copiedFix:{type:String},heatmapActive:{type:Boolean},historySearch:{type:String},compareMode:{type:Boolean},compareIds:{type:Array},comparisonResult:{type:Object},copiedDiffMd:{type:Boolean}};static styles=v`
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

    .export-actions {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
    }

    .export-btn {
      width: 100%;
      height: 34px;
      padding: 0 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      border-radius: 6px;
      background: var(--sx-bg-card, #1c1c1f);
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
      white-space: nowrap;
      box-sizing: border-box;
    }

    .export-btn svg {
      flex-shrink: 0;
    }

    .export-btn:hover {
      border-color: var(--sx-border-hover, rgba(255,255,255,0.14));
      color: var(--sx-text-primary, #ededf0);
      background: var(--sx-bg-tertiary, #202024);
    }

    .export-btn.copied {
      color: var(--sx-success, #22c55e);
      border-color: rgba(34, 197, 94, 0.25);
    }

    .export-btn.pdf {
      border-color: rgba(59,130,246,0.28);
      color: var(--sx-accent, #3b82f6);
      background: rgba(59,130,246,0.06);
    }

    .export-btn.pdf:hover {
      background: rgba(59,130,246,0.12);
      border-color: var(--sx-accent, #3b82f6);
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

    /* ─── v2.2 KPI Strip, Business Context, Matrix & Diff ─── */
    .kpi-strip {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
      gap: 6px;
      margin-bottom: 14px;
    }

    .kpi-card {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 8px;
      padding: 8px 6px;
      text-align: center;
    }

    .kpi-val {
      font-size: 15px;
      font-weight: 700;
      color: var(--sx-text-primary, #ededf0);
    }

    .kpi-val.high { color: var(--sx-success, #22c55e); }
    .kpi-val.mid { color: var(--sx-warning, #eab308); }
    .kpi-val.low { color: var(--sx-error, #ef4444); }
    .kpi-val.accent { color: var(--sx-accent, #3b82f6); }

    .kpi-lbl {
      font-size: 9px;
      color: var(--sx-text-tertiary, #8a8a96);
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-top: 2px;
    }

    .biz-report-card {
      background: linear-gradient(180deg, rgba(59,130,246,0.07), rgba(28,28,31,0.96));
      border: 1px solid rgba(59,130,246,0.28);
      border-radius: 8px;
      padding: 11px 12px;
      margin-bottom: 16px;
    }

    .biz-report-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
    }

    .biz-report-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--sx-text-primary, #ededf0);
    }

    .must-row {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      padding: 5px 0;
      border-top: 1px solid rgba(255,255,255,0.05);
      font-size: 11px;
    }

    .must-badge {
      font-size: 9px;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 4px;
      flex-shrink: 0;
      text-transform: uppercase;
    }

    .must-badge.pass { background: rgba(34,197,94,0.14); color: #22c55e; }
    .must-badge.partial { background: rgba(234,179,8,0.14); color: #eab308; }
    .must-badge.missing { background: rgba(239,68,68,0.14); color: #ef4444; }

    .matrix-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      margin-bottom: 14px;
    }

    .matrix-cell {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.06));
      border-radius: 7px;
      padding: 7px 9px;
      cursor: pointer;
      text-align: left;
      font-family: inherit;
      transition: all 150ms ease;
    }

    .matrix-cell:hover, .matrix-cell.active {
      border-color: var(--sx-accent, #3b82f6);
      background: rgba(59,130,246,0.08);
    }

    .matrix-cell-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 600;
      color: var(--sx-text-primary, #ededf0);
    }

    .matrix-cell-sub {
      font-size: 9px;
      color: var(--sx-text-tertiary, #8a8a96);
      margin-top: 2px;
    }

    .search-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 10px;
    }

    .search-input {
      flex: 1;
      padding: 6px 9px;
      border-radius: 6px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      background: var(--sx-bg-card, #1c1c1f);
      color: var(--sx-text-primary, #ededf0);
      font-size: 11px;
      font-family: inherit;
    }

    .mini-action-btn {
      padding: 5px 8px;
      border-radius: 6px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      background: var(--sx-bg-card, #1c1c1f);
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 10px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      white-space: nowrap;
    }

    .mini-action-btn:hover, .mini-action-btn.active {
      border-color: var(--sx-accent, #3b82f6);
      color: var(--sx-accent, #3b82f6);
    }

    .history-item.selected-compare {
      border-color: var(--sx-accent, #3b82f6);
      background: rgba(59,130,246,0.10);
    }

    .diff-box {
      background: var(--sx-bg-card, #1c1c1f);
      border: 1px solid rgba(59,130,246,0.35);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 14px;
    }
  `;constructor(){super(),this.report=null,this.history=[],this.showHistory=!1,this.activeProfile="",this.expandedHeuristic="",this.expandAllHeuristics=!1,this.issueSearch="",this.copied=!1,this.copiedMdClip=!1,this.copiedFixPrompt=!1,this.activeFilter="all",this.copiedFix="",this.heatmapActive=!1,this.historySearch="",this.compareMode=!1,this.compareIds=[],this.comparisonResult=null,this.copiedDiffMd=!1}updated(e){if(e.has("report")&&this.report){let t=Object.keys(this.report.profileResults||{});t.length>0&&!this.activeProfile&&(this.activeProfile=t[0])}}_toggleHeuristic(e){this.expandedHeuristic=this.expandedHeuristic===e?"":e}_highlightIssue(e){e.element&&chrome.runtime.sendMessage({type:"HIGHLIGHT_ELEMENT",payload:{selector:e.element,description:e.description,severity:e.severity}}).catch(()=>{})}_clearHighlight(){chrome.runtime.sendMessage({type:"CLEAR_HIGHLIGHT",payload:{}}).catch(()=>{})}_toggleHeatmap(){if(this.heatmapActive=!this.heatmapActive,this.heatmapActive){let e=[];Object.values(this.report?.profileResults||{}).forEach(t=>{(t.evaluations||[]).forEach(i=>{(i.issues||[]).forEach(s=>{s.element&&e.push({element:s.element,severity:s.severity,description:s.description})})})}),chrome.runtime.sendMessage({type:"SHOW_HEATMAP",payload:{issues:e}}).catch(()=>{})}else chrome.runtime.sendMessage({type:"CLEAR_HEATMAP",payload:{}}).catch(()=>{})}disconnectedCallback(){super.disconnectedCallback(),chrome.runtime.sendMessage({type:"CLEAR_OVERLAYS",payload:{}}).catch(()=>{})}_getScoreClass(e){return e>=71?"high":e>=41?"mid":"low"}_copyMarkdownToClipboard(){this.report?.markdown&&navigator.clipboard.writeText(this.report.markdown).then(()=>{this.copiedMdClip=!0,setTimeout(()=>{this.copiedMdClip=!1},2e3)})}_copyAiFixPromptToClipboard(){if(!this.report)return;let e=this.report.aiFixPrompt||Je(this.report);e&&navigator.clipboard.writeText(e).then(()=>{this.copiedFixPrompt=!0,setTimeout(()=>{this.copiedFixPrompt=!1},2e3)})}_downloadMarkdown(){if(!this.report?.markdown)return;let t=`design-change-${this._shortenUrl(this.report.url).replace(/[\/:.]/g,"-").replace(/-+/g,"-")}.md`,i=new Blob([this.report.markdown],{type:"text/markdown;charset=utf-8"}),s=URL.createObjectURL(i),a=document.createElement("a");a.href=s,a.download=t,a.click(),URL.revokeObjectURL(s),this.copied=!0,setTimeout(()=>{this.copied=!1},2e3)}async _downloadPDF(){if(this.report)try{let{generatePDF:e}=await import("./chunks/pdf-export-PNVM4KWW.js"),t=e(this.report),s=`synthux-report-${this._shortenUrl(this.report.url).replace(/[\/:.]/g,"-").replace(/-+/g,"-")}.pdf`,a=URL.createObjectURL(t),o=document.createElement("a");o.href=a,o.download=s,o.click(),URL.revokeObjectURL(a)}catch(e){console.error("[synthux] PDF generation failed:",e)}}_renderBusinessAlignmentSection(e){let t=e.businessAlignment;return t?n`
      <div class="biz-report-card">
        <div class="biz-report-head">
          <div class="biz-report-title" style="display:flex;align-items:center;gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--sx-accent,#3b82f6);flex-shrink:0;">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
            <span>${t.contextName||"Business & Goal Alignment"}</span>
          </div>
          <span class="heuristic-score-badge ${this._getScoreClass(t.goalAlignmentScore)}">${t.goalAlignmentScore}/100</span>
        </div>
        ${t.primaryGoal?n`<div style="font-size:11px;color:var(--sx-accent,#3b82f6);font-weight:500;margin-bottom:4px;">Goal: ${t.primaryGoal}</div>`:""}
        ${t.goalSummary?n`<div style="font-size:11px;color:var(--sx-text-secondary,#b4b4bc);line-height:1.45;margin-bottom:8px;">${t.goalSummary}</div>`:""}

        ${(t.mustHavesAudit||[]).length>0?n`
          <div style="font-size:10px;font-weight:600;color:var(--sx-text-tertiary,#8a8a96);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Non-Negotiable Must-Haves</div>
          ${t.mustHavesAudit.map(i=>n`
            <div class="must-row">
              <span class="must-badge ${i.status}">${i.status}</span>
              <div style="flex:1;min-width:0;">
                <div style="color:var(--sx-text-primary,#ededf0);font-weight:500;">${i.item}</div>
                ${i.evidence?n`<div style="font-size:10px;color:var(--sx-text-tertiary,#8a8a96);margin-top:1px;">${i.evidence}</div>`:""}
                ${i.status!=="pass"&&i.recommendation?n`<div style="font-size:10px;color:var(--sx-accent,#3b82f6);margin-top:2px;">→ ${i.recommendation}</div>`:""}
              </div>
            </div>
          `)}
        `:""}

        ${(t.metricInsights||[]).length>0?n`
          <div style="font-size:10px;font-weight:600;color:var(--sx-text-tertiary,#8a8a96);text-transform:uppercase;letter-spacing:0.5px;margin:8px 0 4px;">Metric Bottleneck Diagnosis</div>
          ${t.metricInsights.map(i=>n`
            <div class="must-row">
              <div style="flex:1;">
                <div style="color:var(--sx-text-primary,#ededf0);font-weight:600;">${i.metric}</div>
                ${i.rootCause?n`<div style="font-size:10px;color:var(--sx-text-secondary,#b4b4bc);margin-top:1px;">Cause: ${i.rootCause}</div>`:""}
                ${i.action?n`<div style="font-size:10px;color:var(--sx-accent,#3b82f6);margin-top:1px;">Action: ${i.action}</div>`:""}
              </div>
            </div>
          `)}
        `:""}

        ${(t.departmentFindings||[]).length>0?n`
          <div style="font-size:10px;font-weight:600;color:var(--sx-text-tertiary,#8a8a96);text-transform:uppercase;letter-spacing:0.5px;margin:8px 0 4px;">Department Lenses</div>
          ${t.departmentFindings.map(i=>n`
            <div class="must-row">
              <div style="flex:1;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="color:var(--sx-text-primary,#ededf0);font-weight:600;">${i.departmentName}</span>
                  <span style="font-size:10px;font-weight:700;color:var(--sx-accent,#3b82f6);">${i.score}/100</span>
                </div>
                ${i.summary?n`<div style="font-size:10px;color:var(--sx-text-secondary,#b4b4bc);margin-top:1px;">${i.summary}</div>`:""}
              </div>
            </div>
          `)}
        `:""}
      </div>
    `:""}_renderPriorityMatrix(e){let t=(e?.evaluations||[]).flatMap(l=>l.issues||[]);if(t.length===0)return"";let i=t.filter(l=>l.isQuickWin||l.priority==="high"&&l.fixEffort==="easy").length,s=t.filter(l=>l.priority==="high"&&l.fixEffort!=="easy").length,a=t.filter(l=>l.priority!=="high"&&l.fixEffort==="easy").length,o=t.filter(l=>l.priority!=="high"&&l.fixEffort!=="easy").length;return n`
      <div class="section-header">2×2 Impact × Effort Matrix</div>
      <div class="matrix-grid">
        <button class="matrix-cell ${this.activeFilter==="quick-wins"?"active":""}" @click="${()=>{this.activeFilter=this.activeFilter==="quick-wins"?"all":"quick-wins"}}">
          <div class="matrix-cell-top"><span>Quick Wins</span><span style="color:#22c55e;">${i}</span></div>
          <div class="matrix-cell-sub">High Impact · Easy Fix</div>
        </button>
        <button class="matrix-cell ${this.activeFilter==="major"?"active":""}" @click="${()=>{this.activeFilter=this.activeFilter==="major"?"all":"major"}}">
          <div class="matrix-cell-top"><span>Major Projects</span><span style="color:#eab308;">${s}</span></div>
          <div class="matrix-cell-sub">High Impact · Mod/Hard</div>
        </button>
        <button class="matrix-cell ${this.activeFilter==="easy-fixes"?"active":""}" @click="${()=>{this.activeFilter=this.activeFilter==="easy-fixes"?"all":"easy-fixes"}}">
          <div class="matrix-cell-top"><span>Fill-Ins</span><span style="color:#3b82f6;">${a}</span></div>
          <div class="matrix-cell-sub">Med/Low Impact · Easy</div>
        </button>
        <button class="matrix-cell ${this.activeFilter==="backlog"?"active":""}" @click="${()=>{this.activeFilter=this.activeFilter==="backlog"?"all":"backlog"}}">
          <div class="matrix-cell-top"><span>Backlog</span><span style="color:#8a8a96;">${o}</span></div>
          <div class="matrix-cell-sub">Med/Low Impact · Hard</div>
        </button>
      </div>
    `}render(){if(this.showHistory)return this._renderHistory();if(!this.report)return n`
        <div class="empty-state">
          <div class="empty-title">No report yet</div>
          <div class="empty-desc">Go to Scan tab to analyze a page.</div>
        </div>
      `;let e=this.report,t=e.profileResults?.[this.activeProfile],i=(e.issues||[]).filter(s=>s.isQuickWin||s.priority==="high"&&s.fixEffort==="easy").length;return n`
      <div class="overall-section">
        <synthux-score value="${e.overallScore||0}" label="Overall UX Score" size="lg"></synthux-score>
        <div class="report-meta">
          ${this._shortenUrl(e.url)}${e.model?n`<br>${e.model} · `:""}${e.mode==="deep"?"Deep":e.mode==="custom"?"Custom":e.mode==="wcag-only"?"Instant WCAG":"Quick"}${e.rulePackShortName||e.rulePackName?n` · <span style="color: var(--sx-accent, #3b82f6); font-weight: 500;">${e.rulePackShortName||e.rulePackName}</span>`:""}
          ${e.timestamp?n` · ${new Date(e.timestamp).toLocaleString()}`:""}
          ${e.costSummary?n`<br><span style="color: ${e.costSummary.isLocal?"var(--sx-success, #22c55e)":"var(--sx-warning, #eab308)"}">${e.costSummary.formatted}</span>`:""}
        </div>
      </div>

      <!-- KPI Strip -->
      <div class="kpi-strip">
        <div class="kpi-card">
          <div class="kpi-val ${this._getScoreClass(e.overallScore||0)}">${e.overallScore||0}</div>
          <div class="kpi-lbl">UX Score</div>
        </div>
        ${e.accessibilityResults?n`
          <div class="kpi-card">
            <div class="kpi-val ${this._getScoreClass(e.accessibilityResults.score||0)}">${e.accessibilityResults.score||0}</div>
            <div class="kpi-lbl">WCAG 2.2</div>
          </div>
        `:""}
        ${e.businessAlignment?n`
          <div class="kpi-card">
            <div class="kpi-val ${this._getScoreClass(e.businessAlignment.goalAlignmentScore||0)}">${e.businessAlignment.goalAlignmentScore||0}</div>
            <div class="kpi-lbl">Goal Fit</div>
          </div>
        `:""}
        <div class="kpi-card">
          <div class="kpi-val accent">${i}</div>
          <div class="kpi-lbl">Quick Wins</div>
        </div>
      </div>

      <div class="heatmap-toggle">
        <span class="heatmap-label">Heatmap</span>
        <button class="heatmap-switch ${this.heatmapActive?"active":""}" 
          @click="${this._toggleHeatmap}" 
          title="${this.heatmapActive?"Heatmap is ON \u2014 click to hide":"Show issue heatmap on page"}">
        </button>
      </div>

      ${this._renderBusinessAlignmentSection(e)}

      <div class="profile-tabs">
        ${Object.entries(e.profileResults||{}).map(([s,a])=>n`
          <button class="profile-tab ${this.activeProfile===s?"active":""}" @click="${()=>this.activeProfile=s}" title="${a.profile.custom?`${a.profile.ageRange||""} \xB7 ${a.profile.techLevel||""} tech${a.profile.goal?` \xB7 ${a.profile.goal}`:""}`:a.profile.description?.en||""}">
            <span>${a.profile.name?.en||s}${a.profile.custom?n`<span style="font-size: 8px; background: rgba(0,126,255,0.1); color: #007eff; padding: 0 4px; border-radius: 4px; margin-left: 4px; vertical-align: middle;">C</span>`:""}</span>
            <span class="profile-tab-score">${a.score}</span>
          </button>
        `)}
      </div>

      ${t?n`
        ${this._renderPriorityMatrix(t)}
        ${this._renderFilterBar(t)}
        <div class="search-row">
          <input
            type="text"
            class="search-input"
            placeholder="Search issues, selectors, or recommendations..."
            .value="${this.issueSearch||""}"
            @input="${s=>{this.issueSearch=s.target.value}}"
          />
          <button class="mini-action-btn" @click="${()=>{this.expandAllHeuristics=!this.expandAllHeuristics}}">
            ${this.expandAllHeuristics?"Collapse":"Expand All"}
          </button>
        </div>
        <div class="section-header">Evaluations</div>
        <div class="heuristic-list">
          ${(t.evaluations||[]).map(s=>{let a=this._filterIssues(s.issues||[]);if((this.activeFilter!=="all"||this.issueSearch)&&a.length===0)return"";let o=this.expandAllHeuristics||this.activeFilter!=="all"||!!this.issueSearch||this.expandedHeuristic===s.heuristicId;return n`
            <div class="heuristic-card">
              <div class="heuristic-header" @click="${()=>this._toggleHeuristic(s.heuristicId)}">
                <span class="heuristic-score-badge ${this._getScoreClass(s.score)}">${s.score}</span>
                <span class="heuristic-name">${s.heuristicName?.en||s.heuristicId}</span>
                <span class="heuristic-chevron ${o?"open":""}">▶</span>
              </div>
              ${o?n`
                <div class="heuristic-detail">
                  <div class="heuristic-summary">${s.summary}</div>
                  ${a.map(l=>n`
                    <div class="issue-item"
                      @mouseenter="${()=>this._highlightIssue(l)}"
                      @mouseleave="${()=>this._clearHighlight()}">
                      <span class="severity-dot ${l.severity}"></span>
                      <div class="issue-content">
                        <div class="issue-desc">
                          ${l.description}
                          ${l.isQuickWin?n`<span class="priority-badge quick-win">Quick Win</span>`:l.priority==="high"?n`<span class="priority-badge high">HIGH</span>`:""}
                          ${l.fixEffort==="easy"?n`<span class="effort-tag easy">Easy fix</span>`:l.fixEffort==="hard"?n`<span class="effort-tag hard">Hard</span>`:""}
                        </div>
                        ${l.element?n`<div class="issue-element">${l.element}</div>`:""}
                        ${l.recommendation?n`<div class="issue-recommendation">${l.recommendation}</div>`:""}
                        ${l.codeFix?n`
                          <div class="code-fix-block">
                            <div class="code-fix-header">
                              <span>${l.codeFix.language.toUpperCase()} fix</span>
                              <button class="code-fix-copy ${this.copiedFix===l.element?"copied":""}" 
                                @click="${c=>{c.stopPropagation(),this._copyFix(l)}}">
                                ${this.copiedFix===l.element?"Copied \u2713":"Copy"}
                              </button>
                            </div>
                            ${l.codeFix.before?n`
                              <div class="code-fix-label">Before</div>
                              <pre class="code-fix-pre">${l.codeFix.before}</pre>
                            `:""}
                            <div class="code-fix-label">After</div>
                            <pre class="code-fix-pre">${l.codeFix.after}</pre>
                          </div>
                        `:""}
                      </div>
                    </div>
                  `)}
                  ${(s.positives||[]).map(l=>n`
                    <div class="positive-item">
                      <span class="positive-dot"></span>
                      <span>${l}</span>
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
                  ${s.nodes.slice(0,3).map(a=>n`
                    <div style="font-size: 10px; font-family: monospace; background: var(--sx-bg-main, #121214); padding: 4px 6px; border-radius: 4px; margin-bottom: 2px; color: var(--sx-text-secondary, #b4b4bc); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${a.target||a.html}</div>
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
          <button class="export-btn ${this.copiedMdClip?"copied":""}" @click="${this._copyMarkdownToClipboard}" title="Copy full Markdown report to clipboard">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>${this.copiedMdClip?"Copied":"Copy MD"}</span>
          </button>
          <button class="export-btn ${this.copiedFixPrompt?"copied":""}" @click="${this._copyAiFixPromptToClipboard}" title="Copy actionable AI Coding Agent fix prompt">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <span>${this.copiedFixPrompt?"Copied":"Fix Prompt"}</span>
          </button>
          <button class="export-btn ${this.copied?"copied":""}" @click="${this._downloadMarkdown}" title="Download .md file">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>${this.copied?"Saved":".MD"}</span>
          </button>
          <button class="export-btn pdf" @click="${this._downloadPDF}" title="Download vector PDF report">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>PDF</span>
          </button>
        </div>
      </div>
    `}_toggleCompareSelection(e){let t=[...this.compareIds||[]];if(t.includes(e)?t=t.filter(i=>i!==e):(t.length>=2&&t.shift(),t.push(e)),this.compareIds=t,t.length===2){let i=(this.history||[]).find(a=>a.id===t[0]),s=(this.history||[]).find(a=>a.id===t[1]);if(i?.report&&s?.report){let[a,o]=new Date(i.timestamp)<=new Date(s.timestamp)?[i,s]:[s,i];this.comparisonResult=Ke({...a.report,id:a.id},{...o.report,id:o.id})}}else this.comparisonResult=null}_copyDiffMarkdown(){this.comparisonResult?.markdown&&navigator.clipboard.writeText(this.comparisonResult.markdown).then(()=>{this.copiedDiffMd=!0,setTimeout(()=>{this.copiedDiffMd=!1},2e3)})}_renderHistory(){if(!this.history||this.history.length===0)return n`
        <div class="history-empty">
          No past reports yet. Analyze a page to start building history.
        </div>
      `;let e=(this.historySearch||"").toLowerCase().trim(),t=e?this.history.filter(i=>(i.title||"").toLowerCase().includes(e)||(i.url||"").toLowerCase().includes(e)):this.history;return n`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <div class="section-header" style="margin:0;">Past reports (${this.history.length})</div>
        <div style="display:flex;gap:5px;">
          ${this.history.length>=2?n`
            <button
              class="mini-action-btn ${this.compareMode?"active":""}"
              @click="${()=>{this.compareMode=!this.compareMode,this.compareIds=[],this.comparisonResult=null}}"
            >${this.compareMode?"Exit Compare":"Compare (Diff)"}</button>
          `:""}
          <button
            class="mini-action-btn"
            @click="${()=>this.dispatchEvent(new CustomEvent("clear-history",{bubbles:!0,composed:!0}))}"
            title="Clear all saved reports"
          >Clear</button>
        </div>
      </div>

      <div class="search-row">
        <input
          type="text"
          class="search-input"
          placeholder="Search past reports by URL or title..."
          .value="${this.historySearch||""}"
          @input="${i=>{this.historySearch=i.target.value}}"
        />
      </div>

      ${this.compareMode?n`
        <div style="font-size:11px;color:var(--sx-accent,#3b82f6);margin-bottom:8px;">
          Select any 2 reports below to compare Before vs After (${this.compareIds.length}/2 selected).
        </div>
      `:""}

      ${this.comparisonResult?n`
        <div class="diff-box">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <span style="font-size:12px;font-weight:700;color:var(--sx-text-primary,#ededf0);">Before vs After Audit Diff</span>
            <button class="mini-action-btn" @click="${this._copyDiffMarkdown}">
              ${this.copiedDiffMd?"Copied":"Copy Diff MD"}
            </button>
          </div>
          <div class="kpi-strip" style="margin-bottom:10px;">
            <div class="kpi-card">
              <div class="kpi-val ${this.comparisonResult.scores.overallScoreDelta>=0?"high":"low"}">
                ${this.comparisonResult.scores.baseScore} → ${this.comparisonResult.scores.targetScore}
                (${this.comparisonResult.scores.overallScoreDelta>0?"+":""}${this.comparisonResult.scores.overallScoreDelta})
              </div>
              <div class="kpi-lbl">UX Score Delta</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-val high">${this.comparisonResult.counts.resolvedCount}</div>
              <div class="kpi-lbl">Resolved</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-val low">${this.comparisonResult.counts.newCount}</div>
              <div class="kpi-lbl">New Issues</div>
            </div>
          </div>

          ${this.comparisonResult.resolvedIssues.length>0?n`
            <div style="font-size:10px;font-weight:600;color:#22c55e;margin-bottom:3px;">Resolved Issues (${this.comparisonResult.resolvedIssues.length})</div>
            ${this.comparisonResult.resolvedIssues.slice(0,5).map(i=>n`
              <div style="font-size:11px;color:var(--sx-text-secondary,#b4b4bc);padding:2px 0;text-decoration:line-through;">• ${i.description}</div>
            `)}
          `:""}

          ${this.comparisonResult.newIssues.length>0?n`
            <div style="font-size:10px;font-weight:600;color:#ef4444;margin:6px 0 3px;">New Issues (${this.comparisonResult.newIssues.length})</div>
            ${this.comparisonResult.newIssues.slice(0,5).map(i=>n`
              <div style="font-size:11px;color:var(--sx-text-primary,#ededf0);padding:2px 0;">• ${i.description}</div>
            `)}
          `:""}
        </div>
      `:""}

      <div class="history-list">
        ${t.map(i=>{let s=(this.compareIds||[]).includes(i.id);return n`
            <div
              class="history-item ${s?"selected-compare":""}"
              @click="${()=>this.compareMode?this._toggleCompareSelection(i.id):this._loadFromHistory(i.id)}"
            >
              <span class="history-score ${this._getScoreClass(i.score)}">${i.score}</span>
              <div class="history-details">
                <div class="history-title">${i.title||i.url||"Untitled"}</div>
                <div class="history-meta">
                  ${this._formatDate(i.timestamp)} · ${i.mode} · ${i.model}
                  ${i.goalScore!=null?n` · <span style="color:var(--sx-accent,#3b82f6);">Goal ${i.goalScore}</span>`:""}
                </div>
              </div>
              <button class="history-delete" @click="${a=>{a.stopPropagation(),this._deleteFromHistory(i.id)}}" title="Delete">×</button>
            </div>
          `})}
      </div>
    `}_loadFromHistory(e){this.dispatchEvent(new CustomEvent("load-report",{detail:{id:e},bubbles:!0,composed:!0}))}_deleteFromHistory(e){this.dispatchEvent(new CustomEvent("delete-report",{detail:{id:e},bubbles:!0,composed:!0}))}_shortenUrl(e){if(!e)return"";try{let t=new URL(e);return t.hostname+(t.pathname!=="/"?t.pathname.substring(0,30)+(t.pathname.length>30?"...":""):"")}catch{return e.substring(0,40)+(e.length>40?"...":"")}}_formatDate(e){if(!e)return"";try{let t=new Date(e),s=new Date-t;return s<6e4?"Just now":s<36e5?`${Math.floor(s/6e4)}m ago`:s<864e5?`${Math.floor(s/36e5)}h ago`:t.toLocaleDateString()}catch{return""}}_copyFix(e){if(!e.codeFix)return;let t=e.codeFix.after;navigator.clipboard.writeText(t).then(()=>{this.copiedFix=e.element,setTimeout(()=>{this.copiedFix=""},2e3)})}_filterIssues(e){let t=(this.issueSearch||"").toLowerCase().trim();return e.filter(i=>{if(t&&!`${i.description||""} ${i.element||""} ${i.recommendation||""}`.toLowerCase().includes(t))return!1;if(this.activeFilter==="all")return!0;switch(this.activeFilter){case"quick-wins":return i.isQuickWin||i.priority==="high"&&i.fixEffort==="easy";case"major":return i.priority==="high"&&i.fixEffort!=="easy";case"critical":return i.severity==="critical";case"easy-fixes":return i.fixEffort==="easy";case"backlog":return i.priority!=="high"&&i.fixEffort!=="easy";default:return!0}})}_getFilterCounts(e){let t=(e.evaluations||[]).flatMap(i=>i.issues||[]);return{all:t.length,quickWins:t.filter(i=>i.isQuickWin||i.priority==="high"&&i.fixEffort==="easy").length,critical:t.filter(i=>i.severity==="critical").length,easyFixes:t.filter(i=>i.fixEffort==="easy").length}}_renderFilterBar(e){let t=this._getFilterCounts(e);if(t.all===0)return"";let i=[{id:"all",label:"All",count:t.all},{id:"quick-wins",label:"Quick Wins",count:t.quickWins},{id:"critical",label:"Critical",count:t.critical},{id:"easy-fixes",label:"Easy Fixes",count:t.easyFixes}];return n`
      <div class="filter-bar">
        ${i.map(s=>n`
          <button class="filter-btn ${this.activeFilter===s.id?"active":""}"
            @click="${()=>this.activeFilter=s.id}">
            ${s.label} <span class="filter-count">${s.count}</span>
          </button>
        `)}
      </div>
    `}};customElements.define("synthux-report",xe);function tt(r){let e=String(r||"").trim();return e.startsWith("```json")?e=e.slice(7):e.startsWith("```")&&(e=e.slice(3)),e.endsWith("```")&&(e=e.slice(0,-3)),e.trim()}function it(){if(typeof globalThis<"u"){if(globalThis.LanguageModel)return{api:globalThis.LanguageModel,type:"standard"};if(globalThis.ai?.languageModel)return{api:globalThis.ai.languageModel,type:"legacy"}}return null}var ve={ollama:{id:"ollama",name:"Ollama (Local)",icon:"",authType:"none",defaultEndpoint:"http://localhost:11434",models:[],modelsFetchable:!0,buildRequest(r,e,t={}){let i={model:e,prompt:r,system:t.systemPrompt||"",stream:!1,format:t.format||"json",options:{temperature:t.temperature??.3,num_predict:t.maxTokens||2048}};return t.images?.length&&(i.images=t.images.map(s=>s.replace(/^data:image\/\w+;base64,/,""))),{url:`${t.endpoint||this.defaultEndpoint}/api/generate`,method:"POST",headers:{"Content-Type":"application/json"},body:i}},parseResponse(r){try{return{success:!0,result:JSON.parse(r.response),meta:{model:r.model,totalDuration:r.total_duration,inputTokens:r.prompt_eval_count||0,outputTokens:r.eval_count||0}}}catch{return{success:!0,result:{raw:r.response},meta:{model:r.model,inputTokens:r.prompt_eval_count||0,outputTokens:r.eval_count||0}}}},async fetchModels(r){try{let e=await fetch(`${r||this.defaultEndpoint}/api/tags`);return e.ok?((await e.json()).models||[]).map(i=>({id:i.name,name:i.name,size:i.size})):[]}catch{return[]}},async ping(r){let e=r||this.defaultEndpoint;try{let t=await fetch(`${e}/api/tags`,{signal:AbortSignal.timeout(5e3)});if(t.ok){try{if((await fetch(`${e}/api/generate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:""}),signal:AbortSignal.timeout(3e3)})).status===403)return{status:"cors-blocked"}}catch{return{status:"cors-blocked"}}let i=null;try{let s=await fetch(`${e}/api/version`,{signal:AbortSignal.timeout(3e3)});s.ok&&(i=(await s.json()).version||null)}catch{}return{status:"connected",version:i}}return{status:"error",code:t.status}}catch{try{return await fetch(e,{mode:"no-cors",signal:AbortSignal.timeout(3e3)}),{status:"cors-blocked"}}catch{return{status:"offline"}}}}},openai:{id:"openai",name:"OpenAI",icon:"",authType:"bearer",defaultEndpoint:"https://api.openai.com",models:[{id:"gpt-5.4",name:"GPT-5.4"},{id:"gpt-5.4-mini",name:"GPT-5.4 Mini"},{id:"gpt-5.4-nano",name:"GPT-5.4 Nano"},{id:"gpt-5.1",name:"GPT-5.1"}],modelsFetchable:!0,buildRequest(r,e,t={}){let i=[];return t.images?.length&&t.images.forEach(s=>{i.push({type:"image_url",image_url:{url:s,detail:"low"}})}),i.push({type:"text",text:r}),{url:`${t.endpoint||this.defaultEndpoint}/v1/chat/completions`,method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.apiKey}`},body:{model:e,messages:[...t.systemPrompt?[{role:"system",content:t.systemPrompt}]:[],{role:"user",content:t.images?.length?i:r}],temperature:t.temperature??.3,max_tokens:t.maxTokens||2048,response_format:t.format==="json"?{type:"json_object"}:void 0}}},parseResponse(r){let e=r.choices?.[0]?.message?.content||"";try{return{success:!0,result:JSON.parse(e),meta:{model:r.model,inputTokens:r.usage?.prompt_tokens||0,outputTokens:r.usage?.completion_tokens||0}}}catch{return{success:!0,result:{raw:e},meta:{model:r.model,inputTokens:r.usage?.prompt_tokens||0,outputTokens:r.usage?.completion_tokens||0}}}},async fetchModels(r,e){try{let t=await fetch(`${r||this.defaultEndpoint}/v1/models`,{headers:{Authorization:`Bearer ${e}`}});return t.ok?((await t.json()).data||[]).filter(s=>s.id.startsWith("gpt-5")||s.id.startsWith("gpt-4")||s.id.startsWith("o")).map(s=>({id:s.id,name:s.id})).sort((s,a)=>s.name.localeCompare(a.name)):this.models}catch{return this.models}},async ping(r,e){try{return(await fetch(`${r||this.defaultEndpoint}/v1/models`,{headers:{Authorization:`Bearer ${e}`},signal:AbortSignal.timeout(8e3)})).ok}catch{return!1}}},gemini:{id:"gemini",name:"Google Gemini",icon:"",authType:"query_param",defaultEndpoint:"https://generativelanguage.googleapis.com",models:[{id:"gemini-2.5-flash",name:"Gemini 2.5 Flash"},{id:"gemini-2.5-pro",name:"Gemini 2.5 Pro"},{id:"gemini-2.5-flash-lite",name:"Gemini 2.5 Flash-Lite"},{id:"gemini-3-flash-preview",name:"Gemini 3 Flash (Preview)"},{id:"gemini-3.1-pro-preview",name:"Gemini 3.1 Pro (Preview)"},{id:"gemini-3.1-flash-lite-preview",name:"Gemini 3.1 Flash-Lite (Preview)"}],modelsFetchable:!0,buildRequest(r,e,t={}){let i=t.endpoint||this.defaultEndpoint,s=t.apiKey||"",a=[];return t.images?.length&&t.images.forEach(o=>{a.push({inlineData:{mimeType:"image/jpeg",data:o.replace(/^data:image\/\w+;base64,/,"")}})}),a.push({text:r}),{url:`${i}/v1beta/models/${e}:generateContent?key=${s}`,method:"POST",headers:{"Content-Type":"application/json"},body:{contents:[...t.systemPrompt?[{role:"model",parts:[{text:`System: ${t.systemPrompt}`}]}]:[],{role:"user",parts:a}],generationConfig:{temperature:t.temperature??.3,maxOutputTokens:t.maxTokens||4096,responseMimeType:t.format==="json"?"application/json":"text/plain",thinkingConfig:{thinkingBudget:0}}}}},parseResponse(r){let e=r.candidates?.[0]?.content?.parts?.[0]?.text||"",t=r.usageMetadata||{},i=(t.candidatesTokenCount||0)+(t.thoughtsTokenCount||0);try{return{success:!0,result:JSON.parse(e),meta:{model:r.modelVersion||"",inputTokens:t.promptTokenCount||0,outputTokens:i,thinkingTokens:t.thoughtsTokenCount||0}}}catch{return{success:!0,result:{raw:e},meta:{model:r.modelVersion||"",inputTokens:t.promptTokenCount||0,outputTokens:i,thinkingTokens:t.thoughtsTokenCount||0}}}},async fetchModels(r,e){try{let t=await fetch(`${r||this.defaultEndpoint}/v1beta/models?key=${e}`);return t.ok?((await t.json()).models||[]).filter(s=>s.name.includes("gemini")&&s.supportedGenerationMethods?.includes("generateContent")).map(s=>({id:s.name.replace("models/",""),name:s.displayName||s.name.replace("models/","")})):this.models}catch{return this.models}},async ping(r,e){try{return(await fetch(`${r||this.defaultEndpoint}/v1beta/models?key=${e}`,{signal:AbortSignal.timeout(8e3)})).ok}catch{return!1}}},claude:{id:"claude",name:"Anthropic Claude",icon:"",authType:"x-api-key",defaultEndpoint:"https://api.anthropic.com",models:[{id:"claude-opus-4-7",name:"Claude Opus 4.7"},{id:"claude-sonnet-4-6",name:"Claude Sonnet 4.6"},{id:"claude-haiku-4-5",name:"Claude Haiku 4.5"},{id:"claude-opus-4-6",name:"Claude Opus 4.6"}],modelsFetchable:!0,buildRequest(r,e,t={}){let i=[];return t.images?.length&&t.images.forEach(s=>{i.push({type:"image",source:{type:"base64",media_type:"image/jpeg",data:s.replace(/^data:image\/\w+;base64,/,"")}})}),i.push({type:"text",text:r}),{url:`${t.endpoint||this.defaultEndpoint}/v1/messages`,method:"POST",headers:{"Content-Type":"application/json","x-api-key":t.apiKey||"","anthropic-version":"2024-01-01","anthropic-dangerous-direct-browser-access":"true"},body:{model:e,max_tokens:t.maxTokens||2048,...t.systemPrompt?{system:t.systemPrompt}:{},messages:[{role:"user",content:t.images?.length?i:r}]}}},parseResponse(r){let e=r.content?.[0]?.text||"";try{return{success:!0,result:JSON.parse(e),meta:{model:r.model||"",inputTokens:r.usage?.input_tokens||0,outputTokens:r.usage?.output_tokens||0}}}catch{return{success:!0,result:{raw:e},meta:{model:r.model||"",inputTokens:r.usage?.input_tokens||0,outputTokens:r.usage?.output_tokens||0}}}},async fetchModels(r,e){try{let t=await fetch(`${r||this.defaultEndpoint}/v1/models`,{headers:{"x-api-key":e||"","anthropic-version":"2024-01-01"},signal:AbortSignal.timeout(8e3)});return t.ok?((await t.json()).data||[]).filter(s=>s.id.startsWith("claude")).map(s=>({id:s.id,name:s.display_name||s.id})).sort((s,a)=>s.name.localeCompare(a.name)):this.models}catch{return this.models}},async ping(r,e){try{return(await fetch(`${r||this.defaultEndpoint}/v1/messages`,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":e||"","anthropic-version":"2024-01-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-haiku-4-5",max_tokens:1,messages:[{role:"user",content:"Hi"}]}),signal:AbortSignal.timeout(1e4)})).ok}catch{return!1}}},apple:{id:"apple",name:"Apple Intelligence (macOS)",icon:"",authType:"none",defaultEndpoint:"http://127.0.0.1:17483",models:[{id:"apple-on-device",name:"Apple Foundation Model (On-Device ANE)"},{id:"apple-pcc",name:"Apple Private Cloud Compute (macOS 27)"},{id:"apple-content-tagging",name:"Apple Foundation Model (Fast Tagging)"}],modelsFetchable:!0,buildRequest(r,e,t={}){let i=(t.endpoint||this.defaultEndpoint).replace(/\/$/,""),s=e||"apple-on-device",a=s==="apple-pcc"?28e3:12e3,o=r.length>a?`${r.slice(0,a)}

[DOM truncated for on-device context window. Respond ONLY with valid JSON.]`:r;return{url:`${i}/apple-fm/generate`,method:"POST",headers:{"Content-Type":"application/json"},body:{model:s,prompt:o,system:t.systemPrompt||"You are a UX evaluation expert. Respond only with valid JSON.",temperature:t.temperature??.3,maxTokens:t.maxTokens||2048,format:t.format||"json"}}},parseResponse(r){if(r&&r.success===!1)throw new Error(r.error||"Apple Foundation Model failed to generate a response.");let e=tt(r?.response??r?.choices?.[0]?.message?.content??"");try{return{success:!0,result:JSON.parse(e),meta:{model:r?.model||"apple-on-device",totalDuration:r?.totalDuration||0,inputTokens:r?.inputTokens??r?.usage?.prompt_tokens??0,outputTokens:r?.outputTokens??r?.usage?.completion_tokens??0}}}catch{return{success:!0,result:{raw:e},meta:{model:r?.model||"apple-on-device",inputTokens:r?.inputTokens??0,outputTokens:r?.outputTokens??0}}}},async fetchModels(r){let e=(r||this.defaultEndpoint).replace(/\/$/,"");try{let t=await fetch(`${e}/apple-fm/status`,{signal:AbortSignal.timeout(5e3)});if(t.ok){let i=await t.json();if(Array.isArray(i.models)&&i.models.length>0)return i.models.map(s=>({id:s.id||s.name,name:s.name||s.id}))}}catch{}return this.models},async ping(r){let e=(r||this.defaultEndpoint).replace(/\/$/,"");try{let t=await fetch(`${e}/apple-fm/status`,{signal:AbortSignal.timeout(5e3)});if(t.ok){let i=await t.json();return i.available?{status:"connected",version:i.variant||i.osVersion||"Apple Intelligence"}:{status:i.status==="unsupported_os"?"unsupported-os":"connected",version:i.variant||i.osVersion||"macOS Bridge Ready",warning:i.reason||null}}return{status:"error",code:t.status}}catch{return{status:"offline"}}}},chromeai:{id:"chromeai",name:"Chrome Built-in AI",icon:"",authType:"none",defaultEndpoint:"chrome://on-device-internals",models:[{id:"gemini-nano",name:"Gemini Nano (Chrome Prompt API)"}],modelsFetchable:!1,async evaluateDirect(r,e="gemini-nano",t={}){let i=it();if(!i)return{success:!1,error:"Chrome Built-in AI (Prompt API) is not enabled in this browser. Enable chrome://flags/#prompt-api-for-gemini-nano and restart Chrome."};let s=14e3,a=r.length>s?`${r.slice(0,s)}

[DOM truncated for Gemini Nano context window. Respond ONLY with valid JSON.]`:r,o=t.systemPrompt||"You are a UX evaluation expert. Respond ONLY with a valid JSON object without markdown code fences.",l=null;try{i.type==="standard"?l=await i.api.create({initialPrompts:[{role:"system",content:o}],temperature:t.temperature??.3,topK:3,signal:t.signal}):l=await i.api.create({systemPrompt:o,temperature:t.temperature??.3,topK:3,signal:t.signal});let c=await l.prompt(a,{signal:t.signal}),d=tt(c),h=Math.max(1,Math.round(a.length/4)),p=Math.max(1,Math.round(d.length/4));try{return{success:!0,result:JSON.parse(d),meta:{model:e||"gemini-nano",inputTokens:h,outputTokens:p}}}catch{return{success:!0,result:{raw:d},meta:{model:e||"gemini-nano",inputTokens:h,outputTokens:p}}}}catch(c){return{success:!1,error:`Chrome Built-in AI error: ${c.message||String(c)}`}}finally{try{l?.destroy?.()}catch{}}},async fetchModels(){return this.models},async ping(){let r=it();if(!r)return{status:"chromeai-disabled"};try{if(r.type==="standard"&&typeof r.api.availability=="function"){let e=await r.api.availability();return e==="unavailable"||e==="no"?{status:"chromeai-disabled"}:{status:"connected",version:`Gemini Nano (${e})`}}if(r.type==="legacy"&&typeof r.api.capabilities=="function"){let e=await r.api.capabilities();return e?.available==="no"?{status:"chromeai-disabled"}:{status:"connected",version:`Gemini Nano (${e?.available||"ready"})`}}return{status:"connected",version:"Gemini Nano"}}catch{return{status:"chromeai-disabled"}}}}};function ye(r){return ve[r]||ve.ollama}function st(){return Object.values(ve).map(r=>({id:r.id,name:r.name,icon:r.icon,authType:r.authType,models:r.models}))}var ke=class extends f{static properties={ollamaStatus:{type:Object},endpoint:{type:String},model:{type:String},models:{type:Array},language:{type:String},connectionState:{type:String},showSetupGuide:{type:Boolean},errorType:{type:String},providerId:{type:String},apiKey:{type:String},enableVision:{type:Boolean},mcpStatus:{type:Object},showMcpGuide:{type:Boolean},mcpToken:{type:String},_saved:{type:Boolean,state:!0}};static styles=v`
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

    .backup-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .backup-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      height: 34px;
      margin: 0;
      padding: 0 10px;
      border-radius: 6px;
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      background: var(--sx-bg-tertiary, #202024);
      color: var(--sx-text-secondary, #b4b4bc);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: inherit;
      white-space: nowrap;
      box-sizing: border-box;
    }

    .backup-btn:hover {
      border-color: var(--sx-border-hover, rgba(255,255,255,0.14));
      color: var(--sx-text-primary, #ededf0);
      background: rgba(255,255,255,0.04);
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
  `;constructor(){super(),this.ollamaStatus={connected:!1,models:[]},this.endpoint="http://localhost:11434",this.model="gemma4",this.models=[],this.language="en",this.connectionState="idle",this.showSetupGuide=!1,this.errorType="",this.providerId="ollama",this.apiKey="",this.enableVision=!0,this.mcpStatus={enabled:!0,connected:!1,wsUrl:"ws://127.0.0.1:17483/ws"},this.showMcpGuide=!1,this.mcpToken="",this._saved=!1,this._copiedCmd="",this._loadSettings(),this._loadMcpStatus()}async _loadMcpStatus(){try{let e=await chrome.runtime.sendMessage({type:"GET_MCP_STATUS"});e&&(this.mcpStatus=e);let t=await chrome.storage.local.get({mcpToken:""});this.mcpToken=t.mcpToken||""}catch{}}async _toggleMcpBridge(e){let t=e.target.checked;try{let i=await chrome.runtime.sendMessage({type:"CONFIGURE_MCP",payload:{enabled:t,mcpToken:this.mcpToken}});i?.status&&(this.mcpStatus=i.status)}catch{}}async _onMcpTokenBlur(){try{let e=await chrome.runtime.sendMessage({type:"CONFIGURE_MCP",payload:{mcpToken:this.mcpToken}});e?.status&&(this.mcpStatus=e.status),this._saved=!0,clearTimeout(this._savedTimer),this._savedTimer=setTimeout(()=>{this._saved=!1},2e3)}catch{}}async _exportWorkspaceBackup(){try{let e=await chrome.storage.local.get(["customProfiles","customRulePacks","synthux_business_context_state","synthux_flows","reportHistory"]),t={synthuxBackupVersion:"2.2.0",exportedAt:new Date().toISOString(),customProfiles:e.customProfiles||[],customRulePacks:e.customRulePacks||[],businessContextState:e.synthux_business_context_state||null,savedFlows:e.synthux_flows||[],reportHistory:e.reportHistory||[]},i=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),s=URL.createObjectURL(i),a=document.createElement("a");a.href=s,a.download=`synthux-workspace-backup-${new Date().toISOString().slice(0,10)}.json`,a.click(),URL.revokeObjectURL(s),this._saved=!0,setTimeout(()=>{this._saved=!1},2e3)}catch(e){console.error("[synthux] Workspace export failed:",e)}}async _importWorkspaceBackup(e){let t=e.target.files?.[0];if(t)try{let i=await t.text(),s=JSON.parse(i),a={};Array.isArray(s.customProfiles)&&(a.customProfiles=s.customProfiles),Array.isArray(s.customRulePacks)&&(a.customRulePacks=s.customRulePacks),s.businessContextState&&typeof s.businessContextState=="object"&&(a.synthux_business_context_state=s.businessContextState),Array.isArray(s.savedFlows)&&(a.synthux_flows=s.savedFlows),Array.isArray(s.reportHistory)&&(a.reportHistory=s.reportHistory),await chrome.storage.local.set(a),window.dispatchEvent(new CustomEvent("profiles-changed")),window.dispatchEvent(new CustomEvent("business-context-changed")),this._saved=!0,setTimeout(()=>{this._saved=!1},2e3)}catch(i){console.error("[synthux] Workspace import failed:",i)}}updated(e){if(e.has("ollamaStatus")&&this.ollamaStatus?.connected&&this.providerId==="ollama"){let t=(this.ollamaStatus.models||[]).map(i=>i.name||i.id||i);t.length>0&&JSON.stringify(t)!==JSON.stringify(this.models)&&(this.models=t,this.model&&!this.models.includes(this.model)&&this.models.length>0)}}get _isCloudProvider(){return this.providerId==="openai"||this.providerId==="gemini"||this.providerId==="claude"}get _isBrowserBuiltInProvider(){return this.providerId==="chromeai"}async _loadSettings(){try{let e=await chrome.storage.local.get({ollamaEndpoint:"http://localhost:11434",ollamaModel:"gemma4",language:"en",providerId:"ollama",apiKey:"",apiKey_openai:"",apiKey_gemini:"",apiKey_claude:"",enableVision:!0});this.endpoint=e.ollamaEndpoint,this.model=e.ollamaModel,this.language=e.language,this.providerId=e.providerId,this.apiKey=e[`apiKey_${this.providerId}`]||e.apiKey||"",this.enableVision=e.enableVision!==!1,this._updateModelsForProvider()}catch{}}async _testConnection(){this.connectionState="testing",this.errorType="";let e=ye(this.providerId);try{let t=await e.ping(this.endpoint,this.apiKey),i=typeof t=="object"?t.status==="connected":!!t,s=typeof t=="object"&&t.status==="cors-blocked",a=typeof t=="object"&&t.status==="chromeai-disabled";if(i){let o=await e.fetchModels(this.endpoint,this.apiKey);this.models=o.map(l=>l.id||l.name),this.connectionState="connected",this.errorType="",this.models.length>0&&!this.models.includes(this.model)&&(this.model=this.models[0]),this.dispatchEvent(new CustomEvent("status-changed",{detail:{connected:!0,models:o,provider:this.providerId}}))}else s?(this.connectionState="failed",this.errorType="cors",this.showSetupGuide=!0,this.dispatchEvent(new CustomEvent("status-changed",{detail:{connected:!1,corsBlocked:!0,models:[]}}))):a?(this.connectionState="failed",this.errorType="chromeai-disabled",this.showSetupGuide=!0,this.dispatchEvent(new CustomEvent("status-changed",{detail:{connected:!1,models:[]}}))):(this.connectionState="failed",this.errorType=this._isCloudProvider?"auth":"offline",this._isCloudProvider||(this.showSetupGuide=!0),this.dispatchEvent(new CustomEvent("status-changed",{detail:{connected:!1,models:[]}})))}catch(t){this.connectionState="failed",this.errorType=t.name==="TimeoutError"?"timeout":this._isCloudProvider?"auth":"offline",this._isCloudProvider||(this.showSetupGuide=!0),this.dispatchEvent(new CustomEvent("status-changed",{detail:{connected:!1,models:[]}}))}setTimeout(()=>{this.connectionState==="connected"&&(this.connectionState="idle")},3e3)}_updateModelsForProvider(){let e=ye(this.providerId);this.providerId==="ollama"?(this.endpoint="http://localhost:11434",this.ollamaStatus?.connected&&this.ollamaStatus?.provider==="ollama"?this.models=(this.ollamaStatus.models||[]).map(t=>t.name||t.id||t):this.models=[],this.models.length>0&&!this.models.includes(this.model)||this.model||(this.model=this.models[0]||"gemma4")):(this.endpoint=e.defaultEndpoint,this.models=(e.models||[]).map(t=>t.id),this.models.length>0&&!this.models.includes(this.model)&&(this.model=this.models[0])),this.connectionState="idle"}async _onProviderChange(e){this.providerId=e.target.value;try{let t=await chrome.storage.local.get(`apiKey_${this.providerId}`);this.apiKey=t[`apiKey_${this.providerId}`]||""}catch{this.apiKey=""}this._updateModelsForProvider(),this._autoSave(),(this.apiKey&&this._isCloudProvider||this.providerId==="apple"||this.providerId==="chromeai")&&this._testConnection()}_onApiKeyBlur(){this.apiKey&&this.apiKey.length>5&&(this._autoSave(),this._testConnection())}_onModelChange(e){this.model=e.target.value,this._autoSave()}_onLanguageChange(e){this.language=e,this._autoSave()}_onEndpointBlur(){this._autoSave()}async _autoSave(){try{let e={ollamaEndpoint:this.endpoint,ollamaModel:this.model,language:this.language,providerId:this.providerId,apiKey:this.apiKey,enableVision:this.enableVision};this.providerId!=="ollama"&&this.apiKey&&(e[`apiKey_${this.providerId}`]=this.apiKey),await chrome.runtime.sendMessage({type:"SAVE_SETTINGS",payload:e}),this._saved=!0,clearTimeout(this._savedTimer),this._savedTimer=setTimeout(()=>{this._saved=!1},2e3)}catch(e){console.error("[synthux] Auto-save failed:",e)}}async _saveSettings(){await this._autoSave()}async _copyCommand(e,t){try{await navigator.clipboard.writeText(e)}catch{let i=document.createElement("textarea");i.value=e,document.body.appendChild(i),i.select(),document.execCommand("copy"),document.body.removeChild(i)}this._copiedCmd=t,this.requestUpdate(),setTimeout(()=>{this._copiedCmd="",this.requestUpdate()},2e3)}_getTestLabel(){switch(this.connectionState){case"testing":return"Testing...";case"connected":return"Connected";case"failed":return this.errorType==="cors"?"Blocked (CORS)":this.errorType==="chromeai-disabled"?"Flags Not Enabled":this.errorType==="timeout"?"Timed out":this.errorType==="offline"?"Not reachable":this.errorType==="auth"?"Invalid API key":"Connection failed";default:return"Test Connection"}}_getApiKeyHint(){switch(this.providerId){case"openai":return n`Get your key at <a href="https://platform.openai.com/api-keys" target="_blank">platform.openai.com</a>`;case"gemini":return n`Get your key at <a href="https://aistudio.google.com/apikey" target="_blank">AI Studio</a>`;case"claude":return n`Get your key at <a href="https://console.anthropic.com/" target="_blank">console.anthropic.com</a>`;default:return""}}_detectOS(){let e=navigator.userAgent.toLowerCase();return e.includes("mac")?"mac":e.includes("win")?"win":"linux"}_getCorsCommand(){let e=this._detectOS();return e==="mac"?'launchctl setenv OLLAMA_ORIGINS "*"':e==="win"?'[Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", "User")':"sudo systemctl edit ollama"}_getCorsNote(){let e=this._detectOS();return e==="win"?"Run in PowerShell as Administrator":e==="linux"?'Add under [Service]: Environment="OLLAMA_ORIGINS=*"':null}_getOtherPlatformCommands(){let e=this._detectOS(),i=Object.entries({mac:{name:"macOS",cmd:'launchctl setenv OLLAMA_ORIGINS "*"'},linux:{name:"Linux",cmd:'sudo systemctl edit ollama \u2192 Environment="OLLAMA_ORIGINS=*"'},win:{name:"Windows",cmd:'[Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", "User")'}}).filter(([s])=>s!==e);return n`${i.map(([,s])=>n`<div style="margin-bottom: 4px;"><strong>${s.name}:</strong> <code style="font-size: 10px;">${s.cmd}</code></div>`)}`}render(){let e=st();return n`
      <div class="section">
        <div class="section-header">AI Provider</div>
        <div class="settings-card">
          <div class="field">
            <label class="field-label">Provider</label>
            <select class="field-select" .value="${this.providerId}" @change="${this._onProviderChange}">
              ${e.map(t=>n`<option value="${t.id}" ?selected="${t.id===this.providerId}">${t.name}</option>`)}
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

      <div class="section" style="margin-top: 20px;">
        <div class="section-header">Workspace Backup &amp; Portability</div>
        <div class="settings-card">
          <div style="display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 600; color: var(--sx-text-primary, #ededf0); margin-bottom: 4px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--sx-accent, #3b82f6); flex-shrink: 0;">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Export / Import Workspace (.json)</span>
          </div>
          <div style="font-size: 11px; color: var(--sx-text-tertiary, #8a8a96); line-height: 1.45; margin-bottom: 12px;">
            Backup or share your Custom Personas, Rule Packs, Business Contexts, Custom Departments, and Flows (API keys are excluded).
          </div>
          <div class="backup-actions">
            <button class="backup-btn" @click="${this._exportWorkspaceBackup}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Export Backup</span>
            </button>
            <label class="backup-btn">
              <input type="file" accept=".json,application/json" style="display:none;" @change="${this._importWorkspaceBackup}" />
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span>Import Backup</span>
            </label>
          </div>
        </div>
      </div>

      <div class="save-indicator ${this._saved?"visible":""}" style="text-align: center; padding: 8px; font-size: 11px; color: var(--sx-success, #22c55e); opacity: ${this._saved?"1":"0"}; transition: opacity 300ms ease;">✓ Auto-saved</div>


      <div class="section" style="margin-top: 24px;">
        <div class="section-header">About</div>
        <div class="settings-card about-card">
          <div class="about-name">synthux</div>
          <div class="about-version">v${chrome.runtime?.getManifest?.()?.version||"2.2.0"}</div>
          <div class="about-desc">AI-powered UX audit. Open source. Privacy first.</div>
          <div class="about-links">
            <a class="about-link" href="https://synthux.app" target="_blank">Website</a>
            <a class="about-link" href="https://github.com/synthuxapp/synthux" target="_blank">GitHub</a>
          </div>
          <div class="about-license">MIT License</div>
        </div>
      </div>
    `}};customElements.define("synthux-settings",ke);var we=class extends f{static properties={activeTab:{type:String},ollamaStatus:{type:Object},mcpStatus:{type:Object},report:{type:Object},reportHistory:{type:Array},analysisProgress:{type:Object},isAnalyzing:{type:Boolean}};static styles=v`
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

    .ver-pill {
      font-size: 9px;
      font-weight: 700;
      color: var(--sx-accent, #3b82f6);
      background: rgba(59, 130, 246, 0.12);
      border: 1px solid rgba(59, 130, 246, 0.25);
      padding: 1px 6px;
      border-radius: 10px;
      letter-spacing: 0.3px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .flow-quick-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 600;
      font-family: inherit;
      color: var(--sx-text-secondary, #b4b4bc);
      background: var(--sx-bg-tertiary, #202024);
      border: 1px solid var(--sx-border, rgba(255,255,255,0.08));
      padding: 4px 8px;
      border-radius: 14px;
      cursor: pointer;
      transition: all 150ms ease;
    }

    .flow-quick-btn:hover {
      color: var(--sx-text-primary, #ededf0);
      border-color: var(--sx-accent, #3b82f6);
      background: rgba(59, 130, 246, 0.10);
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 20px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      font-family: inherit;
      transition: opacity 150ms ease;
    }

    .status-badge:hover {
      opacity: 0.88;
    }

    .tab-pill {
      font-size: 9px;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 8px;
      margin-left: 5px;
      background: rgba(255,255,255,0.07);
      color: var(--sx-text-secondary, #b4b4bc);
    }

    .tab.active .tab-pill {
      background: rgba(59, 130, 246, 0.18);
      color: var(--sx-accent, #3b82f6);
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
  `;constructor(){super(),this.activeTab="scan",this.ollamaStatus={connected:!1,models:[]},this.mcpStatus={connected:!1,enabled:!0},this.report=null,this.reportHistory=[],this.analysisProgress=null,this.isAnalyzing=!1;try{this._port=chrome.runtime.connect({name:"sidepanel"})}catch{}this._setupMessageListeners(),this._checkOllamaStatus(),this._startHealthCheck(),this._loadLastReport(),this._loadHistory()}_setupMessageListeners(){chrome.runtime.onMessage.addListener(e=>{switch(e.type){case"ANALYSIS_PROGRESS":this.analysisProgress=e.payload,this.isAnalyzing=!0;break;case"ANALYSIS_COMPLETE":this.report=e.payload,this.isAnalyzing=!1,this.analysisProgress=null,this.activeTab="report",this._loadHistory(),this._maybeShowRatingPrompt();break;case"ANALYSIS_ERROR":this.isAnalyzing=!1,this.analysisProgress=null,e.payload?.errorType==="cors"&&(this.ollamaStatus={...this.ollamaStatus,connected:!1,corsBlocked:!0},this.activeTab="scan");break;case"ANALYSIS_CANCELLED":this.isAnalyzing=!1,this.analysisProgress=null;break;case"MCP_STATUS_CHANGED":this.mcpStatus=e.payload||{connected:!1};break}})}async _checkOllamaStatus(){try{let[e,t]=await Promise.all([chrome.runtime.sendMessage({type:"GET_OLLAMA_STATUS"}),chrome.runtime.sendMessage({type:"GET_MCP_STATUS"}).catch(()=>null)]);this.ollamaStatus=e||{connected:!1,models:[]},t&&(this.mcpStatus=t)}catch{this.ollamaStatus={connected:!1,models:[]}}}_startHealthCheck(){this._healthInterval=setInterval(()=>this._checkOllamaStatus(),15e3)}disconnectedCallback(){super.disconnectedCallback(),this._healthInterval&&clearInterval(this._healthInterval)}async _loadLastReport(){try{let e=await chrome.storage.local.get("lastReport");e.lastReport&&(this.report=e.lastReport)}catch{}}async _loadHistory(){try{let e=await chrome.runtime.sendMessage({type:"GET_REPORT_HISTORY"});this.reportHistory=e||[]}catch{this.reportHistory=[]}}async _loadHistoryReport(e){let{id:t}=e.detail;try{let i=await chrome.runtime.sendMessage({type:"LOAD_REPORT",payload:{id:t}});i?.report&&(this.report=i.report,this.activeTab="report")}catch(i){console.error("[synthux] Failed to load report:",i)}}async _deleteHistoryReport(e){let{id:t}=e.detail;try{let i=await chrome.runtime.sendMessage({type:"DELETE_REPORT",payload:{id:t}});i?.success&&(this.reportHistory=i.history)}catch(i){console.error("[synthux] Failed to delete report:",i)}}async _clearAllHistory(){try{(await chrome.runtime.sendMessage({type:"CLEAR_REPORT_HISTORY"}))?.success&&(this.reportHistory=[])}catch(e){console.error("[synthux] Failed to clear history:",e)}}async _openFlowBuilderWindow(){try{let[e]=await chrome.tabs.query({active:!0,currentWindow:!0}),t=chrome.runtime.getURL("flow/index.html");e?.url&&(e.url.startsWith("http://")||e.url.startsWith("https://"))&&(t+=`?url=${encodeURIComponent(e.url)}&title=${encodeURIComponent(e.title||"")}`),chrome.tabs.create({url:t})}catch{chrome.tabs.create({url:chrome.runtime.getURL("flow/index.html")})}}_setTab(e){this.activeTab=e,e==="scan"&&this._checkOllamaStatus()}_handleAnalysisStart(){this.isAnalyzing=!0}_handleAnalysisEnd(){this.isAnalyzing=!1,this.analysisProgress=null}_getStatusInfo(){let e=this.ollamaStatus,t=this.mcpStatus,i=e?.provider==="apple"?"Apple AI":e?.provider==="chromeai"?"Chrome AI":e?.provider==="gemini"?"Gemini":e?.provider==="openai"?"OpenAI":e?.provider==="claude"?"Claude":"Connected";return e?.connected&&e?.versionChanged?{cls:"version-warn",label:`Updated (${e.newVersion})`}:e?.connected&&t?.connected?{cls:"connected",label:`${i} \xB7 MCP`}:e?.connected?{cls:"connected",label:i}:t?.connected?{cls:"connected",label:"MCP Agent Ready"}:e?.corsBlocked?{cls:"cors-error",label:"CORS Error"}:{cls:"disconnected",label:"Offline"}}render(){let e=this._getStatusInfo(),t=this.report?.issues?.length||0,i=this.reportHistory?.length||0;return n`
      <!-- Header -->
      <div class="header">
        <div class="logo">
          <img class="logo-img" src="../assets/logo.svg" alt="synthux" />
          <span class="ver-pill">v2.2</span>
        </div>
        <div class="header-actions">
          <button class="flow-quick-btn" @click="${this._openFlowBuilderWindow}" title="Open Multi-Page Flow Builder">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="7" height="6" rx="1.5"></rect>
              <rect x="15" y="14" width="7" height="6" rx="1.5"></rect>
              <path d="M9 7h3a2 2 0 0 1 2 2v6a2 2 0 0 0 2 2h-1"></path>
            </svg>
            <span>Flow</span>
          </button>
          <button class="status-badge ${e.cls}" @click="${()=>this._setTab("settings")}" title="Click to configure AI & MCP settings">
            <span class="status-dot ${e.cls}"></span>
            ${e.label}
          </button>
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
        >Report${this.report?n`<span class="tab-pill">${t}</span>`:""}</button>
        <button 
          class="tab ${this.activeTab==="history"?"active":""}"
          role="tab"
          aria-selected="${this.activeTab==="history"}"
          @click="${()=>{this._setTab("history"),this._loadHistory()}}"
        >History${i>0?n`<span class="tab-pill">${i}</span>`:""}</button>
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
            @clear-history="${this._clearAllHistory}"
          ></synthux-report>
        </div>

        <div class="tab-panel ${this.activeTab==="settings"?"active":""}" role="tabpanel">
          <synthux-settings
            .ollamaStatus="${this.ollamaStatus}"
            @status-changed="${s=>this.ollamaStatus=s.detail}"
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
    `,this.shadowRoot.appendChild(e),e.querySelector("#rating-rate").addEventListener("click",()=>{window.open("https://chromewebstore.google.com/detail/synthux/cgldigellmojaejmnhjhpbfccncbmnhm/reviews","_blank"),chrome.storage.local.set({synthux_rating_dismissed:!0}),e.remove()}),e.querySelector("#rating-dismiss").addEventListener("click",()=>{chrome.storage.local.set({synthux_rating_dismissed:!0}),e.classList.add("rating-toast-exit"),setTimeout(()=>e.remove(),300)})}};customElements.define("synthux-app",we);export{we as SynthuxApp};
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
