// i want to: have a default image, it only loads if the localstorage image-base64 is empty,
// a discreet select image button(a dropdown) that allows one to pick an image from their file system to set
// or set it back to the default
const STORAGE_KEY = "backgroundImage";

export function initializeDropdown() {
  const resetOption = document.getElementById("resetOption");
  const selectOption = document.getElementById("selectOption");
  const imageInput = document.getElementById("image_uploads");

  resetOption.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default anchor action (page reload)

    // Call the reset function
    resetBackgroundImage();
  });

  selectOption.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default action
    imageInput.click(); // Trigger the file input click
  });

  imageInput.addEventListener("change", function(event) {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      setBackgroundImage(file);
    }
  });
}

function resetBackgroundImage() {
  if (confirm("Are you sure you want to reset to default?")){
    localStorage.removeItem(STORAGE_KEY);
    loadBackgroundImage();
  }
}
/**
 * "url(../images/default_background.jpg)" -> normal relative path for opening from filesystem
 * or on infinityfree.com
 * 
 * for GitHub we need a relative path with as root the base-url of my github domain:
 * "url(/RemindersApp/images/default_background.jpg)"
 */
export function loadBackgroundImage() {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (!stored){
    document.getElementsByTagName("body")[0]
    .style.backgroundImage = "url(/RemindersApp/images/default_background.jpg)"; //default_background
  }
  else {
    document.getElementsByTagName("body")[0]
    .style.backgroundImage = `url(${stored.data})`;
  }
}

// Function to set the background image from the selected file
function setBackgroundImage(file) {
  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  const reader = new FileReader();

  reader.onloadend = function() {
    // Save the base64 image and the current date in localStorage
    const base64Data = reader.result;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      data: base64Data,
      date: today
    }));
    // Set the background image to the selected file's data URL
    document.body.style.backgroundImage = `url(${base64Data})`;
    console.log("Background image set successfully!");
  };

  // Read the image file as a data URL
  reader.readAsDataURL(file);
}

/**
 * Test function with "toBase64Test.jpg"
 * to store an image from this project file-system to localstorage
 */
export function testBackgroundImage() {
  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  const imgSrc = "../images/toBase64Test.jpg"; // Path to your image

  // Fetch the image as a Blob
  fetch(imgSrc)
    .then(response => response.blob())  // Convert the response to a Blob
    .then(blob => {
      const reader = new FileReader();

      // fires off when the Blob is loaded
      reader.onloadend = function() {
        console.log('image loaded and converted to base64');

        // Save the base64 image and the current date in localStorage
        const base64Data = reader.result;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          data: base64Data,
          date: today
        }));

        // Set the background image to the base64-encoded string
        document.body.style.backgroundImage = `url(${base64Data})`;
      };

      // Convert the Blob to a base64-encoded string
      reader.readAsDataURL(blob);
    })
    .catch(err => {
      console.error('Failed to fetch image:', err);
    });
}

// init = () => {
//   initializeDropdown();
//   loadBackgroundImage();
//   // testBackgroundImage()
// }

// window.onload = init;