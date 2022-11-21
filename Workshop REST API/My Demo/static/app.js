document.getElementById('load').addEventListener('click', loadProducts);
document.querySelector('form').addEventListener('submit', createProduct);
const list = document.querySelector('ul')
list.addEventListener('click', deleteItem)

async function loadProducts() {
    const res = await fetch('http://localhost:3000/data');
    const data = await res.json();
    const list = document.querySelector('ul');
    list.textContent = ''
    for (let item of data) {
        createRow(item);
    }
}

function createRow(item) {
    const li = document.createElement('li');
    li.id = item.id;
    li.textContent = `${item.name} - $${item.price} `;
    const btn = document.createElement('a');
    btn.textContent = '[Delete]';
    btn.href = 'javascript:void(0)';
    li.appendChild(btn);
    list.appendChild(li);
}

async function createProduct(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData)

    // const res = await 
    const res = await fetch('http://localhost:3000/data', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const item = await res.json()
    createRow(item)
}

async function deleteItem(event) {
    if (event.target.tagName == 'A') {
        event.preventDefault()
        const id = event.target.parentNode.id;
        const res = await fetch('http://localhost:3000/data/' + id, {
            method: 'delete'
        })
        if (res.ok) {
            event.target.parentNode.remove()
        }
    }
}