const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("searchResults");
const searchBox = document.querySelector(".search-box");

let stories = [];
let writers = [];

function getStoryUrl(story) {

    if (story.storyType === "serial") {
        return `/stories/${story.categorySlug}/${story.storySlug}/`;
    }

    if (story.storyType === "short-story") {
        return `/short-stories/${story.categorySlug}/${story.storySlug}/`;
    }

    if (story.storyType === "onu") {
        return `/onugolpo/${story.storySlug}/`;
    }

    return "#";
}

function renderWriterResults(list){

    return list.map(writer => `

        <a
        class="writer-card"
        href="/writers/${writer.writerSlug}/">

            <img
            class="writer-thumb"
            src="${writer.writerImage}"
            alt="${writer.writerName}">

            <div class="writer-info">

<div class="writer-name">
    ${writer.writerName}
</div>

<div class="writer-bio">
    ${writer.writerBio}
</div>

            </div>

        </a>

    `).join("");

}

function renderResults(list) {

    if (!list.length) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                কোনো গল্প খুঁজে পাওয়া যায়নি।
            </div>
        `;
        return;
    }

resultsContainer.innerHTML = list.map(story => {

    const typeLabel =
        story.storyType === "short-story"
            ? "ছোটগল্প"
            : story.storyType === "onu"
            ? "অনুগল্প"
            : "ধারাবাহিক";

            const colorClass =
    "search-color-" +
    (Math.floor(Math.random() * 12) + 1);

    return `
        <a class="search-item ${colorClass}" href="${getStoryUrl(story)}">

            <div class="search-content">

                <div>
                    <div class="search-title">
                        ${story.storyName}
                    </div>

                    <div class="search-meta">
                        ${story.writerName}
                        ${story.categoryName ? ` • ${story.categoryName}` : ""}
                    </div>
                </div>

                <span class="story-type-tag">
                    ${typeLabel}
                </span>

            </div>

        </a>
    `;

}).join("");
}

function startsWithWord(text, query) {

    text = text.toLowerCase();
    query = query.toLowerCase();

    const words = text.split(/\s+/);

    for(let i = 0; i < words.length; i++){

        const phrase =
            words.slice(i).join(" ");

        if(phrase.startsWith(query)){
            return true;
        }

    }

    return false;

}

function getWordIndex(text, query) {

    text = text.toLowerCase();
    query = query.toLowerCase();

    const words = text.split(/\s+/);

    for(let i = 0; i < words.length; i++){

        if(words[i].startsWith(query)){
            return i;
        }

    }

    return 999;

}

function performSearch(query) {

    query = query.trim().toLowerCase();

if (!query) {
    resultsContainer.innerHTML = `
        <div class="no-results">
            গল্প, লেখক বা ক্যাটাগরির নাম লিখে সার্চ করুন।
        </div>
    `;
    return;
}

    const filtered = stories.filter(story => {

return (
    startsWithWord(story.storyName || "", query) ||
    startsWithWord(story.writerName || "", query) ||
    startsWithWord(story.categoryName || "", query) ||
    startsWithWord(story.searchKeywords || "", query)
);

    });

const results = [];

filtered.forEach(story => {

    let score = 0;

    if (
        startsWithWord(
            story.storyName || "",
            query
        )
    ) {

        score = 100;

    } else if (
        startsWithWord(
            story.writerName || "",
            query
        )
    ) {

        score = 90;

    } else if (
        startsWithWord(
            story.searchKeywords || "",
            query
        )
    ) {

        score = 80;

    } else if (
        startsWithWord(
            story.categoryName || "",
            query
        )
    ) {

        score = 70;

    }

results.push({

    type: "story",

    score,

    wordIndex: getWordIndex(
        story.storyName || "",
        query
    ),

    data: story

});

});

writers.forEach(writer => {

    if (
        startsWithWord(
            writer.writerName || "",
            query
        )
    ) {

results.push({

    type: "writer",

    score: 95,

    wordIndex: getWordIndex(
        writer.writerName || "",
        query
    ),

    data: writer

});

    }

});

results.sort((a, b) => {

    if (b.score !== a.score) {
        return b.score - a.score;
    }

    return a.wordIndex - b.wordIndex;

});

let html = "";

results.forEach(item => {

    if(item.type === "writer"){

        const writer = item.data;

        html += `
            <a
            class="writer-card"
            href="/writers/${writer.writerSlug}/">

                <img
                class="writer-thumb"
                src="${writer.writerImage}"
                alt="${writer.writerName}">

                <div class="writer-info">

<div class="writer-name">
    ${writer.writerName}
</div>

<div class="writer-bio">
    ${writer.writerBio}
</div>

                </div>

            </a>
        `;

    } else {

        const story = item.data;

        const typeLabel =
            story.storyType === "short-story"
                ? "ছোটগল্প"
                : story.storyType === "onu"
                ? "অনুগল্প"
                : "ধারাবাহিক";

        const colorClass =
            "search-color-" +
            (Math.floor(Math.random() * 12) + 1);

        html += `
            <a
            class="search-item ${colorClass}"
            href="${getStoryUrl(story)}">

                <div class="search-content">

                    <div>
                        <div class="search-title">
                            ${story.storyName}
                        </div>

                        <div class="search-meta">
                            ${story.writerName}
                            ${story.categoryName ? ` • ${story.categoryName}` : ""}
                        </div>
                    </div>

                    <span class="story-type-tag">
                        ${typeLabel}
                    </span>

                </div>

            </a>
        `;
    }

});

if(!html){

    html = `
        <div class="no-results">
            কোনো গল্প খুঁজে পাওয়া যায়নি।
        </div>
    `;
}

resultsContainer.innerHTML = html;
}

async function loadStories() {

    try {

const response = await fetch("/json-data/story-index.json");
stories = await response.json();

const writersResponse =
await fetch("/json-data/story-writers.json");

writers = await writersResponse.json();

        const params = new URLSearchParams(window.location.search);
        const q = params.get("q");

        if (q) {
            searchInput.value = q;
            performSearch(q);
        }

    } catch (error) {

        resultsContainer.innerHTML = `
            <div class="no-results">
                গল্প লোড করা যায়নি।
            </div>
        `;

        console.error(error);
    }
}

searchInput.addEventListener("input", e => {

    performSearch(e.target.value);

    window.scrollTo(0, 0);

});

loadStories();

const searchWrap =
document.querySelector(".search-input-wrap");

searchInput.addEventListener("input", () => {

    if(searchInput.value.trim()){

        searchWrap.classList.add("has-text");

    }else{

        searchWrap.classList.remove("has-text");

    }

});