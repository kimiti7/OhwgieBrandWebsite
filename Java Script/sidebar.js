/* ==========================================================================
   OFFREEK SOCIETY - SIDEBAR & CONTACT POPOUT INTERACTION
   ========================================================================== */

// 1. Main Sidebar Drawer Toggle Functions
function toggleSideMenu() {
    const drawer = document.getElementById('sideDrawer');
    const overlay = document.getElementById('drawerOverlay');
    
    if (drawer && overlay) {
        drawer.classList.toggle('expanded');
        overlay.classList.toggle('active');
    }
}

function openSideMenu() {
    const drawer = document.getElementById('sideDrawer');
    const overlay = document.getElementById('drawerOverlay');
    
    if (drawer && overlay) {
        drawer.classList.add('expanded');
        overlay.classList.add('active');
    }
}

function closeSideMenu() {
    const drawer = document.getElementById('sideDrawer');
    const overlay = document.getElementById('drawerOverlay');
    
    if (drawer && overlay) {
        drawer.classList.remove('expanded');
        overlay.classList.remove('active');
    }
}

// 2. Quick Contact Popout Sub-Menu Toggle
function toggleContactPopout(event) {
    // Prevent the click event from bubbling up to document listener
    event.stopPropagation();
    
    const wrapper = event.currentTarget;
    if (wrapper) {
        wrapper.classList.toggle('active');
    }
}

// 3. Global click listener to close popout card when clicking anywhere outside
document.addEventListener('click', function (e) {
    const wrapper = document.querySelector('.contact-popout-wrapper');
    if (wrapper && !wrapper.contains(e.target)) {
        wrapper.classList.remove('active');
    }
});/* ==========================================================================
   OFFREEK SOCIETY - SIDEBAR & CONTACT POPOUT INTERACTION
   ========================================================================== */

// 1. Main Sidebar Drawer Toggle Functions
function toggleSideMenu() {
    const drawer = document.getElementById('sideDrawer');
    const overlay = document.getElementById('drawerOverlay');
    
    if (drawer && overlay) {
        drawer.classList.toggle('expanded');
        overlay.classList.toggle('active');
    }
}

function openSideMenu() {
    const drawer = document.getElementById('sideDrawer');
    const overlay = document.getElementById('drawerOverlay');
    
    if (drawer && overlay) {
        drawer.classList.add('expanded');
        overlay.classList.add('active');
    }
}

function closeSideMenu() {
    const drawer = document.getElementById('sideDrawer');
    const overlay = document.getElementById('drawerOverlay');
    
    if (drawer && overlay) {
        drawer.classList.remove('expanded');
        overlay.classList.remove('active');
    }
}

// 2. Quick Contact Popout Sub-Menu Toggle
function toggleContactPopout(event) {
    // Prevent the click event from bubbling up to document listener
    event.stopPropagation();
    
    const wrapper = event.currentTarget;
    if (wrapper) {
        wrapper.classList.toggle('active');
    }
}

// 3. Global click listener to close popout card when clicking anywhere outside
document.addEventListener('click', function (e) {
    const wrapper = document.querySelector('.contact-popout-wrapper');
    if (wrapper && !wrapper.contains(e.target)) {
        wrapper.classList.remove('active');
    }
});