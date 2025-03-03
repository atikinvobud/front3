document.getElementById("add-product").addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const cost = parseFloat(document.getElementById("cost").value);
    const description = document.getElementById("description").value.trim();
    const categoriesInput = document.getElementById("category");
    const categories = categoriesInput ? categoriesInput.value.split(",").map(cat => cat.trim()) : [];

    if (!name || isNaN(cost) || !description || categories.length === 0) {
        alert("Заполните все поля корректно!");
        return;
    }

    const newProduct = { name, cost, description, categories }; 

    fetch("/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        console.log("Добавлен товар:", data.product);
    })
    .catch(error => console.error("Ошибка:", error));
});

document.getElementById("edit-product").addEventListener("click", () => {
    const id = parseInt(document.getElementById("product-id").value.trim(), 10);
    if (isNaN(id)) {
        alert("Введите корректный ID товара!");
        return;
    }

    const name = document.getElementById("name").value.trim();
    const cost = parseFloat(document.getElementById("cost").value);
    const description = document.getElementById("description").value.trim();
    const categoriesInput = document.getElementById("category");
    const categories = categoriesInput ? categoriesInput.value.split(",").map(cat => cat.trim()) : [];

    if (!name || isNaN(cost) || !description || categories.length === 0) {
        alert("Заполните все поля корректно!");
        return;
    }

    const updatedProduct = { name, cost, description, categories };

    fetch(`/edit-product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        console.log("Обновленный товар:", data.product);
    })
    .catch(error => console.error("Ошибка:", error));
});


document.getElementById("delete-product").addEventListener("click", () => {
    const id = parseInt(document.getElementById("product-id").value.trim(), 10);

    if (isNaN(id)) {
        alert("Введите корректный ID товара!");
        return;
    }

    fetch(`/delete-product/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        console.log("Удаление:", data);
    })
    .catch(error => console.error("Ошибка:", error));
});

const socket = new WebSocket("ws://localhost:8081?userID=admin");

socket.onmessage = (event) => {
  const chatBox = document.getElementById("chat-box");
  const message = document.createElement("p");
  message.textContent = "Клиент: " + event.data;
  chatBox.appendChild(message);
};

document.getElementById("send-btn").addEventListener("click", () => {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();

  if (message) {
    socket.send(JSON.stringify({ text: message }));

    const chatBox = document.getElementById("chat-box");
    const adminMessage = document.createElement("p");
    adminMessage.textContent = "Вы: " + message;
    adminMessage.style.color = "blue";
    chatBox.appendChild(adminMessage);

    input.value = "";
  }
});
