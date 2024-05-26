const socket = io();

socket.on('products', (products) => {
    const productTableBody = document.getElementById('product-table-body');
    productTableBody.innerHTML = '';
    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.code}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
            <td><button onclick="deleteProduct('${product.id}')">Eliminar</button></td>
        `;
        productTableBody.appendChild(tr);
    });
});

function openAddProductAlert() {
    Swal.fire({
        title: "Add a new product",
        html: `
            <input id="swal-input1" class="swal2-input" placeholder="Title" required>
            <input id="swal-input2" class="swal2-input" placeholder="Description" required>
            <input id="swal-input3" class="swal2-input" placeholder="Code" required>
            <input id="swal-input4" class="swal2-input" placeholder="Price" type="number" required>
            <input id="swal-input5" class="swal2-input" placeholder="Stock" type="number" required>
            <input id="swal-input6" class="swal2-input" placeholder="Category" required>
        `,
        focusConfirm: false,
        preConfirm: () => {
            const title = document.getElementById('swal-input1').value;
            const description = document.getElementById('swal-input2').value;
            const code = document.getElementById('swal-input3').value;
            const price = document.getElementById('swal-input4').value;
            const stock = document.getElementById('swal-input5').value;
            const category = document.getElementById('swal-input6').value;

            if (!title || !description || !code || !price || !stock || !category) {
                Swal.showValidationMessage('All fields are required');
                return;
            }

            return { title, description, code, price, stock, category };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const product = result.value;
            socket.emit('newProduct', product);
        }
    });
}

function deleteProduct(id) {
    socket.emit('deleteProduct', id);
}
