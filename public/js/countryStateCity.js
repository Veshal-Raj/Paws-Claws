
var config = {
    cUrl : 'https://api.countrystatecity.in/v1/countries',
    cKey: 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA=='
}


var countrySelect = document.querySelector('.country')
var stateSelect = document.querySelector('.state')
var citySelect = document.querySelector('.city')


function loadCountries() {
    let apiEndPoint = config.cUrl

    fetch(apiEndPoint, {headers: { "X-CSCAPI-KEY":config.cKey}})
    .then(Response => Response.json())
    .then(data => {
        // console.log(data)
        data.forEach(country => {
            const option = document.createElement('option')
            option.value = country.iso2
            option.label = country.name

            option.textContent = country.name
            countrySelect.appendChild(option)
        })

    })
    .catch(error => {
        console.error("error in loading countries",error)
    })

    stateSelect.disabled = true
    citySelect.disabled = true
    stateSelect.style.pointerEvents = 'none'
    citySelect.style.pointerEvents = 'none'
}

function loadStates() {

    stateSelect.disabled = false
    citySelect.disabled = true
    stateSelect.style.pointerEvents = 'auto'
    citySelect.style.pointerEvents = 'none'

    const selectedCountryCode = countrySelect.value
    // console.log(selectedCountryCode)
    stateSelect.innerHTML = '<option value="">Select State</option>' //for clearing the exitsting states

    fetch(`${config.cUrl}/${selectedCountryCode}/states`,{headers: { "X-CSCAPI-KEY":config.cKey}})
    .then(response => response.json())
    .then(data => {
        console.log(data)

        data.forEach(state => {
            const option = document.createElement('option')
            option.value = state.iso2
            option.label = state.name

            option.textContent = state.name
            stateSelect.appendChild(option)
        })
    })
    .catch(error => {
        console.error('Error loading states:',error);
    })
}


function loadCities() {

    citySelect.disabled = false
    citySelect.style.pointerEvents = 'auto'

    const selectedCountryCode = countrySelect.value
    const selectedStateCode = stateSelect.value
    //console.log(selectedCountryCode, selectedStateCode)

    citySelect.innerHTML = '<option value="">Select city </option>' //Clear existing cities

    fetch(`${config.cUrl}/${selectedCountryCode}/states/${selectedStateCode}/cities`,{headers: { "X-CSCAPI-KEY":config.cKey}})
    .then(response => response.json())
    .then(data => {
        // console.log(data)

        data.forEach(city => {
            const option = document.createElement('option')
            option.value = city.iso2
            option.label = city.name
            option.textContent = city.name
            citySelect.appendChild(option)
        })
    })
}


window.onload = loadCountries