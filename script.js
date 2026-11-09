
// =====================================
// 1. HOTEL ROOM DATA
// =====================================

const rooms = [
    {
        id: 1,
        name: "Deluxe Double Room",
        type: "Deluxe",
        price: 12000,
        capacity: 2,
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
        description: "Beautiful room with comfortable king-size bed and modern interior."
    },
    {
        id: 2,
        name: "Luxury Suite",
        type: "Suite",
        price: 20000,
        capacity: 3,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
        description: "Premium suite with elegant decoration and beautiful views."
    },
    {
        id: 3,
        name: "Standard Room",
        type: "Standard",
        price: 8000,
        capacity: 2,
        image: "https://images.unsplash.com/photo-1611892440504-47a792e24d32?w=800",
        description: "Affordable and comfortable room for a relaxing stay."
    },
    {
        id: 4,
        name: "Family Room",
        type: "Family",
        price: 18000,
        capacity: 5,
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
        description: "Spacious family room with comfortable beds and facilities."
    },
    {
        id: 5,
        name: "Premium Deluxe",
        type: "Deluxe",
        price: 15000,
        capacity: 3,
        image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
        description: "Stylish deluxe room with premium furniture and amenities."
    },
    {
        id: 6,
        name: "Presidential Suite",
        type: "Suite",
        price: 30000,
        capacity: 4,
        image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
        description: "An exclusive suite designed for a luxury experience."
    }
];

// =====================================
// 2. VARIABLES
// =====================================

let selectedRoom = null;
let selectedCheckin = "";
let selectedCheckout = "";
let selectedGuests = 2;
let currentFilter = "All";

let bookings = JSON.parse(
    localStorage.getItem("grandStayBookings")
) || [];

const roomsContainer = document.getElementById("roomsContainer");

const bookingModal = document.getElementById("bookingModal");

const myBookingsModal = document.getElementById("myBookingsModal");


// =====================================
// 3. SET MINIMUM DATE
// =====================================

const today = new Date();
const todayString = today.toISOString().split("T")[0];

document.getElementById("checkin").min = todayString;
document.getElementById("checkout").min = todayString;


// =====================================
// 4. DISPLAY ROOMS
// =====================================

function displayRooms(roomList = rooms) {

    roomsContainer.innerHTML = "";

    if (roomList.length === 0) {
        roomsContainer.innerHTML =
            "<p>No rooms found for selected guests.</p>";
        return;
    }

    roomList.forEach(room => {

        const card = document.createElement("div");

        card.className = "room-card";

        card.innerHTML = `
            <img src="${room.image}" alt="${room.name}">

            <div class="room-details">

                <span class="room-type">${room.type}</span>

                <h3>${room.name}</h3>

                <p>${room.description}</p>

                <p>Maximum Guests: ${room.capacity}</p>

                <div class="room-bottom">

                    <div class="price">
                        Rs. ${room.price.toLocaleString("en-PK")}
                        <small>/ Night</small>
                    </div>

                    <button class="book-btn"
                        onclick="openBooking(${room.id})">
                        Book Now
                    </button>

                </div>
            </div>
        `;

        roomsContainer.appendChild(card);
    });
}


// =====================================
// 5. FILTER ROOMS
// =====================================

function filterRooms(type, button) {

    currentFilter = type;

    document.querySelectorAll(".filter").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    let filteredRooms = type === "All"
        ? rooms
        : rooms.filter(room => room.type === type);

    displayRooms(filteredRooms);
}


// =====================================
// 6. SEARCH ROOMS
// =====================================

function searchRooms() {

    const checkin = document.getElementById("checkin").value;

    const checkout = document.getElementById("checkout").value;

    const guests = Number(document.getElementById("guests").value);

    const message = document.getElementById("searchMessage");

    if (!checkin || !checkout) {
        message.textContent = "Please select check-in and check-out dates.";
        message.style.color = "red";
        return;
    }

    const start = new Date(checkin + "T00:00:00");

    const end = new Date(checkout + "T00:00:00");

    const todayDate = new Date(todayString + "T00:00:00");

    if (start < todayDate) {
        message.textContent = "Check-in date cannot be in the past.";
        message.style.color = "red";
        return;
    }

    if (end <= start) {
        message.textContent = "Check-out must be after check-in.";
        message.style.color = "red";
        return;
    }

    selectedCheckin = checkin;
    selectedCheckout = checkout;
    selectedGuests = guests;

    const filteredRooms = rooms.filter(room =>
        room.capacity >= guests &&
        (currentFilter === "All" || room.type === currentFilter)
    );

    displayRooms(filteredRooms);

    message.style.color = "#16834a";

    message.textContent =
        filteredRooms.length + " suitable room(s) found!";

    document.getElementById("rooms").scrollIntoView({
        behavior: "smooth"
    });
}


// =====================================
// 7. CALCULATE NIGHTS
// =====================================

function calculateNights() {

    const start = new Date(selectedCheckin + "T00:00:00");

    const end = new Date(selectedCheckout + "T00:00:00");

    return Math.round((end - start) / (1000 * 60 * 60 * 24));
}


// =====================================
// 8. OPEN BOOKING FORM
// =====================================

