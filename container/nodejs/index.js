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
const subtxt = `${process.env.HOME}/agsbx/jh.txt`;
const NAME = process.env.NAME || os.hostname();
const PORT = process.env.PORT || 3000;
const uuid = process.env.uuid || '79411d85-b0dc-4cd2-b46c-01789a18c650';
const DOMAIN = process.env.DOMAIN || 'YOUR.DOMAIN';
const vlessInfo = `vless://${uuid}@${DOMAIN}:443?encryption=none&security=tls&sni=${DOMAIN}&fp=chrome&type=ws&host=${DOMAIN}&path=%2F#Vl-ws-tls-${NAME}`;
console.log(`vless-ws-tls节点分享: ${vlessInfo}`);

fs.chmod("start.sh", 0o777, (err) => {
    if (err) {
        console.error(`start.sh empowerment failed: ${err}`);
        return;
    }
    console.log(`start.sh empowerment successful`);
    const child = exec('bash start.sh');
    child.stdout.on('data', (data) => console.log(data));
    child.stderr.on('data', (data) => console.error(data));
    child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        console.clear();
        console.log(`App is running`);
    });
});

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('🟢恭喜！Argosbx小钢炮脚本-nodejs版部署成功！\n\n查看节点信息路径：/你的uuid');
        return;
    }

    if (req.url === `/${uuid}`) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        const host = DOMAIN === 'YOUR.DOMAIN' ? (req.headers.host || DOMAIN) : DOMAIN;
        const subUrl = `http://${host}/${uuid}/sub`;
        const clashUrl = `https://sub.ygkkk.workers.dev/sub?target=clash&url=${encodeURIComponent(subUrl)}&insert=false&config=https%3A%2F%2Fraw.githubusercontent.com%2FACL4SSR%2FACL4SSR%2Fmaster%2FClash%2Fconfig%2FACL4SSR_Online.ini&emoji=true&list=false&tfo=false&scv=false&fdn=false&sort=false&new_name=true`;

        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Argosbx Premium Subscription</title>
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
            background: radial-gradient(circle at top right, #1a2346, var(--bg));
            color: #fff;
            font-family: 'Outfit', sans-serif;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            overflow-x: hidden;
        }
        .container {
            width: 90%;
            max-width: 500px;
            background: var(--glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            text-align: center;
            animation: fadeIn 0.8s ease-out;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        h1 { font-family: 'Orbitron', sans-serif; font-size: 28px; margin-bottom: 30px; letter-spacing: 2px; color: var(--primary); }
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
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Argosbx Subs</h1>
        
        <div class="card">
            <label>通用订阅链接 (V2Ray / Shadowrocket)</label>
            <div class="card-content">${subUrl}</div>
            <button class="btn btn-secondary" onclick="copyText('${subUrl}')">复制订阅</button>
        </div>

        <div class="card" style="border-left: 4px solid var(--secondary);">
            <label>Clash / Stash 一键订阅</label>
            <div class="card-content">${clashUrl.substring(0, 50)}...</div>
            <a href="${clashUrl}" class="btn btn-primary" target="_blank">一键导入 Clash</a>
        </div>

        <div class="footer">
            Powered by Argosbx Premium & CodeMap Skill
        </div>
    </div>
    <script>
        function copyText(text) {
            navigator.clipboard.writeText(text).then(() => alert('已复制到剪贴板'));
        }
    </script>
</body>
</html>
        `;
        res.end(html);
        return;
    }

    if (req.url === `/${uuid}/sub`) {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        if (fs.existsSync(subtxt)) {
            fs.readFile(subtxt, 'utf8', (err, data) => {
                const allLinks = `${vlessInfo}\n${data || ''}`;
                const base64Sub = Buffer.from(allLinks).toString('base64');
                res.end(base64Sub);
            });
        } else {
            const base64Sub = Buffer.from(vlessInfo).toString('base64');
            res.end(base64Sub);
        }
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const wss = new (require('ws').Server)({ server });
const uuidkey = uuid.replace(/-/g, "");
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
