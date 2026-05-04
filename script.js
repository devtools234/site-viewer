// بررسی وضعیت GitHub Pages
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 Website Proxy Tool loaded successfully!');
    
    // تشخیص مخزن GitHub
    const repoPath = window.location.pathname.split('/').filter(Boolean);
    let actionsUrl = '#';
    
    if (repoPath.length >= 2) {
        const owner = repoPath[0];
        const repo = repoPath[1];
        actionsUrl = `https://github.com/${owner}/${repo}/actions`;
        
        // نمایش لینک Actions
        const actionsLinkSpan = document.getElementById('actionsLink');
        if (actionsLinkSpan) {
            actionsLinkSpan.textContent = actionsUrl;
        }
        
        console.log(`📦 Repository: ${owner}/${repo}`);
        console.log(`🔗 Actions URL: ${actionsUrl}`);
    } else {
        // اگر در محیط لوکال است
        const actionsLinkSpan = document.getElementById('actionsLink');
        if (actionsLinkSpan) {
            actionsLinkSpan.textContent = 'https://github.com/YOUR-USERNAME/YOUR-REPO/actions';
        }
    }
    
    // تنظیم لینک دکمه
    const actionsBtn = document.getElementById('actionsBtn');
    if (actionsBtn && actionsUrl !== '#') {
        actionsBtn.href = actionsUrl;
        actionsBtn.target = '_blank';
    }
    
    // اضافه کردن انیمیشن به دکمه
    if (actionsBtn) {
        actionsBtn.addEventListener('click', function(e) {
            if (this.href === '#' || this.href.endsWith('#')) {
                e.preventDefault();
                showNotification('⚠️ لطفاً این صفحه را از GitHub Pages باز کنید', 'warning');
                return;
            }
            
            // ایجاد افکت ripple
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.width = '100px';
            ripple.style.height = '100px';
            ripple.style.marginTop = '-50px';
            ripple.style.marginLeft = '-50px';
            ripple.style.animation = 'ripple 0.6s';
            ripple.style.pointerEvents = 'none';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
    
    // بررسی اتصال به اینترنت
    if (!navigator.onLine) {
        showNotification('⚠️ اتصال به اینترنت برقرار نیست', 'warning');
    }
});

// تابع نمایش نوتیفیکیشن
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'warning' ? '#ff9800' : '#4caf50'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-family: Tahoma, sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// انیمیشن‌های CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        from {
            opacity: 1;
            transform: scale(0);
        }
        to {
            opacity: 0;
            transform: scale(2);
        }
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// مدیریت خطاها
window.addEventListener('error', function(e) {
    console.error('❌ Error:', e.message);
});

// لاگ زمان بارگذاری
window.addEventListener('load', function() {
    console.log('✅ Page fully loaded');
});
