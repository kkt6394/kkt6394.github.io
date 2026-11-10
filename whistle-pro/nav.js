// 소개 페이지 공통 스크립트(영어 ./ 와 언어별 ./<언어>/ 가 같이 쓴다).
// 글은 HTML에 이미 들어 있다. 여기서는 ① 옛 링크(?lang=)와 브라우저 언어에 맞는 언어 주소로 넘기기(영어 페이지에서만),
// ② 언어 고르기, ③ SNS 출처(?src=)를 App Store 캠페인 토큰으로 — 세 가지만 한다.
(function () {
  var LANGS = ["en", "ko", "pt-BR", "es", "ja", "zh-Hans", "th", "vi", "id", "de", "fr", "it", "nl", "pl", "tr"];
  var here = document.documentElement.lang || "en";
  var root = here === "en" ? "./" : "../";
  var params = new URLSearchParams(location.search);

  // fr-CA→fr, de-AT→de, es-ES→es, pt-PT→pt-BR, zh-TW→zh-Hans
  function pick(code) {
    code = (code || "").toLowerCase();
    if (code.indexOf("zh") === 0) return "zh-Hans";
    if (code.indexOf("pt") === 0) return "pt-BR";
    var base = code.split("-")[0];
    return LANGS.indexOf(base) >= 0 ? base : null;
  }

  // 그 언어 페이지 주소. lang은 주소에 안 남기고(?src 등 나머지는 유지), 영어를 직접 고른 때만 ?lang=en으로 표시해 다시 넘기지 않게 한다.
  function urlFor(lang, explicit) {
    var q = new URLSearchParams(params.toString());
    q.delete("lang");
    if (lang === "en" && explicit) q.set("lang", "en");
    var qs = q.toString();
    return root + (lang === "en" ? "" : lang + "/") + (qs ? "?" + qs : "") + location.hash;
  }

  if (here === "en") {
    var want = pick(params.get("lang"));
    if (!want) {
      var list = navigator.languages || [navigator.language];
      for (var i = 0; i < list.length && !want; i++) want = pick(list[i]);
    }
    if (want && want !== "en") { location.replace(urlFor(want, false)); return; }
  }

  var raw = params.get("src") || "";
  var src = /^[a-z]{1,8}$/.test(raw) ? raw : "web";
  var ios = document.getElementById("ios");
  if (ios) ios.href = "https://apps.apple.com/app/id6823503970?pt=128690794&ct=" + src + "&mt=8";

  var sel = document.getElementById("lang");
  if (sel) {
    sel.value = here;
    sel.addEventListener("change", function () { location.href = urlFor(this.value, true); });
  }
})();
