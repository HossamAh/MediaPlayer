async function getQuranData() {
    let surahs = NaN;
    let output = NaN;
    let err = false;
    try {
        // "https://api.alquran.cloud/v1/quran/ar.alafasy"
        output = await fetch("https://api.alquran.cloud/v1/surah");
        output=await output.json();
    }catch(reason)
    {
        console.log(reason);
        err=true;
    }
    finally{
        if(!err)
        {            
            surahs = output.data;
            console.log(`surahs:${surahs}`);
            return surahs;
        }
        else{
            throw new Error("error in fetching quran list");
        }
    }
}

let wait = new Promise((res)=>{
    setTimeout(()=>{res("in wait 3000")},3000)
});


let getSurah = async (surahNumber) => {
    mediaPreview.style.display = 'none';
    error.style.display = 'none';
    preload.style.display = 'block';   
    console.log(surahNumber+1);
    let currentSurah = NaN;
    let currentSurahAyat = [];
    let err=false;
    try {
        //get the surah source then display it in preview section.
        currentSurah = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber + 1}`);
        currentSurah=await currentSurah.json();
        console.log(currentSurah);
        if(currentSurah.status!=="OK")
            throw new Error("error in fetching surah");
    }
    catch (reason) {
        console.log(reason);
        err=true;
    }
    finally{
        if(err===true)
        {
            preload.style.display = 'none';
            error.style.display = 'block';
        }
        else
        {
            currentSurah = currentSurah.data;
            if (currentSurah.numberOfAyahs > 0)
                currentSurahAyat = currentSurah.ayahs;
            // console.log(currentSurah);
            // console.log(currentSurahAyat);
            let currentSurahAudios = [];
            for (let i = 1; i <= currentSurah.numberOfAyahs; i++) {
                currentSurahAudios.push(`https://quranaudio.pages.dev/1/${surahNumber + 1}_${i}.mp3`);
            }
            // console.log(currentSurahAudios);
            /*display and run surah */
            let surahName = document.querySelector(".preivew-surah-name");
            let surahAyah = document.querySelector(".preivew-ayah-text");
            let ayahNumber = surahAyah.querySelector(".ayah-number");
            let ayahText = surahAyah.querySelector(".ayah-text");
            // let mainAudio = document.querySelector(".surah-audio");

            let old_element = document.querySelector(".surah-audio");
            let mainAudio = old_element.cloneNode(true);
            surahName.innerHTML = currentSurah.name;
            mainAudio.setAttribute('controls', "true");
            mainAudio.setAttribute('auto-play', "true");
            mainAudio.setAttribute('type', 'audio/mp3');
            

            mainAudio.addEventListener('ended', () => {
                console.log(currentSurahAudios);
                // console.log(currentSurahAyat);
                // if(currentSurahAudios.length==0 && next===true)
                // {
                //     autoplay(surahNumber+1);
                // }
                // else 
                if (currentSurahAudios.length >= 1) {
                    mainAudio.setAttribute('src', currentSurahAudios[0]);
                    currentSurahAudios = currentSurahAudios.slice(1, currentSurahAudios.length);//remove first    
                    ayahNumber.innerText = currentSurahAyat[0].numberInSurah;
                    ayahText.innerText = currentSurahAyat[0].text;
        
                    currentSurahAyat = currentSurahAyat.slice(1, currentSurahAyat.length);//remove first
                    mainAudio.play();
                    
                    
                }
                else{
                    autoplay(surahNumber+1);
                }
            })
            mainAudio.setAttribute('src', currentSurahAudios[0]);
            old_element.parentNode.replaceChild(mainAudio,old_element);
            currentSurahAudios = currentSurahAudios.slice(1, currentSurahAudios.length);//remove first
            ayahNumber.innerText = currentSurahAyat[0].numberInSurah;
            ayahText.innerText = currentSurahAyat[0].text;
            currentSurahAyat = currentSurahAyat.slice(1, currentSurahAyat.length);//remove first
            // console.log(await wait);
            preload.style.display = 'none';   
            error.style.display='none';
            mediaPreview.style.display = 'flex';
            if(next===true)
                mainAudio.play();


        }
    }
              
}



let displayList = async () => {
    let mediaContainer = document.querySelector(".Media-container");
    let mediaList = mediaContainer.querySelector(".media-list");
    let mediaPreview = mediaContainer.querySelector(".media-preview");
    let ListElement = document.createElement('ul');
    let surahs;
    let err=false;
    try{
        // let surahs = await getSurahs().catch((err)=>{return err});
        surahs = await getQuranData();
    }
    catch(reason)
    {
        console.log("in display catch");
        err=true;
    }
    finally{
        if(err===false)
        {
            surahs.forEach((element, index) => {
                console.log(index, element.name);
                /*media list*/
                let surahRow = document.createElement('li');
                // surahRow.setAttribute('class','surah-row');
                let surahNumber = document.createElement('p');
                surahNumber.setAttribute('class', 'surah-number');
                let surahName = document.createElement('p');
                surahName.setAttribute('class', 'surah-name');
                // let surahDisplay = document.createElement('button');
                // surahDisplay.setAttribute('class','surah-Display-btn');
                surahNumber.innerText = index + 1;
                surahName.innerText = element.name;
                surahRow.appendChild(surahNumber);
                surahRow.appendChild(surahName);
                ListElement.appendChild(surahRow);

                /*media privew on select media row*/
                surahRow.addEventListener('click', () => {
                    /*call surah run with surah number to read surah from API and load its sound and text */
                    getSurah(index);
                    
                });

            });
            mediaList.appendChild(ListElement);
    
        }
        else{
            throw new Error("error in fetching media list");
        }
    }
}
let autoplay = async (surahIndex)=>{
    let currentSurah = NaN;
    let currentSurahAyat = [];
    let err=false;
    getSurah(surahIndex);
}
// Hide media preview initially
const mediaPreview = document.querySelector('.media-preview');
const preload = document.querySelector('.preload');
const error = document.querySelector('.error');
mediaPreview.style.display = 'none';
preload.style.display = 'none';
error.style.display = 'none';
const next = true;
let QuranMediaPlayer = async ()=>{
    try{
        await displayList();
    }
    catch(err){
        alert("error in fetching media list.");
        window.location.reload()
    }
            
}
QuranMediaPlayer();