document.addEventListener('DOMContentLoaded', function() {
    const sky = document.querySelector('#mainSky');
    const browserMenu = document.querySelector('#browserMenu');
    const vrMenu = document.querySelector('#vrMenu');
    const menuItems = document.querySelectorAll('.menu-item, #browserMenu a');
    const vrMenuItems = document.querySelectorAll('.menu-item');
    let intersectedItem = null;  // To store the cylinder currently intersected by the ray

    // Function to change the panorama image
    const updateActiveState = target => {
        const vrPlanes = document.querySelectorAll('.menu-item');
        vrPlanes.forEach(plane => {
            if (plane.getAttribute('data-target') === target) {
                plane.setAttribute('color', '#2598e6'); // Active background color
                plane.setAttribute('text', 'color', 'black'); // Active text color
                plane.setAttribute('text', 'opacity', '1'); // Active text opacity
            } else {
                plane.setAttribute('color', '#363636'); // Non-active background color
                plane.setAttribute('text', 'color', 'white'); // Non-active text color
                plane.setAttribute('text', 'opacity', '0.5'); // Non-active text opacity
            }
        });
    };
    
    const changePanorama = function(event) {
        event.preventDefault();
    
        const target = this.getAttribute('data-target');
        sky.setAttribute('src', `assets/images/${target}.jpg`);
    
        // Update the active class for the browser menu items
        const browserLinks = document.querySelectorAll('#browserMenu a');
        browserLinks.forEach(link => {
            link.classList.remove('active'); // Remove active class from all links
        });
        this.classList.add('active'); // Add active class to the clicked link
    
        updateActiveState(target); // Call the new function here
    };

    // Attach event listeners to each browser menu item
    menuItems.forEach(item => {
        item.addEventListener('click', changePanorama);
    });

    // Detect when the ray intersects a VR menu item
    vrMenuItems.forEach(item => {
        item.addEventListener('raycaster-intersected', function(event) {
            if (event.detail.el.hasAttribute('oculus-touch-controls')) {
                intersectedItem = item;
        
                // Hover effect (only applied if item is not active)
                if (item.getAttribute('color') !== '#2598e6') {
                    item.setAttribute('color', '#555555');  // Darken the color a bit on hover
                }
            }
        });
        item.addEventListener('raycaster-intersected-cleared', function() {
            intersectedItem = null;
        
            // Reset hover effect (only if item is not active)
            if (item.getAttribute('color') !== '#2598e6') {
                item.setAttribute('color', '#363636');
            }
        });
    });
    // Detect the trigger button press
    const controllers = document.querySelectorAll('[oculus-touch-controls]');
    controllers.forEach(controller => {
        controller.addEventListener('triggerdown', function() {
            if (intersectedItem) {
                intersectedItem.emit('click');
            }
        });
    });
    // Detect the grip button press to toggle VR menu
    controllers.forEach(controller => {
        controller.addEventListener('gripdown', function() {
            let menuVisibility = vrMenu.getAttribute('visible');
            vrMenu.setAttribute('visible', !menuVisibility);
        });
    });
    // Rotation variables
    let rotationSpeed = 1; // Adjust this for faster or slower rotations

    // Detect the thumbstick's movement to rotate
    controllers.forEach(controller => {
        controller.addEventListener('thumbstickmoved', function(event) {
            let cameraRig = document.querySelector("#cameraRig");
            let currentRotation = cameraRig.getAttribute("rotation");
            
            // Thumbstick left or right
            if (event.detail.x > 0.5) {
                // Rotate to the right
                cameraRig.setAttribute("rotation", { y: currentRotation.y - rotationSpeed });
            } else if (event.detail.x < -0.5) {
                // Rotate to the left
                cameraRig.setAttribute("rotation", { y: currentRotation.y + rotationSpeed });
            }
        });
    });


    // Switch between menus based on VR mode
    const scene = document.querySelector('a-scene');
    scene.addEventListener('enter-vr', function() {
        browserMenu.style.display = 'none';
        vrMenu.setAttribute('visible', 'true');
    });

    scene.addEventListener('exit-vr', function() {
        browserMenu.style.display = 'block';
        vrMenu.setAttribute('visible', 'false');
    });
});