function openBooking(roomId) {

    selectedRoom = rooms.find(room => room.id === roomId);

    const checkin = document.getElementById("checkin").value;

    const checkout = document.getElementById("checkout").value;

    if (!checkin || !checkout) {
        alert("Please select check-in and check-out dates first.");
        document.getElementById("checkin").focus();
        return;
    }

    if (
        new Date(checkin + "T00:00:00") <
        new Date(todayString + "T00:00:00")
    ) {
        alert("Please select a valid check-in date.");
        return;
    }

    if (new Date(checkout + "T00:00:00") <=
        new Date(checkin + "T00:00:00")) {
        alert("Check-out date must be after check-in.");
        return;
    }

    selectedCheckin = checkin;
    selectedCheckout = checkout;

    selectedGuests = Number(document.getElementById("guests").value);

    if (selectedRoom.capacity < selectedGuests) {
        alert("This room cannot accommodate the selected guests.");
        return;
    }

    const nights = calculateNights();

    const total = selectedRoom.price * nights;

    document.getElementById("selectedRoom").textContent =
        "Selected Room: " + selectedRoom.name;

    document.getElementById("bookingInfo").innerHTML = `
        <strong>Check-in:</strong> ${selectedCheckin}<br>
        <strong>Check-out:</strong> ${selectedCheckout}<br>
        <strong>Guests:</strong> ${selectedGuests}<br>
        <strong>Nights:</strong> ${nights}<br>
        <strong>Price per Night:</strong> Rs. ${selectedRoom.price.toLocaleString("en-PK")}<br>
        <strong>Total Amount:</strong> Rs. ${total.toLocaleString("en-PK")}
    `;

    document.getElementById("bookingForm").reset();

    bookingModal.style.display = "flex";
}


// =====================================
// 9. CLOSE BOOKING MODAL
// =====================================

function closeBooking() {
    bookingModal.style.display = "none";
}


// =====================================
// 10. CONFIRM BOOKING
// =====================================

document.getElementById("bookingForm").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const name = document.getElementById("customerName").value.trim();

        const email = document.getElementById("customerEmail").value.trim();

        const phone = document.getElementById("customerPhone").value.trim();

        const address = document.getElementById("customerAddress").value.trim();

        if (!name || !email || !phone || !address) {
            alert("Please complete all customer details.");
            return;
        }

        const nights = calculateNights();

        const total = selectedRoom.price * nights;

        const booking = {

            id: "GS" + Date.now(),

            customer: name,

            email: email,

            phone: phone,

            address: address,

            room: selectedRoom.name,

            roomType: selectedRoom.type,

            guests: selectedGuests,

            checkin: selectedCheckin,

            checkout: selectedCheckout,

            nights: nights,

            total: total,

            status: "Confirmed"
        };

        bookings.push(booking);

        saveBookings();

        closeBooking();

        alert(
            "Booking Confirmed Successfully!\n\n" +
            "Booking ID: " + booking.id +
            "\nCustomer: " + name +
            "\nRoom: " + booking.room +
            "\nTotal: Rs. " + total.toLocaleString("en-PK")
        );

        this.reset();
    }
);


// =====================================
// 11. SAVE BOOKINGS IN LOCAL STORAGE
// =====================================

function saveBookings() {

    localStorage.setItem(
        "grandStayBookings",
        JSON.stringify(bookings)
    );
}


// =====================================
// 12. SHOW MY BOOKINGS
// =====================================

function showBookings() {

    const list = document.getElementById("bookingsList");

    list.innerHTML = "";

    if (bookings.length === 0) {

        list.innerHTML = "<p>No bookings found yet.</p>";

    } else {

        bookings.forEach(booking => {

            const item = document.createElement("div");

            item.className = "booking-item";

            item.innerHTML = `
                <h3>${booking.room}</h3>

                <p><strong>Booking ID:</strong> ${booking.id}</p>

                <p><strong>Customer:</strong> ${booking.customer}</p>

                <p><strong>Email:</strong> ${booking.email}</p>

                <p><strong>Check-in:</strong> ${booking.checkin}</p>

                <p><strong>Check-out:</strong> ${booking.checkout}</p>

                <p><strong>Guests:</strong> ${booking.guests}</p>

                <p><strong>Total:</strong> Rs. ${booking.total.toLocaleString("en-PK")}</p>

                <p><strong>Status:</strong> ${booking.status}</p>

                ${booking.status === "Confirmed" ? `
                    <button class="cancel-btn"
                        onclick="cancelBooking('${booking.id}')">
                        Cancel Booking
                    </button>
                ` : ""}
            `;

            list.appendChild(item);
        });
    }

    myBookingsModal.style.display = "flex";
}


// =====================================
// 13. HIDE BOOKINGS
// =====================================

function hideBookings() {
    myBookingsModal.style.display = "none";
}


// =====================================
// 14. CANCEL BOOKING
// =====================================

function cancelBooking(id) {

    const confirmCancel = confirm(
        "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    bookings = bookings.map(booking => {

        if (booking.id === id) {
            return {
                ...booking,
                status: "Cancelled"
            };
        }

        return booking;
    });

    saveBookings();

    showBookings();

    alert("Booking cancelled successfully!");
}


// =====================================
// 15. MODAL CLOSE ON OUTSIDE CLICK
// =====================================

window.addEventListener("click", function(event) {

    if (event.target === bookingModal) {
        closeBooking();
    }

    if (event.target === myBookingsModal) {
        hideBookings();
    }

});


// =====================================
// 16. INITIALIZE WEBSITE
// =====================================

displayRooms();
