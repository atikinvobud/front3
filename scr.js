document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("products-container");
    try {
        const response = await fetch("http://localhost:3000/json "); 
        const products = await response.json();

        products.forEach(product => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <h3>${product.name}</h3>
                <p>Цена: ${product.cost} руб.</p>
                <p>${product.description}</p>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
    }
});
