function displayModal(content, className = '') {
    const $modal = $(`
        <div class="modal ${className}" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-lg modal-fullscreen-md-down">
                <div class="modal-content">
                    <button class="btn-close opacity-75 position-absolute end-0 m-3 p-0" data-bs-dismiss="modal" aria-label="Close" type="button"></button>
                </div>
            </div>
        </div>
    `);
    $modal.find('.modal-content').append(content);
    const modal = new bootstrap.Modal($modal);
    modal.show();
    $modal.on('hidden.bs.modal', () => $modal.remove());
}

function displayProductModal(product) {
    const $modalContent = $(`
        <div class="modal-body rounded-top-5 pb-3">
            <div class="${product.variations ? 'd-flex align-items-start flex-wrap flex-md-nowrap gap-3 pb-3' : ''}">
                <img class="img-fluid rounded-4" src="${product.img}" ${product.variations ? 'width="187"' : ''} alt="${product.title}">
                <div>
                    <h4 class="modal-title mb-1 ${product.variations ? 'fs-1 lh-1 mt-0' : ''}">${product.title}</h4>
                    <p class="fs-14 lh-sm mb-0">${product.composition ?? ''}</p>
                </div>
            </div>
        </div>
        <div class="modal-footer border-0 pt-3">
            <h6 class="price fs-18 text-primary me-auto" id="price">${product.price.toFixed(2)}</h6>
            <div class="d-flex align-items-center gap-2">
                <button class="btn btn-outline-primary btn-minus" type="button"></button>
                <h6 class="quantity fs-18 text-primary my-0 mx-1">1</h6>
                <button class="btn btn-outline-primary btn-plus" type="button"></button>
            </div>
            <button class="btn btn-primary fs-14 px-4 py-1 py-md-3">
                <span class="d-none d-md-inline">Add to cart</span>
                <span class="d-md-none">Add</span>
                <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `);

    let variation;
    if (product.variations) {
        const $variations = $(`
            <div class="product-variations">
                <h6 class="fs-18 mb-3"> Size <span class="text-primary">(Required)</span> </h6>
                <div class="sizes d-flex gap-2"></div>
                <h6 class="fs-18 my-3"> Type <span class="text-primary">(Required)</span> </h6>
                <div class="types d-flex gap-2"></div>
            </div>
        `);
        const sizes = Array.from(new Set(product.variations.map(variation => variation.size)));
        const types = Array.from(new Set(product.variations.map(variation => variation.type)));
        const $sizes = $variations.find('.sizes');
        const $types = $variations.find('.types');

        variation = product.variations[0];

        sizes.forEach(size => {
            const price = product.variations.find(variation => variation.size === size).price;
            const $size = $(`
                <div class="variation d-flex flex-column justify-content-between border rounded-3 fw-heavy fs-14 p-2" data-size="${size}">
                    <span class="value">${size}</span>
                    <span class="price text-primary mb-0">${price.toFixed(2)}</span>
                </div>
            `);
            $sizes.append($size);
        });

        types.forEach(type => {
            const $type = $(`
                <div class="variation border rounded-3 fw-heavy fs-14 p-3 h-auto" data-type="${type}">
                    <span class="value">${type}</span>
                </div>
            `);
            $types.append($type);
        });

        $sizes.find('.variation').first().addClass('active');
        $types.find('.variation').first().addClass('active');

        $variations.find('.variation').on('click', function () {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            const type = $types.find('.active').data('type');
            const size = $sizes.find('.active').data('size');
            variation = product.variations.find(variation => variation.type === type && variation.size === size);
            if (!variation) {
                $types.find('.active').removeClass('active');
                $types.find('.variation').first().addClass('active');
                variation = product.variations.find(variation => variation.size == size);
            }
            $price.text(variation.price.toFixed(2));
        });

        $modalContent.first().append($variations);
    }

    const $quantity = $modalContent.find('.quantity');
    const $price = $modalContent.find('#price');

    $modalContent.find('.btn-minus').on('click', () => {
        const quantity = parseInt($quantity.text()) - 1;
        if (quantity < 1) return;
        $quantity.text(quantity);
        const price = variation ? variation.price : product.price;
        $price.text((price * quantity).toFixed(2));
    });
    $modalContent.find('.btn-plus').on('click', () => {
        const quantity = parseInt($quantity.text()) + 1;
        $quantity.text(quantity);
        const price = variation ? variation.price : product.price;
        $price.text((price * quantity).toFixed(2));
    });

    $modalContent.find('.btn-primary').on('click', () => {
        cart.add(product.id, parseInt($quantity.text()), variation);
        bootstrap.Modal.getInstance('.modal.show').hide();
    });

    displayModal($modalContent, 'product-modal');
}
