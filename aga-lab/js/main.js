/* ============================================================
   AGA情報ガイド — main.js v2
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── ハンバーガーメニュー ── */
  const toggle  = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-links');

  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', navMenu.classList.contains('open'));
    });
    // ナビリンクをタップしたら閉じる
    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navMenu.classList.remove('open'));
    });
  }

  /* ── FAQアコーディオン ── */
  document.querySelectorAll('.faq-q[data-faq]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-faq');
      const body     = document.getElementById(targetId);
      if (!body) return;
      const isOpen = !body.classList.contains('hidden');
      body.classList.toggle('hidden', isOpen);
      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
  });

  /* ── スクロール: トップへ戻る ── */
  const backTop = document.querySelector('.back-to-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
  }

  /* ── 治療アコーディオン ── */
  document.querySelectorAll('.t-card-header[data-target]').forEach(header => {
    header.addEventListener('click', () => {
      const targetId = header.getAttribute('data-target');
      const body     = document.getElementById(targetId);
      if (!body) return;

      const isOpen = !body.classList.contains('hidden');
      body.classList.toggle('hidden', isOpen);
      header.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
  });

  /* ── 階層コンテンツ（深読みレイヤー）── */
  document.querySelectorAll('.layer-toggle-btn[data-target]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation(); // アコーディオンのクリックと干渉しない
      const targetId = btn.getAttribute('data-target');
      const layer    = document.getElementById(targetId);
      if (!layer) return;

      const isHidden = layer.classList.contains('hidden');
      layer.classList.toggle('hidden', !isHidden);
      btn.classList.toggle('open', isHidden);
      btn.querySelector('.layer-toggle-text').textContent = isHidden ? '詳しく見る ▸ を閉じる' : '詳しく見る ▸';
    });
  });

  /* ── セルフチェッククイズ ── */
  const questions = [
    {
      // Q1: 頭頂部・生え際の薄毛（AGAの主症状・最重要）
      text: '頭頂部または生え際の毛が薄くなっていますか？',
      options: [
        { label: '明らかに薄くなっている',  score: 4 },
        { label: '少し気になっている',       score: 2 },
        { label: '特に気にならない',          score: 0 },
      ],
    },
    {
      // Q2: 毛の細化・ミニチュア化（AGA初期の重要サイン）
      text: '毛が細くなった・ハリやコシがなくなったと感じますか？',
      options: [
        { label: 'はっきりそう感じる', score: 3 },
        { label: 'やや感じる',          score: 1 },
        { label: '気にならない',         score: 0 },
      ],
    },
    {
      // Q3: 抜け毛
      text: '洗髪時や起床時に抜け毛が増えましたか？',
      options: [
        { label: '明らかに増えた',            score: 2 },
        { label: 'やや増えた気がする',         score: 1 },
        { label: '変わらない・わからない',     score: 0 },
      ],
    },
    {
      // Q4: 家族歴（父方・母方両方に関連）
      text: '父方・母方どちらかの血縁男性（父・祖父・兄弟など）に薄毛の方がいますか？',
      options: [
        { label: '両方の家系にいる',    score: 3 },
        { label: '片方の家系にいる',    score: 2 },
        { label: 'いない・わからない',  score: 0 },
      ],
    },
    {
      // Q5: 進行期間
      text: '薄毛が気になり始めてから、どのくらい経ちますか？',
      options: [
        { label: '2年以上',             score: 3 },
        { label: '6ヶ月〜2年',          score: 2 },
        { label: '6ヶ月以内',           score: 1 },
        { label: 'まだ気になっていない', score: 0 },
      ],
    },
    {
      // Q6: 年齢（若年発症は進行リスクが高い）
      text: '現在の年齢はいくつですか？',
      options: [
        { label: '10代後半〜20代', score: 3 },
        { label: '30代',           score: 2 },
        { label: '40代',           score: 1 },
        { label: '50代以上',       score: 0 },
      ],
    },
    {
      // Q7: 頭皮の脂っぽさ（DHT過剰の間接指標）
      text: '頭皮の脂っぽさ・べたつきが気になりますか？',
      options: [
        { label: 'よく気になる', score: 1 },
        { label: '特にない',     score: 0 },
      ],
    },
  ];

  let currentQ   = 0;
  let totalScore  = 0;

  const qEls     = document.querySelectorAll('.check-question');
  const resultEl = document.querySelector('.check-result');
  const progressFill   = document.querySelector('.progress-fill');
  const questionCount  = document.querySelector('.selfcheck-question-count');
  const resultTitle    = document.getElementById('resultTitle');
  const resultDesc     = document.getElementById('resultDesc');
  const resultScoreFill = document.querySelector('.result-score-fill');
  const resultScoreLabel = document.querySelector('.result-score-label');
  const resultIcon      = document.querySelector('.result-icon');
  const restartBtn      = document.querySelector('.check-restart, #retryCheck');

  function showQuestion(idx) {
    qEls.forEach((el, i) => el.classList.toggle('active', i === idx));
    const pct = ((idx) / questions.length) * 100;
    if (progressFill) progressFill.style.width = pct + '%';
    if (questionCount) questionCount.textContent = `${idx + 1} / ${questions.length}`;
  }

  function showResult() {
    qEls.forEach(el => el.classList.remove('active'));
    if (resultEl) resultEl.classList.add('active');

    const maxScore  = questions.reduce((s, q) => s + Math.max(...q.options.map(o => o.score)), 0);
    const scorePct  = Math.round((totalScore / maxScore) * 100);
    if (progressFill)   progressFill.style.width = '100%';
    if (questionCount)  questionCount.textContent = `${questions.length} / ${questions.length}`;

    let level, iconText, title, desc, fillColor;

    if (scorePct >= 40) {
      level = 'high'; iconText = '⚠'; title = '専門医への受診をお勧めします';
      desc = '複数の主要なAGAリスク因子に該当しています。進行中の可能性があり、早期の受診が治療の選択肢を広げます。気になる症状がある場合は、皮膚科・AGAクリニックへの相談を検討してください。';
      fillColor = '#e05a5a';
    } else if (scorePct >= 18) {
      level = 'mid';  iconText = '●'; title = '今のうちに状態を確認しておくことをお勧めします';
      desc = 'AGAの初期サインに該当する項目が見られます。現時点では軽度でも、早めに専門医に相談しておくことで、進行前に対処できる可能性があります。受診には症状が重くなる前が適しています。';
      fillColor = '#e8a830';
    } else {
      level = 'low';  iconText = '✓'; title = '現時点のリスクは低い傾向ですが、変化に注意を';
      desc = '現時点ではAGAの主要リスク因子への該当は少ない傾向でした。ただしAGAは自覚しにくい初期から進行するケースもあります。気になる変化（毛の細化・生え際の後退）があれば早めに確認しておくと安心です。';
      fillColor = '#2e9e6a';
    }

    if (resultIcon)       { resultIcon.className = `result-icon ${level}`; resultIcon.textContent = iconText; }
    if (resultTitle)      resultTitle.textContent = title;
    if (resultDesc)       resultDesc.textContent  = desc;
    if (resultScoreFill)  { resultScoreFill.style.width = scorePct + '%'; resultScoreFill.style.background = fillColor; }
    if (resultScoreLabel) resultScoreLabel.textContent = `スコア：${totalScore}点（最大${maxScore}点）`;
  }

  // オプションクリック
  document.querySelectorAll('.check-options').forEach((optGroup, qIdx) => {
    optGroup.querySelectorAll('.check-option').forEach((optBtn, oIdx) => {
      optBtn.addEventListener('click', () => {
        totalScore += questions[qIdx].options[oIdx].score;
        currentQ++;
        if (currentQ < questions.length) {
          showQuestion(currentQ);
        } else {
          showResult();
        }
      });
    });
  });

  // 再スタート
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      currentQ = 0; totalScore = 0;
      if (resultEl)     resultEl.classList.remove('active');
      if (progressFill) progressFill.style.width = '0%';
      showQuestion(0);
    });
  }

  // 初回表示
  if (qEls.length > 0) showQuestion(0);

  /* ── Intersection Observer: フェードイン ── */
  const fadeEls = document.querySelectorAll('.t-card, .info-card, .stage-card, .roadmap-step, .flow-step, .evidence-card');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.style.animation = 'fadeUp 0.5s ease forwards'; obs.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    fadeEls.forEach(el => { el.style.opacity = '0'; obs.observe(el); });
  }

}); // DOMContentLoaded
