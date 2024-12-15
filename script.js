document.addEventListener('DOMContentLoaded', () => {
    fetchWallpaper();
});

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

async function fetchWallpaper() {
    const wallpaperImg = document.getElementById('wallpaper');
    wallpaperImg.classList.add('loading');
    
    try {
        const response = await fetch('https://api.dwo.cc/api/bing?info=true');
        if (!response.ok) {
            throw new Error('网络响应出错');
        }
        
        const data = await response.json();
        
        wallpaperImg.onload = () => {
            wallpaperImg.classList.remove('loading');
            document.querySelector('.info-overlay').style.transform = 'translateY(0)';
            setTimeout(() => {
                document.querySelector('.info-overlay').style.transform = '';
            }, 3000);
        };
        
        wallpaperImg.src = data.url;
        document.getElementById('title').textContent = data.title;
        document.getElementById('date').textContent = formatDate(data.time);
        document.getElementById('searchLink').href = data.link;

        // 预加载下一张图片
        const preloadImg = new Image();
        preloadImg.src = data.url;
    } catch (error) {
        console.error('获取壁纸失败:', error);
        showError('获取壁纸失败，请稍后重试');
    }
}

function showError(message) {
    const container = document.querySelector('.container');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #721c24;
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        padding: 15px;
        border-radius: 10px;
        margin: 20px 0;
        text-align: center;
    `;
    container.insertBefore(errorDiv, container.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}