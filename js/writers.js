
    //  ---------- মোট গল্প হিসাব করার ফাংশন ------------
    
function toBengaliNumber(num) {
        const bengaliDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
        return num.toString().split('').map(d => bengaliDigits[d]).join('');
    }

    function updateTotalStories() {

        const dharaBox = document.querySelector('.card.cardC:not(.shortS) .storyBox');
        

        const onugolpoBox = document.querySelector('.card.cardC.shortS .storyBox');
        
        let dharaCount = dharaBox ? dharaBox.querySelectorAll('a').length : 0;
        let onugolpoCount = onugolpoBox ? onugolpoBox.querySelectorAll('a').length : 0;
        
        const total = dharaCount + onugolpoCount;
        

        const totalTd = document.getElementById('total-stories');
        if (totalTd) {
            totalTd.textContent = toBengaliNumber(total) + ' টি';
        }
    }

    window.addEventListener('load', updateTotalStories);
