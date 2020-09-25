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
    buttonAdd.style.display="block"
    document.getElementById("bookmark_title").innerHTML = " "
    document.getElementById("book").value = ''
    document.getElementById("auth").value = ''
    
})

function requiredInput()
{
    document.getElementById("bookmark_title").innerHTML=""
    document.getElementById("no_search_results").innerHTML=""
    var pElt = document.createElement("p")
    pElt.textContent = ("Ma poch'liste")
    document.getElementById("bookmark_title").appendChild(pElt)
    var book = document.getElementById("book")
    var author = document.getElementById("auth")
    if(book.value=="" && author.value=="")
      alert("Veuillez saisir le nom de l'auteur et le titre de l'oeuvre")
    else if(book.value=="")
    {
		alert("Veuillez saisir le titre de l'oeuvre!")
    }
      
    else if(author.value=="")
    {
      alert("Veuillez saisir le nom de l'auteur!")

    }
    //document.getElementById("book").value = ''
    //document.getElementById("auth").value = ''
    
}


function limitBookDescriptionToThe200Firstcharacters(description) 
{
    var maxLength = 200
    if(description.textContent.length > maxLength) 
    {

      description.textContent = description.textContent.substr(0,maxLength)

    }
}

function drainedBeforePageLoading()
{

    document.getElementById("no_search_results").innerHTML = " "
    document.getElementById("search_results").innerHTML= ""
    document.getElementById("results_title").innerHTML = " "
    document.getElementById("bookmark_title").innerHTML = " "
    document.getElementById("book").value = ''
    document.getElementById("auth").value = ''

}

function displayNoBooksFound()
{

    document.getElementById("no_search_results").innerHTML =" "
    var divElt_1 =  document.createElement("div")
    divElt_1.classList.add("no_results")
    var titleElt = document.createElement("p")
    titleElt.textContent=("Aucun livre n’a été trouvé")
    divElt_1.appendChild(titleElt)
    document.getElementById("no_search_results").appendChild(divElt_1)

}

function displayBooksfound(books)
{
   /*
    if(!books)
    {
      displayNoBooksFound()
    }
    */
      drainedBeforePageLoading()
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

        var buttonBookmarkElt =  document.createElement("button")
        var buttonShowMoreDescription = document.createElement("button")
        var buttonShowLessDescription = document.createElement("button")
        var divElt =  document.createElement("div")
        divElt.classList.add("results")
        var titleElt = document.createElement("h4")
        var idElt = document.createElement("h4")
        var authorElt = document.createElement("p")
        var descriptionElt = document.createElement("p")
        var divImg =  document.createElement("div")
        var imageElt = document.createElement("img")

        if(book.volumeInfo.imageLinks)
          var imageLink = book.volumeInfo.imageLinks.smallThumbnail
        else 
          var imageLink = "images/unavailable.png"
          
        //Setting  variable attribute
        titleElt.style.fontSize="17px"
        idElt.style.fontSize="15px"
        authorElt.style.fontWeight ="900"
        authorElt.style.fontSize="14px"
        idElt.style.fontStyle = "oblique"
        buttonShowMoreDescription.id = "show_more"
        buttonShowLessDescription.id = "show_less"
        buttonShowMoreDescription.innerHTML = "...Voir plus"
        buttonShowLessDescription.innerHTML = "Voir moins"
        buttonBookmarkElt.id= "bookmark_btn"
        imageElt.setAttribute("src",imageLink)
        imageElt.classList.add = "image_results_container"
        titleElt.textContent= "Titre: "+book.volumeInfo.title
        idElt.textContent = "id: "+book.id
        authorElt.textContent = "Auteur: "+book.volumeInfo.authors[0]

        if(book.volumeInfo.description)
        {
            descriptionElt.textContent = "Description: "+book.volumeInfo.description
            if(descriptionElt.textContent.length>200)
            {
                limitBookDescriptionToThe200Firstcharacters(descriptionElt)
                descriptionElt.appendChild(buttonShowMoreDescription)

                buttonShowMoreDescription.addEventListener("click",function(){
                      descriptionElt.textContent =" "
                      descriptionElt.textContent = book.volumeInfo.description
                      descriptionElt.appendChild(buttonShowLessDescription)

                      buttonShowLessDescription.addEventListener("click",function(){
                        
                          limitBookDescriptionToThe200Firstcharacters(descriptionElt)
                          descriptionElt.appendChild(buttonShowMoreDescription)
                      })
                })
              }

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
        buttonBookmarkElt.addEventListener("click",()=>saveBookToResultPage(book))
      })
    
}


function displayBooksearchResult()
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
    request.onload = function () 
    {
      let data = JSON.parse(this.response)
      var books = data.items

      if (request.status >= 200 && request.status < 400) 
      {

        if(document.getElementById("auth").value=="" ||document.getElementById("book").value=="" )
        {
           	requiredInput()
           	console.log("okeeeee")
         }
        else
        {
			console.log("ok")
			drainedBeforePageLoading()
			displayBooksfound(books)
     	}

      }
      else 
      {
        
        if(document.getElementById("auth").value=="" ||document.getElementById("book").value=="")
          requiredInput()
         else
         {
           drainedBeforePageLoading()
           displayNoBooksFound()
         }
       
      }
    }
      
    request.send()
}

