const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("searchResults");
const searchBox = document.querySelector(".search-box");

let stories = [];

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

    return `
        <a class="search-item" href="${getStoryUrl(story)}">

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
            (story.storyName || "").toLowerCase().includes(query) ||
            (story.writerName || "").toLowerCase().includes(query) ||
            (story.categoryName || "").toLowerCase().includes(query)
        );

    });

    renderResults(filtered);
}

async function loadStories() {

    try {

        const response = await fetch("/json-data/story-index.json");
        stories = await response.json();

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