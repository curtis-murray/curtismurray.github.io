/* ============================================================================
   morphology-data.js — the morphology dictionary for the blog series.
   Shared across every post; morphology-engine.js reads window.MorphData.
   Drawn from the posts' own content (not a DB). To add a word: add a WORDS
   entry (and a BUILDS chain if it has a root→word progression), then list the
   Tamil token in gen-audio.mjs TOKENS and run `node gen-audio.mjs`.

   BUILDS  — progressive root→word chains, one morpheme per step.
   WORDS   — per-token card data:
     r:romanisation · gl:gloss code · t:gloss/translation · d:note · lang:"en" for English
     seg:[form,glossCode,what-it-does] — SURFACE forms; they concatenate to the word
     build: key into BUILDS
   ========================================================================== */
window.MorphData = (function(){

  // ---- Progressive-build chains (root → word, one morpheme per step) ----
  var BUILDS = {
    learn: [
      { w:"learn",    gl:"root", m:"the root verb “learn”" },
      { w:"learner",  gl:"-er",  m:"+ agentive “-er” (verb → noun) → “one who learns”" },
      { w:"learners", gl:"-s",   m:"+ plural “-s” → “people who learn”" }
    ],
    padi: [
      { w:"படி",          gl:"read/study", m:"the root verb — “study / read”" },
      { w:"படிச்சு",       gl:"AVP",        m:"+ participle / converb → “having studied”" },
      { w:"படிச்சிட்டு",   gl:"COMPL",      m:"+ completive auxiliary விடு, v‑dropped → இட்டு → “having definitely studied”" },
      { w:"படிச்சிட்டேன்", gl:"1SG",        m:"+ “I” on the completive's past stem → “I've studied it — and it's done”" }
    ],
    padikka: [
      { w:"படி",          gl:"read/study", m:"the root verb — “study”" },
      { w:"படிக்க",        gl:"-க்க",       m:"+ class formant / infinitive → “to study”" },
      { w:"படிக்கற",       gl:"PRES",       m:"+ present tense → “…studying” (bound stem)" },
      { w:"படிக்கறாங்க",   gl:"3PL",        m:"+ 3PL / polite agreement → “they're studying”" }
    ],
    padikkapooga: [
      { w:"படி",                gl:"read/study", m:"the root verb — “study” (Class VII strong)" },
      { w:"படிக்க",            gl:"INF.STRONG", m:"+ strong infinitive of purpose → “to study”" },
      { w:"படிக்கப்போக",       gl:"go.INF",     m:"+ purposive motion போக “go” → “go (in order) to study”" },
      { w:"படிக்கப்போகணும்",   gl:"MUST",       m:"+ necessity modal ணும் (< வேணும்) → “must go to study”" },
      { w:"படிக்கப்போகணும்னா", gl:"COND",       m:"+ conditional னா → “if one must go to study”" }
    ],
    padikkira: [
      { w:"படி",            gl:"read/study",  m:"the root verb — “study” (Class VII strong)" },
      { w:"படிக்கிற்",      gl:"PRES.STRONG", m:"+ strong present relative-participle stem ‑க்கிற‑ (non-finite)" },
      { w:"படிக்கிறவ",      gl:"AJP",         m:"+ adjectival participle அ → “(the one) who is studying”" },
      { w:"படிக்கிறவங்க",   gl:"3PL.ANIM",    m:"+ animate-plural pronoun head ‹அவங்க› → “those who are studying”" }
    ]
  };

  // ---- Morphology dictionary ----
  var WORDS = {
    // — English worked example: a direct parallel to the Tamil card —
    // root + derivational suffix + inflection  ≈  root + participle + auxiliary + agreement
    "learners": { lang:"en", r:"ˈlɜːr-nər-z", gl:"learn·AGT·PL",
      t:"“people who learn”",
      d:"English stacks morphemes onto a root too: a verb, a derivational suffix that changes its category, then an inflection. Same shape as the Tamil card below — read it as the key to the format.",
      seg:[ ["learn","learn","the root verb"],
             ["er","AGT","agentive — “one who ___s” (verb → noun)"],
             ["s","PL","plural inflection"] ],
      build:"learn" },
    "learn": { lang:"en", gl:"ROOT", t:"“learn” — the root",
      d:"The lexical core the suffixes attach to.", build:"learn" },
    "learner": { lang:"en", gl:"learn·AGT", t:"“learner” (noun)",
      d:"<code>learn</code> + agentive <code>-er</code> — a verb turned into “one who does it”.",
      seg:[ ["learn","learn","root"], ["er","AGT","“one who ___s”"] ], build:"learn" },
    "er": { lang:"en", gl:"AGT", t:"“-er” — agentive suffix",
      d:"Turns a verb into “one who does it”: learn → learner." },
    "s": { lang:"en", gl:"PL", t:"“-s” — plural",
      d:"Plural inflection on the noun." },

    // — Tamil: surface segmentation (pieces concatenate to the written word) —
    "படிச்சிட்டேன்": {
      r:"paḍicciṭṭēn", gl:"read/study·AVP·COMPL.PST·1SG", t:"“I've studied/read it — and it's done”",
      d:"Four pieces packed into one word: the verb <span class=\"ta\">படி</span> “study”, a “having done it” participle, an auxiliary that says the action is <em>finished</em> (<span class=\"ta\">விடு</span> “let go”), and “I”. Put together: “I've studied it — and it's done.” The catch: in speech the pieces don't stay separate — the sounds run together at each join (<span class=\"ta\">படிச்சு</span> + <span class=\"ta\">இட்டு</span> + <span class=\"ta\">ஏன்</span> → <span class=\"ta\">படிச்சிட்டேன்</span>), so you can't just chop the word back into parts by its spelling.",
      seg:[
        ["படி","read/study","the root verb"],
        ["ச்சு","AVP","participle / converb — “having ___” (literary ‑த்து)"],
        ["இட்ட்","COMPL.PST","completive auxiliary விடு, v‑dropped, in past"],
        ["ஏன்","1SG","“I” (1st sg.)"]
      ], build:"padi"
    },
    "படி": { r:"paḍi", gl:"ROOT", t:"“study / read”",
      d:"The lexical root the whole derivation tree is built on. Glossed <code>read/study</code> in the graph as <code>word_padi</code> — note the slash: children must inherit this prefix <em>exactly</em>.",
      build:"padi" },
    "ச்சு": { r:"-ccu", gl:"AVP", t:"adverbial / verbal participle (converb)",
      d:"Turns the verb into a non-finite “having ___ed” form so an auxiliary can attach. <span class=\"ta\">படி</span>+<span class=\"ta\">ச்சு</span> → <span class=\"ta\">படிச்சு</span> “having studied”. Literary Tamil writes this participle as <span class=\"ta\">‑த்து</span>; spoken Tamil palatalises it to <span class=\"ta\">‑ச்சு</span>." },
    "இட்டு": { r:"iṭṭu", gl:"COMPL", t:"completive auxiliary விடு, v‑dropped",
      d:"The auxiliary <span class=\"ta\">விடு</span> “let go / release”, used here to mark that the action is finished and done with. In speech <span class=\"ta\">விட்டு</span> regularly loses its <em>v‑</em> and attaches to the participle: <span class=\"ta\">விட்டு → இட்டு</span>." },
    "இட்ட்": { r:"iṭṭ-", gl:"COMPL.PST", t:"completive விடு, v‑dropped, in past",
      d:"The same auxiliary <span class=\"ta\">விடு → இட்டு</span>, here carrying the past tense (its own past stem <span class=\"ta\">இட்ட்</span>). Spoken Tamil fuses tense into the completive rather than marking it separately — this is why the defensible reading is <code>read·AVP·COMPL.PST·1SG</code>, not a separate past morpheme." },
    "ச்சி": { r:"-cci", gl:"AVP", t:"participle, completive-conditioned",
      d:"A surface variant of the participle <span class=\"ta\">ச்சு</span> before the completive. Underlyingly still the AVP morpheme." },
    "(வி)டு": { r:"viḍu", gl:"COMPL", t:"completive auxiliary (citation form)",
      d:"The verb <span class=\"ta\">விடு</span> “let go”. On the surface in this word it appears as <span class=\"ta\">இட்டு</span> (v‑dropped). Here it marks completion — “definitely / done”." },
    "ட்டு": { r:"-ṭṭu", gl:"COMPL", t:"completive tail (older notation)",
      d:"An earlier, less precise notation for the completive in this word. The accurate spoken surface is <span class=\"ta\">இட்டு</span> — the auxiliary <span class=\"ta\">விடு</span> with its <em>v‑</em> dropped." },
    "ட்ட": { r:"-ṭṭa-", gl:"COMPL·PAST", t:"completive + past, fused",
      d:"On the surface the completive and the past-tense marker blur into one chunk you can't split by spelling alone — the completive <span class=\"ta\">விடு</span> followed by the strong past tense, which shows up as <span class=\"ta\">ச்ச</span>, <span class=\"ta\">ட்ட</span>, or <span class=\"ta\">த்த</span>." },
    "ட்டேன்": { r:"-ṭṭēn", gl:"COMPL·PAST·1SG", t:"completive + past + “I”, fused",
      d:"The surface tail that <span class=\"ta\">படிச்சிட்டேன்</span> and <span class=\"ta\">போய்ட்டேன்</span> share. Three underlying morphemes — completive ‹விடு›, past, 1SG — collapse here into one chunk you cannot split by string rules. The shared ending is the first clue the run picks up." },
    "ட்ட்": { r:"-ṭṭ-", gl:"—", t:"not a legal underlying form",
      d:"<span class=\"ta\">ட்ட்</span> with a trailing <em>pulli</em> (the vowel-killing dot). It is <em>not</em> a legal form of <code>morph_past_strong_tt</code> — the graph rejects it and returns the canonical form and the allomorph set. See the traced run." },
    "ஏன்": { r:"-ēn", gl:"1SG", t:"first person singular — “I”",
      d:"The person/number/gender (PNG) suffix that closes the word and names the speaker." },
    "போ": { r:"pō", gl:"ROOT", t:"“go” — root verb",
      d:"The lexical root of <span class=\"ta\">போய்ட்டேன்</span>." },
    "ய்": { r:"-y", gl:"AVP", t:"adverbial participle",
      d:"“having ___” — the non-finite form that lets the verb chain, parallel to <span class=\"ta\">ச்சு</span>." },
    "கோட்டை": { r:"kōṭṭai", gl:"N", t:"“fort” (noun)",
      d:"The noun stem that the clitic <span class=\"ta\">உம்</span> attaches to." },
    "வந்தா": { r:"vandā", gl:"come-COND", t:"conditional stem of “come”",
      d:"“if (X) comes” — the conditional that the concessive <span class=\"ta\">உம்</span> turns into “even if”." },
    "படிச்சு": { r:"paḍiccu", gl:"read/study·AVP", t:"“having studied”",
      d:"Root + participle — the AVP form. The first write of this node was rejected for glossing the root <code>study</code> instead of the parent's <code>read/study</code>; see the traced run.",
      seg:[ ["படி","read/study","root"], ["ச்சு","AVP","“having ___” participle"] ], build:"padi" },
    "படிச்சிட்டு": { r:"paḍicciṭṭu", gl:"read/study·AVP·COMPL", t:"“having definitely studied”",
      d:"Adds the completive auxiliary <span class=\"ta\">விடு</span> (v‑dropped → <span class=\"ta\">இட்டு</span>) on top of <span class=\"ta\">படிச்சு</span>; the participle's final vowel elides at the join.",
      seg:[ ["படி","read/study","root"], ["ச்சு","AVP","participle"], ["இட்டு","COMPL","completive விடு, v‑dropped"] ], build:"padi" },
    "படிச்சிட்ட்": { r:"paḍicciṭṭ-", gl:"read/study·AVP·COMPL.PST", t:"completive in the past",
      d:"The intermediate the agent wrote in the traced run, where the past-tense <em>underlying</em> form had to be corrected before it committed. Spoken Tamil carries the past on the completive auxiliary itself (<span class=\"ta\">இட்ட்</span>), not as a separate morpheme.",
      seg:[ ["படி","read/study","root"], ["ச்சு","AVP","participle"], ["இட்ட்","COMPL.PST","completive விடு, v‑dropped, in past"] ], build:"padi" },
    "போய்ட்டேன்": { r:"pōyṭṭēn", gl:"go·AVP·COMPL.PST·1SG", t:"“I definitely went”",
      d:"The right-anchored near-neighbour found at the start of the run. It shares the completive‑past‑“I” tail <span class=\"ta\">இட்டேன்</span> with the target — immediate evidence for that ending before any analysis was done.",
      seg:[ ["போ","go","root"], ["ய்","AVP","participle"], ["இட்ட்","COMPL.PST","completive விடு, v‑dropped, in past"], ["ஏன்","1SG","“I”"] ] },
    "படிக்கறாங்க": { r:"paḍikkaṟāṅka", gl:"read/study·CL·PRES·3PL",
      t:"“they study / they're studying” (also polite “he/she studies”)",
      d:"Same <span class=\"ta\">படி</span> root as the worked example, but a <em>present-tense</em> inflection — proof the system isn't a one-trick completive demo. Colloquial; the literary form is <span class=\"ta\">படிக்கிறார்கள்</span>. Spoken Tamil drops the literary <span class=\"ta\">‑இ‑</span> and contracts <span class=\"ta\">‑ஆர்கள் → ‑ஆங்க</span>, so the pieces don't cut cleanly out of the string — the same lesson as the completive word.",
      seg:[ ["படி","read/study","the root verb"], ["க்க","CL","class / infinitive formant — “to ___”"], ["ற","PRES","present tense (spoken reflex of literary ‑கிற‑)"], ["ஆங்க","3PL","3rd person plural / polite agreement"] ],
      build:"padikka" },
    "படிக்க": { r:"paḍikka", gl:"read/study·INF.STRONG", t:"“to study” — the strong infinitive",
      d:"<span class=\"ta\">படி</span> + the strong infinitive <span class=\"ta\">‑க்க‑</span>. Class VII strong verbs take this gemination; it is the purpose infinitive that a motion auxiliary like <span class=\"ta\">போக</span> attaches to.",
      seg:[ ["படி","read/study","root"], ["க்க","INF.STRONG","strong infinitive"] ], build:"padikkapooga" },
    "படிக்கற": { r:"paḍikkaṟa", gl:"read/study·CL·PRES", t:"present stem (bound)",
      d:"<span class=\"ta\">படிக்க</span> + present <span class=\"ta\">‑ற‑</span>. Not a free word on its own — it needs a person ending; here it waits for <span class=\"ta\">‑ஆங்க</span>.",
      seg:[ ["படி","read/study","root"], ["க்க","CL","class formant"], ["ற","PRES","present tense"] ], build:"padikka" },
    "க்க": { r:"-kka-", gl:"CL", t:"class / infinitive formant",
      d:"The gemination strong (class‑VII) verbs like <span class=\"ta\">படி</span> take before an infinitive or tense suffix. By itself <span class=\"ta\">படிக்க</span> is the infinitive “to study”." },
    "ற": { r:"-ṟa-", gl:"PRES", t:"present tense",
      d:"Spoken-Tamil present-tense marker — the reduced reflex of literary <span class=\"ta\">‑கிற‑</span> (the <span class=\"ta\">‑இ‑</span> drops in speech: <span class=\"ta\">படிக்கிற → படிக்கற</span>)." },
    "ஆங்க": { r:"-āṅka", gl:"3PL", t:"3rd person plural / polite agreement",
      d:"Spoken contraction of literary <span class=\"ta\">‑ஆர்கள்</span> ‑ārkaḷ. Marks a plural subject, or a single person addressed/referred to politely." },
    "படிக்கிறவங்க": { r:"paḍikkiṟavaṅga", gl:"read/study·PRES.STRONG·AJP·3PL.ANIM",
      t:"“those who are studying (right now)”",
      d:"One verb carrying four pieces: the root <span class=\"ta\">படி</span> “study”, a present-tense stem <span class=\"ta\">‑க்கிற‑</span>, a participle that turns it into “the one who is studying”, and a casual “they” <span class=\"ta\">அவங்க</span> on the end to make it a <em>group of people</em>. So literally: “the ones who are studying right now.” In speech the last two pieces blur together into <span class=\"ta\">‑வங்க</span>.",
      seg:[ ["படி","read/study","Class VII strong root"],
             ["க்கிற","PRES.STRONG","strong present relative-participle stem"],
             ["வ","AJP","adjectival participle ‹அ›, glided to ‹வ›"],
             ["ங்க","3PL.ANIM","animate-plural pronoun head ‹அவங்க›, contracted"] ],
      build:"padikkira" },
    "படிக்கிற்": { r:"paḍikkiṟ", gl:"read/study·PRES.STRONG", t:"strong present-participle stem",
      d:"<span class=\"ta\">படி</span> + the strong present relative-participle stem <span class=\"ta\">‑க்கிற‑</span>. Non-finite — like its future counterpart <span class=\"ta\">படிப்ப்</span>, it takes no person ending; the agentive head nominalises it.",
      seg:[ ["படி","read/study","root"], ["க்கிற","PRES.STRONG","strong present stem"] ], build:"padikkira" },
    "படிக்கிறவ": { r:"paḍikkiṟava", gl:"read/study·PRES.STRONG·AJP", t:"present stem + adjectival participle",
      d:"The present stem plus the adjectival participle <span class=\"ta\">அ</span> (AJP) — “(the one) who is studying”. The participle surfaces as a glide <span class=\"ta\">வ</span> after the stem; a pronoun head then nominalises it into <span class=\"ta\">படிக்கிறவங்க</span>.",
      seg:[ ["படி","read/study","root"], ["க்கிற","PRES.STRONG","strong present stem"], ["வ","AJP","adjectival participle ‹அ›"] ], build:"padikkira" },
    "க்கிற": { r:"-kkiṟa-", gl:"PRES.STRONG", t:"strong present-participle stem",
      d:"For Class VII strong verbs like <span class=\"ta\">படி</span> the present stem is <span class=\"ta\">‑க்கிற‑</span> (future <span class=\"ta\">‑ப்ப‑</span>, past <span class=\"ta\">‑த்த்/‑ச்ச்‑</span>). Non-finite, so the agentive head can nominalise it." },
    "வ": { r:"-va", gl:"AJP", t:"adjectival participle (relative participle)",
      d:"The participle <span class=\"ta\">அ</span> that turns a verb into a modifier — “(the one) who ___s”. After the present stem it surfaces as a glide <span class=\"ta\">வ</span>; adding a pronoun on the end (“they”) then turns it into a noun: “the one(s) who ___”." },
    "ங்க": { r:"-ṅga", gl:"3PL.ANIM", t:"animate-plural pronoun head ‹அவங்க›",
      d:"The casual distal animate-plural pronoun <span class=\"ta\">அவங்க</span> “they / those people”, here serving as the head of the participial nominalisation. It contracts to surface <span class=\"ta\">‑வங்க</span> after the participle, and is restricted to the distal / unmarked deictic series — not <span class=\"ta\">இ‑ / எ‑</span>." },
    "படிக்கப்போகணும்னா": { r:"paḍikkappōgaṇumnā", gl:"read/study·INF.STRONG·go.INF·MUST·COND",
      t:"“if one must go to study / if one has to study”",
      d:"An entire conditional clause welded into a single word. The grounded analysis: a strong infinitive of <em>purpose</em>, a serialised motion auxiliary (<span class=\"ta\">போ</span> “go”, joined by fortition sandhi), a necessity modal (<span class=\"ta\">வேணும்</span> with <span class=\"ta\">வே‑</span> deleted), and the syntactic conditional <span class=\"ta\">னா</span> (underlying <span class=\"ta\">ண்ணா</span>). Non-finite — no agreement; the subject is inferred. Casual spoken register, typically the “if…” half of a conditional.",
      seg:[ ["படி","read/study","Class VII strong verb root"],
             ["க்க","INF.STRONG","strong infinitive (purpose)"],
             ["ப்போக","go.INF","purposive motion — “go to ___”"],
             ["ணும்","MUST","necessity modal (< வேணும், வே‑ deleted)"],
             ["னா","COND","syntactic conditional — “if”"] ],
      build:"padikkapooga" },
    "படிக்கப்போகணும்": { r:"paḍikkappōgaṇum", gl:"read/study·INF.STRONG·go.INF·MUST", t:"“(one) must go to study”",
      d:"Adds the necessity modal <span class=\"ta\">ணும்</span> — underlyingly <span class=\"ta\">வேணும்</span> with <span class=\"ta\">வே‑</span> deleted after the infinitive. Ranges from obligation to intention by intonation.",
      seg:[ ["படி","read/study","root"], ["க்க","INF.STRONG","strong infinitive"], ["ப்போக","go.INF","go, purposive"], ["ணும்","MUST","necessity modal"] ], build:"padikkapooga" },
    "படிக்கப்போக": { r:"paḍikkappōga", gl:"read/study·INF.STRONG·go.INF", t:"“to go (in order) to study”",
      d:"The serialized purposive-motion construction: <span class=\"ta\">படிக்க</span> “to study” + <span class=\"ta\">போக</span> “go” (Class II, weak infinitive <span class=\"ta\">‑க</span>; the <span class=\"ta\">ப்</span> is fortition sandhi at the vowel–vowel join). Fully productive — cf. <span class=\"ta\">சாப்பிடப்போக</span>, <span class=\"ta\">விளையாடப்போக</span>.",
      seg:[ ["படி","read/study","root"], ["க்க","INF.STRONG","strong infinitive"], ["ப்போக","go.INF","go, purposive"] ], build:"padikkapooga" },
    "ப்போக": { r:"-ppōga", gl:"go.INF", t:"purposive motion auxiliary — “go to ___”",
      d:"<span class=\"ta\">போ</span> “go” (Class II), weak infinitive <span class=\"ta\">‑க → போக</span>; the initial <span class=\"ta\">ப்</span> is fortition sandhi at the vowel–vowel boundary. Serialised after a purpose infinitive: “go in order to V”. Productive: <span class=\"ta\">சாப்பிடப்போக</span> “go to eat”." },
    "ணும்": { r:"-ṇum", gl:"MUST", t:"necessity modal",
      d:"Obligation / intention. Underlyingly <span class=\"ta\">வேணும்</span>, with <span class=\"ta\">வே‑</span> deleted after an infinitive (the graph's <code>rule_ve_deletion_num</code>). It has no past stem — which is why the conditional must be the syntactic <span class=\"ta\">னா</span>, not morphological <span class=\"ta\">‑ஆல்</span>." },
    "னா": { r:"-nā", gl:"COND", t:"syntactic conditional — “if”",
      d:"The clause-level conditional (underlying <span class=\"ta\">ண்ணா → னா</span> in casual speech), <em>not</em> the morphological past conditional <span class=\"ta\">‑ஆ(ல்)</span>. Obligatory here because the modal <span class=\"ta\">ணும்</span> has no past stem for <span class=\"ta\">‑ஆல்</span> to attach to." },
    "கோட்டையும்": { r:"kōṭṭaiyum", gl:"fort·also", t:"“the fort too”",
      d:"Polysemy example. Here the clitic <span class=\"ta\">உம்</span> means <strong>“also / too”</strong> — its meaning in the additive construction.",
      seg:[ ["கோட்டை","fort","the noun"], ["யும்","also","clitic ‹உம்›, surfaced"] ] },
    "வந்தாலும்": { r:"vandālum", gl:"come·even-if", t:"“even if X comes”",
      d:"Same clitic <span class=\"ta\">உம்</span>, different construction → <strong>“even if”</strong> (concessive). One morpheme, two meanings: why the graph routes meaning through the construction, never the morpheme.",
      seg:[ ["வந்தா","come-COND","conditional stem"], ["லும்","even-if","clitic ‹உம்›, surfaced"] ] },
    "உம்": { r:"-um", gl:"CLITIC", t:"polysemous clitic",
      d:"“also / too” in <span class=\"ta\">கோட்டையும்</span>; “even if” in <span class=\"ta\">வந்தாலும்</span>. If you attach meaning directly to this morpheme, one reading has to be wrong — so the graph never does." },
    "த்த": { r:"-tta-", gl:"PAST", t:"morph_past_strong_tt — canonical form",
      d:"The canonical underlying form the graph returns when it rejects an illegal past-tense notation. Acceptable variants: <span class=\"ta\">ச்ச</span>, <span class=\"ta\">ட்ட</span>, <span class=\"ta\">த்த</span>." },
    "ச்ச": { r:"-cca-", gl:"PAST", t:"an acceptable allomorph",
      d:"One of the legal variants of <code>morph_past_strong_tt</code> the graph lists in its structured rejection — turning “wrong” into a deterministic fix." }
  };

  return { BUILDS: BUILDS, WORDS: WORDS };
})();
