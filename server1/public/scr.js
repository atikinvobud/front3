document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("submit").addEventListener("click", async (event) => {
        event.preventDefault();

        const container = document.getElementById("products-container");

        try {
            const fields = {
                id: document.getElementById("id").checked,
                name: document.getElementById("name").checked,
                cost: document.getElementById("cost").checked,
                description: document.getElementById("description").checked,
                categories: document.getElementById("categories").checked
            };

            const selectedFields = Object.entries(fields)
                .filter(([_, checked]) => checked)
                .map(([field, _]) => field)
                .join(" ");

            if (!selectedFields) {
                alert("Выберите хотя бы одно поле!");
                return;
            }

            const query = `
                {
                    products {
                        ${selectedFields}
                    }
                }
            `;

            const response = await fetch("http://localhost:3000/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query })
            });

            const result = await response.json();

            if (!result.data || !result.data.products) {
                throw new Error("Ошибка: Сервер не вернул products");
            }

            const products = result.data.products;

            container.innerHTML = "";
            products.forEach(product => {
                const card = document.createElement("div");
                card.classList.add("card");

                let content = "";
                if (product.id) content += `<p>ID: ${product.id}</p>`;
                if (product.name) content += `<h3>${product.name}</h3>`;
                if (product.cost) content += `<p>Цена: ${product.cost} руб.</p>`;
                if (product.description) content += `<p>${product.description}</p>`;
                if (product.categories) content += `<p>Категории: ${product.categories.join(", ")}</p>`;

                card.innerHTML = content;
                container.appendChild(card);
            });
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const socket = new WebSocket("ws://localhost:8081?userID=client");
  
    socket.onmessage = (event) => {
      const chatBox = document.getElementById("chat-box");
      const message = document.createElement("p");
      message.textContent = "Админ: " + event.data;
      chatBox.appendChild(message);
    };
  
    document.getElementById("send-btn").addEventListener("click", () => {
      const input = document.getElementById("chat-input");
      const message = input.value.trim();
  
      if (message) {
        socket.send(JSON.stringify({ text: message }));
  
        const chatBox = document.getElementById("chat-box");
        const clientMessage = document.createElement("p");
        clientMessage.textContent = "Вы: " + message;
        clientMessage.style.color = "green";
        chatBox.appendChild(clientMessage);
  
        input.value = "";
      }
    });
  });