"use strict";

const APIKEY = "rG5MizEy57zyvlatgwM0ftKwCl0jDTNiqv6GhLUa";


const validatorModule = (function () {
    let classes = {}
    classes.ValidMission = class ValidMission {
        constructor(rover_name, landing_date, max_sol, max_date) {
            this.rover_name = rover_name;
            this.landing_date = landing_date;
            this.max_sol = max_sol;
            this.max_date = max_date;
        }
    }
    classes.ValidMissionList = class {
        constructor() {
            this.list = [];
        }

        add(validMission) {
            this.list.push(validMission);
        }
    }

    const isNotEmpty = function (str) {
        return {
            isValid: (str.length !== 0), message: 'please enter input'
        };
    }
    /**
     * check if string is a validate date in a YYYY-MM-DD format or Sol
     * @param str - chosen date to as a string
     * @returns {{isValid: boolean, message: string}} - return error message and true or false if valid
     */
    const validDate = function (str) {
        return {
            isValid: /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(str) || /^[1-9][0-9]*$/.test(str),
            message: 'text must be a date or a sol'
        };
    }

    /**
     * check if date is in range before maximum date of mission and after minimum mission
     * @param dates - first element is input date, second is maximum and third is minimum
     * @returns {{isValid: boolean, message: string}} - return error message and true or false if valid
     */
    const dateInRange = function (dates) {
        if (dates[0] < dates[1]) {
            return {
                isValid: false, message: `text must be a date after ${dates[1]}`
            };
        } else if (dates[0] > dates[2]) {
            return {
                isValid: false, message: `text must be a date before ${dates[2]}`
            };
        } else {
            return {
                isValid: true, message: ""
            };
        }
    }

    /**
     * function to check if sol is in maximum range
     * @param sols - chosen sol in first element, second is maximum sol
     * @returns {{isValid: boolean, message: string}} - return error message and true or false if valid
     */
    const solInRange = function (sols) {
        return {
            isValid: sols[0] < sols[1], message: `text must be a sol before ${sols[1]}`
        };
    }

    /**
     * check if input is string or sol
     * @param str - wanted date
     * @returns {boolean} - return true if date or false if sol
     */
    const dateOrSol = (str) => {
        return /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(str);
    }

    return {
        isNotEmpty: isNotEmpty,
        validDate: validDate,
        dateOrSol: dateOrSol,
        dateInRange: dateInRange,
        solInRange: solInRange,
        classes
    }
})();

