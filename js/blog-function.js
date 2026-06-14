
// ==========================
// Popular Writers
// ==========================

async function loadRandomWriters(){

const response =
    await fetch("/json-data/story-writers.json");

if(!response.ok){
    throw new Error("Writer JSON load failed");
}

    const writers =
        await response.json();

const shuffled =
    [...writers];

for(let i = shuffled.length - 1; i > 0; i--){

    const j =
        Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] =
        [shuffled[j], shuffled[i]];
}

const randomWriters =
    shuffled.slice(0,8);

    const container =
        document.getElementById("writerSlider");

container.innerHTML =
    randomWriters.map(writer => `
        <a
            href="/writers/${writer.writerSlug}/"
            class="sliderCard">

            <div class="sliderThumb">
                <img
                    src="${writer.writerImage}"
                    alt="${writer.writerName}">
            </div>

<div class="sliderText">

    <div class="sliderName">
        ${writer.writerName}
    </div>

    <div class="sliderDesc">
        ${writer.writerBio}
    </div>

</div>

        </a>
    `).join("");

}



// ==========================
// Popular Serials
// ==========================

async function loadRandomSerials(){

const response =
    await fetch("/json-data/serial-with-image.json");

if(!response.ok){
    throw new Error("Serial JSON load failed");
}

    const serials =
        await response.json();

const shuffled =
    [...serials];

for(let i = shuffled.length - 1; i > 0; i--){

    const j =
        Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] =
        [shuffled[j], shuffled[i]];
}

const randomSerials =
    shuffled.slice(0,10);

    const container =
        document.getElementById("serialSlider");

    container.innerHTML =
        randomSerials.map(serial => `
<a
    href="/stories/${serial.category}/${serial.slug}/"
    class="sliderCard">

                <div class="sliderThumb">
                    <img
                        src="${serial.image}"
                        alt="${serial.title}">
                </div>

<div class="sliderText">

    <div class="sliderName">
        ${serial.title}
    </div>

    <div class="sliderDesc">
        ${serial.description}
    </div>

</div>

            </a>
        `).join("");

}

Promise.all([
    loadRandomWriters(),
    loadRandomSerials()
]).then(() => {

    document
        .querySelectorAll(".sliderWrapper")
        .forEach(wrapper => {

            const slider =
                wrapper.querySelector(".horizontalSlider");

            const card =
                slider.querySelector(".sliderCard");

            if(!card) return;

            const scrollAmount =
                card.offsetWidth + 12;

            wrapper
                .querySelector(".leftArrow")
                .addEventListener("click", () => {

                    slider.scrollBy({
                        left:-scrollAmount,
                        behavior:"smooth"
                    });

                });

            wrapper
                .querySelector(".rightArrow")
                .addEventListener("click", () => {

                    slider.scrollBy({
                        left:scrollAmount,
                        behavior:"smooth"
                    });

                });

        });

});