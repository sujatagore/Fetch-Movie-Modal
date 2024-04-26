var cl = console.log;

const addbtn = document.getElementById("addbtn");
const moviecon = document.getElementById("moviecon");
const moviemodal = document.getElementById("moviemodal");
const backdrop = document.getElementById("backdrop");
const movieForm = document.getElementById("movieForm");
const title = document.getElementById("title");
const image = document.getElementById("image");
const overview = document.getElementById("overview");
const rating = document.getElementById("rating");
const subBtn = document.getElementById("subBtn");
const updBtn = document.getElementById("updBtn");
const closemodal = [...document.querySelectorAll(".closemodal")]
const loader = document.getElementById("loader");

const baseUrl = `https://movie-modal-fc4f4-default-rtdb.asia-southeast1.firebasedatabase.app`;
const postUrl = `${baseUrl}/post.json`;

const snackBarMsg = (msg, iconName) =>{
    Swal.fire({
        title : msg,
        icon : iconName,
        timer : 2500
    })
}

const objtoarr = (obj) =>{
    let movieArr = [];
    for (const key in obj) {
        movieArr.push({...obj[key], id:key})
    }
    return movieArr
}

//const showmovieform = () =>{
  // backdrop.classList.toggle("active");
  // moviemodal.classList.toggle("active")
//}

const backdropshow = () =>{
    moviemodal.classList.add("active");
    backdrop.classList.add("active");
}

const backdrophide = () =>{
    moviemodal.classList.remove("active");
    backdrop.classList.remove("active");
    movieForm.reset();
}

const addcard = (obj) =>{
    let card = document.createElement("div");
    card.id = obj.id;
    card.className = "col-md-4";
    card.innerHTML = `<div class="card mt-5">
                        <figure class="moviecard mb-0" id="${obj.id}">
                            <img src="${obj.image}" alt="${obj.title}" title="${obj.title}">
                            <figcaption>
                                <div class="ratSec">
                                    <div class="row">
                                        <div class="col-10">
                                            <h3 class="movieName">${obj.title}</h3>
                                        </div>
                                        <div class="col-2">
                                            <div class="rating text-center">
                                                ${obj.rating >= 5 ? `<p class="bg-success"> ${obj.rating}</p>` :
                                                obj.rating <= 4 && obj.rating >= 3 ? `<p class="bg-warning"> ${obj.rating}</p>` :
                                                obj.rating < 3 ? `<p class="bg-danger"> ${obj.rating}</p>` : `<p class="bg-warning"> ${obj.rating}</p>`}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="overview">
                                    <h3>${obj.title}</h3>
                                    <em>Overview</em>
                                    <p>${obj.overview}</p>
                                    <div class="action">
                                        <button class="btn btn-outline-success" onclick="onEdit(this)">Edit</button>
                                        <button class="btn btn-outline-danger" onclick="onDelete(this)">Delete</button>
                                    </div>
                                </div>
                            </figcaption>
                        </figure>
                    </div>`
        moviecon.prepend(card);
}

const templating = (arr) =>{
    let result = ``;
    arr.forEach(obj => {
        result += `<div class="col-md-4">
                        <div class="card mt-5">
                            <figure class="moviecard mb-0" id="${obj.id}">
                                <img src="${obj.image}" alt="${obj.title}" title="${obj.title}">
                                <figcaption>
                                    <div class="ratSec">
                                        <div class="row">
                                            <div class="col-10">
                                                <h3 class="movieName">${obj.title}</h3>
                                            </div>
                                            <div class="col-2">
                                                <div class="rating text-center">
                                                    ${obj.rating >= 5 ? `<p class="bg-success"> ${obj.rating}</p>` :
                                                    obj.rating <= 4 && obj.rating >= 3 ? `<p class="bg-warning"> ${obj.rating}</p>` :
                                                    obj.rating < 3 ? `<p class="bg-danger"> ${obj.rating}</p>` : `<p class="bg-warning"> ${obj.rating}</p>`}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="overview">
                                        <h3>${obj.title}</h3>
                                        <em>Overview</em>
                                        <p>${obj.overview}</p>
                                        <div class="action">
                                            <button class="btn btn-outline-success" onclick="onEdit(this)">Edit</button>
                                            <button class="btn btn-outline-danger" onclick="onDelete(this)">Delete</button>
                                        </div>
                                    </div>
                                </figcaption>
                            </figure>
                        </div>
                    </div>`
    });
    moviecon.innerHTML = result;
}

