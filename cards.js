
/* ============================================================
   Miles Beyond Borders — Card Page widget
   Embed in Showit with:
     <div id="mbb-cards"></div>
     <script src="https://advaitmbb.github.io/card_page/cards.js?v=1"></script>
   Reads data from cards.json in the same repo. All styles are
   scoped under #mbb-cards so they won't collide with Showit.
   ============================================================ */
(function () {
  "use strict";

  var DATA_URL = "https://advaitmbb.github.io/card_page/cards.json";

  /* ---- EDIT YOUR PROMISE BANNER COPY HERE ----
     You can use <b>...</b> to highlight a phrase in bright blue. */
  var PROMISE = {
    headline: "The best publicly available offer on every card.",
    body: "This page has one job: peace of mind. For every card below, I link the strongest public offer I can find \u2014 <b>even when it earns me nothing</b>. And every card is labeled with exactly what kind of link it is, so you always know where you stand."
  };

  /* ---- LINK-TYPE PILLS ----
     Set the `link_type` column in your sheet to one of these keys.
     Leave the cell blank to show no pill. */
  var LINK_PILLS = {
    affiliate: { label: "Affiliate link", cls: "aff" },
    referral:  { label: "Referral link", cls: "ref" },
    public:    { label: "Public offer \u00B7 no commission", cls: "pub" }
  };

  /* ---- find or create the mount point ---- */
  var mount = document.getElementById("mbb-cards");
  if (!mount) {
    mount = document.createElement("div");
    mount.id = "mbb-cards";
    var here = document.currentScript;
    if (here && here.parentNode) here.parentNode.insertBefore(mount, here.nextSibling);
    else document.body.appendChild(mount);
  }

  /* ---- fonts ---- */
  if (!document.getElementById("mbbc-fonts")) {
    var fl = document.createElement("link");
    fl.id = "mbbc-fonts";
    fl.rel = "stylesheet";
    fl.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(fl);
  }

  /* ---- scoped styles ---- */
  var CSS = `
  #mbb-cards{
    --cream:#FAF6EE;--navy:#1A2B3C;--accent:#0E6BA8;--bright:#38b6ff;--footer:#14222F;
    --ink:#1A2B3C;--muted:#5d6b78;--line:#e4dccd;--card:#fff;
    --good:#1f7a4d;--good-bg:#eaf5ee;--elev:#9a5b00;--elev-bg:#fbeedd;
    --radius:14px;--shadow:0 1px 2px rgba(26,43,60,.06),0 6px 24px rgba(26,43,60,.06);
    font-family:'Inter',system-ui,sans-serif;color:var(--ink);font-size:16px;line-height:1.55;
    background:var(--cream);box-sizing:border-box;padding:6px 0 10px;
  }
  #mbb-cards *{box-sizing:border-box}
  #mbb-cards a{color:var(--accent);text-decoration:none}
  #mbb-cards .mbbc-wrap{max-width:1180px;margin:0 auto;padding:0 18px}

  #mbb-cards .mbbc-promise{background:var(--footer);border-radius:14px;padding:22px 24px;margin:0 0 16px}
  #mbb-cards .mbbc-promise-h{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:clamp(20px,2.6vw,27px);line-height:1.15;color:#fff;margin:0 0 8px}
  #mbb-cards .mbbc-promise-b{font-size:14.5px;line-height:1.55;color:#aebcc7;max-width:700px;margin:0}
  #mbb-cards .mbbc-promise-b b{color:var(--bright);font-weight:600}

  #mbb-cards .mbbc-disc{background:#fff;border:1px solid var(--line);border-radius:12px;
    padding:13px 16px;margin:0 0 18px;font-size:13px;color:var(--muted);line-height:1.5}
  #mbb-cards .mbbc-disc b{color:var(--ink)}

  #mbb-cards .mbbc-controls{padding:4px 0 14px;border-bottom:1px solid var(--line);margin-bottom:24px}
  #mbb-cards .mbbc-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
  #mbb-cards .mbbc-search{flex:1 1 260px;position:relative}
  #mbb-cards .mbbc-search input{width:100%;padding:11px 13px 11px 38px;border:1px solid var(--line);
    border-radius:10px;font-family:inherit;font-size:15px;background:#fff;color:var(--ink)}
  #mbb-cards .mbbc-search input:focus{outline:2px solid var(--accent);outline-offset:1px;border-color:transparent}
  #mbb-cards .mbbc-search svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);opacity:.5}
  #mbb-cards select{appearance:none;-webkit-appearance:none;padding:10px 32px 10px 12px;border:1px solid var(--line);
    border-radius:10px;background:#fff url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235d6b78' stroke-width='2.5'><path d='M6 9l6 6 6-6'/></svg>") no-repeat right 11px center;
    font-family:inherit;font-size:14px;color:var(--ink);cursor:pointer}
  #mbb-cards select:focus{outline:2px solid var(--accent);outline-offset:1px}
  #mbb-cards .mbbc-toggle{display:inline-flex;align-items:center;gap:7px;font-size:14px;font-weight:500;
    cursor:pointer;user-select:none;padding:9px 12px;border:1px solid var(--line);border-radius:10px;background:#fff}
  #mbb-cards .mbbc-toggle input{accent-color:var(--accent);width:16px;height:16px;cursor:pointer}
  #mbb-cards .mbbc-meta{display:flex;justify-content:space-between;align-items:center;margin-top:11px;font-size:13px;color:var(--muted)}
  #mbb-cards .mbbc-meta b{color:var(--ink);font-weight:600}
  #mbb-cards .mbbc-clear{background:none;border:none;color:var(--accent);font-family:inherit;font-size:13px;cursor:pointer;font-weight:500;padding:0}
  #mbb-cards .mbbc-clear:hover{text-decoration:underline}

  #mbb-cards .mbbc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:20px;padding-bottom:10px}
  #mbb-cards .mbbc-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);
    box-shadow:var(--shadow);padding:20px;display:flex;flex-direction:column;transition:transform .15s,box-shadow .15s}
  #mbb-cards .mbbc-card:hover{transform:translateY(-3px);box-shadow:0 4px 10px rgba(26,43,60,.08),0 14px 40px rgba(26,43,60,.12)}
  #mbb-cards .mbbc-top{display:flex;gap:14px;align-items:flex-start}
  #mbb-cards .mbbc-art{flex:0 0 96px;height:62px;border-radius:8px;overflow:hidden;
    background:linear-gradient(135deg,#dfe7ee,#c7d4de);display:flex;align-items:center;justify-content:center;
    color:#8294a3;font-size:10px;font-weight:600;letter-spacing:.05em;text-align:center;padding:4px}
  #mbb-cards .mbbc-art img{width:100%;height:100%;object-fit:cover}
  #mbb-cards .mbbc-head{flex:1;min-width:0}
  #mbb-cards .mbbc-badges{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:7px}
  #mbb-cards .mbbc-badge{font-size:10.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:3px 8px;border-radius:999px}
  #mbb-cards .mbbc-badge.elev{background:var(--elev-bg);color:var(--elev)}
  #mbb-cards .mbbc-badge.high{background:#1A2B3C;color:#fff}
  #mbb-cards .mbbc-badge.end{background:#fbe1e1;color:#a32525}
  #mbb-cards .mbbc-name{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:18px;line-height:1.2;margin:0}
  #mbb-cards .mbbc-fee{font-size:12.5px;color:var(--muted);margin-top:4px}
  #mbb-cards .mbbc-fee .dot{margin:0 6px;opacity:.5}
  #mbb-cards .mbbc-offer{margin:16px 0 0;padding-top:15px;border-top:1px solid var(--line)}
  #mbb-cards .mbbc-lab{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:3px}
  #mbb-cards .mbbc-pts{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:21px;line-height:1.15;color:var(--navy)}
  #mbb-cards .mbbc-req{font-size:12.5px;color:var(--muted);margin-top:2px}
  #mbb-cards .mbbc-value{margin-top:14px;background:var(--good-bg);border:1px solid #cfe6d8;border-radius:10px;padding:11px 13px}
  #mbb-cards .mbbc-value .vr{display:flex;align-items:baseline;justify-content:space-between;gap:8px}
  #mbb-cards .mbbc-vnum{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:20px;color:var(--good)}
  #mbb-cards .mbbc-vtag{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--good)}
  #mbb-cards .mbbc-vnote{font-size:12px;color:#3f6b54;margin-top:3px;line-height:1.4}
  #mbb-cards .mbbc-acc{border-top:1px solid var(--line)}
  #mbb-cards .mbbc-acc-sum{display:flex;align-items:center;justify-content:space-between;gap:10px;
    cursor:pointer;list-style:none;padding:13px 0 12px;font-size:14px;font-weight:600;color:var(--ink)}
  #mbb-cards .mbbc-acc-sum::-webkit-details-marker{display:none}
  #mbb-cards .mbbc-acc-sum:hover{color:var(--accent)}
  #mbb-cards .mbbc-acc-lab.take{font-family:'Fraunces',Georgia,serif;color:var(--accent);font-weight:600}
  #mbb-cards .mbbc-chev{color:var(--muted);transition:transform .18s ease;flex:0 0 auto}
  #mbb-cards details[open] .mbbc-chev{transform:rotate(180deg)}
  #mbb-cards .mbbc-acc-body{padding:0 0 14px;font-size:14px;line-height:1.5;color:#3a4855}
  #mbb-cards .mbbc-bens{margin:0;padding:0;list-style:none;font-size:13px}
  #mbb-cards .mbbc-bens li{position:relative;padding-left:18px;margin-bottom:5px;color:#3a4855}
  #mbb-cards .mbbc-bens li:before{content:"";position:absolute;left:2px;top:7px;width:6px;height:6px;border-radius:50%;background:var(--accent)}
  #mbb-cards .mbbc-foot{margin-top:auto;padding-top:18px}
  #mbb-cards .mbbc-ltype{display:inline-flex;align-items:center;gap:7px;font-size:11.5px;font-weight:600;padding:5px 11px;border-radius:999px;margin:0 0 12px}
  #mbb-cards .mbbc-ltype:before{content:"";width:7px;height:7px;border-radius:50%}
  #mbb-cards .mbbc-ltype.aff{background:#eaf1f7;color:#0E6BA8}
  #mbb-cards .mbbc-ltype.aff:before{background:#0E6BA8}
  #mbb-cards .mbbc-ltype.ref{background:#f4eefb;color:#6b3fa0}
  #mbb-cards .mbbc-ltype.ref:before{background:#6b3fa0}
  #mbb-cards .mbbc-ltype.pub{background:var(--good-bg);color:var(--good)}
  #mbb-cards .mbbc-ltype.pub:before{background:var(--good)}
  #mbb-cards .mbbc-cta-row{display:flex;align-items:center;gap:14px}
  #mbb-cards .mbbc-cta{flex:1;text-align:center;background:var(--accent);color:#fff;font-weight:600;font-size:15px;padding:12px 16px;border-radius:10px;transition:background .15s}
  #mbb-cards .mbbc-cta:hover{background:#0a5688}
  #mbb-cards .mbbc-review{font-size:13.5px;font-weight:600;white-space:nowrap}
  #mbb-cards .mbbc-review:hover{text-decoration:underline}
  #mbb-cards .mbbc-rf{font-size:11px;color:var(--muted);text-align:center;margin-top:9px}
  #mbb-cards .mbbc-rf a{color:var(--muted);text-decoration:underline}
  #mbb-cards .mbbc-empty{grid-column:1/-1;text-align:center;padding:50px 20px;color:var(--muted)}
  #mbb-cards .mbbc-empty b{display:block;font-family:'Fraunces',Georgia,serif;font-size:20px;color:var(--ink);margin-bottom:6px}
  #mbb-cards .mbbc-state{padding:40px 20px;text-align:center;color:var(--muted);font-size:15px}
  @media(max-width:560px){#mbb-cards .mbbc-grid{grid-template-columns:1fr}}
  `;
  var st = document.createElement("style");
  st.textContent = CSS;
  document.head.appendChild(st);

  /* ---- skeleton ---- */
  mount.innerHTML =
    '<div class="mbbc-wrap">' +
      '<div class="mbbc-promise"><div class="mbbc-promise-h">' + PROMISE.headline + '</div><div class="mbbc-promise-b">' + PROMISE.body + '</div></div>' +
      '<div class="mbbc-disc"><b>Advertiser disclosure:</b> I have affiliate partnerships and may earn a commission when you\u2019re approved for a card through my links \u2014 at no cost to you. I only list offers I\u2019d take myself, and I show the best public offer even when it earns me nothing. Opinions are my own and haven\u2019t been reviewed or approved by any issuer.</div>' +
      '<div class="mbbc-controls">' +
        '<div class="mbbc-row">' +
          '<div class="mbbc-search">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
            '<input id="mbbc-q" type="text" placeholder="Search cards (e.g. Sapphire, Hyatt, Amex)">' +
          '</div>' +
          '<select id="mbbc-issuer"><option value="">All issuers</option></select>' +
          '<select id="mbbc-type"><option value="">All types</option><option>Personal</option><option>Business</option></select>' +
          '<select id="mbbc-fee"><option value="">Any fee</option><option value="0">$0</option><option value="u100">Under $100</option><option value="100-300">$100\u2013$300</option><option value="300">$300+</option></select>' +
          '<select id="mbbc-sort"><option value="rec">Sort: Recommended</option><option value="val">Value: High \u2192 Low</option><option value="feelo">Fee: Low \u2192 High</option><option value="feehi">Fee: High \u2192 Low</option></select>' +
          '<label class="mbbc-toggle"><input type="checkbox" id="mbbc-elev">Elevated offers only</label>' +
        '</div>' +
        '<div class="mbbc-meta"><div class="mbbc-count"><b id="mbbc-count">0</b> cards</div><button class="mbbc-clear" id="mbbc-reset">Reset filters</button></div>' +
      '</div>' +
      '<div class="mbbc-grid" id="mbbc-grid"><div class="mbbc-state">Loading cards\u2026</div></div>' +
    '</div>';

  /* ---- helpers ---- */
  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function money(n){ return "$" + Number(n).toLocaleString("en-US"); }
  function feeMatch(card, v){
    var f = Number(card.annual_fee) || 0;
    if(!v) return true;
    if(v==="0") return f===0;
    if(v==="u100") return f>0 && f<100;
    if(v==="100-300") return f>=100 && f<=300;
    if(v==="300") return f>300;
    return true;
  }
  function initials(name){
    return String(name||"").split(/\s+/).slice(0,2).join(" ").toUpperCase();
  }

  function cardHTML(c){
    var badges = "";
    if(c.badge === "All-time high") badges += '<span class="mbbc-badge high">All-time high</span>';
    if(c.badge === "Ending soon")   badges += '<span class="mbbc-badge end">Ending soon</span>';
    if(c.elevated)                  badges += '<span class="mbbc-badge elev">Elevated</span>';

    var five = c.counts_524 ? "Counts toward 5/24" : "No 5/24 impact";
    var art = c.image_url
      ? '<img src="' + esc(c.image_url) + '" alt="' + esc(c.card_name) + '">'
      : esc(initials(c.card_name));

    var valueBlock = "";
    if(c.value != null && c.value !== ""){
      var note = (c.cpp != null && c.cpp !== "")
        ? "At my conservative " + esc(c.cpp) + "\u00A2/pt \u2014 what I\u2019d realistically expect, not a best-case redemption."
        : "Valued at cash face value.";
      var tag = (c.cpp != null && c.cpp !== "") ? "My value \u00B7 " + esc(c.cpp) + "\u00A2/pt" : "My value";
      valueBlock =
        '<div class="mbbc-value"><div class="vr">' +
          '<span class="mbbc-vnum">\u2248 ' + esc(money(c.value)) + '</span>' +
          '<span class="mbbc-vtag">' + tag + '</span>' +
        '</div><div class="mbbc-vnote">' + note + '</div></div>';
    }

    var bens = (c.benefits || []).map(function(b){ return '<li>' + esc(b) + '</li>'; }).join("");
    var rf = c.show_rates_fees
      ? '<div class="mbbc-rf"><a href="#rates-fees" target="_blank" rel="noopener">See Rates &amp; Fees</a> \u00B7 Terms apply</div>' : "";

    var lt = LINK_PILLS[String(c.link_type || "").trim().toLowerCase()];
    var ltypeHTML = lt ? '<div class="mbbc-ltype ' + lt.cls + '">' + lt.label + '</div>' : "";
    var relAttr = (lt && lt.cls === "pub") ? "nofollow noopener" : "sponsored nofollow noopener";

    var chev = '<svg class="mbbc-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>';
    var takeBlock = c.my_take
      ? '<details class="mbbc-acc"><summary class="mbbc-acc-sum"><span class="mbbc-acc-lab take">\u2726 My take</span>' + chev + '</summary><div class="mbbc-acc-body">' + esc(c.my_take) + '</div></details>'
      : "";
    var hiBlock = bens
      ? '<details class="mbbc-acc"><summary class="mbbc-acc-sum"><span class="mbbc-acc-lab">Card highlights</span>' + chev + '</summary><div class="mbbc-acc-body"><ul class="mbbc-bens">' + bens + '</ul></div></details>'
      : "";

    return '<article class="mbbc-card">' +
      '<div class="mbbc-top">' +
        '<div class="mbbc-art">' + art + '</div>' +
        '<div class="mbbc-head">' +
          '<div class="mbbc-badges">' + badges + '</div>' +
          '<h3 class="mbbc-name">' + esc(c.card_name) + '</h3>' +
          '<div class="mbbc-fee">' + esc(c.fee_label || "") + ' annual fee<span class="dot">\u2022</span>' + esc(c.card_type || "") + '<span class="dot">\u2022</span>' + five + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="mbbc-offer"><div class="mbbc-lab">Welcome offer</div>' +
        '<div class="mbbc-pts">' + esc(c.offer_display || "") + '</div>' +
        '<div class="mbbc-req">' + esc(c.spend_req || "") + '</div></div>' +
      valueBlock +
      takeBlock +
      hiBlock +
      '<div class="mbbc-foot">' +
        ltypeHTML +
        '<div class="mbbc-cta-row">' +
          '<a class="mbbc-cta" href="' + esc(c.affiliate_url || "#") + '" target="_blank" rel="' + relAttr + '">View offer \u2192</a>' +
          (c.review_url ? '<a class="mbbc-review" href="' + esc(c.review_url) + '">Full review</a>' : "") +
        '</div>' + rf +
      '</div>' +
    '</article>';
  }

  /* ---- state + wiring ---- */
  var CARDS = [];
  var el = {};

  function render(){
    var q = el.q.value.trim().toLowerCase();
    var list = CARDS.filter(function(c){
      if(c.active === false) return false;
      if(el.issuer.value && c.issuer !== el.issuer.value) return false;
      if(el.type.value && c.card_type !== el.type.value) return false;
      if(!feeMatch(c, el.fee.value)) return false;
      if(el.elev.checked && !c.elevated) return false;
      if(q && (String(c.card_name)+" "+String(c.issuer)+" "+String(c.program)).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });

    var s = el.sort.value;
    if(s === "val") list.sort(function(a,b){ return (b.value||0)-(a.value||0); });
    else if(s === "feelo") list.sort(function(a,b){ return (a.annual_fee||0)-(b.annual_fee||0); });
    else if(s === "feehi") list.sort(function(a,b){ return (b.annual_fee||0)-(a.annual_fee||0); });
    else list.sort(function(a,b){ return (a.sort_order||999)-(b.sort_order||999); });

    el.count.textContent = list.length;
    el.grid.innerHTML = list.length
      ? list.map(cardHTML).join("")
      : '<div class="mbbc-empty"><b>No cards match those filters</b>Try widening the fee range or clearing your search.</div>';
  }

  function buildIssuerOptions(){
    var seen = {};
    CARDS.forEach(function(c){ if(c.issuer) seen[c.issuer] = true; });
    Object.keys(seen).sort().forEach(function(name){
      var o = document.createElement("option");
      o.textContent = name;
      el.issuer.appendChild(o);
    });
  }

  function wire(){
    el.q = mount.querySelector("#mbbc-q");
    el.issuer = mount.querySelector("#mbbc-issuer");
    el.type = mount.querySelector("#mbbc-type");
    el.fee = mount.querySelector("#mbbc-fee");
    el.sort = mount.querySelector("#mbbc-sort");
    el.elev = mount.querySelector("#mbbc-elev");
    el.count = mount.querySelector("#mbbc-count");
    el.grid = mount.querySelector("#mbbc-grid");
    el.reset = mount.querySelector("#mbbc-reset");

    ["input","change"].forEach(function(ev){
      el.q.addEventListener(ev, render);
      [el.issuer, el.type, el.fee, el.sort, el.elev].forEach(function(x){ x.addEventListener(ev, render); });
    });
    el.reset.addEventListener("click", function(){
      el.q.value=""; el.issuer.value=""; el.type.value=""; el.fee.value=""; el.sort.value="rec"; el.elev.checked=false; render();
    });
  }

  fetch(DATA_URL)
    .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
    .then(function(data){
      CARDS = Array.isArray(data) ? data : [];
      wire();
      buildIssuerOptions();
      render();
    })
    .catch(function(){
      var g = mount.querySelector("#mbbc-grid");
      if(g) g.innerHTML = '<div class="mbbc-state">Couldn\u2019t load cards right now. Please refresh in a moment.</div>';
    });
})();
