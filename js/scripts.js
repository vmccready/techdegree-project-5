

//function to abbreviate state names from: https://gist.github.com/calebgrove/c285a9510948b633aa47
function abbrState(input, to){
    
    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arizona', 'AZ'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    if (to == 'abbr'){
        input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        for(i = 0; i < states.length; i++){
            if(states[i][0] == input){
                return(states[i][1]);
            }
        }    
    } else if (to == 'name'){
        input = input.toUpperCase();
        for(i = 0; i < states.length; i++){
            if(states[i][1] == input){
                return(states[i][0]);
            }
        }    
    }
}
//function to change first letter in words to upper case from :https://stackoverflow.com/questions/17200640/javascript-capitalize-first-letter-of-each-word-in-a-string-only-if-lengh-2
function upperFirstLetters(input){
    input = input.toLowerCase().replace(/([^a-z]|^)([a-z])/g, function(_, g1, g2) {
        return g1 + g2.toUpperCase(); } );
        return input;
};

$(document).ready(function() {

$.ajax({
  url: 'https://randomuser.me/api/?results=12&nat=us',
  dataType: 'json',
  success: function(data) {
    randomusers = data.results;
    console.log(randomusers);

    let galleryHTML = ``
    //create a gallery item for each user
    $.each(randomusers, function(i, user){
        galleryHTML +=`
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${user.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="${user.name.first} ${user.name.last}" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="card-text">${user.email}</p>
                <p class="card-text cap">${user.location.city}</p>
            </div>
        </div>    
        `
    });
    //add gallery
    $("#gallery").html(galleryHTML);
    $('div.card').css('box-shadow', '2px 2px 5px')

    //create search box
    let $cards = $('div.card');
    let $searchContainer = $('div.search-container');
    let searchHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
    </form>
    `;
    $searchContainer.html(searchHTML);
    $searchContainer.on('input', (event)=>{
        event.preventDefault();//dont refresh page
        $cards.show(); //show all cards
        let searchTerm = $('#search-input').val();
        $cards.filter((i, card) => {
            return !$(card).children().children('h3').html().includes(searchTerm); //check if search name matches
        }).hide();
    });

    //add event listener to create modal container
    $('#gallery').on('click', '.card', function(event){
        let username = ($(event.currentTarget).children().children('h3').html());
        let userIndex = 0;

        let searchTerm = $('#search-input').val();
        let visibleUsers = randomusers.filter((user)=>{
            return (user.name.first + ' ' + user.name.last).includes(searchTerm)
        });
        for (userIndex; userIndex < visibleUsers.length ; userIndex += 1){
            if (visibleUsers[userIndex].name.first + ' ' + visibleUsers[userIndex].name.last === username){break}
        }

        //create modal element - HTML and event listeners
        function createModal(user){
            $('div.modal-container').remove();
            let birthday = new Date(user.dob.date);
            let modalHTML = `
            <div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                        <p class="modal-text">${user.email}</p>
                        <p class="modal-text cap">${user.location.city}</p>
                        <hr>
                        <p class="modal-text">${user.phone}</p>
                        <p class="modal-text">${upperFirstLetters(user.location.street)}, ${abbrState(user.location.state, 'abbr')} ${user.location.postcode}</p>
                        <p class="modal-text">Birthday: ${birthday.toLocaleDateString("en-US")}</p>
                    </div>
                </div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>
            `;
            $('body').append(modalHTML);
            //modal toggle event listeners
            $('#modal-prev').on('click', function(event){
                if (userIndex>0){userIndex -= 1};
                createModal(visibleUsers[userIndex])
            });

            $('#modal-next').on('click', function(event){
                if (userIndex<(visibleUsers.length-1)){userIndex += 1};
                createModal(visibleUsers[userIndex])
            });

            //close modal view with x
            $('#modal-close-btn').on('click', function(event){
                $('div.modal-container').remove();
            });
        }


        createModal(visibleUsers[userIndex]);
    });
  }
});
});