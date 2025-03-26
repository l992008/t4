fetch("http://localhost:3000/products")
    .then(response => response.json())
    .then(products => {
        console.log("Загруженные товары:", products);
        const container = document.getElementById("products");

        if (!container) {
            console.error("Элемент #products не найден!");
            return;
        }

        container.innerHTML = ""; // Очищаем перед добавлением

        products.forEach(product => {
            const col = document.createElement("div");
            col.className = "col-md-4 col-sm-6 mb-4";

            col.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="price"><strong>${product.price} ₽</strong></p>
                        <button class="btn btn-primary" onclick="toggleDescription('${product.id}')">Подробнее</button>
                        <div id="description-${product.id}" class="description" style="display: none;">
                            <p>${product.description}</p>
                        </div>
                    </div>
                </div>
            `;

            container.appendChild(col);
        });
    })
    .catch(error => console.error("Ошибка загрузки товаров:", error));

// Функция для переключения отображения описания
function toggleDescription(productId) {
    const descriptionElement = document.getElementById(`description-${productId}`);
    if (descriptionElement) {
        if (descriptionElement.style.display === "none") {
            descriptionElement.style.display = "block";
        } else {
            descriptionElement.style.display = "none";
        }
    }
}
// Новый код для работы с GraphQL
async function fetchProductsGraphQL() {
    const query = `
        query {
            products {
                id
                name
                price
                description
                category
            }
        }
    `;

    try {
        const response = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        const { data } = await response.json();
        console.log("GraphQL данные:", data.products);
    } catch (error) {
        console.error("Ошибка загрузки данных через GraphQL:", error);
    }
}

fetchProductsGraphQL();

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
    const author = 'Покупатель';
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

async function fetchProductsNamesAndPrices() {
    const query = `
        query {
            products {
                name
                price
            }
        }
    `;

    try {
        const response = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        const { data } = await response.json();
        console.log("GraphQL данные:", data.products);
        displayProducts(data.products);
    } catch (error) {
        console.error("Ошибка загрузки данных через GraphQL:", error);
    }
}

fetchProductsNamesAndPrices();