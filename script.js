document.getElementById('downloadBtn').addEventListener('click', async () => {
    const urlInput = document.getElementById('siteUrl');
    const btn = document.getElementById('downloadBtn');
    const loader = document.getElementById('loader');
    const status = document.getElementById('status');
    
    const url = urlInput.value.trim();
    
    if (!url) {
        showStatus('لطفاً آدرس سایت را وارد کنید.', 'error');
        return;
    }
    
    // Validate URL
    try {
        new URL(url);
    } catch {
        showStatus('آدرس وارد شده معتبر نیست.', 'error');
        return;
    }
    
    btn.disabled = true;
    loader.style.display = 'block';
    status.style.display = 'none';
    
    try {
        showStatus('در حال دریافت محتوا...', 'info');
        
        // Use CORS proxy
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
            throw new Error(`خطا در دریافت: ${response.status}`);
        }
        
        let html = await response.text();
        
        showStatus('در حال پردازش HTML...', 'info');
        
        // Convert relative URLs to absolute
        const baseUrl = new URL(url).origin;
        html = html.replace(/href="(?!http|\/\/|#|mailto|tel)([^"]*)"/g, `href="${baseUrl}/$1"`);
        html = html.replace(/src="(?!http|\/\/|data:)([^"]*)"/g, `src="${baseUrl}/$1"`);
        
        // Download CSS and inline them
        const cssLinks = html.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/g) || [];
        for (const link of cssLinks) {
            const hrefMatch = link.match(/href=["']([^"']+)["']/);
            if (hrefMatch) {
                try {
                    const cssUrl = hrefMatch[1].startsWith('http') ? hrefMatch[1] : `${baseUrl}${hrefMatch[1]}`;
                    const cssProxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(cssUrl)}`;
                    const cssResponse = await fetch(cssProxy);
                    const cssContent = await cssResponse.text();
                    html = html.replace(link, `<style>${cssContent}</style>`);
                } catch (e) {
                    console.warn('CSS fetch failed:', e);
                }
            }
        }
        
        showStatus('آماده‌سازی فایل...', 'info');
        
        // Create download
        const blob = new Blob([html], { type: 'text/html' });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `site-${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
        
        showStatus('✅ دانلود با موفقیت انجام شد!', 'success');
        
    } catch (error) {
        showStatus(`❌ خطا: ${error.message}`, 'error');
        console.error(error);
    } finally {
        btn.disabled = false;
        loader.style.display = 'none';
    }
});

function showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
}
