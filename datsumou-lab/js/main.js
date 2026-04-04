document.addEventListener('DOMContentLoaded', () => {

  // ナビゲーション トグル
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // メニューリンククリック時に閉じる
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // FAQ アコーディオン開閉
  const faqButtons = document.querySelectorAll('.faq-q');
  
  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-faq');
      const targetAnswer = document.getElementById(targetId);
      
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      
      // ボタンの状態を更新
      button.setAttribute('aria-expanded', !isExpanded);
      
      // 回答エリアの表示・非表示を切り替え
      if (targetAnswer) {
        targetAnswer.classList.toggle('hidden');
      }
    });
  });

  // トップへ戻るボタンの制御
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    // スクロールに応じた表示制御
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300 || window.pageYOffset > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    // クリック時のスムーズスクロール
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});
