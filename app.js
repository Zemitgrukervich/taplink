const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const yaml = require('js-yaml');

// Загрузка конфигурации
const config = yaml.load(fs.readFileSync('./config.yml', 'utf8'));

// Путь к выходной папке
const outputDir = path.join(__dirname, 'docs');

// Создание выходной папки, если она не существует
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Рендеринг шаблона
ejs.renderFile('./views/index.ejs', { config }, (err, str) => {
  if (err) {
    console.error('Ошибка при рендеринге шаблона:', err);
    return;
  }
  // Запись сгенерированного HTML в файл
  fs.writeFileSync(path.join(outputDir, 'index.html'), str, 'utf8');
  console.log('HTML файл успешно сгенерирован.');
});

// Копирование ассетов
const ncp = require('ncp').ncp;

ncp.limit = 16;

ncp('./public/assets', path.join(outputDir, 'assets'), function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('Assets скопированы успешно.');
});