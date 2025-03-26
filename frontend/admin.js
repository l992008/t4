const apiUrl = "http://localhost:8080/admin/products";

// 📌 Загружаем товары
function loadProducts() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(products => {
            const table = document.getElementById("productTable");
            table.innerHTML = "";
            products.forEach(product => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.price} ₽</td>
                    <td>${product.description}</td>
                    <td>${product.category.join(", ")}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id})">Редактировать</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Удалить</button>
                    </td>
                `;
                table.appendChild(row);
            });
        })
        .catch(error => console.error("Ошибка загрузки товаров:", error));
}

// 📌 Добавление или обновление товара
document.getElementById("productForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const editId = this.dataset.editId; // Проверяем, редактируем или создаём новый товар

    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value.split(",");

    const updatedProduct = { name, price: Number(price), description, category };

    if (editId) {
        // 📌 Если редактируем товар
        fetch(`${apiUrl}/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProduct)
        })
        .then(() => {
            loadProducts();
            document.getElementById("productForm").reset();
            delete this.dataset.editId; // Сбрасываем режим редактирования
            document.getElementById("submitButton").textContent = "Добавить товар";
        })
        .catch(error => console.error("Ошибка при обновлении товара:", error));
    } else {
        // 📌 Если создаём новый товар
        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProduct)
        })
        .then(() => {
            loadProducts();
            document.getElementById("productForm").reset();
        })
        .catch(error => console.error("Ошибка при добавлении товара:", error));
    }
});

// 📌 Удаление товара
function deleteProduct(id) {
    if (confirm("Удалить этот товар?")) {
        fetch(`${apiUrl}/${id}`, { method: "DELETE" })
            .then(() => loadProducts())
            .catch(error => console.error("Ошибка при удалении товара:", error));
    }
}

// 📌 Редактирование товара
function editProduct(id) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === id);
            if (product) {
                document.getElementById("name").value = product.name;
                document.getElementById("price").value = product.price;
                document.getElementById("description").value = product.description;
                document.getElementById("category").value = product.category.join(", ");
                document.getElementById("productForm").dataset.editId = id;
                document.getElementById("submitButton").textContent = "Сохранить изменения";
            }
        })
        .catch(error => console.error("Ошибка при редактировании товара:", error));
}

// 📌 Загружаем товары при загрузке страницы
document.addEventListener("DOMContentLoaded", loadProducts);

// Подключение к WebSocket серверу
const socket = new WebSocket('ws://localhost:8081');

socket.addEventListener('open', () => {
  console.log('WebSocket соединение установлено.');
});

socket.addEventListener('message', (event) => {
    const messageObject = JSON.parse(event.data);
    console.log('Сообщение от сервера:', messageObject);
    displayMessage(messageObject.author, messageObject.message);
  });  

function sendMessage(message) {
    const author = 'Админ';
    if (socket.readyState === WebSocket.OPEN) {
      const messageObject = { author, message };
      socket.send(JSON.stringify(messageObject));
      displayMessage(author, message); // Отображение сообщения у отправителя
    } else {
      console.error('WebSocket соединение не установлено.');
    }
  }  

function displayMessage(author, message) {
    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
      const messageElement = document.createElement('div');
      messageElement.innerHTML = `<strong>${author}:</strong> ${message}`;
      chatBox.appendChild(messageElement);
      chatBox.scrollTop = chatBox.scrollHeight; // Прокрутка к последнему сообщению
    }
  }