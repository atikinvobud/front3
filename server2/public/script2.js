document.getElementById("add-product").addEventListener("click", () => {
    const name = document.getElementById("name").value;
    const cost = document.getElementById("cost").value;
    const description = document.getElementById("description").value;
    if (!name || !cost || !description) {
        alert("Заполните все поля!");
        return;
    }
    const newProduct = { name, cost, description };
    fetch("/add-product", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
    })
    .then((response) => response.json())
    .then((data) => {
        alert(data.message);
        console.log("Добавлен товар:", data.product);
    })
    .catch((error) => {
        console.error("Ошибка:", error);
    });
});

document.getElementById("edit-product").addEventListener("click", () => {
    const name = document.getElementById("name").value;
    const cost = document.getElementById("cost").value;
    const description = document.getElementById("description").value;

    if (!name || !cost || !description) {
        alert("Заполните все поля!");
        return;
    }

    const updatedProduct = { name, cost, description };

    fetch("/edit-product", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
    })
    .then((response) => response.json())
    .then((data) => {
        alert(data.message);
        console.log("Обновленный товар:", data.product);
    })
    .catch((error) => {
        console.error("Ошибка:", error);
    });
});
document.getElementById("delete-product").addEventListener("click", () => {
    const name = document.getElementById("name").value;

    if (!name) {
        alert("Введите название товара!");
        return;
    }

    fetch("/delete-product", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    })
    .then((response) => response.json())
    .then((data) => {
        alert(data.message);
        console.log("Удаление:", data);
    })
    .catch((error) => {
        console.error("Ошибка:", error);
    });
});
