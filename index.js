window.onload = () => {
    const onButton = document.querySelector('#turn_on')
    const offButton = document.querySelector('#turn_off')
    const temp = document.querySelector('#temp')
    const report = document.querySelector('#report')
    const apiAddress = 'https://sandissa.sandyuraz.com:5000'
    report.style.display = 'none'

    getTemp = () => {
        makeGet(url = apiAddress + '/temp')
            .then(data => {
                if (data[0] === 200) {
                    temp.innerHTML = "&emsp;&emsp;" + data[1].message + ' °C';
                }
            })
    }
    
    turnON = (e) => {
        makePost(url = apiAddress + '/led', { status: true })
            .then(data => {
                if (data[0] === 200) {
                    reportRequest('Turned ON!', 'isa_success')
                }
            })
    }
    
    turnOFF = (e) => {
        makePost(url = apiAddress + '/led', { status: false })
            .then(data => {
                if (data[0] === 200) {
                    reportRequest('Turned OFF!', 'isa_error')
                }
            })
    }
    
    async function makePost (url = '', data = {}) {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        })
        json = await response.json()
        return [response.status, json]
    }

    async function makeGet (url = '') {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        })
        json = await response.json()
        return [response.status, json]        
    }
    
    const reportRequest = (toShow, className) => {
        report.innerHTML = toShow
        report.className = className
        report.style.display = 'block'
        setTimeout(() => {
            report.style.display = 'none'
        }, 1500)
    }

    // Get initial temperature
    getTemp()
    // Update temp value every second
    setInterval(getTemp, 1000)
    
    onButton.addEventListener('click', turnON)
    offButton.addEventListener('click', turnOFF)
}
