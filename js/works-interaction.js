/**
 * Works Section - Kinetic Split & 3D Touch Interaction
 * 空間拡張登場 ＆ 立体手触りエフェクト完全統合版
 */
window.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const worksSection = document.getElementById('works');
    if (!worksSection) return;

    // ==========================================================================
    // 1. 登場アニメーション：キネティック・スプリット（空間拡張）
    // ==========================================================================
    const splitTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#works",
            start: "top 0%", 
            toggleActions: "play none none none"
        }
    });

    splitTl
        // レーザーネオンラインが中央を一閃
        .to('.shutter_line', { scaleX: 1, duration: 0.5, ease: "power3.inOut" })
        .to('.shutter_line', { boxShadow: "0 0 35px #38ef7d", duration: 0.1 })
        // シャッターが上下に激しく引き裂かれる
        .to('.shutter_top', { y: "-100%", duration: 0.8, ease: "power4.inOut" }, "+=0.1")
        .to('.shutter_bottom', { y: "100%", duration: 0.8, ease: "power4.inOut" }, "<")
        .to('.shutter_line', { opacity: 0, scaleY: 0, duration: 0.4, ease: "power2.out" }, "<")
        // 奥のグレーのステージが可視化
        .to('.works_content_inner', { opacity: 1, duration: 0.4 }, "-=0.6")
        // カードたちが時間差（スタッガー）で小気味よく湧き上がる
        .to('.work_item', {
            y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.2,
            onComplete: () => {
                // 登場アニメーションが完全に終わったら、触る楽しさのイベントを有効化
                initWorksInteractions();
            }
        }, "-=0.3");

    // ==========================================================================
    // 2. 登場後の楽しい見せる仕掛け：3Dチルト ＆ 慣性マグネット
    // ==========================================================================
// ==========================================================================
    // 2. 登場後の楽しい見せる仕掛け：3Dチルト ＆ 慣性マグネット ＆ リキッドボタン
    // ==========================================================================
    function initWorksInteractions() {
        const workItems = document.querySelectorAll('.work_item');

        workItems.forEach(item => {
            const tiltBox = item.querySelector('.js-tilt-box');
            const magnetMeta = item.querySelector('.js-magnet-meta');
            const liquidBg = item.querySelector('.capsule_liquid_bg');
            
            if (!tiltBox || !magnetMeta) return;

            // 【PC用】マウスの座標に合わせて立体的に吸い付く
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                gsap.to(tiltBox, {
                    transform: `perspective(1000px) rotateY(${x * 12}deg) rotateX(${y * -12}deg) scale(1.02)`,
                    duration: 0.4, ease: "power2.out", overwrite: "auto"
                });

                gsap.to(magnetMeta, {
                    x: x * 15, y: y * 8,
                    duration: 0.5, ease: "power2.out", overwrite: "auto"
                });
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(tiltBox, {
                    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
                    duration: 0.8, ease: "elastic.out(1, 0.6)"
                });
                gsap.to(magnetMeta, {
                    x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.6)"
                });
            });

            // --------------------------------------------------------------------------
            // 【スマホ用：案A】タップした瞬間にボタンが「ぷるん」と歪んで押し込まれる
            // --------------------------------------------------------------------------
            if (liquidBg) {
                item.addEventListener('touchstart', (e) => {
                    const touch = e.touches[0];
                    const rect = item.getBoundingClientRect();
                    const x = (touch.clientX - rect.left) / rect.width - 0.5;

                    // ① 文字エリア全体を指の方向にわずかにたわませる
                    gsap.to(magnetMeta, {
                        x: x * 12,
                        scale: 0.95, // 指でギュッと押し込まれたようなスケールダウン
                        duration: 0.2,
                        ease: "power2.out"
                    });

                    // ② 背景カプセルの4角を別々の数値に激しく歪ませ、水滴のような有機的変化を起こす
                    gsap.to(liquidBg, {
                        borderRadius: "30px 60px 40px 70px / 60px 40px 70px 30px",
                        backgroundColor: "rgba(56, 239, 125, 0.3)",
                        borderColor: "#38ef7d",
                        duration: 0.2,
                        ease: "power2.out"
                    });
                });

                // 指を画面から離した瞬間、極上のバネ効果で「ぷるるんっ」と弾んで元の綺麗なカプセルへ復元
                item.addEventListener('touchend', () => {
                    gsap.to(magnetMeta, {
                        x: 0,
                        scale: 1,
                        duration: 0.6,
                        ease: "elastic.out(1.2, 0.5)" // 弾むバネのイージング
                    });

                    gsap.to(liquidBg, {
                        borderRadius: "50px 50px 50px 50px / 50px 50px 50px 50px",
                        backgroundColor: "rgba(16, 102, 85, 0.2)",
                        borderColor: "rgba(56, 239, 125, 0.4)",
                        duration: 0.6,
                        ease: "elastic.out(1.5, 0.4)" // 背景側はさらに細かくぷるぷると震えながら戻る
                    });
                });
            }
        });
    }
});