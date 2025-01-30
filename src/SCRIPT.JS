// ==UserScript==
// @name         Save Chat Dialog to Text File (Formatted)
// @namespace    http://tampermonkey.net/
// @version      1.17
// @description  Скрипт для сохранения диалога в текстовый файл с форматированием
// @author       Ваше имя
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Функция для создания кнопки
    function createButton() {
        const button = document.createElement('button');
        button.innerText = 'Сохранить диалог';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '1000';
        button.style.padding = '10px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', saveDialogToFile);

        document.body.appendChild(button);
    }

    // Функция для сохранения диалога в файл
    function saveDialogToFile() {
        // Найдите контейнер диалога
        const chatContainer = document.querySelector('.dad65929'); // Селектор контейнера
        if (!chatContainer) {
            alert('Контейнер диалога не найден. Проверьте селектор.');
            return;
        }

        // Название диалога
        const dialogTitleElement = document.querySelector('.d8ed659a'); // Селектор названия диалога
        const dialogTitle = dialogTitleElement ? dialogTitleElement.innerText.trim() : 'Диалог';

        // Создаем текстовый файл
        const fileName = `${dialogTitle}.txt`;
        let fileContent = '';

        // Соберем все сообщения в одном массиве
        const allMessages = [];

        // Ваши сообщения (начинаются с fa81)
        const yourMessages = chatContainer.querySelectorAll('[class^="fa81"]');
        yourMessages.forEach(message => {
            const text = message.innerText || message.textContent;
            if (text && text.trim() !== '') {
                allMessages.push({
                    text: formatText(text.trim()),
                    author: 'Пользователь',
                    position: getElementPosition(message) // Позиция в DOM
                });
            }
        });

        // Мои сообщения (начинаются с f9bf7997)
        const myMessages = chatContainer.querySelectorAll('[class^="f9bf7997"]');
        myMessages.forEach(message => {
            const text = message.innerText || message.textContent;
            if (text && text.trim() !== '') {
                allMessages.push({
                    text: formatText(text.trim()),
                    author: 'Искусственный интеллект',
                    position: getElementPosition(message) // Позиция в DOM
                });
            }
        });

        // Отсортируем сообщения по их положению в DOM
        allMessages.sort((a, b) => a.position - b.position);

        // Соберем текст диалога с форматированием
        allMessages.forEach((msg, index) => {
            if (index > 0) {
                fileContent += '\n' + '-'.repeat(80) + '\n'; // Разделение между сообщениями
            }
            fileContent += `${msg.author}:\n${msg.text}\n`;
        });

        if (fileContent === '') {
            alert('Текст диалога не найден. Проверьте структуру страницы.');
            return;
        }

        // Создаем и скачиваем текстовый файл
        createAndDownloadFile(fileName, fileContent);
    }

    // Функция для форматирования текста (перенос строки после 120 символов)
    function formatText(text) {
        const maxLineLength = 120;
        let formattedText = '';
        let currentLine = '';

        text.split(' ').forEach(word => {
            if ((currentLine + word).length > maxLineLength) {
                formattedText += currentLine.trim() + '\n';
                currentLine = '';
            }
            currentLine += word + ' ';
        });

        formattedText += currentLine.trim(); // Добавляем последнюю строку
        return formattedText;
    }

    // Функция для определения позиции элемента в DOM
    function getElementPosition(element) {
        let position = 0;
        let prevElement = element.previousElementSibling;

        // Считаем количество предыдущих элементов
        while (prevElement) {
            position++;
            prevElement = prevElement.previousElementSibling;
        }

        return position;
    }

    // Функция для создания и скачивания текстового файла
    function createAndDownloadFile(fileName, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();

        // Очистка
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert(`Диалог сохранен в файл: ${fileName}`);
    }

    // Создаем кнопку при загрузке страницы
    createButton();
})();