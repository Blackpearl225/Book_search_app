var buttonAdd = document.getElementById("button");
var buttonCancel = document.getElementById("button_2")
var searchButton = document.getElementById("button_1")
let tableBooksSaved = []

buttonAdd.addEventListener("click",function(){
    document.getElementById("books_saved").innerHTML = " " 
		document.getElementById("container").style.display = "block"
		buttonAdd.style.display = "none"

});
buttonCancel.addEventListener("click",function(){
	
		document.getElementById("container").style.display="none"
    document.getElementById("search_results").style.display="none"
		buttonAdd.style.display="block";
});

function removeBook(divParent,divDisplayBookSave,book,tabBooskSaved)
{
  var index = tabBooskSaved.indexOf(book) 
  tabBooskSaved.splice(index,1)
  sessionStorage.setItem("book",JSON.stringify(tabBooskSaved))
  divParent.removeChild(divDisplayBookSave)

}

function limitBookDescriptionToThe200Firstcharacters(description) 
{
    var maxLength = 200
    if(description.textContent.length > maxLength) 
    {

      description.textContent = description.textContent.substr(0,maxLength) + '...';

    }
}

function saveBook(books)
{
   
    if(tableBooksSaved.includes(books))
    {
      alert("Vous ne pouvez pas ajouter deux fois le même livre")

    }

    else
    {
      console.log("ok")
      tableBooksSaved.push(books)
      sessionStorage.setItem("book",JSON.stringify(tableBooksSaved))
      var lastBookSaved = tableBooksSaved[tableBooksSaved.length -1]
      var book = JSON.parse(JSON.stringify(lastBookSaved))
      var divContainer = document.createElement("div")
      var buttonBookmarkElt =  document.createElement("button")
      var divElt =  document.createElement("div")
      divElt.classList.add("results")
      var titleElt = document.createElement("h5")
      var idElt = document.createElement("h5")
      var authorElt = document.createElement("p")
      var descriptionElt = document.createElement("p")
      var divImg =  document.createElement("div")
      var imageElt = document.createElement("img")
      if(book.volumeInfo.imageLinks)
        var imageLink = book.volumeInfo.imageLinks.smallThumbnail
      else 
        var imageLink = "unavailable.png"
        
      //Setting  variable attribute

      divContainer.id = "ma_poch"
      buttonBookmarkElt.id="bookmark_btn"
      imageElt.setAttribute("src",imageLink)
      idElt.id="id"
      authorElt.id="author"
      titleElt.id="title"
      descriptionElt.id="descr"
      imageElt.id = "image_results_container"
      titleElt.textContent=book.volumeInfo.title
      idElt.textContent = book.id
      authorElt.textContent = book.volumeInfo.authors[0]
      if(book.volumeInfo.description)
      {
        descriptionElt.textContent = book.volumeInfo.description
        limitBookDescriptionToThe200Firstcharacters(descriptionElt)
      }
      else
        descriptionElt.textContent = "Description indisponible"
      buttonBookmarkElt.innerHTML = '<i class="fas fa-trash"  style="font-size:30px;color:red"></i>'

      divImg.appendChild(imageElt)
      divElt.appendChild(titleElt)
      divElt.appendChild(buttonBookmarkElt)
      divElt.appendChild(idElt)
      divElt.appendChild(authorElt)
      divElt.appendChild(descriptionElt)
      divElt.appendChild(divImg)
      divContainer.appendChild(divElt)
      document.getElementById("bookmark_add").appendChild(divElt)
      buttonBookmarkElt.addEventListener("click",()=>removeBook(document.getElementById("bookmark_add"),divElt,lastBookSaved,tableBooksSaved))
    }
  }

function addBooksSavedToHomePage()
{
  var tab =JSON.parse(sessionStorage.getItem("book"))
  tab.forEach((bookSaved) =>{

        var divContainer = document.createElement("div")
        var divElt =  document.createElement("div")
        divElt.classList.add("results")
        var titleElt = document.createElement("h5")
        var idElt = document.createElement("h5")
        var authorElt = document.createElement("p")
        var descriptionElt = document.createElement("p")
        var divImg =  document.createElement("div")
        var imageElt = document.createElement("img")
        if(bookSaved.volumeInfo.imageLinks )
          var imageLink = bookSaved.volumeInfo.imageLinks.smallThumbnail
        else 
          var imageLink = "unavailable.png"
          
        //Setting  variable attribute
        divContainer.id = "ma_poch"
        imageElt.setAttribute("src",imageLink)
        idElt.id="id"
        authorElt.id="author"
        titleElt.id="title"
        descriptionElt.id="descr"
        imageElt.id = "image_results_container"
        titleElt.textContent=bookSaved.volumeInfo.title
        idElt.textContent = bookSaved.id
        authorElt.textContent = bookSaved.volumeInfo.authors[0]
        if(bookSaved.volumeInfo.description)
        {
          descriptionElt.textContent = bookSaved.volumeInfo.description
          limitBookDescriptionToThe200Firstcharacters(descriptionElt)
        }
        else
          descriptionElt.textContent = "Description indisponible"
        divImg.appendChild(imageElt)
        divElt.appendChild(titleElt)
        divElt.appendChild(idElt)
        divElt.appendChild(authorElt)
        divElt.appendChild(descriptionElt)
        divElt.appendChild(divImg)
        divContainer.appendChild(divElt)
        document.getElementById("books_saved").appendChild(divElt)
  })
}

