window.onload = () => {
	const onButton = document.querySelector('#turn_on')
	const offButton = document.querySelector('#turn_off')
	const temp = document.querySelector('#temp')
	const temps = document.querySelector('#temps')
	const report = document.querySelector('#report')
	const apiAddress = 'https://sandissa.sandyuraz.com:5000'
	report.style.display = 'none'
	const arr60 = Array.from(Array(60), (x, i) => -i)
	const myHeaders = {
		"Content-Type": "application/json",
		"Authorization": "Basic c2FuZHk6bGlseQ=="
	}

	getTemp =
		() => {
			makeGet(url = apiAddress + '/temp').then(data => {
				if (data[0] === 200) {
					temp.innerHTML = "&emsp;&emsp;" +
							 data[1].message +
							 ' °C';
				}
			})
		}

	getTemps =
		() => {
			makeGet(url = apiAddress + '/temps').then(data => {
				if (data[0] !== 200)
					return;
				const arr = data[1].message
				const min = Math.min(...arr) - 1
				const max = Math.max(...arr) + 1
				let Temperature = {
					x: arr60,
					y: arr,
					mode: 'lines',
					name: 'Temperature (°C)',
					line: {
						shape: 'spline',
						color: 'rgb(58, 22, 22)',
						width: 3
					}

				};
				let toPlot = [Temperature];
				let layout = {
					title: 'Temperature over time',
					xaxis: {
						title: 'Change in time (s)',
						showgrid: false,
					},
					yaxis: {
						title: 'Temperature (°C)',
						showgrid: false,
						range: [min, max]
					}
				};
				let config = {
					responsive: true,
					displayModeBar: false
				};
				Plotly.newPlot(temps, toPlot, layout, config);
			})
		}

	turnON =
		(e) => {
			makePost(url = apiAddress + '/led', {
				status: true
			}).then(data => {
				if (data[0] === 200) {
					reportRequest('Turned ON!',
						      'isa_success')
				}
			})
		}

	turnOFF =
		(e) => {
			makePost(url = apiAddress + '/led', {
				status: false
			}).then(data => {
				if (data[0] === 200) {
					reportRequest('Turned OFF!',
						      'isa_error')
				}
			})
		}

	async function makePost(url = '', data = {}) {
		const response = await fetch(url, {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'include',
			headers: myHeaders,
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
			body: JSON.stringify(data)
		})
		json = await response.json()
		return [response.status, json]
	}

	async function makeGet(url = '') {
		const response = await fetch(url, {
			method: 'GET',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'include',
			headers: myHeaders,
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
		})
		json = await response.json()
		return [response.status, json]
	}

	const reportRequest =
		(toShow, className) => {
			report.innerHTML = toShow
			report.className = className
			report.style.display = 'block'
			setTimeout(() => { report.style.display = 'none' },
				   1500)
		}

	// Get initial temperature
	getTemp()
	getTemps()
	// Update temp value every second
	setInterval(getTemp, 1000)
	setInterval(getTemps, 1000)

	onButton.addEventListener('click', turnON)
	offButton.addEventListener('click', turnOFF)
}
