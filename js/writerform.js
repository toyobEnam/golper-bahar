const form =
document.getElementById("authorForm");

const toast =
document.getElementById("toast");

const API_URL =
"https://script.google.com/macros/s/AKfycbxg1i09jcRjaA81W9tdQaRNgN8SVDSq3_iFYcXq9TryonxIXLd9NBuEt9cVTMWxEkeQDw/exec";

form.addEventListener(
"submit",

async function(e){

    e.preventDefault();

    const button =
    form.querySelector("button");

    button.innerText =
    "জমা হচ্ছে...";

    button.classList.add("loading");

    const formData = {

        fullname:
        form.fullname.value,

        nickname:
        form.nickname.value,

        birthplace:
        form.birthplace.value,

        address:
        form.address.value,

        profession:
        form.profession.value,

        hobby:
        form.hobby.value,

        message:
        form.message.value,

        website:
        form.website.value,

        facebook:
        form.facebook.value,

        email:
        form.email.value,

        anonymous:
        form.anonymous.value,

        social:
        form.social.value,

        favorite_writer:
        form.favorite_writer.value

    };

    try {

        const response =
        await fetch(API_URL, {

            method: "POST",

            body:
            JSON.stringify(formData)

        });

        const result =
        await response.json();

        if(result.success){

            toast.innerText =
            "সফলভাবে জমা হয়েছে";

            toast.classList.add("show");

            form.reset();

        }

        else {

            toast.innerText =
            "সমস্যা হয়েছে";

            toast.classList.add("show");

        }

    }

    catch(error){

        toast.innerText =
        "নেটওয়ার্ক সমস্যা";

        toast.classList.add("show");

    }

    button.innerText =
    "তথ্য জমা দিন";

    button.classList.remove("loading");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

});