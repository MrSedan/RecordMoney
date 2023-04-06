# Record Money

---

## Скачивание и инициализация
Во-первых необходимо убедится в том, что в системе установлен Node.JS и npm:
```bash
node --version
npm --version
```
Далее необходимо скачать сам проект:
```bash
git clone https://github.com/MrSedan/RecordMoney
```
Либо:
```bash
git clone git@github.com:MrSedan/RecordMoney.git
```
Затем необходимо инициализировать сам проект:
```bash
cd RecordMoney
npm install
```
После этого можно открыть проект в редакторе кода (**Visual Studio Code**).<br/>
Затем в открытом редакторе кода при помощи консоли переходим на свою ветку (не забываем, что в главной ветке `master` НЕ РАБОТАЕМ):
```bash
git checkout -b branch_name
```
Если ветка уже создана на **GitHub**, то создаем ее локально:
```bash 
git checkout -b branch_name origin/branch_name
```
Либо делаем те же действия при помощи средств **Visual Studio Code**.

Если же вам *вдруг* понадобилось локально удалить ветку, то сначала переключитесь на другую (например `master`):
```bash
git checkout master
```
Затем удалите ветку:
```bash
git branch -d branch_name
```

---

## Запуск проекта
### Обычный запуск
Для запуска проекта вводим команду:
```bash
npm start
```
### Запуск веб-версии
Если вы хотите запустить проект в веб-режиме, то требуется прописать дополнительную команду в зависимости от терминала:
- Для PowerShell:
```powershell
$env:NODE_OPTIONS = "--openssl-legacy-provider"

```
- Для стандартного терминала Windows (**cmd**):
```shell
set NODE_OPTIONS=--openssl-legacy-provider
```
- Для Unix-систем:
```bash
export NODE_OPTIONS=--openssl-legacy-provider
```
Далее запускаем сам веб-сервер;
```bash
npm run web
```
Либо после обычного запуска при помощи `npm start` можно нажать на клавишу `w`.
