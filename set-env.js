const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('请输入Cloudinary配置信息:');

const questions = [
    {
        name: 'CLOUDINARY_CLOUD_NAME',
        message: '请输入Cloud Name:'
    },
    {
        name: 'CLOUDINARY_API_KEY',
        message: '请输入API Key:'
    },
    {
        name: 'CLOUDINARY_API_SECRET',
        message: '请输入API Secret:'
    }
];

let config = {};

function askQuestion(i) {
    if (i >= questions.length) {
        writeConfig();
        return;
    }

    rl.question(questions[i].message + ' ', (answer) => {
        config[questions[i].name] = answer;
        askQuestion(i + 1);
    });
}

function writeConfig() {
    const envContent = Object.entries(config)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    fs.writeFileSync('.env', envContent);
    console.log('\n配置已保存到.env文件');
    console.log('现在可以运行 node process-images-cloudinary.js 来处理图片了');
    rl.close();
}

askQuestion(0); 