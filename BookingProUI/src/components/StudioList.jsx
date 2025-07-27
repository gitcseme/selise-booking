import { useEffect, useState } from "react";
import axios from "../api/axios-config";
import Modal from "./ModalPopup";

export default function StudioList() {
  const [studios, setStudios] = useState([]);
  const [filteredStudios, setFilteredStudios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [selectedStudioId, setSelectedStudioId] = useState(null);
	const [bookingDate, setBookingDate] = useState("");
	
	// ToDO: call availale slots API
	// Select time slot from the available slots
	// Finally book the studio
	const handleDateChange = (e) => {
		setBookingDate(e.target.value);

	};

  const [isOpen, setIsOpen] = useState(false);

  const fetchStudios = async () => {
    try {
      const response = await axios.get("/studios");
      setStudios(response.data);
      setFilteredStudios(response.data);
    } catch (error) {
      console.error("Error fetching studios:", error);
    }
  };

  const searchStudiosByArea = async (area) => {
    try {
      const response = await axios.get(
        `/studios/search?area=${encodeURIComponent(area)}`
      );
      setFilteredStudios(response.data);
    } catch (error) {
      console.error("Error searching studios:", error);
    }
  };

  const getAreaSuggestions = async (searchValue) => {
    if (searchValue.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    // Extract unique areas from all studios for suggestions
    const uniqueAreas = [
      ...new Set(studios.map((studio) => studio.location.area)),
    ];
    const filteredAreas = uniqueAreas.filter((area) =>
      area.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSuggestions(filteredAreas);
  };

  useEffect(() => {
    fetchStudios();
  }, []);

  useEffect(() => {
    getAreaSuggestions(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(true);

    if (value.trim() === "") {
      setFilteredStudios(studios);
    }
  };

  const handleSuggestionClick = (area) => {
    setSearchTerm(area);
    setShowSuggestions(false);
    searchStudiosByArea(area);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchStudiosByArea(searchTerm);
    } else {
      setFilteredStudios(studios);
    }
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredStudios(studios);
    setShowSuggestions(false);
  };

  const openModal = (studioId) => {
    setSelectedStudioId(studioId);
    setIsOpen(true);
    console.log(`Booking studio with ID: ${studioId}`);
  };

  const handleBookNow = () => {
		if (!bookingDate) {
			alert("Please select a booking date.");
			return;
		}

		// Here you would typically send the booking request to your backend
		console.log(`Booking studio ID: ${selectedStudioId} on ${bookingDate}`);
		setIsOpen(false);
		setBookingDate("");
	};

  return (
    <div>
      <h1>Studio List</h1>

      {/* Search Bar */}
      <div style={{ marginBottom: "20px", position: "relative" }}>
        <form
          onSubmit={handleSearchSubmit}
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              placeholder="Search by area..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
              }}
            />

            {/* Auto-complete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "gray",
                  border: "1px solid #ddd",
                  borderTop: "none",
                  borderRadius: "0 0 4px 4px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  zIndex: 1000,
                }}
              >
                {suggestions.map((area, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(area)}
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderBottom:
                        index < suggestions.length - 1
                          ? "1px solid #eee"
                          : "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#080392ff")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "white")
                    }
                  >
                    {area}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Search
          </button>

          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              style={{
                backgroundColor: "#6c757d",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          )}
        </form>
      </div>

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#8aeb56ff" }}>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "left",
              }}
            >
              Name
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "left",
              }}
            >
              Type
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "left",
              }}
            >
              Location
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "left",
              }}
            >
              Amenities
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "left",
              }}
            >
              Price per Hour
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "left",
              }}
            >
              Rating
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "center",
              }}
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredStudios.map((studio) => (
            <tr key={studio.id}>
              <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                {studio.name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                {studio.type}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                {studio.location.area}, {studio.location.city}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                {studio.amenities.split(",").join(", ")}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                {studio.pricePerHour} {studio.currency}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                {"★".repeat(studio.rating)}
                {"☆".repeat(5 - studio.rating)} ({studio.rating}/5)
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() => openModal(studio.id)}
                  style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Book Now
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredStudios.length === 0 && searchTerm && (
        <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
          No studios found for "{searchTerm}"
        </div>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Booking Confirmation</h2>

        <input
          type="date"
          name="bookingDate"
          id="bookingDate"
          value={bookingDate}
          onChange={handleDateChange}
        />

        <button
          onClick={() => {
            handleBookNow();
            setIsOpen(false);
          }}
        >
          Confirm
        </button>
        <button onClick={() => setIsOpen(false)}>Cancel</button>
      </Modal>
    </div>
  );
}
