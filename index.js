window.onload = () => {
        const url = "https://sandissa.sandyuraz.com:3737/cmd";
        const onButton = document.querySelector("#turn_on");
        const offButton = document.querySelector("#turn_off");
        const temp = document.querySelector("#temp");
        const temps = document.querySelector("#temps");
        const report = document.querySelector("#report");
        const dashboard = document.querySelector("#dashboard");
        const login = document.querySelector("#login");
        report.style.display = "none";
        const arr60 = Array.from(Array(60), (x, i) => -i);
        // cookie helpers
        const getCookie = (what) => {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${what}=`);
                if (parts.length === 2) return parts.pop().split(";").shift();
        };

        // Check if cookie exists, and if it does, check whether they're valid
        const basicAuthToken = getCookie("user");
        console.log("Cookie:", basicAuthToken);
        if (basicAuthToken !== "" && typeof basicAuthToken !== "undefined") {
                makePost(
                        (path = url + "/auth"),
                        (data = {}),
                        (auth = basicAuthToken)
                ).then((data) => {
                        // auth succeeded
                        if (data[0] === 200) {
                                dashboard.style.display = "block";
                                login.style.display = "none";
                        }
                });
        } else {
                // if cookie not found or doesn't check out against the auth, stop
                // executing all javascript
                dashboard.style.display = "none";
                login.style.display = "block";
                return;
        }

        getTemp = () => {
                makeGet((path = url + "/temp"), (auth = basicAuthToken)).then(
                        (data) => {
                                if (data[0] === 200) {
                                        temp.innerHTML =
                                                "&emsp;&emsp;" +
                                                data[1].message +
                                                " ??C";
                                }
                        }
                );
        };

        getTemps = () => {
                makeGet((path = url + "/temps"), (auth = basicAuthToken)).then(
                        (data) => {
                                if (data[0] !== 200) {
                                        return;
                                }
                                const arr = data[1].message;
                                const min = Math.min(...arr) - 1;
                                const max = Math.max(...arr) + 1;
                                const Temperature = {
                                        x: arr60,
                                        y: arr,
                                        mode: "lines",
                                        name: "Temperature (??C)",
                                        line: {
                                                shape: "spline",
                                                color: "rgb(58, 22, 22)",
                                                width: 3,
                                        },
                                };
                                const toPlot = [Temperature];
                                const layout = {
                                        title: "Temperature over time",
                                        xaxis: {
                                                title: "Change in time (s)",
                                                showgrid: false,
                                        },
                                        yaxis: {
                                                title: "Temperature (??C)",
                                                showgrid: false,
                                                range: [min, max],
                                        },
                                };
                                const config = {
                                        responsive: true,
                                        displayModeBar: false,
                                };
                                Plotly.newPlot(temps, toPlot, layout, config);
                        }
                );
        };

        turnON = (e) => {
                makePost(
                        (path = url + "/led"),
                        (data = {
                                status: true,
                        }),
                        (auth = basicAuthToken)
                ).then((data) => {
                        if (data[0] === 200) {
                                reportRequest("Turned ON!", "isa_success");
                        }
                });
        };

        turnOFF = (e) => {
                makePost(
                        (path = url + "/led"),
                        (data = {
                                status: false,
                        }),
                        (auth = basicAuthToken)
                ).then((data) => {
                        if (data[0] === 200) {
                                reportRequest("Turned OFF!", "isa_error");
                        }
                });
        };

        async function makePost(path = "", data = {}, auth = "") {
                const response = await fetch(path, {
                        method: "POST",
                        mode: "cors",
                        cache: "no-cache",
                        credentials: "include",
                        headers: {
                                "Access-Control-Allow-Methods":
                                        "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                                "Content-Type": "application/json",
                                Authorization: auth,
                                Accept: "*/*",
                                "Accept-Encoding": "gzip, deflate, br",
                                Connection: "keep-alive",
                        },
                        redirect: "follow",
                        referrerPolicy: "no-referrer",
                        body: JSON.stringify(data),
                });
                json = await response.json();
                return [response.status, json];
        }

        async function makeGet(path = "", auth = "") {
                const response = await fetch(path, {
                        method: "GET",
                        mode: "cors",
                        cache: "no-cache",
                        credentials: "include",
                        headers: {
                                "Access-Control-Allow-Methods":
                                        "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                                "Content-Type": "application/json",
                                Authorization: auth,
                                Accept: "*/*",
                                "Accept-Encoding": "gzip, deflate, br",
                                Connection: "keep-alive",
                        },
                        redirect: "follow",
                        referrerPolicy: "no-referrer",
                });
                json = await response.json();
                return [response.status, json];
        }

        const reportRequest = (toShow, className) => {
                report.innerHTML = toShow;
                report.className = className;
                report.style.display = "block";
                setTimeout(() => {
                        report.style.display = "none";
                }, 1500);
        };

        // Get initial temperature
        getTemp();
        getTemps();
        // Update temp value every second
        setInterval(getTemp, 1000);
        setInterval(getTemps, 1000);

        onButton.addEventListener("click", turnON);
        offButton.addEventListener("click", turnOFF);
};
