var buttonAddBook = document.getElementsByClassName("main__button-principal");
var buttonCancelSearch = document.getElementsByClassName("main__button-cancel-search")
var buttonSearchBook = document.getElementsByClassName("main__button-search")
let tableBooksSaved = []


buttonAddBook[0].addEventListener("click", function(){
	buttonAddBook[0].style.display= "none"
    document.getElementsByClassName("main__search-form")[0].style.display="inline-flex";
    document.getElementsByClassName("main__book-saved-to-homepage")[0].innerHTML=""
})

buttonCancelSearch[0].addEventListener("click",function(){

    document.getElementsByClassName("main__result-no-book-found")[0].style.display = 'none' 
    document.getElementsByClassName("main__search-form")[0].style.display="none"
    buttonAddBook[0].style.display="block" 
    document.getElementsByClassName("main__search-result-delimiter")[0].style.display = "none"
    document.getElementsByClassName("main__section-book-favorite-title")[0].style.display="none"
    document.getElementsByClassName("main__search-result-title")[0].style.display="none"
    document.getElementsByClassName("main__books-container")[0].innerHTML="" 
})


function requiredInput()
{
    
    var inputBookTitle = document.getElementById("book_title")
    var inputBookAuthor = document.getElementById("book_author")
    if(inputBookTitle.value=="" && inputBookTitle.value=="")
      alert("Veuillez saisir le nom de l'auteur et le titre de l'oeuvre")
  else if(inputBookTitle.value=="")
  {
      alert("Veuillez saisir le titre de l'oeuvre!")
  }
  
  else if(inputBookAuthor.value=="")
  {
      alert("Veuillez saisir le nom de l'auteur!")

  } 
  
}

function limitBookDescriptionToThe200Firstcharacters(description) 
{
    var maxLength = 200
    if(description.textContent.length > maxLength) 
    {

      description.textContent = description.textContent.substr(0,maxLength)+"..."

  }
}

function drainedBeforePageLoading()
{
   
    document.getElementsByClassName("main__display-book-search")[0].innerHTML=""
    document.getElementById("book_title").value = ''
    document.getElementById("book_author").value = ''

}

function displayBooksfound(books)
{
   
    if(!books)
    {
        document.getElementsByClassName("main__result-no-book-found")[0].style.display = 'block' 

    }
    else
    {
        
        document.getElementsByClassName("main__result-no-book-found")[0].style.display = 'none' 
        drainedBeforePageLoading()
        books.forEach((book) =>{

            var bookmarkFavorite =  document.createElement("button")
            var articleElt =  document.createElement("article")
            articleElt.classList.add("main__book-found")
            var bookTitle = document.createElement("h4")
            var bookId = document.createElement("h4")
            var bookAuthor = document.createElement("p")
            var bookDescription = document.createElement("p")
            var articleImg =  document.createElement("article")
            var bookImage = document.createElement("img")

            if(book.volumeInfo.imageLinks)
              var imageLink = book.volumeInfo.imageLinks.smallThumbnail
          else 
              var imageLink = "images/unavailable.png"
          
          
          bookImage.setAttribute("src",imageLink)
          bookTitle.innerText= "Titre: "+book.volumeInfo.title
          bookId.textContent = "id: "+book.id
          bookAuthor.textContent = "Auteur: "+book.volumeInfo.authors[0]

          bookmarkFavorite.className = "main__book-favorite"
          bookImage.className = "main__book-image"
          bookTitle.className = "main__book-text main__book-title"
          bookAuthor.className = "main__book-text main__book-author"
          bookId.className = "main__book-text main__book-id"
          bookDescription.className = "main__book-text main__book-description"

          if(book.volumeInfo.description)
          {
            bookDescription.textContent = "Description: "+book.volumeInfo.description
            if(bookDescription.textContent.length>200)
            {
                limitBookDescriptionToThe200Firstcharacters(bookDescription)
            }
        }
        else
          bookDescription.textContent = "Description indisponible"

      bookmarkFavorite.innerHTML = '<i class="fas fa-bookmark" style="font-size:30px;color:green"></i>'
      articleImg.appendChild(bookImage)
      articleElt.appendChild(bookmarkFavorite)
      articleElt.appendChild(bookTitle)
      articleElt.appendChild(bookId)
      articleElt.appendChild(bookAuthor)
      articleElt.appendChild(bookDescription)
      articleElt.appendChild(articleImg)
      document.getElementsByClassName("main__books-container")[0].appendChild(articleElt)
      document.getElementsByClassName("main__search-result-delimiter")[0].style.display = "block"
      document.getElementsByClassName("main__section-book-favorite-title")[0].style.display="block"
      document.getElementsByClassName("main__search-result-title")[0].style.display="block"
      document.getElementsByClassName("main__form-title")[0].style.display = 'none'
      
      bookmarkFavorite.addEventListener("click",()=>saveBookToResultPage(book))
      
  })   
    }
}