function saveBookToResultPage(books)
{
    if(tableBooksSaved.includes(books))
    {
      
      alert("Vous ne pouvez ajouter deux fois le même livre!")

    }
    else
    {

      tableBooksSaved.push(books)
      sessionStorage.setItem("book",JSON.stringify(tableBooksSaved))
      var lastBookSaved = tableBooksSaved[tableBooksSaved.length -1]
      var book = JSON.parse(JSON.stringify(lastBookSaved))
      var divContainer = document.createElement("div")
      var buttonBookmarkElt =  document.createElement("button")
      var buttonShowMoreDescription = document.createElement("button")
      var buttonShowLessDescription = document.createElement("button")
      var divElt =  document.createElement("div")
      divElt.classList.add("results")
      var titleElt = document.createElement("h4")
      var idElt = document.createElement("h4")
      var authorElt = document.createElement("p")
      var descriptionElt = document.createElement("p")
      var divImg =  document.createElement("div")
      var imageElt = document.createElement("img")

      if(book.volumeInfo.imageLinks)
        var imageLink = book.volumeInfo.imageLinks.smallThumbnail
      else 
        var imageLink = "images/unavailable.png"
        
      //Setting  variable attribute 
      titleElt.style.fontSize="17px"
      idElt.style.fontSize="15px"
      authorElt.style.fontWeight ="900"
      authorElt.style.fontSize="14px"
      idElt.style.fontStyle = "oblique"
      buttonShowMoreDescription.id = "show_more"
      buttonShowLessDescription.id = "show_less"
      buttonShowMoreDescription.innerHTML = "...Voir plus"
      buttonShowLessDescription.innerHTML =  "Voir moins"
      divContainer.classList.add = "ma_poch"
      buttonBookmarkElt.id = "bookmark_btn"
      imageElt.setAttribute("src",imageLink)
      imageElt.classList.add = "image_results_container"

      titleElt.textContent = "Auteur : "+book.volumeInfo.title
      idElt.textContent = "id : "+book.id
      authorElt.textContent = book.volumeInfo.authors[0]

      if(book.volumeInfo.description)
        {
            descriptionElt.textContent = "Description: "+book.volumeInfo.description
            if(descriptionElt.textContent.length>200)
            {
                limitBookDescriptionToThe200Firstcharacters(descriptionElt)
                descriptionElt.appendChild(buttonShowMoreDescription)

                buttonShowMoreDescription.addEventListener("click",function(){
                      descriptionElt.textContent =" "
                      descriptionElt.textContent = book.volumeInfo.description
                      descriptionElt.appendChild(buttonShowLessDescription)

                      buttonShowLessDescription.addEventListener("click",function(){
                        
                          limitBookDescriptionToThe200Firstcharacters(descriptionElt)
                          descriptionElt.appendChild(buttonShowMoreDescription)
                      })
                })
              }

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
      buttonBookmarkElt.addEventListener("click",()=>removeBookFromResultPage(document.getElementById("bookmark_add"),divElt,lastBookSaved,tableBooksSaved))
    }
}

function removeBookFromResultPage(divParent,divDisplayBookSave,book,tabBooskSaved)
{
    var index = tabBooskSaved.indexOf(book) 
    tabBooskSaved.splice(index,1)
    sessionStorage.setItem("book",JSON.stringify(tabBooskSaved))
    divParent.removeChild(divDisplayBookSave)

}

function addSavedBooksToHomePage()
{
    var tab =JSON.parse(sessionStorage.getItem("book"))
    if(!tab)
      tab = []
    tab.forEach((bookSaved) =>{

      var divContainer = document.createElement("div")
      var buttonShowMoreDescription = document.createElement("button")
      var buttonShowLessDescription = document.createElement("button")
      var divElt =  document.createElement("div")
      divElt.classList.add("results")
      var titleElt = document.createElement("h4")
      var idElt = document.createElement("h4")
      var authorElt = document.createElement("p")
      var descriptionElt = document.createElement("p")
      var divImg =  document.createElement("div")
      var imageElt = document.createElement("img")
      if(bookSaved.volumeInfo.imageLinks )
        var imageLink = bookSaved.volumeInfo.imageLinks.smallThumbnail
      else 
        var imageLink = "images/unavailable.png"
      //Setting  variable attribute   
      titleElt.style.fontSize="17px"
      idElt.style.fontSize="15px"
      authorElt.style.fontWeight ="900"
      authorElt.style.fontSize="14px"
      idElt.style.fontStyle = "oblique"
      buttonShowMoreDescription.id = "show_more"
      buttonShowLessDescription.id = "show_less"
      buttonShowMoreDescription.innerHTML = "...Voir plus"
      buttonShowLessDescription.innerHTML =  "Voir moins"
      divContainer.classList.add = "ma_poch"
      imageElt.setAttribute("src",imageLink) 
      imageElt.classList.add = "image_results_container"
      titleElt.textContent = "Titre : "+bookSaved.volumeInfo.title
      idElt.textContent = "id : "+bookSaved.id
      authorElt.textContent = "Auteur : "+bookSaved.volumeInfo.authors[0]

      if(bookSaved.volumeInfo.description)
        {
            descriptionElt.textContent = "Description: "+bookSaved.volumeInfo.description
            if(descriptionElt.textContent.length>200)
            {
              limitBookDescriptionToThe200Firstcharacters(descriptionElt)
              descriptionElt.appendChild(buttonShowMoreDescription)

              buttonShowMoreDescription.addEventListener("click",function(){
                    descriptionElt.textContent =" "
                    descriptionElt.textContent = bookSaved.volumeInfo.description
                    descriptionElt.appendChild(buttonShowLessDescription)

                    buttonShowLessDescription.addEventListener("click",function(){
                      
                        limitBookDescriptionToThe200Firstcharacters(descriptionElt)
                        descriptionElt.appendChild(buttonShowMoreDescription)
                    })
                })
              }

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
searchButton.addEventListener("click",displayBooksearchResult)
addSavedBooksToHomePage()