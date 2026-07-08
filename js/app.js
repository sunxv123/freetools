// ============ 多语言 ============
const i18n = {
    zh: {
        heroTitle: "免费在线工具箱",
        heroDesc: "所有工具在浏览器本地运行，文件不上传服务器，安全、快速、免费",
        searchPlaceholder: "搜索工具...",
        freeUsage: "今日免费使用次数：",
        watchAd: "看广告 +5次",
        upgrade: "升级会员无限用",
        adModalTitle: "观看广告获取使用次数",
        adPlaying: "广告播放中...",
        adReward: "观看完成后 +5 次使用次数",
        skip: "跳过（不获得奖励）",
        footerText: "所有工具在本地浏览器运行，文件不上传服务器。",
        pdfTools: "PDF工具", pdfMerge: "PDF合并", pdfMergeDesc: "合并多个PDF为一个文件",
        pdfSplit: "PDF拆分", pdfSplitDesc: "按页码拆分PDF文件",
        pdfCompress: "PDF压缩", pdfCompressDesc: "减小PDF文件大小",
        pdfRotate: "PDF旋转", pdfRotateDesc: "旋转PDF页面方向",
        imageTools: "图片工具", imgCompress: "图片压缩", imgCompressDesc: "压缩图片文件大小",
        imgConvert: "格式转换", imgConvertDesc: "JPG/PNG/WEBP互转",
        imgWatermark: "加水印", imgWatermarkDesc: "给图片添加文字水印",
        imgBase64: "Base64", imgBase64Desc: "图片转Base64编码",
        textTools: "文本工具", textJson: "JSON格式化", textJsonDesc: "JSON美化/压缩/校验",
        textBase64: "Base64", textBase64Desc: "Base64编码/解码",
        textUrl: "URL编解码", textUrlDesc: "URL编码/解码",
        textMarkdown: "Markdown", textMarkdownDesc: "Markdown实时预览",
        calcTools: "计算工具", calc: "科学计算器", calcDesc: "在线科学计算器",
        calcUnit: "单位换算", calcUnitDesc: "长度/重量/温度换算",
        calcPassword: "密码生成", calcPasswordDesc: "生成安全随机密码",
        calcLoan: "贷款计算", calcLoanDesc: "房贷/车贷月供计算"
    },
    en: {
        heroTitle: "Free Online Tools",
        heroDesc: "All tools run locally in your browser. Files never uploaded. Safe, fast & free.",
        searchPlaceholder: "Search tools...",
        freeUsage: "Free uses today: ",
        watchAd: "Watch Ad +5",
        upgrade: "Upgrade for unlimited",
        adModalTitle: "Watch Ad to Get More Uses",
        adPlaying: "Ad playing...",
        adReward: "+5 uses after watching",
        skip: "Skip (no reward)",
        footerText: "All tools run locally in your browser. Files never uploaded.",
        pdfTools: "PDF Tools", pdfMerge: "PDF Merge", pdfMergeDesc: "Merge multiple PDFs into one",
        pdfSplit: "PDF Split", pdfSplitDesc: "Split PDF by page numbers",
        pdfCompress: "PDF Compress", pdfCompressDesc: "Reduce PDF file size",
        pdfRotate: "PDF Rotate", pdfRotateDesc: "Rotate PDF pages",
        imageTools: "Image Tools", imgCompress: "Compress", imgCompressDesc: "Reduce image size",
        imgConvert: "Convert", imgConvertDesc: "JPG/PNG/WEBP conversion",
        imgWatermark: "Watermark", imgWatermarkDesc: "Add text watermark to images",
        imgBase64: "Base64", imgBase64Desc: "Image to Base64",
        textTools: "Text Tools", textJson: "JSON Format", textJsonDesc: "JSON beautify/minify/validate",
        textBase64: "Base64", textBase64Desc: "Base64 encode/decode",
        textUrl: "URL Encode", textUrlDesc: "URL encode/decode",
        textMarkdown: "Markdown", textMarkdownDesc: "Live Markdown preview",
        calcTools: "Calculator", calc: "Calculator", calcDesc: "Scientific calculator",
        calcUnit: "Unit Converter", calcUnitDesc: "Length/Weight/Temp conversion",
        calcPassword: "Password Gen", calcPasswordDesc: "Generate secure passwords",
        calcLoan: "Loan Calculator", calcLoanDesc: "Mortgage/Auto loan calculator"
    }
};

let currentLang = localStorage.getItem('ft_lang') || 'zh';

function applyLang() {
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
    const dict = i18n[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) el.placeholder = dict[key];
    });
}

function toggleLang() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    localStorage.setItem('ft_lang', currentLang);
    applyLang();
}

// ============ 使用次数系统 ============
const MAX_FREE = 10;
function getUsage() {
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem('ft_usage') || '{"date":"","count":0}');
    if (stored.date !== today) {
        const fresh = { date: today, count: MAX_FREE };
        localStorage.setItem('ft_usage', JSON.stringify(fresh));
        return fresh.count;
    }
    return stored.count;
}

function setUsage(n) {
    const today = new Date().toDateString();
    localStorage.setItem('ft_usage', JSON.stringify({ date: today, count: n }));
    updateUsageUI();
}

function updateUsageUI() {
    const el = document.getElementById('usageCount');
    if (el) el.textContent = getUsage();
}

function consumeUse() {
    const isSub = localStorage.getItem('ft_subscriber') === '1';
    if (isSub) return true;
    const left = getUsage();
    if (left <= 0) {
        alert(currentLang === 'zh' ? '今日免费次数已用完，请观看广告或升级会员' : 'Free uses exhausted. Watch ad or upgrade.');
        return false;
    }
    setUsage(left - 1);
    return true;
}

// ============ 广告系统 ============
function closeAd(id) {
    document.getElementById(id).style.display = 'none';
}

function watchAd() {
    const modal = document.getElementById('adModal');
    if (!modal) return;
    modal.style.display = 'flex';
    let sec = 30;
    const timerEl = modal.querySelector('.ad-timer');
    timerEl.textContent = sec;
    const interval = setInterval(() => {
        sec--;
        timerEl.textContent = sec;
        if (sec <= 0) {
            clearInterval(interval);
            closeAdModal();
            const left = getUsage();
            setUsage(left + 5);
            alert(currentLang === 'zh' ? '已获得 +5 次使用次数！' : '+5 uses granted!');
        }
    }, 1000);
    modal.dataset.interval = interval;
}

function closeAdModal() {
    const modal = document.getElementById('adModal');
    if (modal) {
        modal.style.display = 'none';
        if (modal.dataset.interval) clearInterval(parseInt(modal.dataset.interval));
    }
}

// ============ 搜索 ============
function searchTools() {
    const q = (document.getElementById('toolSearch')?.value || '').toLowerCase();
    document.querySelectorAll('.tool-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? 'block' : 'none';
    });
    document.querySelectorAll('.tool-category').forEach(cat => {
        const visible = cat.querySelectorAll('.tool-card:not([style*="none"])').length;
        cat.style.display = visible > 0 ? 'block' : 'none';
    });
}

// ============ 通用工具函数 ============
function downloadFile(blob, filename) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
}

function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsArrayBuffer(file);
    });
}

function readFileAsDataURL(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert(currentLang === 'zh' ? '已复制到剪贴板' : 'Copied to clipboard');
    });
}

// ============ 初始化 ============
document.addEventListener('DOMContentLoaded', () => {
    applyLang();
    updateUsageUI();
});
