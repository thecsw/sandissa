window.onload = () => {
        const url = "https://sandissa.sandyuraz.com:5000/cmd";
        const username = document.querySelector("#username");
        const password = document.querySelector("#password");
        const login = document.querySelector("#loginbutton");
        const logout = document.querySelector("#logoutbutton");
        const report = document.querySelector("#report");
        // cookie helpers
        const getCookie = (what) => {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${what}=`);
                if (parts.length === 2) return parts.pop().split(";").shift();
        };
        const setCookie = (what) => {
                document.cookie = `user=${what};max-age=172800`;
        };
        // Immediately check if a user cookie exists
        const existingCookie = getCookie("user");
        if (existingCookie !== "" && typeof existingCookie !== "undefined") {
                makePost(
                        (path = url + "/auth"),
                        (data = {}),
                        (auth = existingCookie)
                ).then((data) => {
                        // auth succeeded
                        if (data[0] === 200) {
                                show_message(
                                        "success",
                                        `Already logged in! Go to <a href="../">your dashboard</a>`
                                );
                                disable_form();
                                return;
                        }
                });
        }
        // Bind handler to the listener
        login.addEventListener("click", (_e) => {
                const user = username.value;
                const pass = password.value;
                if (user === "" || pass === "") {
                        show_message("error", "empty credentials");
                        return;
                }
                const encoded = btoa(user + ":" + pass);
                authorizationHeader = "Basic " + encoded;
                makePost(
                        (path = url + "/auth"),
                        (data = {}),
                        (auth = authorizationHeader)
                ).then((data) => {
                        if (data[0] === 200) {
                                show_message(
                                        "success",
                                        `Sucessfully logged in! Go to <a href="../">your dashboard</a>`
                                );
                                disable_form();
                                setCookie(authorizationHeader);
                                return;
                        }
                        show_message("error", data[1].error);
                });
        });
        // Logout will clear the user cookie and refresh the page
        logout.addEventListener("click", (_e) => {
                setCookie("");
                window.location.reload();
        });
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
        // reporting helpers
        var shows = {
                error: () => {
                        report.className = "isa_error";
                },
                success: () => {
                        report.className = "isa_success";
                },
                info: () => {
                        report.className = "isa_info";
                },
                warning: () => {
                        report.className = "isa_warning";
                },
        };
        const show_message = (where, what) => {
                shows[where]();
                report.innerHTML = what;
        };
        // When login is successful (old or newly generated), hide
        // the input form and show the logout button
        const disable_form = () => {
                username.style.display = "none";
                password.style.display = "none";
                login.style.display = "none";
                logout.style.display = "block";
        };
};
