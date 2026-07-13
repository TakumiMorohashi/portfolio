/**
 * About Section - Physics Snow Animation (Matter.js)
 * スマホのタッチスクロール不具合・完全修正版
 */
window.addEventListener('load', () => {
    const stage = document.getElementById('about-physics-stage');
    if (!stage || typeof Matter === 'undefined') return;

    // 各タグがクリックされた時にポップアップに表示する詳細データ
    const wordsData = [
        { text: "新潟県三条市出身", title: "新潟県三条市出身", detail: "新潟県三条市の、山々に囲まれた自然豊かなロケーションが私の地元です。小さな頃から一人で黙々と遊ぶのが得意で、常に自分でオリジナルの遊び方を開発しては楽しんでいるような子どもでした。大人になった今でも、あの頃に覚えた「自分で仕組みを作って楽しむこと」への愛着は変わらず私の中に根付いています。" },
        { text: "Webを志したきっかけ", title: "Webを志したきっかけ", detail: "普段何気なく見ているWebサイトの裏側に、実は無数のコードや緻密な設計が隠されていると知ったとき、子どもの頃に時計をバラして仕組みを覗いたときのようなワクワク感が一気に蘇りました。画面の向こうにある広大な世界を、自分の手でゼロから組み立て、動かせるおもしろさにすっかり魅了されたのが始まりです。" },
        { text: "旅行が好き", title: "旅行が好き", detail: "知らない街の空気を感じたり、のんびり散策したりする旅が好きです。中でも広島県の「尾道」は、何度も訪れたくなる特別な場所。レトロな坂道を上りながらふと振り返ったときに見える瀬戸内海や、路地裏で出会う猫たち、あの街全体に流れる穏やかな時間がたまらなく好きで、行くたびに心が癒やされます。" },
        { text: "サッカー少年", title: "旅行が好き", detail: "学生時代はサッカー部で、とにかくボールを蹴るのが日常でした。自分でプレイするのはもちろんですが、国内外の試合を観戦するのも趣味の一つです。戦術の面白さや、劇的なゴールシーンを見たときのあのワクワク感は、何歳になっても色褪せない最高のエンターテインメントだと思っています。" },
        { text: "お笑い愛", title: "お笑い愛", detail: "バラエティ番組を見るのも楽しいですが、特に「漫才」が大好きです。センターマイクが1本あるだけの舞台で、2人の芸人さんが言葉とテンポだけで爆笑を起こすあの空気感にいつも魅了されています。毎年冬の賞レースの時期は、テレビの前で見ているこちらまで手に汗を握るほど熱くなって応援してしまいます。" },
        { text: "最高の食べ物", title: "最高の食べ物", detail: "世の中には美味しいものがたくさんありますが、自分にとっての最高は「駄菓子」です。子どもの頃、限られたお小遣いを握りしめてどれを買うか真剣に悩んだあの時間が原点。大人になった今、コンビニや専門店でカゴいっぱいに“大人買い”する瞬間のささやかな贅沢感とロマンは、何歳になっても変わらずワクワクしてしまいます。" },
        { text: "1998年生まれ", title: "1998年生まれ", detail: "いわゆる「平成10年」に生まれました。子どもの頃はゲームボーイアドバンスやニンテンドーDSの全盛期。放課後は友達の家に集まってゲームばかりしていました。あの平成の終わりがけの、どこかノスタルジックで少し不便だった時代のカルチャーや空気感が、今でも無性に愛おしくなることがあります。" }
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