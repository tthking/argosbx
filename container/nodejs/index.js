const os = require('os');
const http = require('http');
const fs = require('fs');
const net = require('net');
const { exec, execSync } = require('child_process');
function ensureModule(name) {
    try {
        require.resolve(name);
    } catch (e) {
        console.log(`Module '${name}' not found. Installing...`);
        execSync(`npm install ${name}`, { stdio: 'inherit' });
    }
}
const { WebSocket, createWebSocketStream } = require('ws');
const configPath = `/root/user_config.env`;
const subtxt = `/root/agsbx/jh.txt`;
const NAME = process.env.NAME || os.hostname();
const PORT = process.env.PORT || 3000;
let uuid = process.env.uuid || '79411d85-b0dc-4cd2-b46c-01789a18c650';
const DOMAIN = process.env.DOMAIN || 'YOUR.DOMAIN';
let vlessInfo = `vless://${uuid}@${DOMAIN}:443?encryption=none&security=tls&sni=${DOMAIN}&fp=chrome&type=ws&host=${DOMAIN}&path=%2F#Vl-ws-tls-${NAME}`;

function getSavedConfig() {
    if (fs.existsSync(configPath)) {
        return fs.readFileSync(configPath, 'utf8');
    }
    return "";
}

console.log(`vless-ws-tls节点分享: ${vlessInfo}`);

