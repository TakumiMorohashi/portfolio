/**
 * About Section - Physics Snow Animation (Matter.js)
 * スマホのタッチスクロール不具合・完全修正版
 */
window.addEventListener('load', () => {
    const stage = document.getElementById('about-physics-stage');
    if (!stage || typeof Matter === 'undefined') return;

    // 各タグがクリックされた時にポップアップに表示する詳細データ
    const wordsData = [
        { text: "新潟県三条市出身", title: "新潟県三条市でのルーツ", detail: "金属加工やものづくりの伝統が息づく町、三条市で生まれ育ちました。幼い頃から職人たちの手仕事や緻密な細工に触れてきた環境が、現在の1ピクセル、0.1秒の挙動にこだわる気質の原点になっています。" },
        { text: "Web Designer / Coder", title: "デザインと実装の架け橋", detail: "見た目の美しさはもちろん、それをブラウザ上でどう動かせば人の心が躍るか。設計からコーディングまで一貫して手がけるからこそ、デザインの意図を100%活かした滑らかで破綻のない実装を強みとしています。" },
        { text: "旅行が好き", title: "坂道と潮彩（しおさい）の町", detail: "古き良き坂道を登れば、きらめく瀬戸内の海と尾道水道が一望でき、まるで時が止まったかのような懐かしさに包まれます。一歩歩くごとに、どこか切なく美しい風景が心に染み渡る、私にとって特別で大切な場所です。" },
        { text: "インタラクション命", title: "心地よさを設計する", detail: "ただの静止画や文字の羅列を、触りたくなる『体験』へと変えること。スクロールの加速、ボタンの沈み込みなど、細部へのこだわりがWebサイト全体の体感品質を劇的に高めると信じて日々追求しています。" },
        { text: "Logic & Creativity", title: "論理と感性の融合", detail: "突飛なアイデアだけで終わらせず、確かなコーディング技術と数式、ライブラリの深い理解をもってして盤石な形に落とし込む。論理（ロジック）に裏打ちされた表現だからこそ、見る人にストレスのない感動を与えられます。" },
        { text: "ワクワクを形にする", title: "ものづくりの理想", detail: "訪れた人が思わず何度もスクロールしたくなる、ついついつまんで投げてみたくなる。そんな小さな遊び心や驚きを仕込む時間が何より好きです。技術的な挑戦を常に楽しみながら制作に向き合っています。" },
        { text: "1998年生まれ", title: "これまでの歩み", detail: "デジタル表現の進化とともに歩んできました。新しい技術や表現手法が次々と生まれるこの業界において、常にフットワーク軽く学びを楽しみ、自分の引き出しをアップデートし続ける原動力を持ち続けています。" }
    ];

    const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

    const engine = Engine.create({ gravity: { y: 0.5 } });
    const world = engine.world;

    // 実際のブラウザ描画上の高さを動的に取得
    let width = stage.getBoundingClientRect().width || window.innerWidth;
    let height = stage.getBoundingClientRect().height || window.innerHeight;

    const FLOOR_OFFSET = 140;

    // 外枠（床・左壁・右壁）の作成
    const wallOptions = { isStatic: true, render: { visible: false } };
    let ground = Bodies.rectangle(width / 2, height + FLOOR_OFFSET, width * 2, 60, wallOptions);
    let leftWall = Bodies.rectangle(-30, height / 2, 60, height * 2, wallOptions);
    let rightWall = Bodies.rectangle(width + 30, height / 2, 60, height * 2, wallOptions);
    Composite.add(world, [ground, leftWall, rightWall]);

    const runner = Runner.create();
    Runner.run(runner, engine);

    const textBlocks = [];
    let hasDropped = false;

    function dropWords() {
        if (hasDropped) return;
        hasDropped = true;

        wordsData.forEach((data, index) => {
            const el = document.createElement('a');
            el.href = "javascript:void(0);"; 
            el.className = 'about-snow-word'; 
            el.textContent = data.text;
            
            el.style.position = 'absolute';
            el.style.display = 'inline-block';
            el.style.whiteSpace = 'nowrap';
            el.style.visibility = 'hidden'; 
            stage.appendChild(el);

            const bWidth = el.offsetWidth || 150;
            const bHeight = el.offsetHeight || 40;
            el.style.visibility = 'visible';

            const startX = Math.random() * (width - bWidth) + bWidth / 2;
            const startY = -bHeight - (index * 90); 

            const body = Bodies.rectangle(startX, startY, bWidth, bHeight, {
                restitution: 0.2, friction: 0.1,
                angle: (Math.random() - 0.5) * 0.3
            });

            let startTime = 0;

            el.addEventListener('mousedown', () => { startTime = Date.now(); });
            el.addEventListener('touchstart', () => { startTime = Date.now(); });

            const handleRelease = () => {
                const duration = Date.now() - startTime;
                if (duration < 200) {
                    openAboutModal(data.title, data.detail);
                }
            };
            el.addEventListener('mouseup', handleRelease);
            el.addEventListener('touchend', handleRelease);

            Composite.add(world, body);
            textBlocks.push({ element: el, body: body });
        });

        Events.on(engine, 'afterUpdate', () => {
            textBlocks.forEach(pair => {
                const { element, body } = pair;
                const { x, y } = body.position;
                const angle = body.angle;

                if (!isNaN(x) && !isNaN(y)) {
                    element.style.left = `${x - element.offsetWidth / 2}px`;
                    element.style.top = `${y - element.offsetHeight / 2}px`;
                    element.style.transform = `rotate(${angle}rad)`;
                }
            });
        });

        if (document.querySelector('.about_statement_wrap')) {
            gsap.to('.about_statement_wrap', {
                opacity: 1, y: 0, duration: 1.8, delay: 3.5, ease: "power3.out"
            });
        }
    }

    // マウス・タッチのドラッグ制約
    const mouse = Mouse.create(stage);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: { stiffness: 0.2, render: { visible: false } }
    });
    Composite.add(world, mouseConstraint);

    // 【重要：スマホスクロールのブロックを完全解除】
    // Matter.jsが横取りしてしまうタッチ・スクロール系の初期イベントをピンポイントで無効化します。
    if (mouseConstraint.mouse.element) {
        mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
        mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);
        
        // タッチイベントの横取り設定を解除し、背景スワイプでの縦スクロールを完全にブラウザへ返却
        mouseConstraint.mouse.element.removeEventListener('touchstart', mouseConstraint.mouse.mousedown);
        mouseConstraint.mouse.element.removeEventListener('touchmove', mouseConstraint.mouse.mousemove);
        mouseConstraint.mouse.element.removeEventListener('touchend', mouseConstraint.mouse.mouseup);
    }

    // モーダル（ポップアップ）制御関数
    const modal = document.getElementById('about-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const modalClose = document.querySelector('.about_modal_close');

    function openAboutModal(title, text) {
        if (!modal || !modalTitle || !modalText) return;
        modalTitle.textContent = title;
        modalText.innerHTML = `<p>${text}</p>`;
        
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('is-active');
        }, 10);
    }

    if (modalClose && modal) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('is-active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 400);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('is-active');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 400);
            }
        });
    }

    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
            trigger: "#about", start: "top top+=200px",
            onEnter: () => { dropWords(); }
        });
    } else {
        setTimeout(dropWords, 2000);
    }

    window.addEventListener('resize', () => {
        width = stage.getBoundingClientRect().width || window.innerWidth;
        height = stage.getBoundingClientRect().height || window.innerHeight;
        Matter.Body.setPosition(ground, { x: width / 2, y: height + FLOOR_OFFSET });
        Matter.Body.setPosition(rightWall, { x: width + 30, y: height / 2 });
    });
});