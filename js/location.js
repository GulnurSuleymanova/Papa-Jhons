const locationModal = new bootstrap.Modal('#locationModal');
const $locationModal = $('#locationModal');
const $mapPart = $locationModal.find('#map-part');
const $orderLocationBtn = $('#order-location-btn');
const $orderLocationBtnIcon = $('#order-location-btn img');
const $orderLocationBtnText = $('#order-location-btn span');
const $pickupBtn = $('#pickupBtn');
const $deliveryBtn = $('#deliveryBtn');
const $choosePickupLocation = $('#choosePickupLocation').hide();
const $restaurantSearch = $('#restaurantSearch');
const $enterDeliveryAddress = $('#enterDeliveryAddress');

$locationModal.find('.btn-primary').on('click', () => {
    locationModal.hide();
});

$pickupBtn.on('click', function () {
    $pickupBtn.addClass('border-primary');
    $deliveryBtn.removeClass('border-primary');
    $mapPart.hide();
    $choosePickupLocation.show();
    $enterDeliveryAddress.hide();
    $orderLocationBtnIcon.prop('src', 'img/icons/pickup.svg');
    console.log($restaurantsScroll.find('.active'));
    $orderLocationBtnText.text($restaurantsScroll.find('.border-primary').data('location-address'));
});
$deliveryBtn.on('click', function () {
    $deliveryBtn.addClass('border-primary');
    $pickupBtn.removeClass('border-primary');
    $mapPart.show();
    $choosePickupLocation.hide();
    $enterDeliveryAddress.show();
    $orderLocationBtnIcon.prop('src', 'img/icons/delivery.svg');
    $orderLocationBtnText.text('Delivery order');
});

const $restaurantsScroll = $('#restaurantsScroll');
locations.forEach(location => renderPickupLocation(location));
$restaurantsScroll.find('.border').first().addClass('border-primary');

$restaurantSearch.on('input', function () {
    const query = this.value.toLowerCase().trim();
    if (query) {
        $restaurantsScroll.find('.border').hide();
        $restaurantsScroll.find(`[data-location-name*=${query}], [data-location-address*=${query}]`).show();
    } else {
        $restaurantsScroll.find('.border').show();
    }
});

function renderPickupLocation(location) {
    const $restaurant = $(`
        <div class="border rounded-3 p-2" data-location-name="${location.name.toLowerCase()}" data-location-address="${location.address.toLowerCase()}">
            <h6 class="fw-bold fs-14 text-primary text-uppercase">${location.name}</h6>
            <p class="my-1">
                <img src="img//icons/pin.svg" height="17" alt="Pin">
                ${location.address} 
            </p>
            <p class="my-1">
                <img src="img//icons/clock.svg" height="17" alt="Clock">
                ${location.time}
            </p>
        </div>
    `).on('click', () => {
        $restaurant.siblings().removeClass('border-primary');
        $restaurant.addClass('border-primary');
        $orderLocationBtnText.text($restaurant.data('location-address'));
    });
    $restaurantsScroll.append($restaurant);
}