fs.chmod("start.sh", 0o777, (err) => {
    if (err) {
        console.error(`start.sh empowerment failed: ${err}`);
        return;
    }
    console.log(`start.sh empowerment successful`);
    
    // 启动时尝试加载保存的配置
    const savedVars = getSavedConfig();
    let cmd = `bash start.sh`;
    if (savedVars) {
        console.log(`Checking for saved configuration...`);
        cmd = `export ${savedVars.replace(/ /g, ' export ')} && bash start.sh`;
    }

    const child = exec(cmd);
    child.stdout.on('data', (data) => process.stdout.write(data));
    child.stderr.on('data', (data) => process.stderr.write(data));
    child.stderr.on('data', (data) => console.error(data));
    child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        console.clear();
        console.log(`App is running`);
    });
});

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Argosbx Deployment Success</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;600&display=swap" rel="stylesheet">
    <style>
        body {
            background: #0b1020;
            color: #fff;
            font-family: 'Outfit', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            text-align: center;
        }
        .container {
            background: rgba(255, 255, 255, 0.05);
            padding: 40px;
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            max-width: 500px;
        }
        h1 { color: #4f7cff; margin-bottom: 10px; }
        p { color: #888; line-height: 1.6; }
        .uuid-box {
            background: rgba(0,0,0,0.3);
            padding: 15px;
            border-radius: 12px;
            margin: 20px 0;
            font-family: monospace;
            color: #22c55e;
            border: 1px dashed #22c55e;
        }
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background: #4f7cff;
            color: #fff;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            transition: 0.3s;
        }
        .btn:hover { background: #3c65df; transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="container">
        <h1>🟢 部署成功</h1>
        <p>Argosbx 小钢炮脚本已成功在 Docker 环境中运行。</p>
        <p>您的管理面板访问路径为：</p>
        <div class="uuid-box">/${uuid}</div>
        <a href="/${uuid}" class="btn">进入管理面板</a>
    </div>
</body>
</html>`;
        res.end(html);
        return;
    }

    if (req.url === `/${uuid}`) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        const host = DOMAIN === 'YOUR.DOMAIN' ? (req.headers.host || DOMAIN) : DOMAIN;
        
        // 核心逻辑：如果设置了 SUB_PORT，强制将订阅链接的端口替换掉
        const SUB_PORT = process.env.SUB_PORT;
        let subHost = host;
        if (SUB_PORT) {
            subHost = host.split(':')[0] + ':' + SUB_PORT;
        }
        
        const subUrl = `http://${subHost}/${uuid}/sub`;
        const clashUrl = `https://sub.ygkkk.workers.dev/sub?target=clash&url=${encodeURIComponent(subUrl)}&insert=false&config=https%3A%2F%2Fraw.githubusercontent.com%2FACL4SSR%2FACL4SSR%2Fmaster%2FClash%2Fconfig%2FACL4SSR_Online.ini&emoji=true&list=false&tfo=false&scv=false&fdn=false&sort=false&new_name=true`;

        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Argosbx Web Management Panel</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Outfit:wght@300;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #4f7cff;
            --secondary: #ff4f8b;
            --bg: #0b1020;
            --glass: rgba(255, 255, 255, 0.05);
            --glass-border: rgba(255, 255, 255, 0.1);
        }
        body {
            background: var(--bg);
            color: #fff;
            font-family: 'Outfit', sans-serif;
            margin: 0;
            display: flex;
            flex-direction: column;
            height: 100vh;
            overflow-x: hidden;
        }
        .header {
            background: rgba(0,0,0,0.5);
            padding: 20px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--glass-border);
        }
        .header h1 {
            font-family: 'Orbitron', sans-serif;
            margin: 0;
            font-size: 24px;
            color: var(--primary);
        }
        .main-content {
            display: flex;
            flex: 1;
            overflow: hidden;
        }
        @media (max-width: 900px) {
            .main-content { flex-direction: column; }
        }
        .sidebar {
            width: 380px;
            background: rgba(255,255,255,0.02);
            padding: 30px;
            border-right: 1px solid var(--glass-border);
            overflow-y: auto;
        }
        @media (max-width: 900px) {
            .sidebar { width: auto; border-right: none; border-bottom: 1px solid var(--glass-border); height: 400px; }
        }
        .iframe-container {
            flex: 1;
            background: #fff;
            border-radius: 12px;
            margin: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
            background: #fff; /* For dark mode pages, they will style themselves */
        }
        .card {
            background: rgba(0,0,0,0.2);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 20px;
            text-align: left;
            position: relative;
        }
        .card label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
        .card-content { margin-top: 8px; font-size: 14px; word-break: break-all; color: #dbeafe; }
        .btn {
            display: block;
            width: 100%;
            padding: 15px;
            margin-top: 10px;
            border-radius: 12px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            transition: 0.3s;
            text-decoration: none;
            text-align: center;
        }
        .btn-primary { background: var(--primary); color: #fff; }
        .btn-primary:hover { background: #3c65df; transform: scale(1.02); }
        .btn-secondary { background: var(--glass); border: 1px solid var(--glass-border); color: #fff; margin-top: 15px; }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); }
        .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
        .nav-links {
            display: flex;
            gap: 20px;
        }
        .nav-links a { color: #fff; text-decoration: none; opacity: 0.7; transition: 0.3s; font-size: 14px; background: var(--glass); padding: 8px 16px; border-radius: 8px; border: 1px solid var(--glass-border); }
        .nav-links a:hover { opacity: 1; color: var(--primary); border-color: var(--primary); }
    </style>
</head>
<body>
    <div class="header">
        <h1>Argosbx Web Panel</h1>
        <div class="nav-links">
            <a href="#" onclick="copyText('${subUrl}')">复制通用订阅</a>
            <a href="${clashUrl}" target="_blank">一键导入Clash</a>
        </div>
    </div>
    <div class="main-content">
        <div class="sidebar">
            <h2 style="margin-top:0;">我的节点订阅</h2>
            <div class="card">
                <label>通用订阅链接 (V2Ray / Shadowrocket)</label>
                <div class="card-content">${subUrl}</div>
                <button class="btn btn-secondary" onclick="copyText('${subUrl}')">复制订阅连接</button>
            </div>
            <div class="card" style="border-left: 4px solid var(--secondary);">
                <label>Clash / Stash 一键订阅</label>
                <div class="card-content">${clashUrl.substring(0, 50)}...</div>
                <a href="${clashUrl}" class="btn btn-primary" target="_blank">一键导入 Clash</a>
            </div>
            
            <div class="card" style="border-left: 4px solid #22c55e;">
                <label>最终生成的节点分享信息</label>
                <div class="card-content" style="font-size: 12px; opacity: 0.8;">${vlessInfo}</div>
            </div>

            <div class="card" style="border-left: 4px solid #f59e0b;">
                <label>内核运行状态 & WARP</label>
                <div class="card-content" id="core-status" style="display:flex; flex-direction:column; gap:8px; margin-top:10px;">
                    <div style="display:flex; justify-content:space-between;">
                        <span id="st-singbox">Sing-box: ⚪查询中</span>
                        <span id="st-xray">Xray: ⚪查询中</span>
                        <span id="st-argo">Argo: ⚪查询中</span>
                    </div>
                    <div style="margin-top:5px; font-size:12px; background:rgba(0,0,0,0.3); padding:8px; border-radius:8px;">
                        <span style="color:#dbeafe;">WARP IP 分配状态:</span>
                        <pre id="st-warp" style="margin:5px 0 0 0; white-space:pre-wrap; word-break:break-all; opacity:0.8;"></pre>
                    </div>
                </div>
            </div>

            <div class="footer">
                Powered by Argosbx Web & CodeMap Skill
            </div>
        </div>
        <div class="iframe-container">
            <iframe src="/generator"></iframe>
        </div>
    </div>
    <script>
        function copyText(text) {
            navigator.clipboard.writeText(text).then(() => alert('已复制到剪贴板 =》 ' + text));
        }
        function updateStatus() {
            fetch('/api/status').then(r => r.json()).then(res => {
                const render = (id, name, isRunning) => {
                    const el = document.getElementById(id);
                    if(el) el.innerHTML = name + ': ' + (isRunning ? '🟢运行中' : '🔴未启用');
                };
                if(!res.error) {
                    render('st-singbox', 'Sing-box', res.singBox);
                    render('st-xray', 'Xray', res.xray);
                    render('st-argo', 'Argo', res.argo);
                    const warpEl = document.getElementById('st-warp');
                    if(warpEl) {
                        const txt = res.warpLog ? res.warpLog.trim() : '';
                        warpEl.innerText = txt ? (txt.substring(0, 150) + (txt.length > 150 ? '...' : '')) : '暂无返回数据 (可能为直连或检测超时)';
                    }
                }
            }).catch(e => console.error(e));
        }
        updateStatus();
        setInterval(updateStatus, 10000);
    </script>
</body>
</html>
        `;
        res.end(html);
        return;
    }

    if (req.url === '/generator') {
        const injectScript = (htmlStr) => {
            return htmlStr.replace('</body>', `
                <script>
                    if (window.top !== window.self) {
                        // 逻辑：安全回填保存的配置
                        try {
                            const b64Config = "${Buffer.from(getSavedConfig()).toString('base64')}";
                            const savedVarsStr = b64Config ? decodeURIComponent(escape(window.atob(b64Config))) : "";
                            
                            if (savedVarsStr) {
                                const regex = /(\\w+)="([^"]*)"/g;
                                let match;
                                while ((match = regex.exec(savedVarsStr)) !== null) {
                                    const key = match[1];
                                    const val = match[2];
                                    
                                    const checkProto = document.querySelector(\`[data-proto="\${key}"]\`);
                                    if (checkProto) {
                                        checkProto.checked = true;
                                        checkProto.dispatchEvent(new Event('change'));
                                        const portInput = document.querySelector(\`[data-port="\${key}"]\`);
                                        if (portInput && val !== '""') {
                                            portInput.value = val;
                                            portInput.dispatchEvent(new Event('change'));
                                        }
                                        continue;
                                    }

                                    const el = document.getElementById(key);
                                    if (el) {
                                        el.value = val;
                                        el.dispatchEvent(new Event('change'));
                                    }
                                }
                                if (typeof render === 'function') {
                                    render();
                                }
                            }
                        } catch(e) { console.error("Restore config failed:", e); }

                        const uuidInput = document.getElementById('uuid');
                        if (uuidInput && !uuidInput.value) {
                            uuidInput.value = '${uuid}';
                        }
                        if (uuidInput) {
                            uuidInput.setAttribute('readonly', 'true');
                            uuidInput.style.opacity = '0.7';
                            const genBtn = document.getElementById('generateUuidBtn');
                            if (genBtn) genBtn.style.display = 'none';
                        }

                        const actionsDiv = document.querySelector('.actions');
                        if (actionsDiv) {
                            const btn = document.createElement('button');
                            btn.innerHTML = '⚡ 一键应用配置到本机部署';
                            btn.className = 'primary';
                            btn.style.background = 'linear-gradient(180deg, #10b981, #047857)';
                            btn.style.borderColor = '#047857';
                            btn.style.marginTop = '10px';
                            btn.type = 'button';
                            btn.onclick = function() {
                                let cmd = document.getElementById('output').value;
                                const varsMatch = cmd.match(/^(.*?)bash/);
                                let vars = varsMatch ? varsMatch[1].trim() : "";
                                
                                btn.innerHTML = '部署重启中，请稍候...';
                                fetch('/api/deploy', {
                                    method: 'POST',
                                    body: JSON.stringify({ vars_str: vars }),
                                    headers: {'Content-Type': 'application/json'}
                                }).then(r => {
                                    if (!r.ok) return r.text().then(t => { throw new Error(t) });
                                    return r.json();
                                }).then(res => {
                                    alert("✅ 核心应用已成功重启并生效新参数！\\n请注意，如果您修改了 UUID，左侧面板地址也会随之变更为: /" + res.uuid);
                                    btn.innerHTML = '⚡ 一键应用配置到本机部署';
                                    if(res.uuid) window.top.location.href = '/' + res.uuid;
                                }).catch(e => {
                                    alert('❌ 部署通信失败: ' + e.message);
                                    btn.innerHTML = '⚡ 一键应用配置到本机部署';
                                });
                            };
                            actionsDiv.appendChild(btn);
                        }
                    }
                </script>
            </body>`);
        };

        const https = require('https');
        https.get('https://raw.githubusercontent.com/tthking/argosbx/main/index.html', (resp) => {
            resp.setEncoding('utf8');
            let data = '';
            resp.on('data', (chunk) => { data += chunk; });
            resp.on('end', () => {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(injectScript(data));
            });
        }).on("error", (err) => {
            try {
                const fs = require('fs');
                const path = require('path');
                const localPath = path.join(__dirname, '../../index.html');
                if (fs.existsSync(localPath)) {
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(injectScript(fs.readFileSync(localPath, 'utf8')));
                } else {
                    res.writeHead(500);
                    res.end("Error loading generator UI: " + err.message);
                }
            } catch (e) {
                res.writeHead(500);
                res.end("Fetch failed & Local fallback failed.");
            }
        });
        return;
    }

    if (req.url === '/api/deploy' && req.method === 'POST') {
        let body = [];
        req.on('data', chunk => body.push(chunk));
        req.on('end', () => {
            try {
                const rawBody = Buffer.concat(body).toString();
                if (!rawBody) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: "Empty request body" }));
                }
                const data = JSON.parse(rawBody);
                const varsStr = data.vars_str || "";
                
                // 持久化保存配置
                fs.writeFileSync(configPath, varsStr);
                
                // 构建执行命令
                let cmd = `bash start.sh`;
                if (varsStr) {
                    console.log(`\n>>> 正在应用新配置并重启核心...\n变量: ${varsStr}`);
                    // 增加 2 秒延迟确保内核进程已登记在系统进程表中
                    cmd = `export ${varsStr.replace(/ /g, ' export ')} && bash start.sh && sleep 2`;
                }
                
                // 尝试提取 UUID 以便重定向
                const uuidMatch = varsStr.match(/uuid="([^"]+)"/);
                if (uuidMatch && uuidMatch[1]) {
                uuid = uuidMatch[1];
                    uuidkey = uuid.replace(/-/g, "");
                    vlessInfo = `vless://${uuid}@${DOMAIN}:443?encryption=none&security=tls&sni=${DOMAIN}&fp=chrome&type=ws&host=${DOMAIN}&path=%2F#Vl-ws-tls-${NAME}`;
                }
                
                const deployProcess = exec(cmd, { cwd: __dirname });
                deployProcess.stdout.on('data', (data) => process.stdout.write(data));
                deployProcess.stderr.on('data', (data) => process.stderr.write(data));
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, uuid: uuid, message: "Deployment started" }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "JSON Parse Error: " + e.message }));
            }
        });
        return;
    }

    if (req.url === '/api/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        try {
            const isRunning = (keyword) => {
                try {
                    const procDirs = fs.readdirSync('/proc');
                    for (const pid of procDirs) {
                        if (/^\d+$/.test(pid)) {
                            try {
                                const cmdline = fs.readFileSync(`/proc/${pid}/cmdline`, 'utf8');
                                if (cmdline.includes(keyword)) return true;
                            } catch(e) {}
                        }
                    }
                    return false;
                } catch(e) { return false; }
            };
            const warpLogPath = '/root/agsbx/warp.log';
            const warpLog = fs.existsSync(warpLogPath) ? fs.readFileSync(warpLogPath, 'utf8') : 'No WARP config log yet.';
            res.end(JSON.stringify({
                singBox: isRunning("sing-box"),
                xray: isRunning("xray"),
                argo: isRunning("cloudflared"),
                warpLog: warpLog
            }));
        } catch(e) {
            res.end(JSON.stringify({ error: e.message }));
        }
        return;
    }

    if (req.url === `/${uuid}/sub`) {
        console.log(`>>> 收到订阅请求: ${req.url}`);
        
        const now = Date.now();
        if (global.subCache && (now - global.subCacheTime < 10000)) {
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end(global.subCache);
        }

        fs.readFile(subtxt, 'utf8', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            if (err || !data || !data.trim()) {
                console.error(`!!! 订阅文件未就绪或为空: ${err ? err.message : 'Empty file'}`);
                if (global.subCache) {
                    return res.end(global.subCache);
                }
                const notReadyNode = "vmess://" + Buffer.from(JSON.stringify({ v: "2", ps: "🔴 核心配置未就绪,请稍后刷新", add: "127.0.0.1", port: "0", id: uuid, net: "tcp", type: "none" })).toString('base64');
                const base64Fallback = Buffer.from(vlessInfo + '\n' + notReadyNode).toString('base64');
                return res.end(base64Fallback);
            }
            
            console.log(`>>> 订阅数据读取成功，正在下发...`);
            const allLinks = `${vlessInfo}\n${data || ''}`;
            const base64Sub = Buffer.from(allLinks).toString('base64');
            global.subCache = base64Sub;
            global.subCacheTime = Date.now();
            res.end(base64Sub);
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const wss = new (require('ws').Server)({ server });
let uuidkey = uuid.replace(/-/g, "");
wss.on('connection', ws => {
    ws.once('message', msg => {
        const [VERSION] = msg;
        const id = msg.slice(1, 17);
        if (!id.every((v, i) => v == parseInt(uuidkey.substr(i * 2, 2), 16))) return;
        let i = msg.slice(17, 18).readUInt8() + 19;
        const port = msg.slice(i, i += 2).readUInt16BE(0);
        const ATYP = msg.slice(i, i += 1).readUInt8();
        const host = ATYP == 1 ? msg.slice(i, i += 4).join('.') :
            (ATYP == 2 ? new TextDecoder().decode(msg.slice(i + 1, i += 1 + msg.slice(i, i + 1).readUInt8())) :
                (ATYP == 3 ? msg.slice(i, i += 16)
                    .reduce((s, b, i, a) => (i % 2 ? s.concat(a.slice(i - 1, i + 1)) : s), [])
                    .map(b => b.readUInt16BE(0).toString(16)).join(':') : ''));
        ws.send(new Uint8Array([VERSION, 0]));
        const duplex = createWebSocketStream(ws);
        net.connect({ host, port }, function () {
            this.write(msg.slice(i));
            duplex.on('error', () => { }).pipe(this).on('error', () => { }).pipe(duplex);
        }).on('error', () => { });
    }).on('error', () => { });
});
