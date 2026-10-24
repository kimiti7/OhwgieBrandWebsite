/* ==========================================================================
   OFFREEK SOCIETY - SIDEBAR & CONTACT POPOUT SCRIPT
   ========================================================================== */

// 1. Toggle Sidebar Collapse/Expand State
function toggleSideMenu() {
    const drawer = document.getElementById('sideDrawer');
    const overlay = document.getElementById('drawerOverlay');
    
    if (drawer && overlay) {
        drawer.classList.toggle('expanded');
        overlay.classList.toggle('active');
    }
}

// 2. Open Sidebar (Triggered by "View Our Menu" CTA button)
function openSideMenu() {
    const drawer = document.getElementById('sideDrawer');
    const overlay = document.getElementById('drawerOverlay');
    
    if (drawer && overlay) {
        drawer.classList.add('expanded');
        overlay.classList.add('active');
    }
}

// 3. Toggle Contact Quick-Connect Popout Card
function toggleContactPopout(event) {
    event.stopPropagation();
    const wrapper = event.currentTarget;
    if (wrapper) {
        wrapper.classList.toggle('active');
    }
}

// 4. Close Contact Popout when clicking anywhere outside
document.addEventListener('click', function (e) {
    const wrapper = document.querySelector('.contact-popout-wrapper');
    if (wrapper && !wrapper.contains(e.target)) {
        wrapper.classList.remove('active');
    }
});