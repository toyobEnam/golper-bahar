
// ==========================
// Related Blogs
// ==========================

async function loadOtherBlogs(){

const container =
    document.querySelector(".otherBlogs");

if(!container) return;

try{

    const response =
        await fetch("/json-data/blogs/blog-index.json");

    if(!response.ok){
        throw new Error("Blog JSON load failed");
    }

    const blogs =
        await response.json();

const currentSlug =
    document.body.dataset.slug || "";

const currentCategory =
    document.body.dataset.category || "";

    const filtered =
        blogs.filter(
            blog =>
            blog.slug !== currentSlug
        );

    const sameCategory =
        filtered.filter(
            blog =>
            blog.category === currentCategory
        );

    const otherCategory =
        filtered.filter(
            blog =>
            blog.category !== currentCategory
        );

    const shuffle = arr => {

        const copy = [...arr];

        for(
            let i = copy.length - 1;
            i > 0;
            i--
        ){

            const j =
                Math.floor(
                    Math.random() * (i + 1)
                );

            [copy[i], copy[j]] =
                [copy[j], copy[i]];
        }

        return copy;
    };

const selected = [

    ...shuffle(sameCategory),

    ...shuffle(otherCategory)

]
.filter(
    (blog,index,self) =>
    index === self.findIndex(
        b => b.slug === blog.slug
    )
)
.slice(0,15);

container.innerHTML =
selected.map(blog => `

<a
href="/blogs/${blog.category}/${blog.slug}/"
class="blogCard">

<div class="blogThumb">

<img
src="${blog.image}"
alt="${blog.headline}"
loading="lazy">

</div>

<div class="blogTitle">
${blog.headline}
</div>

</a>

`).join("");

}catch(error){

console.error(
    "Related Blog Load Failed",
    error
);

}

}


// ==========================
// Random Onu Stories
// ==========================

async function loadRandomOnuStories(){

const response =
    await fetch("/json-data/onu.json");

if(!response.ok){
    throw new Error("Onu JSON load failed");
}

const stories =
    await response.json();

const shuffled =
    [...stories];

for(let i = shuffled.length - 1; i > 0; i--){

    const j =
        Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] =
        [shuffled[j], shuffled[i]];
}

const randomStories =
    shuffled.slice(0,10);

const colors = [
    "miniColor1",
    "miniColor2",
    "miniColor3",
    "miniColor4",
    "miniColor5",
    "miniColor6",
    "miniColor7",
    "miniColor8"
];

const container =
    document.querySelector(".miniStoryList");

container.innerHTML =
    randomStories.map((story,index) => `

<li>
    <a
        href="/onugolpo/${story.storySlug}/"
        class="${colors[index % colors.length]}">

        ${story.storyName}

    </a>
</li>

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

function setupSliderHint(){

    if(window.matchMedia("(pointer:fine)").matches){
        return;
    }

    const observer =
        new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if(!entry.isIntersecting){
                    return;
                }

                const slider =
                    entry.target;

                if(
                    slider.dataset.hintPlayed
                ){
                    return;
                }

slider.dataset.hintPlayed =
    "true";

observer.unobserve(slider);

                setTimeout(() => {

    slider.scrollTo({
        left:25,
        behavior:"smooth"
    });

    setTimeout(() => {

        slider.scrollTo({
            left:0,
            behavior:"smooth"
        });

    },1500);

},500);

            });

        },{
            threshold:.5
        });

    document
        .querySelectorAll(
            ".horizontalSlider"
        )
        .forEach(slider => {

            observer.observe(slider);

        });

}

Promise.all([
    loadOtherBlogs(),
    loadRandomOnuStories(),
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

    setupSliderHint();

});