function displayBooksearchResult()
{

    var request = new XMLHttpRequest()
    var link = 'https://www.googleapis.com/books/v1/volumes?q=' 
    var bookAuthor = document.getElementById("book_author").value 
    var bookTitle = document.getElementById("book_title").value
    var url = link.concat(bookTitle).concat(bookAuthor)
    request.open('GET', url , true)
    request.onload = function () 
    {
      let data = JSON.parse(this.response)
      var books = data.items

      if (request.status >= 200 && request.status < 400) 
      {

        if(document.getElementById("book_author").value=="" ||document.getElementById("book_title").value=="" )
        {
            requiredInput()
        }
        else
        {
            drainedBeforePageLoading()
            displayBooksfound(books)
        }

    }
    else 
    {
        
        if(document.getElementById("book_author").value=="" ||document.getElementById("book_title").value=="")
           requiredInput()
       else
       {
           drainedBeforePageLoading()
           document.getElementsByClassName("main__result-no-book-found")[0].display = 'block'
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
        var bookmarkFavorite =  document.createElement("button")
        var articleElt =  document.createElement("article")
        articleElt.classList.add("main__book-found")
        var bookTitle = document.createElement("h4")
        var bookId = document.createElement("h4")
        var bookAuthor = document.createElement("p")
        var bookDescription = document.createElement("p")
        var articleImg =  document.createElement("article")
        var bookImage = document.createElement("img")

        if(book.volumeInfo.imageLinks)
          var imageLink = book.volumeInfo.imageLinks.smallThumbnail
      else 
          var imageLink = "images/unavailable.png"
      
        //Setting  variable attribute
        bookTitle.style.fontSize="17px"
        bookId.style.fontSize="15px"
        bookAuthor.style.fontWeight ="900"
        bookAuthor.style.fontSize="14px"
        bookId.style.fontStyle = "oblique"
        bookImage.setAttribute("src",imageLink)
        bookTitle.textContent= "Titre: "+book.volumeInfo.title
        bookId.textContent = "id: "+book.id
        bookAuthor.textContent = "Auteur: "+book.volumeInfo.authors[0]

        bookmarkFavorite.className = "main__book-favorite"
        bookImage.className = "main__book-image"
        bookTitle.className = "main__book-text main__book-title"
        bookAuthor.className = "main__book-text main__book-author"
        bookId.className = "main__book-text main__book-id"
        bookDescription.className = "main__book-text main__book-description"

        if(book.volumeInfo.description)
        {
            bookDescription.textContent = "Description: "+book.volumeInfo.description
            if(bookDescription.textContent.length>200)
            {
                limitBookDescriptionToThe200Firstcharacters(bookDescription)
            }
        }
        else
          bookDescription.textContent = "Description indisponible"

      // Adding element to poch'list dom 
      bookmarkFavorite.innerHTML = '<i class="fas fa-trash" style="font-size:30px;color:red"></i>'
      articleImg.appendChild(bookImage)
      articleElt.appendChild(bookmarkFavorite)
      articleElt.appendChild(bookTitle)
      articleElt.appendChild(bookId)
      articleElt.appendChild(bookAuthor)
      articleElt.appendChild(bookDescription)
      articleElt.appendChild(articleImg)
      document.getElementsByClassName("main__book-add-to-favorite")[0].appendChild(articleElt)
      bookmarkFavorite.addEventListener("click",()=>removeBookFromResultPage(document.getElementsByClassName("main__books-container"),articleElt,lastBookSaved,tableBooksSaved))

  }
}

function removeBookFromResultPage(articleParent,articleDisplayBookSave,book,tabBooskSaved)
{
    var index = tabBooskSaved.indexOf(book) 
    tabBooskSaved.splice(index,1)
    sessionStorage.setItem("book",JSON.stringify(tabBooskSaved))
    var articleParent = document.getElementsByClassName("main__book-found")
    var lastElementSaved = articleParent.length - 1
    articleParent[lastElementSaved].parentNode.removeChild(articleParent[lastElementSaved])

}

function addSavedBooksToHomePage()
{
    var tab =JSON.parse(sessionStorage.getItem("book"))
    if(!tab)
      tab = []
  tab.forEach((book) =>{

    var articleElt =  document.createElement("article")
    articleElt.classList.add("main__book-found")
    var bookTitle = document.createElement("h4")
    var bookId = document.createElement("h4")
    var bookAuthor = document.createElement("p")
    var bookDescription = document.createElement("p")
    var articleImg =  document.createElement("article")
    var bookImage = document.createElement("img")

    if(book.volumeInfo.imageLinks)
      var imageLink = book.volumeInfo.imageLinks.smallThumbnail
  else 
      var imageLink = "images/unavailable.png"
  
        //Setting  variable attribute
        bookTitle.style.fontSize="17px"
        bookId.style.fontSize="15px"
        bookAuthor.style.fontWeight ="900"
        bookAuthor.style.fontSize="14px"
        bookId.style.fontStyle = "oblique"
        bookImage.setAttribute("src",imageLink)
        bookTitle.textContent= "Titre: "+book.volumeInfo.title
        bookId.textContent = "id: "+book.id
        bookAuthor.textContent = "Auteur: "+book.volumeInfo.authors[0]

        bookImage.className = "main__book-image"
        bookTitle.className = "main__book-text main__book-title"
        bookAuthor.className = "main__book-text main__book-author"
        bookId.className = "main__book-text main__book-id"
        bookDescription.className = "main__book-text main__book-description"
        
        if(book.volumeInfo.description)
        {
            bookDescription.textContent = "Description: "+book.volumeInfo.description
            if(bookDescription.textContent.length>200)
            {
                limitBookDescriptionToThe200Firstcharacters(bookDescription)
            }
        }
        else
          bookDescription.textContent = "Description indisponible"

      // Adding element to poch'list dom 
      articleElt.appendChild(bookTitle)
      articleElt.appendChild(bookId)
      articleElt.appendChild(bookAuthor)
      articleElt.appendChild(bookDescription)
      articleImg.appendChild(bookImage)
      articleElt.appendChild(articleImg)
      document.getElementsByClassName("main__book-saved-to-homepage")[0].appendChild(articleElt)
      
  })   
}


buttonSearchBook[0].addEventListener("click",function(){
    displayBooksearchResult()
})
addSavedBooksToHomePage()
