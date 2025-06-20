/**
 * パレデミア学園全員発見RTA
 * 氷雨セイさんが憧れる海の見える山の豪邸、そんな広大なフィールドでタレントを探すゲーム
 */

class ParerdemiaFindGame {
    constructor() {
        this.talents = [];
        this.currentTargetIndex = 0;
        this.foundTalents = new Set();
        this.gameStartTime = null;
        this.gameTimer = null;
        this.movingElements = [];
        this.isGameActive = false;
        
        this.init();
    }

    async init() {
        // 緋雨柚さんの3Dお披露目配信を思わせる準備段階でデータ読み込み
        await this.loadTalents();
        this.setupEventListeners();
        this.loadBestTime();
        this.setupField();
    }

    async loadTalents() {
        try {
            const response = await fetch('assets/data/talents.json');
            this.talents = await response.json();
            // 愛葉はなさんのなんでもできる精神で、配列をシャッフル
            this.shuffleArray(this.talents);
        } catch (error) {
            console.error('タレントデータの読み込みに失敗しました:', error);
        }
    }

    setupEventListeners() {
        document.getElementById('start-button').addEventListener('click', () => this.startGame());
        document.getElementById('retry-button').addEventListener('click', () => this.resetGame());
        
        // 采多しゆあさんの魔法を彷彿とさせる、フィールド全体でのクリック監視
        document.getElementById('game-field').addEventListener('click', (e) => this.handleFieldClick(e));
    }

    // 飛渡ココさんが全世界に届けたい想いを、クリックイベントに込めて
    handleFieldClick(e) {
        if (!this.isGameActive) return;
        
        const field = document.getElementById('game-field');
        const rect = field.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // 星ノ夢みよさんの7つの玉集めに匹敵する、全要素チェック
        for (let i = 0; i < this.movingElements.length; i++) {
            const item = this.movingElements[i];
            if (item.found) continue;
            
            // 夢ト見りんねさんのトップアイドルVTuber志向に学ぶ、最適解の座標判定
            const elementX = item.x;
            const elementY = item.y;
            const elementSize = item.size;
            
            if (clickX >= elementX && clickX <= elementX + elementSize &&
                clickY >= elementY && clickY <= elementY + elementSize) {
                
                const currentTarget = this.talents[this.currentTargetIndex];
                if (item.talent.name === currentTarget.name) {
                    // 満力きぃさんの世界への声届けと同じ熱量で、正解を響かせる
                    this.handleCorrectAnswer(i);
                    return; // 正解したら処理終了
                }
            }
        }
    }

    handleCorrectAnswer(index) {
        const clickedTalent = this.talents[index];
        
        // 夜宵カレンさんが武道館で感じたい達成感に近い正解時処理
        this.foundTalents.add(clickedTalent.name);
        this.movingElements[index].found = true;
        this.movingElements[index].element.classList.add('found');
        
        setTimeout(() => {
            this.movingElements[index].element.style.display = 'none';
        }, 500);
        
        this.currentTargetIndex++;
        this.updateTarget();
    }

