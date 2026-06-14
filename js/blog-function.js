document.querySelectorAll(".sliderWrapper").forEach(wrapper => {

    const slider =
        wrapper.querySelector(".horizontalSlider");

    const card =
        slider.querySelector(".sliderCard");

    const scrollAmount =
        card.offsetWidth + 12;

    wrapper.querySelector(".leftArrow")
        .addEventListener("click", () => {

        slider.scrollBy({
            left:-scrollAmount,
            behavior:"smooth"
        });

    });

    wrapper.querySelector(".rightArrow")
        .addEventListener("click", () => {

        slider.scrollBy({
            left:scrollAmount,
            behavior:"smooth"
        });

    });

});