(function () {
    let photosJson = null;
    let imagesCardsElem = null;
    let dateElem = null;
    let roverElem = null;
    let cameraElem = null;
    let carouselElem = null;
    let validatorList = new validatorModule.classes.ValidMissionList();
    let savedListElem = null;

    /**
     * function to check if specific input is valid
     * @param inputElement - element value to check
     * @param errorElement - error element to output error if happend
     * @param validateFunc - function to validate
     * @returns {*} - return if true or false
     */

    function showModalMeessage(title, message) {
        let m = document.getElementById("errorModal");
        let t = document.getElementById('errorModalLabel')
        t.innerHTML = title;
        document.getElementById('errorModalMessage').innerHTML = message;
        const myModal = new bootstrap.Modal(m);
        myModal.show();
    }

    const validateInput = (inputElement, errorElement, validateFunc) => {
        const v = validateFunc(inputElement);
        errorElement.innerHTML = v.isValid ? '' : v.message;
        errorElement.hidden = v.isValid;
        return v.isValid;
    }

    function status(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(new Error(response.status));
        }
    }

    /**
     * function to get images from nasa servers, and show them to the user
     * @param date - wanted date
     * @param rover - wanted mission
     * @param camera - wanted camera
     */
    function getImages(date, rover, camera) {
        const dateOrSol = validatorModule.dateOrSol(date);
        fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?${dateOrSol ? "earth_date=" : "sol="}${date}&camera=${camera}&api_key=${APIKEY}`)
            .then(status)
            .then(res => res.json())
            .then(json => {
                if (json.photos.length === 0) {
                    imagesCardsElem.innerHTML = "No pictures found"
                    return;
                }
                photosJson = json.photos;
                imagesCardsElem.innerHTML = setImages(photosJson);
                attachSaveBtnsListeners();
            })
            .catch(function () {
                showModalMeessage("an error had occured", "an error had occured, please refresh");
            })
    }

    /**
     * function to set images to show
     * @param images - the images json to show
     * @returns {string} - return html element to show
     */
    function setImages(images) {
        let res = '<div class="row">';
        images.forEach((item) => {
            res += toHTMLCard(item);
        });
        res += '</div>';
        return res;
    }

    /**
     * create html card of current photo
     * @param current - current photo json
     * @returns {string} - html format of card
     */
    function toHTMLCard(current) {
        return `
                <div class="col-md-4">
                    <div class="card">
                        <img class="card-img-top" src=${current.img_src} alt="card image">
                        <div class="card-body">
                            <p class="card-text">Earth date: ${current.earth_date}</p>
                            <p class="card-text">Sol: ${current.sol}</p>
                            <p class="card-text">Camera: ${current.camera.name}</p>
                            <p class="card-text">Mission: ${current.rover.name}</p>
                            <a href="${current.img_src}" target="_blank" button type="button" class="btn btn-primary">Full resolution</a>
                            <button type="button" class="btn-save btn btn-primary">Save</a>
                        </div>
                    </div>
                </div>
                `;
    }

    /**
     * function to return saved list html format
     * @param current - current image to set
     * @returns {string} - image as saved list format
     */
    function toHTMLSavedList(current) {
        return `
                <li>
                <button type="button" class="btn-delete btn btn-primary">X</button>
                <a href=${current.img_src} target="_blank">Image id: ${current.pic_id}</a>
                <p>Earth date: ${current.earth_date}, Sol: ${current.sol}, Camara: ${current.camera}</p>
                </li>
        `
    }

    /**
     * function to create picture in carousle picture format
     * @param current - current card
     * @param first - check if first element so add "active" to the card
     * @returns {string} - return image as carousle format
     */
    function toHTMLCarousleItem(current, first) {
        return `
        <div class="carousel-item${first ? " active" : ""}">
            <img src=${current.img_src} className="d-block w-100" alt="image">
                <div class="carousel-caption d-none d-md-block">
                    <h3>${current.pic_id}</h3>
                    <h5>${current.camera}</h5>
                    <p>${current.earth_date}</p>
                    <a href="${current.img_src}" target="_blank" type="button" class="btn btn-primary">Full resolution</a>
                </div>
        </div>
        `
    }

    /**
     * function to attach save buttons listeners to do an action
     */
    function attachSaveBtnsListeners() {
        for (const b of imagesCardsElem.getElementsByClassName("btn-save")) b.addEventListener('click', save);
    }

    function attachDeleteBtnsListener() {
        for (const b of savedListElem.getElementsByClassName("btn-delete")) {
            b.addEventListener('click', delete_saved_img)
        }
    }

    /**
     * reset form to default values
     */
    function initialForm() {
        imagesCardsElem.innerHTML = "";
        document.querySelectorAll("#todo-input-form > div.alert").forEach(element => {
            element.hidden = true
        });
    }

    /**
     *
     * @param event
     */
    const save = (event) => {
        const imgPressed = event.target.parentElement.parentElement.firstElementChild.currentSrc;
        const photoJSON = photosJson.find(element => element.img_src === imgPressed);
        const pic = {
            "img_src": photoJSON.img_src, "pic_id": photoJSON.id, "sol": photoJSON.sol,
            "earth_date": photoJSON.earth_date, "camera": photoJSON.camera["name"]
        };
        fetch('/api/portal/add_pic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pic),
        })
            .then(status)
            .then((res) => {
                if (res.status === 226) {
                    showModalMeessage("Alredy exist", "This image is already exist in saved list")
                    return;
                }
                savedListElem.insertAdjacentHTML('beforeend', toHTMLSavedList(pic));
                attachDeleteBtnsListener();
                carouselElem.firstElementChild.insertAdjacentHTML('beforeend', toHTMLCarousleItem(pic, savedListElem.childElementCount === 1));
            })
            .catch(function () {
                showModalMeessage("an error had occured", "an error had occured, please refresh")
            });
    }
    const delete_saved_img = (event) => {
        const id = event.target.nextElementSibling.innerText.match('[0-9]+')[0];
        fetch(`/api/portal/remove_pic/${id}`, {
            method: 'DELETE',
        })
            .then(status)
            .then(() => {
                event.target.parentElement.remove();
                for (const carouselPic of carouselElem.firstElementChild.children) {
                    if (carouselPic.lastElementChild.firstElementChild.innerText === id) {
                        if (carouselPic.className.includes("active") && carouselPic.parentElement.childElementCount > 1)
                            carouselElem.firstElementChild.firstElementChild.className = carouselElem.firstElementChild.firstElementChild.className + " active";
                        carouselPic.remove();
                    }
                }
            })
            .catch(() => {
                showModalMeessage("an error had occured", "an error had occured, please refresh")
            })
    }

    function initialSavedList() {
        savedListElem.innerHTML = `<img src="images/loading-buffering.gif">`;
        fetch('/api/portal/get_pics/')
            .then(status)
            .then(res => res.json())
            .then(json => {
                savedListElem.innerHTML = "";
                for (let index = 0; index < json.length; index++) {
                    const photo = json[index.toString()];
                    savedListElem.insertAdjacentHTML('beforeend', toHTMLSavedList(photo));
                    carouselElem.firstElementChild.insertAdjacentHTML('beforeend', toHTMLCarousleItem(json[index], savedListElem.childElementCount === 1));
                }
                attachDeleteBtnsListener();
            })
            .catch(function () {
                showModalMeessage("an error had occured", "an error had occured, please refresh")
            })
    }

    function initialValidators() {
        initialValidator("Curiosity");
        initialValidator("Opportunity");
        initialValidator("Spirit");

        function initialValidator(str) {
            fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${str}?api_key=${APIKEY}`)
                .then(status)
                .then(res => res.json())
                .then(json => {
                    const manifest = json.photo_manifest;
                    validatorList.add(new validatorModule.classes.ValidMission(str, new Date(manifest.launch_date), manifest.max_sol, new Date(manifest.max_date)));
                })
                .catch(function () {
                    showModalMeessage("an error had occured", "an error had occured, please refresh")
                })
        }
    }

    function initialButtons() {
        document.getElementById('removeListBtn').addEventListener('click', () => {
            for (const b of savedListElem.getElementsByClassName("btn-delete")) {
                b.click();
            }
        });
        document.getElementById("slideBtn").addEventListener('click', () => {
            (savedListElem.childElementCount > 0) ? carouselElem.hidden = false : alert("Saved images list is empty");
        });
        document.getElementById("stopSlideBtn").addEventListener('click', () => {
            carouselElem.hidden = true;
        });

        document.getElementById("searchBtn").addEventListener('click', () => {
            imagesCardsElem.innerHTML = `<img src="images/loading-buffering.gif">`;
            if (validateForm(dateElem, roverElem, cameraElem)) {
                getImages(dateElem.value, roverElem.value, cameraElem.value);
            }
        });
        document.getElementById("clearBtn").addEventListener('click', initialForm);
    }

    function validateDateFromServer(the_date) {
        const roverData = validatorList.list.find(element => element.rover_name === roverElem.value);
        if (roverData === undefined) return false;
        return validatorModule.dateOrSol(the_date.value) ? validateInput([new Date(the_date.value), roverData.landing_date, roverData.max_date], the_date.nextElementSibling, validatorModule.dateInRange) : validateInput([the_date.value, roverData.max_sol], the_date.nextElementSibling, validatorModule.solInRange);
    }

    const validateForm = (theDateElem, theRoverElem, theCameraElem) => {
        theDateElem.value = theDateElem.value.trim();
        const v1 = validateInput(theDateElem.value, theDateElem.nextElementSibling, validatorModule.isNotEmpty) && validateInput(theDateElem.value, theDateElem.nextElementSibling, validatorModule.validDate) && validateDateFromServer(theDateElem);
        const v2 = validateInput(theRoverElem.value, theRoverElem.nextElementSibling, validatorModule.isNotEmpty);
        const v3 = validateInput(theCameraElem.value, theCameraElem.nextElementSibling, validatorModule.isNotEmpty);
        const v = v1 && v2 && v3;
        return v;
    }

    document.addEventListener('DOMContentLoaded', function () {
        imagesCardsElem = document.getElementById("imagesList");
        dateElem = document.getElementById("search-text");
        roverElem = document.getElementById("roverSelect");
        cameraElem = document.getElementById("cameraSelect");
        carouselElem = document.getElementById("carousel");
        savedListElem = document.getElementById("savedPicLists");
        initialSavedList();
        initialValidators();
        initialButtons();
    })
})();