const onEdit = (ele) =>{
    let editId = ele.closest(".moviecard").id;
    let editUrl = `${baseUrl}/post/${editId}.json`;
    localStorage.setItem("editId" , editId);
    
    loader.classList.remove("d-none")
    callAPI(editUrl, "GET")
        .then(res =>{
            //cl(res)
            title.value = res.title;
            image.value = res.image;
            overview.value = res.overview;
            rating.value = res.rating;
            updBtn.classList.remove("d-none");
            subBtn.classList.add("d-none");
            backdropshow();
        })
        .catch(err =>{
            cl(err)
        })
        .finally(() =>{
            loader.classList.add("d-none")
        })
}

const onDelete = (ele) =>{
    Swal.fire({
        title: "Do you want to Remove the Movie?",
        showCancelButton: true,
        confirmButtonText: "Remove",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            let deleId = ele.closest(".moviecard").id;
            let deleUrl = `${baseUrl}/post/${deleId}.json`;
            loader.classList.remove("d-none")
            callAPI(deleUrl, "DELETE")
                .then(res =>{
                    ele.closest(".col-md-4").remove();
                    snackBarMsg(`${deleId} Movie Deleted successfully!!!`, `success`)
                })
                .catch(err =>{
                    cl(err)
                })
                .finally(() =>{
                    loader.classList.add("d-none")
                })
        }
      });
}

const callAPI = (apiUrl, methoName, bodyMsg = null) =>{
    bodyMsg = bodyMsg ? JSON.stringify(bodyMsg) : null;
    return fetch(apiUrl, {
        method : methoName,
        body : bodyMsg,
        headers : {
            "Content-type" : "Application/json",
            "AuthToken" : "JWT Token form Local Storage"
        }
    })
        .then(res =>{
            return res.json();
        })
}

const getdata = () =>{
    callAPI(postUrl, "GET")
        .then(data =>{     
            cl(data)
            let movieArr = objtoarr(data);
            templating(movieArr)
        })
        .catch(err =>{
            cl(err)
        })
}

getdata()

const addmovieform = (e) =>{
    e.preventDefault();
    let post ={
        title : title.value,
        image : image.value,
        overview : overview.value,
        rating : rating.value
    }
    loader.classList.remove("d-none")
    callAPI(postUrl, "POST", post)
        .then(res =>{
            post.id = res.name;
            addcard(post);
            e.target.reset();
            backdropshow();
            snackBarMsg(`${post.title} Movie Added Successfully!!!`, `success`)
        })
        .catch(err =>{
            cl(err)
        })
        .finally(()=>{
            loader.classList.add("d-none");
            backdrophide()
        })
}

const updatemovie = () =>{
    let updId = localStorage.getItem("editId");
    let updUrl = `${baseUrl}/post/${updId}.json`;
    let updObj = {
        title : title.value,
        image : image.value,
        overview : overview.value,
        rating : rating.value,
        id : updId
    }
    loader.classList.remove("d-none")
    callAPI(updUrl, "PATCH", updObj)
        .then(res =>{
            let getCard = document.getElementById(updId);
            getCard.innerHTML = ` <figure class="moviecard mb-0 mt-5" id="${updObj.id}">
                                    <img src="${updObj.image}" alt="${updObj.title}" title="${updObj.title}">
                                            <figcaption>
                                                <div class="ratSec">
                                                    <div class="row">
                                                        <div class="col-10">
                                                            <h3 class="movieName">${updObj.title}</h3>
                                                        </div>
                                                        <div class="col-2">
                                                            <div class="rating text-center">
                                                                ${updObj.rating >= 5 ? `<p class="bg-success"> ${updObj.rating}</p>` :
                                                                updObj.rating <= 4 && updObj.rating >= 3 ? `<p class="bg-warning"> ${updObj.rating}</p>` :
                                                                updObj.rating < 3 ? `<p class="bg-danger"> ${updObj.rating}</p>` : `<p class="bg-warning"> ${updObj.rating}</p>`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="overview">
                                                    <h3>${updObj.title}</h3>
                                                    <em>Overview</em>
                                                    <p>${updObj.overview}</p>
                                                    <div class="action">
                                                        <button class="btn btn-outline-success" onclick="onEdit(this)">Edit</button>
                                                        <button class="btn btn-outline-danger" onclick="onDelete(this)">Delete</button>
                                                    </div>
                                                </div>
                                            </figcaption>
                                        </figure>
                                        `
            movieForm.reset();
            updBtn.classList.add("d-none");
            subBtn.classList.remove("d-none");
            backdrophide();
            snackBarMsg(`${updId} movie Updated Successfully!!!`, `success`);
        })
        .catch(err =>{
            cl(err)
        })
        .finally(() =>{
            loader.classList.add("d-none")
        })
}

movieForm.addEventListener("submit", addmovieform);
addbtn.addEventListener("click", backdropshow);
closemodal.forEach(c =>{
    c.addEventListener("click", backdrophide);
});
updBtn.addEventListener("click", updatemovie)