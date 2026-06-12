
    //  ---------- মোট গল্প হিসাব করার ফাংশন ------------
    
function toBengaliNumber(num) {
        const bengaliDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
        return num.toString().split('').map(d => bengaliDigits[d]).join('');
    }

function updateTotalStories() {

    const storyBoxes = document.querySelectorAll('.card.cardC .storyBox');

    let total = 0;

    storyBoxes.forEach(box => {
        total += box.querySelectorAll('a').length;
    });

    const totalTd = document.getElementById('total-stories');

    if (totalTd) {
        totalTd.textContent = toBengaliNumber(total) + ' টি';
    }
}

    window.addEventListener('load', updateTotalStories);
