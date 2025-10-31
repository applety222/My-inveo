const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// 데이터 파일 경로
const postsFile = path.join(__dirname, 'data', 'posts.json');

// 초기 데이터 (파일 없으면 생성)
let posts = [];
if (fs.existsSync(postsFile)) {
  posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
} else {
  posts = [
    { id: 1, title: "T1, 롤드컵 4강 진출!", game: "리그 오브 레전드", date: "2025-10-31", content: "DRX를 3:1로 꺾고..." },
    { id: 2, title: "메이플스토리 신규 직업 '칼리' 출시", game: "메이플스토리", date: "2025-10-30", content: "스킬트리 공개!" }
  ];
  fs.mkdirSync(path.dirname(postsFile), { recursive: true });
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
}

// API: 포스트 목록
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// API: 새 포스트
app.post('/api/posts', (req, res) => {
  const newPost = {
    id: Date.now(),
    ...req.body,
    date: new Date().toISOString().split('T')[0]
  };
  posts.push(newPost);
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
  res.json(newPost);
});

// 포스트 상세
app.get('/post/:id', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.status(404).send('Not found');
  res.send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${post.title}</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <div class="container">
        <a href="/" class="back">홈으로</a>
        <h1>${post.title}</h1>
        <p><strong>${post.game}</strong> | ${post.date}</p>
        <p>${post.content}</p>
      </div>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
