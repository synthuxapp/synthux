var M=globalThis,H=M.ShadowRoot&&(M.ShadyCSS===void 0||M.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,U=Symbol(),se=new WeakMap,k=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==U)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(H&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=se.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&se.set(t,e))}return e}toString(){return this.cssText}},ie=r=>new k(typeof r=="string"?r:r+"",void 0,U),b=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,i,o)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new k(t,r,U)},re=(r,e)=>{if(H)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=M.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},N=H?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return ie(t)})(r):r;var{is:ye,defineProperty:$e,getOwnPropertyDescriptor:_e,getOwnPropertyNames:we,getOwnPropertySymbols:Ae,getPrototypeOf:Se}=Object,L=globalThis,oe=L.trustedTypes,ke=oe?oe.emptyScript:"",Ee=L.reactiveElementPolyfillSupport,E=(r,e)=>r,j={toAttribute(r,e){switch(e){case Boolean:r=r?ke:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},ne=(r,e)=>!ye(r,e),ae={attribute:!0,type:String,converter:j,reflect:!1,useDefault:!1,hasChanged:ne};Symbol.metadata??=Symbol("metadata"),L.litPropertyMetadata??=new WeakMap;var x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ae){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&$e(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:o}=_e(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get:i,set(a){let d=i?.call(this);o?.call(this,a),this.requestUpdate(e,d,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ae}static _$Ei(){if(this.hasOwnProperty(E("elementProperties")))return;let e=Se(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(E("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(E("properties"))){let t=this.properties,s=[...we(t),...Ae(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(N(i))}else e!==void 0&&t.push(N(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return re(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:j).toAttribute(t,s.type);this._$Em=e,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let o=s.getPropertyOptions(i),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:j;this._$Em=i;let d=a.fromAttribute(t,o.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(e,t,s,i=!1,o){if(e!==void 0){let a=this.constructor;if(i===!1&&(o=this[e]),s??=a.getPropertyOptions(e),!((s.hasChanged??ne)(o,t)||s.useDefault&&s.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:o},a){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),o!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,o]of s){let{wrapped:a}=o,d=this[i];a!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,o,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[E("elementProperties")]=new Map,x[E("finalized")]=new Map,Ee?.({ReactiveElement:x}),(L.reactiveElementVersions??=[]).push("2.1.2");var W=globalThis,le=r=>r,I=W.trustedTypes,ce=I?I.createPolicy("lit-html",{createHTML:r=>r}):void 0,be="$lit$",v=`lit$${Math.random().toFixed(9).slice(2)}$`,me="?"+v,Ce=`<${me}>`,_=document,z=()=>_.createComment(""),P=r=>r===null||typeof r!="object"&&typeof r!="function",Y=Array.isArray,ze=r=>Y(r)||typeof r?.[Symbol.iterator]=="function",D=`[ 	
\f\r]`,C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,de=/-->/g,pe=/>/g,y=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),he=/'/g,ue=/"/g,xe=/^(?:script|style|textarea|title)$/i,K=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),n=K(1),Ie=K(2),Ue=K(3),w=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),ge=new WeakMap,$=_.createTreeWalker(_,129);function fe(r,e){if(!Y(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ce!==void 0?ce.createHTML(e):e}var Pe=(r,e)=>{let t=r.length-1,s=[],i,o=e===2?"<svg>":e===3?"<math>":"",a=C;for(let d=0;d<t;d++){let l=r[d],p,u,c=-1,m=0;for(;m<l.length&&(a.lastIndex=m,u=a.exec(l),u!==null);)m=a.lastIndex,a===C?u[1]==="!--"?a=de:u[1]!==void 0?a=pe:u[2]!==void 0?(xe.test(u[2])&&(i=RegExp("</"+u[2],"g")),a=y):u[3]!==void 0&&(a=y):a===y?u[0]===">"?(a=i??C,c=-1):u[1]===void 0?c=-2:(c=a.lastIndex-u[2].length,p=u[1],a=u[3]===void 0?y:u[3]==='"'?ue:he):a===ue||a===he?a=y:a===de||a===pe?a=C:(a=y,i=void 0);let f=a===y&&r[d+1].startsWith("/>")?" ":"";o+=a===C?l+Ce:c>=0?(s.push(p),l.slice(0,c)+be+l.slice(c)+v+f):l+v+(c===-2?d:f)}return[fe(r,o+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},T=class r{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let o=0,a=0,d=e.length-1,l=this.parts,[p,u]=Pe(e,t);if(this.el=r.createElement(p,s),$.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=$.nextNode())!==null&&l.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith(be)){let m=u[a++],f=i.getAttribute(c).split(v),R=/([.?@])?(.*)/.exec(m);l.push({type:1,index:o,name:R[2],strings:f,ctor:R[1]==="."?G:R[1]==="?"?V:R[1]==="@"?F:S}),i.removeAttribute(c)}else c.startsWith(v)&&(l.push({type:6,index:o}),i.removeAttribute(c));if(xe.test(i.tagName)){let c=i.textContent.split(v),m=c.length-1;if(m>0){i.textContent=I?I.emptyScript:"";for(let f=0;f<m;f++)i.append(c[f],z()),$.nextNode(),l.push({type:2,index:++o});i.append(c[m],z())}}}else if(i.nodeType===8)if(i.data===me)l.push({type:2,index:o});else{let c=-1;for(;(c=i.data.indexOf(v,c+1))!==-1;)l.push({type:7,index:o}),c+=v.length-1}o++}}static createElement(e,t){let s=_.createElement("template");return s.innerHTML=e,s}};function A(r,e,t=r,s){if(e===w)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,o=P(e)?void 0:e._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(r),i._$AT(r,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=A(r,i._$AS(r,e.values),i,s)),e}var B=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??_).importNode(t,!0);$.currentNode=i;let o=$.nextNode(),a=0,d=0,l=s[0];for(;l!==void 0;){if(a===l.index){let p;l.type===2?p=new O(o,o.nextSibling,this,e):l.type===1?p=new l.ctor(o,l.name,l.strings,this,e):l.type===6&&(p=new q(o,this,e)),this._$AV.push(p),l=s[++d]}a!==l?.index&&(o=$.nextNode(),a++)}return $.currentNode=_,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},O=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=A(this,e,t),P(e)?e===h||e==null||e===""?(this._$AH!==h&&this._$AR(),this._$AH=h):e!==this._$AH&&e!==w&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):ze(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==h&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(_.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=T.createElement(fe(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let o=new B(i,this),a=o.u(this.options);o.p(t),this.T(a),this._$AH=o}}_$AC(e){let t=ge.get(e.strings);return t===void 0&&ge.set(e.strings,t=new T(e)),t}k(e){Y(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let o of e)i===t.length?t.push(s=new r(this.O(z()),this.O(z()),this,this.options)):s=t[i],s._$AI(o),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=le(e).nextSibling;le(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},S=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,o){this.type=1,this._$AH=h,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=h}_$AI(e,t=this,s,i){let o=this.strings,a=!1;if(o===void 0)e=A(this,e,t,0),a=!P(e)||e!==this._$AH&&e!==w,a&&(this._$AH=e);else{let d=e,l,p;for(e=o[0],l=0;l<o.length-1;l++)p=A(this,d[s+l],t,l),p===w&&(p=this._$AH[l]),a||=!P(p)||p!==this._$AH[l],p===h?e=h:e!==h&&(e+=(p??"")+o[l+1]),this._$AH[l]=p}a&&!i&&this.j(e)}j(e){e===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},G=class extends S{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===h?void 0:e}},V=class extends S{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==h)}},F=class extends S{constructor(e,t,s,i,o){super(e,t,s,i,o),this.type=5}_$AI(e,t=this){if((e=A(this,e,t,0)??h)===w)return;let s=this._$AH,i=e===h&&s!==h||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==h&&(s===h||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},q=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){A(this,e)}};var Te=W.litHtmlPolyfillSupport;Te?.(T,O),(W.litHtmlVersions??=[]).push("3.3.2");var ve=(r,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let o=t?.renderBefore??null;s._$litPart$=i=new O(e.insertBefore(z(),o),o,void 0,t??{})}return i._$AI(r),i};var J=globalThis,g=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ve(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return w}};g._$litElement$=!0,g.finalized=!0,J.litElementHydrateSupport?.({LitElement:g});var Oe=J.litElementPolyfillSupport;Oe?.({LitElement:g});(J.litElementVersions??=[]).push("4.2.2");var Q=class extends g{static properties={value:{type:Number},label:{type:String},size:{type:String},animated:{type:Boolean},_displayValue:{type:Number,state:!0}};static styles=b`
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
  `;constructor(){super(),this.value=0,this.label="",this.size="md",this.animated=!0,this._displayValue=0}updated(e){e.has("value")&&(this.animated?this._animateValue():this._displayValue=this.value)}_animateValue(){let e=this._displayValue||0,t=this.value||0,s=700,i=performance.now(),o=a=>{let d=Math.min((a-i)/s,1);this._displayValue=Math.round(e+(t-e)*(1-Math.pow(1-d,3))),d<1&&requestAnimationFrame(o)};requestAnimationFrame(o)}_getColorClass(){return this.value>=71?"high":this.value>=41?"mid":"low"}_getDims(){switch(this.size){case"sm":return{s:56,r:22,f:14};case"lg":return{s:110,r:46,f:28};default:return{s:80,r:34,f:20}}}render(){let e=this._getDims(),t=2*Math.PI*e.r,s=t-t*(this.value||0)/100;return n`
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
    `}};customElements.define("synthux-score",Q);var X=class extends g{static properties={ollamaStatus:{type:Object},isAnalyzing:{type:Boolean},progress:{type:Object},pageInfo:{type:Object},selectedProfiles:{type:Array},mode:{type:String},logEntries:{type:Array}};static styles=b`
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
  `;constructor(){super(),this.ollamaStatus={connected:!1,models:[]},this.isAnalyzing=!1,this.progress=null,this.pageInfo=null,this.selectedProfiles=["first-time","power-user","accessibility"],this.mode="deep",this.logEntries=[],this._fetchPageInfo(),chrome.tabs?.onActivated?.addListener(()=>this._fetchPageInfo()),chrome.tabs?.onUpdated?.addListener((e,t)=>{t.status==="complete"&&this._fetchPageInfo()})}updated(e){if(e.has("progress")&&this.progress&&this._addLogEntry(this.progress),e.has("isAnalyzing")){if(this.isAnalyzing)this.logEntries=[{time:this._logTime(),msg:"Starting analysis...",done:!1}];else if(this.logEntries.length>0){let s={...this.logEntries[this.logEntries.length-1],done:!0};this.logEntries=[...this.logEntries.slice(0,-1),s,{time:this._logTime(),msg:"Done.",done:!0}]}}let t=this.shadowRoot?.getElementById("terminal-log");t&&(t.scrollTop=t.scrollHeight)}_addLogEntry(e){let t=e.message||"";if(!t)return;let s=this.logEntries[this.logEntries.length-1];s&&s.msg===t||(this.logEntries=[...this.logEntries,{time:this._logTime(),msg:t,done:!1}])}_logTime(){let e=new Date;return`${String(e.getHours()).padStart(2,"0")}:${String(e.getMinutes()).padStart(2,"0")}:${String(e.getSeconds()).padStart(2,"0")}`}get _isAnalyzablePage(){let e=this.pageInfo?.url||"";return e.startsWith("http://")||e.startsWith("https://")}async _fetchPageInfo(){if(!this.isAnalyzing)try{let[e]=await chrome.tabs.query({active:!0,currentWindow:!0});e&&(this.pageInfo={title:e.title||"Untitled",url:e.url||""})}catch{this.pageInfo={title:"Unable to detect page",url:""}}}_toggleProfile(e){if(this.isAnalyzing)return;let t=[...this.selectedProfiles],s=t.indexOf(e);s>-1?t.length>1&&t.splice(s,1):t.push(e),this.selectedProfiles=t}_setMode(e){this.isAnalyzing||(this.mode=e)}async _startAnalysis(){if(!(this.isAnalyzing||!this.ollamaStatus?.connected)){this.dispatchEvent(new CustomEvent("analysis-start"));try{await chrome.runtime.sendMessage({type:"START_ANALYSIS",payload:{mode:this.mode,profiles:this.selectedProfiles}})}catch(e){console.error("[synthux] Failed to start analysis:",e),this.dispatchEvent(new CustomEvent("analysis-end"))}}}async _cancelAnalysis(){try{await chrome.runtime.sendMessage({type:"CANCEL_ANALYSIS"})}catch{}this.dispatchEvent(new CustomEvent("analysis-end"))}_renderProfileCard(e,t,s){let i=this.selectedProfiles.includes(e);return n`
      <div 
        class="profile-card ${i?"selected":""}"
        @click="${()=>this._toggleProfile(e)}"
        role="checkbox"
        aria-checked="${i}"
        tabindex="0"
        @keydown="${o=>o.key==="Enter"&&this._toggleProfile(e)}"
      >
        <div class="profile-details">
          <div class="profile-name">${t}</div>
          <div class="profile-desc">${s}</div>
        </div>
        <div class="profile-check"></div>
      </div>
    `}render(){let e=this.ollamaStatus?.connected,t=e&&this._isAnalyzablePage&&this.selectedProfiles.length>0;return n`
      ${this.pageInfo?n`
        <div class="page-info">
          <div class="page-title">${this.pageInfo.title}</div>
          <div class="page-url">${this.pageInfo.url}</div>
          ${!this._isAnalyzablePage&&this.pageInfo.url?n`
            <div class="page-warning">Navigate to a website to analyze.</div>
          `:""}
        </div>
      `:""}

      ${e?"":n`
        <div class="offline-notice">
          <span class="offline-dot"></span>
          <div>
            <strong>Ollama not connected.</strong> Check Settings to configure your connection.
          </div>
        </div>
      `}

      <div class="section-header">Profiles</div>
      <div class="profiles">
        ${this._renderProfileCard("first-time","First-Time Visitor","New to the site, exploring for the first time")}
        ${this._renderProfileCard("power-user","Power User","Experienced, focused on speed and efficiency")}
        ${this._renderProfileCard("accessibility","Accessibility User","Relies on screen reader and keyboard")}
      </div>

      <div class="section-header">Mode</div>
      <div class="mode-selector">
        <button class="mode-btn ${this.mode==="quick"?"active":""}" @click="${()=>this._setMode("quick")}">
          <span class="mode-label">Quick</span>
          <span class="mode-desc">3 heuristics · ~9 min</span>
        </button>
        <button class="mode-btn ${this.mode==="deep"?"active":""}" @click="${()=>this._setMode("deep")}">
          <span class="mode-label">Deep</span>
          <span class="mode-desc">10 heuristics · ~20 min</span>
        </button>
      </div>

      ${this.isAnalyzing?n`
        <button class="analyze-btn analyzing" disabled>Analyzing...</button>
      `:n`
        <button 
          class="analyze-btn"
          ?disabled="${!t}"
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
              ${this.logEntries.map((s,i)=>n`
                <div class="log-line">
                  <span class="log-time">${s.time}</span>
                  <span class="log-prefix">▶</span>
                  <span class="log-msg ${i===this.logEntries.length-1?"active":""} ${s.done?"success":""}">${s.msg}</span>
                </div>
              `)}
            </div>
          </div>

          <button class="cancel-btn" @click="${this._cancelAnalysis}">Cancel</button>
        </div>
      `:""}
    `}};customElements.define("synthux-scanner",X);var Z=class extends g{static properties={report:{type:Object},history:{type:Array},showHistory:{type:Boolean},activeProfile:{type:String},expandedHeuristic:{type:String},copied:{type:Boolean}};static styles=b`
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
      padding: 8px 0;
      border-bottom: 1px solid var(--sx-border, rgba(255,255,255,0.04));
    }

    .issue-item:last-child { border-bottom: none; }

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
  `;constructor(){super(),this.report=null,this.history=[],this.showHistory=!1,this.activeProfile="",this.expandedHeuristic="",this.copied=!1}updated(e){if(e.has("report")&&this.report){let t=Object.keys(this.report.profileResults||{});t.length>0&&!this.activeProfile&&(this.activeProfile=t[0])}}_toggleHeuristic(e){this.expandedHeuristic=this.expandedHeuristic===e?"":e}_getScoreClass(e){return e>=71?"high":e>=41?"mid":"low"}_downloadMarkdown(){if(!this.report?.markdown)return;let t=`design-change-${this._shortenUrl(this.report.url).replace(/[\/:.]/g,"-").replace(/-+/g,"-")}.md`,s=new Blob([this.report.markdown],{type:"text/markdown;charset=utf-8"}),i=URL.createObjectURL(s),o=document.createElement("a");o.href=i,o.download=t,o.click(),URL.revokeObjectURL(i),this.copied=!0,setTimeout(()=>{this.copied=!1},2e3)}render(){if(this.showHistory)return this._renderHistory();if(!this.report)return n`
        <div class="empty-state">
          <div class="empty-title">No report yet</div>
          <div class="empty-desc">Go to Scan tab to analyze a page.</div>
        </div>
      `;let e=this.report,t=e.profileResults?.[this.activeProfile];return n`
      <div class="overall-section">
        <synthux-score value="${e.overallScore||0}" label="Overall UX Score" size="lg"></synthux-score>
        <div class="report-meta">
          ${this._shortenUrl(e.url)}${e.model?n`<br>${e.model} · `:""}${e.mode==="deep"?"Deep":"Quick"}
          ${e.timestamp?n` · ${new Date(e.timestamp).toLocaleString()}`:""}
        </div>
      </div>

      <div class="profile-tabs">
        ${Object.entries(e.profileResults||{}).map(([s,i])=>n`
          <button class="profile-tab ${this.activeProfile===s?"active":""}" @click="${()=>this.activeProfile=s}">
            <span>${i.profile.name?.en||s}</span>
            <span class="profile-tab-score">${i.score}</span>
          </button>
        `)}
      </div>

      ${t?n`
        <div class="section-header">Evaluations</div>
        <div class="heuristic-list">
          ${(t.evaluations||[]).map(s=>n`
            <div class="heuristic-card">
              <div class="heuristic-header" @click="${()=>this._toggleHeuristic(s.heuristicId)}">
                <span class="heuristic-score-badge ${this._getScoreClass(s.score)}">${s.score}</span>
                <span class="heuristic-name">${s.heuristicName?.en||s.heuristicId}</span>
                <span class="heuristic-chevron ${this.expandedHeuristic===s.heuristicId?"open":""}">▶</span>
              </div>
              ${this.expandedHeuristic===s.heuristicId?n`
                <div class="heuristic-detail">
                  <div class="heuristic-summary">${s.summary}</div>
                  ${(s.issues||[]).map(i=>n`
                    <div class="issue-item">
                      <span class="severity-dot ${i.severity}"></span>
                      <div class="issue-content">
                        <div class="issue-desc">${i.description}</div>
                        ${i.element?n`<div class="issue-element">${i.element}</div>`:""}
                        ${i.recommendation?n`<div class="issue-recommendation">${i.recommendation}</div>`:""}
                      </div>
                    </div>
                  `)}
                  ${(s.positives||[]).map(i=>n`
                    <div class="positive-item">
                      <span class="positive-dot"></span>
                      <span>${i}</span>
                    </div>
                  `)}
                </div>
              `:""}
            </div>
          `)}
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
      `:""}

      <div class="export-bar">
        <button class="export-btn ${this.copied?"copied":""}" @click="${this._downloadMarkdown}">
          ${this.copied?"Downloaded \u2713":"Download design-change.md"}
        </button>
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
    `}_loadFromHistory(e){this.dispatchEvent(new CustomEvent("load-report",{detail:{id:e},bubbles:!0,composed:!0}))}_deleteFromHistory(e){this.dispatchEvent(new CustomEvent("delete-report",{detail:{id:e},bubbles:!0,composed:!0}))}_shortenUrl(e){if(!e)return"";try{let t=new URL(e);return t.hostname+(t.pathname!=="/"?t.pathname.substring(0,30)+(t.pathname.length>30?"...":""):"")}catch{return e.substring(0,40)+(e.length>40?"...":"")}}_formatDate(e){if(!e)return"";try{let t=new Date(e),i=new Date-t;return i<6e4?"Just now":i<36e5?`${Math.floor(i/6e4)}m ago`:i<864e5?`${Math.floor(i/36e5)}h ago`:t.toLocaleDateString()}catch{return""}}};customElements.define("synthux-report",Z);var ee=class extends g{static properties={ollamaStatus:{type:Object},endpoint:{type:String},model:{type:String},models:{type:Array},language:{type:String},connectionState:{type:String},showSetupGuide:{type:Boolean},errorType:{type:String},_saved:{type:Boolean,state:!0}};static styles=b`
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
  `;constructor(){super(),this.ollamaStatus={connected:!1,models:[]},this.endpoint="http://localhost:11434",this.model="gemma4:31b",this.models=[],this.language="en",this.connectionState="idle",this.showSetupGuide=!1,this.errorType="",this._saved=!1,this._copiedCmd="",this._loadSettings()}async _loadSettings(){try{let e=await chrome.storage.local.get({ollamaEndpoint:"http://localhost:11434",ollamaModel:"gemma4:31b",language:"en"});this.endpoint=e.ollamaEndpoint,this.model=e.ollamaModel,this.language=e.language,this.ollamaStatus?.connected&&(this.models=(this.ollamaStatus.models||[]).map(t=>t.name||t))}catch{}}async _testConnection(){this.connectionState="testing",this.errorType="";try{let e=await fetch(`${this.endpoint}/api/tags`,{signal:AbortSignal.timeout(5e3)});if(e.ok){let t=await e.json();this.models=(t.models||[]).map(s=>s.name),this.connectionState="connected",this.errorType="",this.models.length>0&&!this.models.includes(this.model)&&(this.model=this.models[0]),this.dispatchEvent(new CustomEvent("status-changed",{detail:{connected:!0,models:t.models||[]}}))}else e.status===403?(this.connectionState="failed",this.errorType="cors",this.showSetupGuide=!0,this.dispatchEvent(new CustomEvent("status-changed",{detail:{connected:!1,models:[]}}))):(this.connectionState="failed",this.errorType="unknown",this.dispatchEvent(new CustomEvent("status-changed",{detail:{connected:!1,models:[]}})))}catch(e){this.connectionState="failed",this.errorType=e.name==="TimeoutError"?"timeout":"offline",this.showSetupGuide=!0,this.dispatchEvent(new CustomEvent("status-changed",{detail:{connected:!1,models:[]}}))}setTimeout(()=>{this.connectionState==="connected"&&(this.connectionState="idle")},3e3)}async _saveSettings(){try{await chrome.runtime.sendMessage({type:"SAVE_SETTINGS",payload:{ollamaEndpoint:this.endpoint,ollamaModel:this.model,language:this.language}}),this._saved=!0,setTimeout(()=>{this._saved=!1},2e3)}catch(e){console.error("[synthux] Failed to save:",e)}}async _copyCommand(e,t){try{await navigator.clipboard.writeText(e)}catch{let s=document.createElement("textarea");s.value=e,document.body.appendChild(s),s.select(),document.execCommand("copy"),document.body.removeChild(s)}this._copiedCmd=t,this.requestUpdate(),setTimeout(()=>{this._copiedCmd="",this.requestUpdate()},2e3)}_getTestLabel(){switch(this.connectionState){case"testing":return"Testing...";case"connected":return"Connected";case"failed":return this.errorType==="cors"?"Blocked (CORS)":this.errorType==="timeout"?"Timed out":this.errorType==="offline"?"Not reachable":"Connection failed";default:return"Test Connection"}}render(){return n`
      <div class="section">
        <div class="section-header">Connection</div>
        <div class="settings-card">
          <div class="field">
            <label class="field-label">Endpoint</label>
            <input class="field-input" type="url" .value="${this.endpoint}" @input="${e=>this.endpoint=e.target.value}" placeholder="http://localhost:11434" />
          </div>
          <div class="field">
            <label class="field-label">Model</label>
            ${this.models.length>0?n`
              <select class="field-select" .value="${this.model}" @change="${e=>this.model=e.target.value}">
                ${this.models.map(e=>n`<option value="${e}" ?selected="${e===this.model}">${e}</option>`)}
              </select>
            `:n`
              <input class="field-input" type="text" .value="${this.model}" @input="${e=>this.model=e.target.value}" placeholder="gemma4:31b" />
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

        ${this.errorType==="offline"||this.errorType==="timeout"?n`
          <div class="error-hint">
            <span class="error-hint-dot"></span>
            <div>
              <strong>Ollama not running.</strong> Make sure Ollama is installed and running on your machine.
            </div>
          </div>
        `:""}
      </div>

      <div class="setup-guide">
        <button class="setup-toggle" @click="${()=>this.showSetupGuide=!this.showSetupGuide}">
          Ollama Setup Guide
          <span class="setup-chevron ${this.showSetupGuide?"open":""}">▶</span>
        </button>

        ${this.showSetupGuide?n`
          <div class="setup-content">
            <div class="setup-step">
              <div class="step-title"><span class="step-number">1</span> Install Ollama</div>
              <div class="step-desc">Download from ollama.com and install. Available for macOS, Linux, and Windows.</div>
              <div class="code-block">
                <button class="copy-btn ${this._copiedCmd==="url"?"copied":""}" @click="${()=>this._copyCommand("https://ollama.com/download","url")}">${this._copiedCmd==="url"?"Copied":"Copy"}</button>
                <code>https://ollama.com/download</code>
              </div>
            </div>

            <div class="setup-step">
              <div class="step-title"><span class="step-number">2</span> Download a model</div>
              <div class="step-desc">Pull a language model. Any model works — pick one that fits your hardware:</div>
              <div class="code-block">
                <button class="copy-btn ${this._copiedCmd==="pull"?"copied":""}" @click="${()=>this._copyCommand("ollama pull gemma4","pull")}">${this._copiedCmd==="pull"?"Copied":"Copy"}</button>
                <code>ollama pull gemma4</code>
              </div>
              <div class="step-desc" style="margin-top: 6px; font-size: 10px; color: var(--sx-text-tertiary, #8a8a96);">Alternatives: <code style="font-size: 10px;">ollama pull qwen3.5</code> or <code style="font-size: 10px;">ollama pull llama4</code></div>
              <div class="step-desc" style="margin-top: 4px; font-size: 10px; color: var(--sx-text-tertiary, #8a8a96);">Using <strong>LM Studio</strong>? Skip to step 3 — no model pull needed. Change the endpoint in Settings to <code style="font-size: 10px;">http://localhost:1234</code></div>
            </div>

            <div class="setup-step">
              <div class="step-title"><span class="step-number">3</span> Enable Chrome extension access</div>
              <div class="step-desc">Ollama blocks browser extensions by default. LM Studio users can skip this step.</div>
              <div class="step-desc"><strong>macOS (app):</strong></div>
              <div class="code-block">
                <button class="copy-btn ${this._copiedCmd==="macos"?"copied":""}" @click="${()=>this._copyCommand('launchctl setenv OLLAMA_ORIGINS \\"*\\"',"macos")}">${this._copiedCmd==="macos"?"Copied":"Copy"}</button>
                <code>launchctl setenv OLLAMA_ORIGINS "*"</code>
              </div>
              <div class="step-desc" style="margin-top: 8px;"><strong>Linux / Terminal:</strong></div>
              <div class="code-block">
                <button class="copy-btn ${this._copiedCmd==="linux"?"copied":""}" @click="${()=>this._copyCommand(`export OLLAMA_ORIGINS=\\"*\\"
ollama serve`,"linux")}">${this._copiedCmd==="linux"?"Copied":"Copy"}</button>
                <code>export OLLAMA_ORIGINS="*"
ollama serve</code>
              </div>
              <div class="step-desc" style="margin-top: 8px;"><strong>Windows (PowerShell):</strong></div>
              <div class="code-block">
                <button class="copy-btn ${this._copiedCmd==="win"?"copied":""}" @click="${()=>this._copyCommand("[Environment]::SetEnvironmentVariable('OLLAMA_ORIGINS', '*', 'User')","win")}">${this._copiedCmd==="win"?"Copied":"Copy"}</button>
                <code>[Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", "User")</code>
              </div>
            </div>

            <div class="setup-step">
              <div class="step-title"><span class="step-number">4</span> Restart Ollama</div>
              <div class="step-desc"><strong>Important:</strong> After running the command, quit Ollama from the menu bar and reopen it for changes to take effect.</div>
              <div class="step-desc" style="color: var(--sx-warning, #eab308);">\u26a0\ufe0f Ollama updates may reset this setting. If you get a CORS error after updating, repeat step 3 and restart.</div>
            </div>
          </div>
        `:""}
      </div>

      <div class="section">
        <div class="section-header">Report Language</div>
        <div class="lang-options" style="gap: 4px;">
          <button class="lang-btn ${this.language==="en"?"active":""}" @click="${()=>this.language="en"}" style="padding: 6px 12px; font-size: 11px;">EN</button>
          <button class="lang-btn ${this.language==="tr"?"active":""}" @click="${()=>this.language="tr"}" style="padding: 6px 12px; font-size: 11px;">TR</button>
        </div>
      </div>

      <button class="save-btn ${this._saved?"saved":""}" @click="${this._saveSettings}">${this._saved?"Saved":"Save Settings"}</button>

      <div class="section" style="margin-top: 32px;">
        <div class="section-header">About</div>
        <div class="settings-card about-card">
          <div class="about-name">synthux</div>
          <div class="about-version">v1.0.0</div>
          <div class="about-desc">AI-powered UX audit. Open source. Privacy first.</div>
          <div class="about-links">
            <a class="about-link" href="https://synthux.app" target="_blank">Website</a>
            <a class="about-link" href="https://github.com/synthuxapp/synthux" target="_blank">GitHub</a>
          </div>
          <div class="about-license">MIT License</div>
        </div>
      </div>
    `}};customElements.define("synthux-settings",ee);var te=class extends g{static properties={activeTab:{type:String},ollamaStatus:{type:Object},report:{type:Object},reportHistory:{type:Array},analysisProgress:{type:Object},isAnalyzing:{type:Boolean}};static styles=b`
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
  `;constructor(){super(),this.activeTab="scan",this.ollamaStatus={connected:!1,models:[]},this.report=null,this.reportHistory=[],this.analysisProgress=null,this.isAnalyzing=!1,this._setupMessageListeners(),this._checkOllamaStatus(),this._startHealthCheck(),this._loadLastReport(),this._loadHistory()}_setupMessageListeners(){chrome.runtime.onMessage.addListener(e=>{switch(e.type){case"ANALYSIS_PROGRESS":this.analysisProgress=e.payload,this.isAnalyzing=!0;break;case"ANALYSIS_COMPLETE":this.report=e.payload,this.isAnalyzing=!1,this.analysisProgress=null,this.activeTab="report",this._loadHistory();break;case"ANALYSIS_ERROR":this.isAnalyzing=!1,this.analysisProgress=null;break;case"ANALYSIS_CANCELLED":this.isAnalyzing=!1,this.analysisProgress=null;break}})}async _checkOllamaStatus(){try{let e=await fetch("http://localhost:11434/api/tags",{signal:AbortSignal.timeout(3e3)});if(e.ok){let t=await e.json();this.ollamaStatus={connected:!0,models:t.models||[]}}else this.ollamaStatus={connected:!1,models:[]}}catch{this.ollamaStatus={connected:!1,models:[]}}}_startHealthCheck(){this._healthInterval=setInterval(()=>this._checkOllamaStatus(),15e3)}disconnectedCallback(){super.disconnectedCallback(),this._healthInterval&&clearInterval(this._healthInterval)}async _loadLastReport(){try{let e=await chrome.storage.local.get("lastReport");e.lastReport&&(this.report=e.lastReport)}catch{}}async _loadHistory(){try{let e=await chrome.runtime.sendMessage({type:"GET_REPORT_HISTORY"});this.reportHistory=e||[]}catch{this.reportHistory=[]}}async _loadHistoryReport(e){let{id:t}=e.detail;try{let s=await chrome.runtime.sendMessage({type:"LOAD_REPORT",payload:{id:t}});s?.report&&(this.report=s.report,this.activeTab="report")}catch(s){console.error("[synthux] Failed to load report:",s)}}async _deleteHistoryReport(e){let{id:t}=e.detail;try{let s=await chrome.runtime.sendMessage({type:"DELETE_REPORT",payload:{id:t}});s?.success&&(this.reportHistory=s.history)}catch(s){console.error("[synthux] Failed to delete report:",s)}}_setTab(e){this.activeTab=e,e==="scan"&&this._checkOllamaStatus()}_handleAnalysisStart(){this.isAnalyzing=!0}_handleAnalysisEnd(){this.isAnalyzing=!1,this.analysisProgress=null}render(){let e=this.ollamaStatus?.connected;return n`
      <!-- Header -->
      <div class="header">
        <div class="logo">
          <img class="logo-img" src="../assets/logo.svg" alt="synthux" />
        </div>
        <div class="status-badge ${e?"connected":"disconnected"}">
          <span class="status-dot ${e?"connected":"disconnected"}"></span>
          ${e?"Connected":"Offline"}
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
    `}};customElements.define("synthux-app",te);export{te as SynthuxApp};
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
