let map,bounds;

function initMap() {
const center = { lat: -34.397, lng: 150.644 };
const zoom = 10;
  map = new google.maps.Map(document.getElementById("mapContainer"), {center, zoom ,disableDefaultUI : false});
  bounds = new google.maps.LatLngBounds()

}
window.initMap = initMap;

const API_KEY = 'eb75d268f6msh889c348d6429367p1ca3c6jsne16d3d09f542';

 const  fetchCountries = async () =>{
    const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/adminDivisions';
    const options = {
	    method: 'GET',
	    headers: {
		    'X-RapidAPI-Key': API_KEY,
		    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
	            }
};

try {
	const response = await fetch(url, options);
	const result = await response.json();
	return result.data;
} catch (error) {
	console.error(error);
}
}

const fetchhotels = async (country) => {
const url = `https://hotels4.p.rapidapi.com/locations/v3/search?q=${country}`;
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': API_KEY,
		'X-RapidAPI-Host': 'hotels4.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.json();
    getmarkers(result.sr)

} catch (error) {
	console.error(error);
}
}

(async function loadcountries(){
    const countries =  await fetchCountries()
    const countriesList = document.querySelector("#countries_list")
    const countriesInput = document.querySelector("#language_input")

   for ( let i=0; i < countries.length ; i++ ){
        countriesList.innerHTML +=`<li data-country = ${countries[i].name}> ${countries[i].name} </li>`
   }

    countriesList.style.display='none';
    countriesInput.addEventListener('click',function(){
    countriesList.style.display='block';
   })

    const allcountries = Array.from(countriesList.children)

   allcountries.map(country => {
        country.addEventListener('click', function(e){
            const selectedcountry = e.target.dataset.country
            countriesInput.value = selectedcountry
            countriesList.style.display='none';
            fetchhotels(selectedcountry)
        })
    })

})()

function getmarkers(markers){
    markers.map((hotel,index) =>{
        const lat = parseFloat(hotel.coordinates.lat)
        const lng = parseFloat(hotel.coordinates.long)
        const position = {lat,lng}
        
        const label = (index + 1).toString()
        const icon = {
            url :'https://www.freepik.com/free-photos-vectors/map-marker',
            scaledSize : new google.maps.Size(40,40)
        } 
        new google.maps.Marker({position,label,map})
        bounds.extend(new google.maps.LatLng(position))
        map.fitBounds(bounds)
    })
}

const search = document.querySelector('#search')
const suggest_list= document.querySelector('#auto_suggest_list')

search.addEventListener('input', async (e) =>{
    if(e.target.value === ''){
        suggest_list.innerHTML ='';
        }else{
        const countries = await fetchCountries()
        suggest_list.innerHTML ='';
        const SelectedCountries =countries.filter(country => country.name.toLowerCase().startsWith(e.target.value))
        SelectedCountries.map(country => {suggest_list.innerHTML +=`<li data-country="${country.name}"> ${country.name}</li>`
    }) 
    const filtredCountries = Array.from(suggest_list.children)
    filtredCountries.map((country)=>{
    country.addEventListener('click',(e) =>{fetchhotels(e.target.dataset.country)
    suggest_list.innerHTML ='';
    search.value = e.target.dataset.country;
    })
    })   
    }
})