function get()
{
  document.getElementById("container").style.display = "block";
  buttonAdd.style.display = "none";

  if(document.getElementById("poch"))
    document.getElementById("poch").remove()
    
  var request = new XMLHttpRequest()
  var link = 'https://www.googleapis.com/books/v1/volumes?q=' 
  var author = document.getElementById("auth").value 
  var title = document.getElementById("book").value
  var url = link.concat(title).concat(author)
  request.open('GET', url , true)
  request.onload = function () {
  // Begin accessing JSON data here
  let data = JSON.parse(this.response)
  var books = data.items

  if (request.status >= 200 && request.status < 400) 
  {

    //optimize the search

  	 document.getElementById("search_results").innerHTML= ""
     document.getElementById("book").value = ''
     document.getElementById("auth").value = ''
     if(document.getElementById("results_title") && document.getElementById("bookmark_title"))
     {
        document.getElementById("results_title").innerHTML = " "
        document.getElementById("bookmark_title").innerHTML = " "
     }
     var titleElt = document.createElement("p")
     var pElt = document.createElement("p")
     var hrElt = document.createElement("hr")
     hrElt.classList.add("delimiter")
     pElt.textContent = ("Ma poch'liste")
     titleElt.textContent=("Résultats de la recherche")
    

     document.getElementById("results_title").appendChild(titleElt)
     document.getElementById("bookmark_title").appendChild(hrElt)
     document.getElementById("bookmark_title").appendChild(pElt)

     books.forEach((book) =>{

    // Variable declaration 

    var buttonBookmarkElt =  document.createElement("button")
    var divElt =  document.createElement("div")
    divElt.classList.add("results")
    var titleElt = document.createElement("h5")
    var idElt = document.createElement("h5")
    var authorElt = document.createElement("p")
    var descriptionElt = document.createElement("p")
    var divImg =  document.createElement("div")
    var imageElt = document.createElement("img")

    if(book.volumeInfo.imageLinks)
    	var imageLink = book.volumeInfo.imageLinks.smallThumbnail
    else 
    	var imageLink = "unavailable.png"
      
    //Setting  variable attribute

    buttonBookmarkElt.id="bookmark_btn"
    imageElt.setAttribute("src",imageLink)
    idElt.id="id"
    authorElt.id="author"
    titleElt.id="title"
    descriptionElt.id="descr"
    imageElt.id = "image_results_container"
    titleElt.textContent=book.volumeInfo.title
    idElt.textContent = book.id
    authorElt.textContent = book.volumeInfo.authors[0]
    if(book.volumeInfo.description)
    {
        descriptionElt.textContent = book.volumeInfo.description
        limitBookDescriptionToThe200Firstcharacters(descriptionElt)
    }
    else
      descriptionElt.textContent = "Description indisponible"

    // Adding element to poch'list dom 

    buttonBookmarkElt.innerHTML = '<i class="fas fa-bookmark" style="font-size:30px;color:green"></i>'
    divImg.appendChild(imageElt)
    divElt.appendChild(titleElt)
    divElt.appendChild(buttonBookmarkElt)
    divElt.appendChild(idElt)
    divElt.appendChild(authorElt)
    divElt.appendChild(descriptionElt)
    divElt.appendChild(divImg)
    document.getElementById("search_results").appendChild(divElt)
    buttonBookmarkElt.addEventListener("click",()=>saveBook(book))
     })
    }

    else 
      {

        var divElt_1 =  document.createElement("div")
        divElt_1.classList.add("no_results")
        var titleElt = document.createElement("p")
        titleElt.textContent=("Aucun livre n’a été trouvé")
        divElt_1.appendChild(titleElt)
        document.getElementById("no_search_results").appendChild(divElt_1)

      }
  }
  request.send()
}

searchButton.addEventListener("click",get)
addBooksSavedToHomePage()
