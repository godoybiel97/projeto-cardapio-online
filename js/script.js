//Controla a abertura do modal ao clicar no carrinho

let modal = document.getElementById("cart-modal")
let cart = []

function openModal() {
    let btnCar = document.getElementById("cart-btn")

    btnCar.addEventListener("click", () => {
        updateCart()
        modal.style.display = "flex"
    })
}
openModal()

//Controla o fechamento do modal ao clicar fora do carrinho
function closeModal() {
    let btnClose = document.getElementById("close-modal-btn")
    
    btnClose.addEventListener("click", () => {
        modal.style.display = "none"
    })
}
closeModal()

//Captura o item selecionado
function item() {
    let menu = document.getElementById("menu")

    menu.addEventListener("click", (event) => {
        let parentBtn = event.target.closest(".add-to-cart-btn")

        if(parentBtn) {
            let name = parentBtn.getAttribute("data-name")
            let price = parseFloat(parentBtn.getAttribute("data-price"))

            //console.log(name, price)
            addItem(name, price)
        }
    })
}
item()

//Adiciona produtos no carrinho
function addItem(name, price) {
    let hasItem = cart.find(item => item.name === name)

    if(hasItem) {
        hasItem.quantity += 1
        return
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        })
    }

    updateCart()
}

//Atualiza os elementos do carrinho
function updateCart() {
    let cartItems = document.getElementById("cart-items")
    cartItems.innerHTML = ""

    let total = 0

    cart.forEach(item => {
        let itemElement = document.createElement("div")
        itemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        itemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">${item.price.toFixed(2)}</p>
                </div>

                <button class="remove-btn hover:scale-110" data-name="${item.name}">Remover</button>
            </div>
        `

        total += item.price * item.quantity

        cartItems.appendChild(itemElement)
    })

    let cartTotal = document.getElementById("cart-total")
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    let cartCounter = document.getElementById("cart-count")
    cartCounter.innerHTML = cart.length
}

//Remove um item do carrinho
let cartItems = document.getElementById("cart-items")
cartItems.addEventListener("click", (event) => {
    if(event.target.classList.contains("remove-btn")) {
        let name = event.target.getAttribute("data-name")

        removeItem(name)
    }
})

function removeItem(name) {
    let index = cart.findIndex(item => item.name === name)

    if(index !== -1) {
        let item = cart[index]

        if(item.quantity > 1) {
            item.quantity -= 1

            updateCart()
            return
        }

        cart.splice(index, 1)
        updateCart()
    }
}

//Adiciona alerta
let inputAddress = document.getElementById("address")
inputAddress.addEventListener("input", (event) => {
    let inputValue = event.target.value

    if(inputValue !== "") {
        inputAddress.classList.remove("border-red-500")

        let addressWarn = document.getElementById("address-warn")
        addressWarn.classList.add("hidden")
    }
})

//Finalizar pedido
let checkoutBtn = document.getElementById("checkout-btn")
checkoutBtn.addEventListener("click", () => {
    if(!isOpen) {
        Toastify({
            text: "Estamos fechados no momento",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444"
            }
        }).showToast()
    }

    if(cart.length === 0) return

    if(inputAddress.value === "") {
        let addressWarn = document.getElementById("address-warn")
        addressWarn.classList.remove("hidden")

        inputAddress.classList.add("border-red-500")
        return
    } 

    let itemsCart = cart.map((item) => {
        return (
            `${item.name} | Quantidade: ${item.quantity} | Preço: ${item.price} ---`
        )
    }).join("")

    let message = encodeURIComponent(itemsCart)
    let phone = "11952773857"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${inputAddress.value}`, "_blank")
    cart = []
    inputAddress.value = ""
    updateCart()
})

//Verifica a hora atual e se respeita a condição
function checkIsOpen() {
    let data = new Date()
    let horas = data.getHours()
    
    return horas >= 18 && horas < 23
}

let itemOpen = document.getElementById("date-span")
let isOpen = checkIsOpen()

//Se a condição for correspondida, o horário passa a ser "verde", caso contrário será "vermelho"
if(isOpen) {
    itemOpen.classList.remove("bg-red-500")
    itemOpen.classList.add("bg-green-600")
} else {
    itemOpen.classList.remove("bg-green-600")
    itemOpen.classList.add("bg-red-500")
}