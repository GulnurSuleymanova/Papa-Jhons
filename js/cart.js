const $cart = $('#cart');
const $cartEmpty = $('#cart-empty');
const $cartProducts = $('#cart-products');
const $cartSubtotal = $('#cart-subtotal').hide();
const $minimumOrder = $('#minimumOrder').hide();
const $cartTotalAmount = $('.cart-total-amount');
const $cartCount = $('.cart-count');
const $cartOffcanvasBtn = $('[data-bs-toggle="offcanvas"][data-bs-target="#orderOffcanvas"]').hide();
const $checkoutBtn = $('#checkoutBtn');

const cart = {
    products: [],

    get total() {
        return this.products.reduce((sum, product) => (sum += product.quantity * product.price), 0);
    },
    get count() {
        return this.products.reduce((sum, product) => (sum += product.quantity), 0);
    },

    update() {
        $minimumOrder.hide();
        $checkoutBtn.attr('aria-disabled', this.total < 10);
        $checkoutBtn.toggleClass('disabled', this.total < 10);
        $('.product .card-overlay').hide();
        if (!this.products.length) {
            $cartProducts.empty();
            $cartEmpty.show();
            $cartTotalAmount.text('0.00');
            $cartOffcanvasBtn.hide();
            $cartSubtotal.hide();
        } else {
            if (this.total < 10) $minimumOrder.show();
            $cartTotalAmount.text(this.total.toFixed(2));
            $cartSubtotal.show();
            $cartCount.text(this.count);
            $cartEmpty.hide();
            $cartOffcanvasBtn.show();
            $cartProducts.html(
                this.products.reduce((html, product) => {
                    $(`#product_${product.id} .card-overlay`).show().text(product.quantity);
                    html += `
                        <div class="mb-3" id="cart-product-${product.id}">
                            <div class="d-flex justify-content-between pb-1">
                                <h6 class="fs-18">${product.title}</h6>
                                <button class="btn-close fs-12" onclick="cart.remove('${product.id}')"></button>
                            </div>
                            <div class="d-flex align-items-center gap-2">
                                ${product.variation ? `<p>${product.variation.type}, ${product.variation.size}</p>` : ''}
                                <div class="d-flex align-items-center">
                                    <button class="btn btn-outline-primary btn-minus" onclick="cart.changeProductQuantity('${product.id}', -1)"></button>
                                    <span class="fw-bold fs-14 mx-2">${product.quantity}</span>
                                    <button class="btn btn-outline-primary btn-plus" onclick="cart.changeProductQuantity('${product.id}', 1)"></button>
                                </div>
                                <h6 class="price fs-14 ms-auto mb-0">${(product.price * product.quantity).toFixed(2)}</h6>
                            </div>
                        </div>
                    `;
                    return html;
                }, '')
            );
        }
    },

    getProduct(id) {
        return this.products.find(product => product.id == id);
    },

    add(id, quantity = 1, variation = null) {
        const existingProduct = this.getProduct(id);
        if (!existingProduct || (variation && existingProduct.variation != variation)) {
            const product = allProducts.find(product => product.id == id);
            const price = variation ? variation.price : product.price;
            this.products.push({ ...product, price, quantity, variation });
            this.update();
        } else {
            this.changeProductQuantity(id, quantity);
        }
    },

    remove(id) {
        this.products = this.products.filter(product => product.id != id);
        this.update();
    },

    changeProductQuantity(id, quantity) {
        const product = this.getProduct(id);
        if (!product || product.quantity + quantity < 1) return this.remove(id);
        product.quantity += quantity;
        this.update();
    },
};
