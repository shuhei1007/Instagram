const fs = require('fs');
const files = ['articles/start.html', 'articles/save.html', 'articles/yuma.html'];
const pages = ['articles.html', 'about.html', 'days.html', 'members.html', 'contact.html'];

files.forEach(f => {
    if(fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        pages.forEach(p => {
            const oldStr = 'href="../' + p + '"';
            const newStr = 'href="../pages/' + p + '"';
            content = content.split(oldStr).join(newStr);
        });
        fs.writeFileSync(f, content, 'utf8');
        console.log('Updated ' + f);
    }
});
