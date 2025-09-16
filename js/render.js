const $foodMenu = $('#foodMenu');

categories.forEach(category => {
    const $section = $(`<section class="py-5" id="category-${category}">`);
    $section.append(`<h2 class="food-section-title">${category}</h2>`);

    const $row = $('<div class="row gy-4 gx-2 gx-md-4 gx-xl-2">');
    const products = food[category];
    products.forEach(product => {
        const priceText = (product.variations ? 'From ' : '') + product.price.toFixed(2);
        const $product = $(`
            <div class="product col-6 col-sm-4 d-flex" id="product_${product.id}">
                <div class="card">
                    <div class="card-img position-relative">
                        <div class="card-overlay card-img" style="display: none;">1</div>
                        <img src="${product.img}" alt="${product.title}" class="card-img">
                    </div>
                    <div class="card-body">
                        <h6 class="card-title">${product.title}</h6>
                        <p class="card-subtitle">${product.composition ?? ''}</p>
                        <p class="card-text price">${priceText}</p>
                        <button class="btn btn-primary d-none d-xl-block">Add to cart</button>
                    </div>
                </div>
            </div>
        `);
        $product.find('.card').on('click', () => displayProductModal(product));
        $row.append($product);
    });
    $section.append($row);

    $foodMenu.append($section);
});
