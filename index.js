
// Write JS to implement the following features:
  // Users can add a new party by submitting a form.

  // Users can delete the selected party.
      //Warning
        // When you send a POST request to create a new party, the API is expecting the date to be an ISO string. 
        // The request will fail if you send an invalid date. To get a valid ISO string:

        // In your form, use <input type="date"/> to get the user's input as a date.
        // Convert the date to the right format:
            // const isoDate = new Date(dateFromForm).toISOString();
        // Send the ISO string in your POST request for the date field.



// Your submission should meet the following requirements:
// index.html is not modified. All elements are generated via JS.
    //DONE
// The application renders a form where users can input the name, description, date, and location of a new party.
    //DONE
// The application is able to create a new party via a POST request to the API.

  //use form input to create a new party post request to api
  //figure out what that means.


// The application renders a delete button for the selected party.
// The application is able to remove the selected party via a DELETE request to the API.
// The application is rerendered whenever state changes.
// UI elements are organized into component functions.


// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "2505-FTB-ET-WEB-FT"; // Make sure to change this!
const API = BASE + COHORT;

// === State ===
let parties = [];
let selectedParty;
let rsvps = [];
let guests = [];

/** Updates state with all parties from the API */
async function getParties() {
  try {
    const response = await fetch(API + "/events");
    const result = await response.json();
    parties = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with a single party from the API */
async function getParty(id) {
  try {
    const response = await fetch(API + "/events/" + id);
    const result = await response.json();
    selectedParty = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with all RSVPs from the API */
async function getRsvps() {
  try {
    const response = await fetch(API + "/rsvps");
    const result = await response.json();
    rsvps = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with all guests from the API */
async function getGuests() {
  try {
    const response = await fetch(API + "/guests");
    const result = await response.json();
    guests = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

// === Components ===

/** Party name that shows more details about the party when clicked */
function PartyListItem(party) {
  const $li = document.createElement("li");

  if (party.id === selectedParty?.id) {
    $li.classList.add("selected");
  }

  $li.innerHTML = `
    <a href="#selected">${party.name}</a>
  `;
  $li.addEventListener("click", () => getParty(party.id));
  return $li;
}

/** A list of names of all parties */
function PartyList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("parties");

  const $parties = parties.map(PartyListItem);
  $ul.replaceChildren(...$parties);

  return $ul;
}

/** Detailed information about the selected party */
function SelectedParty() {
  if (!selectedParty) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a party to learn more.";
    return $p;
  }

  const $party = document.createElement("section");
  $party.innerHTML = `
    <h3>${selectedParty.name} #${selectedParty.id}</h3>
    <time datetime="${selectedParty.date}">
      ${selectedParty.date.slice(0, 10)}
    </time>
    <address>${selectedParty.location}</address>
    <p>${selectedParty.description}</p>
    <GuestList></GuestList>
  `;
  $party.querySelector("GuestList").replaceWith(GuestList());

  return $party;
}

/** List of guests attending the selected party */
function GuestList() {
  const $ul = document.createElement("ul");
  const guestsAtParty = guests.filter((guest) =>
    rsvps.find(
      (rsvp) => rsvp.guestId === guest.id && rsvp.eventId === selectedParty.id
    )
  );

  // Simple components can also be created anonymously:
  const $guests = guestsAtParty.map((guest) => {
    const $guest = document.createElement("li");
    $guest.textContent = guest.name;
    return $guest;
  });
  $ul.replaceChildren(...$guests);

  return $ul;
}

// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Party Planner</h1>
    <main>
      <section>
        <h2>Upcoming Parties</h2>
        <PartyList></PartyList>
      </section>
      <section id="selected">
        <h2>Party Details</h2>
        <SelectedParty></SelectedParty>
            
      <section id="Add-New-Party"></section>
        <h2>Add New Party</h2>
          <form>
            <label for="guestName">Name:</label><br>
            <input id="guestName" placeholder="Name" />
            <label for="partyDescription">Description:</label><br>
            <input id="partyDescription" placeholder="Description" />
            <label for="partyDate">Date:</label><br>
            <input id="partyDate" placeholder="Date" />
            <label for="partyLocation">Location:</label><br>
            <input id="partyLocation" placeholder="Location" />
            <button>Add Party</button>
          </form>


      </section>
    </main>
  `;



  $app.querySelector("PartyList").replaceWith(PartyList());
  $app.querySelector("SelectedParty").replaceWith(SelectedParty());
}

async function init() {
  await getParties();
  await getRsvps();
  await getGuests();
  render();
}

init();
