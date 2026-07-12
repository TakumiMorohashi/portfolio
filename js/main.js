// CONTACTセクション内のフォームパーツを時間差で湧き上がらせる
            if (document.querySelector('#contact')) {
                gsap.from('#contact .input_group', {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.15, // 0.15秒ずつ遅れて下から現れる
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: '#contact .contact_form_new',
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                });

                // 送信ボタンは最後に単体でフワッと出現
                gsap.from('#contact .submit_btn_wrap', {
                    y: 20,
                    opacity: 0,
                    duration: 1,
                    delay: 0.4, // 入力欄が出揃った頃に起動
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: '#contact .contact_form_new',
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                });
            }

            // ==========================================================================
// ページ内リンクのスムーススクロール制御
// ==========================================================================
$(function () {
    // #から始まるアンカーリンク（ページ内リンク）がクリックされた時
    $('a[href^="#"]').on('click', function (e) {
        // デフォルトのパッと切り替わる挙動をキャンセル
        e.preventDefault();

        // クリックされたリンクのhref属性（移動先ID）を取得
        const href = $(this).attr('href');

        // 移動先の要素を取得（hrefが"#"または空ならhtml要素、それ以外ならそのIDの要素）
        const target = $(href === "#" || href === "" ? 'html' : href);

        // 移動先の要素が存在する場合のみスクロールを実行
        if (target.length) {
            // 移動先の位置（TOPからのピクセル数）を取得
            const position = target.offset().top;

            // 画面を滑らかにスクロールさせる（時間は0.6秒、イージングは心地よいswing）
            $('html, body').animate({
                scrollTop: position
            }, 600, 'swing');
        }
    });
});

