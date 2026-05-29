/* ============================================================================
   morphology-engine.js — the interactive Tamil layer's behaviour.
   Wraps every Tamil/English token from window.MorphData.WORDS (and any
   karaoke-only token) in a clickable span; on click it plays the karaoke
   audio (window.KARAOKE) and opens the word card; a single morpheme opens a
   small hover-info card. Renders the inline worked-example .cardslot cards.

   Load order (in the HTML): audio-data.js → morphology-data.js → this file.
   Styling: morphology-cards.css.
   ========================================================================== */
(function(){
  "use strict";

  // ---- shared data (set by morphology-data.js / audio-data.js) ----
  var MD     = window.MorphData || {};
  var BUILDS = MD.BUILDS || {};
  var WORDS  = MD.WORDS  || {};
  var K      = window.KARAOKE || {};

  var SEG = window.Intl && Intl.Segmenter ? new Intl.Segmenter("ta",{granularity:"grapheme"}) : null;
  function graphemes(s){
    if(SEG){ var o=[]; for(var x of SEG.segment(s)) o.push(x.segment); return o; }
    return Array.from(s);
  }

  // Tokens we react to, longest first so படிச்சிட்டேன் beats படி.
  var TOKENS = Object.keys(WORDS).concat(Object.keys(K).filter(function(t){return !WORDS[t];}));
  TOKENS.sort(function(a,b){return b.length-a.length;});
  function esc(s){return s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");}
  function escHtml(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
  var RE = new RegExp("(" + TOKENS.map(esc).join("|") + ")","g");

  // ---- wrap matching Tamil runs in clickable spans ----
  var SKIP = {SCRIPT:1,STYLE:1,SVG:1,NOSCRIPT:1};
  function wrap(root){
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode:function(n){
        if(!n.nodeValue || !/[஀-௿]/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        for(var p=n.parentNode;p&&p!==root;p=p.parentNode){
          if(SKIP[p.nodeName]) return NodeFilter.FILTER_REJECT;
          if(p.classList&&p.classList.contains("tw")) return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var hits=[],n; while((n=w.nextNode())) hits.push(n);
    hits.forEach(function(node){
      var txt=node.nodeValue; RE.lastIndex=0;
      if(!RE.test(txt)) return;
      RE.lastIndex=0;
      var frag=document.createDocumentFragment(), last=0, m;
      while((m=RE.exec(txt))){
        if(m.index>last) frag.appendChild(document.createTextNode(txt.slice(last,m.index)));
        var sp=document.createElement("span");
        sp.className="tw"; sp.setAttribute("data-w",m[0]); sp.textContent=m[0];
        frag.appendChild(sp);
        last=m.index+m[0].length;
      }
      if(last<txt.length) frag.appendChild(document.createTextNode(txt.slice(last)));
      node.parentNode.replaceChild(frag,node);
    });
  }
  document.querySelectorAll(".wrap,.wide").forEach(wrap);

  // ---- inline worked-example cards (same component, rendered in the article) ----
  document.querySelectorAll(".cardslot").forEach(function(el){
    el.innerHTML = buildPop(el.getAttribute("data-w"), true);
  });

  // ---- audio playback + karaoke highlight ----
  var audio=new Audio(), curSpan=null, raf=0;
  function clearKaraoke(){
    if(curSpan){ curSpan.classList.remove("playing"); curSpan.textContent=curSpan.getAttribute("data-w"); curSpan=null; }
    if(raf){ cancelAnimationFrame(raf); raf=0; }
  }
  function play(span){
    var word=span.getAttribute("data-w"), data=K[word];
    audio.pause(); clearKaraoke();
    if(!data) return;                       // no clip — popup still opens
    curSpan=span; span.classList.add("playing");
    var gs=graphemes(word);
    span.textContent="";
    var atoms=gs.map(function(g){
      var e=document.createElement("span");
      e.className="g"; e.textContent=g; e.style.opacity=".34";
      span.appendChild(e); return e;
    });
    var starts=new Array(gs.length).fill(Infinity);
    var ci=0, gi=0, acc="";
    for(; ci<data.c.length && gi<gs.length; ci++){
      if(starts[gi]===Infinity) starts[gi]=data.s[ci];
      acc+=data.c[ci];
      if(acc===gs[gi]){ acc=""; gi++; }
    }
    for(var k=1;k<starts.length;k++) if(starts[k]===Infinity) starts[k]=starts[k-1];
    audio.src=data.src; audio.currentTime=0;
    audio.play().catch(function(){ clearKaraoke(); });
    (function loop(){
      var t=audio.currentTime;
      atoms.forEach(function(a,i){ a.style.opacity = t>=starts[i] ? "1" : ".34"; });
      if(!audio.paused && !audio.ended) raf=requestAnimationFrame(loop);
    })();
  }
  audio.addEventListener("ended",clearKaraoke);

  // ---- popup / bottom-sheet (with drill-down history) ----
  var back=null, popWord=null, anchor=null, hist=[], hi=-1;
  function closePop(){ if(back){ back.remove(); back=null; popWord=null; hist=[]; hi=-1; } closeMI(); }

  function buildPop(word, inline){
    var info=WORDS[word]||{t:"",d:"Tap to hear it pronounced.",r:"",gl:""};
    var disp = info.seg || [[word, info.gl||"", info.t||""]];
    var en = info.lang==="en" ? " en" : "";

    // segmentation: morpheme + morpheme, clean gloss beneath each
    var grid = '<div class="sec segsec"><div class="seclabel">Segmentation</div><div class="pgrid">' +
      disp.map(function(r){
        return '<div class="pmor" data-w="'+escHtml(r[0])+'">'+
          '<span class="ct tw mor'+en+'" data-w="'+escHtml(r[0])+'">'+escHtml(r[0])+'</span>'+
          '<span class="cg">'+escHtml(r[1]||"·")+'</span></div>';
      }).join('<span class="pplus">+</span>') + '</div></div>';

    // description (translation lives in the header)
    var desc = '<div class="sec"><div class="seclabel">What it means</div>'+
      '<div class="pd">'+info.d+'</div></div>';

    // progressive build (root → word), current step highlighted
    var build='';
    if(info.build && BUILDS[info.build]){
      var navc = inline ? "" : " nav";       // inline cards don't drill the floating popup
      build = '<div class="sec"><div class="seclabel">Progressive build · root → word</div>'+
        BUILDS[info.build].map(function(s){
          var cur = s.w===word;
          return '<div class="brow'+(cur?' cur':'')+'">'+
            '<span class="bw tw'+navc+en+'" data-w="'+escHtml(s.w)+'">'+escHtml(s.w)+'</span>'+
            '<span class="badd">+ '+escHtml(s.gl)+'</span>'+
            '<span class="bm">'+escHtml(s.m)+'</span>'+
            (cur?'<span class="bs">▲ here</span>':'')+'</div>';
        }).join("") + '</div>';
    }

    var hasClip=!!K[word];
    var footL = info.lang==="en" ? "◦ worked example — same shape as the Tamil card"
              : (hasClip ? "▶ tap any word to hear it" : "no audio for this token");
    var footR = info.lang==="en" ? "English"
              : (WORDS[word] ? "<b>grounded</b> · in graph" : "surface token");
    return '<div class="pop'+(inline?" inline":"")+'" role="dialog">'+
      '<div class="ph">'+
        (inline ? '' :
          '<span class="navg">'+
            '<button class="navb back" aria-label="back" title="back">‹</button>'+
            '<button class="navb fwd" aria-label="forward" title="forward">›</button>'+
          '</span>')+
        (inline ? '' :
          '<span class="flag" title="grounded in the knowledge graph">⚑</span>')+
        '<span class="pw tw'+en+'" data-w="'+escHtml(word)+'" title="tap to replay">'+escHtml(word)+'</span>'+
        (info.t?'<div class="psub">'+info.t+'</div>':'')+
        (info.r?'<span class="pr">'+escHtml(info.r)+'</span>':'')+
      '</div>'+
      '<div class="pb">'+ grid + desc + build +'</div>'+
      '<div class="pf"><span>'+footL+'</span><span>'+footR+'</span></div>'+
    '</div>';
  }

  // ---- app-style morpheme hover-info card ----
  var mi=null;
  function closeMI(){ if(mi){ mi.remove(); mi=null; } }
  function openMI(span){
    var word=span.getAttribute("data-w"), info=WORDS[word]||{};
    var r=span.getBoundingClientRect();
    closeMI();
    var en = info.lang==="en" ? " en" : "";
    mi=document.createElement("div"); mi.className="minfo";
    mi.innerHTML=
      '<div><span class="mw tw'+en+'" data-w="'+escHtml(word)+'" title="tap to replay">'+escHtml(word)+'</span>'+
        (info.gl?'<span class="mg">'+escHtml(info.gl)+'</span>':'')+'</div>'+
      (info.t?'<div class="mt">'+info.t+'</div>':'')+
      (info.d?'<div class="md">'+info.d+'</div>':'<div class="md">Tap to hear it pronounced.</div>');
    document.body.appendChild(mi);
    var w=mi.offsetWidth, h=mi.offsetHeight, M=10;
    var left=Math.min(Math.max(M, r.left+r.width/2-w/2), window.innerWidth-w-M);
    var top=r.bottom+8;
    if(top+h>window.innerHeight-M) top=Math.max(M, r.top-h-8);
    mi.style.left=left+"px"; mi.style.top=top+"px";
  }

  function place(){
    if(window.innerWidth<=560 || !back) return;
    var pop=back.querySelector(".pop"), M=12;
    var pw=pop.offsetWidth, ph=pop.offsetHeight;
    pop.style.left=Math.min(Math.max(M,anchor.left), window.innerWidth-pw-M)+"px";
    pop.style.top =Math.min(Math.max(M,anchor.top ), window.innerHeight-ph-M)+"px";
  }
  function render(word){                       // swap content, keep position
    closeMI();
    popWord=word;
    back.innerHTML=buildPop(word);
    back.querySelector(".back").disabled = hi<=0;
    back.querySelector(".fwd").disabled  = hi>=hist.length-1;
    place();
  }
  function openPop(span){
    var r=span.getBoundingClientRect(), word=span.getAttribute("data-w");
    closePop();
    back=document.createElement("div"); back.className="pop-back";
    document.body.appendChild(back);
    anchor={left:r.left, top:r.bottom+8};
    hist=[word]; hi=0; render(word);
    back.addEventListener("click",function(e){ if(e.target===back) closePop(); });
  }
  function navTo(word){                         // drill in — push history
    hist=hist.slice(0,hi+1); hist.push(word); hi=hist.length-1; render(word);
  }

  // ---- one delegated click handler ----
  document.addEventListener("click",function(e){
    // click outside the morpheme card (and not on another morpheme) closes it
    if(mi && !e.target.closest(".minfo") && !e.target.closest(".mor")) closeMI();
    if(back){
      var bb=e.target.closest(".navb");
      if(bb){
        e.preventDefault(); e.stopPropagation();
        if(bb.classList.contains("back") && hi>0){ hi--; render(hist[hi]); }
        else if(bb.classList.contains("fwd") && hi<hist.length-1){ hi++; render(hist[hi]); }
        return;
      }
    }
    var tw=e.target.closest(".tw");
    var morBox=e.target.closest(".pmor");
    if(!tw && morBox) tw=morBox.querySelector(".ct");   // whole column is clickable
    if(!tw) return;
    e.preventDefault(); e.stopPropagation();
    var word=tw.getAttribute("data-w");
    play(tw);
    if(tw.closest(".minfo")){ hideHint(); return; }              // replay only
    if(tw.classList.contains("mor")){ openMI(tw); hideHint(); return; } // morpheme → hover-info
    var inPop=tw.closest(".pop");
    if(!inPop){ openPop(tw); }
    else if(tw.classList.contains("nav") && WORDS[word] && word!==popWord){ navTo(word); }
    hideHint();
  });
  document.addEventListener("keydown",function(e){ if(e.key==="Escape"){ closePop(); audio.pause(); clearKaraoke(); }});

  // ---- first-visit hint ----
  var hint=document.createElement("div");
  hint.className="hint"; hint.textContent="↳ tap any Tamil word to hear it & see its parts";
  document.body.appendChild(hint);
  var hintTimer=setTimeout(hideHint,9000);
  function hideHint(){ clearTimeout(hintTimer); if(hint){ hint.style.opacity="0"; setTimeout(function(){hint&&hint.remove();hint=null;},500);} }
})();
