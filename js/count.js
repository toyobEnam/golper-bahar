/* ==========================================
   Story Count System
   File: /js/count.js
========================================== */

async function getStoryCounts() {

    const response =
        await fetch("/data/story-index.json");

    const stories =
        await response.json();

    const serial =
        stories.filter(
            s => s.storyType === "serial"
        ).length;

    const shortStory =
        stories.filter(
            s => s.storyType === "short-story"
        ).length;

    const onu =
        stories.filter(
            s => s.storyType === "onu"
        ).length;

    const total =
        stories.length;

    const writers =
        new Set(
            stories.map(
                s => s.writerName
            )
        ).size;

    return {

        total,

        serial,

        shortStory,

        onu,

        writers

    };

}

/* ==========================================
   Bangla Number Helper
========================================== */

function toBanglaNumber(num) {

    return num
        .toLocaleString("en-US")
        .replace(/\d/g, d =>
            "০১২৩৪৫৬৭৮৯"[d]
        );

}