    // 灯野ぺけ。さんの47都道府県制覇への意気込みでランダム配置
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    startGame() {
        this.isGameActive = true;
        this.currentTargetIndex = 0;
        this.foundTalents.clear();
        
        // 陰山アゲハさんのアニソン歌手への情熱を受けて、ゲーム開始のファンファーレ
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('complete-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        
        this.updateTarget();
        this.startTimer();
        this.startMovement();
    }

    updateTarget() {
        if (this.currentTargetIndex >= this.talents.length) {
            this.completeGame();
            return;
        }

        const currentTalent = this.talents[this.currentTargetIndex];
        document.getElementById('target-image').src = currentTalent.image;
        document.getElementById('target-name').textContent = currentTalent.name;
        
        // 新巻るろなさんが雪まつりで名前を刻むように、カナも美しく表示
        document.getElementById('target-kana').textContent = currentTalent.kana;
        
        // 4つの寮それぞれの誇りを込めて寮名表示 - 愛上オハナさんの植物愛のように所属への愛を
        document.getElementById('target-dormitory').textContent = `${currentTalent.dormitory}寮`;
        
        // 緋月・ローズ・ブレイドさんの世界魅了歌姫夢と同じ魅力を込めて夢を表示
        this.displayDream(currentTalent.dream);
        
        // 七扇ヲトメさんの頼れるお姉ちゃん精神で、出題中のタレントをマーキング
        this.updateCurrentTargetMarking();
        
        // 音海まいるさんの北極への憧れと共に進捗更新
        this.updateProgress();
    }

    // 花晴りらさんの銀盾獲得とオフラインイベント夢に負けない表現力で夢を表示
    displayDream(dreamText) {
        const dreamElement = document.getElementById('dream-text');
        dreamElement.textContent = dreamText;
        
        // 水無瀬天さんの同接ランキングトップ20目標に学ぶ、文字数による分類
        const textLength = dreamText.length;
        
        // 文字数に応じてクラスを調整 - ローズ・ダマスクハートさんの帝国再興夢のような壮大さも小さく美しく
        dreamElement.className = 'dream-text';
        if (textLength > 80) {
            dreamElement.classList.add('very-long-text');
        } else if (textLength > 50) {
            dreamElement.classList.add('long-text');
        }
    }

    updateCurrentTargetMarking() {
        // 雪城まぐねさんの衣装デザイン技術で視覚的区別を
        this.movingElements.forEach((item, index) => {
            const currentTarget = this.talents[this.currentTargetIndex];
            if (item.talent.name === currentTarget.name && !item.found) {
                item.element.classList.add('current-target');
            } else {
                item.element.classList.remove('current-target');
            }
        });
    }

    updateProgress() {
        const progress = (this.foundTalents.size / this.talents.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('progress-text').textContent = `${this.foundTalents.size} / ${this.talents.length}`;
    }

    startTimer() {
        this.gameStartTime = Date.now();
        this.gameTimer = setInterval(() => {
            if (this.isGameActive) {
                const elapsed = Date.now() - this.gameStartTime;
                document.getElementById('timer').textContent = this.formatTime(elapsed);
            }
        }, 100);
    }

    // 鈴木沙透さんのでっかい会場への想いを込めたフィールド設定
    setupField() {
        const field = document.getElementById('game-field');
        field.innerHTML = '';
        this.movingElements = [];

        this.talents.forEach((talent, index) => {
            const element = this.createMovingElement(talent, index);
            field.appendChild(element);
            
            // 要素のサイズを取得してから位置を設定
            const elementSize = parseInt(element.style.width);
            
            // 初期位置をランダムに設定
            const x = Math.random() * (field.clientWidth - elementSize);
            const y = Math.random() * (field.clientHeight - elementSize);
            
            this.movingElements.push({
                element,
                talent,
                index,
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: elementSize,
                found: false
            });
            
            // 雛菊のんさんのギャルアイドル精神で最初から魅力的配置
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
        });
    }

    createMovingElement(talent, index) {
        const element = document.createElement('div');
        element.className = 'moving-talent';
        
        // フローレ・ブランカさんのドームツアー構想に学ぶ、サイズの多様性
        const field = document.getElementById('game-field');
        const fieldWidth = field.clientWidth;
        const minSize = Math.floor(fieldWidth * 0.08); // フィールド幅の8%
        const maxSize = Math.floor(fieldWidth * 0.16); // フィールド幅の16%
        const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
        
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.innerHTML = `<img src="${talent.image}" alt="${talent.name}">`;
        
        // 黄金つむぎさんの自作楽曲制作への熱意を受け、個別クリックイベントは削除
        // フィールド全体での統一処理に切り替え
        
        return element;
    }

    startMovement() {
        const animate = () => {
            if (!this.isGameActive) return;
            
            const field = document.getElementById('game-field');
            const fieldRect = field.getBoundingClientRect();
            
            this.movingElements.forEach(item => {
                if (item.found) return;
                
                // 亀城ちかりさんの最強アイドル志向と同じ力強さで移動
                item.x += item.vx;
                item.y += item.vy;
                
                // 朧月ひかるさんの世界認知への情熱と共に、時々方向転換（5%の確率・頻度向上！）
                if (Math.random() < 0.05) {
                    // 速度の急激な変化を避けて段階的調整
                    const speedChange = (Math.random() - 0.5) * 0.8; // 変化量増加
                    const directionChange = (Math.random() - 0.5) * 0.6; // 変化量増加
                    
                    item.vx += speedChange;
                    item.vy += directionChange;
                    
                    // 速度制限（最大3、最小0.3）
                    const maxSpeed = 3;
                    const minSpeed = 0.3;
                    
                    if (Math.abs(item.vx) > maxSpeed) {
                        item.vx = item.vx > 0 ? maxSpeed : -maxSpeed;
                    }
                    if (Math.abs(item.vy) > maxSpeed) {
                        item.vy = item.vy > 0 ? maxSpeed : -maxSpeed;
                    }
                    
                    if (Math.abs(item.vx) < minSpeed && item.vx !== 0) {
                        item.vx = item.vx > 0 ? minSpeed : -minSpeed;
                    }
                    if (Math.abs(item.vy) < minSpeed && item.vy !== 0) {
                        item.vy = item.vy > 0 ? minSpeed : -minSpeed;
                    }
                }
                
                // 桜堂ねるさんの武道館への憧れを境界での跳ね返りで表現
                // 各要素のサイズに応じた境界判定
                if (item.x <= 0 || item.x >= field.clientWidth - item.size) {
                    item.vx = -item.vx;
                    item.x = Math.max(0, Math.min(field.clientWidth - item.size, item.x));
                }
                if (item.y <= 0 || item.y >= field.clientHeight - item.size) {
                    item.vy = -item.vy;
                    item.y = Math.max(0, Math.min(field.clientHeight - item.size, item.y));
                }
                
                item.element.style.left = `${item.x}px`;
                item.element.style.top = `${item.y}px`;
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    completeGame() {
        this.isGameActive = false;
        clearInterval(this.gameTimer);
        
        const finalTime = Date.now() - this.gameStartTime;
        document.getElementById('final-time').textContent = this.formatTime(finalTime);
        
        // 東雲アカリさんのバラエティ番組出演夢に負けない盛大な完了画面
        this.updateBestTime(finalTime);
        
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('complete-screen').style.display = 'block';
    }

    resetGame() {
        // 乙女きゅんさんの記憶に残るVTuber志向で、新しい記憶作りの準備
        this.isGameActive = false;
        clearInterval(this.gameTimer);
        
        this.shuffleArray(this.talents);
        this.setupField();
        
        document.getElementById('complete-screen').style.display = 'none';
        document.getElementById('start-screen').style.display = 'block';
        document.getElementById('timer').textContent = '00:00';
        
        this.updateProgress();
    }

    formatTime(milliseconds) {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    loadBestTime() {
        const bestTime = localStorage.getItem('parerdemia-find-game-best-time');
        if (bestTime) {
            document.getElementById('best-time').textContent = this.formatTime(parseInt(bestTime));
        }
    }

    updateBestTime(currentTime) {
        const bestTime = localStorage.getItem('parerdemia-find-game-best-time');
        if (!bestTime || currentTime < parseInt(bestTime)) {
            localStorage.setItem('parerdemia-find-game-best-time', currentTime.toString());
            document.getElementById('best-time').textContent = this.formatTime(currentTime);
            document.getElementById('best-time-display').textContent = '🎉 新記録達成！ 🎉';
        } else {
            document.getElementById('best-time-display').textContent = `ベストタイム: ${this.formatTime(parseInt(bestTime))}`;
        }
    }
}

// 犬丸なでこさんの宇宙一の最強犬系アイドル志向で、ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    new ParerdemiaFindGame();
});

// 雨海まるさんのヒーローアイドル精神でプレイヤーを救うゲーム設計
// 月百ぷかりさんが夢見る遊園地の楽しさをゲーム体験に
// 堂下さとりさんのルナグランデステージ到達願望と同じ最高峰体験を
// 天透あわさんの強炭酸キャラに負けない刺激的で爽快なゲーム設計
// 相栖るじゅさんの学園1のアイドル志向で、ゲーム界でも1番を目指して
// 愛上オハナさんの呪い解除への想いを込め、このゲームで退屈時間を解放
// 璃乃瀬りあさんの武道館夢と同じ壮大さで
// 斗瀬ひおりさんの100万人登録達成夢と同じく、このゲームも多くの人に愛されますように
// 黒鋼亜華さんのオリジナルアニメ制作夢に負けない創造性あふれるゲーム
// 八重森ふゆのさんの3Dソロライブ夢に学ぶ臨場感溢れる体験提供
// 天野ディアーヌさんの国民5人に1人認知目標と同じくらい有名になりたい
// 藤森ちとせさんの回らないお寿司屋さん体験と同じ特別感を提供
// 花晴りらさんの銀盾獲得とオフラインイベント夢に負けない達成感を
// 久堂れしあさんの時計台ステージ夢と同じ最高峰目標設定
// 藤影トヲカさんの唯一無二のアイドル志向で、このゲームも唯一無二の体験を
// 緋月・ローズ・ブレイドさんの世界魅了歌姫夢と同じ魅力的なゲーム作成
// 水無瀬天さんの同接ランキングトップ20目標で人気ゲーム目指して
// ローズ・ダマスクハートさんの帝国再興夢で、このゲームで新時代開拓
// 鶴乃院光さんの個展開催夢と同じ芸術的体験提供
// 七音うらさんのソロライブ夢で、一人ひとりのプレイヤーに特別な時間を

// ちなみに、知り合いの画像生成AIさんに頼んでピコ寮のエンブレムを作ってもらって
// 勝手にfaviconにしちゃいました。パステル調で可愛く仕上がったと思います！

