window.addEventListener('load', () => {
    if (typeof gsap === 'undefined') return;

    const skillsSection = document.getElementById('skills');
    const modeButtons = document.querySelectorAll('.js-mode-btn');
    const illustDisplay = document.querySelector('.illustration-display');
    const illustWrap = document.querySelector('.inspector-illustration-wrap');

    // 追加：2枚の画像エレメントを取得
    const illustDesign = document.querySelector('.js-illust-design');
    const illustCode = document.querySelector('.js-illust-code');

    if (modeButtons.length === 0) return;

    modeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            if (btn.classList.contains('active')) return;

            const mode = btn.getAttribute('data-mode');

            // 1. ボタンのアクティブクラスの即時切り替え
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 2. セクション全体の背景色とイラストのオーラ（背景）切り替え
            if (mode === 'code') {
                if (skillsSection) skillsSection.classList.add('code-active');
                if (illustDisplay) {
                    illustDisplay.classList.remove('design-bg');
                    illustDisplay.classList.add('code-bg');
                }

                // ★追加：画像クラスの切り替え（DESIGN消去 -> CODE点灯）
                if (illustDesign && illustCode) {
                    illustDesign.classList.remove('active');
                    illustCode.classList.add('active');
                }
            } else {
                if (skillsSection) skillsSection.classList.remove('code-active');
                if (illustDisplay) {
                    illustDisplay.classList.remove('code-bg');
                    illustDisplay.classList.add('design-bg');
                }

                // ★追加：画像クラスの切り替え（CODE消去 -> DESIGN点灯）
                if (illustDesign && illustCode) {
                    illustCode.classList.remove('active');
                    illustDesign.classList.add('active');
                }
            }

            // 3. スイッチの衝撃で中央のイラスト全体をプルンと揺らす（画像変更が際立ちます）
            if (illustWrap) {
                gsap.fromTo(illustWrap,
                    { scale: 0.93, rotation: mode === 'code' ? -4 : 4 },
                    { scale: 1, rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" }
                );
            }

            // 4. スキルテキストグループのダイナミックな入れ替えタイムライン
            const currentActiveGroup = document.querySelector('.js-skill-group.active');
            const nextTargetGroup = document.getElementById(`group-${mode}`);

            if (currentActiveGroup && nextTargetGroup) {
                const nextTexts = nextTargetGroup.querySelectorAll('.giant-skill-text');

                const tl = gsap.timeline();

                tl.to(currentActiveGroup, {
                    opacity: 0,
                    duration: 0.2,
                    ease: "power2.out",
                    onComplete: () => {
                        currentActiveGroup.classList.remove('active');
                        nextTargetGroup.classList.add('active');
                        gsap.set(nextTargetGroup, { opacity: 1 });
                        gsap.set(nextTexts, { clearProps: "all" });
                    }
                });

                tl.fromTo(nextTexts,
                    { opacity: 0, y: 30, scale: 0.93 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: "back.out(1.5)"
                    },
                    "+=0.05"
                );
            }
        });
    });
    // skill-interaction.js 内の初期化処理、または main.js へ追記するイメージです
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const skillsSec = document.getElementById('skills');
        const illustWrap = document.querySelector('.inspector-illustration-wrap');
        const switcher = document.querySelector('.mode-switcher-wrap');
        const activeTexts = document.querySelectorAll('#group-design .giant-skill-text');

        // 初期状態をあらかじめGSAP側で隠しておく（CSSのバタつき防止）
        gsap.set(illustWrap, { opacity: 0, scale: 0.8, y: 50 });
        gsap.set(switcher, { opacity: 0, y: -20, scale: 0.95 });
        gsap.set(activeTexts, { opacity: 0 });

        const skillsEntranceTl = gsap.timeline({
            scrollTrigger: {
                trigger: skillsSec,
                start: "top 75%", // セクションが画面の75%位置に来たら起動
                toggleActions: "play none none reverse"
            }
        });

        skillsEntranceTl
            // 1. 中央イラストがバウンドしながら登場
            .to(illustWrap, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.8,
                ease: "back.out(1.5)"
            })
            // 2. モード切り替えスイッチが上からフワッとフェードイン
            .to(switcher, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: "power3.out"
            }, "-=0.3")
            // 3. 初期アクティブ（DESIGN）のテキストがアシンメトリーに外側から吸い寄せられるように展開
            .fromTo(activeTexts,
                {
                    opacity: 0,
                    // 配置（左側か右側か）によって初期のX軸の飛び出し方向を変えるとより立体的になります
                    x: (index) => index % 2 === 0 ? -40 : 40,
                    scale: 0.9
                },
                {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: "back.out(1.2)"
                },
                "-=0.2"
            );
    }
});